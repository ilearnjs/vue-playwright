import { test, expect } from './_setup'

test.describe('About Page Visual Tests', () => {
  test('init state', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('about-page.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})