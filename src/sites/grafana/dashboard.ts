import puppeteer, { type Browser, type Page } from 'puppeteer'
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()
export class Dashboard {
  private browser: Browser | null = null
  public page: Page | null = null

  async iniciarNavegador (): Promise<void> {
    this.browser = await puppeteer.launch({ headless: true, args: ['--start-maximized'] })
    this.page = await this.browser.newPage()
    await this.page.setViewport({ width: 1920, height: 900, deviceScaleFactor: 1 })
  }

  async irADashboard (): Promise<Page> {
    // eslint-disable-next-line
    if (!this.page) throw new Error('No se ha iniciado una página.')

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await this.page.goto(process.env.NODE_URL_GRAFANA!)
    await this.page.waitForNavigation()
    return this.page
  }

  async capturarPantalla (nombreArchivo: string): Promise<void> {
    if (this.page === null) throw new Error('No se ha iniciado una página.')

    await this.page.screenshot({ path: nombreArchivo })
  }

  async cerrarNavegador (): Promise<void> {
    if (this.browser !== null) await this.browser.close()
  }
}
