/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type Page } from 'puppeteer'
import { getReports, saveReport } from '../../resolvers/save_report'
import { client } from '../../../whatsappClient'
import LastErrorModel, { type LastErrorAttributes } from '../../models/lastError'
import { MessageMedia } from 'whatsapp-web.js'
import path from 'path'
import sound from 'sound-play'
import { performPanelActions } from './helpers'
import { parseStatusText } from './helpers/parseStatusText.helpers'
const audioFile: string = '../.././../notification.mp3'

interface Chat {
  id: {
    _serialized: string
  }
  name: string
  isGroup: boolean
}

export class GrafanaScrapingGraphics {
  private readonly page: Page | null = null
  constructor (page: Page | null = null) {
    this.page = page
  }

  async scrape (GRAPHICS: string[], key: string): Promise<any[]> {
    try {
      if (this.page === null) throw new Error('No se ha iniciado una página.')

      for await (const titulo of GRAPHICS) {
        // Utilizar waitForSelector para esperar la presencia del elemento <h6> con el título especificado
        const namegrap = await this.page.waitForSelector(`.${key}`) as any

        const box = await namegrap.boundingBox()
        console.log(`Elemento <h6> con título "${titulo}" encontrado.`)
        if (box !== null) {
          await performPanelActions(this.page)
          const lineAlert = await this.page.$$('.css-17w0old')
          const statusReports = []
          if (lineAlert.length > 0) {
            // Hacer clic en todos los elementos encontrados
            for (const element of lineAlert) {
              await element.click()
              await this.page.waitForSelector('.css-1bgzxxo .css-1yv1b4t')
              const statusText = await this.page.$eval('.css-1bgzxxo .css-1yv1b4t', (element: any) => element.textContent.trim())
              console.log('🚀 ~ GrafanaScrapingGraphics ~ forawait ~ statusText:', statusText)
              // Realizar el parsing del texto y guardar los reportes
              const { date, type } = parseStatusText(statusText as string)
              statusReports.push({
                date,
                type,
                reported: false
              })
            }
            // Comprobar si hay nuevos reportes no reportados
            const allReports = await getReports()
            const oldReport = allReports.map((e: any) => {
              return {
                date: e.dataValues.date,
                reported: e.dataValues.reported,
                type: e.dataValues.type
              }
            })
            console.log({ TODAY_SAVED_REPORT: oldReport })
            console.log({ IN_GRAPHICS: statusReports.length })

            const newReports = statusReports.filter((report) => {
              // Buscar si el reporte actual ya está presente en la base de datos
              const existingReport = oldReport.find((element: any) => {
                return element.date === report.date && element.type === report.type
              })

              // Si no se encuentra el reporte actual, se considera como un nuevo reporte
              return existingReport === undefined || existingReport === null
            })
            console.log({ NEWS_REPORTS: newReports.length })

            if (newReports.length > 0) {
              async function saveAllReports (reports: Array<{ date: string, type: string, reported: boolean }>): Promise<void> {
                const promises: Array<Promise<void>> = reports.map(async (report) => {
                  const { date, type, reported } = report
                  await saveReport(type, date, reported)
                })

                await Promise.all(promises)
              }
              await saveAllReports(newReports)
              const findError = newReports.find((report) => {
                // Obtener la fecha actual
                const now: Date = new Date()

                // Obtener la fecha del reporte
                const reportDate: Date = new Date(report.date)

                // Calcular la diferencia en minutos entre la fecha actual y la fecha del reporte
                const diffMinutes: number = Math.abs(now.getTime() - reportDate.getTime()) / 60000 // 60000 milisegundos = 1 minuto

                // Verificar si la diferencia está dentro de los últimos 5 minutos
                return diffMinutes <= 15 && report.type === 'ALERTING'
              })
              console.log({ new_error: Boolean(findError) })

              // Instancia de PlaySound

              // Ruta al archivo de audio

              if (findError != null) {
                // sound notification
                const filePath = path.join(__dirname, audioFile)
                await sound.play(filePath)

                const imageName = `grafica_${titulo}.png`
                // Esperar a que el elemento deseado esté presente en la página
                await this.page.waitForSelector('.css-1978mzo-canvas-content')

                // Obtener el cuadro del elemento deseado
                const elemento = await this.page.$('.css-1978mzo-canvas-content')
                if (elemento !== null) {
                  const dimensions = await elemento.boundingBox()

                  await this.getScreenGraphics(imageName, dimensions)
                }
                // eslint-disable-next-line
                const tel = process.env.NODE_PHONE!
                // eslint-disable-next-line
                const groupName = process.env.NODE_GROUP_WS!
                // eslint-disable-next-line
                const chat_id = tel.substring(1) + '@c.us'
                // eslint-disable-next-line
                const number_detail = await client.getNumberId(chat_id)
                // eslint-disable-next-line
                if (number_detail) {
                  const chats: Chat[] = await client.getChats() // Assuming Chat is the correct type
                  const groups: Array<{ id: string, name: string }> = chats
                    .filter((chat: Chat) => chat.isGroup && chat.name === groupName)
                    .map((chat: Chat) => {
                      return {
                        id: chat.id._serialized,
                        name: chat.name
                      }
                    })

                  console.log({ groups })

                  const message: string = formatMessage()
                  // enviar a mi numero de celular
                  const media = MessageMedia.fromFilePath(imageName)
                  await client.sendMessage(chat_id, media, { caption: message })
                  // buscar todos los grupos de WhatsApp
                  for (const group of groups) {
                    await client.sendMessage(group.id, media, { caption: message })
                    const lastError: LastErrorAttributes = {
                      type: 'ALERTING', // Supongamos que el tipo es siempre 'ALERTING'
                      date: new Date().toISOString(), // La fecha actual
                      reported: true // Indicando que se ha reportado
                    }
                    // Buscar el último error registrado
                    const existingError = await LastErrorModel.findOne({ order: [['createdAt', 'DESC']] })

                    // Si no hay ningún error existente, insertar uno nuevo
                    if (existingError === null) {
                      await LastErrorModel.create(lastError)
                    } else {
                      // Actualizar el error existente con la nueva información
                      await existingError.update(lastError)
                    }
                  }
                }
              }
            } else {
              console.log('No hay nuevos reportes por agregar.')
            }
          } else {
            console.log('No se encontraron elementos con la clase especificada.')
          }
        }
      }

      return []
    } catch (error) {
      console.error('Error al hacer scraping:', error)
      return []
    }
  }

