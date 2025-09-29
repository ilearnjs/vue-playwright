import { FastifyRequest, FastifyReply } from 'fastify'
import type { AuthenticatedRequest } from '../types'
import { sessionService } from '../services/sessionService'

export const authenticateSession = async (
  request: FastifyRequest & AuthenticatedRequest,
  _reply: FastifyReply
): Promise<void> => {
  const sessionId = request.cookies.session_id

  if (!sessionId) {
    return
  }

  const user = sessionService.getUserBySession(sessionId)

  if (user) {
    request.user = user
  }
}

export const requireAuth = async (
  request: FastifyRequest & AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> => {
  const sessionId = request.cookies.session_id

  if (!sessionId) {
    reply.status(401).send({
      error: 'Authentication required'
    })
    return
  }

  const user = sessionService.getUserBySession(sessionId)

  if (!user) {
    reply.status(401).send({
      error: 'Invalid or expired session'
    })
    return
  }

  request.user = user
}