/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type Page } from 'puppeteer'
import { getReports, saveReport } from '../../resolvers/save_report'
import { client } from '../../../whatsappClient'
import LastErrorModel, { type LastErrorAttributes } from '../../models/lastError'
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
          const panelHeader = await this.page.waitForSelector('.css-1ijfwvk-panel-container') as any

          // Realizar hover sobre el elemento
          await panelHeader.hover()

          const panelMenuButton = await this.page.waitForSelector('button[data-testid="data-testid Panel menu Tokenbox"]') as any

          // Hacer clic en el botón del menú
          await panelMenuButton.click()

          const viewButton = await this.page.waitForSelector('button[data-testid="data-testid Panel menu item View"]') as any

          // Hacer clic en el botón "View"
          await viewButton.click()

          // Espera a que el botón esté disponible en la página
          await this.page.waitForSelector('.css-1jq19ai')

          // Haz clic en el botón
          await this.page.click('.css-1jq19ai')

          // escribe el filtro
          await this.page.waitForSelector('.css-8tk2dk-input-input')

          // Escribe "6" en el campo de entrada
          const timeQuery = '6'
          await this.page.type('.css-8tk2dk-input-input', timeQuery)

          await this.page.waitForSelector('.css-13htr8w')

          // Haz clic en el botón
          await this.page.click('.css-13htr8w')

          await this.page.waitForSelector('.css-17w0old')

          await new Promise(resolve => setTimeout(resolve, 5000)) // Espera 5 segundos (ajusta el tiempo según sea necesario)
          await this.page.$$eval('.css-17w0old', elements => {
            // Mapear los elementos y devolver sus estilos left y border-bottom-color
            return elements.map((element: any) => {
              return {
                left: element.style.left,
                borderBottomColor: element.style.borderBottomColor
              }
            })
          })
          const lineAlert = await this.page.$$('.css-17w0old')
          const statusReports = []
          if (lineAlert.length > 0) {
            // Hacer clic en todos los elementos encontrados
            for (const element of lineAlert) {
              await element.click()
              await this.page.waitForSelector('.css-1bgzxxo .css-1yv1b4t')
              const statusText = await this.page.$eval('.css-1bgzxxo .css-1yv1b4t', (element: any) => element.textContent.trim())
              console.log('🚀 ~ GrafanaScrapingGraphics ~ forawait ~ statusText:', statusText)
              // Buscar la fecha en el texto usando una expresión regular
              const dateRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g
              const dateMatch = dateRegex.exec(String(statusText))
              const date = dateMatch !== null ? dateMatch[0] : ''

              // Buscar el tipo de alerta en el texto usando una expresión regular
              const typeRegex = /(ALERTING|PENDING|OK)/g
              const typeMatch = typeRegex.exec(String(statusText))
              const type = typeMatch !== null ? typeMatch[0] : ''
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
            console.log({ oldReport })
            console.log({ IN_GRAPHICS: statusReports.length })
            const newReports = statusReports.filter((report) => {
              // Buscar si el reporte actual ya está presente en la base de datos
              const existingReport = oldReport.find((element: any) => {
                return element.date === report.date && element.type === report.type
              })

              // Si no se encuentra el reporte actual, se considera como un nuevo reporte
              return existingReport === undefined || existingReport === null
            })
            console.log({ new: newReports.length })

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
                return diffMinutes <= 30 && report.type === 'ALERTING'
              })

              console.log({ findError })

              if (findError != null) {
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

                  const message: string = formatMessage(newReports)

                  await client.sendMessage(chat_id, message)

                  for (const group of groups) {
                    await client.sendMessage(group.id, message)
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
}

function formatMessage (reports: Array<{ date: string, type: string, reported: boolean }>): string {
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

  let message = `${salutation}, ha ocurrido un error:\n`
  const filterReport = reports.filter((r) => {
    return r.type === 'ALERTING'
  })
  filterReport.forEach((report, index) => {
    const { date, type } = report
    const formattedDate = formatDate(date)

    message += `- A las ${formattedDate} de tipo ${type}\n`
  })

  message += 'Por favor, nos ayudan con unos errores. Muchas gracias, team 📈 🚀'

  return message
}

function formatDate (dateString: string): string {
  const date = new Date(dateString)
  const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  return formattedTime
}
