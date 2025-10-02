import { test as base, expect } from '@playwright/test'

type AuthFixture = {
  auth: () => Promise<void>;
};

export const test = base.extend<AuthFixture>({
  auth: async ({ context }, use) => {
    await use(async () => {
      await context.addCookies([
        {
          name: 'session_id',
          value: 'test-session-id-for-playwright-tests',
          path: '/',
          domain: 'localhost',
          httpOnly: false,  // Match backend setting
          sameSite: 'Lax'
        }
      ]);
    })
  },
})

export { expect }
