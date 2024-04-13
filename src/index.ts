import puppeteer from 'puppeteer';
import { Dashboard, GrafanaLogin } from './sites';
import { GrafanaScrapingGraphics } from './sites/grafana/graphics';
import { GRAPHICS } from './helpers/graphics';

  (async () => {
    const getGlobalMoney = async () => {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
      })
      const url = `https://www.google.com/search?q=dolar+para+Cop`;
      await page.goto(url);

      // Esperar a que el elemento input esté listo
      await page.waitForSelector('.lWzCpb.a61j6');

      // Obtener el valor del campo de moneda
      const valorMoneda = await page.$eval('.lWzCpb.a61j6', (input: any) => input.value);

      console.log(`El valor de 1 dolar en Cop es ${valorMoneda}`);

      // Cerrar el navegador
      await browser.close();
    };

    // await getGlobalMoney();
  })();

(async () => {
  const dashboard = new Dashboard();
  await dashboard.iniciarNavegador();
  const login = await dashboard.irADashboard();
  await dashboard.capturarPantalla('grafana_dashboard.png');
  require('dotenv').config()

  const setLogin = new GrafanaLogin(
    process.env.NODE_EMAIL_GRAFANA as string,
    process.env.NODE_PASSWORD_GRAFANA as string,
    login
  )
  const session = await setLogin.iniciarSesion()
  if (session) {
    await dashboard.capturarPantalla('grafana_dashboard_logged.png');
    const GrafanaGraphics = new GrafanaScrapingGraphics(login)
    await GrafanaGraphics.capturarPantalla('grafana_dashboard_graph.png');
    
    await GrafanaGraphics.scrape(GRAPHICS, 'css-157c53p')
  }

  // await dashboard.cerrarNavegador();
})();