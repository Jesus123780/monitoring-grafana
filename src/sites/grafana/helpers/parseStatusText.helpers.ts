export function parseStatusText (statusText: string): { date: string, type: string } {
  const dateRegex = /(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/g
  const typeRegex = /(ALERTING|PENDING|OK)/g

  const dateMatch = dateRegex.exec(statusText)
  const date = dateMatch !== null ? dateMatch[0] : ''

  const typeMatch = typeRegex.exec(statusText)
  const type = typeMatch !== null ? typeMatch[0] : ''

  return { date, type }
}
