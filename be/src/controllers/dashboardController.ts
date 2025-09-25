import { FastifyRequest, FastifyReply } from 'fastify'
import type { AuthenticatedRequest, CreateTransactionRequest, UpdateTransactionRequest } from '../types'
import { DashboardService } from '../services/dashboardService'

export const getBalance = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const result = await DashboardService.getUserBalance(user.id)

    if (result.success) {
      reply.send({
        success: true,
        data: { totalBalance: result.balance }
      })
    } else {
      reply.status(500).send({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}

export const getMonthlyData = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const result = await DashboardService.getMonthlyData(user.id)

    if (result.success) {
      reply.send({
        success: true,
        data: {
          income: result.income,
          expenses: result.expenses,
          netChange: (result.income || 0) - (result.expenses || 0)
        }
      })
    } else {
      reply.status(500).send({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}

export const getTransactions = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const result = await DashboardService.getUserTransactions(user.id)

    if (result.success) {
      reply.send({
        success: true,
        data: result.transactions
      })
    } else {
      reply.status(500).send({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}

export const createTransaction = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const data = request.body as CreateTransactionRequest

    if (!data.type || !data.amount) {
      reply.status(400).send({
        success: false,
        error: 'Type and amount are required'
      })
      return
    }

    if (data.type !== 'income' && data.type !== 'expense') {
      reply.status(400).send({
        success: false,
        error: 'Type must be either "income" or "expense"'
      })
      return
    }

    if (data.amount <= 0) {
      reply.status(400).send({
        success: false,
        error: 'Amount must be greater than 0'
      })
      return
    }

    const result = await DashboardService.createTransaction(user.id, data)

    if (result.success) {
      reply.status(201).send({
        success: true,
        data: result.transaction
      })
    } else {
      reply.status(500).send({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
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
        success: false,
        error: 'Type must be either "income" or "expense"'
      })
      return
    }

    if (data.amount !== undefined && data.amount <= 0) {
      reply.status(400).send({
        success: false,
        error: 'Amount must be greater than 0'
      })
      return
    }

    const result = await DashboardService.updateTransaction(user.id, id, data)

    if (result.success) {
      reply.send({
        success: true,
        data: result.transaction
      })
    } else if (result.error === 'Transaction not found') {
      reply.status(404).send({
        success: false,
        error: result.error
      })
    } else {
      reply.status(500).send({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}

export const deleteTransaction = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!
    const { id } = request.params as { id: string }

    const result = await DashboardService.deleteTransaction(user.id, id)

    if (result.success) {
      reply.send({
        success: true,
        message: 'Transaction deleted successfully'
      })
    } else if (result.error === 'Transaction not found') {
      reply.status(404).send({
        success: false,
        error: result.error
      })
    } else {
      reply.status(500).send({
        success: false,
        error: result.error
      })
    }
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}