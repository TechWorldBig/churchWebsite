import { randomBytes } from 'node:crypto'
import { readFile, writeFile } from 'node:fs/promises'

const path = '.env.local'
let contents = ''
try { contents = await readFile(path, 'utf8') } catch (error) { if (error.code !== 'ENOENT') throw error }
if (/^ADMIN_PASSWORD=.+$/mu.test(contents)) {
  console.log('Administrator credentials already exist in .env.local; no changes made.')
} else {
  const lines = contents.split(/\r?\n/u).filter(line => !/^ADMIN_(?:USERNAME|PASSWORD)=/u.test(line))
  lines.push('ADMIN_USERNAME=admin', `ADMIN_PASSWORD=${randomBytes(32).toString('base64url')}`)
  await writeFile(path, `${lines.filter(Boolean).join('\n')}\n`, { mode: 0o600 })
  console.log('Administrator credentials saved to Git-ignored .env.local. Copy them privately to Vercel environment settings. No credentials were printed.')
}
