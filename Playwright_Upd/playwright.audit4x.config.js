// @ts-check
const { defineConfig, devices } = require("@playwright/test");
require('dotenv').config();

module.exports = defineConfig({
  globalSetup: "./global-Setup",
  testDir: "./tests/Serial",
  testMatch: [
    "Audit_StartPMandWM_4x.spec.ts",
    "11a_Audit_WorkItem_4x.spec.ts",
    "11b_Audit_ProcessInstance_4x.spec.ts",
    "11c_Audit_Cases_4x.spec.ts",
    "11d_Audit_UsersResources_4x.spec.ts",
    "11e_Audit_ProcessTemplate_4x.spec.ts",
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [
    ["line"],
    ["allure-playwright"],
    ["html"],
  ],
  timeout: 60000,
  use: {
    headless: true,
    browserName: "chromium",
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    storageState: "./fixtures/auth.json",
  },
  projects: [
    {
      name: "chromium",
      use: {
        headless: false,
        browserName: "chromium",
        screenshot: "only-on-failure",
        trace: "retain-on-failure",
        ...devices["Desktop Chrome"],
      },
    },
  ],
});
