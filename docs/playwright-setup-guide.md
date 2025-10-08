# Adding Playwright Visual Testing to an Existing Project

This guide walks you through setting up Playwright for visual regression testing in an existing project, following the approach used in this repository.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Setting Up Mock Data](#setting-up-mock-data)
5. [Writing Your First Visual Test](#writing-your-first-visual-test)
6. [GitHub Actions Integration](#github-actions-integration)
7. [AWS Setup for Reports](#aws-setup-for-reports)
8. [Best Practices](#best-practices)

## Prerequisites

- Web app we want to test (locally runnable)
- Access to staging api (for HAR recording)s

## Installation

### Step 1: Install Playwright

Note: the recommended location to install Playwright is in the root of your frontend project. Alternatively it can be installed as a separate package in a monorepo.

```bash
npm init playwright@latest
```

During installation, you'll be prompted to:
- Choose between TypeScript or JavaScript (recommend TypeScript)
- Name your tests folder (default: `tests` or `e2e`)
- Add GitHub Actions workflow (select Yes for CI/CD integration)
- Install Playwright browsers (select Yes)

### Step 2: Install Additional Dependencies

For comprehensive visual testing with mock data:

```bash
# Install faker for mock data generation
npm install --save-dev @faker-js/faker

# Or with yarn
yarn add -D @faker-js/faker
```

## Configuration

### Step 3: Configure Playwright for Visual Testing

Create or update `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',

  // Test match pattern
  testMatch: '**/*.spec.ts',

  // Timeout for each test
  timeout: 30 * 1000,

  // Number of parallel workers
  workers: process.env.CI ? 1 : undefined,

  // Reporter configuration
  reporter: [
    ['html'],
    ['list'],
    ['json', { outputFile: 'test-results.json' }]
  ],

  // Shared test configuration
  use: {
    // Base URL for your application
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on failure
    video: 'retain-on-failure',

    // Viewport size for consistency
    viewport: { width: 1280, height: 720 },
  },

  // Projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browsers as needed
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // Local dev server configuration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
```

### Step 4: Add Script Commands

Update your `package.json`:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug",
    "test:e2e:update": "playwright test --update-snapshots",
    "test:report": "playwright show-report"
  }
}
```

## Setting Up Mock Data

### Step 5: Create Mock Data Structure

Create a directory structure for your mocks:

```
tests/
├── mocks/
│   ├── index.ts          # Central exports
│   ├── api/
│   │   ├── har/          # HAR files storage
│   │   │   └── api.har   # Recorded API responses
│   │   └── generators/   # Faker generators
│   │       ├── users.ts
│   │       └── products.ts
│   └── fixtures/         # Static mock data
│       └── constants.ts
└── visual/               # Visual tests
    └── homepage.spec.ts
```

### Step 6: Set Up HAR Recording

Create a HAR recording script `tests/mocks/api/record-har.ts`:

```typescript
import { chromium } from '@playwright/test';

async function recordHAR() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordHar: {
      path: './tests/mocks/api/har/api.har',
      urlFilter: '**/api/**',
      mode: 'full',
    },
  });

  const page = await context.newPage();

  // Navigate and interact with your app
  await page.goto('http://localhost:3000');

  // Perform actions that trigger API calls
  // Add your specific interactions here

  // Wait for network to settle
  await page.waitForLoadState('networkidle');

  // Close and save
  await context.close();
  await browser.close();

  console.log('HAR file recorded successfully!');
}

recordHAR();
```

### Step 7: Create Faker Generators

Create `tests/mocks/api/generators/users.ts`:

```typescript
import { faker } from '@faker-js/faker';

// Set seed for consistent data
faker.seed(123);

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export function generateUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    ...overrides,
  };
}

