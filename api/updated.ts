import { ensureSchema, sendError, sql } from './_lib/db'

export default async function handler(_req: any, res: any) {
  try {
    await ensureSchema()
    const rows = await sql`SELECT value FROM system_metadata WHERE key='last_updated'`
    return res.status(200).json({ value: rows[0]?.value || null })
  } catch (error) { return sendError(res, error) }
}
