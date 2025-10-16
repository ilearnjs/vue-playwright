import { test as base, expect } from '@playwright/test'

type AuthFixture = {
  auth: () => Promise<void>
  addFinalPageState: void
}

export const test = base.extend<AuthFixture>({
  auth: async ({ context }, use) => {
    await use(async () => {
      await context.addCookies([
        { name: 'session_id', value: '1', path: '/', domain: 'localhost' }
      ])
    })
  },

  addFinalPageState: [async ({ page }, use, testInfo) => {
    await use()

    try {
      if (!page.isClosed()) {
        const content = await page.content()
        await testInfo.attach(`test-end-${testInfo.title.replace(/\s+/g, '-')}.html`, {
          body: content,
          contentType: 'text/html'
        })
      }
    } catch (e) {
    }
  }, { auto: true }]
})

export { expect }
