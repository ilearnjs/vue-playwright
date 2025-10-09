import { defineConfig, devices } from '@playwright/test'

// Chromium – 3 breakpoints
const projectsChromium = [
  {
    name: 'chromium-pixel5',
    use: {
      ...devices['Pixel 5'],
      viewport: { width: 360, height: 800 },
      isMobile: true,
      hasTouch: true
    }
  },
  {
    name: 'chromium-768',
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 768, height: 800 }
    }
  },
  {
    name: 'chromium-1920',
    use: {
      ...devices['Desktop Chrome'],
      viewport: { width: 1920, height: 800 }
    }
  }
]

// WebKit – 2 breakpoints
const projectsWebKit = [
  {
    name: 'webkit-360',
    use: {
      ...devices['Desktop Safari'],
      viewport: { width: 360, height: 800 },
      isMobile: true,
      hasTouch: true
    },
  },
  {
    name: 'webkit-1920',
    use: {
      ...devices['Desktop Safari'],
      viewport: { width: 1920, height: 800 }
    }
  }
]

// Mobile Safari (iOS emulation) – 1 breakpoint
const projectsSafari = [
  {
    name: 'mobile-safari-iphone12',
    use: { ...devices['iPhone 12'] }
  }
]

// Firefox – 1 breakpoint
const projectsFirefox = [
  {
    name: 'firefox-1920',
    use: {
      ...devices['Desktop Firefox'],
      viewport: { width: 1920, height: 800 }
    }
  }
]

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: undefined,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on'
  },

  outputDir: './.tests/test-results/',
  snapshotPathTemplate: './.tests/snaps/{testFilePath}/{arg}-{projectName}-{platform}{ext}',
  reporter: [
    ['html', {
      outputFolder: './.tests/test-report',
      open: 'never'
    }],
    process.env.CI ? ['github'] : ['line'],
  ],

  projects: [
    ...projectsChromium,
    ...projectsWebKit,
    ...projectsSafari,
    ...projectsFirefox,
  ],
  webServer: {
    command: 'yarn dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI
  }
})
