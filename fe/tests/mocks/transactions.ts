import { faker } from '@faker-js/faker'
import type { Transaction } from '@/api'

// Set seed for consistent data in visual tests
faker.seed(123)

const incomeDescriptions = [
  'Salary Payment',
  'Freelance Project',
  'Investment Return',
  'Bonus Payment',
  'Consulting Fee',
  'Stock Dividend',
  'Rental Income',
  'Commission',
  'Refund',
  'Gift'
]

const expenseDescriptions = [
  'Rent Payment',
  'Grocery Shopping',
  'Utility Bills',
  'Transportation',
  'Entertainment',
  'Restaurant',
  'Healthcare',
  'Insurance',
  'Subscription',
  'Shopping'
]

function generateTransaction(overrides?: Partial<Transaction>): Transaction {
  const type = overrides?.type || faker.helpers.arrayElement(['income', 'expense'] as const)

  return {
    id: faker.string.uuid(),
    type,
    amount: parseFloat(faker.finance.amount({ min: 10, max: 5000, dec: 2 })),
    description: type === 'income'
      ? faker.helpers.arrayElement(incomeDescriptions)
      : faker.helpers.arrayElement(expenseDescriptions),
    date: faker.date.recent({ days: 30 }).toISOString(),
    ...overrides
  }
}

export function generateRecentTransactions(): Transaction[] {
  // Generate a mix of income and expense transactions
  const transactions: Transaction[] = []

  // Add some income transactions
  for (let i = 0; i < 4; i++) {
    transactions.push(generateTransaction({ type: 'income' }))
  }

  // Add some expense transactions
  for (let i = 0; i < 6; i++) {
    transactions.push(generateTransaction({ type: 'expense' }))
  }

  // Sort by date (most recent first)
  return transactions.sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
}
