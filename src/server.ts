import app from './app'
import config from './config'
import { prisma } from './prisma/client'

const server = app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})

// graceful shutdown
const shutdown = async () => {
  console.log('Shutting down server...')
  server.close(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
}
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
