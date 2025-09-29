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
  static async getUserBalance(userId: string): Promise<number> {
    const userTransactions = mockTransactions.filter(t => t.userId === userId)
    const balance = userTransactions.reduce((sum, transaction) => {
      return transaction.type === 'income'
        ? sum + transaction.amount
        : sum - transaction.amount
    }, 0)

    return balance
  }

  static async getMonthlyData(userId: string): Promise<{ income: number; expenses: number }> {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const userTransactions = mockTransactions.filter(t =>
      t.userId === userId && t.createdAt >= startOfMonth
    )

    const income = userTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = userTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return { income, expenses }
  }

  static async getUserTransactions(userId: string): Promise<TransactionResponse[]> {
    const userTransactions = mockTransactions
      .filter(t => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .map(t => ({
        id: t.id,
        userId: t.userId,
        type: t.type,
        amount: t.amount,
        description: t.description,
        date: t.createdAt.toISOString()
      }))

    return userTransactions
  }

  static async createTransaction(userId: string, data: CreateTransactionRequest): Promise<TransactionResponse> {
    const newTransaction: Transaction = {
      id: String(Date.now()),
      userId,
      type: data.type,
      amount: data.amount,
      description: data.description || '',
      createdAt: new Date(),
      updatedAt: new Date()
    }

    mockTransactions.push(newTransaction)

    const response: TransactionResponse = {
      id: newTransaction.id,
      userId: newTransaction.userId,
      type: newTransaction.type,
      amount: newTransaction.amount,
      description: newTransaction.description,
      date: newTransaction.createdAt.toISOString()
    }

    return response
  }

  static async updateTransaction(userId: string, transactionId: string, data: UpdateTransactionRequest): Promise<TransactionResponse> {
    const transactionIndex = mockTransactions.findIndex(
      t => t.id === transactionId && t.userId === userId
    )

    if (transactionIndex === -1) {
      throw new Error('Transaction not found')
    }

    const transaction = mockTransactions[transactionIndex]

    if (data.type !== undefined) transaction.type = data.type
    if (data.amount !== undefined) transaction.amount = data.amount
    if (data.description !== undefined) transaction.description = data.description
    transaction.updatedAt = new Date()

    const response: TransactionResponse = {
      id: transaction.id,
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      date: transaction.createdAt.toISOString()
    }

    return response
  }

  static async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    const transactionIndex = mockTransactions.findIndex(
      t => t.id === transactionId && t.userId === userId
    )

    if (transactionIndex === -1) {
      throw new Error('Transaction not found')
    }

    mockTransactions.splice(transactionIndex, 1)
  }
}