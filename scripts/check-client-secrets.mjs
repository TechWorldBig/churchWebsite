import { readdir, readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { loadEnv } from 'vite'

const env = { ...loadEnv('production', process.cwd(), ''), ...process.env }
const secrets = Object.entries(env)
  .filter(([name, value]) => /KEY|TOKEN|SECRET|PASSWORD|DATABASE_URL|POSTGRES_URL/i.test(name) && value?.length >= 8)
  .flatMap(([, value]) => [value, encodeURIComponent(value), Buffer.from(value).toString('base64')])

async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) await scan(path)
    else {
      const content = await readFile(path, 'utf8')
      if (secrets.some((secret) => content.includes(secret))
        || /AIza[\w-]{30,}|-----BEGIN [A-Z ]*PRIVATE KEY-----|postgres(?:ql)?:\/\/[^\s]+/u.test(content)) {
        // Never print the credential or file contents to build logs.
        throw new Error(`Sensitive data detected in client artifact: ${path}`)
      }
    }
  }
}

await scan('dist')
console.log('Client secret scan passed.')
