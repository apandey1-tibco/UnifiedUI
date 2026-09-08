# Test info

- Name: Verify Process Manager Find Instances flow >> BPMX-18854 | Verify Find Instances search returns correct results when filtered by Package Name, Process Name, Version, Date and Priority
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\07_UnifiedUiProcessManager4xReg.spec.ts:325:9

# Error details

```
Error: Timed out 10000ms waiting for expect(locator).toBeVisible()

Locator: locator('twc-table-cell[tooltipvalue="pvm:0a121m"]').first()
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 10000ms
  - waiting for locator('twc-table-cell[tooltipvalue="pvm:0a121m"]').first()

    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\07_UnifiedUiProcessManager4xReg.spec.ts:391:99
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - complementary
  - button "2201":
    - text: "2201"
    - img
  - separator "Resize"
  - text: Search results (startDate < Mon Aug 17 2026 11:22:00 GMT+0530 (India Standard Time))
  - img "Columns":
    - img
  - table:
    - row "Process Instance ID State Start Time Actions":
      - columnheader:
        - checkbox
      - columnheader "Process Instance ID"
      - columnheader "State"
      - columnheader "Start Time"
      - columnheader "Actions"
    - row "pvm:0a121l ACTIVE 17 Aug 2026 11:21 AM":
      - cell:
        - checkbox
      - cell "pvm:0a121l"
      - cell "ACTIVE"
      - cell "17 Aug 2026 11:21 AM"
      - cell:
        - button
- iframe
```

# Test source