  public async capturarPantalla (nombreArchivo: string): Promise<void> {
    if (this.page === null) throw new Error('No se ha iniciado una página.')

    // Extender la espera antes de tomar la captura de pantalla
    await new Promise(resolve => setTimeout(resolve, 5000)) // Espera 5 segundos (ajusta el tiempo según sea necesario)

    // Esperar a que exista el elemento del botón
    await this.page.waitForSelector('button[data-testid="data-testid dashboard-row-title-Transacciones"]')

    // Tomar la captura de pantalla después de que el botón esté presente
    await this.page.screenshot({ path: nombreArchivo })
  }

  async getScreenGraphics (nombreArchivo: string, dimensions: any): Promise<Buffer> {
    if (this.page === null) throw new Error('No se ha iniciado una página.')

    return await this.page.screenshot({
      path: nombreArchivo,
      clip: {
        x: dimensions.x - 100, // Ajusta el valor de x para capturar más a la izquierda
        y: dimensions.y - 100, // Ajusta el valor de y para capturar más arriba
        width: dimensions.width + 200, // Aumenta el ancho para capturar más a la derecha
        height: dimensions.height + 200 // Aumenta la altura para capturar más abajo
      }
    })
  }
}

function formatMessage (): string {
  const currentTime = new Date()
  const currentHour = currentTime.getHours()
  let salutation = ''

  if (currentHour >= 5 && currentHour < 12) {
    salutation = 'Hola, Buenos días'
  } else if (currentHour >= 12 && currentHour < 18) {
    salutation = 'Hola, Buenas tardes'
  } else {
    salutation = 'Hola, Buenas noches'
  }

  let message = `${salutation}, equipo\n`

  message += 'Por favor nos ayudan con unos errores. Muchas gracias, team 📈 🚀'

  return message
}
