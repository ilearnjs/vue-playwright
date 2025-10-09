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
    command: "npm dev",
    url: "http://localhost:5173",
  },
});
```

### Step 2: Add simple visual test

```ts
import { test, expect } from "@playwright/test";

test.describe("Index Page Visual Tests", () => {
  test("init state", async ({ page }) => {
    await page.goto("/");
    expect(await page.screenshot()).toMatchSnapshot("index-page.png");
  });
});
```

### Step 3: Mocking data

### Step 3.1: HAR recording

To make visual tests independent from backend state we will use HAR recording and routing. The idea is to record all api calls the page makes and route them to HAR file during tests.
Additional details can be found here [Playwright HAR documentation](https://playwright.dev/docs/mock#mocking-with-har-files).

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

!important: after backend changes HAR files should be updated by running tests with `update: true` option.
!important: after recording HAR files make sure to set `update` option to `false` or remove it completely.
!important: HAR files shouldn't be gitignored.

### Step 3.2: Alternative mocking approach

Instead of HAR recording you can use manual mocking. The advantage is that you can create different states more easily. The disadvantage is that mocks should be maintained manually.

We suggest to use Faker library to generate mock data.
Faker allows to generate good looking random data. To make visual tests stable you need to set seed.

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

!important: use types from your app to type mock data.

### Step 4: Setup CI workflow

We use Github Actions for CI.

### Step 4.1: Baseline workflow

Baseline workflow generates baseline snapshots and uploads them as artifacts each time change added to main branch.

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

### Step 4.2: PR workflow

PR workflow compares pr snapshots with baseline each time a pull request is opened or updated or after baseline workflow is completed.

Description of the workflow steps:

- Checkout code
- Setup Node.js
- Cache yarn dependencies
- Install yarn dependencies
- Cache playwright
- Install playwright - if playwright cache hit - fast install, if miss - full install including browser download
- Download baseline snapshots artifact
- Verify baseline snapshots are downloaded
- Tests - compare pr snapshots with baseline
- Generate unique report path - generate unique path for html report to avoid conflicts
- Configure AWS credentials
- Upload report to S3 - upload html report to S3 to make it accessible via public url
- Upload test report
- Generate summary

!important: this workflow will not work for free private repositories

### Step 5: AWS setup

To make html report accessible we upload it to S3 and use Cloudfront to deliver it.

!important: a lot of platforms can be used (azure, google cloud, netlify...). We use amazon as an example. Cloud platforms like AWS or azure or google cloud provide more flexibility then platforms like netlify but requires additional configuration. Chose what works best for you.

### Step 5.1: S3 setup

1. Signup/signin to [AWS Management Console](https://console.aws.amazon.com)
2. Navigate to S3 (search for "S3" in the top search bar)
3. Click the **"Create bucket"** button
4. Configure bucket settings:

- **AWS Region**: region can be changed in the right top corner, select region closest to team location
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

### Step 5.2: Cloudfront setup

1. Signup/signin to [AWS Management Console](https://console.aws.amazon.com)

2. Navigate to CloudFront (search for "CloudFront" in the top search bar)

3. 
  - **distribution name** - e.g. playwright-reports-distribution

  - **Origin type**: - Amazon S3, `playwright-reports-yourproject.s3.amazonaws.com`

  - **S3 origin** - select your bucket

  - **Origin path**: Leave empty

3. **Name**: Auto-filled (keep as is)

4. **Create S3**:
   - Select **"Yes use OAI (bucket can restrict access to only CloudFront)"**
   - **Origin access identity**: Select the OAI you created earlier
   - **Bucket policy**: Select **"Yes, update the bucket policy"**
   - **Web Application Firewall**: **Do not enable securinty protection** (unless you need extra security)
5. Click **"Create distribution"**
   

#### Create Distribution:

1. **Price class**:
   - **Use only North America and Europe** (for cost savings)
   - Or **Use all edge locations** (for best performance)

2. **AWS WAF web ACL**: **None** (unless you need extra security)

3. **Alternate domain name (CNAME)**: Leave empty (unless you have a custom domain)

4. **Custom SSL certificate**: Keep default

5. Go to end and click **"Create distribution"**

### Step 5.3: GH secrets/variables

To find your GitHub repository secrets and variables, go to your repository -> settings -> secrets and variables -> actions

Add following secrets to your repository:

- AWS_ACCESS_KEY_ID - access key id for user with programmatic access and permissions to upload to S3
- AWS_SECRET_ACCESS_KEY - secret access key for user with programmatic access and permissions to upload to S3
- AWS_REGION - e.g. us-east-1
- S3_BUCKET - name of the S3 bucket

Add following variables to your repository:

- CLOUDFRONT_URL - url of the Cloudfront distribution

!important: that is not a good idea to share aws s3 bucket publicly. Instead we suggests to use CloudFront

### Tips

- ask AI to write tests (e.g. Claude Code, Codex)
- do not ask AI to wite all test in one go, do it step by step, test by test, review after each step, ask to make fixes, commit changes, repeat
