import { ensureSchema, getSql, sendError } from './_lib/db.js'

export default async function handler(req: any, res: any) {
  try {
    await ensureSchema()
    const sql = getSql()
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, photo, date, description FROM gallery_photos ORDER BY date DESC, created_at DESC`
      return res.status(200).json(rows)
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    if (req.method === 'POST') {
      await sql`INSERT INTO gallery_photos (id, photo, date, description) VALUES (${body.id}, ${body.photo}, ${body.date}, ${body.description || ''})`
    } else if (req.method === 'PUT') {
      await sql`UPDATE gallery_photos SET photo=${body.photo}, date=${body.date}, description=${body.description || ''} WHERE id=${body.id}`
    } else if (req.method === 'DELETE') {
      await sql`DELETE FROM gallery_photos WHERE id=${body.id}`
    } else return res.status(405).json({ error: 'Method not allowed' })
    await sql`INSERT INTO system_metadata (key, value) VALUES ('last_updated', ${new Date().toISOString()}) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`
    return res.status(200).json({ ok: true })
  } catch (error) { return sendError(res, error) }
}
