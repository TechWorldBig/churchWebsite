import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const deployedAssistantOrigin = 'https://church-website-job-js-projects.vercel.app'
const databaseApiPaths = new Set(['/api/members', '/api/attendance', '/api/gallery', '/api/updated'])

function blockLocalDatabaseApi(): Plugin {
  return {
    name: 'block-local-database-api',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split('?')[0] || ''
        if (!databaseApiPaths.has(path)) return next()

        response.statusCode = 503
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.setHeader('Cache-Control', 'no-store')
        response.end(JSON.stringify({ error: 'Database data is available only in the deployed Vercel application.' }))
      })
    },
  }
}

export default defineConfig({
  plugins: [blockLocalDatabaseApi(), react(), tailwindcss()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api/assistant': {
        target: deployedAssistantOrigin,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
