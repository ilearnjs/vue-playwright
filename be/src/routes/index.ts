import { FastifyInstance, FastifyPluginOptions } from 'fastify'

// Main API routes plugin
export async function apiRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Health check route
  fastify.get('/health', async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Finance Tracker API'
    }
  })

  // Auth routes will be registered here
  // await fastify.register(authRoutes, { prefix: '/auth' })

  // Dashboard routes will be registered here
  // await fastify.register(dashboardRoutes, { prefix: '/dashboard' })
}