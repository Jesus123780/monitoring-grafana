// panelActions.ts

import { type Page } from 'puppeteer'

export async function performPanelActions (page: Page): Promise<void> {
  const panelHeader = await page.waitForSelector('.css-1ijfwvk-panel-container') as any

  // Realizar hover sobre el elemento
  await panelHeader.hover()

  const panelMenuButton = await page.waitForSelector('button[data-testid="data-testid Panel menu Tokenbox"]') as any

  // Hacer clic en el botón del menú
  await panelMenuButton.click()

  const viewButton = await page.waitForSelector('button[data-testid="data-testid Panel menu item View"]') as any

  // Hacer clic en el botón "View"
  await viewButton.click()

  // Espera a que el botón esté disponible en la página
  await page.waitForSelector('.css-1jq19ai')

  // Haz clic en el botón
  await page.click('.css-1jq19ai')

  // escribe el filtro
  await page.waitForSelector('.css-8tk2dk-input-input')

  // Escribe "1 hour" en el campo de entrada
  const timeQuery = '1 hour'
  await page.type('.css-8tk2dk-input-input', timeQuery)

  await page.waitForSelector('.css-13htr8w')

  // Haz clic en el botón
  await page.click('.css-13htr8w')

  // await page.waitForSelector('.css-17w0old')

  await new Promise(resolve => setTimeout(resolve, 5000)) // Espera 5 segundos (ajusta el tiempo según sea necesario)
  // await page.$$eval('.css-17w0old', elements => {
  //   // Mapear los elementos y devolver sus estilos left y border-bottom-color
  //   return elements.map((element: any) => {
  //     return {
  //       left: element.style.left,
  //       borderBottomColor: element.style.borderBottomColor
  //     }
  //   })
  // })
}
