import { test, expect, Page, Locator, Browser } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import * as utility from "../../fixtures/utility";
import { ConfigurationPage } from "../../PageObjects/ConfigurationPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { ProcessPage } from "../../PageObjects/ProcessPage";
import { HomePage } from "../../PageObjects/HomePage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { AuditPage } from "../../PageObjects/AuditPage";
import { ProcessInstancesPage } from "../../PageObjects/ProcessInstancesPage";
import { WorkViewsPage } from "../../PageObjects/WorkViewsPage";
import { UserProfilePage } from "../../PageObjects/UserProfile";
import { log } from "console";
import { LoginPage } from "../../PageObjects/LoginPage";
import { UnifiedViewsPage } from "../../PageObjects/UnifiedViewsPage";

const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let processPage: ProcessPage;
let configPage: ConfigurationPage;
let cmPage: CaseManagerPage;
let adPage: AuditPage;
let adPrcoessInstacesPage: ProcessInstancesPage;
let wv: WorkViewsPage;
let wlPage: WorkListPage;
let upPage: UserProfilePage;
let homePage: HomePage;
let caseManager: CaseManagerPage;
let loginPage: LoginPage;
let unifiedViewsPage: UnifiedViewsPage;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  adPage = poManager.getAuditPage();
  loginPage = poManager.getLoginPage();
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  processPage = poManager.getProcessPage();
  configPage = poManager.getConfigurationPage();
  cmPage = poManager.getCaseManagerPage();
  adPrcoessInstacesPage = poManager.getAuditPrcoessInstancesPage();
  wv = poManager.getWorkViewsPage();
  wlPage = poManager.getWorkListPage();
  upPage = poManager.getUserProfilePage();
  homePage = poManager.getHomePage();
  caseManager = poManager.getCaseManagerPage();
  unifiedViewsPage = poManager.getUnifiedViewsPage();
});

test.afterEach(async () => {
  await page.close();
});