export function generateUsers(count: number): User[] {
  return Array.from({ length: count }, () => generateUser());
}
```

## Writing Your First Visual Test

### Step 8: Create a Visual Test

Create `tests/visual/homepage.spec.ts`:

```typescript
import { test, expect, Page } from '@playwright/test';
import { generateUser } from '../mocks/api/generators/users';

// Helper function to set up mocks
async function setupMocks(page: Page) {
  // Option 1: Use HAR file
  await page.routeFromHAR('./tests/mocks/api/har/api.har', {
    url: '**/api/**',
    update: false,
  });

  // Option 2: Use faker generators
  const user = generateUser();

  await page.route('**/api/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(user),
    });
  });
}

test.describe('Homepage Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup mocks before navigation
    await setupMocks(page);

    // Navigate to page
    await page.goto('/');

    // Wait for content to load
    await page.waitForLoadState('networkidle');
  });

  test('should match homepage snapshot', async ({ page }) => {
    // Take full page screenshot
    await expect(page).toHaveScreenshot('homepage-full.png', {
      fullPage: true,
      animations: 'disabled',
      mask: [page.locator('[data-testid="timestamp"]')], // Mask dynamic content
    });
  });

  test('should match header component', async ({ page }) => {
    const header = page.locator('header');

    await expect(header).toHaveScreenshot('header-component.png', {
      animations: 'disabled',
    });
  });

  test('should match mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      fullPage: true,
      animations: 'disabled',
    });
  });
});
```

### Step 9: Run Your First Test

```bash
# Run tests and generate initial snapshots
npm run test:e2e

# Review tests in UI mode
npm run test:e2e:ui

# Update snapshots after intentional changes
npm run test:e2e:update
```

## GitHub Actions Integration

### Step 10: Create Baseline Generation Workflow

Create `.github/workflows/playwright-baseline.yml`:

```yaml
name: Playwright Baseline Generation

on:
  push:
    branches: [main, master]

jobs:
  generate-baseline:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Run Playwright tests
        run: npm run test:e2e -- --update-snapshots

      - name: Upload baseline snapshots
        uses: actions/upload-artifact@v4
        with:
          name: playwright-baseline
          path: |
            tests/**/*.png
            tests/**/*.jpg
          retention-days: 30
```

### Step 11: Create PR Testing Workflow

Create `.github/workflows/playwright-pr.yml`:

```yaml
name: Playwright PR Tests

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  visual-tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Download baseline snapshots
        uses: dawidd6/action-download-artifact@v3
        with:
          workflow: playwright-baseline.yml
          name: playwright-baseline
          path: tests/
          branch: main

      - name: Run Playwright tests
        run: npm run test:e2e
        continue-on-error: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7

      - name: Upload diff images
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-diff
          path: test-results/
          retention-days: 7

      - name: Comment PR with results
        if: always()
        uses: actions/github-script@v7
        with:
          script: |
            const fs = require('fs');
            const results = JSON.parse(fs.readFileSync('test-results.json', 'utf8'));

            const comment = `## 📸 Visual Test Results

            **Status**: ${results.status === 'passed' ? '✅ Passed' : '❌ Failed'}
            **Tests Run**: ${results.tests.length}
            **Duration**: ${results.duration}ms

            ${results.status === 'failed' ?
              'View the artifacts for diff images and detailed report.' :
              'All visual tests passed successfully!'}`;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

## AWS Setup for Reports

### Step 12: Configure S3 and CloudFront

Create `scripts/setup-aws.sh`:

```bash
#!/bin/bash

# Variables
BUCKET_NAME="your-project-playwright-reports"
REGION="us-east-1"

# Create S3 bucket
aws s3api create-bucket \
  --bucket $BUCKET_NAME \
  --region $REGION

# Enable static website hosting
aws s3 website s3://$BUCKET_NAME/ \
  --index-document index.html \
  --error-document error.html

# Create bucket policy for public read
cat > bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET_NAME/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket $BUCKET_NAME \
  --policy file://bucket-policy.json

# Create CloudFront distribution
aws cloudfront create-distribution \
  --origin-domain-name $BUCKET_NAME.s3.amazonaws.com \
  --default-root-object index.html

echo "AWS setup complete!"
```

