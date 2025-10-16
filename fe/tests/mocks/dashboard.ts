import { faker } from '@faker-js/faker'
import type { BalanceData, MonthlyData } from '@/api'

// Set seed for consistent data in visual tests
faker.seed(123)

export function generateBalance(): BalanceData {
  return {
    balance: parseFloat(faker.finance.amount({ min: 1000, max: 50000, dec: 2 }))
  }
}

export function generateMonthlyData(): MonthlyData {
  const income = parseFloat(faker.finance.amount({ min: 3000, max: 15000, dec: 2 }))
  const expenses = parseFloat(faker.finance.amount({ min: 2000, max: 10000, dec: 2 }))

  return {
    income,
    expenses,
    change: income - expenses
  }
}
