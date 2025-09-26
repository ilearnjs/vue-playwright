import { test as base, expect } from '@playwright/test'

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await use(page)
  },
})

export async function waitForPageReady(page: any) {
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(500)
}

export { expect }
