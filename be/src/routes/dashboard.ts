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

export async function dashboardRoutes(fastify: FastifyInstance, _options: FastifyPluginOptions) {
  fastify.addHook('preHandler', requireAuth)
  fastify.get('/balance', getBalance)
  fastify.get('/monthly-data', getMonthlyData)
  fastify.get('/transactions', getTransactions)
  fastify.post('/transactions', createTransaction)
  fastify.put('/transactions/:id', updateTransaction)
  fastify.delete('/transactions/:id', deleteTransaction)
}