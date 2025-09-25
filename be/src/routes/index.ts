import { FastifyInstance, FastifyPluginOptions } from 'fastify'

export async function apiRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.get('/health', async () => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'Finance Tracker API'
    }
  })

}