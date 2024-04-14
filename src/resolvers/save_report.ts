import Errors from '../models/errors'
interface ErrorAttributes {
  id: number
  type: string
  date: string
  reported: boolean
}

export const saveReport = async (type: string, date: string, reported: boolean): Promise<void> => {
  try {
    // Guardar el nuevo reporte en la base de datos
    await Errors.create({
      type,
      date,
      reported
    })
    console.log('Nuevo reporte guardado en la base de datos.')
  } catch (error) {
    console.error('Error al guardar el nuevo reporte en la base de datos:', error)
  }
}

export const getReports = async (): Promise<ErrorAttributes[]> => {
  try {
    // Obtener todos los reportes de la base de datos
    const data = await Errors.findAll()
    return data
  } catch (error) {
    console.error('Error al obtener los reportes de la base de datos:', error)
    return []
  }
}
