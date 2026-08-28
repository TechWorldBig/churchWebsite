import { AttendanceRecord, GalleryPhoto, Member } from './memberStore'

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

export const getMembers = () => request<Member[]>('/api/members')
export const getAttendance = () => request<AttendanceRecord[]>('/api/attendance')
export const getLastUpdated = () => request<{ value: string | null }>('/api/updated')
export const createMember = (member: Member) => request<{ ok: boolean }>('/api/members', { method: 'POST', body: JSON.stringify(member) })
export const updateMember = (member: Member) => request<{ ok: boolean }>('/api/members', { method: 'PUT', body: JSON.stringify(member) })
export const deleteMember = (id: string) => request<{ ok: boolean }>('/api/members', { method: 'DELETE', body: JSON.stringify({ id }) })
export const createAttendance = (record: AttendanceRecord) => request<{ ok: boolean }>('/api/attendance', { method: 'POST', body: JSON.stringify(record) })
export const updateAttendance = (record: AttendanceRecord) => request<{ ok: boolean }>('/api/attendance', { method: 'PUT', body: JSON.stringify(record) })
export const deleteAttendance = (id: string) => request<{ ok: boolean }>('/api/attendance', { method: 'DELETE', body: JSON.stringify({ id }) })
export const getGallery = () => request<GalleryPhoto[]>('/api/gallery')
export const createGalleryPhoto = (photo: GalleryPhoto) => request<{ ok: boolean }>('/api/gallery', { method: 'POST', body: JSON.stringify(photo) })
export const updateGalleryPhoto = (photo: GalleryPhoto) => request<{ ok: boolean }>('/api/gallery', { method: 'PUT', body: JSON.stringify(photo) })
export const deleteGalleryPhoto = (id: string) => request<{ ok: boolean }>('/api/gallery', { method: 'DELETE', body: JSON.stringify({ id }) })
