import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
function apiScanRoutesPlugin(): Plugin {
  return {
    name: 'api-scan-routes',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : ''
        if (url === '/api/scan/adaptive') {
          const mod = await import('./src/routes/scanRoutes.ts')
          void mod.adaptiveScanRouteHandler(req, res, next)
        } else if (url === '/api/audit/permissions') {
          const mod = await import('./src/routes/auditRoutes.ts')
          void mod.auditPermissionsRouteHandler(req, res, next)
        } else {
          next()
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiScanRoutesPlugin()],
})

