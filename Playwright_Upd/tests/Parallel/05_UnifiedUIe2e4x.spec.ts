// Import Playwright test utilities: test, expect, and Page type
import { test, expect, Page } from "@playwright/test";
// Import utility functions for generating current date and random case numbers
import { getCurrentDate, getRandomSixDigitNumber } from "../../fixtures/utility";
// Import the Page Object Manager to centrally manage all page objects
import { POManager } from "../../PageObjects/POManager";
// Import page object for Home page interactions
import { HomePage } from "../../PageObjects/HomePage";
// Import page object for Case Manager page interactions
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
// Import page object for Business Services page interactions
import { BSPage } from "../../PageObjects/BSPage";
// Import page object for Configuration page interactions
import { ConfigurationPage } from "../../PageObjects/ConfigurationPage";
// Import page object for Unified Views page interactions
import { UnifiedViewsPage } from "../../PageObjects/UnifiedViewsPage";
// Import page object for Work List page interactions
import { WorkListPage } from "../../PageObjects/WorkListPage";
// Import page object for Application (Data Admin) page interactions
import { ApplicationPage } from "../../PageObjects/ApplicationPage";
// Import page object for Audit page interactions
import { AuditPage } from "../../PageObjects/AuditPage";
// Import page object for Audit Work Item page interactions
import { AuditWorkItemPage } from "../../PageObjects/AuditWorkItemPage";

// Load test data: read TestData.json and parse it into a JS object
const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

// Declare shared page instance used across all tests in this file
let page: Page;
// Declare Page Object Manager instance to initialize all page objects
let poManager: POManager;
// Declare Home page object instance
let homePage: HomePage;
// Declare Case Manager page object instance
let cmPage: CaseManagerPage;
// Declare Business Services page object instance
let bsPage: BSPage;
// Declare Configuration page object instance
let configPage: ConfigurationPage;
// Declare Unified Views page object instance
let unifiedViewsPage: UnifiedViewsPage;
// Declare Work List page object instance
let wlPage: WorkListPage;
// Declare variable to store the randomly generated case number shared across tests
let randomCaseNumber: string;
// Declare Application page object instance for Data Admin interactions
let appPage: ApplicationPage;
// Declare Audit page object instance
let adPage: AuditPage;
// Declare Audit Work Item page object instance
let adworkitempage: AuditWorkItemPage;

// beforeAll hook: runs once before all tests — creates a new browser page and initializes all page objects
test.beforeAll(async ({ browser }) => {
  // Open a new browser page
  page = await browser.newPage();
  // Initialize the Page Object Manager with the shared page
  poManager = new POManager(page);
  // Get Home page object from the manager
  homePage = poManager.getHomePage();
  // Get Case Manager page object from the manager
  cmPage = poManager.getCaseManagerPage();
  // Get Business Services page object from the manager
  bsPage = poManager.getBSPage();
  // Get Configuration page object from the manager
  configPage = poManager.getConfigurationPage();
  // Get Unified Views page object from the manager
  unifiedViewsPage = poManager.getUnifiedViewsPage();
  // Get Work List page object from the manager
  wlPage = poManager.getWorkListPage();
  // Get Application page object from the manager
  appPage = poManager.getApplicationPage();
  // Get Audit page object from the manager
  adPage = poManager.getAuditPage();
  // Get Audit Work Item page object from the manager
  adworkitempage = poManager.getAuditWorkItemPage();
});

// test.describe("Unified Views Configuration", () => {
//   // Set a longer timeout of 120 seconds for this test suite due to UI load times
//   test.setTimeout(120000);
//   test("Navigate to Unified Views screen under settings and Register New System", async () => {
//     // Navigate to the Work Manager URL for Unified Views configuration
//     await page.goto(dataset.gasdbWorkManagerUrl);
//     // Wait for the page DOM to fully load before interacting
//     await page.waitForLoadState("domcontentloaded");
//     // Click on the Business Service link to enter the application
//     await homePage.clickOnBuisnessService();
//     // Navigate to Configuration > Unified Views via the Settings menu
//     await configPage.clickOnSetting();
//     // Click on the Unified Views option under Configuration
//     await configPage.clickOnUnifiedViews();

