# Playwright Visual Testing

[Playwright Setup Guide »](./docs/pw-setup-guide.md)

[How to Test Locally »](./docs/pw-local-testing.md)

[Report »](./docs/pw-report.md)

## Quick Introduction

This project uses Playwright for visual regression testing through screenshot comparisons. Our approach focuses on UI consistency validation by capturing and comparing visual snapshots of the application across different states and pull requests.

### Key Features
- **Visual Testing Only**: We use Playwright exclusively for screenshot testing, not functional testing
- **Mocked Backend**: All backend responses are mocked to ensure consistent, fast, and reliable tests
- **Automated CI/CD**: GitHub Actions handles baseline generation and PR validation
- **Cloud Storage**: Test reports and snapshots are stored on AWS (S3 + CloudFront)

## Current Approach Overview

### Why Visual Testing?
Visual regression testing helps us:
- Detect unintended UI changes early in the development cycle
- Enable confident large-scale refactoring

### Why Mock the Backend?
We chose to mock all backend interactions for several key reasons:

**Advantages:**
1. **Faster Implementation**: Significantly reduces test setup time by eliminating backend dependencies
2. **Reliability**: Tests are not affected by backend availability or data inconsistencies
3. **Deterministic Results**: Consistent data ensures reproducible screenshots every time
4. **Development Velocity**: Frontend developers can write tests immediately without waiting for backend APIs
5. **Isolated Testing**: UI changes can be validated independently from API modifications

**Trade-offs to Consider:**
1. **No Integration Coverage**: Frontend-backend integration issues won't be detected
2. **Mock Maintenance**: API contract changes require updating mock data
3. **Limited Real-World Scenarios**: Some dynamic behaviors and edge cases may not be fully represented

### Data Mocking Approaches

We use two complementary approaches for mocking API responses in our visual tests:

#### 1. HAR Files (Primary Approach)

**HAR (HTTP Archive)** files are JSON-formatted archives that record browser's interactions with a site.

**Why HAR Files?**
- **Minimal Setup**: No need for complex mock servers or third-party mocking libraries
- **Real Data Fidelity**: Record actual API responses from live sessions, ensuring mocks match production behavior exactly
- **Complete HTTP Context**: Preserves all request/response details - headers, cookies, status codes, timing, and payloads
- **Developer-Friendly Workflow**: Export directly from browser DevTools or use Playwright's built-in recording
- **Git-Friendly Format**: JSON structure enables easy diff reviews and version tracking in pull requests
- **Native Playwright Integration**: First-class support via `routeFromHAR()` with automatic request matching
- **Deterministic Testing**: Eliminates flakiness by guaranteeing identical responses across all test runs

**How We Use HARs:**
1. **Recording**: Capture real application traffic during development
2. **Storage**: HAR files are stored in the test directory and committed to the repository
3. **Replay**: Tests use these HAR files to mock all network requests consistently
4. **Maintenance**: Update HAR files when API contracts change

#### 2. Faker Library (Alternative Approach) (check branch: [C-mock](https://github.com/ilearnjs/vue-playwright/tree/C_mock))

For more flexible and programmatic mock data generation, we use the **@faker-js/faker** library.

**Why Faker?**
- **Programmatic Control**: Generate data dynamically with full control over values and patterns
- **Type Safety**: Strongly typed mock data that matches TypeScript interfaces
- **Deterministic Output**: Seeded random generation ensures consistent data across test runs
- **No Recording Required**: Pure code-based approach, no need to capture real API responses
- **Easy Customization**: Override specific fields while keeping other data consistent
- **Rapid Prototyping**: Create mocks before backend APIs are implemented

**How We Use Faker:**
1. **Seeded Generation**: All mock files use `faker.seed(123)` for reproducible data
2. **Domain Organization**: Mock functions separated by feature (auth, transactions, dashboard)
3. **Type Integration**: Generated data matches API TypeScript interfaces
4. **Route Interception**: Used with Playwright's `page.route()` to mock API responses

**When to Use Each Approach:**
- **Use HAR files** when:
  - You need exact production API responses
  - Working with complex third-party APIs
  - Testing specific edge cases from production

- **Use Faker** when:
  - Building tests before backend implementation
  - Need programmatic control over test data
  - Testing various data scenarios systematically
  - Working with simple, well-defined data structures

### Testing Architecture

```
┌─────────────────────────────────────────────┐
│                Pull Request                 │
│                                             │
│  1. Developer pushes code                   │
│  2. GH Action triggers Playwright tests     │
│  3. Screenshots captured & compared         │
│  4. Reports uploaded to S3                  │
│  5. CloudFront serves reports               │
└─────────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────┐
│              Baseline Branch                │
│                                             │
│  • Stores approved screenshots              │
│  • Updated when PR is merged                │
│  • Source of truth for UI appearance        │
└─────────────────────────────────────────────┘
```

## GitHub Actions Workflow

Our CI/CD pipeline consists of two main workflows:

### 1. Baseline Generation Workflow (`playwright-baseline.yml`)
- **Trigger**: Automatically runs when code is pushed to master/main branch
- **Purpose**: Generates reference screenshots for future comparisons
- **Output**: Baseline snapshots stored as GitHub Actions artifacts (not committed to repository)

### 2. PR Testing Workflow (`playwright-pr.yml`)
- **Trigger**: Automatically runs on every pull request or when playwright baseline completes
- **Purpose**: Captures screenshots and compares them against the baseline
- **Output**:
  - Visual diff report highlighting any changes
  - Pass/fail status check on the pull request
  - Comparison artifacts for manual review

## AWS Infrastructure

### S3 Storage
- **Purpose**: Centralized storage for test reports
- **Configuration**: Single bucket for all Playwright test outputs
- **Access**: Configured with appropriate IAM policies for GitHub Actions

### CloudFront CDN
- **Purpose**: Global content delivery network for test reports
- **Key Benefits**:
  - **Security**: Prevents direct S3 bucket exposure while enabling public report access

## Local Development Testing Flow

When working on UI changes locally, you need to test against baseline snapshots. Since we don't commit snapshots to the repository, you generate them locally from the main branch.

## Playwright Tracing

### Full Page Screenshots in Trace Viewer

Playwright's trace viewer provides comprehensive debugging capabilities, including full-page screenshots at each test step. This feature is invaluable for understanding test failures and reviewing UI states.