test.describe("Unified Views Configuration", () => {
  test.setTimeout(120000);
  test("Navigate to Unified Views screen under settings and Register New System", async () => {
    // Assuming login is handled or page is already authenticated
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();
    // Navigate to Configuration > Unified Views
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();

    // Add assertions or actions for the Unified Views screen
    // For example, check if the screen is loaded
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // If "Test System Name" already exists from a previous run, skip registration
    const alreadyExists = await unifiedViewsPage.getSystemFromList("Test System Name").isVisible({ timeout: 5000 }).catch(() => false);

    if (!alreadyExists) {
      // Click on Register New System button
      await unifiedViewsPage.clickOnRegisterNewSystem();

      // Add assertions or actions for the Register New System functionality
      await expect(page.getByRole('dialog', { name: /Register/i })).toBeVisible();

      //Fill the Register your system form and submit
      await unifiedViewsPage.enterSystemName("Test System Name");

      //Select System Type from dropdown
      await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");

      //Enter System URL
      await unifiedViewsPage.enterSystemURL("http://gasdbpmwin19l02.dev.tibco.com:8081");

      //Click on Save button
      await unifiedViewsPage.clickOnSaveButton();
    }

    // Verify the registered server appears in the "Servers for unified views" list
    await expect(unifiedViewsPage.getSystemFromList("Test System Name")).toBeVisible({ timeout: 15000 });

  });

  test("Verify Test System Name server is visible in the Servers for Unified Views list", async () => {
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Navigate to Configuration > Unified Views
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();

    // Verify the Unified Views screen is loaded
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // Verify "Test System Name" is visible in the Servers for Unified Views list
    await expect(unifiedViewsPage.getSystemFromList("Test System Name")).toBeVisible({ timeout: 15000 });
  });

  test("Click on Test System Name and verify Edit, Delete and Enable Server buttons are visible", async () => {
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Navigate to Configuration > Unified Views
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();

    // Verify the Unified Views screen is loaded
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // Click on "Test System Name" from the server list
    await unifiedViewsPage.clickOnServerFromList("Test System Name");

    // Verify Edit server button is visible
    await expect(unifiedViewsPage.getEditButton()).toBeVisible({ timeout: 20000 });

    // Verify Delete server button is visible
    await expect(unifiedViewsPage.getDeleteButton()).toBeVisible({ timeout: 20000 });

    // Verify Enable server toggle is visible (toggle renders in shadow DOM — use shadow walker)
    await unifiedViewsPage.assertEnableServerVisible();
  });

  test("Click on Edit button and update the server URL", async () => {
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Navigate to Configuration > Unified Views
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();

    // Verify the Unified Views screen is loaded
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // Click on "Test System Name" from the server list
    await unifiedViewsPage.clickOnServerFromList("Test System Name");

    // Click on the Edit server button
    await unifiedViewsPage.clickOnEditButton();

    // Verify the edit form is open by checking the Save button is visible
    await expect(unifiedViewsPage.saveButton).toBeVisible({ timeout: 10000 });

    // Clear the URL field and enter the updated URL
    await unifiedViewsPage.enterEditURL("http://gasdbpmwin19l02.dev.tibco.com:8080");

    // Click Save
    await unifiedViewsPage.clickOnSaveButton();

    // Verify the updated URL is shown in the detail panel
    await expect(page.locator("text=http://gasdbpmwin19l02.dev.tibco.com:8080").first()).toBeVisible({ timeout: 15000 });
  });

  test("Disable the Enable server toggle, confirm via dialog, and verify server is disabled", async () => {
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Navigate to Configuration > Unified Views
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();

    // Verify the Unified Views screen is loaded
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // Disabled servers are removed from the Available servers list entirely.
    // If not visible, register it fresh so the disable step has something to act on.
    const serverExists = await unifiedViewsPage.getSystemFromList("Test System Name").isVisible({ timeout: 5000 }).catch(() => false);
    if (!serverExists) {
      await unifiedViewsPage.clickOnRegisterNewSystem();
      await unifiedViewsPage.enterSystemName("Test System Name");
      await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");
      await unifiedViewsPage.enterSystemURL("http://gasdbpmwin19l02.dev.tibco.com:8080");
      await unifiedViewsPage.clickOnSaveButton();
    }

    // Click on "Test System Name" from the server list
    await unifiedViewsPage.clickOnServerFromList("Test System Name");

    // Verify the Enable server toggle is visible
    await unifiedViewsPage.assertEnableServerVisible();

    // Click the Enable server toggle to disable it
    await unifiedViewsPage.clickOnEnableServerToggle();

    // Confirm the disable dialog by clicking Yes
    await unifiedViewsPage.clickYesOnConfirmDialog();

    // Verify the server is now disabled (toggle aria-checked = false)
    await unifiedViewsPage.assertServerIsDisabled();

    // Wait for the disabled state to propagate before checking the server switcher
    await page.waitForTimeout(3000);

    // Navigate back to the main app page — the server switcher icon is only present
    // outside the settings panel, in the main work manager view.
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Verify the disabled server no longer appears in the global server switcher list
    // (the "You can change the server application here" icon in the top bar)
    await unifiedViewsPage.assertServerNotInSwitcher("Test System Name");
  });

  test("Enable the Disable Server toggle for Test System Name, confirm via dialog, and verify server is visible in the list", async () => {
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Navigate to Configuration > Unified Views
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();

    // Verify the Unified Views screen is loaded
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // Disabled servers are removed from Available servers list — re-register if missing
    const serverExists = await unifiedViewsPage.getSystemFromList("Test System Name").isVisible({ timeout: 5000 }).catch(() => false);
    if (!serverExists) {
      await unifiedViewsPage.clickOnRegisterNewSystem();
      await unifiedViewsPage.enterSystemName("Test System Name");
      await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");
      await unifiedViewsPage.enterSystemURL("http://gasdbpmwin19l02.dev.tibco.com:8080");
      await unifiedViewsPage.clickOnSaveButton();
    }

    // Click on "Test System Name" from the server list
    await unifiedViewsPage.clickOnServerFromList("Test System Name");

    // Verify the Enable server toggle is visible
    await unifiedViewsPage.assertEnableServerVisible();

    // Ensure server is disabled first (so enabling it is a meaningful action)
    await unifiedViewsPage.ensureServerDisabled();

    // Click the toggle to enable the server
    await unifiedViewsPage.clickOnEnableServerToggle();

    // Confirm the enable dialog by clicking Yes
    await unifiedViewsPage.clickYesOnConfirmDialog();

    // Verify the server is now enabled (toggle aria-checked = true)
    await unifiedViewsPage.assertServerIsEnabled();

    // Wait for the enabled state to propagate
    await page.waitForTimeout(3000);

    // Navigate back to the main app page
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Verify the server is now visible and selectable in the global server switcher
    await unifiedViewsPage.assertServerEnabledInSwitcher("Test System Name");
  });

  test("Register a server with a duplicate name and verify error message, then click Cancel", async () => {
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Navigate to Configuration > Unified Views
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();

    // Verify the Unified Views screen is loaded
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // Ensure "Test System Name" exists before attempting duplicate registration
    const serverExists = await unifiedViewsPage.getSystemFromList("Test System Name").isVisible({ timeout: 5000 }).catch(() => false);
    if (!serverExists) {
      await unifiedViewsPage.clickOnRegisterNewSystem();
      await unifiedViewsPage.enterSystemName("Test System Name");
      await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");
      await unifiedViewsPage.enterSystemURL("http://gasdbpmwin19l02.dev.tibco.com:8080");
      await unifiedViewsPage.clickOnSaveButton();
    }

    // Click Register New System to open the registration form
    await unifiedViewsPage.clickOnRegisterNewSystem();

    // Verify the Register dialog is open
    await expect(page.getByRole('dialog', { name: /Register/i })).toBeVisible();

    // Enter the same server name that already exists
    await unifiedViewsPage.enterSystemName("Test System Name");

    // Select System Type
    await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");

    // Enter a System URL
    await unifiedViewsPage.enterSystemURL("http://gasdbpmwin19l02.dev.tibco.com:8080");

    // Verify the error message "A view with this name already exists" is displayed
    await unifiedViewsPage.assertDuplicateNameError();

    // Click the Cancel button to dismiss the form without saving
    await unifiedViewsPage.clickOnCancelButton();

    // Verify the Register dialog is closed
    await expect(page.getByRole('dialog', { name: /Register/i })).not.toBeVisible({ timeout: 10000 });
  });

  test("Click on Delete server button, confirm via dialog, and verify server is deleted from the list", async () => {
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();

    // Navigate to Configuration > Unified Views
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();

    // Verify the Unified Views screen is loaded
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // If "Test System Name" is missing (was disabled or deleted in a prior run), re-register it
    const serverExists = await unifiedViewsPage.getSystemFromList("Test System Name").isVisible({ timeout: 5000 }).catch(() => false);
    if (!serverExists) {
      await unifiedViewsPage.clickOnRegisterNewSystem();
      await unifiedViewsPage.enterSystemName("Test System Name");
      await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");
      await unifiedViewsPage.enterSystemURL("http://gasdbpmwin19l02.dev.tibco.com:8080");
      await unifiedViewsPage.clickOnSaveButton();
    }

    // Click on "Test System Name" from the server list
    await unifiedViewsPage.clickOnServerFromList("Test System Name");

    // Click on the Delete server button
    await unifiedViewsPage.clickOnDeleteButton();

    // Confirm the delete dialog (button may say "Delete", "Yes, continue", or "Yes")
    await unifiedViewsPage.clickConfirmDeleteDialog();

    // Navigate back to Unified Views fresh to confirm deletion persisted (not a transient DOM state)
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();
    await configPage.clickOnSetting();
    await configPage.clickOnUnifiedViews();
    await expect(page.locator("text=Unified views").first()).toBeVisible();

    // Verify the server is no longer present in the Available servers list
    await unifiedViewsPage.assertServerDeletedFromList("Test System Name");
  });

});