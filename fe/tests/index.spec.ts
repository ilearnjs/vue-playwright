import { test, expect } from './_setup'

test.describe('Index Page Visual Tests', () => {
  test('init state (auth)', async ({ page, auth }) => {
    await page.route('*/**/api/auth/me', async route => {
      const response = {
        ok: true,
        status: 200,
        json: {
          user:
          {
            id: 1,
            email: 'user@example.com',
            name: 'User'
          }
        }
      }
      await route.fulfill(response)
    })

    ///api/dashboard/balance
    await page.route('*/**/api/dashboard/balance', async route => {
      const response = {
        ok: true,
        status: 200,
        json: {
          balance: 1024.56
        }
      }
      await route.fulfill(response)
    })

    // /api/dashboard/monthly-data'
    await page.route('*/**/api/dashboard/monthly-data', async route => {
      const response = {
        ok: true,
        status: 200,
        json: {
          change: 1800,
          expenses: 300,
          income: 2100,
        }
      }
      await route.fulfill(response)
    })

    // /api/dashboard/transactions
    await page.route('*/**/api/dashboard/transactions', async route => {
      const response = {
        ok: true,
        status: 200,
        json: [
          { id: '1', type: 'income', amount: 2100, description: 'Salary', date: '2023-10-01' },
          { id: '2', type: 'expense', amount: 300, description: 'Groceries', date: '2023-10-05' },
          { id: '3', type: 'expense', amount: 150, description: 'Utilities', date: '2023-10-10' },
        ]
      }
      await route.fulfill(response)
    })

    await auth()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('index-page-auth.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})