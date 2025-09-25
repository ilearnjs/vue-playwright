import { FastifyRequest, FastifyReply } from 'fastify'
import type { AuthenticatedRequest, CreateTransactionRequest, UpdateTransactionRequest } from '../types'
import { sessionService } from '../services/sessionService'

const mockTransactions = [
  {
    id: '1',
    type: 'income',
    amount: 3200,
    description: 'Salary',
    date: new Date('2024-01-15').toISOString(),
    userId: '1'
  },
  {
    id: '2',
    type: 'expense',
    amount: 450,
    description: 'Groceries',
    date: new Date('2024-01-12').toISOString(),
    userId: '1'
  },
  {
    id: '3',
    type: 'expense',
    amount: 120,
    description: 'Gas',
    date: new Date('2024-01-10').toISOString(),
    userId: '1'
  },
  {
    id: '4',
    type: 'income',
    amount: 500,
    description: 'Freelance work',
    date: new Date('2024-01-08').toISOString(),
    userId: '1'
  }
]

export const getBalance = async (request: FastifyRequest & AuthenticatedRequest, reply: FastifyReply): Promise<void> => {
  try {
    const user = request.user!

    const userTransactions = mockTransactions.filter(t => t.userId === user.id)
    const totalBalance = userTransactions.reduce((sum, transaction) => {
      return transaction.type === 'income'
        ? sum + transaction.amount
        : sum - transaction.amount
    }, 0)

    reply.send({
      success: true,
      data: {
        balance: totalBalance
      }
    })
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

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const userTransactions = mockTransactions.filter(t => {
      const transactionDate = new Date(t.date)
      return t.userId === user.id &&
             transactionDate >= startOfMonth &&
             transactionDate <= endOfMonth
    })

    const monthlyIncome = userTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpenses = userTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyChange = monthlyIncome - monthlyExpenses

    reply.send({
      success: true,
      data: {
        change: monthlyChange,
        income: monthlyIncome,
        expenses: monthlyExpenses
      }
    })
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

    const userTransactions = mockTransactions
      .filter(t => t.userId === user.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    reply.send({
      success: true,
      data: userTransactions
    })
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
    const { type, amount, description } = request.body as CreateTransactionRequest

    if (!type || !amount || !description) {
      return reply.status(400).send({
        success: false,
        error: 'Missing required fields: type, amount, description'
      })
    }

    if (type !== 'income' && type !== 'expense') {
      return reply.status(400).send({
        success: false,
        error: 'Type must be either "income" or "expense"'
      })
    }

    if (amount <= 0) {
      return reply.status(400).send({
        success: false,
        error: 'Amount must be greater than 0'
      })
    }

    const newTransaction = {
      id: (mockTransactions.length + 1).toString(),
      type,
      amount,
      description,
      date: new Date().toISOString(),
      userId: user.id
    }

    mockTransactions.push(newTransaction)

    reply.send({
      success: true,
      data: newTransaction
    })
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
    const { type, amount, description } = request.body as UpdateTransactionRequest

    const transactionIndex = mockTransactions.findIndex(t => t.id === id && t.userId === user.id)

    if (transactionIndex === -1) {
      return reply.status(404).send({
        success: false,
        error: 'Transaction not found'
      })
    }

    if (type && type !== 'income' && type !== 'expense') {
      return reply.status(400).send({
        success: false,
        error: 'Type must be either "income" or "expense"'
      })
    }

    if (amount !== undefined && amount <= 0) {
      return reply.status(400).send({
        success: false,
        error: 'Amount must be greater than 0'
      })
    }

    const transaction = mockTransactions[transactionIndex]!
    if (type) transaction.type = type
    if (amount) transaction.amount = amount
    if (description) transaction.description = description

    reply.send({
      success: true,
      data: transaction
    })
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

    const transactionIndex = mockTransactions.findIndex(t => t.id === id && t.userId === user.id)

    if (transactionIndex === -1) {
      return reply.status(404).send({
        success: false,
        error: 'Transaction not found'
      })
    }

    const deletedTransaction = mockTransactions.splice(transactionIndex, 1)[0]

    reply.send({
      success: true,
      data: deletedTransaction
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Internal server error'
    })
  }
}