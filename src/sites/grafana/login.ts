import { Browser, Page } from 'puppeteer';
import { retryFunction } from '../../helpers';

export class GrafanaLogin {
  private readonly email: string;
  private readonly pass: string;
  private browser: Browser | null = null;
  private page: Page | null = null;

  constructor(email: string, pass: string, page: Page | null = null) {
    this.email = email;
    this.pass = pass;
    this.page = page;
  }

  async iniciarSesion() {
    try {
      if (!this.page) throw new Error('No se ha iniciado una página.');

      // Esperar a que el elemento esté presente en la página
      await this.page.waitForSelector('#i0116');
  
      // Seleccionar el elemento por su atributo ID
      const emailInput = await this.page.$('#i0116');
  
      if (emailInput) {
        // Escribir algo en el elemento
        await emailInput.type(this.email);
      }
      // Esperar a que el botón de siguiente esté presente en la página
      await this.page.waitForSelector('#idSIButton9');
  
      // Seleccionar el botón de siguiente por su atributo ID
      const siguienteButton = await this.page.$('#idSIButton9');
  
      if (siguienteButton) {
        // Hacer clic en el botón de siguiente
        await siguienteButton.click();
  
        // Esperar a que el campo de contraseña esté presente en la página después de hacer clic en el botón de siguiente
        await this.page.waitForSelector('#i0118');
  
        // Seleccionar el campo de contraseña por su atributo ID
        const passwordInput = await this.page.$('#i0118');
  
        if (passwordInput) {
          // Escribir la contraseña en el campo de contraseña
          await passwordInput.type(this.pass);
        
          const resultado = await retryFunction(this.page, async () => {
            if (this.page) {
              await this.page.waitForSelector('#idSIButton9');
              await Promise.all([
                this.page.waitForSelector('#idSIButton9', { visible: true }),
                this.page.waitForNavigation({ waitUntil: 'networkidle0' }) // Opcional: esperar a que la navegación haya terminado
              ]);
            }
        }, 3); // Número de intentos (en este caso, 3)
          await this.page.click('#idSIButton9');
          await Promise.all([
            this.page.waitForSelector('#idSIButton9', { visible: true }),
            this.page.waitForNavigation({ waitUntil: 'networkidle0' }) // Opcional: esperar a que la navegación haya terminado
          ]);
          await this.page.click('#idSIButton9');
  
        }
      }
      return true
    } catch (error) {
      return false;
    } 
   
  }


  async capturarPantalla(nombreArchivo: string) {
    if (!this.page) throw new Error('No se ha iniciado una página.');

    await this.page.screenshot({ path: nombreArchivo });
  }

  async cerrarNavegador() {
    if (this.browser) await this.browser.close();
  }
}
