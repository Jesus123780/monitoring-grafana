import { saveReport } from '../../../resolvers'

export async function saveAllReports (reports: Array<{ date: string, type: string, reported: boolean }>): Promise<void> {
  const promises: Array<Promise<void>> = reports.map(async (report) => {
    const { date, type, reported } = report
    await saveReport(type, date, reported)
  })

  await Promise.all(promises)
}