```ts
  291 |         // Click "Ignore & continue" — this skips the failed task and resumes the process from the next step
  292 |         await processPage.ignoreAndContinue.click();
  293 |
  294 |         // Verify the confirmation dialog explains the impact of ignoring the failed task
  295 |         await expect(processPage.ignoreConfirmDialog).toContainText(
  296 |             'This causes the failed task to be skipped in the halted process instance. The process instance continues processing from the point in the process after the failed task.'
  297 |         );
  298 |         await processPage.yesButton.click();
  299 |
  300 |         // Refresh the instance list and verify the instance state returned to ACTIVE
  301 |         await processPage.refreshInstancesIcon.click();
  302 |         await expect(processPage.activeStateCell).toBeVisible({ timeout: 10000 });
  303 |
  304 |         // Trigger an Immediate Purge on the process template from the left-hand tree
  305 |         // Immediate purge removes the completed/active instances from the database right away
  306 |         await processPage.subProcessHaltSetTreeButton.click();
  307 |         await processPage.purgeMenuItem.click();
  308 |         await processPage.immediateOption.click();
  309 |         await processPage.yesButton.click();
  310 |
  311 |         // Verify success toast confirms the immediate purge was initiated
  312 |         await page.waitForTimeout(500);
  313 |         await expect(processPage.alertMessage).toContainText('Purge Immediately initiated', { timeout: 10000 });
  314 |     });
  315 | });
  316 |
  317 | // ─────────────────────────────────────────────────────────────────────────────
  318 | // Suite 3: Find Instances search flows
  319 | // Covers filter criteria (Package Name, Process Name, Version, Instance Started, Priority)
  320 | // and Process Instance ID exact-match search with result count and subtitle validation
  321 | // ─────────────────────────────────────────────────────────────────────────────
  322 | test.describe("Verify Process Manager Find Instances flow", () => {
  323 |
  324 |     // Test 1: Start an instance, then search using each filter criterion (Package Name, Process Name, Version, Instance Started, Priority) and verify results
  325 |     test("BPMX-18854 | Verify Find Instances search returns correct results when filtered by Package Name, Process Name, Version, Date and Priority", async () => {
  326 |         // Navigate to the Work Manager and select the target BPM server
  327 |         await page.goto(dataset.workMangerUrl);
  328 |         await page.waitForLoadState("domcontentloaded");
  329 |         await homePage.clickOnBuisnessService();
  330 |         await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
  331 |         await cmPage.clickOnConfirmServerSelectionBtn();
  332 |
  333 |         await processPage.naviagteToProcessTab();
  334 |
  335 |         // Start the BPMCreateCaseProcess to create an ACTIVE process instance
  336 |         await processPage.startProcess("ApprovalTestProject", "BPMCreateCaseProcess");
  337 |         // Verify success toast confirms the immediate purge was initiated
  338 |         await page.waitForTimeout(500);
  339 |         await expect(processPage.alertMessage).toContainText('pvm:', { timeout: 10000 });
  340 |
  341 |         // Refresh the instance list to load the newly started process instance
  342 |         await page.waitForTimeout(1000);
  343 |         await processPage.refreshInstances.click();
  344 |
  345 |         // Capture the Process Instance ID from the first ACTIVE row to use as the expected value across all filter criteria verifications
  346 |         const processInstanceId = await processPage.getFirstRowProcessInstanceId();
  347 |
  348 |         // Open the Find Instances dialog to begin filter criteria validation
  349 |         await processPage.findInstancesButton.click();
  350 |
  351 |         // ── Filter by Package Name ──────────────────────────────────────────────
  352 |         // Enter the package name and search; verify the captured Process Instance ID appears in results
  353 |         // pressSequentially fires keydown/input/keyup events that twc-input needs to enable the Search button
  354 |         await processPage.packageNameInput.pressSequentially(dataset.process.findInstances.packageNameInput, { delay: 150 });
  355 |         await processPage.filterDialogSearch.click();
  356 |         await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });
  357 |
  358 |         // Close the search result and re-open the dialog to reset before next filter
  359 |         await processPage.searchResultClose.click();
  360 |         await processPage.findInstancesButton.click();
  361 |         await processPage.filterDialogResetAll.click();
  362 |
  363 |         // ── Filter by Process Name ──────────────────────────────────────────────
  364 |         // Enter the process name and search; verify the captured Process Instance ID appears in results
  365 |         await processPage.processNameInput.pressSequentially(dataset.process.findInstances.processNameInput, { delay: 150 });
  366 |         await processPage.filterDialogSearch.click();
  367 |         await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });
  368 |
  369 |         // Close the search result and re-open the dialog to reset before next filter
  370 |         await processPage.searchResultClose.click();
  371 |         await processPage.findInstancesButton.click();
  372 |         await processPage.filterDialogResetAll.click();
  373 |
  374 |         // ── Filter by Version ───────────────────────────────────────────────────
  375 |         // Enter the version and search; verify the captured Process Instance ID appears in results
  376 |         await processPage.versionInput.pressSequentially(dataset.process.findInstances.versionInput, { delay: 150 });
  377 |         await processPage.filterDialogSearch.click();
  378 |         await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });
  379 |
  380 |         // Close the search result and re-open the dialog to reset before next filter
  381 |         await processPage.searchResultClose.click();
  382 |         await processPage.findInstancesButton.click();
  383 |         await processPage.filterDialogResetAll.click();
  384 |
  385 |         // ── Filter by Instance Started ──────────────────────────────────────────
  386 |         // Enter today's date and time in YYYY-MM-DDTHH:MM format (required by the datetime-local input type)
  387 |         // using getCurrentDateTimeLocal(); verify the captured Process Instance ID appears in results
  388 |         await processPage.instanceStartedInput.fill(utility.getCurrentDateTimeLocal());
  389 |         await processPage.instanceStartedInput.press('Tab');
  390 |         await processPage.filterDialogSearch.click();
> 391 |         await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });
      |                                                                                                   ^ Error: Timed out 10000ms waiting for expect(locator).toBeVisible()
  392 |
  393 |         // Close the search result and re-open the dialog to reset before next filter
  394 |         await processPage.searchResultClose.click();
  395 |         await processPage.findInstancesButton.click();
  396 |         await processPage.filterDialogResetAll.click();
  397 |
  398 |         // ── Filter by Priority ──────────────────────────────────────────────────
  399 |         // Enter the priority value and search; verify the captured Process Instance ID appears in results
  400 |         await processPage.priorityInput.pressSequentially(dataset.process.findInstances.priorityInput, { delay: 150 });
  401 |         await processPage.filterDialogSearch.click();
  402 |         await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible({ timeout: 10000 });
  403 |
  404 |         // Close the search result to restore the default instance list view
  405 |         await processPage.searchResultClose.click();
  406 |
  407 |         // Open the action menu on the first ACTIVE row, select Cancel, and confirm to cancel the process instance
  408 |         await processPage.actionMenuForFirstRowByState("ACTIVE").click();
  409 |         await processPage.cancelMenuItem.click();
  410 |         await processPage.yesButton.click();
  411 |         await page.waitForTimeout(1500);
  412 |     });
  413 |
  414 |     // Test 2: Start multiple instances, filter by exact Process Instance ID, verify only 1 result is returned with the correct ID and subtitle
  415 |     test("BPMX-18855 | Verify Find Instances by Process Instance ID returns exactly one matching result with correct subtitle and row data", async () => {
  416 |         // Navigate to the Process Tab
  417 |         await processPage.naviagteToProcessTab();
  418 |
  419 |         // Open subProcessHaltSet and start 3 instances to ensure multiple HALTED instances exist,
  420 |         // which is required to validate that the Process Instance ID filter returns only 1 exact match
  421 |         // Also verifying the process header title matches the selected process to ensure the correct process is being filtered
  422 |         await processPage.OpenProcess("HaltedTest", "subProcessHaltSet");
  423 |         await processPage.startButton.click();
  424 |         await processPage.startButton.click();
  425 |         await processPage.startButton.click();
  426 |
  427 |         // Refresh the instance list to load the newly started (now halted) process instances
  428 |         await page.waitForTimeout(1000);
  429 |         await processPage.refreshInstances.click();
  430 |
  431 |         // Capture the Process Instance ID from the first row to use as the exact filter value
  432 |         const processInstanceId = await processPage.getFirstRowProcessInstanceId();
  433 |
  434 |         // Open the Find Instances dialog to apply the Process Instance ID filter
  435 |         await processPage.findInstancesButton.click();
  436 |
  437 |         // ── Filter by Process Instance ID ───────────────────────────────────────
  438 |         // Select the Process Instance ID radio to switch the filter mode
  439 |         await processPage.processInstanceIdRadio.click();
  440 |
  441 |         // Enter the captured Process Instance ID and search
  442 |         await processPage.processInstanceIdInput.pressSequentially(processInstanceId, { delay: 150 });
  443 |         await processPage.filterDialogSearch.click();
  444 |
  445 |         // Verify the search result subtitle reflects the applied instanceID filter
  446 |         await expect(processPage.searchResultSubtitle).toContainText(`instanceID = ${processInstanceId}`, { timeout: 10000 });
  447 |
  448 |         // Verify exactly 1 row is returned — guards against the bug where all halted instances
  449 |         // are returned instead of only the one matching the specific Process Instance ID
  450 |         await expect(page.locator('twc-table-row')).toHaveCount(1, { timeout: 10000 });
  451 |         // Verify that single row contains the correct Process Instance ID
  452 |         await expect(page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()).toBeVisible();
  453 |
  454 |         // Close the search result to restore the default instance list view
  455 |         await processPage.searchResultClose.click();
  456 |
  457 |         // Select all instances using the header checkbox
  458 |         await processPage.selectAllCheckbox.click();
  459 |
  460 |         // Click Cancel selected instances button
  461 |         await processPage.cancelSelectedInstancesButton.click();
  462 |
  463 |         // Verify the cancel confirmation dialog appears with the correct instance reference
  464 |         await expect(processPage.cancelSelectedConfirmDialog).toContainText('Are you sure you want to cancel');
  465 |         await processPage.cancelSelectedYesButton.click();
  466 |     });
  467 |
  468 | });
  469 |
  470 | // ─────────────────────────────────────────────────────────────────────────────
  471 | // Suite 4: Process template filter flow
  472 | // Verifies the "Filter templates by:" dialog — default dropdown selections,
  473 | // Package Name / Process Name / Version filter criteria, applied filter tags,
  474 | // and filtered process template tree results
  475 | // ─────────────────────────────────────────────────────────────────────────────
  476 | test.describe("Verify Process template filter flow", () => {
  477 |
  478 |     // Test 1: Open the filter dialog and verify each filter criterion updates the tree and tags wrapper correctly
  479 |     test("BPMX-18856 | Verify Process template filter correctly filters the process tree by Package Name, Process Name and Version criteria", async () => {
  480 |         // Navigate to the Work Manager and select the target BPM server
  481 |         await page.goto(dataset.workMangerUrl);
  482 |         await page.waitForLoadState("domcontentloaded");
  483 |         await homePage.clickOnBuisnessService();
  484 |         await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
  485 |         await cmPage.clickOnConfirmServerSelectionBtn();
  486 |
  487 |         // Navigate to the Process Manager tab
  488 |         await processPage.naviagteToProcessTab();
  489 |
  490 |         // Open the "Filter templates by:" dialog
  491 |         await processPage.processTemplatesFilter.click();
```