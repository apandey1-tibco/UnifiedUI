import { test, expect, Page } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { Audit_ProcessInstancePage_4x } from "../../PageObjects/Audit_ProcessInstancePage_4x";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";

const dataset = JSON.parse(
JSON.stringify(require("../../fixtures/TestData.json"))
 );
const d = dataset.auditProcessInstance4x;

let page: Page;
let poManager: POManager;
let cmPage: CaseManagerPage;
let auditProcessInstancepage4x: Audit_ProcessInstancePage_4x;


test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  cmPage = poManager.getCaseManagerPage();
  auditProcessInstancepage4x = poManager.getAuditProcessInstancepage4x();
});

test.describe("Test Audit Process Instance - 4x Server", () => {

  // ─────────────────────────────────────────────────────────────────────
  // Group 1: Navigation & Page Setup
  // ─────────────────────────────────────────────────────────────────────
  test.describe("Navigation & Page Setup", () => {

    test("1. Verify the Audit text on bpm audit page header title", async () => {
      // Step 1: Navigate using global-Setup auth (auth saved in fixtures/auth.json for gasdbpmc2ebld01)
      await page.goto(dataset.uniUIworkManagerUrl);
      await page.waitForLoadState("domcontentloaded");

      // Step 2: Switch to 4x server - click view drawer, select 2203_Automation and confirm
      await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
      await cmPage.clickOnConfirmServerSelectionBtn();

      // Step 3: Navigate to Audit section from the nav menu
      await auditProcessInstancepage4x.navigateToAudit();

      // Step 4: Verify the Audit nav menu item is visible and contains text "Audit"
      await expect(auditProcessInstancepage4x.mainAuditPage).toBeVisible();
      await expect(auditProcessInstancepage4x.mainAuditPage).toContainText(d.auditMenuText);
      await page.waitForTimeout(2000);
    });

    test("2. Verify Process Instances is visible and clickable from Audit menu item", async () => {
      const processInstancesSpan = page.locator('span[title="Process Instances"]');

      // Step 1: Verify the Process Instances span element is visible under Audit menu
      await expect(processInstancesSpan).toBeVisible();

      // Step 2: Click on Process Instances using the span title locator
      await processInstancesSpan.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);
    });

    test.skip("3. Verify empty message when no process instances is available", async () => {
      // Step 1: Verify the empty message element is visible on the page
      await expect(auditProcessInstancepage4x.emptyMessage).toBeVisible();

      // Step 2: Verify the empty message displays the correct text
      await expect(auditProcessInstancepage4x.emptyMessage).toContainText("no process instance available");
    });

  });

  // ─────────────────────────────────────────────────────────────────────
  // Group 2: Process Instances List View
  // ─────────────────────────────────────────────────────────────────────
  test.describe("Process Instances List View", () => {

    test("4. (Basic & Regression) Verify Process Instances list view loads correctly", async () => {
      await page.goto(dataset.uniUIworkManagerUrl);
      await page.waitForLoadState("domcontentloaded");
      await auditProcessInstancepage4x.navigateToAudit();
      await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
      await cmPage.clickOnConfirmServerSelectionBtn();

      await page.locator('span[title="Process Instances"]').click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 1: Verify the process instances record is visible
      await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();

      // Step 2: Verify at least one row is displayed in the table
      const rowCount = await auditProcessInstancepage4x.processInstanceRows.count();
      expect(rowCount).toBeGreaterThan(0);
    });

    test("5. Verify Process Instance table column headers are correct", async () => {
      const headerCells = page.locator("div > twc-table twc-table-head-cell");

      // Step 1: Verify the table header row is visible
      await expect(headerCells.first()).toBeVisible();

      // Step 2: Get all column header texts
      const headerTexts = await headerCells.allTextContents();
      const actualHeaders = headerTexts.map(t => t.trim()).filter(t => t !== '');

      // Step 3: Verify each expected column header is present in the table
      for (const expectedCol of d.processInstanceTableColumns) {
        expect(actualHeaders).toContain(expectedCol);
      }
    });

    test("6. Verify refresh button works correctly", async () => {
      // Step 1: Click the Refresh button in the toolbar
      await auditProcessInstancepage4x.refresh();

      // Step 2: Verify the record is still visible after refresh
      await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();

      // Step 3: Verify the row count is consistent after refresh
      const rowsAfter = await auditProcessInstancepage4x.processInstanceRows.count();
      expect(rowsAfter).toBeGreaterThan(0);
    });

  });

  // ─────────────────────────────────────────────────────────────────────
  // Group 3: Find Instance Search
  // ─────────────────────────────────────────────────────────────────────
  test.describe("Find Instance Search", () => {
    test("7. Verify Find Instance button is clickable and enabled", async () => {

      await page.goto(dataset.uniUIworkManagerUrl);
      await page.waitForLoadState("domcontentloaded");
      await auditProcessInstancepage4x.navigateToAudit();
      await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
      await cmPage.clickOnConfirmServerSelectionBtn();

      await page.locator('span[title="Process Instances"]').click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 1: Verify Find Instance button is visible on the page
      await expect(auditProcessInstancepage4x.findInstanceButton).toBeVisible();

      // Step 2: Verify Find Instance button is enabled
      await expect(auditProcessInstancepage4x.findInstanceButton).toBeEnabled();

      // Step 3: Click the Find Instance button to confirm it opens the dialog
      await auditProcessInstancepage4x.findInstanceButton.click();
      await page.waitForTimeout(2000);

      // Step 4: Click the close button to close the Find Instance popup
      await auditProcessInstancepage4x.closeFindInstanceDialog();
      await page.waitForTimeout(1000);
    });

    test("8. Verify Find Instance search with valid process ID", async () => {

      // Step 1: Capture the first Process Instance ID from the table
      const firstRowID = await auditProcessInstancepage4x.getCellValue(0, 0);

      // Step 2: Click Find Instance button
      await auditProcessInstancepage4x.findInstanceButton.click();

      // Step 3: Enter the captured valid Process Instance ID
      await auditProcessInstancepage4x.fillProcessInstanceID(firstRowID);

      // Step 4: Click Search button
      await auditProcessInstancepage4x.clickSearch();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 5: Verify the Audit Details page is opened
      await expect(auditProcessInstancepage4x.auditDetailsWrapper).toBeVisible();

      // Step 6: Verify rows are visible in the audit details table
      await expect(auditProcessInstancepage4x.auditDetailsRows.first()).toBeVisible();
      const auditRowCount = await auditProcessInstancepage4x.auditDetailsRows.count();
      expect(auditRowCount).toBeGreaterThan(0);

      // Step 7: Click Back to Process Instances button
      await auditProcessInstancepage4x.navigateBackButton.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);
    });

    test("9. (Basic & Regression) Verify Find Instance search with invalid process ID", async () => {
      // Step 1: Click Find Instance button
      await auditProcessInstancepage4x.findInstanceButton.click();

      // Step 2: Enter an invalid Process Instance ID
      await auditProcessInstancepage4x.fillProcessInstanceID(d.invalidProcessId);

      // Step 3: Click Search button
      await auditProcessInstancepage4x.clickSearch();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 4: Verify the Audit Details page is opened
      await expect(auditProcessInstancepage4x.auditDetailsWrapper).toBeVisible();

      // Step 5: Verify the error message is displayed for invalid process ID
      await expect(page.getByText(d.auditDetailsNotFound)).toBeVisible();

      // Step 6: Click Back to Process Instances button to return
      await auditProcessInstancepage4x.navigateBackButton.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);
    });

    test("10. Verify Reset button clears process instances input value", async () => {
      // Step 1: Click Find Instance button
      await auditProcessInstancepage4x.findInstanceButton.click();

      // Step 2: Enter a value in the Process Instance ID input
      await auditProcessInstancepage4x.fillProcessInstanceID(d.testProcessId);

      // Step 3: Verify the input field has the entered value
      await expect(auditProcessInstancepage4x.processInstanceInput).toHaveValue(d.testProcessId);

      // Step 4: Click the Reset button
      await auditProcessInstancepage4x.clickReset();
      await page.waitForTimeout(500);

      // Step 5: Verify the input field is cleared after Reset
      await expect(auditProcessInstancepage4x.processInstanceInput).toHaveValue("");

      // Step 6: Click the close button to close the Find Instance popup
      await auditProcessInstancepage4x.closeFindInstanceDialog();
      await page.waitForTimeout(1000);
    });

    test("11. Verify Find Instance search button is disabled without entering a value", async () => {
      // Step 1: Click Find Instance button to open dialog
      await auditProcessInstancepage4x.findInstanceButton.click();

      // Step 2: Verify the dialog input is visible
      await expect(auditProcessInstancepage4x.processInstanceInput).toBeVisible();

      // Step 3: Verify the Search button is disabled when input is empty
      await expect(auditProcessInstancepage4x.searchButton).toHaveAttribute('disabled', '');

      // Step 4: Click the close button to close the Find Instance popup
      await auditProcessInstancepage4x.closeFindInstanceDialog();
      await page.waitForTimeout(1000);
    });

    //[Regression]Audit–Process Instance: 'Search' button is disabled for searched PI
    test("12. (Regression) Verify Find Instance search button is enabled after entering a value", async () => {
      // Step 1: Click Find Instance button to open dialog
      await auditProcessInstancepage4x.findInstanceButton.click();

      // Step 2: Enter a value in the Process Instance ID input
      await auditProcessInstancepage4x.fillProcessInstanceID(d.testProcessId);
      await page.waitForTimeout(2000);

      // Step 3: Verify the Search button is enabled (no disabled attribute)
      await expect(auditProcessInstancepage4x.searchButton).not.toHaveAttribute('disabled', '');

      // Step 4: Click the close button to close the Find Instance popup
      await auditProcessInstancepage4x.closeFindInstanceDialog();
      await page.waitForTimeout(1000);
    });

  });

  // ─────────────────────────────────────────────────────────────────────
  // Group 4: Audit Details & Event Details
  // ─────────────────────────────────────────────────────────────────────
  test.describe("Audit Details & Event Details", () => {

    test("13. Verify clicking a Process Instance record opens audit details page", async () => {

      await page.goto(dataset.uniUIworkManagerUrl);
      await page.waitForLoadState("domcontentloaded");
      await auditProcessInstancepage4x.navigateToAudit();
      await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
      await cmPage.clickOnConfirmServerSelectionBtn();

      await page.locator('span[title="Process Instances"]').click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);


      // Step 1: Click on the first record in the Process Instances table
      await auditProcessInstancepage4x.processInstanceRows.first().click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 2: Verify the Audit Details page is opened
      await expect(auditProcessInstancepage4x.auditDetailsWrapper).toBeVisible();

      // Step 3: Scenario 1 - records visible, Scenario 2 - empty message shown
      await expect(
        auditProcessInstancepage4x.auditDetailsRows.first()
          .or(page.getByText(d.auditDetailsNotFound))
      ).toBeVisible();

      // Step 4: Click Back to Process Instances button to return
      await auditProcessInstancepage4x.navigateBackButton.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);
    });

    test("14. Verify clicking an Audit details record opens event details page correctly", async () => {
      // Step 1: Click on the first record in the Process Instances table
      await auditProcessInstancepage4x.processInstanceRows.first().click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 2: Verify the Audit Details page is opened
      await expect(auditProcessInstancepage4x.auditDetailsWrapper).toBeVisible();

      // Step 3: Verify at least one audit record exists and click the first one
      await expect(auditProcessInstancepage4x.auditDetailsRows.first()).toBeVisible();
      await auditProcessInstancepage4x.auditDetailsRows.first().click();
      await page.waitForTimeout(1000);

      // Step 4: Verify the event details sidebar opens correctly
      await expect(auditProcessInstancepage4x.eventDetailsSidebar).toBeVisible();

      // Step 5: Click the close button of the event details page
      await auditProcessInstancepage4x.closeEventDetailsButton.click({ force: true });
      await page.waitForTimeout(500);

      // Step 6: Click Back to Process Instances button to return
      await auditProcessInstancepage4x.navigateBackButton.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);
    });

  });

  // ─────────────────────────────────────────────────────────────────────
  // Group 5: Context Menu & Referenced Items
  // ─────────────────────────────────────────────────────────────────────
  test.describe("Context Menu & Referenced Items", () => {

    test("15. Verify Referenced Work Items expands in the detail panel", async () => {

      await page.goto(dataset.uniUIworkManagerUrl);
      await page.waitForLoadState("domcontentloaded");
      await auditProcessInstancepage4x.navigateToAudit();
      await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
      await cmPage.clickOnConfirmServerSelectionBtn();

      await page.locator('span[title="Process Instances"]').click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);


      // Step 1: Verify the first process instance row is visible in the list
      await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();

      // Step 2: Click the Referenced Work Items button in the event links column of the first row
      await auditProcessInstancepage4x.processInstanceRows.first()
        .locator("text=Referenced work items").click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 3: Verify referenced work items records are visible or empty message is shown
      await expect(
        page.locator('twc-table-row[preventselection][details]').first()
          .or(page.getByText(d.noWorkItem))
      ).toBeVisible();

      // Step 4: Click the Process Instances header link to navigate back
      await auditProcessInstancepage4x.navigateToProcessInstancesList();
      await page.waitForTimeout(1000);
    });

    test("16. Verify three-dot context menu displays all expected options", async () => {
      // Step 1: Verify the first process instance row is visible and click its three-dots button
      await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();
      await auditProcessInstancepage4x.verticalThreeDots.click();
      await page.waitForTimeout(500);

      // Step 2: Verify Referenced processes option is visible in the context menu
      await expect(auditProcessInstancepage4x.referencedProcesses).toBeVisible();

      // Step 3: Verify Referenced cases option is visible in the context menu
      await expect(auditProcessInstancepage4x.referencedCases).toBeVisible();

      // Step 4: Verify Source process template option is visible in the context menu
      await expect(auditProcessInstancepage4x.sourceProcessTemplate).toBeVisible();

      // Step 5: Refresh the page by clicking the refresh button
      await auditProcessInstancepage4x.refresh();
    });

    test("17. Verify context menu Referenced Processes item displays referenced process page", async () => {
      // Step 1: Verify the first process instance row is visible and click its three-dots button
      await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();
      await auditProcessInstancepage4x.verticalThreeDots.click();
      await page.waitForTimeout(500);

      // Step 2: Verify Referenced processes option is visible in the context menu
      await expect(auditProcessInstancepage4x.referencedProcesses).toBeVisible();

      // Step 3: Click on Referenced processes option
      await auditProcessInstancepage4x.referencedProcesses.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 4: Verify referenced process records are visible or empty message is shown
      await expect(
        auditProcessInstancepage4x.processInstanceRows.first()
          .or(page.getByText(d.noProcess))
      ).toBeVisible();

      // Step 5: Click the Process Instances header link to navigate back
      await auditProcessInstancepage4x.navigateToProcessInstancesList();
      await page.waitForTimeout(1000);
    });

    test("18. Verify context menu Source Process Template item displays source process template page", async () => {
      // Step 1: Verify the first process instance row is visible and click its three-dots button
      await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();
      await auditProcessInstancepage4x.verticalThreeDots.click();
      await page.waitForTimeout(500);

      // Step 2: Verify Source process template option is visible in the context menu
      await expect(auditProcessInstancepage4x.sourceProcessTemplate).toBeVisible();

      // Step 3: Click on Source process template option
      await auditProcessInstancepage4x.sourceProcessTemplate.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 4: Verify source process template records are visible or empty message is shown
      await expect(
        auditProcessInstancepage4x.processInstanceRows.first()
          .or(page.getByText(d.noProcess))
      ).toBeVisible();

      // Step 5: Click the Process Instances header link to navigate back
      await auditProcessInstancepage4x.navigateToProcessInstancesList();
      await page.waitForTimeout(1000);
    });

    // Currently option is disabled
    test.skip("19. Verify context menu Referenced Cases item displays referenced cases page", async () => {
      await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();
      await auditProcessInstancepage4x.verticalThreeDots.click();
      await page.waitForTimeout(500);
      await expect(auditProcessInstancepage4x.referencedCases).toBeVisible();
      await auditProcessInstancepage4x.referencedCases.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);
      await expect(
        auditProcessInstancepage4x.processInstanceRows.first()
          .or(page.getByText(d.noProcess))
      ).toBeVisible();
      await page.locator('twc-button').filter({ hasText: 'Process Instances' }).click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);
    });

  });

  // ─────────────────────────────────────────────────────────────────────
  // Group 6: Audit Filter Management
  // ─────────────────────────────────────────────────────────────────────
  test.describe("Audit Filter Management", () => {

    test("20. (Basic & Regression) Verify Audit filter dialog message and Save button validations", async () => {

        await page.goto(dataset.uniUIworkManagerUrl);
      await page.waitForLoadState("domcontentloaded");
      await auditProcessInstancepage4x.navigateToAudit();
      await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
      await cmPage.clickOnConfirmServerSelectionBtn();

      await page.locator('span[title="Process Instances"]').click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 1: Click the filter panel icon in the toolbar
      await auditProcessInstancepage4x.clickOnFilterIcon();
      await page.waitForTimeout(500);

      // Step 2: Click the filter icon to open the audit filter dialog
      await auditProcessInstancepage4x.clickOnAddFilterIcon();
      await page.waitForTimeout(500);

      // Step 3-5: Verify the Audit Filter dialog is open with initial state
      await auditProcessInstancepage4x.verifyAuditFilterDialog();

      // Step 6: Click Add Rule button
      await auditProcessInstancepage4x.addRuleButton.click();
      await page.waitForTimeout(500);

      // Step 7: Verify Save is disabled before any values are entered
      await expect(auditProcessInstancepage4x.saveFilterButton).toBeDisabled();

      // Step 8: Select "Process instance priority" from the rule field dropdown
      await auditProcessInstancepage4x.selectDropdownFirstOption(auditProcessInstancepage4x.ruleFieldSelect);
      await page.waitForTimeout(500);

      // Step 9: Select "Equal" from the operator dropdown
      await auditProcessInstancepage4x.selectDropdownFirstOption(auditProcessInstancepage4x.operatorSelect);
      await page.waitForTimeout(1000);

      // Step 10: Enter priority value in the input field
      await auditProcessInstancepage4x.ruleValueInput.locator('#input').fill(d.priorityHigh);
      await page.waitForTimeout(500);

      // Step 11: Verify Save button is enabled after all values are entered
      await expect(auditProcessInstancepage4x.saveFilterButton).toBeEnabled();

      // Step 12: Verify rule builder panel filter text and close dialog
      await auditProcessInstancepage4x.verifyRuleBuilderPanel();
      await page.waitForTimeout(500);

      // Step 13: Click arrow-back icon to navigate back to all process instances
      await auditProcessInstancepage4x.arrowBackButton.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(500);

      // Step 14: Refresh the page
      await auditProcessInstancepage4x.refresh();
    });

    test("21. (Basic & Regression) Create priority filter and verify each filtered results", async () => {
      // Step 1: Click the filter panel icon in the toolbar
      await auditProcessInstancepage4x.clickOnFilterIcon();
      await page.waitForTimeout(500);

      // Step 2: Click the filter icon to open the audit filter dialog
      await auditProcessInstancepage4x.clickOnAddFilterIcon();
      await page.waitForTimeout(500);

      // Step 3-5: Verify the Audit Filter dialog is open with initial state
      await auditProcessInstancepage4x.verifyAuditFilterDialog();

      // Step 6: Click Add Rule button
      await auditProcessInstancepage4x.addRuleButton.click();
      await page.waitForTimeout(500);

      // Step 7: Select "Process instance priority" from the rule field dropdown
      await auditProcessInstancepage4x.selectDropdownFirstOption(auditProcessInstancepage4x.ruleFieldSelect);
      await page.waitForTimeout(500);

      // Step 8: Select "Equal" from the operator dropdown
      await auditProcessInstancepage4x.selectDropdownFirstOption(auditProcessInstancepage4x.operatorSelect);
      await page.waitForTimeout(500);

      // Step 9: Enter priority value in the input field
      await auditProcessInstancepage4x.ruleValueInput.locator('#input').fill(d.priorityHigh);
      await page.waitForTimeout(500);

      // Step 10: Click Save filter button and then click Apply filter button
      await auditProcessInstancepage4x.saveFilterButton.click();
      await page.waitForTimeout(500);
      await auditProcessInstancepage4x.applyFilterActionButton.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 11: Verify the filter label tag displays the correct filter text
      await expect(auditProcessInstancepage4x.filterLabelTag).toBeVisible();
      await expect(auditProcessInstancepage4x.filterLabelTag).toContainText(d.filterLabelHigh);

      // Step 12: Verify all filtered data rows have the correct priority
      await auditProcessInstancepage4x.verifyPriorityColumnOrNoData(d.priorityHigh, d.noProcessInstancesEvents);

      // Step 13: Click the Save filter name button to open the save query dialog
      await auditProcessInstancepage4x.saveFilterButtonafterapply.click();
      await page.waitForTimeout(500);

      // Step 14: Verify save query dialog is opened and title is correct
      await expect(auditProcessInstancepage4x.saveQueryDialogHeader).toContainText(d.saveQueryDialogTitle);

      // Step 15: Enter filter name in the input and click Save
      await auditProcessInstancepage4x.saveQueryInputField.pressSequentially(d.savedFilterName);
      await page.waitForTimeout(500);
      await auditProcessInstancepage4x.saveQuerySaveButton.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 16: Verify the success alert message is shown
      await expect(page.getByText(d.settingsSavedMsg)).toBeVisible();
      await page.waitForTimeout(1000);

      // Step 17: Verify saved filter is in the list
      await expect(auditProcessInstancepage4x.savedFilterItem(d.savedFilterName)).toBeVisible();
      await page.waitForTimeout(1000);

      // Step 18: Verify all filtered records contain the correct priority or no-data message
      await auditProcessInstancepage4x.verifyPriorityColumnOrNoData(d.priorityHigh, d.noProcessInstancesEvents);

      // Step 19: Refresh the page back to all process instances page
      await auditProcessInstancepage4x.refresh();
    });

    test("22. (Basic and Regression) Edit saved filter and verify updated filtered results", async () => {
      const savedFilter = auditProcessInstancepage4x.savedFilterItem(d.savedFilterName);

      // Step 1: Verify the saved filter is visible in the saved filters list
      await expect(savedFilter).toBeVisible();

      // Step 2: Click on the saved filter item to select it
      await savedFilter.click();
      await page.waitForTimeout(300);

      // Step 3: Click the three-dots button and select Edit filter
      await savedFilter.locator('twc-icon[name="three-dots-vertical"]').click();
      await page.waitForTimeout(500);
      await savedFilter.locator('twc-menu-item').filter({ hasText: 'Edit filter' }).click();
      await page.waitForTimeout(500);

      // Step 4: Verify the rule field select is visible and displays the selected filter field value
      await expect(auditProcessInstancepage4x.ruleFieldSelect).toBeVisible();
      await expect(auditProcessInstancepage4x.ruleFieldSelect.locator('input.select__display-input')).not.toHaveValue("");

      // Step 5: Verify the existing filter value is shown correctly
      await expect(auditProcessInstancepage4x.ruleValueInput.locator('#input')).toHaveValue(d.priorityHigh);

      // Step 6: Clear the existing value and update with new filter value
      await auditProcessInstancepage4x.ruleValueInput.locator('#input').click();
      await auditProcessInstancepage4x.ruleValueInput.locator('#input').selectText();
      await auditProcessInstancepage4x.ruleValueInput.locator('#input').pressSequentially(d.priorityNormal);
      await page.waitForTimeout(300);

      // Step 7: Click Save to save the updated filter rule
      await auditProcessInstancepage4x.saveFilterButton.click();
      await page.waitForTimeout(500);

      // Step 8: Click Save filters button to apply the updated filter
      await auditProcessInstancepage4x.saveFilterButtonafterapply.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 9: Verify the success alert message is shown
      await expect(page.getByText(d.settingsSavedMsg)).toBeVisible();

      // Step 10: Verify all filtered records contain the correct priority or empty message
      await auditProcessInstancepage4x.verifyPriorityColumnOrNoData(d.priorityNormal, d.noProcessInstancesEvents);

      // Step 11: Refresh the page
      await auditProcessInstancepage4x.refresh();
    });

    test("23. Delete filter and verify it is removed from saved filters list", async () => {
      const savedFilter = auditProcessInstancepage4x.savedFilterItem(d.savedFilterName);

      // Step 1: Verify the saved filter is visible in the saved filters list
      await expect(savedFilter).toBeVisible();

      // Step 2: Click on the saved filter item to select it
      await savedFilter.click();
      await page.waitForTimeout(300);

      // Step 3: Click the three-dots button and select Delete filter
      await savedFilter.locator('twc-icon[name="three-dots-vertical"]').click();
      await page.waitForTimeout(500);
      await savedFilter.locator('twc-menu-item').filter({ hasText: 'Delete filter' }).click();
      await page.waitForTimeout(500);

      // Step 4: Verify delete dialog elements and confirm deletion
      await auditProcessInstancepage4x.verifyAndConfirmDeleteFilterDialog();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 5: Verify the deleted filter is no longer visible in the saved filters list
      await expect(savedFilter).not.toBeVisible();
    });

    test("24. Verify duplicate filter name shows an error when saving with existing name", async () => {
      // Prerequisite: saved filter already exists (created in test 21)
      // Step 1: Verify the existing saved filter is visible in the list
      await expect(auditProcessInstancepage4x.savedFilterItem(d.duplicateFilterName)).toBeVisible();

      // Step 2: Click the filter panel icon in the toolbar
      await auditProcessInstancepage4x.clickOnFilterIcon();
      await page.waitForTimeout(500);

      // Step 3: Click the filter icon to open the audit filter dialog
      await auditProcessInstancepage4x.clickOnAddFilterIcon();
      await page.waitForTimeout(500);

      // Step 4: Verify the Audit Filter dialog is open
      await auditProcessInstancepage4x.verifyAuditFilterDialog();

      // Step 5: Click Add Rule button
      await auditProcessInstancepage4x.addRuleButton.click();
      await page.waitForTimeout(500);

      // Step 6: Open rule field dropdown and select PVM Id field
      await auditProcessInstancepage4x.selectDropdownOptionByText(auditProcessInstancepage4x.ruleFieldSelect, d.pvmFieldName);
      await page.waitForTimeout(500);

      // Step 7: Select "Equal" from the operator dropdown
      await auditProcessInstancepage4x.selectDropdownFirstOption(auditProcessInstancepage4x.operatorSelect);
      await page.waitForTimeout(500);

      // Step 8: Enter PVM ID value in the input field
      await auditProcessInstancepage4x.ruleValueInput.locator('#input').fill(d.pvmIDval);
      await page.waitForTimeout(500);

      // Step 9: Click Save filter button and then Apply filter button
      await auditProcessInstancepage4x.saveFilterButton.click();
      await page.waitForTimeout(500);
      await auditProcessInstancepage4x.applyFilterActionButton.click();
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(1000);

      // Step 10: Click Save filters to open the save query dialog
      await auditProcessInstancepage4x.saveFilterButtonafterapply.click();
      await page.waitForTimeout(500);

      // Step 11: Verify save query dialog is open
      await expect(auditProcessInstancepage4x.saveQueryDialogHeader).toContainText(d.saveQueryDialogTitle);

      // Step 12: Enter the duplicate filter name (already exists)
      await auditProcessInstancepage4x.saveQueryInputField.pressSequentially(d.duplicateFilterName);
      await page.waitForTimeout(500);

      // Step 13: Click Save
      await auditProcessInstancepage4x.saveQuerySaveButton.click();
      await page.waitForTimeout(500);

      // Step 14: Verify duplicate name alert message is shown
      await expect(page.getByText(d.alreadyExistsError)).toBeVisible();

      // Step 15: Close the save query dialog
      await auditProcessInstancepage4x.saveQueryDialogCloseBtn.click();
      await page.waitForTimeout(500);
    });

  });

});

