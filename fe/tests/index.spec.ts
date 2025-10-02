import { test, expect } from './_setup'
import type { Page } from '@playwright/test'
import { generateUser, generateBalance, generateMonthlyData, generateRecentTransactions } from './mocks'

async function setupAPIMocks(page: Page) {
  const user = generateUser()
  const balance = generateBalance()
  const monthlyData = generateMonthlyData()
  const transactions = generateRecentTransactions()

  await page.route('*/**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ user })  // Backend returns { user: userData }
    })
  })

  await page.route('*/**/api/dashboard/balance', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(balance)
    })
  })

  await page.route('*/**/api/dashboard/monthly-data', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(monthlyData)
    })
  })

  await page.route('*/**/api/dashboard/transactions', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(transactions)
    })
  })
}

test.describe('Index Page Visual Tests', () => {
  test.beforeEach(async ({ page, auth }) => {
    await setupAPIMocks(page)
    await auth()
  })

  test('init state', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('index-page-auth.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('income modal', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('add-income-button').click()
    await page.waitForSelector('[data-testid="income-modal"]')

    await expect(page).toHaveScreenshot('index-page-income-modal.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('income modal form filled', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('add-income-button').click()
    await page.waitForSelector('[data-testid="income-modal"]')

    // Fill the form
    await page.getByTestId('transaction-description-input').fill('Freelance Project Payment')
    await page.getByTestId('transaction-amount-input').fill('1500.00')

    await expect(page).toHaveScreenshot('index-page-income-modal-filled.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('expense modal', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('add-expense-button').click()
    await page.waitForSelector('[data-testid="expense-modal"]')

    await expect(page).toHaveScreenshot('index-page-expense-modal.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('expense modal form filled', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('add-expense-button').click()
    await page.waitForSelector('[data-testid="expense-modal"]')

    // Fill the form
    await page.getByTestId('transaction-description-input').fill('Monthly Rent Payment')
    await page.getByTestId('transaction-amount-input').fill('2500.00')

    await expect(page).toHaveScreenshot('index-page-expense-modal-filled.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('edit transaction modal', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click edit button on first transaction
    await page.locator('[data-testid="transaction-item"]').first().locator('[data-testid="edit-transaction-button"]').click()
    await page.waitForSelector('[data-testid="edit-modal"]')

    await expect(page).toHaveScreenshot('index-page-edit-modal.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('edit transaction modal form filled', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click edit button on first transaction
    await page.locator('[data-testid="transaction-item"]').first().locator('[data-testid="edit-transaction-button"]').click()
    await page.waitForSelector('[data-testid="edit-modal"]')

    // Modify the form
    await page.getByTestId('transaction-description-input').clear()
    await page.getByTestId('transaction-description-input').fill('Updated Transaction Description')
    await page.getByTestId('transaction-amount-input').clear()
    await page.getByTestId('transaction-amount-input').fill('3750.50')

    await expect(page).toHaveScreenshot('index-page-edit-modal-modified.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('delete transaction modal', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click delete button on first transaction
    await page.locator('[data-testid="transaction-item"]').first().locator('[data-testid="delete-transaction-button"]').click()
    await page.waitForSelector('[data-testid="delete-modal"]')

    await expect(page).toHaveScreenshot('index-page-delete-modal.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})
