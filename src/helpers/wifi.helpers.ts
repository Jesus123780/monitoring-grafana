import wifi from 'node-wifi'

// Función para verificar la conexión WiFi
export async function checkWiFiConnection (): Promise<boolean> {
  try {
    wifi.init({
      iface: null // usa la interfaz predeterminada
    })
    // Obtener las redes WiFi disponibles
    const networks: any = await wifi.scan()

    // Verificar si hay alguna red conectada
    const connectedNetwork: any = networks.find((network: any) => network.ssid)

    if (connectedNetwork !== null) {
      console.log(`El servidor está conectado a la red WiFi "${connectedNetwork?.ssid}".`)
      return true
    } else {
      console.log('El servidor no está conectado a ninguna red WiFi.')
      return false
    }
  } catch (error) {
    console.error('Error al verificar la conexión WiFi:', error)
    return false
  }
}