//     // Verify the Unified Views screen is loaded by checking for the heading
//     await expect(page.locator("text=Unified views").first()).toBeVisible();

//     // Check if "Test System Name" already exists in the list (to avoid duplicate registration on re-runs)
//     const alreadyExists = await unifiedViewsPage.getSystemFromList("Test System Name").isVisible({ timeout: 5000 }).catch(() => false);

//     // Only register the new system if it does not already exist
//     if (!alreadyExists) {
//       // Click on Register New System button to open the registration dialog
//       await unifiedViewsPage.clickOnRegisterNewSystem();

//       // Verify the registration dialog is displayed
//       await expect(page.getByRole('dialog', { name: /Register/i })).toBeVisible();

//       // Fill in the system name field in the registration form
//       await unifiedViewsPage.enterSystemName("Test System Name");

//       // Select the system type from the dropdown
//       await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");

//       // Enter the system URL in the URL input field
//       await unifiedViewsPage.enterSystemURL("http://gasdbpmwin19l02.dev.tibco.com:8081");

//       // Click Save to submit the registration form
//       await unifiedViewsPage.clickOnSaveButton();
//     }

//     // Verify the newly registered system appears in the "Servers for unified views" list
//     await expect(unifiedViewsPage.getSystemFromList("Test System Name")).toBeVisible({ timeout: 15000 });

//   });
// });

test.describe("Buisness Services e2e suite", () => {
  test("Test for buisnes services", async () => {
    // Navigate to the Work Manager application URL
    await page.goto(dataset.workMangerUrlApp);
    // Wait for the DOM to fully load before interacting with elements
    await page.waitForLoadState("domcontentloaded");
    // Click on Business Service to enter the application
    await homePage.clickOnBuisnessService();
    // Select the target server from the global server switcher
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    // Confirm the server selection by clicking the confirm button
    await cmPage.clickOnConfirmServerSelectionBtn();

    // Verify the Business Services header text is correct
    expect(await bsPage.verifyBSheader()).toBe("Business Services");

    // Verify the refresh icon is visible on the Business Services screen
    expect(await bsPage.refreshIcon()).toBeVisible();

    // Click on the specific business service to open its form
    await bsPage.clickOnBusinessService();

    // Verify both Cancel and Submit buttons are visible on the form
    await Promise.all([
      expect(bsPage.cancelBtn).toBeVisible(),
      expect(bsPage.submitBtn).toBeVisible(),
    ]);

    // Verify all pre-filled form details match expected values from test data
    await bsPage.verifyAllDetails(
      dataset.buisnessService.expectedDecimal,
      dataset.buisnessService.expectedInt,
      dataset.buisnessService.expectedText,
      getCurrentDate()
    );

    // Update the myText field with the new value and submit the first User Task form
    await bsPage.textField.fill(dataset.buisnessService.updatedText);
    // Click Submit to proceed to the next User Task
    await bsPage.submitBtn.click();
    // Wait for the next form to load
    await page.waitForTimeout(2000);
    // Verify the updated text value is reflected in the next User Task form
    expect(await bsPage.textField.inputValue()).toBe(
      dataset.buisnessService.updatedText
    );

    // Submit the 2nd User Task form to complete the business service flow
    await bsPage.submitBtn.click();
    // Wait for the page to process and load after submission
    await page.waitForTimeout(2000);
  });
});

