import { test, expect } from './_setup'

test.describe('Auth Page Visual Tests', () => {
  test('should match visual snapshot on init', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('auth-page.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('should match visual snapshot on form filled', async ({ page }) => {
    await page.goto('/auth')
    await page.waitForLoadState('networkidle')

    await page.getByLabel('Email').fill('user@example.com')
    await page.getByLabel('Password').fill('password')
    
    await expect(page).toHaveScreenshot('auth-page-after-submit.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })  
})
