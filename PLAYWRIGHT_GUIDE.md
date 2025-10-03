# Playwright UI Testing Guide

## Table of Contents
- [Prerequisites](#prerequisites)
- [Overview](#overview)
- [Installation & Setup](#installation--setup)
- [Project Structure](#project-structure)
- [Testing Approach](#testing-approach)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Prerequisites

Before implementing Playwright UI testing, ensure you have:

### Required Components

1. **Frontend Application**
   - A running web application (React, Vue, Angular, or vanilla JS)
   - Accessible via URL (localhost for development, deployed URL for CI/CD)
   - Consistent UI components with stable selectors

2. **Backend API Access** (if applicable)
   - Development/staging API endpoints for the application
   - Test credentials and authentication tokens
   - Ability to create test data or use existing test datasets

3. **Development Environment**
   - Node.js 16+ installed
   - Package manager (npm, yarn, or pnpm)
   - Git for version control
   - 2GB+ free disk space for browser binaries

### API Access Strategies

#### Option 1: Live API (Development/Staging)
```typescript
// Use actual API endpoints
export default defineConfig({
  use: {
    baseURL: 'http://localhost:3000',
    extraHTTPHeaders: {
      'Authorization': `Bearer ${process.env.TEST_API_TOKEN}`,
    },
  },
})
```

#### Option 2: Mocked API (Recommended for CI)
```typescript
// Record API responses as HAR files
await page.routeFromHAR('./tests/mocks/api-responses.har', {
  url: '**/api/**',
  update: false, // Set to true to record new responses
})
```

#### Option 3: API Stubbing
```typescript
// Mock specific endpoints
await page.route('**/api/users', route => {
  route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{ id: 1, name: 'Test User' }])
  })
})
```

### Test Data Requirements

1. **User Accounts**
   - Dedicated test accounts with known credentials
   - Different permission levels if testing authorization
   - Isolated test data that won't affect production

2. **Database State**
   - Ability to reset test data between runs
   - Seed data for consistent testing
   - Cleanup procedures after test execution

3. **Environment Variables**
   ```bash
   # .env.test
   TEST_USER_EMAIL=test@example.com
   TEST_USER_PASSWORD=securepassword
   API_BASE_URL=https://staging-api.example.com
   TEST_API_TOKEN=your-test-token
   ```

## Overview

This guide covers the implementation of visual regression testing using Playwright for a Vue.js application. The approach focuses on maintaining baseline screenshots from the master branch and comparing them against changes in pull requests.

## Installation & Setup

### 1. Install Playwright

```bash
cd fe
yarn add -D @playwright/test
npx playwright install
```

### 2. Configure Playwright

Create `playwright.config.ts` in your frontend directory:

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on',
  },

  // Output directories
  outputDir: '.tests/test-results/',
  snapshotPathTemplate: '.tests/snaps/{testFilePath}/{arg}-{projectName}-{platform}{ext}',

  // Reporter configuration
  reporter: [
    ['html', {
      outputFolder: '.tests/test-report',
      open: 'never',
    }],
    process.env.CI ? ['github'] : ['line'],
  ],

  // Browser configurations
  projects: [
    {
      name: 'chromium-1920',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 800 },
      },
    },
    {
      name: 'webkit-360',
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 360, height: 800 },
        isMobile: true,
      },
    },
    // Add more browser/viewport combinations as needed
  ],

  // Dev server configuration
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
```

## Project Structure

```
fe/
├── tests/
│   ├── _setup.ts              # Common test setup
│   ├── about.spec.ts          # About page tests
│   ├── auth.spec.ts           # Authentication tests
│   ├── index.spec.ts          # Homepage tests
│   └── hars/                  # HAR files for API mocking
│       └── index/
│           ├── auth/
│           └── dashboard/
├── .tests/                    # Generated test outputs
│   ├── test-report/          # HTML reports
│   ├── test-results/         # Test execution results
│   └── snaps/                # Baseline screenshots
└── playwright.config.ts      # Playwright configuration
```

## Testing Approach

### 1. Visual Regression Testing Strategy

Our approach uses a **baseline comparison model**:

- **Master Branch**: Generates and stores baseline screenshots
- **Pull Requests**: Compare against master's baseline
- **Storage**: Use GitHub Artifacts or dedicated branch for baselines

### 2. Test Types

#### Viewport Screenshots
For testing page layouts and general UI:

```typescript
test('page layout', async ({ page }) => {
  await page.goto('/about')
  await page.waitForLoadState('networkidle')

  await expect(page).toHaveScreenshot('about-page.png', {
    animations: 'disabled',
  })
})
```

#### Component Screenshots
For testing specific UI components like modals:

```typescript
test('modal component', async ({ page }) => {
  await page.getByTestId('open-modal-button').click()
  const modal = page.locator('[data-testid="modal"]')
  await modal.waitFor()

  await expect(modal).toHaveScreenshot('modal.png', {
    animations: 'disabled',
  })
})
```

### 3. API Mocking with HAR Files

Record and replay API responses for consistent testing:

```typescript
async function setupAPIMocks(page: Page) {
  await page.routeFromHAR('./tests/hars/index/auth/me.har', {
    url: '*/**/api/auth/me',
  })

  await page.routeFromHAR('./tests/hars/index/dashboard/data.har', {
    url: '*/**/api/dashboard/data',
  })
}

