/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Dashboard, GrafanaLogin } from './sites'
import { GrafanaScrapingGraphics } from './sites/grafana/graphics'
import { GRAPHICS } from './helpers/graphics'
import cron from 'node-cron'

void (async () => {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const runScraping = async () => {
    const dashboard = new Dashboard()
    await dashboard.iniciarNavegador()
    const login = await dashboard.irADashboard()
    await dashboard.capturarPantalla('grafana_dashboard.png')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config()

    const setLogin = new GrafanaLogin(
      process.env.NODE_EMAIL_GRAFANA!,
      process.env.NODE_PASSWORD_GRAFANA!,
      login
    )
    const session = await setLogin.iniciarSesion()
    if (session) {
      await dashboard.capturarPantalla('grafana_dashboard_logged.png')
      const GrafanaGraphics = new GrafanaScrapingGraphics(login)
      await GrafanaGraphics.capturarPantalla('grafana_dashboard_graph.png')

      await GrafanaGraphics.scrape(GRAPHICS, 'css-157c53p')
      await dashboard.cerrarNavegador()
    }
  }

  // Ejecutar la función cada 10 minutos
  cron.schedule('*/2 * * * *', async () => {
    await runScraping()
  })
})()
