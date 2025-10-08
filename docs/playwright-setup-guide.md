# Adding Playwright Visual Testing to an Existing Project

This guide walks you through setting up Playwright for visual regression testing in an existing project, following the approach used in this repository.

## Table of Contents



## Prerequisites

- Web app we want to test (locally runnable)
- Access to staging api (for HAR recording)s

## Installation

### Step 1: Install and configure Playwright

Note: the recommended location to install Playwright is in the root of your frontend project. Alternatively it can be installed as a separate package in a monorepo.

```bash
npm init playwright@latest
```

You can use default options for all steps.

playwright.config updates needed to be done:
```ts
export default defineConfig({
  // save test results, snapshots, and reports in .tests folder
  // .tests folder should be gitignored
  outputDir: './.tests/test-results/',
  snapshotPathTemplate: './.tests/snaps/{testFilePath}/{arg}-{projectName}-{platform}{ext}',
  reporter: [
    ['html', {
      outputFolder: './.tests/test-report',
      open: 'never'
    }],
    process.env.CI ? ['github'] : ['line'],
  ],

  // trace: 'on' is useful to see full page screenshots even for successful tests
  use: {
    trace: 'on'
  },
  // list of browsers to test against
  projects: [
    // ...
  ],
  // start web app before tests
  webServer: {
    command: 'npm dev',
    url: 'http://localhost:5173'
  }
});
```

### Step 2: Add simple visual test
```ts
import { test, expect } from '@playwright/test';

test.describe('Index Page Visual Tests', () => {
  test('init state', async ({ page }) => {
    await page.goto('/');
    expect(await page.screenshot()).toMatchSnapshot('index-page.png');
  });
});
```
