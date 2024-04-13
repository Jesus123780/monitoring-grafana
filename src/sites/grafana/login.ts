import puppeteer, { Browser, Page } from 'puppeteer';

export class GrafanaLogin {
    private readonly usuario: string;
    private readonly contraseña: string;
    private browser: Browser | null = null;
    private page: Page | null = null;

    constructor(usuario: string, contraseña: string) {
        this.usuario = usuario;
        this.contraseña = contraseña;
    }

    async iniciarNavegador() {
        this.browser = await puppeteer.launch({ headless: false });
        this.page = await this.browser.newPage();
    }

    async iniciarSesion() {
        if (!this.page) throw new Error('No se ha iniciado una página.');

        await this.page.goto('https://grafana.wompi.com/');
        await this.page.waitForSelector('.login-form-inputs');
        await this.page.type('#user', this.usuario);
        await this.page.type('#password', this.contraseña);
        await this.page.click('.login-button');
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

// (async () => {
//     const grafana = new GrafanaLogin('tu_usuario', 'tu_contraseña');
//     await grafana.iniciarNavegador();
//     await grafana.iniciarSesion();
//     await grafana.capturarPantalla('grafana_logged_in.png');
//     await grafana.cerrarNavegador();
// })();
