import { test, expect, Page } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { LoginPage } from "../../PageObjects/LoginPage";
import { AMXBPMUsersResourses } from "../../PageObjects/Audit_startPMandWMPage_4x";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { AuditCasesPage } from "../../PageObjects/Audit_CasesPage_4x";
import * as utility from "../../fixtures/utility";

const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let loginPage: LoginPage;
let amxbpmPage: AMXBPMUsersResourses;
let cmPage: CaseManagerPage;
let auditCasesPage4x: AuditCasesPage;

test.beforeAll(async ({ browser }) => {
  test.setTimeout(120000);
  page = await browser.newPage();
  poManager = new POManager(page);
  loginPage = poManager.getLoginPage();
  amxbpmPage = poManager.getAMXBPMUsersResoursesPage();
  cmPage = poManager.getCaseManagerPage();
  auditCasesPage4x = new AuditCasesPage(page);

  // Login and switch server once for the entire suite
  await page.context().clearCookies();
  await loginPage.login(dataset.username1, dataset.password1);
  // Navigate explicitly to Work Manager after login so the server switcher renders
  await loginPage.navigateToWorkManagerUrl(dataset.auditWorkManagerUrl);
  await page.waitForLoadState("domcontentloaded");
  await cmPage.selectServerFromGlobalSwitcher(dataset.amxbpmServer);
  await cmPage.clickOnConfirmServerSelectionBtn();
  await amxbpmPage.assertServerIsSelected(dataset.amxbpmServer);
});

test.afterAll(async () => {
  await page.close();
});

async function goToWorkManager(): Promise<void> {
  await loginPage.navigateToWorkManagerUrl(dataset.auditWorkManagerUrl);
  await page.waitForLoadState("domcontentloaded");
  await amxbpmPage.ensureServerSelected(dataset.amxbpmServer);
}

