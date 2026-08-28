export type Member = {
  id: string
  name: string
  role: string
  email: string
  phone: string
  address: string
  dateOfBirth: string
  focus: string
  photo: string
}

export type AttendanceRecord = {
  id: string
  memberId: string
  name: string
  date: string
  present: boolean
  note: string
}

export const MEMBERS_STORAGE_KEY = 'jsc-ydm-members'
export const ATTENDANCE_STORAGE_KEY = 'jsc-ydm-attendance'
export const SYSTEM_UPDATED_STORAGE_KEY = 'jsc-ydm-system-updated'

export function readStored<T>(key: string, fallback: T): T {
  try {
    return JSON.parse(localStorage.getItem(key) || 'null') || fallback
  } catch {
    return fallback
  }
}
