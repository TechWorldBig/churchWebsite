const SESSION_KEY = 'jsc-ydm-admin-session'
const SESSION_LENGTH = 24 * 60 * 60 * 1000

const readExpiry = () => Number(sessionStorage.getItem(SESSION_KEY) || 0)

export const hasAdminSession = () => {
  const expiry = readExpiry()
  if (expiry > Date.now()) return true
  clearAdminSession()
  return false
}

export const getAdminSessionExpiry = () => readExpiry()

export const startAdminSession = () => {
  const expiry = Date.now() + SESSION_LENGTH
  sessionStorage.setItem(SESSION_KEY, String(expiry))
}

export const clearAdminSession = () => {
  sessionStorage.removeItem(SESSION_KEY)
}
