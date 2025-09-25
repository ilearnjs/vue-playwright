import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import {
  getBalance,
  getMonthlyData,
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../controllers/dashboardController'
import { requireAuth } from '../middleware/auth'

// Dashboard routes plugin
export async function dashboardRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  // Apply auth middleware to all dashboard routes
  fastify.addHook('preHandler', requireAuth)

  // GET /api/dashboard/balance
  fastify.get('/balance', getBalance)

  // GET /api/dashboard/monthly-data
  fastify.get('/monthly-data', getMonthlyData)

  // GET /api/dashboard/transactions
  fastify.get('/transactions', getTransactions)

  // POST /api/dashboard/transactions
  fastify.post('/transactions', createTransaction)

  // PUT /api/dashboard/transactions/:id
  fastify.put('/transactions/:id', updateTransaction)

  // DELETE /api/dashboard/transactions/:id
  fastify.delete('/transactions/:id', deleteTransaction)
}