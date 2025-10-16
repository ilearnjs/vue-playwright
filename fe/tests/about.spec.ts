import { test, expect } from './_setup'

test.describe('About Page Visual Tests', () => {
  test('init state', async ({ page }, testInfo) => {
    await page.goto('/about')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('about-page.png', {
      fullPage: true,
      animations: 'disabled',
    })

    testInfo.attach('page.html', {
      body: await page.content(),
      contentType: 'text/html',
    })
  })
})