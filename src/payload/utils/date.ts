import { compareAsc, parse, format } from 'date-fns'
import { dateDisplayFormat } from '../constants'

export const formatTimestampToISO = (timestamp: number | undefined): string => {
  if (!timestamp) {
    return null
  }

  return new Date(timestamp * 1000).toISOString()
}

export function isTimeGreater(time1: string, time2: string): boolean {
  const date1 = parse(time1, 'HH:mm', new Date())
  const date2 = parse(time2, 'HH:mm', new Date())

  return compareAsc(date1, date2) > 0
}

export const skFormatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return format(date, dateDisplayFormat.sk)
}