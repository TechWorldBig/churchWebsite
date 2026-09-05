import { createSession, credentialsConfigured, getSessionExpiry, revokeSession, sameOriginMutation, sameSecret, sessionCookie, sharedRateLimited } from './_lib/security.js'

export default async function handler(req: any, res: any) {
  res.setHeader('Cache-Control', 'no-store')
  try {
    if (req.method === 'GET') {
      const expiresAt = await getSessionExpiry(req)
      return res.status(200).json({ authenticated: Boolean(expiresAt), expiresAt })
    }
    if (!['POST', 'DELETE'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' })
    if (!sameOriginMutation(req)) return res.status(403).json({ error: 'Request not allowed.' })
    if (req.method === 'DELETE') {
      await revokeSession(req)
      res.setHeader('Set-Cookie', sessionCookie('', 0))
      return res.status(200).json({ authenticated: false })
    }
    if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) return res.status(415).json({ error: 'JSON content type is required.' })
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body ?? null)
    if (Buffer.byteLength(raw) > 4096) return res.status(413).json({ error: 'Request too large.' })
    let body
    try { body = JSON.parse(raw) } catch { return res.status(400).json({ error: 'Invalid request body.' }) }
    if (typeof body?.username !== 'string' || typeof body?.password !== 'string') return res.status(400).json({ error: 'Invalid credentials.' })
    if (!credentialsConfigured()) return res.status(503).json({ error: 'Administrator sign-in is not configured.' })
    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim()
    if (await sharedRateLimited('admin-login', ip, 5, 900)) {
      res.setHeader('Retry-After', '900')
      return res.status(429).json({ error: 'Too many attempts. Please try again later.' })
    }
    const validUser = sameSecret(body.username, process.env.ADMIN_USERNAME!)
    const validPassword = sameSecret(body.password, process.env.ADMIN_PASSWORD!)
    if (!validUser || !validPassword) return res.status(401).json({ error: 'Invalid credentials.' })
    await revokeSession(req)
    const { token, expiresAt } = await createSession()
    res.setHeader('Set-Cookie', sessionCookie(token))
    return res.status(200).json({ authenticated: true, expiresAt })
  } catch {
    return res.status(503).json({ error: 'Administrator service is temporarily unavailable.' })
  }
}
