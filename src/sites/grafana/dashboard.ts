import puppeteer, { Browser, Page } from 'puppeteer';

export class Dashboard {
    private browser: Browser | null = null;
    private page: Page | null = null;

    constructor() {}

    async iniciarNavegador() {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
    }

    async irADashboard() {
        if (!this.page) throw new Error('No se ha iniciado una página.');

        await this.page.goto('https://grafana.wompi.com/d/d8ed7892-8ffb-4488-a362-42ba89493498/soporte-dashboard?orgId=1&from=now-3h&to=now');
        await this.page.waitForNavigation();
    }

    async capturarPantalla(nombreArchivo: string) {
        if (!this.page) throw new Error('No se ha iniciado una página.');

        await this.page.screenshot({ path: nombreArchivo });
    }

    async cerrarNavegador() {
        if (this.browser) await this.browser.close();
    }
}
