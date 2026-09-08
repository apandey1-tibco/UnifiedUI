# Test info

- Name: Verify Process Manager basic flow regression suite >> BPMX-18848 | Verify Process Manager landing page UI, start process, apply state filter, toggle columns, cancel instance and view in Historic tab
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\07_UnifiedUiProcessManager4xReg.spec.ts:36:9

# Error details

```
Error: expect(received).toStrictEqual(expected) // deep equality

- Expected  - 4
+ Received  + 2

  Array [
+   "",
    "Process Instance ID",
-   "Process Name",
-   "Process ID",
    "State",
-   "Start Date",
-   "Created Date",
+   "Start Time",
    "Actions",
  ]
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\07_UnifiedUiProcessManager4xReg.spec.ts:66:29
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
  - dialog:
    - text: Process Templates
    - button "Start"
    - text: Clear filters Process Name = BPMCreateCaseProcess ApprovalTestProject
  - separator "Resize"
  - dialog "Process Instance column selector":
    - heading "Process Instance column selector" [level=2]
    - img "Close":
      - img
    - text: Available Columns
    - textbox
    - menu:
      - menuitem "Process Instance ID":
        - checkbox [checked]
        - img
        - text: Process Instance ID
      - menuitem "State":
        - checkbox [checked]
        - img
        - text: State
      - menuitem "Priority":
        - checkbox
        - text: Priority
      - menuitem "Start Time":
        - checkbox [checked]
        - img
        - text: Start Time
      - menuitem "Actions":
        - checkbox [checked]
        - img
        - text: Actions
    - text: Selected Columns
    - menu:
      - menuitem "Process Instance ID"
      - menuitem "State"
      - menuitem "Start Time"
      - menuitem "Actions"
    - button "Settings" [disabled]
    - button "Settings" [disabled]
    - button "Cancel"
    - button "Apply"
  - text: BPMCreateCaseProcess
  - button "Find Instances"
  - img "Auto Refresh":
    - img
  - img "Sort":
    - img
  - img "Columns":
    - img
  - tablist:
    - tab "Current" [selected]
    - tab "Historic"
  - combobox: numOptionsSelected
  - text: ACTIVE
  - img "Remove":
    - img
  - button "Clear entry"
  - table:
    - row "Process Instance ID State Start Time Actions":
      - columnheader:
        - checkbox
      - columnheader "Process Instance ID"
      - columnheader "State"
      - columnheader "Start Time"
      - columnheader "Actions"
    - row "pvm:0a12e ACTIVE 14 Aug 2026 11:57 AM":
      - cell:
        - checkbox
      - cell "pvm:0a12e"
      - cell "ACTIVE"
      - cell "14 Aug 2026 11:57 AM"
      - cell:
        - button
    - row "pvm:0a12i ACTIVE 14 Aug 2026 12:04 PM":
      - cell:
        - checkbox
      - cell "pvm:0a12i"
      - cell "ACTIVE"
      - cell "14 Aug 2026 12:04 PM"
      - cell:
        - button
    - row "pvm:0a12j ACTIVE 14 Aug 2026 12:04 PM":
      - cell:
        - checkbox
      - cell "pvm:0a12j"
      - cell "ACTIVE"
      - cell "14 Aug 2026 12:04 PM"
      - cell:
        - button
    - row "pvm:0a12k ACTIVE 14 Aug 2026 12:04 PM":
      - cell:
        - checkbox
      - cell "pvm:0a12k"
      - cell "ACTIVE"
      - cell "14 Aug 2026 12:04 PM"
      - cell:
        - button
    - row "pvm:0a12l ACTIVE 14 Aug 2026 12:04 PM":
      - cell:
        - checkbox
      - cell "pvm:0a12l"
      - cell "ACTIVE"
      - cell "14 Aug 2026 12:04 PM"
      - cell:
        - button
    - row "pvm:0a12n ACTIVE 17 Aug 2026 10:34 AM":
      - cell:
        - checkbox
      - cell "pvm:0a12n"
      - cell "ACTIVE"
      - cell "17 Aug 2026 10:34 AM"
      - cell:
        - button
- iframe
```

# Test source