test.describe("Work Item e2e suite", () => {
  test("Submit Work Item", async () => {
    // Navigate to the Work Manager application URL
    await page.goto(dataset.workMangerUrlApp);
    // Wait for the page DOM to fully load
    await page.waitForLoadState("domcontentloaded");
    // Click on Business Service to enter the application
    await homePage.clickOnBuisnessService();
    // Select the target server from the global server switcher
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    // Confirm the server selection
    await cmPage.clickOnConfirmServerSelectionBtn();
    // Click on "My Work" to navigate to the work items list
    await homePage.clickMyWork();
    // Click "Open" for the "GetDetailsForApproval" work item to open it in a new page/tab
    const workItemPage = await wlPage.clickOpenForWorkItem("GetDetailsForApproval");
    // Wait for the work item form to fully load
    await workItemPage.waitForTimeout(4000);
    // Generate a random 6-digit case number to use as unique identifier in the form
    randomCaseNumber = getRandomSixDigitNumber();
    // Fill the local data form fields with test data and the generated case number
    await wlPage.fillLocalDataForm(
      dataset.getDetailsForApproval.caseState1,
      randomCaseNumber,
      dataset.getDetailsForApproval.firstName,
      dataset.getDetailsForApproval.lastName
    );
    // Submit the local data form to create the work item/case
    await wlPage.submitLocalDataForm();
  });
});

test.describe("Audit e2e suite", () => {
  test("Verify Audit functionality", async () => {
    // Step 1: Navigate to Work Manager URL and wait for page to load
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");

    // Step 2: Click on Business Service to enter the application
    await homePage.clickOnBuisnessService();

    // Step 3: Select the target server from the global switcher and confirm selection
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();

    // Step 4: Navigate to the Audit section from the left navigation menu
    await adPage.navigateToAudit();

    // Step 5: Click on Work Item to open the work items list
    await adPage.clickOnWorkItem();

    // Step 6: Open the filter panel by clicking the filter icon on the toolbar
    await adworkitempage.clickOnWorkItemFilterIcon();

    // Step 7: Click the Add Filter icon to open the filter dialog
    await adworkitempage.clickOnWorkItemAddFilterIcon();

    // Step 8: Add a rule to filter by Activity Name and apply the filter
    await adworkitempage.selectActivityNameRuleAndApply("GetDetailsForApproval");
  });
});

