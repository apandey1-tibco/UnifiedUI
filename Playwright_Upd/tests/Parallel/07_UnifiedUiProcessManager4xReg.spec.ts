import { test, expect, request, Page, chromium } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { HomePage } from "../../PageObjects/HomePage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import * as utility from "../../fixtures/utility";
import { ProcessPage } from "../../PageObjects/ProcessPage";

// Load test data from JSON fixture
const dataset = JSON.parse(
    JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let homePage: HomePage;
let cmPage: CaseManagerPage;
let processPage: ProcessPage;

// Initialize page objects once for all tests in this file
test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    poManager = new POManager(page);
    homePage = poManager.getHomePage();
    cmPage = poManager.getCaseManagerPage();
    processPage = poManager.getProcessPage();
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 1: Basic Process Manager UI validations
// Verifies header, buttons, state filter, column selector functionality,
// and process template info popup (Module Name, Process Name)
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Verify Process Manager basic flow regression suite", () => {

    // Test 1: Navigate to Process Manager, start a process, verify UI elements and column selector, cancel the instance and verify it in the Historic tab
    test("BPMX-18848 | Verify Process Manager landing page UI, start process, apply state filter, toggle columns, cancel instance and view in Historic tab", async () => {
        // Navigate to the Work Manager and select the target BPM server
        await page.goto(dataset.workMangerUrl);
        await page.waitForLoadState("domcontentloaded");
        await homePage.clickOnBuisnessService();
        await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
        await cmPage.clickOnConfirmServerSelectionBtn();
        await processPage.naviagteToProcessTab();

        // Verify Process Manager landing page elements are visible
        await expect(processPage.header).toBeVisible();
        await expect(processPage.findInstancesButton).toBeVisible();
        await expect(processPage.startButton).toBeDisabled();

        // Start the BPMCreateCaseProcess to create an ACTIVE process instance
        await processPage.startProcess("ApprovalTestProject", "BPMCreateCaseProcess");

        // Refresh the instance list to load the newly started process instance
        await page.waitForTimeout(1000);
        await processPage.refreshInstances.click();

        // Apply ACTIVE state filter and verify the filter tag appears in the toolbar
        await processPage.filterByState("Active");
        expect(await processPage.filterTag.innerText()).toBe("ACTIVE");

        // Open the Column Selector and verify all default columns are present
        await processPage.coloumnSelector.click();
        await page.waitForTimeout(500);

        let tableHeader = await processPage.getTableHeader();
        expect(tableHeader).toStrictEqual(dataset.process.processHeader);
        await page.waitForTimeout(1000);

        // Uncheck the "Process Instance ID" column and verify it is deselected
        await processPage.procesInstanceId().click();
        await page.waitForTimeout(1000);
        await expect(processPage.procesInstanceId()).toHaveAttribute(
            "aria-checked",
            "false"
        );

        // Apply the column change and confirm "Process Instance ID" is removed from the table header
        await processPage.applyButton.click();
        tableHeader = await processPage.getTableHeader();
        expect(tableHeader).not.toContain("Process Instance ID");

        // Re-enable the "Process Instance ID" column and apply to restore default columns
        await processPage.coloumnSelector.click();
        await page.waitForTimeout(500);
        await processPage.procesInstanceId().click();
        await page.waitForTimeout(1000);
        await processPage.applyButton.click();

        // Capture the Process Instance ID from the first ACTIVE row before cancelling, for later verification in the Historic tab
        const processInstanceId = await processPage.getFirstRowProcessInstanceId();

        // Open the action menu on the first ACTIVE row, select Cancel, and confirm to cancel the process instance
        await processPage.actionMenuForFirstRowByState("ACTIVE").click();
        await processPage.cancelMenuItem.click();
        await processPage.yesButton.click();
        await page.waitForTimeout(1500);

        // Switch to the Historic tab to view completed/cancelled instances
        await processPage.historicTab.click();
        await page.waitForTimeout(2000);
        await processPage.refreshInstances.click();

        // Verify the cancelled instance appears anywhere in the Historic tab by matching the stored Process Instance ID
        await expect(
            page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()
        ).toBeVisible({ timeout: 10000 });

        // Switch back to Current tab to return to the default view after Historic tab verification
        await processPage.currentTab.click();
    });

    // Test 2: Click the info icon on the BPMCreateCaseProcess tree item and verify the popup displays the correct Module Name and Process Name
    test("BPMX-18849 | Verify Process info popup displays correct Module Name and Process Name for BPMCreateCaseProcess", async () => {
        // Navigate to the Process Manager
        await processPage.naviagteToProcessTab();

        // Filter and select BPMCreateCaseProcess in the process template tree
        await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");

        // Click the info (ⓘ) icon next to the process to open the details popup
        await processPage.processInfoIcon.click();

        // Verify the popup displays the correct Module Name and Process Name
        await processPage.verifyProcessInfo(
            dataset.process.BPMCreateCaseProcess.moduleName,
            dataset.process.BPMCreateCaseProcess.processName
        );

        // Dismiss the info popup to close it
        await processPage.dismissButton.click();
    });

    // Test 3: Suspend an ACTIVE instance, apply the Suspended filter and verify the tag, remove the filter, then cancel all instances via bulk Cancel
    test("BPMX-18850 | Verify Process Manager state filter works correctly when filtering by Suspended state and returns ACTIVE instances after filter removal", async () => {
        // Navigate to the Work Manager and select the target BPM server
        await processPage.naviagteToProcessTab();

        // Open BPMCreateCaseProcess and start 3 instances to ensure ACTIVE records exist
        await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");
        await processPage.startButton.click();
        await processPage.startButton.click();
        await processPage.startButton.click();

        // Refresh the instance list to load the newly started process instances
        await page.waitForTimeout(1000);
        await processPage.refreshInstances.click();

        // Verify ACTIVE instances are visible before applying any filter
        await expect(processPage.activeStateCell).toBeVisible({ timeout: 10000 });

        await processPage.actionMenuForFirstRowByState("ACTIVE").click();
        await processPage.suspendMenuItem.click();
        await page.waitForTimeout(1000);

        // Apply the Suspended state filter and verify the filter tag shows SUSPENDED
        await processPage.filterByState("Suspended");
        expect(await processPage.filterTag.innerText()).toContain("SUSPENDED");

        // Close the Suspended filter tag by clicking its remove button
        // Bug: After removing the Suspended filter, ACTIVE records are not re-displayed
        await processPage.filterTagRemoveButton.click();
        await page.waitForTimeout(500);

        // Verify ACTIVE records are displayed again after the Suspended filter is removed
        await expect(processPage.activeStateCell).toBeVisible({ timeout: 10000 });

        // Select all instances using the header checkbox
        await processPage.selectAllCheckbox.click();

        // Click Cancel selected instances button
        await processPage.cancelSelectedInstancesButton.click();

        // Verify the cancel confirmation dialog appears with the correct instance reference
        await expect(processPage.cancelSelectedConfirmDialog).toContainText('Are you sure you want to cancel');
        await processPage.cancelSelectedYesButton.click();
        await page.waitForTimeout(2000);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 2: Halted process management flows
// Covers Cancel, Allow to error (Deferred Purge), and Ignore & continue (Immediate Purge)
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Verify Process Manager Halted management flow", () => {

    // Test 1: Start a process that halts, then cancel the instance via Fix Process dialog
    test("BPMX-18851 | Verify Fix Process dialog displays correct cause of failure message and allows cancellation of a halted instance", async () => {
        // Navigate to the Work Manager and select the target BPM server
        await page.goto(dataset.workMangerUrl);
        await page.waitForLoadState("domcontentloaded");
        await homePage.clickOnBuisnessService();
        await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
        await cmPage.clickOnConfirmServerSelectionBtn();
        await processPage.naviagteToProcessTab();

        // Start subProcessHaltSet which is designed to halt due to a data validation error
        await processPage.startProcess("HaltedTest", "subProcessHaltSet");

        // Refresh instance list and sort by Start Time descending to bring the latest instance to the top
        await page.waitForTimeout(1000);
        await processPage.refreshInstances.click();
        await processPage.sortByStartDateDescending();

        // Open Fix Process dialog for the first HALTED row
        await processPage.actionMenuForFirstRowByState("HALTED").click();
        await processPage.fixProcess.click();

        // Expand "Show more info" and verify the cause of failure message
        await processPage.showMoreInfo.click();
        await expect(processPage.causeOfFailure).toContainText(
            'com.tibco.n2.brm.services.IntWorkItemFault: Param [Text50] Value [abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ] is longer than the allowed length of 50 characters'
        );

        // Switch to "Inspect data" tab and cancel the halted instance
        await processPage.inspectDataTab.click();
        await processPage.cancelInstance.click();

        // Verify the cancel confirmation dialog appears with the correct instance reference
        await expect(processPage.cancelConfirmDialog).toContainText('Are you sure you want to cancel');
        await processPage.yesButton.click();

        // Verify success toast confirms the instance state changed to CANCELLED
        await page.waitForTimeout(500);
        await expect(processPage.alertMessage).toContainText('State changed to cancelled', { timeout: 10000 });
        await page.waitForTimeout(1000);
    });

    // Test 2: Start a process that halts, use "Allow to error" to transition it to FAILED, then purge (Deferred)
    test("BPMX-18852 | Verify halted instance transitions to FAILED state via Allow to Error and Deferred Purge is initiated successfully", async () => {

        await processPage.naviagteToProcessTab();

        // Start subProcessHaltSet which is designed to halt due to a data validation error
        await processPage.startProcess("HaltedTest", "subProcessHaltSet");

        // Refresh instance list and sort by Start Time descending to bring the latest instance to the top
        await page.waitForTimeout(1000);
        await processPage.refreshInstances.click();
        await processPage.sortByStartDateDescending();

        // Open Fix Process dialog for the first HALTED row
        await processPage.actionMenuForFirstRowByState("HALTED").click();
        await processPage.fixProcess.click();

        // Click "Allow to error" — this marks the halted task as failed and transitions the instance to FAILED state
        await processPage.allowToError.click();
        await page.waitForTimeout(1000);

        // Refresh the instance list and verify the instance state is now FAILED
        await processPage.refreshInstancesIcon.click();
        await expect(processPage.failedStateCell).toBeVisible({ timeout: 10000 });

        // Open the action menu for the FAILED instance and verify Cancel, Resume and Suspend are disabled
        // — for a FAILED instance these actions are not applicable and must be greyed out
        await processPage.actionMenuForFirstRowByState("FAILED").click();
        await expect(page.getByRole('menuitem', { name: 'Cancel' })).toBeDisabled();
        await expect(processPage.resumeMenuItem).toBeDisabled();
        await expect(processPage.suspendMenuItem).toBeDisabled();

        // Close the action menu before proceeding
        await page.keyboard.press('Escape');

        // Trigger a Deferred Purge on the process template from the left-hand tree
        // Deferred purge queues the purge to run at the next scheduled purge cycle
        await processPage.subProcessHaltSetTreeButton.click();
        await processPage.purgeMenuItem.click();
        await processPage.deferredOption.click();
        await processPage.yesButton.click();

        // Verify success toast confirms the deferred purge was initiated
        await page.waitForTimeout(500);
        await expect(processPage.alertMessage).toContainText('Purge Deferred initiated', { timeout: 10000 });
    });

    // Test 3: Start a process that halts, use "Ignore & continue" to skip the failed task (ACTIVE), then purge (Immediate)
    test("BPMX-18853 | Verify halted instance resumes to ACTIVE state via Ignore and Continue and Immediate Purge is initiated successfully", async () => {
        await processPage.naviagteToProcessTab();

        // Start subProcessHaltSet which is designed to halt due to a data validation error
        await processPage.startProcess("HaltedTest", "subProcessHaltSet");

        // Refresh instance list and sort by Start Time descending to bring the latest instance to the top
        await page.waitForTimeout(1000);
        await processPage.refreshInstances.click();
        await processPage.sortByStartDateDescending();

        // Open Fix Process dialog for the first HALTED row
        await processPage.actionMenuForFirstRowByState("HALTED").click();
        await processPage.fixProcess.click();

        // Click "Ignore & continue" — this skips the failed task and resumes the process from the next step
        await processPage.ignoreAndContinue.click();

        // Verify the confirmation dialog explains the impact of ignoring the failed task
        await expect(processPage.ignoreConfirmDialog).toContainText(
            'This causes the failed task to be skipped in the halted process instance. The process instance continues processing from the point in the process after the failed task.'
        );
        await processPage.yesButton.click();

        // Refresh the instance list and verify the instance state returned to ACTIVE
        await processPage.refreshInstancesIcon.click();
        await expect(processPage.activeStateCell).toBeVisible({ timeout: 10000 });

        // Trigger an Immediate Purge on the process template from the left-hand tree
        // Immediate purge removes the completed/active instances from the database right away
        await processPage.subProcessHaltSetTreeButton.click();
        await processPage.purgeMenuItem.click();
        await processPage.immediateOption.click();
        await processPage.yesButton.click();

        // Verify success toast confirms the immediate purge was initiated
        await page.waitForTimeout(500);
        await expect(processPage.alertMessage).toContainText('Purge Immediately initiated', { timeout: 10000 });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 3: Find Instances search flows
// Covers filter criteria (Package Name, Process Name, Version, Instance Started, Priority)
// and Process Instance ID exact-match search with result count and subtitle validation
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Verify Process Manager Find Instances flow", () => {

    // Test 1: Start an instance, then search using each filter criterion (Package Name, Process Name, Version, Instance Started, Priority) and verify results
    test("BPMX-18854 | Verify Find Instances search returns correct results when filtered by Package Name, Process Name, Version, Date and Priority", async () => {
        // Navigate to the Work Manager and select the target BPM server
        await page.goto(dataset.workMangerUrl);
        await page.waitForLoadState("domcontentloaded");
        await homePage.clickOnBuisnessService();
        await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
        await cmPage.clickOnConfirmServerSelectionBtn();

        await processPage.naviagteToProcessTab();

        // Start the BPMCreateCaseProcess to create an ACTIVE process instance
        await processPage.startProcess("ApprovalTestProject", "BPMCreateCaseProcess");
        // Verify success toast confirms the immediate purge was initiated
        await page.waitForTimeout(500);
        await expect(processPage.alertMessage).toContainText('pvm:', { timeout: 10000 });

        // Refresh the instance list to load the newly started process instance
        await page.waitForTimeout(1000);
        await processPage.refreshInstances.click();

        // Capture the Process Instance ID from the first ACTIVE row to use as the expected value across all filter criteria verifications
        const processInstanceId = await processPage.getFirstRowProcessInstanceId();

        // Open the Find Instances dialog to begin filter criteria validation
        await processPage.findInstancesButton.click();

        // ── Filter by Package Name ──────────────────────────────────────────────
        // Enter the package name and search; verify the captured Process Instance ID appears in results
        // pressSequentially fires keydown/input/keyup events that twc-input needs to enable the Search button
        await processPage.packageNameInput.pressSequentially(dataset.process.findInstances.packageNameInput, { delay: 150 });
        await processPage.filterDialogSearch.click();
        await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });

        // Close the search result and re-open the dialog to reset before next filter
        await processPage.searchResultClose.click();
        await processPage.findInstancesButton.click();
        await processPage.filterDialogResetAll.click();

        // ── Filter by Process Name ──────────────────────────────────────────────
        // Enter the process name and search; verify the captured Process Instance ID appears in results
        await processPage.processNameInput.pressSequentially(dataset.process.findInstances.processNameInput, { delay: 150 });
        await processPage.filterDialogSearch.click();
        await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });

        // Close the search result and re-open the dialog to reset before next filter
        await processPage.searchResultClose.click();
        await processPage.findInstancesButton.click();
        await processPage.filterDialogResetAll.click();

        // ── Filter by Version ───────────────────────────────────────────────────
        // Enter the version and search; verify the captured Process Instance ID appears in results
        await processPage.versionInput.pressSequentially(dataset.process.findInstances.versionInput, { delay: 150 });
        await processPage.filterDialogSearch.click();
        await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });

        // Close the search result and re-open the dialog to reset before next filter
        await processPage.searchResultClose.click();
        await processPage.findInstancesButton.click();
        await processPage.filterDialogResetAll.click();

        // ── Filter by Instance Started ──────────────────────────────────────────
        // Enter today's date and time in YYYY-MM-DDTHH:MM format (required by the datetime-local input type)
        // using getCurrentDateTimeLocal(); verify the captured Process Instance ID appears in results
        await processPage.instanceStartedInput.fill(utility.getTodayDateTimeLocal());
        await processPage.instanceStartedInput.press('Tab');
        await processPage.filterDialogSearch.click();
        await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });

        // Close the search result and re-open the dialog to reset before next filter
        await processPage.searchResultClose.click();
        await processPage.findInstancesButton.click();
        await processPage.filterDialogResetAll.click();

        // ── Filter by Priority ──────────────────────────────────────────────────
        // Enter the priority value and search; verify the captured Process Instance ID appears in results
        await processPage.priorityInput.pressSequentially(dataset.process.findInstances.priorityInput, { delay: 150 });
        await processPage.filterDialogSearch.click();
        await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });

        // Close the search result to restore the default instance list view
        await processPage.searchResultClose.click();

        // Open the action menu on the first ACTIVE row, select Cancel, and confirm to cancel the process instance
        await processPage.actionMenuForFirstRowByState("ACTIVE").click();
        await processPage.cancelMenuItem.click();
        await processPage.yesButton.click();
        await page.waitForTimeout(1500);
    });

    // Test 2: Start multiple instances, filter by exact Process Instance ID, verify only 1 result is returned with the correct ID and subtitle
    test("BPMX-18855 | Verify Find Instances by Process Instance ID returns exactly one matching result with correct subtitle and row data", async () => {
        // Navigate to the Process Tab
        await processPage.naviagteToProcessTab();

        // Open subProcessHaltSet and start 3 instances to ensure multiple HALTED instances exist,
        // which is required to validate that the Process Instance ID filter returns only 1 exact match
        // Also verifying the process header title matches the selected process to ensure the correct process is being filtered
        await processPage.OpenProcess("HaltedTest", "subProcessHaltSet");
        await processPage.startButton.click();
        await processPage.startButton.click();
        await processPage.startButton.click();

        // Refresh the instance list to load the newly started (now halted) process instances
        await page.waitForTimeout(1000);
        await processPage.refreshInstances.click();

        // Capture the Process Instance ID from the first row to use as the exact filter value
        const processInstanceId = await processPage.getFirstRowProcessInstanceId();

        // Open the Find Instances dialog to apply the Process Instance ID filter
        await processPage.findInstancesButton.click();

        // ── Filter by Process Instance ID ───────────────────────────────────────
        // Select the Process Instance ID radio to switch the filter mode
        await processPage.processInstanceIdRadio.click();

        // Enter the captured Process Instance ID and search
        await processPage.processInstanceIdInput.pressSequentially(processInstanceId, { delay: 150 });
        await processPage.filterDialogSearch.click();

        // Verify the search result subtitle reflects the applied instanceID filter
        await expect(processPage.searchResultSubtitle).toContainText(`instanceID = ${processInstanceId}`, { timeout: 10000 });

        // Verify exactly 1 row is returned — guards against the bug where all halted instances
        // are returned instead of only the one matching the specific Process Instance ID
        await expect(page.locator('twc-table-row')).toHaveCount(1, { timeout: 10000 });
        // Verify that single row contains the correct Process Instance ID
        await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible();

        // Close the search result to restore the default instance list view
        await processPage.searchResultClose.click();

        // Select all instances using the header checkbox
        await processPage.selectAllCheckbox.click();

        // Click Cancel selected instances button
        await processPage.cancelSelectedInstancesButton.click();

        // Verify the cancel confirmation dialog appears with the correct instance reference
        await expect(processPage.cancelSelectedConfirmDialog).toContainText('Are you sure you want to cancel');
        await processPage.cancelSelectedYesButton.click();
    });

});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 4: Process template filter flow
// Verifies the "Filter templates by:" dialog — default dropdown selections,
// Package Name / Process Name / Version filter criteria, applied filter tags,
// and filtered process template tree results
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Verify Process template filter flow", () => {

    // Test 1: Open the filter dialog and verify each filter criterion updates the tree and tags wrapper correctly
    test("BPMX-18856 | Verify Process template filter correctly filters the process tree by Package Name, Process Name and Version criteria", async () => {
        // Navigate to the Work Manager and select the target BPM server
        await page.goto(dataset.workMangerUrl);
        await page.waitForLoadState("domcontentloaded");
        await homePage.clickOnBuisnessService();
        await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
        await cmPage.clickOnConfirmServerSelectionBtn();

        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open the "Filter templates by:" dialog
        await processPage.processTemplatesFilter.click();

        // Verify all three dropdowns default to "Equals" when the dialog opens
        await expect(processPage.templateFilterPackageNameSelect).toHaveAttribute('aria-selected', 'true');
        await expect(processPage.templateFilterProcessNameSelect).toHaveAttribute('aria-selected', 'true');
        await expect(processPage.templateFilterVersionSelect).toHaveAttribute('aria-selected', 'true');

        // Filter by Package Name and verify the applied filter tag and filtered tree
        await processPage.templateFilterPackageNameInput.fill(dataset.process.findInstances.packageNameInput);
        await processPage.saveBtn.click();
        await expect(processPage.processTemplateTagsWrapper).toContainText(`Package Name = ${dataset.process.findInstances.packageNameInput}`);
        await expect(processPage.processTemplateTreeGroup(dataset.process.findInstances.packageDisplayName)).toBeVisible({ timeout: 10000 });
        await expect(processPage.processTemplateTreeItem(dataset.process.findInstances.processNameInput)).toBeAttached({ timeout: 10000 });
        await processPage.clearFiltersIcon.click();

        // Filter by Process Name and verify the applied filter tag and filtered tree
        await processPage.processTemplatesFilter.click();
        await processPage.templateFilterProcessNameInput.fill(dataset.process.findInstances.processNameInput);
        await processPage.saveBtn.click();
        await expect(processPage.processTemplateTagsWrapper).toContainText(`Process Name = ${dataset.process.findInstances.processNameInput}`);
        await expect(processPage.processTemplateTreeGroup(dataset.process.findInstances.packageDisplayName)).toBeVisible({ timeout: 10000 });
        await processPage.clearFiltersIcon.click();

        // Filter by Version and verify the applied filter tag and filtered tree
        await processPage.processTemplatesFilter.click();
        await processPage.templateFilterVersionInput.fill(dataset.process.findInstances.versionInput);
        await processPage.saveBtn.click();
        await expect(processPage.processTemplateTagsWrapper).toContainText(`Package Version = ${dataset.process.findInstances.versionInput}`);
        await expect(processPage.processTemplateTreeGroup(dataset.process.findInstances.packageDisplayName)).toBeVisible({ timeout: 10000 });
        await processPage.clearFiltersIcon.click();
    });

});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 5: Process Migration flow
// Covers the full migration lifecycle: opening the Migrate dialog, verifying
// default/source/destination version selections, Migrate from/to checkbox items,
// Select All, adding migration rules, editing and deleting individual rules,
// deleting all rules, same-version validation error, and end-to-end migration
// with success alert confirmation
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Verify Process Migration flow", () => {

    // Test 1: Full migration flow — verify dialog defaults, select source/destination versions, verify Migrate from/to items, Select All, add rules, confirm migration, and verify success alert
    test("BPMX-18857 | Verify end-to-end process migration flow including source and destination version selection, rule creation and migration confirmation", async () => {
        // Navigate to the Work Manager and select the target BPM server
        await page.goto(dataset.workMangerUrl);
        await page.waitForLoadState("domcontentloaded");
        await homePage.clickOnBuisnessService();
        await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName19l02);
        await cmPage.clickOnConfirmServerSelectionBtn();

        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open the three-dots menu for the specific version from TestData and click Migrate
        await processPage.OpenProcessMenuByVersion(
            dataset.process.migration.packageName,
            dataset.process.migration.processName,
            dataset.process.migration.version
        );
        await processPage.migrateMenuItem.click();
        await page.waitForTimeout(1500);

        // Verify the Migrate dialog opens with the correct default source version pre-selected
        await processPage.verifyMigrateDialogDefaultVersion(dataset.process.migration.defaultSelectedVersion);

        // Select the source version from TestData
        await processPage.selectMigrateSourceVersion(dataset.process.migration.sourceVersion);

        // Verify all process items are listed in the "Migrate from" checkbox list
        await processPage.verifyMigrateFromCheckboxItems(dataset.process.migration.migrateFromItems);

        // Verify the "Migrate to" placeholder text before a destination version is selected
        await processPage.verifyMigrateToPlaceholder(dataset.process.migration.noMigrationToPlaceholder);

        // Select the destination version from TestData
        await processPage.selectMigrateDestinationVersion(dataset.process.migration.destinationVersion);

        // Verify all expected items are listed in the "Migrate to" result box
        await processPage.verifyMigrateToCheckboxItems(dataset.process.migration.migrateToItems);

        // Select all items in the "Migrate from" list
        await processPage.clickMigrateFromSelectAll();

        // Verify all "Migrate to" items are highlighted as selected after clicking Select All
        await processPage.verifyMigrateToAllItemsSelected(dataset.process.migration.migrateToItems);

        // Click the Add rule button
        await processPage.migrateAddRuleButton.click();
        await page.waitForTimeout(1000);

        // Verify each migration rule is listed with the correct source version, destination version, and point name
        await processPage.verifyMigrationRules(
            dataset.process.migration.sourceVersion,
            dataset.process.migration.destinationVersion,
            dataset.process.migration.migrateToItems
        );

        // Click the Migrate button to confirm and execute the migration
        await processPage.migrateDialogMigrateButton.click();

        // Verify the confirmation dialog body text before confirming migration
        await processPage.verifyMigrateConfirmDialogText(dataset.process.migration.migrateConfirmDialogText);

        await processPage.yesButton.click();

        // Verify success toast confirms that Process Migration Rule Set Successful
        await page.waitForTimeout(500);
        await expect(processPage.alertMessage).toContainText('Process Migration Rule Set Successful.', { timeout: 10000 });
    });

    // Test 2: Open the migrate dialog after a successful migration, click edit on a specific rule, update the rule text, save, and verify the updated text is displayed
    test("BPMX-18858 | Verify an existing migration rule can be edited and the updated rule text is saved and displayed correctly", async () => {
        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open the three-dots menu for the specific version from TestData and click Migrate
        await processPage.OpenProcessMenuByVersion(
            dataset.process.migration.packageName,
            dataset.process.migration.processName,
            dataset.process.migration.version
        );
        await processPage.migrateMenuItem.click();
        await page.waitForTimeout(1500);

        // Click the Edit icon for the EndEvent migration rule
        await processPage.clickMigrationRuleEditIcon(
            dataset.process.migration.sourceVersion,
            dataset.process.migration.destinationVersion,
            dataset.process.migration.editRulePoint
        );

        // Update the rule text in the input field
        await processPage.updateMigrationRuleInput(dataset.process.migration.updatedRuleText);

        // Click the Save icon to persist the updated rule
        await processPage.clickMigrationRuleSaveIcon();

        // Verify success toast confirms that Process Migration Rule Set Successful
        await page.waitForTimeout(500);
        await expect(processPage.alertMessage).toContainText('Process Migration Rule Updated Successful.', { timeout: 10000 });

        // Verify the updated rule text is displayed in the rules list
        await processPage.verifyUpdatedMigrationRule(dataset.process.migration.updatedRuleText);
        await page.waitForTimeout(1000);
    });

    // Test 3: Open the migrate dialog, click "Delete All Existing Migration Rules", verify the confirmation dialog text, confirm, and verify rules are cleared
    test("BPMX-18859 | Verify all existing migration rules can be deleted via Delete All option with confirmation dialog", async () => {
        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open the three-dots menu for the specific version from TestData and click Migrate
        await processPage.OpenProcessMenuByVersion(
            dataset.process.migration.packageName,
            dataset.process.migration.processName,
            dataset.process.migration.version
        );
        await processPage.migrateMenuItem.click();

        // Click the Delete all existing rules button
        await processPage.migrateDeleteAllRulesButton.click();

        // Verify the confirmation dialog body text before confirming migration
        await processPage.verifyMigrateConfirmDialogText(dataset.process.migration.deleteAllRulesConfirmDialogText);

        await processPage.yesButton.click();
        await page.waitForTimeout(1000);
    });

    // Test 4: Select identical source and destination versions and verify an error alert appears stating they cannot be the same
    test("BPMX-18860 | Verify an error is displayed when the same version is selected as both source and destination for process migration", async () => {
        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open the three-dots menu for the specific version from TestData and click Migrate
        await processPage.OpenProcessMenuByVersion(
            dataset.process.migration.packageName,
            dataset.process.migration.processName,
            dataset.process.migration.version
        );
        await processPage.migrateMenuItem.click();
        await page.waitForTimeout(1500);

        // Select the source version from TestData
        await processPage.selectMigrateSourceVersion(dataset.process.migration.sourceVersion);

        // Select the destination version from TestData
        await processPage.selectMigrateDestinationVersion(dataset.process.migration.sameDestinationVersion);

        // Verify error toast confirms that Source and destination version cannot be the same
        await page.waitForTimeout(500);
        await expect(processPage.failedAlertMessage).toContainText('Source and destination version cannot be the same.', { timeout: 10000 });

    });

    // Test 5: Add migration rules, edit a specific rule and save, delete the edited rule, verify it is removed, then cancel the dialog
    test("BPMX-18861 | Verify a migration rule can be edited and subsequently deleted before the migration is executed", async () => {
        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open the three-dots menu for the specific version from TestData and click Migrate
        await processPage.OpenProcessMenuByVersion(
            dataset.process.migration.packageName,
            dataset.process.migration.processName,
            dataset.process.migration.version
        );
        await processPage.migrateMenuItem.click();
        await page.waitForTimeout(1500);

        // Select the source version from TestData
        await processPage.selectMigrateSourceVersion(dataset.process.migration.sourceVersion);

        // Select the destination version from TestData
        await processPage.selectMigrateDestinationVersion(dataset.process.migration.destinationVersion);

        // Select all items in the "Migrate from" list
        await processPage.clickMigrateFromSelectAll();

        // Click the Add rule button
        await processPage.migrateAddRuleButton.click();
        await page.waitForTimeout(1000);

        // Click the Edit icon for the EndEvent migration rule
        await processPage.clickMigrationRuleEditIcon(
            dataset.process.migration.sourceVersion,
            dataset.process.migration.destinationVersion,
            dataset.process.migration.editRulePoint
        );

        // Update the rule text in the input field
        await processPage.updateMigrationRuleInput(dataset.process.migration.updatedRuleText);

        // Click the Save icon to persist the updated rule
        await processPage.clickMigrationRuleSaveIcon();

        // Click the Delete icon for the EndEventUpdated migration rule
        await processPage.clickMigrationRuleDeleteIcon(
            dataset.process.migration.sourceVersion,
            dataset.process.migration.destinationVersion,
            dataset.process.migration.deleteRulePoint
        );

        // Verify the deleted rule is no longer present in the rules list
        await processPage.verifyMigrationRuleNotPresent(
            dataset.process.migration.sourceVersion,
            dataset.process.migration.destinationVersion,
            dataset.process.migration.deleteRulePoint
        );
        await page.waitForTimeout(1000);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Suite 6: Bulk Process action flows
// Covers bulk Suspend (all selected instances transition to SUSPENDED),
// bulk Resume (SUSPENDED instances return to ACTIVE),
// and bulk Cancel (all selected instances are cancelled with confirmation dialog)
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Verify Bulk Process flow", () => {

    // Test 1: Start multiple ACTIVE instances, select all via header checkbox, suspend all via bulk Suspend button,
    // verify confirmation dialog text, confirm and verify success toast and SUSPENDED state on first row
    test("BPMX-18862 | Verify bulk suspend action transitions all selected process instances to SUSPENDED state with confirmation dialog and success toast", async () => {
        // Navigate to the Work Manager and select the target BPM server
        await page.goto(dataset.workMangerUrl);
        await page.waitForLoadState("domcontentloaded");
        await homePage.clickOnBuisnessService();
        await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
        await cmPage.clickOnConfirmServerSelectionBtn();

        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open BPMCreateCaseProcess and start 4 instances to ensure enough ACTIVE records exist for bulk action
        await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");
        await processPage.startButton.click();
        await processPage.startButton.click();
        await processPage.startButton.click();
        await processPage.startButton.click();

        // Refresh the instance list to load the newly started process instances
        await page.waitForTimeout(1000);
        await processPage.refreshInstances.click();

        // Select all instances using the header checkbox to enable bulk action buttons
        await processPage.selectAllCheckbox.click();

        // Click the Suspend button in the toolbar to trigger the bulk suspend action
        await processPage.suspendSelectedInstancesButton.click();

        // Verify the suspend confirmation dialog appears with the expected body text from TestData
        await expect(processPage.suspendSelectedConfirmDialog).toContainText(dataset.process.bulkProcess.suspendConfirmationBodyText);

        // Confirm the suspend action by clicking Yes in the dialog
        await processPage.suspendSelectedYesButton.click();
        await page.waitForTimeout(500);

        // Verify success toast confirms the suspend request was submitted for all selected instances
        await expect(processPage.alertMessage).toContainText('Suspend request submitted successfully.', { timeout: 10000 });
        await page.waitForTimeout(1000);

        // Verify the first row state cell changes to SUSPENDED after the bulk suspend action is processed
        await expect(processPage.suspendedStateCell).toBeVisible({ timeout: 10000 });
    });

    // Test 2: Select all SUSPENDED instances via header checkbox, resume all via bulk Resume button,
    // verify confirmation dialog text, confirm and verify success toast and ACTIVE state on first row
    test("BPMX-18863 | Verify bulk resume action transitions all selected SUSPENDED instances back to ACTIVE state with confirmation dialog and success toast", async () => {

        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open BPMCreateCaseProcess — instances from the previous Suspend test are expected to be in SUSPENDED state
        await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");

        // Select all instances using the header checkbox to enable bulk action buttons
        await processPage.selectAllCheckbox.click();

        // Click the Resume button in the toolbar to trigger the bulk resume action
        await processPage.resumeSelectedInstancesButton.click();

        // Verify the resume confirmation dialog appears with the expected body text from TestData
        await expect(processPage.resumeSelectedConfirmDialog).toContainText(dataset.process.bulkProcess.resumeConfirmationBodyText);

        // Confirm the resume action by clicking Yes in the dialog
        await processPage.resumeSelectedYesButton.click();
        await page.waitForTimeout(500);

        // Verify success toast confirms the resume request was submitted for all selected instances
        await expect(processPage.alertMessage).toContainText('Resume request submitted successfully.', { timeout: 10000 });
        await page.waitForTimeout(1000);

        // Verify the first row state cell returns to ACTIVE after the bulk resume action is processed
        await expect(processPage.activeStateCell).toBeVisible({ timeout: 10000 });
    });

    // Test 3: Select all ACTIVE instances via header checkbox, cancel all via bulk Cancel button,
    // verify confirmation dialog text, confirm and verify success toast
    test("BPMX-18864 | Verify bulk cancel action cancels all selected process instances with confirmation dialog and success toast", async () => {

        // Navigate to the Process Manager tab
        await processPage.naviagteToProcessTab();

        // Open BPMCreateCaseProcess — instances from the previous Resume test are expected to be back in ACTIVE state
        await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");

        // Select all instances using the header checkbox to enable bulk action buttons
        await processPage.selectAllCheckbox.click();

        // Click the Cancel Selected Instances button in the toolbar to trigger the bulk cancel action
        await processPage.cancelSelectedInstancesButton.click();

        // Verify the cancel confirmation dialog appears with the expected body text
        // Uses bpme-proces-instance-cancel-tasks-dialog (different element from bpme-confirm-dialog used by Suspend/Resume)
        await expect(processPage.cancelSelectedConfirmDialog).toContainText('Are you sure you want to cancel');

        // Confirm the cancel action by clicking Yes in the dialog
        await processPage.cancelSelectedYesButton.click();
        await page.waitForTimeout(500);

        // Verify success toast confirms the cancel request was submitted for all selected instances
        await expect(processPage.alertMessage).toContainText('Cancel request submitted successfully.', { timeout: 10000 });
        await page.waitForTimeout(1000);
    });

});
