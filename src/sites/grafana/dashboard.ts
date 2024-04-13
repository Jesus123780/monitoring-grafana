import puppeteer, { Browser, Page } from 'puppeteer';
require('dotenv').config()
export class Dashboard {
    private browser: Browser | null = null;
    public page: Page | null = null;

    constructor() {}

    async iniciarNavegador() {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1500, height: 800 });
    }

    async irADashboard() {
        if (!this.page) throw new Error('No se ha iniciado una página.');

        await this.page.goto(process.env.NODE_URL_GRAFANA as string);
        await this.page.waitForNavigation();
        return this.page
    }

    async capturarPantalla(nombreArchivo: string) {
        if (!this.page) throw new Error('No se ha iniciado una página.');

        await this.page.screenshot({ path: nombreArchivo });
    }

    async cerrarNavegador() {
        if (this.browser) await this.browser.close();
    }
}
