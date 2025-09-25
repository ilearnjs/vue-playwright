import type { Transaction, TransactionResponse, CreateTransactionRequest, UpdateTransactionRequest } from '../types'

const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'income',
    amount: 3200,
    description: 'Salary',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    userId: '1',
    type: 'expense',
    amount: 450,
    description: 'Groceries',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: '3',
    userId: '1',
    type: 'expense',
    amount: 120,
    description: 'Gas',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: '4',
    userId: '1',
    type: 'income',
    amount: 500,
    description: 'Freelance work',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08')
  }
]

export class DashboardService {
  static async getUserBalance(userId: string): Promise<{ success: boolean; balance?: number; error?: string }> {
    try {
      const userTransactions = mockTransactions.filter(t => t.userId === userId)
      const balance = userTransactions.reduce((sum, transaction) => {
        return transaction.type === 'income'
          ? sum + transaction.amount
          : sum - transaction.amount
      }, 0)

      return {
        success: true,
        balance
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get balance'
      }
    }
  }

  static async getMonthlyData(userId: string): Promise<{ success: boolean; income?: number; expenses?: number; error?: string }> {
    try {
      const now = new Date()
      const currentMonth = now.getMonth()
      const currentYear = now.getFullYear()

      const currentMonthTransactions = mockTransactions.filter(t => {
        const transactionDate = t.createdAt
        return t.userId === userId &&
               transactionDate.getMonth() === currentMonth &&
               transactionDate.getFullYear() === currentYear
      })

      const income = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

      const expenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

      return {
        success: true,
        income,
        expenses
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get monthly data'
      }
    }
  }

  static async getUserTransactions(userId: string): Promise<{ success: boolean; transactions?: TransactionResponse[]; error?: string }> {
    try {
      const userTransactions = mockTransactions
        .filter(t => t.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .map(t => ({
          id: t.id,
          type: t.type,
          amount: t.amount,
          description: t.description || '',
          date: t.createdAt.toISOString().split('T')[0] || '',
          timestamp: t.createdAt.toISOString()
        }))

      return {
        success: true,
        transactions: userTransactions
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get transactions'
      }
    }
  }

  static async createTransaction(userId: string, data: CreateTransactionRequest): Promise<{ success: boolean; transaction?: TransactionResponse; error?: string }> {
    try {
      const newId = (mockTransactions.length + 1).toString()
      const now = new Date()

      const newTransaction: Transaction = {
        id: newId,
        userId,
        type: data.type,
        amount: data.amount,
        description: data.description || '',
        createdAt: now,
        updatedAt: now
      }

      mockTransactions.push(newTransaction)

      const transactionResponse: TransactionResponse = {
        id: newTransaction.id,
        type: newTransaction.type,
        amount: newTransaction.amount,
        description: newTransaction.description || '',
        date: newTransaction.createdAt.toISOString().split('T')[0] || '',
        timestamp: newTransaction.createdAt.toISOString()
      }

      return {
        success: true,
        transaction: transactionResponse
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create transaction'
      }
    }
  }

  static async updateTransaction(userId: string, transactionId: string, data: UpdateTransactionRequest): Promise<{ success: boolean; transaction?: TransactionResponse; error?: string }> {
    try {
      const transactionIndex = mockTransactions.findIndex(t => t.id === transactionId && t.userId === userId)

      if (transactionIndex === -1) {
        return {
          success: false,
          error: 'Transaction not found'
        }
      }

      const transaction = mockTransactions[transactionIndex]!
      const now = new Date()

      if (data.type) transaction.type = data.type
      if (data.amount !== undefined) transaction.amount = data.amount
      if (data.description !== undefined) transaction.description = data.description
      transaction.updatedAt = now

      const transactionResponse: TransactionResponse = {
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description || '',
        date: transaction.createdAt.toISOString().split('T')[0] || '',
        timestamp: transaction.createdAt.toISOString()
      }

      return {
        success: true,
        transaction: transactionResponse
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update transaction'
      }
    }
  }

  static async deleteTransaction(userId: string, transactionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const transactionIndex = mockTransactions.findIndex(t => t.id === transactionId && t.userId === userId)

      if (transactionIndex === -1) {
        return {
          success: false,
          error: 'Transaction not found'
        }
      }

      mockTransactions.splice(transactionIndex, 1)

      return {
        success: true
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete transaction'
      }
    }
  }
}