test.beforeEach(async ({ page }) => {
  await setupAPIMocks(page)
})
```

### 4. Authentication Helper

Create a reusable authentication setup:

```typescript
// tests/_setup.ts
import { test as base } from '@playwright/test'

export const test = base.extend({
  auth: async ({ page }, use) => {
    const authenticate = async () => {
      await page.goto('/auth')
      await page.getByTestId('email-input').fill('test@example.com')
      await page.getByTestId('password-input').fill('password')
      await page.getByTestId('sign-in-button').click()
      await page.waitForURL('/')
    }
    await use(authenticate)
  },
})

// Usage in tests
test('authenticated page', async ({ page, auth }) => {
  await auth()
  await page.goto('/dashboard')
  // Test authenticated content
})
```

## CI/CD Integration

### GitHub Actions Workflows

#### 1. Baseline Generation Workflow (`playwright-baseline.yml`)

Runs on master push to generate baseline screenshots:

```yaml
name: Playwright Baseline

on:
  push:
    branches: [ master ]

permissions:
  contents: read

jobs:
  generate-baseline:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: 22.18.0

    - name: Cache dependencies
      uses: actions/cache@v4
      with:
        path: fe/node_modules
        key: yarn-${{ hashFiles('fe/yarn.lock') }}

    - name: Install dependencies
      if: steps.cache.outputs.cache-hit != 'true'
      working-directory: ./fe
      run: yarn install --frozen-lockfile

    - name: Install Playwright
      working-directory: ./fe
      run: |
        if [ "${{ steps.cache.outputs.cache-hit }}" != "true" ]; then
          npx playwright install --with-deps
        else
          npx playwright install-deps
        fi

    - name: Generate baseline screenshots
      working-directory: ./fe
      run: npx playwright test --update-snapshots

    - name: Upload baseline artifacts
      uses: actions/upload-artifact@v4
      with:
        name: playwright-baseline-snapshots
        path: fe/.tests/snaps/
        retention-days: 90
        overwrite: true
```

#### 2. PR Testing Workflow (`playwright-pr.yml`)

Runs on PRs to compare against baseline:

```yaml
name: Playwright PR Tests