### Step 13: Update GitHub Actions to Upload to S3

Add to your workflow:

```yaml
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Upload report to S3
        if: always()
        run: |
          TIMESTAMP=$(date +%Y%m%d-%H%M%S)
          PR_NUMBER=${{ github.event.pull_request.number }}
          S3_PATH="s3://your-bucket/reports/pr-${PR_NUMBER}/${TIMESTAMP}/"

          aws s3 sync playwright-report/ $S3_PATH --delete

          echo "Report URL: https://your-cloudfront-domain.com/reports/pr-${PR_NUMBER}/${TIMESTAMP}/index.html"
```

## Best Practices

### Directory Organization

```
tests/
├── visual/           # Visual regression tests
├── functional/       # Functional tests (if any)
├── mocks/           # Mock data and generators
├── fixtures/        # Test fixtures and helpers
├── utils/           # Utility functions
└── screenshots/     # Screenshot baselines (git-ignored)
```

### Test Writing Guidelines

1. **Use Page Object Model for complex pages:**

```typescript
// tests/pages/HomePage.ts
export class HomePage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('/');
  }

  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  get header() {
    return this.page.locator('header');
  }

  async takeScreenshot(name: string) {
    await expect(this.page).toHaveScreenshot(name, {
      fullPage: true,
      animations: 'disabled',
    });
  }
}
```

2. **Create reusable test utilities:**

```typescript
// tests/utils/helpers.ts
export async function disableAnimations(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
}
```

3. **Handle dynamic content:**

```typescript
test('screenshot with masked dynamic content', async ({ page }) => {
  await expect(page).toHaveScreenshot('page.png', {
    mask: [
      page.locator('[data-testid="timestamp"]'),
      page.locator('[data-testid="random-id"]'),
    ],
    // Or use CSS selectors
    stylePath: './tests/visual/hide-dynamic.css',
  });
});
```

### Troubleshooting Common Issues

| Issue | Solution |
|-------|----------|
| Screenshots differ between local and CI | Ensure same OS/browser versions, use Docker locally |
| Fonts rendering differently | Install same fonts in CI, or use web fonts |
| Animation issues | Always disable animations, add wait conditions |
| Network timing issues | Use `waitForLoadState('networkidle')` |
| Flaky tests | Add explicit waits, increase timeouts, check for race conditions |

### Performance Optimization

1. **Run tests in parallel:**
```typescript
// playwright.config.ts
export default defineConfig({
  workers: process.env.CI ? 2 : 4,
  fullyParallel: true,
});
```

2. **Use sharding for large test suites:**
```bash
# In CI, split tests across multiple jobs
npx playwright test --shard=1/3
npx playwright test --shard=2/3
npx playwright test --shard=3/3
```

3. **Optimize browser context reuse:**
```typescript
test.describe('Tests with shared context', () => {
  let context: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
  });

  test.afterAll(async () => {
    await context.close();
  });

  test('test 1', async () => {
    const page = await context.newPage();
    // ... test code
  });
});
```

## Next Steps

1. ✅ Complete basic setup
2. 📝 Write visual tests for critical user flows
3. 🔄 Set up CI/CD pipelines
4. ☁️ Configure cloud storage for reports
5. 📊 Create dashboards for test metrics
6. 📚 Document your specific test patterns
7. 🎓 Train team on visual testing best practices

## Additional Resources

- [Official Playwright Documentation](https://playwright.dev)
- [Visual Testing Best Practices](https://playwright.dev/docs/test-snapshots)
- [GitHub Actions for Playwright](https://playwright.dev/docs/ci-github-actions)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

## Support

For questions specific to this setup:
- Create an issue in the repository
- Consult the team's Playwright champion
- Review existing test examples in the codebase