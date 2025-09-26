import { test, expect } from './_setup'

test.describe('About Page Visual Tests', () => {
  test('should match visual snapshot of about page', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('about-page.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('should handle responsive layout', async ({ page }) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 },
    ]

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.waitForTimeout(500)

      await expect(page).toHaveScreenshot(`about-${viewport.name}.png`, {
        fullPage: true,
        animations: 'disabled',
      })
    }
  })
})