import puppeteer from 'puppeteer';
import { Dashboard } from './sites';

(async () => {
    const getGlobalMoney = async () => {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        const url = `https://www.google.com/search?q=dolar+para+Cop`;
        await page.goto(url);
        
        // Esperar a que el elemento input esté listo
        await page.waitForSelector('.lWzCpb.a61j6');

        // Obtener el valor del campo de moneda
        const valorMoneda = await page.$eval('.lWzCpb.a61j6', (input: any) => input.value );
        
        console.log(`El valor de 1 dolar en Cop es ${valorMoneda}`);
        
        // Cerrar el navegador
        await browser.close();
    };

    await getGlobalMoney();
})();

(async () => {
    const dashboard = new Dashboard();
    await dashboard.iniciarNavegador();
    await dashboard.irADashboard();
    await dashboard.capturarPantalla('grafana_dashboard.png');
    await dashboard.cerrarNavegador();
})();