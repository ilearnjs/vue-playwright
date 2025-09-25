import { FastifyRequest, FastifyReply } from 'fastify'
import type { AuthenticatedRequest } from '../types'
import { sessionService } from '../services/sessionService'

// Authentication middleware - validates session and adds user to request
export const authenticateSession = async (
  request: FastifyRequest & AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> => {
  const sessionId = request.cookies.session_id

  if (!sessionId) {
    return // No session, continue without authentication
  }

  // Get user from session
  const user = sessionService.getUserBySession(sessionId)

  if (user) {
    // Add user to request object
    request.user = user
  }
  // If session is invalid, just continue without user (don't throw error)
}

// Authorization middleware - requires authentication
export const requireAuth = async (
  request: FastifyRequest & AuthenticatedRequest,
  reply: FastifyReply
): Promise<void> => {
  const sessionId = request.cookies.session_id

  if (!sessionId) {
    reply.status(401).send({
      success: false,
      error: 'Authentication required'
    })
    return
  }

  // Get user from session
  const user = sessionService.getUserBySession(sessionId)

  if (!user) {
    reply.status(401).send({
      success: false,
      error: 'Invalid or expired session'
    })
    return
  }

  // Add user to request object
  request.user = user
}