// ─────────────────────────────────────────────────────────────────────────
// Regression: Audit Process Instance - 4x Server
// ─────────────────────────────────────────────────────────────────────────
test.describe("Audit Process Instance - 4x Server Regression", () => {

  test("25. Verify filter priority has string type", async () => {
    await page.goto(dataset.uniUIworkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
    await auditProcessInstancepage4x.navigateToAudit();
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
    await page.locator('span[title="Process Instances"]').click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    await auditProcessInstancepage4x.clickOnFilterIcon();
    await auditProcessInstancepage4x.clickOnAddFilterIcon();
    await auditProcessInstancepage4x.addRuleButton.click();
    await auditProcessInstancepage4x.selectDropdownFirstOption(auditProcessInstancepage4x.ruleFieldSelect);
    await auditProcessInstancepage4x.selectDropdownFirstOption(auditProcessInstancepage4x.operatorSelect);
    await page.waitForTimeout(500);

    // Regression: Priority input type must be "text" (String), not "number"
    const priorityInput = auditProcessInstancepage4x.ruleValueInput.locator('#input');
    await expect(priorityInput).toHaveAttribute('type', 'text');
    await priorityInput.fill(d.priorityHigh);
    await expect(priorityInput).toHaveValue(d.priorityHigh);
    await expect(auditProcessInstancepage4x.saveFilterButton).toBeEnabled();

    await auditProcessInstancepage4x.ruleBuilderCloseBtn.click();
    await auditProcessInstancepage4x.refresh();
  });

  test("26. The 'Referenced Work Items' button does not work on re-click after refreshing the process instance.", async () => {
    const refWorkItemsLink = auditProcessInstancepage4x.processInstanceRows.first().locator("text=Referenced work items");

    // Step 1: Click "Referenced work items" on the first process instance row
    await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();
    await refWorkItemsLink.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Step 2: Click Refresh — page returns to all process instances
    await auditProcessInstancepage4x.refresh();

    // Step 3: Verify process instances list is visible after refresh
    await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();

    // Step 4: Click "Referenced work items" again — regression check (previously not clickable after refresh)
    await refWorkItemsLink.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Step 5: Verify it works correctly after refresh
    await expect(
      page.locator('twc-table-row[preventselection][details]').first()
        .or(page.getByText(d.noWorkItem))
    ).toBeVisible();

    // Step 6: Refresh the page
    await auditProcessInstancepage4x.refresh();
  });

  test("27. Verify filter - filter page contains only Apply filters btn (previously it was Cancel btn there)", async () => {
    // Step 1: Click the filter panel icon in the toolbar
    await auditProcessInstancepage4x.clickOnFilterIcon();
    await page.waitForTimeout(500);

    // Step 2: Regression check — "Apply filters" button must be visible
    await expect(auditProcessInstancepage4x.applyFilterActionButton).toBeVisible();

    // Step 3: Regression check — "Cancel" button must NOT be present (was there previously)
    await expect(page.locator("div.actionBtn twc-button").filter({ hasText: "Cancel" })).not.toBeVisible();

    // Step 4: Close the filter panel
    await auditProcessInstancepage4x.arrowBackButton.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);
  });

  test("28. Verify that no blank entry is displayed at the end of the Audit Process Instance.", async () => {
    // Step 1: Verify the process instances list is loaded with rows
    await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();

    // Step 2: Get the total row count
    const rowCount = await auditProcessInstancepage4x.processInstanceRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Step 3: Get the Process Instance ID (first cell) of the last row
    const lastRowPID = await auditProcessInstancepage4x.processInstanceRows.last()
      .locator('twc-table-cell').first().textContent();

    // Step 4: Regression check — last row must not be a blank record (Process Instance ID should not be empty)
    expect(lastRowPID?.trim()).not.toBe("");
  });

  test("29. Verify message IDs are updated", async () => {
    // Step 1: Click the first process instance row to open audit details
    await expect(auditProcessInstancepage4x.processInstanceRows.first()).toBeVisible();
    await auditProcessInstancepage4x.processInstanceRows.first().click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);

    // Step 2: Verify audit details page is open
    await expect(auditProcessInstancepage4x.auditDetailsWrapper).toBeVisible();

    // Step 3: Get all Message ID cell values from the audit details table (2nd column)
    const messageIDCells = page.locator('bpme-audit-list-managed-objects twc-table-row twc-table-cell:nth-child(2)');
    const messageIDTexts = await messageIDCells.allTextContents();

    // Step 4: Regression check — old message IDs must NOT be present in Message ID column
    for (const oldID of d.oldMessageIDs) {
      const foundOld = messageIDTexts.some(text => text.trim() === oldID);
      expect(foundOld, `Old message ID "${oldID}" must not exist — should have been updated`).toBe(false);
    }

    // Step 5: Regression check — if related event types exist, they must use the NEW message ID format
    for (const newID of d.newMessageIDs) {
      const hasRelatedEvent = messageIDTexts.some(text => text.trim().endsWith(newID.split('_').slice(-3).join('_')));
      if (hasRelatedEvent) {
        const foundNew = messageIDTexts.some(text => text.trim() === newID);
        expect(foundNew, `Updated message ID "${newID}" should be present instead of the old prefixed version`).toBe(true);
      }
    }

    // Step 6: Navigate back to process instances list
    await auditProcessInstancepage4x.navigateBackButton.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
  });

  test("30. Verify 'no matches' option should be disabled when the filter search returns no results", async () => {
    // Step 1: Click the filter panel icon in the toolbar
    await auditProcessInstancepage4x.clickOnFilterIcon();
    await page.waitForTimeout(500);

    // Step 2: Click the add filter icon to open the Audit Filter dialog
    await auditProcessInstancepage4x.clickOnAddFilterIcon();
    await page.waitForTimeout(500);

    // Step 3: Click Add Rule button
    await auditProcessInstancepage4x.addRuleButton.click();
    await page.waitForTimeout(500);

    // Step 4: Open the rule field dropdown and type a text that returns no matches
    await auditProcessInstancepage4x.ruleFieldSelect.locator('twc-popup svg').click();
    await page.waitForTimeout(300);
    await auditProcessInstancepage4x.ruleFieldSelect.locator('#input').fill(d.filterSearchNoMatchTerm);
    await page.waitForTimeout(500);

    // Step 5: Verify "No matches" text is shown in the dropdown options list
    const noMatchesOption = auditProcessInstancepage4x.ruleFieldSelect
      .locator('div.options-list twc-option').filter({ hasText: d.noMatchesText });
    await expect(noMatchesOption).toBeVisible();

    // Step 6: Regression check — the "No matches" option must be disabled (not selectable)
    await expect(noMatchesOption).toHaveAttribute('disabled', '');

    // Step 7: Open the operator dropdown and type a text that returns no matches
    await auditProcessInstancepage4x.operatorSelect.locator('twc-popup svg').click();
    await page.waitForTimeout(300);
    await auditProcessInstancepage4x.operatorSelect.locator('#input').fill(d.filterSearchNoMatchTerm);
    await page.waitForTimeout(500);

    // Step 9: Verify "No matches" text is shown in the operator dropdown options list
    const noMatchesOperatorOption = auditProcessInstancepage4x.operatorSelect
      .locator('div.options-list twc-option').filter({ hasText: d.noMatchesText });
    await expect(noMatchesOperatorOption).toBeVisible();

    // Step 10: Regression check — the "No matches" option in operator dropdown must be disabled
    await expect(noMatchesOperatorOption).toHaveAttribute('disabled', '');

    // Step 11: Verify rule builder panel filter text and close dialog
    await auditProcessInstancepage4x.verifyRuleBuilderPanel();
    await page.waitForTimeout(500);

    // Step 8: Close the filter panel
    await auditProcessInstancepage4x.arrowBackButton.click();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(500);
    await auditProcessInstancepage4x.refresh();
  });

});
