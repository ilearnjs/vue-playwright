import { test, expect } from './_setup'

test.describe('Index Page Visual Tests', () => {
  test('init state (no auth)', async ({ page, auth }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('index-page-no-auth.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })

  test('init state (auth)', async ({ page, auth }) => {
    await auth()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await expect(page).toHaveScreenshot('index-page-auth.png', {
      fullPage: true,
      animations: 'disabled',
    })
  })
})