test.describe("Cases e2e suite", () => {
  test("Verify the data for Order Case", async () => {
    // Navigate to the Work Manager application URL
    await page.goto(dataset.workMangerUrlApp);
    // Select the target server from the global switcher
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    // Confirm the server selection
    await cmPage.clickOnConfirmServerSelectionBtn();
    // Wait for the DOM to fully load after server selection
    await page.waitForLoadState("domcontentloaded");
    // Click on Case Manager to navigate to the case management section
    await homePage.clickCaseManager();
    // Click on the "Application for Approval" application to open its case list
    await cmPage.clickOnApplicationForApproval();
    // Click on the specific case using the randomly generated case number
    await cmPage.clickOnCaseByCaseId(randomCaseNumber);
    // Verify all form fields in the case details match the originally submitted data
    await cmPage.verifyFilledLocalDataForm(
      dataset.getDetailsForApproval.caseState1,
      randomCaseNumber,
      dataset.getDetailsForApproval.firstName,
      dataset.getDetailsForApproval.lastName
    );
  });

  test("Update the Case Action and Verify the Updated Value", async () => {
    // Click on the Update Case Action button to open the update form
    await cmPage.clickOnUpdateCaseActionBtn();
    // Wait for the update form to fully render before interacting
    await page.waitForTimeout(5000);
    // Fill the update case action form with new state and first name values
    await cmPage.fillUpdateCaseActionForm(
      dataset.getDetailsForApproval.updatedCaseState1,
      dataset.getDetailsForApproval.updatedFirstName
    );
    // Submit the updated case action form
    await cmPage.submitUpdateCaseActionForm();
    // Click on View Case Action to verify the updated values are saved
    await cmPage.clickOnViewCaseActionBtn();
    // Verify the updated case state and first name are reflected in the View Case Action form
    await cmPage.verifyViewCaseActionForm(
      dataset.getDetailsForApproval.updatedCaseState1,
      dataset.getDetailsForApproval.updatedFirstName
    );
    await cmPage.submitUpdateCaseActionForm();
  });

  test("2nd Update Case Action and Verify Updated Values", async () => {
    // Click on the second Update Case Action button for the next update
    await cmPage.clickOnUpdateCaseActionBtn2nd();
    // Fill the second update form with new case state and last name values
    await cmPage.fillUpdateCaseActionForm2nd(
      dataset.getDetailsForApproval.updatedCaseState1_2nd,
      dataset.getDetailsForApproval.updatedLastName
    );
    // Submit the second update case action form
    await cmPage.submitUpdateCaseActionForm();
    // Click on View Case Action to verify the 2nd update values are saved
    await cmPage.clickOnViewCaseActionBtn();
    // Verify the 2nd updated case state and last name are reflected correctly
    await cmPage.verifyViewCaseActionForm2nd(
      dataset.getDetailsForApproval.updatedCaseState1_2nd,
      dataset.getDetailsForApproval.updatedLastName
    );
  });

  test("To verify Work items under Case Details", async () => {
    // Click on the Work Items tab under Case Details
    await cmPage.clickOnWorkItems();
    // Verify the "Work items" section header text is correct
    expect(await cmPage.workItemsHeader()).toBe("Work items");
    // Get the linked work item element by name from the list
    const workItem = await cmPage.linkedWorkItem(dataset.linkedWorkItem);
    // Verify the linked work item is visible in the list
    expect(workItem).toBeVisible();
    // Additional assertion to confirm work item visibility
    await expect(workItem).toBeVisible();
    // Verify the work item row contains the expected work item name
    await expect(workItem).toContainText(dataset.linkedWorkItem);
    // Click on the work item to open its detail panel
    await (await cmPage.linkedWorkItem(dataset.linkedWorkItem)).click();
    // Verify the work item status changes to "OPENED" after clicking
    await expect(workItem).toContainText("OPENED");
    // Verify the Local Data section fields match the originally submitted values
    await cmPage.verifyLocalDataSection(
      dataset.getDetailsForApproval.caseState1,
      dataset.getDetailsForApproval.firstName,
      dataset.getDetailsForApproval.lastName
    );
    // Verify the Case Reference section reflects the 2nd updated values
    await cmPage.verifyCaseRefSection(
      dataset.getDetailsForApproval.updatedCaseState1_2nd,
      dataset.getDetailsForApproval.updatedFirstName,
      dataset.getDetailsForApproval.updatedLastName
    );
    // Close the right-side detail pane
    await cmPage.closeRightSidePane();
    // Wait for the pane to close and the UI to settle
    await page.waitForTimeout(5000);
    // Click Cancel on the work item to exit without further changes
    await cmPage.clickOnWorkItemCancelBtn();
  });

  test("To verify Documents UI under Case Details", async () => {
    // Click on the Documents tab under Case Details
    await cmPage.clickOnDocuments();
    // Verify the "Documents" section header text is correct
    expect(await cmPage.docHeader()).toBe("Documents");
    // Verify the Upload button is visible on the Documents screen
    expect(await cmPage.uploadBtn()).toBeVisible();
    // Click the Upload button to open the document upload dialog
    await (await cmPage.uploadBtn()).click();
    // Verify the upload dialog container shows the "Upload Document" title
    expect(await cmPage.uploadDocConatinerText()).toContain("Upload Document");
    // Verify the Cancel button is visible inside the upload dialog
    await expect(await cmPage.cancelButton()).toBeVisible();

    // Verify the document description text box is visible
    expect(page.locator("#document-description")).toBeVisible();
    // Verify the drag-and-drop area displays the correct instructional text
    expect(await page.locator(".drag-drop-text.mtb").innerText()).toContain(
      "Drag and drop a file or "
    );
    // Verify the "Choose File" button is visible for file selection
    await expect(await cmPage.chooseFileBtn()).toBeVisible();
    // Click Cancel to close the upload dialog without uploading
    await (await cmPage.cancelButton()).click();
  });

  test("To verify document upload for Doc format", async () => {
    // Click on the Documents tab to navigate to the documents section
    await cmPage.clickOnDocuments();
    // Upload a .doc file with a description and verify the upload flow
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.doc} file upload`,
      dataset.caseDocument.doc
    );
    // Verify the success alert message confirms the .doc file was uploaded
    expect(await cmPage.alertMsg()).toContain(
      `${dataset.caseDocument.doc} uploaded`
    );
    // Get the document list locator to verify the uploaded file appears
    const list = cmPage.documentList;
    // Verify the document list is visible after upload
    await expect(list).toBeVisible({ timeout: 10000 });
    // Verify the uploaded .doc file name appears in the document list
    await expect(list).toContainText(dataset.caseDocument.doc);
  });

  test("To verify document upload for PDF format", async () => {
    // Get the document list locator for later verification
    const list = cmPage.documentList;
    // Click on the Documents tab to navigate to the documents section
    await cmPage.clickOnDocuments();
    // Upload a .pdf file with a description and verify the upload flow
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.pdf} file upload`,
      dataset.caseDocument.pdf
    );
    // Navigate away to the Audit tab to trigger a page refresh/reload
    await cmPage.clickOnAudit();
    // Navigate back to Documents tab to verify the uploaded PDF persists
    await cmPage.clickOnDocuments();
    // Wait briefly for the document list to reload
    await page.waitForTimeout(1000);
    // Verify the uploaded .pdf file name appears in the document list
    await expect(list).toContainText(dataset.caseDocument.pdf);
  });

  test("Search and Delete case document", async () => {
    // Get the document list locator for verification
    const list = cmPage.documentList;
    // Click on the Documents tab to navigate to the documents section
    await cmPage.clickOnDocuments();
    // Search for the .doc file by name to filter the document list
    await cmPage.searchDocument(dataset.caseDocument.doc);
    // Verify only 1 result is returned after searching
    expect(list).toHaveCount(1);
    // Click the delete icon next to the .doc file to initiate deletion
    await cmPage.clickOnDeleteIcon(dataset.caseDocument.doc);
    // Verify the delete confirmation dialog header reads "Delete document"
    expect(await cmPage.documentDeleteHeader()).toBe("Delete document");
    // Verify the delete confirmation message contains the correct file name
    expect(await cmPage.delDocumentConfirmationTxt()).toContain(
      `Are you sure you want to delete ${dataset.caseDocument.doc}?`
    );
    // Click Cancel to close the delete dialog without deleting
    await cmPage.clickOnCancelBtn();
    // Verify the document is still present in the list after cancellation
    await expect(list).toContainText(dataset.caseDocument.doc);
    // Click the delete icon again to proceed with actual deletion
    await cmPage.clickOnDeleteIcon(dataset.caseDocument.doc);
    // Confirm deletion by clicking the "Yes, Delete" button
    await cmPage.clickOnYesDelete();
    // Search again for the deleted document to confirm it no longer exists
    await cmPage.searchDocument(dataset.caseDocument.doc);
    // Verify the "no document found" message appears confirming deletion
    expect(await cmPage.documentConatiner()).toContain(
      "No document found name containing"
    );
  });

  test("To verify Audit under Case Details", async () => {
    // Click on the Audit tab under Case Details to open the audit trail
    await cmPage.clickOnAudit();
    // Verify the "Audit" section header text is correct
    expect(await cmPage.auditHeader()).toBe("Audit");

    // Verify the audit trail contains the "created case" event entry
    expect(await cmPage.auditTextContent()).toContain("created case");
    // Verify the audit trail contains the "YES" value from the case creation data
    expect(await cmPage.auditTextContent()).toContain("YES");
    // Click the expand (down arrow) icon to view the detailed audit entry
    await cmPage.clickOnDownArrow();
    // Verify the expanded audit section shows the latest updated case values (after 2nd update)
    await cmPage.verifyAuditExpandedSection(
      dataset.getDetailsForApproval.updatedCaseState1_2nd,
      dataset.getDetailsForApproval.updatedFirstName,
      dataset.getDetailsForApproval.updatedLastName
    );
  });

});

