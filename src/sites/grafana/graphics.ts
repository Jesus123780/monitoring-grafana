import { Page, ElementHandle } from 'puppeteer'

export class GrafanaScrapingGraphics {
  private readonly page: Page | null = null

  constructor(page: Page | null = null) {
    this.page = page  }

  async scrape(GRAPHICS: string[], key: string): Promise<any[]> {
    try {
      if (!this.page) throw new Error('No se ha iniciado una página.')
        for await (const titulo of GRAPHICS) {
          // Utilizar waitForSelector para esperar la presencia del elemento <h6> con el título especificado
          await this.page.waitForSelector(`.${key}`);
          const divs = await this.page.waitForSelector(`.css-17w0old`);
 console.log(divs)
          console.log(`Elemento <h6> con título "${titulo}" encontrado.`);
        }
      const results: any[] = []
    

      return results
    } catch (error) {
      console.error('Error al hacer scraping:', error)
      return []
    }
  }


  private async getTextFromElement(element: ElementHandle): Promise<string> {
    // Aquí puedes implementar la lógica para obtener el texto del elemento
    // Por ejemplo, puedes usar el método `innerText` o `textContent` del elemento
    // Este es solo un ejemplo básico, puedes adaptarlo según tus necesidades
    // @ts-ignore
    const text = await this.page.evaluate(el => el.textContent.trim(), element)
    return text
  }
  public async capturarPantalla(nombreArchivo: string) {
    if (!this.page) throw new Error('No se ha iniciado una página.');
  
    // Esperar a que exista el elemento del botón
    await this.page.waitForSelector('button[data-testid="data-testid dashboard-row-title-Transacciones"]');
  
    // Tomar la captura de pantalla después de que el botón esté presente
    await this.page.screenshot({ path: nombreArchivo });
  }
  
}
