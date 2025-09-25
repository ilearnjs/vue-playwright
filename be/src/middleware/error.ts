import { FastifyRequest, FastifyReply, FastifyError } from 'fastify'
import { config } from '../config/config'

export interface AppError extends Error {
  statusCode?: number
  isOperational?: boolean
}

// Global error handler for Fastify
export const errorHandler = async (
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const statusCode = error.statusCode || 500
  const message = error.message || 'Internal Server Error'

  // Log error in development
  if (config.nodeEnv === 'development') {
    console.error('Error:', error)
  }

  reply.status(statusCode).send({
    success: false,
    error: message,
    ...(config.nodeEnv === 'development' && { stack: error.stack })
  })
}

// 404 handler for Fastify
export const notFoundHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  reply.status(404).send({
    success: false,
    error: `Route ${request.url} not found`
  })
}