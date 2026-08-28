const SESSION_COOKIE = 'jsc_ydm_admin_session'
const SESSION_LENGTH = 24 * 60 * 60 * 1000

const readExpiry = () => {
  const value = document.cookie.split('; ').find(item => item.startsWith(`${SESSION_COOKIE}=`))?.split('=')[1]
  return value ? Number(value) : 0
}

export const hasAdminSession = () => {
  const expiry = readExpiry()
  if (expiry > Date.now()) return true
  clearAdminSession()
  return false
}

export const getAdminSessionExpiry = () => readExpiry()

export const startAdminSession = () => {
  const expiry = Date.now() + SESSION_LENGTH
  document.cookie = `${SESSION_COOKIE}=${expiry}; Max-Age=${SESSION_LENGTH / 1000}; Path=/; SameSite=Lax`
}

export const clearAdminSession = () => {
  document.cookie = `${SESSION_COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`
}
