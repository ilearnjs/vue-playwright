import Fastify from 'fastify'
import { config } from './config/config'

// Create Fastify instance
const fastify = Fastify({
  logger: config.nodeEnv === 'development'
})

const start = async () => {
  try {
    // Register plugins
    await fastify.register(import('@fastify/helmet'), {
      contentSecurityPolicy: false
    })

    await fastify.register(import('@fastify/cors'), {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })

    await fastify.register(import('@fastify/cookie'), {
      parseOptions: {}
    })

    // Health check endpoint
    fastify.get('/health', async (request, reply) => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        service: 'Finance Tracker API'
      }
    })

    // Register API routes
    await fastify.register((await import('./routes/auth')).authRoutes, { prefix: '/api/auth' })
    // await fastify.register(dashboardRoutes, { prefix: '/api/dashboard' })

    // Start server
    await fastify.listen({
      port: config.port,
      host: '0.0.0.0'
    })

    console.log(`🚀 Finance Tracker API server running on port ${config.port}`)
    console.log(`📊 Environment: ${config.nodeEnv}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()