on:
  pull_request:
    branches: [ master ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Download baseline snapshots
      uses: dawidd6/action-download-artifact@v6
      with:
        workflow: playwright-baseline.yml
        name: playwright-baseline-snapshots
        path: fe/.tests/snaps/
        branch: master

    - name: Run Playwright tests
      working-directory: ./fe
      run: npx playwright test

    - name: Upload test report
      if: always()
      uses: actions/upload-artifact@v4
      with:
        name: playwright-report-${{ github.event.pull_request.number }}
        path: fe/.tests/test-report/
        retention-days: 30
```

### Storage Options for Baselines

#### Option 1: GitHub Artifacts (Recommended for small projects)
- Store baselines as artifacts
- 90-day retention
- No repository bloat

#### Option 2: Dedicated Git Branch
- Store in `playwright-baselines` branch
- Use force push to avoid history accumulation
- Always accessible

#### Option 3: External Storage (S3, Azure Blob)
- For large projects with many screenshots
- Unlimited retention
- Additional infrastructure required

## Best Practices

### 1. Test Data Attributes

Add `data-testid` attributes for reliable element selection:

```vue
<template>
  <button data-testid="submit-button" @click="submit">
    Submit
  </button>

  <div v-if="isModalOpen" data-testid="modal-overlay">
    <div data-testid="modal-content">
      <!-- Modal content -->
    </div>
  </div>
</template>
```

### 2. Screenshot Optimization

#### Viewport vs Full Page
- **Viewport**: Faster, smaller files, tests visible content
- **Full Page**: Complete page validation, larger files

```typescript
// Viewport screenshot (default)
await expect(page).toHaveScreenshot('page.png')

// Full page screenshot
await expect(page).toHaveScreenshot('page-full.png', {
  fullPage: true
})
```

#### Component-specific Screenshots
Focus on specific elements to reduce noise:

```typescript
const component = page.locator('[data-testid="component"]')
await expect(component).toHaveScreenshot('component.png')
```

### 3. Handling Dynamic Content

#### Disable Animations
```typescript
await expect(page).toHaveScreenshot('page.png', {
  animations: 'disabled',
})
```

#### Wait for Network Idle
```typescript
await page.waitForLoadState('networkidle')
```

#### Mock Time-based Content
```typescript
await page.addInitScript(() => {
  Date.now = () => new Date('2024-01-01').getTime()
})
```

### 4. Multiple Viewports

Test responsive designs across different screen sizes:

```typescript
const viewports = [
  { width: 360, height: 800, name: 'mobile' },
  { width: 768, height: 1024, name: 'tablet' },
  { width: 1920, height: 1080, name: 'desktop' },
]

for (const viewport of viewports) {
  test(`layout at ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto('/')
    await expect(page).toHaveScreenshot(`home-${viewport.name}.png`)
  })
}
```

## Common Patterns

### Modal Testing
```typescript
test('modal interaction', async ({ page }) => {
  // Open modal
  await page.getByTestId('open-modal').click()
  const modal = page.locator('[data-testid="modal"]')
  await modal.waitFor()

  // Test empty state
  await expect(modal).toHaveScreenshot('modal-empty.png')

  // Fill form
  await modal.getByTestId('input').fill('test data')

  // Test filled state
  await expect(modal).toHaveScreenshot('modal-filled.png')
})
```

### Form States
```typescript
test('form validation states', async ({ page }) => {
  const form = page.locator('[data-testid="form"]')

  // Empty state
  await expect(form).toHaveScreenshot('form-empty.png')

  // Invalid state
  await form.getByTestId('email').fill('invalid')
  await form.getByTestId('submit').click()
  await expect(form).toHaveScreenshot('form-invalid.png')

  // Valid state
  await form.getByTestId('email').fill('valid@email.com')
  await expect(form).toHaveScreenshot('form-valid.png')
})
```

### Error Handling
```typescript
test('error states', async ({ page }) => {
  // Mock error response
  await page.route('**/api/data', route => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' })
    })
  })

  await page.goto('/')
  await expect(page.locator('.error-message')).toHaveScreenshot('error-state.png')
})
```

## Running Tests

### Local Development

```bash
# Run all tests
yarn playwright test

# Run with UI mode
yarn playwright test --ui

# Run specific test file
yarn playwright test tests/auth.spec.ts

# Update snapshots
yarn playwright test --update-snapshots

# Run specific browser
yarn playwright test --project=chromium-1920
```

### Debugging

```bash
# Debug mode
yarn playwright test --debug

# Generate trace
yarn playwright test --trace on

# View trace
yarn playwright show-trace trace.zip
```

## Troubleshooting

### Common Issues

1. **Flaky Screenshots**
   - Ensure animations are disabled
   - Wait for network idle
   - Use consistent viewport sizes

2. **Different OS Baselines**
   - Use Docker containers in CI
   - Platform-specific snapshots with `-{platform}` suffix

3. **Large Screenshot Files**
   - Use component-specific screenshots
   - Optimize viewport sizes
   - Consider WebP format

4. **Missing Dependencies**
   - Run `npx playwright install-deps` for system dependencies
   - Ensure browsers are cached in CI

## Summary

This Playwright testing approach provides:

- ✅ **Reliable visual regression testing**
- ✅ **Automated baseline management**
- ✅ **CI/CD integration**
- ✅ **Efficient screenshot comparison**
- ✅ **Cross-browser testing**
- ✅ **Responsive design validation**

The key is maintaining a single source of truth for baselines (master branch) and comparing all changes against it, ensuring UI consistency across deployments.