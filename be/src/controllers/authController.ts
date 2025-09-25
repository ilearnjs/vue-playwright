import { FastifyRequest, FastifyReply } from 'fastify'
import type { LoginRequest, LoginResponse, AuthenticatedRequest } from '../types'
import { sessionService } from '../services/sessionService'

// Login controller
export const login = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { email, password } = request.body as LoginRequest

    // Validate input
    if (!email || !password) {
      reply.status(400).send({
        success: false,
        error: 'Email and password are required'
      })
      return
    }

    // Authenticate user
    const userResponse = await sessionService.authenticateUser(email, password)

    if (!userResponse) {
      reply.status(401).send({
        success: false,
        error: 'Invalid email or password'
      })
      return
    }

    // Get full user data for session
    const user = sessionService.getUserByEmail(email)
    if (!user) {
      reply.status(500).send({
        success: false,
        error: 'User data not found'
      })
      return
    }

    // Create session
    const sessionId = sessionService.createSession(user)

    // Set session cookie
    reply.setCookie('session_id', sessionId, {
      path: '/',
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      // sameSite: 'lax', // Changed from 'strict' to 'lax' for cross-origin development
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    reply.send({
      success: true,
      user: userResponse
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}

// Logout controller
export const logout = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const sessionId = request.cookies.session_id

    if (sessionId) {
      // Delete session from memory
      sessionService.deleteSession(sessionId)
    }

    // Clear session cookie
    reply.clearCookie('session_id')

    reply.send({
      success: true
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}

// Get current user controller
export const getCurrentUser = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const sessionId = request.cookies.session_id

    if (!sessionId) {
      reply.status(401).send({
        success: false,
        error: 'No session found'
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

    reply.send({
      success: true,
      user
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}