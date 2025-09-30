import { test, expect } from './_setup'

test.describe('Auth Page Visual Tests', () => {
  test('init state', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('auth-page.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('form filled', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('email-input').fill('user@example.com')
    await page.getByTestId('password-input').fill('password')
    await page.getByTestId('remember-me-checkbox').check()

    await expect(page).toHaveScreenshot('auth-page-form-filled.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('error state', async ({ page }) => {
    await page.route('*/**/api/auth/login', async route => {
      const response = {
        ok: false,
        status: 401,
        json: {
          message: 'Invalid email or password'
        }
      }
      await route.fulfill(response)
    })

    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    await page.getByTestId('email-input').fill('user@example.com')
    await page.getByTestId('password-input').fill('password')
    await page.getByTestId('remember-me-checkbox').check()
    await page.getByTestId('sign-in-button').click()

    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('auth-page-error-state.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})
