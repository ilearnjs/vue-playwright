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

    await expect(page).toHaveScreenshot('auth-page-after-submit.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })  
})
