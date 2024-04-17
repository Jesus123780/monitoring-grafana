export async function findOneError (reports: Array<{ date: string, type: string, reported: boolean }>): Promise<boolean> {
  // Verificar si hay un error reciente para notificar
  const findError = reports.find((report) => {
    const now: Date = new Date()
    const reportDate: Date = new Date(report.date)
    const diffMinutes: number = Math.abs(now.getTime() - reportDate.getTime()) / 60000 // Diferencia en minutos
    return diffMinutes <= 15 && report.type === 'ALERTING'
  })
  return Boolean(findError)
}
