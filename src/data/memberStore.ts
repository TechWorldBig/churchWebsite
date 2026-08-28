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
