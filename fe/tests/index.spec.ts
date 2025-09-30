import { test, expect } from './_setup'
import type { Page } from '@playwright/test'

// Mock data shared across tests
const mockData = {
  user: { id: 1, email: 'user@example.com', name: 'User' },
  balance: { balance: 1024.56 },
  monthlyData: { change: 1800, expenses: 300, income: 2100 },
  transactions: [
    { id: '1', type: 'income', amount: 2100, description: 'Salary', date: '2023-10-01', userId: '1' },
    { id: '2', type: 'expense', amount: 300, description: 'Groceries', date: '2023-10-05', userId: '1' },
    { id: '3', type: 'expense', amount: 150, description: 'Utilities', date: '2023-10-10', userId: '1' },
  ]
}

// Helper function to setup all API mocks
async function setupAPIMocks(page: Page, options = { authenticated: false }) {
  // Auth endpoint
  await page.route('**/api/auth/me', route => {
    if (options.authenticated) {
      route.fulfill({ status: 200, json: { user: mockData.user } })
    } else {
      route.fulfill({ status: 401, json: { error: 'No session' } })
    }
  })

  // Dashboard endpoints
  await page.route('**/api/dashboard/balance', route =>
    route.fulfill({ status: 200, json: mockData.balance })
  )

  await page.route('**/api/dashboard/monthly-data', route =>
    route.fulfill({ status: 200, json: mockData.monthlyData })
  )

  await page.route('**/api/dashboard/transactions', route =>
    route.fulfill({ status: 200, json: mockData.transactions })
  )

  // Login endpoint
  await page.route('**/api/auth/login', route =>
    route.fulfill({ status: 200, json: { user: mockData.user } })
  )
}

test.describe('Index Page Visual Tests', () => {
  test('init state', async ({ page, auth }) => {
    await setupAPIMocks(page, { authenticated: true })
    await auth()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('index-page-auth.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('income modal', async ({ page, auth }) => {
    await setupAPIMocks(page, { authenticated: true })
    await auth()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('add-income-button').click()
    await page.waitForSelector('[data-testid="income-modal"]')

    await expect(page).toHaveScreenshot('index-page-income-modal.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('expense modal', async ({ page, auth }) => {
    await setupAPIMocks(page, { authenticated: true })
    await auth()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('add-expense-button').click()
    await page.waitForSelector('[data-testid="expense-modal"]')

    await expect(page).toHaveScreenshot('index-page-expense-modal.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})