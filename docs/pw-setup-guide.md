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
yarn init playwright@latest
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

  // do one retry on CI to write trace
  retries: process.env.CI ? 1 : 0,

  // trace: record trace for first retry
  use: {
    trace: "on-first-retry",
  },
  // list of browsers to test against
  projects: [
    // ...
  ],
  // start web app before tests
  webServer: {
    command: "yarn run dev",
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

> [!NOTE]
> After backend changes HAR files should be updated by running tests with `update: true` option.

> [!NOTE]
>After recording HAR files make sure to set `update` option to `false` or remove it completely.

> [!NOTE]
> HAR files shouldn't be gitignored.

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

> [!NOTE]
> Use types from your app to type mock data.

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

> [!NOTE]
> This workflow will not work for free private repositories.

## AWS setup

To make HTML reports accessible, we upload them to S3 and use CloudFront to deliver them.

> [!NOTE]
> Many platforms can be used (Azure, Google Cloud, Netlify, etc.). We use Amazon AWS as an example. Cloud platforms like AWS, Azure, or Google Cloud provide more flexibility than platforms like Netlify but require additional configuration. Choose what works best for you.

### S3 setup

1. Signup/signin to [AWS Management Console](https://console.aws.amazon.com)
2. Navigate to S3 (search for "S3" in the top search bar)
3. Click the **"Create bucket"** button
4. Configure bucket settings:

- **AWS Region**: Select the region closest to your team's location (you can change the region in the top right corner)
- **Bucket name**: `playwright-reports-yourproject` (must be globally unique)
- **Object Ownership**: Keep "ACLs disabled" (recommended)
- **Block Public Access settings**:
  - Keep all boxes **checked**
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
   - Check **"Expire current versions of objects"**
   - Set **"Days after object creation"**: `60` (or your preferred retention period)

6. Click **"Create rule"**

> [!NOTE]
> This will permanently delete reports after the specified period. Adjust the retention period based on your team's needs. Common settings:
> - 7 days for feature branch PRs
> - 30 days for main branch reports
> - 90 days for release reports

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

### Step 5.3: Create IAM User for S3 Access

Before adding GitHub secrets, you need to create an AWS IAM user with appropriate S3 permissions:

#### Creating IAM User

1. Navigate to **IAM** in AWS Console (search for "IAM" in the top search bar)

2. Click **"Users"** in the left sidebar, then **"Create user"**

3. Configure user details:
   - **User name**: `github-actions-playwright` (or similar descriptive name)
   - **Access type**: ✅ Check **"Programmatic access"** (provides access key ID and secret)

4. Click **"Next"** to set permissions

#### Setting Permissions

**Create Custom Policy**

1. Click **"Create policy"**
2. Switch to **"JSON"** tab and paste this policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::playwright-reports-yourproject"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::playwright-reports-yourproject/playwright-reports/*"
    }
  ]
}
```

> [!NOTE]
> - Replace `playwright-reports-yourproject` with your actual S3 bucket name
> - The `/playwright-reports/*` path in the second Resource matches the upload path in the GitHub workflow (line 142). If you change the S3 path in your workflow, update this policy accordingly
> - This policy grants minimal permissions needed for the GitHub Actions workflow to use `aws s3 sync --delete`

3. Click **"Next: Tags"**, then **"Next: Review"**
4. **Name**: `GitHubActionsPlaywrightS3Policy`
5. Click **"Create policy"**
6. Return to user creation, select your new policy
7. Click **"Next"**

#### Complete User Creation

1. Review the configuration and click **"Create user"**

2. **IMPORTANT**: On the success page, you'll see:
   - **Access key ID**: Copy this immediately
   - **Secret access key**: Click **"Show"** and copy this immediately

> [!WARNING]
> This is the ONLY time you'll see the secret access key! If you lose it, you'll need to create new credentials.

> [!TIP]
> Save these credentials temporarily in a secure password manager or notepad. You'll add them to GitHub secrets next.

### Step 5.4: GitHub Secrets and Variables

To find your GitHub repository secrets and variables, go to your repository -> Settings -> Secrets and variables -> Actions

Add following **secrets** to your repository:

- **AWS_ACCESS_KEY_ID** - The access key ID you copied from IAM user creation
- **AWS_SECRET_ACCESS_KEY** - The secret access key you copied from IAM user creation
- **AWS_REGION** - Your AWS region (e.g., `us-east-1`, `eu-west-1`)
- **S3_BUCKET_NAME** - Name of your S3 bucket (e.g., `playwright-reports-yourproject`)

Add following **variables** to your repository:

- **CLOUDFRONT_DOMAIN** - Domain of your CloudFront distribution (without https://, e.g., `d1234567890abc.cloudfront.net`)

> [!WARNING]
> It is not a good idea to share an AWS S3 bucket URL publicly. Instead, we suggest using CloudFront.

### Tips

- Ask AI to write tests (e.g., Claude Code, Codex)
- Do not ask AI to write all tests in one go. Instead, proceed step by step, test by test, reviewing after each step, asking for fixes, committing changes, and repeating the process
