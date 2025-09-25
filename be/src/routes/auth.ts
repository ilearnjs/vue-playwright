import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import type { LoginRequest } from '../types'
import { login, logout, getCurrentUser } from '../controllers/authController'

// Auth routes plugin
export async function authRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // POST /api/auth/login
  fastify.post('/login', login)

  // POST /api/auth/logout
  fastify.post('/logout', logout)

  // GET /api/auth/me
  fastify.get('/me', getCurrentUser)
}