test.describe("AMXBPM 4.x Server - Audit Cases Tests", () => {
  test.setTimeout(120000);

  test(
    "Audit > Cases: Navigate to Audit, click Cases — verify Audit dropdown shows 'Cases' selected",
    async () => {
      await test.step("Navigate to Audit section", async () => {
        await auditCasesPage4x.navigateToAudit();
      });

      await test.step('"Cases" is visible in the entity dropdown — select it', async () => {
        await auditCasesPage4x.selectCasesFromAuditDropdown();
      });
    }
  );

  test(
    "Audit > Cases: verify left panel — case type name (SJ_Case), Saved filters and Filters buttons visible",
    async () => {
      await test.step("Navigate to Audit > Cases and select SJ_Case", async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
      });

      await test.step("Verify left panel — SJ_Case type name, Saved filters and Filters buttons visible", async () => {
        await auditCasesPage4x.verifyLeftPanel(dataset.auditCaseTypes);
      });
    }
  );

  test(
    "Audit > Cases: click SJ_Case — verify right panel table headers, row count, Search and Refresh buttons",
    async () => {
      await test.step("Navigate to Audit > Cases and select SJ_Case", async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
      });

      await test.step("Verify right panel — table headers, row count, Search and Refresh buttons", async () => {
        const rowCount = await auditCasesPage4x.verifyCasesRightPanel(dataset.sjCaseInstanceHeader);
        console.log(`SJ_Case instance table: ${rowCount} rows, headers and toolbar buttons verified`);
      });
    }
  );

  test(
    "Audit > Cases: Click SJ_Case, drill into audit events — verify audit events load matche the case ID",
    async () => {
      await test.step("Click SJ_Case from the Case Types list — instance table loads", async () => {
        await auditCasesPage4x.navigateToCasesList();
        await auditCasesPage4x.selectCaseType(dataset.AuditCases4x.caseType);
      });

      await test.step("Validate SJ_Case instance table headers match expected columns", async () => {
        const headers = await utility.tableHeader(page);
        console.log(`SJ_Case instance headers: [${headers.join(", ")}]`);
        if (dataset.sjCaseInstanceHeader) {
          expect(headers).toStrictEqual(dataset.sjCaseInstanceHeader);
        }
      });

      let autoCaseValue = "";

      await test.step("Validate first row contains a non-empty autoCaseIdentifier1 value", async () => {
        const headers = await utility.tableHeader(page);
        const firstRow = await utility.getFirstRowContents(page);
        const idx = headers.indexOf("autoCaseIdentifier1");
        expect(idx, "autoCaseIdentifier1 column must be present").toBeGreaterThan(-1);
        autoCaseValue = firstRow[idx]?.trim() ?? "";
        expect(autoCaseValue, "autoCaseIdentifier1 value in first row should not be empty").toBeTruthy();
        console.log(`First row — autoCaseIdentifier1: "${autoCaseValue}"`);
      });

      await test.step("Drill into first SJ_Case instance — audit events table loads, verify Managed Object ID matches autoCaseIdentifier1", async () => {
        await auditCasesPage4x.drillIntoFirstCaseInstance();
        const auditHeaders = await utility.tableHeader(page);
        const firstAuditRow = await utility.getFirstRowContents(page);
        const moIdx = auditHeaders.indexOf("Managed Object ID");
        expect(moIdx, '"Managed Object ID" column must be present in audit events table').toBeGreaterThan(-1);
        const managedObjId = firstAuditRow[moIdx]?.trim() ?? "";
        expect(managedObjId, `Managed Object ID should contain autoCaseIdentifier1 (${autoCaseValue})`).toContain(autoCaseValue);
        console.log(`Audit events loaded — Managed Object ID: "${managedObjId}" contains autoCaseIdentifier1: "${autoCaseValue}"`);
      });
    }
  );

  test(
    "Audit > Cases: audit events — verify event columns, drill into Message ID, verify All Attributes and Additional Attributes for each event",
    async () => {
      let auditHeaders: string[] = [];

      await test.step("Verify audit event table headers — Event ID, Message ID, Severity present", async () => {
        auditHeaders = await auditCasesPage4x.verifyAuditEventColumns();
        console.log(`SJ_Case audit table headers: [${auditHeaders.join(", ")}]`);
      });

      let eventId = "";
      let messageId = "";

      await test.step("Read first audit event row and capture Event ID and Message ID", async () => {
        const result = await auditCasesPage4x.readFirstAuditEventRow(auditHeaders);
        eventId = result.eventId;
        messageId = result.messageId;
        console.log(`SJ_Case — Event ID: ${eventId}, Message ID: ${messageId}, Severity: ${result.severity}`);
      });

      await test.step("Click Message ID cell — navigate to Audit details page", async () => {
        await auditCasesPage4x.drillIntoMessageId(auditHeaders);
      });

      let detailHeaders: string[] = [];

      await test.step("Verify Audit details page — Event ID present and Severity = AUDIT", async () => {
        const result = await auditCasesPage4x.verifyAuditDetailsPage();
        detailHeaders = result.detailHeaders;
        console.log(`Audit details headers: [${detailHeaders.join(", ")}]`);
      });

      await test.step("Click Message ID in Audit details — open Event Details panel", async () => {
        await auditCasesPage4x.openEventDetailsPanel(detailHeaders);
      });

      await test.step("Verify Event Details panel heading matches Event ID and Message ID", async () => {
        await auditCasesPage4x.verifyEventDetailsPanel(eventId, messageId);
        console.log(`Event Details opened — Event ID: ${eventId}, Message ID: ${messageId}`);
      });

      await test.step("Verify All Attributes for first event, then click Next through all remaining events until last", async () => {
        await auditCasesPage4x.loopThroughAllEventDetails();
      });

      await test.step("Close Event Details panel", async () => {
        await auditCasesPage4x.closeEventDetailsDialog();
      });
    }
  );

  test(
    "Audit > Cases: verify default first case selected — scroll to SJ_Case — click Refresh — verify first case re-selected",
    async () => {
      let firstCaseName = "";

      await test.step("Navigate to Audit > Cases — log auto-selected case type and right panel data status", async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAudit();
        await auditCasesPage4x.navigateToCasesList();

        firstCaseName = await auditCasesPage4x.getFirstCaseTypeName();
        const rowCount = await auditCasesPage4x.verifyRightPanelLoaded();
        console.log(`Auto-selected case: "${firstCaseName}" — ${rowCount > 0 ? `right panel: ${rowCount} rows` : "No case events"}`);
      });

      await test.step("Scroll to SJ_Case and click it — verify right panel updates with SJ_Case data", async () => {
        await auditCasesPage4x.selectCaseType(dataset.AuditCases4x.caseType);
        const rowCount = await auditCasesPage4x.verifyRightPanelHasData();
        console.log(`SJ_Case selected — right panel: ${rowCount} rows`);
      });

      await test.step("Click Refresh — verify first case type is re-selected and right panel reloads", async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
        const firstAfterRefresh = await auditCasesPage4x.getFirstCaseTypeName();
        console.log(`After Refresh — first case type in list: "${firstAfterRefresh}" (was "${firstCaseName}")`);
        expect(firstAfterRefresh, "First case type in list should still be the same after Refresh").toBe(firstCaseName);
        const rowCount = await auditCasesPage4x.verifyRightPanelLoaded();
        console.log(`After Refresh — right panel: ${rowCount > 0 ? rowCount + " rows" : "No case events"}`);
      });
    }
  );

  test(
    "Audit > Cases: click SJ_Case — verify data count, search 'ORDERED', verify all rows show 'Ordered' in caseState1",
    async () => {
      await test.step("Navigate to Audit > Cases and select SJ_Case — verify right panel has data", async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
        const rowCount = await auditCasesPage4x.verifyRightPanelHasData();
        console.log(`SJ_Case right panel: ${rowCount} rows loaded`);
      });

      await test.step("Click Search button and type 'ORDERED' — submit search query", async () => {
        await auditCasesPage4x.clickSearchButton();
        await auditCasesPage4x.typeInSearchAndSubmit(dataset.AuditCases4x.filterValueOrdered);
      });

      await test.step("Verify all result rows contain 'Ordered' in the caseState1 column", async () => {
        const rowCount = await auditCasesPage4x.verifyAllRowsContainValue(dataset.AuditCases4x.filterAttrCaseState, dataset.AuditCases4x.filterValueOrdered);
        console.log(`Search results verified — ${rowCount} rows, all caseState1 = "Ordered"`);
      });
    }
  );

  test(
    "Audit > Cases: clear 'ORDERED' search — verify all rows return, search 'ordered' (lowercase) — verify case-insensitive returns same rows, clear again",
    async () => {
      await test.step("Clear the active 'ORDERED' search input and verify all rows return", async () => {
        const rowCount = await auditCasesPage4x.clearSearchAndVerifyAllRowsReturn();
        console.log(`After clearing 'ORDERED' search — ${rowCount} rows returned`);
      });

      await test.step("Search 'ordered' (lowercase) — verify search is case-insensitive, same rows returned as 'ORDERED'", async () => {
        await auditCasesPage4x.typeInSearchAndSubmit(dataset.AuditCases4x.filterValueOrderedLower);
        const rowCount = await auditCasesPage4x.verifyAllRowsContainValue(dataset.AuditCases4x.filterAttrCaseState, dataset.AuditCases4x.filterValueOrdered);
        console.log(`Search 'ordered' (lowercase) returned ${rowCount} rows — case-insensitive search confirmed`);
      });

      await test.step("Clear 'ordered' search — verify all 22 rows return", async () => {
        const rowCount = await auditCasesPage4x.clearSearchAndVerifyAllRowsReturn();
        console.log(`After clearing 'ordered' search — ${rowCount} rows returned`);
      });
    }
  );

  test(
    "Audit > Cases: search a value that doesn't exist — verify no data message shown",
    async () => {
      await test.step("Navigate fresh to Audit > Cases and select SJ_Case (clears search state from previous test)", async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
        const rowCount = await auditCasesPage4x.verifyRightPanelHasData();
        console.log(`SJ_Case right panel: ${rowCount} rows loaded before search`);
      });

      await test.step("Open search (or use already-open search from prior test)", async () => {
        await auditCasesPage4x.clickSearchButton();
      });

      await test.step("Search for non-existent value 'ZZZNORESULT999' — verify zero rows and 'No Cases Events' message shown", async () => {
        await auditCasesPage4x.typeInSearchAndVerifyEmptyState(dataset.AuditCases4x.noResultSearch);
      });
    }
  );

  test(
    "Audit > Cases: clear search — verify all rows return, click outside to show placeholder, then click Refresh",
    async () => {
      await test.step("Clear the active search input and verify all rows return", async () => {
        const rowCount = await auditCasesPage4x.clearSearchAndVerifyAllRowsReturn();
        console.log(`After clearing 'ZZZNORESULT999' search — ${rowCount} rows returned`);
      });

      await test.step("Click outside the search box — verify 'Search for cases' placeholder is visible", async () => {
        await auditCasesPage4x.clickOutsideSearchBoxAndVerifyPlaceholder();
      });

      await test.step("Click Refresh and verify data reloads", async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
        console.log("Refresh clicked — data reloaded");
      });
    }
  );

  test(
    "Audit > Cases: open filter dialog — verify filter column names match SJ_Case table headers",
    async () => {
      let tableHeaders: string[] = [];

      await test.step("Navigate to Audit > Cases and select SJ_Case — capture table headers", async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
        tableHeaders = await utility.tableHeader(page);
        console.log(`SJ_Case table headers captured: [${tableHeaders.join(", ")}]`);
      });

      await test.step("Click Filter toolbar to open filter dialog", async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step("Verify filter attribute dropdown options match SJ_Case table headers, then click Cancel", async () => {
        await auditCasesPage4x.verifyFilterAttributesMatchTableHeaders(tableHeaders);
      });
    }
  );

  test(
    "Audit > Cases: open filter dialog, fill details, add rule Case State ≠ CANCELLED, cancel",
    async () => {
      await test.step("Click Filter toolbar to open save-filter dialog", async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step("Fill filter details — Name: Test, Description: AutomationTest, Category: FilterAutomationTest", async () => {
        await auditCasesPage4x.fillCaseFilterDetails(dataset.AuditCases4x.filterName1, dataset.AuditCases4x.filterDescCancel, dataset.AuditCases4x.filterCategory);
      });

      await test.step("Add rule: caseState1 NEQ CANCELLED", async () => {
        await auditCasesPage4x.addFilterRule(dataset.AuditCases4x.filterAttrCaseState, dataset.AuditCases4x.filterOpNEQ, dataset.AuditCases4x.filterValueCancelled);
      });

      await test.step("Click Cancel to dismiss the filter dialog without saving", async () => {
        await auditCasesPage4x.cancelCaseFilter();
      });
    }
  );

  test(
    "Audit > Cases: open filter dialog, fill details, add rule Case State ≠ CANCELLED, close via X",
    async () => {
      await test.step("Click Filter toolbar to open save-filter dialog", async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step("Click Close (X) button — verify dialog closes without saving", async () => {
        await auditCasesPage4x.closeFilterDialog();
      });
    }
  );

  test(
    "Audit > Cases: filter rule value dropdown search returns no results — 'no matches' option is disabled",
    async () => {
      await test.step("Open filter dialog", async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step("Fill filter Name", async () => {
        await auditCasesPage4x.fillCaseFilterDetails(dataset.AuditCases4x.filterName1, dataset.AuditCases4x.filterDescCancel, dataset.AuditCases4x.filterCategory);
      });

      await test.step("Click Add Rule, open attribute dropdown, search 'test' — verify 'no matches' item is disabled", async () => {
        await auditCasesPage4x.searchInFilterRuleValueAndVerifyNoMatches(dataset.AuditCases4x.filterAttrCaseState, dataset.AuditCases4x.filterOpEQ, dataset.AuditCases4x.filterSearchNoMatch);
      });

      await test.step("Click Cancel to dismiss the filter dialog", async () => {
        await auditCasesPage4x.cancelCaseFilter();
      });
    }
  );

  test(
    "Audit > Cases: Create filter, fill details, add rule Case State = CANCELLED, save",
    async () => {
      await test.step("Click Filter toolbar to open save-filter dialog", async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step("Fill filter details — Name: Test, Description: casestate, Category: FilterAutomationTest", async () => {
        await auditCasesPage4x.fillCaseFilterDetails(dataset.AuditCases4x.filterName1, dataset.AuditCases4x.filterName1Desc, dataset.AuditCases4x.filterCategory);
      });

      await test.step("Add rule: caseState1 EQ CANCELLED", async () => {
        await auditCasesPage4x.addFilterRule(dataset.AuditCases4x.filterAttrCaseState, dataset.AuditCases4x.filterOpEQ, dataset.AuditCases4x.filterValueCancelled);
      });

      await test.step("Click Save to save the filter", async () => {
        await auditCasesPage4x.saveCaseFilter();
      });

      await test.step('Verify saved filter "Test" is present in the Saved Filters list', async () => {
        await auditCasesPage4x.verifySavedFilterInList(dataset.AuditCases4x.filterName1, dataset.AuditCases4x.filterCategory);
      });

      await test.step('Click saved filter "Test" — verify table shows matching rows or "no case events" message', async () => {
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterName1);
      });

      await test.step('Click Refresh — close the active saved filter and reload table data', async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
        console.log('Refresh clicked — saved filter "Test" closed, table reloaded');
      });
    }
  );

  test(
    'Audit > Cases: create filter (no category) with rule autoCaseIdentifier1 GT 5 — verify under UNCATEGORIZED and table data',
    async () => {
      await test.step("Navigate to Audit > Cases and select SJ_Case", async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
      });

      await test.step("Click Filter toolbar to open filter dialog", async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step("Fill filter details — Name: withoutCategory, Description: autocaseFilter, Category: (blank)", async () => {
        await auditCasesPage4x.fillCaseFilterDetails(dataset.AuditCases4x.filterNameNoCategory, dataset.AuditCases4x.filterNoCategoryDesc, "");
      });

      await test.step("Add rule: autoCaseIdentifier1 GT 5", async () => {
        await auditCasesPage4x.addFilterRule(dataset.AuditCases4x.filterAttrCaseId, dataset.AuditCases4x.filterOpGT, dataset.AuditCases4x.filterValueGt);
      });

      await test.step("Save the filter", async () => {
        await auditCasesPage4x.saveCaseFilter();
      });

      await test.step('"withoutCategory" is present in Saved Filters list under UNCATEGORIZED', async () => {
        await auditCasesPage4x.verifySavedFilterInList(dataset.AuditCases4x.filterNameNoCategory, dataset.AuditCases4x.uncategorized);
      });

      await test.step('Click saved filter "withoutCategory" — verify table shows matching rows or "No case events" message', async () => {
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterNameNoCategory);
      });

      await test.step('Click Refresh — close the active saved filter and reload table data', async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
        console.log('Refresh clicked — saved filter "withoutCategory" closed, table reloaded');
      });
    }
  );

  test(
    'Audit > Cases: save filter with duplicate name "Test" — verify error dialog appears',
    async () => {
      await test.step('Navigate to Audit > Cases and select SJ_Case', async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
      });

      await test.step('Click Filter toolbar icon to open filter dialog', async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step('Fill filter details — Name: Test (duplicate), Description: duplicatefilter, Category: FilterAutomationTest', async () => {
        await auditCasesPage4x.fillCaseFilterDetails(dataset.AuditCases4x.filterName1, dataset.AuditCases4x.filterDescDuplicate, dataset.AuditCases4x.filterCategory);
      });

      await test.step('Add rule: autoCaseIdentifier1 GT 5', async () => {
        await auditCasesPage4x.addFilterRule(dataset.AuditCases4x.filterAttrCaseId, dataset.AuditCases4x.filterOpGT, dataset.AuditCases4x.filterValueGt);
      });

      await test.step('Click Save — Save has no effect with duplicate name, filter dialog stays open', async () => {
        await auditCasesPage4x.saveWithDuplicateNameAndVerifyDialogStaysOpen();
      });

      await test.step('Rename: clear Name field and type "Test2"', async () => {
        await auditCasesPage4x.nameTextbox.clear();
        await auditCasesPage4x.nameTextbox.fill(dataset.AuditCases4x.filterName2);
        console.log('Filter name renamed to "Test2"');
      });

      await test.step('Click Save — filter "Test2" saved successfully', async () => {
        await auditCasesPage4x.saveCaseFilter();
      });

      await test.step('"Test2" appears in the Saved Filters list under FilterAutomationTest', async () => {
        await auditCasesPage4x.verifySavedFilterInList(dataset.AuditCases4x.filterName2, dataset.AuditCases4x.filterCategory);
      });

      await test.step('Click saved filter "Test2" — verify table shows matching rows or "No case events" message', async () => {
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterName2);
      });

      await test.step('Click Refresh — close the active saved filter and reload table data', async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
        console.log('Refresh clicked — saved filter "Test2" closed, table reloaded');
      });
    }
  );

  test(
    'Audit > Cases: edit saved filter "Test" — change rule value from CANCELLED to ORDERED',
    async () => {
      await test.step('Expand Saved Filters section and FilterAutomationTest category — verify "Test" is visible', async () => {
        await auditCasesPage4x.verifySavedFilterInList(dataset.AuditCases4x.filterName1, dataset.AuditCases4x.filterCategory);
      });

      await test.step('Hover over "Test" filter — click three dots — hover Edit — click Edit to open edit dialog', async () => {
        await auditCasesPage4x.openSavedFilterEditDialog(dataset.AuditCases4x.filterName1);
      });

      await test.step('Change rule value from CANCELLED to ORDERED and save', async () => {
        await auditCasesPage4x.changeRuleEnumValueAndSave(dataset.AuditCases4x.filterValueOrdered);
      });

      await test.step('Click saved filter "Test" — verify table shows matching rows or "No case events" message', async () => {
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterName1);
      });

      await test.step('Click Refresh — close the active saved filter and reload table data', async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
        console.log('Refresh clicked — saved filter "Test" closed, table reloaded');
      });
    }
  );

  test(
    'Audit > Cases: edit saved filter "Test" — change ORDERED to CANCELLED then Cancel — verify table data unchanged',
    async () => {
      await test.step('Expand Saved Filters — verify "Test" is visible — click "Test" — verify table data', async () => {
        await auditCasesPage4x.verifySavedFilterInList(dataset.AuditCases4x.filterName1, dataset.AuditCases4x.filterCategory);
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterName1);
      });

      await test.step('Hover over "Test" filter — click three dots — click Edit to open edit dialog', async () => {
        await auditCasesPage4x.openSavedFilterEditDialog(dataset.AuditCases4x.filterName1);
      });

      await test.step('Change rule value ORDERED → CANCELLED then click Cancel — change is discarded', async () => {
        await auditCasesPage4x.changeRuleEnumValueAndCancel(dataset.AuditCases4x.filterValueCancelled);
      });

      await test.step('Click saved filter "Test" — verify table data is same as before (ORDERED rule unchanged)', async () => {
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterName1);
      });

      await test.step('Hover "Test" — click three dots — click Delete — confirm Yes — verify filter removed from list', async () => {
        await auditCasesPage4x.deleteSavedFilter(dataset.AuditCases4x.filterName1);
      });
    }
  );

  test(
    'Audit > Cases: edit saved filter "Test2" — open edit dialog, close via X — verify table data unchanged, then delete',
    async () => {
      await test.step('Expand Saved Filters — verify "Test2" exists under FilterAutomationTest — click "Test2" — verify table data', async () => {
        await auditCasesPage4x.verifySavedFilterInList(dataset.AuditCases4x.filterName2, dataset.AuditCases4x.filterCategory);
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterName2);
      });

      await test.step('Hover "Test2" — click three dots — click Edit — open edit dialog — close via X button', async () => {
        await auditCasesPage4x.openSavedFilterEditDialog(dataset.AuditCases4x.filterName2);
        await auditCasesPage4x.closeFilterDialog();
      });

      await test.step('Click "Test2" again — verify table data is same as before (rule unchanged)', async () => {
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterName2);
      });

      await test.step('Hover "Test2" — click three dots — click Delete — confirm Yes — verify "Test2" removed from list', async () => {
        await auditCasesPage4x.deleteSavedFilter(dataset.AuditCases4x.filterName2);
      });

      await test.step('"FilterAutomationTest" category is also removed from Saved Filters list', async () => {
        await auditCasesPage4x.verifyCategoryRemovedFromList(dataset.AuditCases4x.filterCategory);
      });

      await test.step('Click Refresh button', async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case table — verify "Event Links" column present, hover cell, verify three-dot button visible and enabled',
    async () => {
      await test.step('Navigate to Audit > Cases and select SJ_Case', async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
      });

      await test.step('Verify first row has Event Links cell — hover, verify three-dot button visible and enabled', async () => {
        await auditCasesPage4x.verifyEventLinksMenuButtonVisibleAndEnabled();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case table — click Event Links three-dot button, verify 4 context menu options visible',
    async () => {
      await test.step('Click Event Links three-dot button — verify 4 context menu options are visible', async () => {
        await auditCasesPage4x.clickEventLinksMenuAndVerifyOptions(dataset.AuditCases4x.eventLinksOptions);
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — Event Links "Referenced process instances" — verify "Event Links" column header and "Referenced work items" row visible, then navigate back',
    async () => {
      await test.step('Open Event Links menu — verify "Referenced process instances" option is visible and click it', async () => {
        await auditCasesPage4x.clickEventLinksReferencedProcessInstances();
      });

      await test.step('Verify page loaded — "Event Links" column header visible and "Referenced work items" row present', async () => {
        await auditCasesPage4x.verifyReferencedProcessInstancesPage();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — click "Referenced work items" row directly — verify "Event Links" header and "Related work items" row visible, then navigate back',
    async () => {
      await test.step('Click "Referenced work items" row directly on the Referenced process instances page', async () => {
        await auditCasesPage4x.clickReferencedWorkItemsRow();
      });

      await test.step('Verify page loaded — "Event Links" column header visible and "Related work items" row present', async () => {
        await auditCasesPage4x.verifyRelatedWorkItemsRowPage();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — click "Related work items" row directly — verify "Event Links" header and "Related cases" row visible, then navigate back',
    async () => {
      await test.step('Click "Related work items" row directly on the Referencing work items page', async () => {
        await auditCasesPage4x.clickRelatedWorkItemsRow();
      });

      await test.step('Verify page loaded — "Event Links" column header visible and "Related cases" row present', async () => {
        await auditCasesPage4x.verifyRelatedCasesRowPage();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — Related cases — 1st link shows "no case reference available", click 2nd link, verify "Type" column header',
    async () => {
      await test.step('Click first "Related cases" button — verify "No case reference available" message', async () => {
        await auditCasesPage4x.clickFirstRelatedCasesButton();
      });

      await test.step('Click second "Related cases" button — navigate to case detail page', async () => {
        await auditCasesPage4x.clickSecondRelatedCasesButton();
      });

      await test.step('Verify "Type" column header is visible on the case detail page', async () => {
        await auditCasesPage4x.verifyTypeColumnHeaderPage();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — Type column page — click first row "Related Work Items" link, verify work item events or "No Work Items" message',
    async () => {
      await test.step('Click "Related Work Items" link in the first row on the Type column page', async () => {
        await auditCasesPage4x.clickRelatedWorkItemsCellButton();
      });

      await test.step('Verify work item events shown or "No Work Items" message', async () => {
        await auditCasesPage4x.verifyReferencingWorkItemsPage();
      });

      await test.step('Navigate back to Cases', async () => {
        await auditCasesPage4x.navigateBackToCases();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — Event Links "This case" — verify "Message ID" header, drill into Message ID, verify Event Details and loop Next through all events',
    async () => {
      test.setTimeout(300000);

      await test.step('Open Event Links menu and click "This case"', async () => {
        await auditCasesPage4x.clickEventLinksThisCase();
      });

      await test.step('Verify "Message ID" column header is visible', async () => {
        await auditCasesPage4x.verifyThisCasePage();
      });

      let auditHeaders: string[] = [];
      let eventId = '';
      let messageId = '';

      await test.step('Read first row — capture Event ID and Message ID', async () => {
        auditHeaders = await auditCasesPage4x.verifyAuditEventColumns();
        const result = await auditCasesPage4x.readFirstAuditEventRow(auditHeaders);
        eventId   = result.eventId;
        messageId = result.messageId;
        console.log(`This case — Event ID: ${eventId}, Message ID: ${messageId}`);
      });

      await test.step('Click Message ID cell in first row — navigate to Audit details page', async () => {
        await auditCasesPage4x.drillIntoMessageId(auditHeaders);
      });

      let detailHeaders: string[] = [];

      await test.step('Verify Audit details page — Event ID present', async () => {
        const result = await auditCasesPage4x.verifyAuditDetailsPage();
        detailHeaders = result.detailHeaders;
        console.log(`Audit details headers: [${detailHeaders.join(', ')}]`);
      });

      await test.step('Click Message ID in Audit details — open Event Details panel', async () => {
        await auditCasesPage4x.openEventDetailsPanel(detailHeaders);
      });

      await test.step('Verify Event Details panel heading matches Event ID and Message ID', async () => {
        await auditCasesPage4x.verifyEventDetailsPanel(eventId, messageId);
        console.log(`Event Details opened — Event ID: ${eventId}, Message ID: ${messageId}`);
      });

      await test.step('Verify All Attributes for first event, then click Next through all remaining events until last', async () => {
        await auditCasesPage4x.loopThroughAllEventDetails();
      });

      await test.step('Close Event Details panel', async () => {
        await auditCasesPage4x.closeEventDetailsDialog();
      });

      await test.step('Click Back — navigate back to Cases and verify instance table is visible', async () => {
        await auditCasesPage4x.navigateBackToCases();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — Event Links "Cases of this class" — verify "Message ID" header, drill into Message ID, verify Event Details and loop Next',
    async () => {
      test.setTimeout(300000);

      await test.step('Open Event Links menu and click "Cases of this class"', async () => {
        await auditCasesPage4x.clickEventLinksCasesOfThisClass();
      });

      await test.step('Verify "Message ID" column header and "GLOBAL DATA CREATE CASE" row data visible', async () => {
        await auditCasesPage4x.verifyCasesOfThisClassPage();
      });

      let auditHeaders: string[] = [];
      let eventId = '';
      let messageId = '';

      await test.step('Read first row — capture Event ID and Message ID', async () => {
        auditHeaders = await auditCasesPage4x.verifyAuditEventColumns();
        const result = await auditCasesPage4x.readFirstAuditEventRow(auditHeaders);
        eventId   = result.eventId;
        messageId = result.messageId;
        console.log(`Cases of this class — Event ID: ${eventId}, Message ID: ${messageId}`);
      });

      await test.step('Click Message ID cell in first row — navigate to Audit details page', async () => {
        await auditCasesPage4x.drillIntoMessageId(auditHeaders);
      });

      let detailHeaders: string[] = [];

      await test.step('Verify Audit details page — Event ID present', async () => {
        const result = await auditCasesPage4x.verifyAuditDetailsPage();
        detailHeaders = result.detailHeaders;
        console.log(`Audit details headers: [${detailHeaders.join(', ')}]`);
      });

      await test.step('Click Message ID in Audit details — open Event Details panel', async () => {
        await auditCasesPage4x.openEventDetailsPanel(detailHeaders);
      });

      await test.step('Verify Event Details panel heading matches Event ID and Message ID', async () => {
        await auditCasesPage4x.verifyEventDetailsPanel(eventId, messageId);
        console.log(`Event Details opened — Event ID: ${eventId}, Message ID: ${messageId}`);
      });

      await test.step('Verify All Attributes for first event, then click Next through all remaining events until last', async () => {
        await auditCasesPage4x.loopThroughAllEventDetails();
      });

      await test.step('Close Event Details panel', async () => {
        await auditCasesPage4x.closeEventDetailsDialog();
      });

      await test.step('Click Back — navigate back to Cases and verify instance table is visible', async () => {
        await auditCasesPage4x.navigateBackToCases();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — Referenced process instances page — Event Links three-dot context menu shows 5 options (4 enabled, 1 disabled)',
    async () => {
      await test.step('Open Event Links menu and click "Referenced process instances"', async () => {
        await auditCasesPage4x.clickEventLinksReferencedProcessInstances();
      });

      await test.step('On Referenced process instances page — click first row Event Links three-dot, verify context menu has 5 options (4 enabled + 1 disabled)', async () => {
        await auditCasesPage4x.verifyReferencedProcessInstancesEventLinksMenuOptions();
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — "Source process template" — validate headers + pvm row — drill into first row — verify "Managed Obj Name" header and "ProjectForAuditProcess" row',
    async () => {
      await test.step('Click first row Event Links three-dot — click "Source process template"', async () => {
        await auditCasesPage4x.clickEventLinksSourceProcessTemplate();
      });

      await test.step('Validate Source process template page headers — "Process Instance ID" column present', async () => {
        const headers = await utility.tableHeader(page);
        console.log(`Source process template headers: [${headers.join(', ')}]`);
        expect(headers, `"${dataset.AuditCases4x.sourceProcessTemplateHeader}" column must be present`).toContain(dataset.AuditCases4x.sourceProcessTemplateHeader);
      });

      let processInstanceId = '';

      await test.step('Validate first row — "Process Instance ID" value starts with "pvm"', async () => {
        const headers = await utility.tableHeader(page);
        const firstRow = await utility.getFirstRowContents(page);
        const idx = headers.indexOf(dataset.AuditCases4x.sourceProcessTemplateHeader);
        expect(idx, `"${dataset.AuditCases4x.sourceProcessTemplateHeader}" column must be present`).toBeGreaterThan(-1);
        processInstanceId = firstRow[idx]?.trim() ?? '';
        expect(processInstanceId.toLowerCase(), `Process Instance ID should start with "${dataset.AuditCases4x.processInstanceIdPrefix}" — got "${processInstanceId}"`).toMatch(new RegExp(`^${dataset.AuditCases4x.processInstanceIdPrefix}`, 'i'));
        console.log(`First row — Process Instance ID: "${processInstanceId}"`);
      });

      await test.step('Drill into first row — audit detail page loads — verify "Managed Obj Name" header and "ProjectForAuditProcess" row', async () => {
        await auditCasesPage4x.clickFirstRowOnSourceProcessTemplatePage();
        const auditHeaders = await utility.tableHeader(page);
        console.log(`Audit detail headers: [${auditHeaders.join(', ')}]`);
        const moIdx = auditHeaders.indexOf(dataset.AuditCases4x.auditDetailManagedObjHeader);
        expect(moIdx, `"${dataset.AuditCases4x.auditDetailManagedObjHeader}" column must be present on audit detail page`).toBeGreaterThan(-1);
        const firstRow = await utility.getFirstRowContents(page);
        const managedObjName = firstRow[moIdx]?.trim() ?? '';
        expect(managedObjName, `Managed Obj Name should contain "${dataset.projectforAuditProcess}" — got "${managedObjName}"`).toContain(dataset.projectforAuditProcess);
        console.log(`Audit detail — Managed Obj Name: "${managedObjName}" contains "${dataset.projectforAuditProcess}" — verified`);
      });
    }
  );

  test(
    'Audit > Cases: SJ_Case — audit detail page from Source process template — verify event columns, drill into Message ID, verify Event Details panel and loop Next',
    async () => {
      test.setTimeout(300000);

      let auditHeaders: string[] = [];

      await test.step('Verify audit event table headers — Event ID, Message ID, Severity present', async () => {
        auditHeaders = await auditCasesPage4x.verifyAuditEventColumns();
        console.log(`Audit detail headers: [${auditHeaders.join(', ')}]`);
      });

      let eventId = '';
      let messageId = '';

      await test.step('Read first audit event row — capture Event ID and Message ID', async () => {
        const result = await auditCasesPage4x.readFirstAuditEventRow(auditHeaders);
        eventId   = result.eventId;
        messageId = result.messageId;
        console.log(`Event ID: ${eventId}, Message ID: ${messageId}, Severity: ${result.severity}`);
      });

      await test.step('Click Message ID cell — navigate to Audit details page', async () => {
        await auditCasesPage4x.drillIntoMessageId(auditHeaders);
      });

      let detailHeaders: string[] = [];

      await test.step('Verify Audit details page — Event ID present and Severity = AUDIT', async () => {
        const result = await auditCasesPage4x.verifyAuditDetailsPage();
        detailHeaders = result.detailHeaders;
        console.log(`Audit details headers: [${detailHeaders.join(', ')}]`);
      });

      await test.step('Click Message ID in Audit details — open Event Details panel', async () => {
        await auditCasesPage4x.openEventDetailsPanel(detailHeaders);
      });

      await test.step('Verify Event Details panel heading matches Event ID and Message ID', async () => {
        await auditCasesPage4x.verifyEventDetailsPanel(eventId, messageId);
        console.log(`Event Details opened — Event ID: ${eventId}, Message ID: ${messageId}`);
      });

      await test.step('Verify Previous button is disabled on the first event', async () => {
        await expect(
          auditCasesPage4x.previousEventDetailBtn,
          'Previous button should be disabled on the first event'
        ).toBeDisabled();
        console.log('Previous button is disabled on first event — verified');
      });

      await test.step('Verify All Attributes for first event, then click Next through all remaining events until last', async () => {
        await auditCasesPage4x.loopThroughAllEventDetails();
      });

      await test.step('Close Event Details panel', async () => {
        await auditCasesPage4x.closeEventDetailsDialog();
      });

      await test.step('Click "Back to Cases" — navigate back to SJ_Case instance list', async () => {
        await auditCasesPage4x.navigateBackToCases();
      });

      await test.step('Click "All Cases"', async () => {
        await page.waitForTimeout(2000);
        await auditCasesPage4x.navigateToAllCases();
      });

      await test.step('Click Refresh — reload all case instances', async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
      });
    }
  );

  test(
    'Audit > Cases: open filter dialog, leave Name empty — verify Save button is disabled',
    async () => {
      await test.step('Navigate to Audit > Cases and select SJ_Case', async () => {
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
      });

      await test.step('Open filter dialog', async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step('Name field empty — verify Save button is disabled', async () => {
        await expect(
          auditCasesPage4x.saveFilterBtn,
          'Save button should be disabled when Name field is empty'
        ).toBeDisabled();
        console.log('Save button is disabled with empty Name — verified');
      });

      await test.step('Cancel filter dialog to clean up', async () => {
        await auditCasesPage4x.cancelCaseFilter();
      });
    }
  );

  test(
    'Audit > Cases: open filter dialog, fill Name + Description only (no rule) — verify Save button enabled, save, verify in list, delete',
    async () => {
      await test.step('Navigate to Audit > Cases and select SJ_Case', async () => {
        await goToWorkManager();
        await auditCasesPage4x.navigateToAuditCasesAndSelect(dataset.AuditCases4x.caseType);
      });

      await test.step('Open filter dialog', async () => {
        await auditCasesPage4x.hoverAndClickCaseFilterIcon();
      });

      await test.step('Fill Name and Description only — do not add any rule', async () => {
        await auditCasesPage4x.fillCaseFilterDetails(
          dataset.AuditCases4x.filterNameNoRule,
          dataset.AuditCases4x.filterDescNoRule,
          ''
        );
      });

      await test.step('Verify Save button is enabled without any rule added', async () => {
        await expect(
          auditCasesPage4x.saveFilterBtn,
          'Save button should be enabled even without a filter rule'
        ).toBeEnabled();
        console.log('Save button is enabled without a rule — verified');
      });

      await test.step('Click Save — filter saved successfully', async () => {
        await auditCasesPage4x.saveCaseFilter();
      });

      await test.step('"NoRuleFilter" appears in Saved Filters list under UNCATEGORIZED', async () => {
        await auditCasesPage4x.verifySavedFilterInList(
          dataset.AuditCases4x.filterNameNoRule,
          dataset.AuditCases4x.uncategorized
        );
      });

      await test.step('Click "NoRuleFilter" — no rule means no filter applied, right panel shows all SJ_Case rows or empty-state', async () => {
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterNameNoRule);
        console.log('"NoRuleFilter" applied — right panel data verified');
      });
    }
  );

  test(
    'Audit > Cases: Saved Filters panel toggle — click and verify panel collapses and expands on toggle button click',
    async () => {
      await test.step('Saved Filters panel is expanded from previous test — filter is visible', async () => {
        await auditCasesPage4x.verifySavedFilterInList(
          dataset.AuditCases4x.filterNameNoRule,
          dataset.AuditCases4x.uncategorized
        );
        console.log('Saved Filters panel is expanded — "NoRuleFilter" is visible');
      });

      await test.step('Click Saved Filters button to collapse the panel', async () => {
        await auditCasesPage4x.savedFiltersButton.click();
        console.log('Saved Filters button clicked — panel should collapse');
      });

      await test.step('Verify Saved Filters panel is collapsed — "NoRuleFilter" is not visible', async () => {
        await expect(
          page.getByText(dataset.AuditCases4x.filterNameNoRule, { exact: true }).first(),
          '"NoRuleFilter" text should not be visible after panel collapses'
        ).not.toBeVisible();
        console.log('Saved Filters panel collapsed — filters hidden, verified');
      });

      await test.step('Click Saved Filters button again to expand the panel', async () => {
        await auditCasesPage4x.savedFiltersButton.click();
        console.log('Saved Filters button clicked again — panel should expand');
      });

      await test.step('Verify Saved Filters panel is expanded — "NoRuleFilter" is visible again', async () => {
        await auditCasesPage4x.verifySavedFilterInList(
          dataset.AuditCases4x.filterNameNoRule,
          dataset.AuditCases4x.uncategorized
        );
        console.log('Saved Filters panel expanded — "NoRuleFilter" visible again, verified');
      });
    }
  );

  test(
    'Audit > Cases: filter persistence — navigate away to Work Manager and back, verify "NoRuleFilter" still in list, click and verify right panel data',
    async () => {
      await test.step('Verify "NoRuleFilter" is present in Saved Filters list before navigating away', async () => {
        await auditCasesPage4x.verifySavedFilterInList(
          dataset.AuditCases4x.filterNameNoRule,
          dataset.AuditCases4x.uncategorized
        );
        console.log('"NoRuleFilter" confirmed in list before navigation');
      });

      await test.step('Navigate away — go to Work Manager', async () => {
        await goToWorkManager();
        console.log('Navigated away to Work Manager');
      });

      await test.step('Navigate back to Audit > Cases and click Saved Filters', async () => {
        await auditCasesPage4x.navigateToAudit();
        await auditCasesPage4x.navigateToCasesList();
        await auditCasesPage4x.savedFiltersButton.click();
        console.log('Navigated back to Audit > Cases — Saved Filters section expanded');
      });

      await test.step('Verify filter still appears in Saved Filters list under UNCATEGORIZED after navigation', async () => {
        await auditCasesPage4x.verifySavedFilterInList(
          dataset.AuditCases4x.filterNameNoRule,
          dataset.AuditCases4x.uncategorized
        );
        console.log('"NoRuleFilter" persisted after navigation — verified');
      });

      await test.step('Click — verify right panel shows data rows or empty-state message', async () => {
        await auditCasesPage4x.clickSavedFilterAndVerifyData(dataset.AuditCases4x.filterNameNoRule);
      });

      await test.step('Delete filter to clean up', async () => {
        await auditCasesPage4x.deleteSavedFilter(dataset.AuditCases4x.filterNameNoRule);
        console.log(`Filter "${dataset.AuditCases4x.filterNameNoRule}" deleted — cleanup complete`);
      });
    }
  );

  test(
    'Audit > Cases: delete filter confirmation — hover three-dot and click on Delete then click No — verify filter still in list',
    async () => {
      await test.step('Verify "withoutCategory" is present in Saved Filters list under UNCATEGORIZED', async () => {
        await auditCasesPage4x.verifySavedFilterInList(
          dataset.AuditCases4x.filterNameNoCategory,
          dataset.AuditCases4x.uncategorized
        );
        console.log('"withoutCategory" confirmed in list before delete attempt');
      });

      await test.step('Hover "withoutCategory" — three-dot — Delete — open confirmation dialog', async () => {
        await auditCasesPage4x.openDeleteConfirmationDialog(dataset.AuditCases4x.filterNameNoCategory);
      });

      await test.step('Click "No" in confirmation dialog — deletion is cancelled', async () => {
        await page.getByRole('button', { name: 'No' }).click();
        console.log('Clicked "No" — deletion cancelled');
      });

      await test.step('Verify filter name is still present in Saved Filters list', async () => {
        await auditCasesPage4x.verifySavedFilterInList(
          dataset.AuditCases4x.filterNameNoCategory,
          dataset.AuditCases4x.uncategorized
        );
        console.log('filter name still in list after clicking No — confirmed');
      });
    }
  );

  test(
    'Audit > Cases: delete filter — verify UNCATEGORIZED category removed from list, click Refresh',
    async () => {
      await test.step('Verify "withoutCategory" filter is present in Saved Filters list under UNCATEGORIZED', async () => {
        await auditCasesPage4x.verifySavedFilterInList(
          dataset.AuditCases4x.filterNameNoCategory,
          dataset.AuditCases4x.uncategorized
        );
        console.log('"withoutCategory" filter confirmed under UNCATEGORIZED');
      });

      await test.step('Delete "withoutCategory" filter — it is the only filter in UNCATEGORIZED', async () => {
        await auditCasesPage4x.deleteSavedFilter(dataset.AuditCases4x.filterNameNoCategory);
        console.log('"withoutCategory" deleted');
      });

      await test.step('Click Refresh — allow UI to settle after filter deletion', async () => {
        await auditCasesPage4x.clickRefreshAndWaitForData();
      });

      await test.step('Verify UNCATEGORIZED category is removed from Saved Filters list', async () => {
        await auditCasesPage4x.verifyCategoryRemovedFromList(dataset.AuditCases4x.uncategorized);
      });
    }
  );
});
