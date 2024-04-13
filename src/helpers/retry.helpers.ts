import { Page } from 'puppeteer';

export async function retryFunction<T>(
  page: Page,
  func: () => Promise<T>,
  retries: number
): Promise<T> {
  let attempts = 0;
  while (attempts < retries) {
    try {
      console.log(`Intento ${attempts + 1}`);
      // Ejecutar la función
      const result = await func();
      // Si la función se ejecuta correctamente, retornar el resultado
      return result;
    } catch (error) {
      // Si hay un error, imprimirlo y esperar un breve periodo de tiempo antes de reintentar
      console.error(`Error en el intento ${attempts + 1}:`, error);
      // Esperar 1 segundo antes de reintentar
      // @ts-ignore
      await page.waitForTimeout(1000);
      attempts++;
    }
  }
  // Si se agotan los intentos, lanzar un error
  throw new Error(`La función no se pudo ejecutar después de ${retries} intentos.`);
}
