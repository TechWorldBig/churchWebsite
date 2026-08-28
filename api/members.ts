import { ensureSchema, getSql, sendError } from './_lib/db.js'

export default async function handler(req: any, res: any) {
  try {
    await ensureSchema()
    const sql = getSql()
    if (req.method === 'GET') {
      const rows = await sql`SELECT id, name, role, email, phone, address, date_of_birth AS "dateOfBirth", focus, photo FROM members ORDER BY created_at DESC`
      return res.status(200).json(rows)
    }
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
    if (req.method === 'POST') {
      await sql`INSERT INTO members (id, name, role, email, phone, address, date_of_birth, focus, photo) VALUES (${body.id}, ${body.name}, ${body.role || 'YDM Member'}, ${body.email || ''}, ${body.phone || ''}, ${body.address || ''}, ${body.dateOfBirth || ''}, ${body.focus || ''}, ${body.photo || ''})`
    } else if (req.method === 'PUT') {
      await sql`UPDATE members SET name=${body.name}, role=${body.role || 'YDM Member'}, email=${body.email || ''}, phone=${body.phone || ''}, address=${body.address || ''}, date_of_birth=${body.dateOfBirth || ''}, focus=${body.focus || ''}, photo=${body.photo || ''} WHERE id=${body.id}`
    } else if (req.method === 'DELETE') {
      await sql`DELETE FROM members WHERE id=${body.id}`
    } else return res.status(405).json({ error: 'Method not allowed' })
    await sql`INSERT INTO system_metadata (key, value) VALUES ('last_updated', ${new Date().toISOString()}) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value`
    return res.status(200).json({ ok: true })
  } catch (error) { return sendError(res, error) }
}
