import { FastifyRequest, FastifyReply } from 'fastify'
import type { LoginRequest, AuthenticatedRequest } from '../types'
import { sessionService } from '../services/sessionService'

export const login = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const { email, password } = request.body as LoginRequest

    if (!email || !password) {
      reply.status(400).send({
        error: 'Email and password are required'
      })
      return
    }

    const userResponse = await sessionService.authenticateUser(email, password)

    if (!userResponse) {
      reply.status(401).send({
        error: 'Invalid email or password'
      })
      return
    }

    const user = sessionService.getUserByEmail(email)
    if (!user) {
      reply.status(500).send({
        error: 'User data not found'
      })
      return
    }

    const sessionId = sessionService.createSession(user)

    reply.setCookie('session_id', sessionId, {
      path: '/',
      httpOnly: false,  // Allow JavaScript to read the cookie
      secure: false,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    reply.send({
      user: userResponse
    })
  } catch (error) {
    reply.status(500).send({
      error: 'Internal server error'
    })
  }
}

export const logout = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    const sessionId = request.cookies.session_id

    if (sessionId) {
      sessionService.deleteSession(sessionId)
    }

    reply.clearCookie('session_id')

    reply.send({})
  } catch (error) {
    reply.status(500).send({
      error: 'Internal server error'
    })
  }
}

export const getCurrentUser = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const sessionId = request.cookies.session_id

    if (!sessionId) {
      reply.status(401).send({
        error: 'No session found'
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

    reply.send({
      user
    })
  } catch (error) {
    reply.status(500).send({
      error: 'Internal server error'
    })
  }
}