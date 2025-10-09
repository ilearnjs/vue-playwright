# Adding Playwright Visual Testing to an Existing Project

This guide walks you through setting up Playwright for visual regression testing in an existing project, following the approach used in this repository.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#install-and-configure-playwright)
3. [Mocking data](#mocking-data)
4. [Setup CI workflow](#setup-ci-workflow)
5. [AWS setup](#aws-setup)
6. [Tips](#tips)

## Prerequisites

- A web application that can be run locally
- Access to staging API (for HAR recording)

## Install and configure Playwright


Note: The recommended location to install Playwright is in the root of your frontend project. Alternatively, it can be installed as a separate package in a monorepo.

```bash
npm init playwright@latest
```

You can use default options for all steps.

Update your `playwright.config.ts` with the following configuration:

```ts
export default defineConfig({
  // save test results, snapshots, and reports in .tests folder
  // .tests folder should be gitignored
  outputDir: "./.tests/test-results/",
  snapshotPathTemplate:
    "./.tests/snaps/{testFilePath}/{arg}-{projectName}-{platform}{ext}",
  reporter: [
    [
      "html",
      {
        outputFolder: "./.tests/test-report",
        open: "never",
      },
    ],
    process.env.CI ? ["github"] : ["line"],
  ],

  // trace: 'on' is useful to see full page screenshots even for successful tests
  use: {
    trace: "on",
  },
  // list of browsers to test against
  projects: [
    // ...
  ],
  // start web app before tests
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173",
  },
});
```

## Add simple visual test

```ts
import { test, expect } from "@playwright/test";

test.describe("Index Page Visual Tests", () => {
  test("init state", async ({ page }) => {
    await page.goto("/");
    expect(await page.screenshot()).toMatchSnapshot("index-page.png");
  });
});
```

## Mocking data

### HAR recording

To make visual tests independent from backend state, we will use HAR recording and routing. The idea is to record all API calls the page makes and route them to HAR files during tests.
Additional details can be found in the [Playwright HAR documentation](https://playwright.dev/docs/mock#mocking-with-har-files).

```ts
import { test, expect } from "@playwright/test";

test.describe("Index Page Visual Tests", () => {
  test("init state", async ({ page }) => {
    // route api calls to HAR file
    await page.routeFromHAR("./tests/hars/index_api", {
      url: "*/**/api/index",
      update: true, // update HAR file with new requests
    });

    await page.goto("/");
    expect(await page.screenshot()).toMatchSnapshot("index-page.png");
  });
});
```

[!IMPORTANT]
After backend changes HAR files should be updated by running tests with `update: true` option.

[!IMPORTANT]
After recording HAR files make sure to set `update` option to `false` or remove it completely.

[!IMPORTANT]
HAR files shouldn't be gitignored.

### Alternative mocking approach

Instead of HAR recording you can use manual mocking. The advantage is that you can create different states more easily. The disadvantage is that mocks should be maintained manually.

We suggest using the Faker library to generate mock data.
Faker allows you to generate realistic random data. To make visual tests stable, you need to set a seed.

For more details see [Faker documentation](https://fakerjs.dev/).
For full example check [PR](https://github.com/ilearnjs/vue-playwright/pull/18).

Example:

```ts
import { faker } from "@faker-js/faker";
import type { User } from "@/api";

// Set seed for consistent data in visual tests
faker.seed(123);

export function generateUser(): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
  };
}
```

[!IMPORTANT]
Use types from your app to type mock data.

## Setup CI workflow

We use GitHub Actions for CI.

### Baseline workflow

The baseline workflow generates baseline snapshots and uploads them as artifacts each time a change is added to the main branch.

Description of the workflow steps:

- Checkout code
- Setup Node.js
- Cache yarn dependencies
- Install yarn dependencies
- Cache playwright
- Install playwright - if playwright cache hit - fast install, if miss - full install including browser download
- Generate baseline snapshots
- Upload baseline snapshots as artifact - we use GH for storing artifacts
- Generate summary

### PR workflow

The PR workflow compares PR snapshots with the baseline each time a pull request is opened, updated, or after the baseline workflow is completed.

Description of the workflow steps:

- Checkout code
- Setup Node.js
- Cache yarn dependencies
- Install yarn dependencies
- Cache playwright
- Install playwright - if playwright cache hit - fast install, if miss - full install including browser download
- Download baseline snapshots artifact
- Verify baseline snapshots are downloaded
- Tests - compare PR snapshots with baseline
- Generate unique report path - generate unique path for HTML report to avoid conflicts
- Configure AWS credentials
- Upload report to S3 - upload HTML report to S3 to make it accessible via public URL
- Upload test report
- Generate summary

[!IMPORTANT]
This workflow will not work for free private repositories.

## AWS setup

To make HTML reports accessible, we upload them to S3 and use CloudFront to deliver them.

[!IMPORTANT]
Many platforms can be used (Azure, Google Cloud, Netlify, etc.). We use Amazon AWS as an example. Cloud platforms like AWS, Azure, or Google Cloud provide more flexibility than platforms like Netlify but require additional configuration. Choose what works best for you.

### S3 setup

1. Signup/signin to [AWS Management Console](https://console.aws.amazon.com)
2. Navigate to S3 (search for "S3" in the top search bar)
3. Click the **"Create bucket"** button
4. Configure bucket settings:

- **AWS Region**: Select the region closest to your team's location (you can change the region in the top right corner)
- **Bucket name**: `playwright-reports-yourproject` (must be globally unique)
- **Object Ownership**: Keep "ACLs disabled" (recommended)
- **Block Public Access settings**:
  - ✅ Keep all boxes **checked**
  - Click to confirm "Block all public access"

- **Bucket Versioning**:

  - Keep default **"Disable"**

- **Encryption**:
  - Keep default "Server-side encryption with Amazon S3 managed keys (SSE-S3)"
- **Advanced settings**:
  - Keep default "Disable"

5. Click **"Create bucket"**

### Step 5.1.1: Configure S3 Lifecycle Rules (Optional but Recommended)

To automatically delete old test reports and save storage costs:

1. Open your newly created bucket
2. Go to the **"Management"** tab
3. Click **"Create lifecycle rule"**
4. Configure the rule:
   - **Lifecycle rule name**: `delete-old-reports`
   - **Rule scope**: Choose **"Apply to all objects in the bucket"** or use prefix `playwright-reports/` if you organize by folders

5. **Lifecycle rule actions**:
   - ✅ Check **"Expire current versions of objects"**
   - Set **"Days after object creation"**: `60` (or your preferred retention period)

6. Click **"Create rule"**

[!IMPORTANT]
This will permanently delete reports after the specified period. Adjust the retention period based on your team's needs. Common settings:
- 7 days for feature branch PRs
- 30 days for main branch reports
- 90 days for release reports

### CloudFront setup

1. Signup/signin to [AWS Management Console](https://console.aws.amazon.com)

2. Navigate to CloudFront (search for "CloudFront" in the top search bar)

3. Click **"Create distribution"** and configure:
   - **Origin domain** - select your S3 bucket from dropdown
   - **Origin path**: Leave empty or set to `/playwright-reports` if you organize reports in a folder
   - **Name**: Auto-filled (keep as is)

4. **Origin Access**:
   - Select **"Yes use OAI (bucket can restrict access to only CloudFront)"**
   - **Origin access identity**: Create new OAI
   - **Bucket policy**: Select **"Yes, update the bucket policy"**

5. **Web Application Firewall**: **Do not enable security protection** (unless you need extra security)
   

6. **Additional Settings**:

   **AWS WAF web ACL**: **None** (unless you need extra security)

   **Alternate domain name (CNAME)**: Leave empty (unless you have a custom domain)

   **Custom SSL certificate**: Keep default

7. Click **"Create distribution"**

### Step 5.3: GH secrets/variables

To find your GitHub repository secrets and variables, go to your repository -> settings -> secrets and variables -> actions

Add following secrets to your repository:

- AWS_ACCESS_KEY_ID - access key id for user with programmatic access and permissions to upload to S3
- AWS_SECRET_ACCESS_KEY - secret access key for user with programmatic access and permissions to upload to S3
- AWS_REGION - e.g. us-east-1
- S3_BUCKET - name of the S3 bucket

Add following variables to your repository:

- CLOUDFRONT_URL - URL of the CloudFront distribution

[!IMPORTANT]
It is not a good idea to share an AWS S3 bucket URL publicly. Instead, we suggest using CloudFront.

### Tips

- Ask AI to write tests (e.g., Claude Code, Codex)
- Do not ask AI to write all tests in one go. Instead, proceed step by step, test by test, reviewing after each step, asking for fixes, committing changes, and repeating the process
