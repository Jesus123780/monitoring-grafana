import { Op } from 'sequelize'
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
    // Obtener la fecha de inicio del día de hoy
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0) // Establecer la hora a las 00:00:00

    // Obtener la fecha de finalización del día de hoy
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999) // Establecer la hora a las 23:59:59

    // Consultar los reportes desde el inicio del día de hoy hasta el final del día de hoy
    const data = await Errors.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfDay, endOfDay] // Utilizar el operador "between" para la consulta de rango de fechas
        }
      }
    })

    return data
  } catch (error) {
    console.error('Error al obtener los reportes de la base de datos:', error)
    return []
  }
}
