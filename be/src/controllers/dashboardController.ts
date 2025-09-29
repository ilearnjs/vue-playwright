import { FastifyRequest, FastifyReply } from 'fastify'
import type { AuthenticatedRequest, CreateTransactionRequest, UpdateTransactionRequest } from '../types'
import { DashboardService } from '../services/dashboardService'

export const getBalance = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const balance = await DashboardService.getUserBalance(user.id)

    reply.send({
      data: { balance }
    })
  } catch (error) {
    reply.status(500).send({
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}

export const getMonthlyData = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const { income, expenses } = await DashboardService.getMonthlyData(user.id)

    reply.send({
      data: {
        income,
        expenses,
        change: income - expenses
      }
    })
  } catch (error) {
    reply.status(500).send({
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}

export const getTransactions = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const transactions = await DashboardService.getUserTransactions(user.id)

    reply.send({
      data: transactions
    })
  } catch (error) {
    reply.status(500).send({
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}

export const createTransaction = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const data = request.body as CreateTransactionRequest

    if (!data.type || !data.amount) {
      reply.status(400).send({
        error: 'Type and amount are required'
      })
      return
    }

    if (data.type !== 'income' && data.type !== 'expense') {
      reply.status(400).send({
        error: 'Type must be either "income" or "expense"'
      })
      return
    }

    if (data.amount <= 0) {
      reply.status(400).send({
        error: 'Amount must be greater than 0'
      })
      return
    }

    const transaction = await DashboardService.createTransaction(user.id, data)

    reply.status(201).send({
      data: transaction
    })
  } catch (error) {
    reply.status(500).send({
      error: error instanceof Error ? error.message : 'Internal server error'
    })
  }
}

export const updateTransaction = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const { id } = request.params as { id: string }
    const data = request.body as UpdateTransactionRequest

    if (data.type && data.type !== 'income' && data.type !== 'expense') {
      reply.status(400).send({
        error: 'Type must be either "income" or "expense"'
      })
      return
    }

    if (data.amount !== undefined && data.amount <= 0) {
      reply.status(400).send({
        error: 'Amount must be greater than 0'
      })
      return
    }

    const transaction = await DashboardService.updateTransaction(user.id, id, data)

    reply.send({
      data: transaction
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'Transaction not found') {
      reply.status(404).send({
        error: error.message
      })
    } else {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    }
  }
}

export const deleteTransaction = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const { id } = request.params as { id: string }

    await DashboardService.deleteTransaction(user.id, id)

    reply.send({})
  } catch (error) {
    if (error instanceof Error && error.message === 'Transaction not found') {
      reply.status(404).send({
        error: error.message
      })
    } else {
      reply.status(500).send({
        error: error instanceof Error ? error.message : 'Internal server error'
      })
    }
  }
}