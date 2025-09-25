import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { login, logout, getCurrentUser } from '../controllers/authController'

export async function authRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.post('/login', login)
  fastify.post('/logout', logout)
  fastify.get('/me', getCurrentUser)
}