import { Page } from 'puppeteer'
import { getReports, saveReport } from '../../resolvers/save_report'
import { client } from '../../../whatsappClient'
export class GrafanaScrapingGraphics {
  private readonly page: Page | null = null
  private sessionFile = 'whatsapp-session.json'; // Archivo para guardar la sesión de WhatsApp

  constructor(page: Page | null = null) {
    this.page = page;
  }

  async scrape(GRAPHICS: string[], key: string): Promise<any[]> {
    try {
      if (!this.page) throw new Error('No se ha iniciado una página.')

      for await (const titulo of GRAPHICS) {

        // Utilizar waitForSelector para esperar la presencia del elemento <h6> con el título especificado
        const namegrap = await this.page.waitForSelector(`.${key}`) as any;

        const box = await namegrap.boundingBox()
        console.log(`Elemento <h6> con título "${titulo}" encontrado.`)
        if (box) {

          const panelHeader = await this.page.waitForSelector('.css-1ijfwvk-panel-container') as any;

          // Realizar hover sobre el elemento
          await panelHeader.hover()
          const panelMenuButton = await this.page.waitForSelector('button[data-testid="data-testid Panel menu Tokenbox"]') as any;

          // Hacer clic en el botón del menú
          await panelMenuButton.click();

          const viewButton = await this.page.waitForSelector('button[data-testid="data-testid Panel menu item View"]') as any;

          // Hacer clic en el botón "View"
          await viewButton.click();
          // Espera a que el botón esté disponible en la página
          await this.page.waitForSelector('.css-1jq19ai');

          // Haz clic en el botón
          await this.page.click('.css-1jq19ai');
          // escribe el filtro 
          await this.page.waitForSelector('.css-8tk2dk-input-input');

          // Escribe "6" en el campo de entrada
          await this.page.type('.css-8tk2dk-input-input', '6');

          await this.page.waitForSelector('.css-13htr8w');

          // Haz clic en el botón
          await this.page.click('.css-13htr8w');


          await this.page.waitForSelector('.css-17w0old')

          await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos (ajusta el tiempo según sea necesario)
          await this.page.$$eval('.css-17w0old', elements => {
            // Mapear los elementos y devolver sus estilos left y border-bottom-color
            return elements.map((element: any) => {
              return {
                left: element.style.left,
                borderBottomColor: element.style.borderBottomColor
              };
            });
          });
          const lineAlert = await this.page.$$('.css-17w0old');
          const statusReports = []
          if (lineAlert.length > 0) {
            // Hacer clic en todos los elementos encontrados
            for (const element of lineAlert) {
              await element.click();
              await this.page.waitForSelector('.css-1bgzxxo .css-1yv1b4t');
              const statusText = await this.page.$eval('.css-1bgzxxo .css-1yv1b4t', (element: any) => element.textContent.trim());
              console.log("🚀 ~ GrafanaScrapingGraphics ~ forawait ~ statusText:", statusText)
              // Buscar la fecha en el texto usando una expresión regular
              const dateRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g;
              const dateMatch = dateRegex.exec(statusText);
              const date = dateMatch ? dateMatch[0] : '';

              // Buscar el tipo de alerta en el texto usando una expresión regular
              const typeRegex = /(ALERTING|PENDING|OK)/g;
              const typeMatch = typeRegex.exec(statusText);
              const type = typeMatch ? typeMatch[0] : '';
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
                type: e.dataValues.type,
              }
            })
            console.log({ lasgraficas: statusReports.length })
            const newReports = statusReports.filter((report) => {
              // Leer el contenido del archivo alertingElements.json si existe

              // Buscar si el reporte actual ya está presente en alertingElements
              const existingReport = oldReport.find((element: any) => {
                return element.date === report.date && element.type === report.type;
              });

              // Si no se encuentra el reporte actual, se considera como un nuevo reporte
              return !existingReport;
            });
            console.log({ new: newReports.length })
          
            if (newReports.length > 0) {
              newReports.map((report) => {
                const {
                  date,
                  type,
                  reported
                } = report
                return saveReport(
                  type,
                  date,
                  reported
                )
              })
              const findError = newReports.find((report) => {
                return report.type === 'PENDING'
              })
              if (findError) {
                const tel = '+573014548087'
                const groupName = 'Mensajitos de amor y pan'
                const chat_id = tel.substring(1) + "@c.us";
                const number_detail = await client.getNumberId(chat_id)
                if (number_detail) {
                  const chats = await client.getChats()
                  const groups = chats
                    .filter(chat => chat.isGroup && chat.name == groupName)
                    .map(chat => {
                      return {
                        id: chat.id._serialized,
                        name: chat.name
                      }
                    })
                  console.log({ groups })
                  const sms = 'HOLA PAPU'
                  await client.sendMessage(chat_id, sms)
                  for (const group of groups) {
                    await client.sendMessage(group.id, sms) 
                  }
                }
              }
            } else {
              console.log('No hay nuevos reportes por agregar.')
            }
          } else {
            console.log('No se encontraron elementos con la clase especificada.');
          }

        }
      }

      return []
    } catch (error) {
      console.error('Error al hacer scraping:', error)
      return []
    }
  }


  public async capturarPantalla(nombreArchivo: string) {
    if (!this.page) throw new Error('No se ha iniciado una página.');

    // Extender la espera antes de tomar la captura de pantalla
    await new Promise(resolve => setTimeout(resolve, 5000)); // Espera 5 segundos (ajusta el tiempo según sea necesario)


    // Esperar a que exista el elemento del botón
    await this.page.waitForSelector('button[data-testid="data-testid dashboard-row-title-Transacciones"]');

    // Tomar la captura de pantalla después de que el botón esté presente
    await this.page.screenshot({ path: nombreArchivo });
  }

}