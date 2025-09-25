import Fastify from 'fastify'
import { config } from './config/config'

const fastify = Fastify({
  logger: config.nodeEnv === 'development'
})

const start = async () => {
  try {
    await fastify.register(import('@fastify/helmet'), {
      contentSecurityPolicy: false
    })

    await fastify.register(import('@fastify/cors'), {
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
    })

    await fastify.register(import('@fastify/cookie'), {
      parseOptions: {}
    })

    fastify.get('/health', async () => ({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Finance Tracker API'
    }))

    await fastify.register((await import('./routes/auth')).authRoutes, { prefix: '/api/auth' })
    await fastify.register((await import('./routes/dashboard')).dashboardRoutes, { prefix: '/api/dashboard' })

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