```ts
   1 | import { test, expect, request, Page, chromium } from "@playwright/test";
   2 | import { POManager } from "../../PageObjects/POManager";
   3 | import { HomePage } from "../../PageObjects/HomePage";
   4 | import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
   5 | import * as utility from "../../fixtures/utility";
   6 | import { ProcessPage } from "../../PageObjects/ProcessPage";
   7 |
   8 | // Load test data from JSON fixture
   9 | const dataset = JSON.parse(
   10 |     JSON.stringify(require("../../fixtures/TestData.json"))
   11 | );
   12 |
   13 | let page: Page;
   14 | let poManager: POManager;
   15 | let homePage: HomePage;
   16 | let cmPage: CaseManagerPage;
   17 | let processPage: ProcessPage;
   18 |
   19 | // Initialize page objects once for all tests in this file
   20 | test.beforeAll(async ({ browser }) => {
   21 |     page = await browser.newPage();
   22 |     poManager = new POManager(page);
   23 |     homePage = poManager.getHomePage();
   24 |     cmPage = poManager.getCaseManagerPage();
   25 |     processPage = poManager.getProcessPage();
   26 | });
   27 |
   28 | // ─────────────────────────────────────────────────────────────────────────────
   29 | // Suite 1: Basic Process Manager UI validations
   30 | // Verifies header, buttons, state filter, column selector functionality,
   31 | // and process template info popup (Module Name, Process Name)
   32 | // ─────────────────────────────────────────────────────────────────────────────
   33 | test.describe("Verify Process Manager basic flow regression suite", () => {
   34 |
   35 |     // Test 1: Navigate to Process Manager, start a process, verify UI elements and column selector, cancel the instance and verify it in the Historic tab
   36 |     test("BPMX-18848 | Verify Process Manager landing page UI, start process, apply state filter, toggle columns, cancel instance and view in Historic tab", async () => {
   37 |         // Navigate to the Work Manager and select the target BPM server
   38 |         await page.goto(dataset.workMangerUrl);
   39 |         await page.waitForLoadState("domcontentloaded");
   40 |         await homePage.clickOnBuisnessService();
   41 |         await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName2201);
   42 |         await cmPage.clickOnConfirmServerSelectionBtn();
   43 |         await processPage.naviagteToProcessTab();
   44 |
   45 |         // Verify Process Manager landing page elements are visible
   46 |         await expect(processPage.header).toBeVisible();
   47 |         await expect(processPage.findInstancesButton).toBeVisible();
   48 |         await expect(processPage.startButton).toBeDisabled();
   49 |
   50 |         // Start the BPMCreateCaseProcess to create an ACTIVE process instance
   51 |         await processPage.startProcess("ApprovalTestProject", "BPMCreateCaseProcess");
   52 |
   53 |         // Refresh the instance list to load the newly started process instance
   54 |         await page.waitForTimeout(1000);
   55 |         await processPage.refreshInstances.click();
   56 |
   57 |         // Apply ACTIVE state filter and verify the filter tag appears in the toolbar
   58 |         await processPage.filterByState("Active");
   59 |         expect(await processPage.filterTag.innerText()).toBe("ACTIVE");
   60 |
   61 |         // Open the Column Selector and verify all default columns are present
   62 |         await processPage.coloumnSelector.click();
   63 |         await page.waitForTimeout(500);
   64 |
   65 |         let tableHeader = await processPage.getTableHeader();
>  66 |         expect(tableHeader).toStrictEqual(dataset.process.processHeader);
      |                             ^ Error: expect(received).toStrictEqual(expected) // deep equality
   67 |         await page.waitForTimeout(1000);
   68 |
   69 |         // Uncheck the "Process Instance ID" column and verify it is deselected
   70 |         await processPage.procesInstanceId().click();
   71 |         await page.waitForTimeout(1000);
   72 |         await expect(processPage.procesInstanceId()).toHaveAttribute(
   73 |             "aria-checked",
   74 |             "false"
   75 |         );
   76 |
   77 |         // Apply the column change and confirm "Process Instance ID" is removed from the table header
   78 |         await processPage.applyButton.click();
   79 |         tableHeader = await processPage.getTableHeader();
   80 |         expect(tableHeader).not.toContain("Process Instance ID");
   81 |
   82 |         // Re-enable the "Process Instance ID" column and apply to restore default columns
   83 |         await processPage.coloumnSelector.click();
   84 |         await page.waitForTimeout(500);
   85 |         await processPage.procesInstanceId().click();
   86 |         await page.waitForTimeout(1000);
   87 |         await processPage.applyButton.click();
   88 |
   89 |         // Capture the Process Instance ID from the first ACTIVE row before cancelling, for later verification in the Historic tab
   90 |         const processInstanceId = await processPage.getFirstRowProcessInstanceId();
   91 |
   92 |         // Open the action menu on the first ACTIVE row, select Cancel, and confirm to cancel the process instance
   93 |         await processPage.actionMenuForFirstRowByState("ACTIVE").click();
   94 |         await processPage.cancelMenuItem.click();
   95 |         await processPage.yesButton.click();
   96 |         await page.waitForTimeout(1500);
   97 |
   98 |         // Switch to the Historic tab to view completed/cancelled instances
   99 |         await processPage.historicTab.click();
  100 |         await page.waitForTimeout(2000);
  101 |         await processPage.refreshInstances.click();
  102 |
  103 |         // Verify the cancelled instance appears anywhere in the Historic tab by matching the stored Process Instance ID
  104 |         await expect(
  105 |             page.locator(`twc-table-cell[tooltipvalue="${processInstanceId}"]`).first()
  106 |         ).toBeVisible({ timeout: 10000 });
  107 |
  108 |         // Switch back to Current tab to return to the default view after Historic tab verification
  109 |         await processPage.currentTab.click();
  110 |     });
  111 |
  112 |     // Test 2: Click the info icon on the BPMCreateCaseProcess tree item and verify the popup displays the correct Module Name and Process Name
  113 |     test("BPMX-18849 | Verify Process info popup displays correct Module Name and Process Name for BPMCreateCaseProcess", async () => {
  114 |         // Navigate to the Process Manager
  115 |         await processPage.naviagteToProcessTab();
  116 |
  117 |         // Filter and select BPMCreateCaseProcess in the process template tree
  118 |         await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");
  119 |
  120 |         // Click the info (ⓘ) icon next to the process to open the details popup
  121 |         await processPage.processInfoIcon.click();
  122 |
  123 |         // Verify the popup displays the correct Module Name and Process Name
  124 |         await processPage.verifyProcessInfo(
  125 |             dataset.process.BPMCreateCaseProcess.moduleName,
  126 |             dataset.process.BPMCreateCaseProcess.processName
  127 |         );
  128 |
  129 |         // Dismiss the info popup to close it
  130 |         await processPage.dismissButton.click();
  131 |     });
  132 |
  133 |     // Test 3: Suspend an ACTIVE instance, apply the Suspended filter and verify the tag, remove the filter, then cancel all instances via bulk Cancel
  134 |     test("BPMX-18850 | Verify Process Manager state filter works correctly when filtering by Suspended state and returns ACTIVE instances after filter removal", async () => {
  135 |         // Navigate to the Work Manager and select the target BPM server
  136 |         await processPage.naviagteToProcessTab();
  137 |
  138 |         // Open BPMCreateCaseProcess and start 3 instances to ensure ACTIVE records exist
  139 |         await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");
  140 |         await processPage.startButton.click();
  141 |         await processPage.startButton.click();
  142 |         await processPage.startButton.click();
  143 |
  144 |         // Refresh the instance list to load the newly started process instances
  145 |         await page.waitForTimeout(1000);
  146 |         await processPage.refreshInstances.click();
  147 |
  148 |         // Verify ACTIVE instances are visible before applying any filter
  149 |         await expect(processPage.activeStateCell).toBeVisible({ timeout: 10000 });
  150 |
  151 |         await processPage.actionMenuForFirstRowByState("ACTIVE").click();
  152 |         await processPage.suspendMenuItem.click();
  153 |         await page.waitForTimeout(1000);
  154 |
  155 |         // Apply the Suspended state filter and verify the filter tag shows SUSPENDED
  156 |         await processPage.filterByState("Suspended");
  157 |         expect(await processPage.filterTag.innerText()).toContain("SUSPENDED");
  158 |
  159 |         // Close the Suspended filter tag by clicking its remove button
  160 |         // Bug: After removing the Suspended filter, ACTIVE records are not re-displayed
  161 |         await processPage.filterTagRemoveButton.click();
  162 |         await page.waitForTimeout(500);
  163 |
  164 |         // Verify ACTIVE records are displayed again after the Suspended filter is removed
  165 |         await expect(processPage.activeStateCell).toBeVisible({ timeout: 10000 });
  166 |
```