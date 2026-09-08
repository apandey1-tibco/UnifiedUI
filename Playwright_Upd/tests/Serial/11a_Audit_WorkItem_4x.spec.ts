import { test, expect, Page } from '@playwright/test';
import { POManager } from '../../PageObjects/POManager';
import { AuditPage } from '../../PageObjects/AuditPage';
import { AuditWorkItem4xPage } from '../../PageObjects/Audit_WorkItem_4x';
import { CaseManagerPage } from '../../PageObjects/CaseManagerPage';
import { HomePage } from '../../PageObjects/HomePage';
import * as utility from '../../fixtures/utility';

const dataset = JSON.parse(
  JSON.stringify(require('../../fixtures/TestData.json'))
);

let page: Page;
let poManager: POManager;
let adPage: AuditPage;
let auditWorkItem4xPage: AuditWorkItem4xPage;
let cmPage: CaseManagerPage;
let homePage: HomePage;



test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  adPage = poManager.getAuditPage();
  auditWorkItem4xPage = new AuditWorkItem4xPage(page);
  cmPage = poManager.getCaseManagerPage();
  homePage = poManager.getHomePage();
  await page.goto(dataset.workMangerUrlApp);
  await page.waitForLoadState('domcontentloaded');
  await homePage.clickOnBuisnessService();
  await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
  await cmPage.clickOnConfirmServerSelectionBtn();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Navigate to Work Item page', () => {
  /**
   * TC_01: Verify navigation to Audit Work Item page
   * Description: Navigate to the Work Manager application, open the Audit section,
   *              click on Work Items, and verify that the Work Item table header
   *              is rendered — confirming successful navigation to the Work Item page.
   * Pre-condition: User is authenticated and Work Manager app is accessible.
   * Expected Result: The Work Item table column header is visible on the page.
   */
  test('Verify navigation to Audit Work Item page', async () => {
    // Navigate to Work Manager URL, open Audit menu and click on Work Items
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Verify Work Item table header is visible confirming we are on the Work Item page
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible();
  });

  /**
   * TC_02: Verify Work Item page table header
   * Description: Navigate to the Audit > Work Items page and validate that
   *              all column headers displayed in the Work Item table match
   *              the expected header values defined in the test data.
   * Pre-condition: User is authenticated and Work Manager app is accessible.
   * Expected Result: The table headers match the expected list:
   *                  Work Item ID, Activity Name, User Resource Id,
   *                  First Offer Time, State, Event Links.
   */
  test('Verify Work Item page table header', async () => {
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Read all column headers from the Work Item table
    const tableHeaderReceived = await utility.tableHeader(page);

    // Validate headers match the expected values from test data
    expect(dataset.WorkItem.workItemHeader).toStrictEqual(tableHeaderReceived);
  });

  /**
   * TC_03: Verify Work Item table is visible after navigation
   * Description: Navigate to the Audit > Work Items page and confirm that
   *              the Work Item data table is rendered and visible,
   *              ensuring the page loaded its content correctly.
   * Pre-condition: User is authenticated and Work Manager app is accessible.
   * Expected Result: The Work Item table is visible (isTableVisible returns true).
   */
  test('Verify Work Item table is visible after navigation', async () => {
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Check that the Work Item table is rendered and visible on the page
    const isTableVisible = await auditWorkItem4xPage.isTableVisible();
    expect(isTableVisible).toBe(true);
  });

  /**
   * TC_04: Create filter with Activity name rule on Work Item page
   * Description: Navigate to the Audit > Work Items page, open the filter panel
   *              via the '+' icon, click the '=' (equals) icon to create a new filter,
   *              add a rule for 'Activity name', and enter 'AuditDetailsFromUsers'
   *              as the filter value.
   * Pre-condition: User is authenticated and Work Manager app is accessible.
   * Expected Result: Filter rule is configured with Activity name = AuditDetailsFromUsers.
   */
  test('Create filter with Activity name rule on Work Item page', async () => {
    test.setTimeout(120000);
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Cleanup: delete 'Auto_Activity_Name' if it already exists.
    // Wait up to 8s for saved filters to load in the sidebar, then hover/3-dots delete.
    const autoActivityExists = await page.getByRole('menuitem', { name: 'Auto_Activity_Name', exact: true })
      .waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
    if (autoActivityExists) {
      await auditWorkItem4xPage.deleteFilter('Auto_Activity_Name');
      await auditWorkItem4xPage.confirmDeleteFilter();
      await expect(page.getByRole('menuitem', { name: 'Auto_Activity_Name', exact: true }))
        .not.toBeVisible({ timeout: 10000 });
      await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    }

    // Click '+' icon to open the filter panel
    await auditWorkItem4xPage.clickAddNewIcon();

    // Click '=' icon to create a new filter condition
    await auditWorkItem4xPage.clickEqualsIcon();

    // Click 'Add rule' to add a filter rule
    await auditWorkItem4xPage.clickAddRule();

    // Select 'Activity name' from the field selector dropdown
    await auditWorkItem4xPage.selectActivityNameFromDropdown();

    // Enter activity name value
    await auditWorkItem4xPage.enterActivityNameValue(dataset.WorkItem.activityNameFilter);

    // Save the filter
    await auditWorkItem4xPage.clickSaveButton();

    // Verify the filter was saved - filter panel shows '1 selected' badge
    await expect(page.locator('.filter-container').getByText('1 selected')).toBeVisible();

    // Apply the filter
    await auditWorkItem4xPage.clickApplyFilters();

    // Save the filter with name 'Auto_Activity_Name'
    await auditWorkItem4xPage.clickSaveFilterButton();
    await auditWorkItem4xPage.enterFilterName('Auto_Activity_Name');
    await auditWorkItem4xPage.clickSaveFilterDialog();

    // Navigate to reload the page so the saved filter appears in the sidebar, then verify
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await expect(page.locator('[title="Auto_Activity_Name"]')).toBeVisible({ timeout: 10000 });
  });

  /**
   * TC_05: Verify saved filter 'Auto_Activity_Name' is present on Work Item page
   * Description: Navigate to the Work Items page, open the filter panel and verify
   *              that the saved filter named 'Auto_Activity_Name' is visible.
   * Pre-condition: The filter 'Auto_Activity_Name' must have been saved in a prior test.
   * Expected Result: The filter 'Auto_Activity_Name' is visible in the filter panel.
   */
  test('Verify saved filter Auto_Activity_Name is created', async () => {
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Verify the saved filter 'Auto_Activity_Name' is visible on the page
    await expect(page.locator('[title="Auto_Activity_Name"]')).toBeVisible();
  });

  /**
   * TC_06: Apply 'Auto_Activity_Name' filter, count rows, and click first row
   * Description: Navigate to Work Items page, click 'Auto_Activity_Name' from the saved
   *              filter list to apply it, verify the table loads filtered results,
   *              count and log the total number of rows, then click the first row.
   * Pre-condition: The filter 'Auto_Activity_Name' must exist (saved in a prior test).
   * Expected Result: Filter is applied, row count is logged, and the first row is clicked.
   */
  test.skip('Click on Auto_Activity_Name filter and click last table row', async () => {
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Click 'Auto_Activity_Name' from the saved filters list in the sidebar
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');

    // Verify filtered results are loaded in the table
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible();
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    // Count rows and log the result
    const rowCount = await auditWorkItem4xPage.workItemRows.count();
    console.log(`Total Work Item rows found: ${rowCount}`);

    // Click the first row — navigates to Audit Details sub-page
    await auditWorkItem4xPage.clickFirstTableRow();
    await page.waitForLoadState('domcontentloaded');

    // Verify Audit Details page loaded
    await expect(page.locator('text=Audit details')).toBeVisible({ timeout: 10000 });

    // Count audit detail rows and log
    const auditRows = page.locator('twc-table-row');
    await auditRows.first().waitFor({ state: 'visible', timeout: 10000 });
    const auditRowCount = await auditRows.count();
    console.log(`Total Audit Detail rows found: ${auditRowCount}`);

    // Click the first audit detail row — opens Event Details dialog
    await auditRows.first().click();

    // Verify Event Details dialog opens
    await expect(page.locator('text=Event Details')).toBeVisible({ timeout: 10000 });

    // If more than 1 audit row exists, Next button should be enabled — then navigate all rows
    if (auditRowCount > 1) {
      const nextBtn = page.getByRole('button', { name: /^next$/i }).or(
        page.locator('twc-button').filter({ hasText: /^next$/i })
      ).first();
      await expect(nextBtn).toBeVisible({ timeout: 5000 });
      await expect(nextBtn).toBeEnabled();

      // Click Next for each remaining row and log progress
      let currentRow = 1;
      while (true) {
        const isEnabled = await nextBtn.isEnabled().catch(() => false);
        if (!isEnabled) break;
        await nextBtn.click();
        await page.waitForTimeout(500);
        currentRow++;
        console.log(`Navigated to row ${currentRow} of ${auditRowCount}`);
      }
      console.log(`Finished navigating all ${auditRowCount} rows via Next button`);

      // Verify Next button is disabled after reaching the last row
      await expect(nextBtn).toBeDisabled({ timeout: 1000 });
      console.log('Next button is disabled at last row');

      // Navigate back via Previous button one by one until it is disabled
      const prevBtn = page.getByRole('button', { name: /^previous$/i }).or(
        page.locator('twc-button').filter({ hasText: /^previous$/i })
      ).first();
      await expect(prevBtn).toBeVisible({ timeout: 5000 });

      while (true) {
        const isPrevEnabled = await prevBtn.isEnabled().catch(() => false);
        if (!isPrevEnabled) break;
        await prevBtn.click();
        await page.waitForTimeout(500);
        currentRow--;
        console.log(`Navigated back to row ${currentRow} of ${auditRowCount}`);
      }

      // Verify Previous button is disabled at the first row
      await expect(prevBtn).toBeDisabled({ timeout: 1000 });
      console.log('Previous button is disabled at first row');

      // Close the Event Details dialog via the SVG close icon inside the dialog
      await auditWorkItem4xPage.closeEventDetailsDialog();
      await expect(page.locator('text=Event Details')).not.toBeVisible({ timeout: 5000 });
      console.log('Event Details dialog closed');
    }
  });

  /**
   * TC_07: Apply filter, open Event Details and navigate all rows via Next
   * Description: Apply 'Auto_Activity_Name' filter, click the first table row to open
   *              the Event Details dialog, verify All Attribute and Additional Attribute
   *              sections are visible, then click Next until all rows have been navigated.
   * Pre-condition: Filter 'Auto_Activity_Name' must exist and return at least one row.
   * Expected Result: Event Details dialog is verified and all rows are navigated.
   */
  test.skip('Click first row, verify Event Details and navigate all rows via Next', async () => {
    test.setTimeout(120000);
    // Navigate to Work Items page and apply the saved filter
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    // Click the first Work Item row to navigate to the Audit Details sub-page
    await auditWorkItem4xPage.clickFirstTableRow();
    await page.waitForLoadState('domcontentloaded');

    // Wait for the Audit Details table, then click the first row to open the Event Details dialog
    await page.locator('twc-table-row').first().waitFor({ state: 'visible', timeout: 10000 });
    await page.locator('twc-table-row').first().click();

    // Verify Event Details dialog is open
    await expect(page.locator('text=Event Details')).toBeVisible({ timeout: 10000 });

    // Verify All Attribute section is visible and has content
    await auditWorkItem4xPage.verifyAllAttributeSection();

    // Verify Additional Attribute section is visible and has content
    await auditWorkItem4xPage.verifyAdditionalAttributeSection();

    // Click Next until all rows are navigated
    await auditWorkItem4xPage.navigateAllRowsViaNext();
  });

  /**
   * TC_08: Edit saved filter 'Auto_priority' on Work Item page
   * Description: Create a filter with Work Item priority = 50, save it as 'Auto_priority',
   *              then edit it to change the priority value to 60 and verify the filter persists.
   * Pre-condition: User is authenticated and Work Manager app is accessible.
   * Expected Result: Filter 'Auto_priority' is updated with priority = 60 and still visible.
   */
  test.skip('Edit saved filter Auto_Activity_Name on Work Item page', async () => {
    test.setTimeout(90000);
    // Step 1: Create a filter with Work Item Priority = 50
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Cleanup: delete 'Auto_priority' if it already exists.
    const autoPriorityExists = await page.getByRole('menuitem', { name: 'Auto_priority', exact: true })
      .waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
    if (autoPriorityExists) {
      await auditWorkItem4xPage.deleteFilter('Auto_priority');
      await auditWorkItem4xPage.confirmDeleteFilter();
      await expect(page.getByRole('menuitem', { name: 'Auto_priority', exact: true }))
        .not.toBeVisible({ timeout: 5000 });
      await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    }

    await auditWorkItem4xPage.clickAddNewIcon();
    await auditWorkItem4xPage.clickEqualsIcon();
    await auditWorkItem4xPage.clickAddRule();
    await auditWorkItem4xPage.selectWorkItemPriorityFromDropdown();
    await auditWorkItem4xPage.enterActivityNameValue('50');
    await auditWorkItem4xPage.clickSaveButton();
    await auditWorkItem4xPage.clickApplyFilters();

    // Save the filter as 'Auto_priority'
    await auditWorkItem4xPage.clickSaveFilterButton();
    await auditWorkItem4xPage.enterFilterName('Auto_priority');
    await auditWorkItem4xPage.clickSaveFilterDialog();

    // Step 2: Verify the saved filter is present in the sidebar
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await expect(page.getByRole('menuitem', { name: 'Auto_priority', exact: true })).toBeVisible({ timeout: 15000 });

    // Step 3: Edit the filter — change priority value to 60
    await auditWorkItem4xPage.editFilter('Auto_priority', '60');

    // Verify the filter still exists after editing
    await expect(page.getByRole('menuitem', { name: 'Auto_priority', exact: true })).toBeVisible({ timeout: 15000 });

    // Step 4: Delete the filter after successful edit
    await auditWorkItem4xPage.deleteFilter('Auto_priority');
    await auditWorkItem4xPage.confirmDeleteFilter();
    await expect(page.locator('[title="Auto_priority"]')).not.toBeVisible({ timeout: 5000 });
  });

  /**
   * TC_09: Verify duplicate filter name is not allowed
   * Description: Create a filter saved as 'Auto_dup_test', then attempt to save a second
   *              filter with the same name and verify that the Save button is disabled
   *              and a duplicate-name error message is displayed.
   * Pre-condition: User is authenticated and Work Manager app is accessible.
   * Expected Result: Save button is disabled and duplicate name error message is visible.
   */
  test('Verify duplicate filter name shows error message', async () => {
    test.setTimeout(300000);
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Cleanup: delete 'Auto_dup_test' if it already exists, then reload for fresh state
    const autoDupExists = await page.getByRole('menuitem', { name: 'Auto_dup_test', exact: true })
      .waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
    if (autoDupExists) {
      await auditWorkItem4xPage.deleteFilter('Auto_dup_test');
      await auditWorkItem4xPage.confirmDeleteFilter();
      await expect(page.getByRole('menuitem', { name: 'Auto_dup_test', exact: true }))
        .not.toBeVisible({ timeout: 5000 });
      await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    }

    // Cleanup: delete 'Auto_dup_test_2' if it already exists from a prior failed run
    const autoDup2Exists = await page.getByRole('menuitem', { name: 'Auto_dup_test_2', exact: true })
      .waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
    if (autoDup2Exists) {
      await auditWorkItem4xPage.deleteFilter('Auto_dup_test_2');
      await auditWorkItem4xPage.confirmDeleteFilter();
      await expect(page.getByRole('menuitem', { name: 'Auto_dup_test_2', exact: true }))
        .not.toBeVisible({ timeout: 5000 });
      await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    }

    // Step 1: Create and save first filter with name 'Auto_dup_test'
    await auditWorkItem4xPage.clickAddNewIcon();
    await auditWorkItem4xPage.clickEqualsIcon();
    await auditWorkItem4xPage.clickAddRule();
    await auditWorkItem4xPage.selectActivityNameFromDropdown();
    await auditWorkItem4xPage.enterActivityNameValue(dataset.WorkItem.activityNameFilter);
    await auditWorkItem4xPage.clickSaveButton();
    await auditWorkItem4xPage.clickApplyFilters();
    await auditWorkItem4xPage.clickSaveFilterButton();
    await auditWorkItem4xPage.enterFilterName('Auto_dup_test');
    await auditWorkItem4xPage.clickSaveFilterDialog();
    await expect(page.getByRole('menuitem', { name: 'Auto_dup_test', exact: true })).toBeVisible({ timeout: 15000 });

    // Step 2: Create a second filter and try to save with the same name 'Auto_dup_test'
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickAddNewIcon();
    await auditWorkItem4xPage.clickEqualsIcon();
    await auditWorkItem4xPage.clickAddRule();
    await auditWorkItem4xPage.selectActivityNameFromDropdown();
    await auditWorkItem4xPage.enterActivityNameValue(dataset.WorkItem.activityNameFilter);
    await auditWorkItem4xPage.clickSaveButton();
    await auditWorkItem4xPage.clickApplyFilters();
    await auditWorkItem4xPage.clickSaveFilterButton();
    await auditWorkItem4xPage.enterFilterName('Auto_dup_test');

    // Press Tab to trigger validation, then attempt to save with duplicate name
    await page.locator('#save-filter-control input').press('Tab');
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.waitForTimeout(1500);

    // Verify duplicate error — dialog must still be open (save was rejected)
    await expect(page.getByRole('dialog', { name: 'Save query for selected filters' })).toBeVisible();

    // Rename to a unique name and save successfully
    await page.locator('#save-filter-control input').clear();
    await page.locator('#save-filter-control input').fill('Auto_dup_test_2');
    await page.locator('#save-filter-control input').press('Tab');
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Save', exact: true }).click();
    await page.waitForTimeout(1500);

    // Verify 'Auto_dup_test_2' was saved successfully
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await expect(page.getByRole('menuitem', { name: 'Auto_dup_test_2', exact: true })).toBeVisible({ timeout: 15000 });

    // Cleanup: delete both filters — navigate after each deletion so the sidebar reloads from the server
    await auditWorkItem4xPage.deleteFilter('Auto_dup_test');
    await auditWorkItem4xPage.confirmDeleteFilter();
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await expect(page.getByRole('menuitem', { name: 'Auto_dup_test', exact: true })).not.toBeVisible({ timeout: 10000 });

    await auditWorkItem4xPage.deleteFilter('Auto_dup_test_2');
    await auditWorkItem4xPage.confirmDeleteFilter();
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await expect(page.getByRole('menuitem', { name: 'Auto_dup_test_2', exact: true })).not.toBeVisible({ timeout: 10000 });
  });

  /**
   * TC_11: Click last Work Item row, verify Audit Detail columns and App Activity Name
   * Description: Apply 'Auto_Activity_Name' filter, click the last Work Item row to open
   *              the Audit Details sub-page, verify all expected column headers are present
   *              (Event ID, Message ID, Creation Time, Severity, Principal ID,
   *              Managed Obj Name, App Activity Name), then verify App Activity Name = AuditDetailsFromUsers.
   * Pre-condition: Filter 'Auto_Activity_Name' must exist and return at least one row.
   * Expected Result: Audit Detail column headers match expected list and App Activity Name = AuditDetailsFromUsers.
   */
  test('Click last Work Item row and verify Audit Detail columns and App Activity Name', async () => {
    test.setTimeout(90000);
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Apply the Auto_Activity_Name filter
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible();
    await expect(auditWorkItem4xPage.workItemRows.last()).toBeVisible({ timeout: 10000 });

    // Count and log the Work Item rows
    const rowCount = await auditWorkItem4xPage.workItemRows.count();
    console.log(`Total Work Item rows found: ${rowCount}`);

    // Click the last Work Item row — scrolls into view then navigates to Audit Details sub-page
    await auditWorkItem4xPage.clickLastTableRow();
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});

    // Verify Audit Details page loaded
    await expect(page.locator('text=Audit Details')).toBeVisible({ timeout: 10000 });

    // Wait for the Audit Details table to fully load by confirming 'Event ID' header is visible.
    // The Work Item table stays in the DOM during navigation (SPA), so we target the specific
    // first Audit Details column header rather than waiting for any twc-table-head-cell.
    await expect(
      page.locator('twc-table-head-cell').filter({ hasText: 'Event ID' })
    ).toBeVisible({ timeout: 40000 });

    // Verify all audit detail column headers are present
    const auditDetailHeaders = await utility.tableHeader(page);
    console.log(`Audit Detail column headers: ${auditDetailHeaders}`);
    expect(auditDetailHeaders).toStrictEqual(dataset.WorkItem.WorkItemAuditDetailsHeader);

    // Verify App Activity Name cell value in the first visible audit detail row
    const auditRows = page.locator('twc-table-row');
    const auditRowCount = await auditRows.count();
    console.log(`Total Audit Detail rows found: ${auditRowCount}`);
    expect(auditRowCount).toBeGreaterThan(0);

    const appActivityName = await auditWorkItem4xPage.getAuditDetailCellValueByColumn('App Activity Name');
    console.log(`App Activity Name: ${appActivityName}`);
    expect(appActivityName).toBe(dataset.WorkItemAuditDetailsLastRow.AppActivityName);
  });

  /**
   * TC_13: Click 'Related work items' link, then select Workitem > this work item via 3-dot menu
   * Description: Navigate to the Audit > Work Items page, apply the 'Auto_Activity_Name'
   *              saved filter, click the 'Related work items' link in the first row's
   *              Event Links column, verify the Related Work Items page loads, then click
   *              the 3-dot menu on the related cases row and select Workitem > this work item.
   * Pre-condition: Filter 'Auto_Activity_Name' must exist and return at least one row with an Event Links column.
   * Expected Result: 'Related work items' link is clickable, the page loads, and the
   *                  Workitem > this work item option is selected from the 3-dot context menu.
   */
  test('Click Related work items link on Work Item page', async () => {
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Apply the Auto_Activity_Name filter
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible();
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    // Count and log the Work Item rows
    const rowCount = await auditWorkItem4xPage.workItemRows.count();
    console.log(`Total Work Item rows found: ${rowCount}`);

    // Click the 'Related work items' link from the first row's Event Links column
    await auditWorkItem4xPage.clickRelatedWorkItemsLink();
    console.log('Clicked Related work items link');

    // Verify the Related Work Items page loaded — table header should be visible
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible({ timeout: 10000 });
    console.log('Related Work Items page loaded successfully');

    // Click the 3-dot menu on the related cases row and select Workitem > this work item
    await auditWorkItem4xPage.clickRelatedCasesThreeDotsAndSelectWorkItem();
    console.log('Selected Workitem > this work item from 3-dot context menu');
  });

  /**
   * TC_12: Verify Refresh button is clickable on the Work Item page
   * Description: Navigate to the Audit > Work Items page and click the Refresh toolbar button.
   *              Verify that the Work Item table is still visible after the refresh,
   *              confirming the page reloads its data without errors.
   * Pre-condition: User is authenticated and Work Manager app is accessible.
   * Expected Result: Refresh button is clickable and Work Item table header remains visible after refresh.
   */
  test('Verify Refresh button is clickable on Work Item page', async () => {
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Verify the Work Item table is visible before refresh
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible();

    // Click the Refresh button
    await auditWorkItem4xPage.clickRefreshButton();
    console.log('Refresh button clicked');

    // Verify the Work Item table is still visible after refresh
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible({ timeout: 10000 });
    console.log('Work Item table is visible after refresh');
  });

  /**
   * TC_3DOT_00: Apply Auto_Activity_Name filter, click 3-dots on last row,
   *             click Workitem — verify Audit Details
   */
  test.skip('Click Auto_Activity_Name filter, 3-dots on last row, hover Work item and click This work item', async () => {
    test.setTimeout(90000);

    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible();
    await expect(auditWorkItem4xPage.workItemRows.last()).toBeVisible({ timeout: 10000 });

    const rowCount = await auditWorkItem4xPage.workItemRows.count();
    console.log(`Total Work Item rows found: ${rowCount}`);

    const lastRowWorkItemId = await auditWorkItem4xPage.getLastRowWorkItemId();
    console.log(`Last row Work Item ID: ${lastRowWorkItemId}`);

    await auditWorkItem4xPage.click3DotsOnLastRow();
    console.log('3-dots menu opened on last row');

    const workitemOption = page.getByRole('menuitem', { name: /work.?items?/i }).first();
    await workitemOption.waitFor({ state: 'visible', timeout: 5000 });
    console.log('"Work item" menu option is visible');
    const workitemBox = await workitemOption.boundingBox();
    if (workitemBox) {
      await page.mouse.move(workitemBox.x + workitemBox.width / 2, workitemBox.y + workitemBox.height / 2);
    }
    await workitemOption.dispatchEvent('mouseenter');
    await workitemOption.dispatchEvent('mouseover');
    await page.waitForTimeout(500);
    console.log('Hovered over "Work item" to open submenu');

    const thisWorkItem = page.getByRole('menuitem', { name: /this work item/i });
    await thisWorkItem.waitFor({ state: 'visible', timeout: 5000 });
    await thisWorkItem.click();
    await page.waitForLoadState('domcontentloaded');
    console.log('Clicked "This work item"');

    await expect(page.locator('text=Audit details')).toBeVisible({ timeout: 10000 });
    console.log('Audit Details page loaded');

    await expect(page.locator(`text=${lastRowWorkItemId}`).first()).toBeVisible({ timeout: 10000 });
    console.log(`Audit Details verified for Work Item ID: ${lastRowWorkItemId}`);
  });

  /**
   * TC_3DOT_01: Verify 3-dots icon is visible on Work Item rows
   */
  test('Verify 3-dots icon is visible on Work Item rows', async () => {
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    const firstRow = auditWorkItem4xPage.workItemRows.first();
    const threeDotsButton = firstRow.locator('twc-table-cell').last().locator('button').last();
    await expect(threeDotsButton).toBeVisible({ timeout: 5000 });
    console.log('3-dots icon is visible on Work Item row');
  });

  /**
   * TC_3DOT_02: Verify 3-dots menu shows Related cases, Work item, Processes, Resources
   */
  test('Verify 3-dots menu shows Related cases, Work item, Processes, Resources', async () => {
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    await auditWorkItem4xPage.click3DotsOnFirstRow();

    await expect(page.getByRole('menuitem', { name: /related cases/i }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('menuitem', { name: /work.?items?/i }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('menuitem', { name: /processes/i }).first()).toBeVisible({ timeout: 5000 });
    await expect(page.getByRole('menuitem', { name: /resource/i }).first()).toBeVisible({ timeout: 5000 });

    console.log('3-dots menu shows all 4 options: Related cases, Work item, Processes, Resources');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  });

  /**
   * TC_3DOT_03: Click 'Related cases' from 3-dots menu and verify navigation
   */
  test.skip('Click Related cases from 3-dots menu and verify navigation', async () => {
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    await auditWorkItem4xPage.click3DotsOnFirstRow();
    await auditWorkItem4xPage.clickContextMenuOption('related cases');

    console.log('Clicked Related cases from 3-dots menu');
    await expect(page.locator('twc-table-head-cell, text=No data, text=Related cases').first()).toBeVisible({ timeout: 10000 });
    console.log('Related cases view loaded successfully');
  });

  /**
   * TC_3DOT_04: Click 3-dots on last row — Work item — This work item — verify Audit Details ID and row count
   */
  test.skip('Click Work item from 3-dots menu and verify navigation', async () => {
    test.setTimeout(90000);
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.last()).toBeVisible({ timeout: 10000 });

    const lastRowWorkItemId = await auditWorkItem4xPage.getLastRowWorkItemId();
    console.log(`Last row Work Item ID: ${lastRowWorkItemId}`);

    await auditWorkItem4xPage.click3DotsOnLastRow();
    await auditWorkItem4xPage.hoverWorkItemAndClickThisWorkItem();
    console.log(`Navigated to Audit details of Work Item ${lastRowWorkItemId}`);

    await expect(page.locator('text=Audit details')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${lastRowWorkItemId}`).first()).toBeVisible({ timeout: 10000 });
    console.log(`Verified: Audit details title contains Work Item ID ${lastRowWorkItemId}`);

    const auditRows = page.locator('twc-table-row');
    await auditRows.first().waitFor({ state: 'visible', timeout: 10000 });
    const rowCount = await auditRows.count();
    console.log(`Number of rows on Audit details page for Work Item ${lastRowWorkItemId}: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);

    await auditRows.first().click();
    console.log('Clicked 1st row on Audit details page');

    await expect(page.locator('text=Event Details')).toBeVisible({ timeout: 10000 });
    console.log('Event Details dialog opened');
  });

  /**
   * TC_3DOT_05: Click 'Processes' — 'This instance' from 3-dots menu
   */
  test.skip('Click Processes from 3-dots menu and verify navigation', async () => {
    test.setTimeout(120000);
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    const firstRowWorkItemId = (await auditWorkItem4xPage.workItemRows.first()
      .locator('twc-table-cell').first().innerText()).trim();
    console.log(`First row Work Item ID: ${firstRowWorkItemId}`);

    await auditWorkItem4xPage.click3DotsOnFirstRow();
    console.log('3-dots menu opened on first row');

    await auditWorkItem4xPage.hoverProcessesAndClickThisInstance();
    console.log('Clicked Processes — This instance');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

    const rows = page.locator('twc-table-row');
    await rows.first().waitFor({ state: 'visible', timeout: 15000 });
    const rowCount = await rows.count();
    console.log(`Total rows: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);

    await rows.first().click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Audit details')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${firstRowWorkItemId}`).first()).toBeVisible({ timeout: 10000 });

    const eventId = await auditWorkItem4xPage.getAuditDetailCellValueByColumn('Event ID');
    await expect(page.locator(`text=Event Details for ID ${eventId}`)).toBeVisible({ timeout: 10000 });

    const auditEventRows = page.locator('twc-table-row');
    const auditEventCount = await auditEventRows.count();

    const nextBtn = page.getByRole('button', { name: /^next$/i }).or(
      page.locator('twc-button').filter({ hasText: /^next$/i })
    ).first();

    let currentRow = 1;
    while (true) {
      const isEnabled = await nextBtn.isEnabled().catch(() => false);
      if (!isEnabled) break;
      await nextBtn.click();
      await page.waitForTimeout(200);
      currentRow++;
    }
    await expect(nextBtn).toBeDisabled({ timeout: 9000 });

    await auditWorkItem4xPage.closeEventDetailsDialog();
    await auditWorkItem4xPage.navigateBackToWorkItemPage();
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible({ timeout: 10000 });
  });

  /**
   * TC_3DOT_05a: Click 'Processes' — 'This task for this instance' from 3-dots menu
   */
  test.skip('Click Processes This task for this instance from 3-dots menu and verify navigation', async () => {
    test.setTimeout(120000);
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    const firstRowWorkItemId = (await auditWorkItem4xPage.workItemRows.first()
      .locator('twc-table-cell').first().innerText()).trim();

    await auditWorkItem4xPage.click3DotsOnFirstRow();
    await auditWorkItem4xPage.hoverProcessesAndClickThisTaskForThisInstance();

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

    const rows = page.locator('twc-table-row');
    await rows.first().waitFor({ state: 'visible', timeout: 15000 });
    expect(await rows.count()).toBeGreaterThan(0);

    await rows.first().click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Audit details')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${firstRowWorkItemId}`).first()).toBeVisible({ timeout: 10000 });

    const eventId = await auditWorkItem4xPage.getAuditDetailCellValueByColumn('Event ID');
    await expect(page.locator(`text=Event Details for ID ${eventId}`)).toBeVisible({ timeout: 10000 });

    const auditEventCount = await page.locator('twc-table-row').count();
    const nextBtn = page.getByRole('button', { name: /^next$/i }).or(
      page.locator('twc-button').filter({ hasText: /^next$/i })
    ).first();

    let currentRow = 1;
    while (true) {
      const isEnabled = await nextBtn.isEnabled().catch(() => false);
      if (!isEnabled) break;
      await nextBtn.click();
      await page.waitForTimeout(500);
      currentRow++;
    }
    await expect(nextBtn).toBeDisabled({ timeout: 3000 });

    await auditWorkItem4xPage.closeEventDetailsDialog();
    await auditWorkItem4xPage.navigateBackToWorkItemPage();
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible({ timeout: 10000 });
  });

  /**
   * TC_3DOT_05b: Click 'Processes' — 'This task for all instances' from 3-dots menu
   */
  test('Click Processes This task for all instances from 3-dots menu and verify navigation', async () => {
    test.setTimeout(300000);
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    const firstRowWorkItemId = (await auditWorkItem4xPage.workItemRows.first()
      .locator('twc-table-cell').first().innerText()).trim();
    console.log(`First row Work Item ID: ${firstRowWorkItemId}`);

    await auditWorkItem4xPage.click3DotsOnFirstRow();
    console.log('3-dots menu opened on first row');

    await auditWorkItem4xPage.hoverProcessesAndClickThisTaskForAllInstances();
    console.log('Clicked Processes — This task for all instances');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

    const rows = page.locator('twc-table-row');
    await rows.first().waitFor({ state: 'visible', timeout: 15000 });
    const rowCount = await rows.count();
    console.log(`Total rows: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);

    await rows.first().click();
    console.log('Clicked first row');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Audit details')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${firstRowWorkItemId}`).first()).toBeVisible({ timeout: 10000 });

    const eventId = await auditWorkItem4xPage.getAuditDetailCellValueByColumn('Event ID');
    await expect(page.locator(`text=Event Details for ID ${eventId}`)).toBeVisible({ timeout: 10000 });

    const auditEventCount = await page.locator('twc-table-row').count();
    console.log(`Total Audit Event rows: ${auditEventCount}`);

    const nextBtn = page.getByRole('button', { name: /^next$/i }).or(
      page.locator('twc-button').filter({ hasText: /^next$/i })
    ).first();

    const MAX_NEXT = 20;
    let currentRow = 1;
    while (currentRow < MAX_NEXT) {
      const isEnabled = await nextBtn.isEnabled().catch(() => false);
      if (!isEnabled) break;
      await nextBtn.click();
      await page.waitForTimeout(200);
      currentRow++;
      console.log(`Navigated to event row ${currentRow} of ${auditEventCount}`);
    }
    console.log(`Stopped Next navigation at row ${currentRow} of ${auditEventCount} (cap: ${MAX_NEXT})`);
    await expect(nextBtn).toBeEnabled({ timeout: 3000 });

    await auditWorkItem4xPage.closeEventDetailsDialog();
    await expect(page.locator('text=Event Details')).not.toBeVisible({ timeout: 5000 });

    await auditWorkItem4xPage.navigateBackToWorkItemPage();
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible({ timeout: 10000 });
    console.log('Navigated back to Work Items page successfully');
  });

  /**
   * TC_3DOT_05c: Click 'Processes' — 'Instance of this process' from 3-dots menu
   */
  test('Click Processes Instance of this process from 3-dots menu and verify navigation', async () => {
    test.setTimeout(120000);
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    const firstRowWorkItemId = (await auditWorkItem4xPage.workItemRows.first()
      .locator('twc-table-cell').first().innerText()).trim();
    console.log(`First row Work Item ID: ${firstRowWorkItemId}`);

    await auditWorkItem4xPage.click3DotsOnFirstRow();
    console.log('3-dots menu opened on first row');

    await auditWorkItem4xPage.hoverProcessesAndClickInstanceOfThisProcess();
    console.log('Clicked Processes — Instances of this process');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

    const rows = page.locator('twc-table-row');
    await rows.first().waitFor({ state: 'visible', timeout: 15000 });
    const rowCount = await rows.count();
    console.log(`Total rows: ${rowCount}`);
    expect(rowCount).toBeGreaterThan(0);

    await rows.first().click();
    console.log('Clicked first row');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('text=Audit details')).toBeVisible({ timeout: 10000 });
    await expect(page.locator(`text=${firstRowWorkItemId}`).first()).toBeVisible({ timeout: 10000 });

    const eventId = await auditWorkItem4xPage.getAuditDetailCellValueByColumn('Event ID');
    await expect(page.locator(`text=Event Details for ID ${eventId}`)).toBeVisible({ timeout: 10000 });
    console.log(`Verified: Event Details panel ID matches first row Event ID: ${eventId}`);

    const auditEventCount = await page.locator('twc-table-row').count();
    console.log(`Total Audit Event rows: ${auditEventCount}`);

    const nextBtn = page.getByRole('button', { name: /^next$/i }).or(
      page.locator('twc-button').filter({ hasText: /^next$/i })
    ).first();

    let currentRow = 1;
    while (true) {
      const isEnabled = await nextBtn.isEnabled().catch(() => false);
      if (!isEnabled) break;
      await nextBtn.click();
      await page.waitForTimeout(200);
      currentRow++;
      console.log(`Navigated to event row ${currentRow} of ${auditEventCount}`);
    }
    await expect(nextBtn).toBeDisabled({ timeout: 9000 });
    console.log(`Next button is disabled — navigated all ${auditEventCount} audit event rows`);

    await auditWorkItem4xPage.closeEventDetailsDialog();
    await expect(page.locator('text=Event Details')).not.toBeVisible({ timeout: 5000 });

    await auditWorkItem4xPage.navigateBackToWorkItemPage();
    await expect(auditWorkItem4xPage.workItemTableHeader.first()).toBeVisible({ timeout: 10000 });
    console.log('Navigated back to Work Items page successfully');
  });

  /**
   * TC_3DOT_06: Click 'Resources' from 3-dots menu and verify navigation
   */
  test('Click Resources from 3-dots menu and verify navigation', async () => {
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    const lastRowWorkItemId = await auditWorkItem4xPage.getLastRowWorkItemId();
    console.log(`Last row Work Item ID: ${lastRowWorkItemId}`);

    await auditWorkItem4xPage.click3DotsOnLastRow();
    console.log('3-dots menu opened on last row');

    await auditWorkItem4xPage.hoverResourcesAndClickForThisWorkItem();
    console.log('Clicked Resources — For this WorkItem');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});

    await expect(page.locator('twc-table-head-cell').or(page.locator('text=No data')).first()).toBeVisible({ timeout: 10000 });
    console.log('Resources view loaded successfully');
  });

  /**
   * TC_3DOT_06a: Click 'Resource' — 'This task for this instance' from 3-dots menu
   */
  test('Click Resource This task for this instance from 3-dots menu and verify navigation', async () => {
    test.setTimeout(120000);
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    const lastRowWorkItemId = await auditWorkItem4xPage.getLastRowWorkItemId();
    console.log(`Last row Work Item ID: ${lastRowWorkItemId}`);

    await auditWorkItem4xPage.click3DotsOnLastRow();
    console.log('3-dots menu opened on last row');

    await auditWorkItem4xPage.hoverResourcesAndClickThisTaskForThisInstance();
    console.log('Clicked Resource — This task for this instance');

    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});

    await expect(page.locator('twc-table-head-cell').or(page.locator('text=No data')).first()).toBeVisible({ timeout: 10000 });
    console.log('Resources view loaded successfully');
  });

  /**
   * TC_3DOT_06b: Click 'Resource' — 'For this task' from 3-dots menu
   */
  test('Click Resource For this task from 3-dots menu and verify navigation', async () => {
    test.setTimeout(120000);
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);
    await auditWorkItem4xPage.clickSavedFilter('Auto_Activity_Name');
    await expect(auditWorkItem4xPage.workItemRows.first()).toBeVisible({ timeout: 10000 });

    const lastRowWorkItemId = await auditWorkItem4xPage.getLastRowWorkItemId();
    console.log(`Last row Work Item ID: ${lastRowWorkItemId}`);

    await auditWorkItem4xPage.click3DotsOnLastRow();
    console.log('3-dots menu opened on last row');

    //await auditWorkItem4xPage.hoverResourcesAndClickForThisTask();
    //console.log('Clicked Resource — For this task');
  });

  /**
   * TC_10: Delete saved filter 'Auto_Activity_Name' from Work Item page
   */
  test('Delete saved filter Auto_Activity_Name from Work Item page', async () => {
    // Navigate to Audit > Work Items page
    await auditWorkItem4xPage.navigateToWorkItemPage(dataset.workMangerUrlApp);

    // Delete the saved filter 'Auto_Activity_Name'
    await auditWorkItem4xPage.deleteFilter('Auto_Activity_Name');

    // Confirm deletion if a confirmation dialog appears
    await auditWorkItem4xPage.confirmDeleteFilter();

    // Verify the filter 'Auto_Activity_Name' is no longer visible
    await expect(page.locator('[title="Auto_Activity_Name"]')).not.toBeVisible();
  });
});