// Only run this describe block (excludes all other describe blocks during this run)
test.describe("Data Admin e2e suite", () => {
  test("Navigation to Data Admin screen for 4x Server", async () => {
    // Step 1: Navigate to Work Manager URL
    await page.goto(dataset.workMangerUrlApp, { waitUntil: 'domcontentloaded' });

    // Step 2: Click on Business Service
    await homePage.clickOnBuisnessService();

    // Step 3: Select server from global switcher and confirm
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();

    // Step 4: Click on Application icon
    await appPage.clickOnApplicationIcon();

    // Step 5: Open Data Admin in a new tab
    const dataAdminPage = await appPage.clickDataAdminAndGetNewTab();

    // Step 6: Ensure correct server is selected
    await appPage.ensureServerSelected(dataAdminPage, dataset.ServerName);

    // Step 7: Verify Data Admin page URL
    await appPage.verifyDataAdminPage(dataAdminPage, dataset.DataAdminURL);

    // Step 8: Close the Data Admin tab
    await dataAdminPage.close();
  });

  test("Verify Create, Update and Drop Script tab on Live View screen", async () => {
    // Step 1: Navigate to Work Manager URL
    await page.goto(dataset.workMangerUrlApp, { waitUntil: 'domcontentloaded' });
    // Reload the page to ensure a clean state before the test
    await page.reload();

    // Step 2: Click on Business Service
    await homePage.clickOnBuisnessService();

    // Step 3: Select server from global switcher and confirm
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();

    // Step 4: Click on Application icon
    await appPage.clickOnApplicationIcon();

    // Step 5: Open Data Admin in a new tab
    const dataAdminPage = await appPage.clickDataAdminAndGetNewTab();

    // Step 6: Ensure correct server is selected
    await appPage.ensureServerSelected(dataAdminPage, dataset.ServerName);

    // Step 7: Verify Case Model session and Create Script tab on Live View screen
    await appPage.liveViewCreateScript(
      dataAdminPage,
      dataset.DataAdminURL
    );

    // Step 8: Verify Update Script tab on Live View screen
    await appPage.liveViewUpdateScript(dataAdminPage);

    // Step 9: Verify Drop Script tab on Live View screen
    await appPage.liveViewDropScript(dataAdminPage);

    // Step 10: Close the Data Admin tab after verification
    await dataAdminPage.close();
  });

  test("Verify Create, Update and Drop Scrip tabt on Audit View screen", async () => {
    // Step 1: Navigate to Work Manager URL
    await page.goto(dataset.workMangerUrlApp, { waitUntil: 'domcontentloaded' });
    // Reload the page to ensure a clean state before the test
    await page.reload();

    // Step 2: Click on Business Service
    await homePage.clickOnBuisnessService();

    // Step 3: Select server from global switcher and confirm
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();

    // Step 4: Click on Application icon
    await appPage.clickOnApplicationIcon();

    // Step 5: Open Data Admin in a new tab
    const dataAdminPage = await appPage.clickDataAdminAndGetNewTab();

    // Step 6: Ensure correct server is selected
    await appPage.ensureServerSelected(dataAdminPage, dataset.ServerName);

    // Step 7: Navigate to Audit view tab on the Data Admin screen
    await appPage.navigateToAuditView(dataAdminPage);

    // Step 8: Select Case Action and verify the case model on Audit View
    await appPage.verifyAuditViewCaseModel(dataAdminPage);

    // Step 9: Validate Create Script tab on Audit View screen
    await appPage.auditViewCreateScript(dataAdminPage);
    // Validate Update Script tab on Audit View screen
    await appPage.auditViewUpdateScript(dataAdminPage);
    // Validate Drop Script tab on Audit View screen
    await appPage.auditViewDropScript(dataAdminPage);
    // Close the Data Admin tab after all Audit View verifications are complete
    await dataAdminPage.close();
  });
});

// afterAll hook: runs once after all tests — closes the shared browser page
test.afterAll(async () => {
  // Close the shared page to release browser resources
  await page.close();
});