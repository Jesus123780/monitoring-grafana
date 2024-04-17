import { getReports } from '../../../resolvers'

export async function filterNewReports (reports: Array<{ date: string, type: string, reported: boolean }>): Promise<Array<{ date: string, type: string, reported: boolean }>> {
  const allReports = await getReports()
  const oldReport = allReports.map((e: any) => ({
    date: e.dataValues.date,
    reported: e.dataValues.reported,
    type: e.dataValues.type
  }))

  return reports.filter((report) => {
    // Buscar si el reporte actual ya está presente en la base de datos
    const existingReport = oldReport.find((element: any) => (
      element.date === report.date && element.type === report.type
    ))

    // Si no se encuentra el reporte actual, se considera como un nuevo reporte
    return existingReport === undefined || existingReport === null
  })
}
