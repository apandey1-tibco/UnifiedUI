import { test, expect, Page } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { AuditProcessTemplatesPage } from "../../PageObjects/AuditProcessTemplatesPage";
import { Audit_ProcessInstancePage_4x } from "../../PageObjects/Audit_ProcessInstancePage_4x";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";

const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let cmPage: CaseManagerPage;
let adPtpage: AuditProcessTemplatesPage;
let auditProcessInstancepage4x: Audit_ProcessInstancePage_4x;

test.beforeAll(async ({ browser }) => {
  test.setTimeout(120000);
  page = await browser.newPage();
  poManager = new POManager(page);
  cmPage = poManager.getCaseManagerPage();
  adPtpage = poManager.getAuditProcessTemplatesPage();
  auditProcessInstancepage4x = poManager.getAuditProcessInstancepage4x();

  const loginPage = poManager.getLoginPage();
  const amxbpmPage = poManager.getAMXBPMUsersResoursesPage();

  await page.context().clearCookies();
  await loginPage.login(dataset.username1, dataset.password1);
  await loginPage.navigateToWorkManagerUrl(dataset.auditWorkManagerUrl);
  await page.waitForLoadState("domcontentloaded");
  await cmPage.selectServerFromGlobalSwitcher(dataset.amxbpmServer);
  await cmPage.clickOnConfirmServerSelectionBtn();
  await amxbpmPage.assertServerIsSelected(dataset.amxbpmServer);
});

test.afterAll(async () => {
  await page.close();
});

test.describe("AMXBPM 4.x Server - Audit Process Templates Tests", () => {
  test.setTimeout(120000);

  test(
    "Audit > Process Templates: navigate to Audit and click Process Templates — verify page loads",
    async () => {
      await test.step("Navigate to Audit section and click Process Templates", async () => {
        await adPtpage.navigateToProcessTemplates();
      });

      await test.step("Verify Process Templates page is loaded — table visible", async () => {
        await adPtpage.verifyPageLoaded();
        console.log("Process Templates page loaded and table verified");
      });
    }
  );

  test(
    "Audit > Process Templates: verify column headers match expected list",
    async () => {
      await test.step("Verify all column headers match expected columns", async () => {
        const headers = await adPtpage.getColumnHeaders();
        console.log(`Process Templates headers: [${headers.join(", ")}]`);
        expect(headers).toStrictEqual(dataset.AuditProcessTemplates4x.expectedHeaders);
      });
    }
  );

  test(
    "Audit > Process Templates: click Refresh — verify table reloads",
    async () => {
      await test.step("Click Refresh button and verify table reloads", async () => {
        await adPtpage.clickRefresh();
        await adPtpage.verifyPageLoaded();
        console.log("Refresh completed — table reloaded");
      });
    }
  );

  test(
    "Audit > Process Templates: click first row — verify audit events table loads",
    async () => {
      await test.step("Click first row to drill into audit events", async () => {
        await adPtpage.drillIntoFirstRow();
      });

      await test.step("Verify audit events table loads with event columns", async () => {
        const auditHeaders = await adPtpage.verifyAuditDetailsLoaded();
        console.log(`Audit event headers: [${auditHeaders.join(", ")}]`);
      });
    }
  );

  test(
    "Audit > Process Templates: audit events — verify Event ID, Message ID, Severity columns",
    async () => {
      await test.step("Verify required audit event columns are present", async () => {
        const headers = await adPtpage.verifyAuditEventColumns();
        console.log(`Audit event columns: [${headers.join(", ")}]`);
        expect(headers).toContain("Event ID");
        expect(headers).toContain("Message ID");
        expect(headers).toContain("Severity");
      });
    }
  );

  test(
    "Audit > Process Templates: drill into Message ID — open Event Details panel, verify heading",
    async () => {
      let auditHeaders: string[] = [];
      let eventId = "";
      let messageId = "";

      await test.step("Read first audit event row — capture Event ID and Message ID", async () => {
        auditHeaders = await adPtpage.verifyAuditEventColumns();
        const result = await adPtpage.readFirstAuditEventRow(auditHeaders);
        eventId = result.eventId;
        messageId = result.messageId;
        console.log(`Event ID: ${eventId}, Message ID: ${messageId}, Severity: ${result.severity}`);
      });

      await test.step("Click Message ID cell — navigate to Audit details page", async () => {
        await adPtpage.drillIntoMessageId(auditHeaders);
      });

      let detailHeaders: string[] = [];

      await test.step("Verify Audit details page — Event ID column present", async () => {
        const result = await adPtpage.verifyAuditDetailsPage();
        detailHeaders = result.detailHeaders;
        console.log(`Audit details headers: [${detailHeaders.join(", ")}]`);
      });

      await test.step("Click Message ID in Audit details — open Event Details panel", async () => {
        await adPtpage.openEventDetailsPanel(detailHeaders);
      });

      await test.step("Verify Event Details panel heading matches Event ID and Message ID", async () => {
        await adPtpage.verifyEventDetailsPanel(eventId, messageId);
        console.log(`Event Details opened — Event ID: ${eventId}, Message ID: ${messageId}`);
      });
    }
  );

  test(
    "Audit > Process Templates: Event Details panel — verify All Attributes, loop Next through all events",
    async () => {
      test.setTimeout(300000);

      await test.step("Verify All Attributes for first event, click Next through all events until last", async () => {
        await adPtpage.loopThroughAllEventDetails();
      });

      await test.step("Close Event Details panel", async () => {
        await adPtpage.closeEventDetailsDialog();
      });
    }
  );

  test(
    "Audit > Process Templates: navigate back to list — verify page reloads",
    async () => {
      await test.step("Navigate back to Process Templates list", async () => {
        await adPtpage.navigateBackToList();
      });

      await test.step("Verify Process Templates table visible after back navigation", async () => {
        await adPtpage.verifyPageLoaded();
        console.log("Back on Process Templates page — verified");
      });
    }
  );

  test(
    "Audit > Process Templates: open filter dialog — verify attribute options match column headers",
    async () => {
      let tableHeaders: string[] = [];

      await test.step("Capture Process Templates column headers", async () => {
        tableHeaders = await adPtpage.getColumnHeaders();
        console.log(`Process Templates column headers: [${tableHeaders.join(", ")}]`);
      });

      await test.step("Open filter dialog", async () => {
        await adPtpage.openFilterDialog();
      });

      await test.step("Verify filter attribute options match column headers, then cancel", async () => {
        await adPtpage.verifyFilterAttributesMatchHeaders(tableHeaders);
        await adPtpage.cancelFilter();
      });
    }
  );

  test(
    "Audit > Process Templates: create filter with Name + Description + Category + rule — save",
    async () => {
      await test.step("Open filter dialog", async () => {
        await adPtpage.openFilterDialog();
      });

      await test.step("Fill filter details", async () => {
        await adPtpage.fillFilterDetails(
          dataset.AuditProcessTemplates4x.filterName1,
          dataset.AuditProcessTemplates4x.filterDesc1,
          dataset.AuditProcessTemplates4x.filterCategory
        );
      });

      await test.step("Add filter rule", async () => {
        await adPtpage.addFilterRule(
          dataset.AuditProcessTemplates4x.filterAttr,
          dataset.AuditProcessTemplates4x.filterOp,
          dataset.AuditProcessTemplates4x.filterValue
        );
      });

      await test.step("Save filter", async () => {
        await adPtpage.saveFilter();
      });

      await test.step("Verify saved filter appears in list under correct category", async () => {
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterName1,
          dataset.AuditProcessTemplates4x.filterCategory
        );
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterName1}" saved and visible`);
      });
    }
  );

  test(
    "Audit > Process Templates: click saved filter — verify filtered data, click Refresh to clear",
    async () => {
      await test.step("Click saved filter and verify filtered table data", async () => {
        await adPtpage.clickSavedFilterAndVerifyData(dataset.AuditProcessTemplates4x.filterName1);
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterName1}" applied — data verified`);
      });

      await test.step("Click Refresh — clear filter and reload all data", async () => {
        await adPtpage.clickRefresh();
        await adPtpage.verifyPageLoaded();
        console.log("Refresh clicked — filter cleared, all data reloaded");
      });
    }
  );

  test(
    "Audit > Process Templates: save filter with duplicate name — verify error or dialog stays, rename and save as new filter",
    async () => {
      await test.step("Open filter dialog", async () => {
        await adPtpage.openFilterDialog();
      });

      await test.step("Fill duplicate filter name and add rule", async () => {
        await adPtpage.fillFilterDetails(
          dataset.AuditProcessTemplates4x.filterName1,
          dataset.AuditProcessTemplates4x.filterDescDuplicate,
          dataset.AuditProcessTemplates4x.filterCategory
        );
        await adPtpage.addFilterRule(
          dataset.AuditProcessTemplates4x.filterAttr,
          dataset.AuditProcessTemplates4x.filterOp,
          dataset.AuditProcessTemplates4x.filterValue
        );
      });

      await test.step("Try to save with duplicate name — dialog stays open", async () => {
        await adPtpage.saveWithDuplicateNameAndVerifyDialogStaysOpen();
      });

      await test.step("Rename to a unique name and save", async () => {
        await adPtpage.renameAndSave(dataset.AuditProcessTemplates4x.filterName2);
      });

      await test.step("Verify new filter in list", async () => {
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterName2,
          dataset.AuditProcessTemplates4x.filterCategory
        );
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterName2}" saved and visible`);
      });
    }
  );

  test(
    "Audit > Process Templates: edit saved filter — change rule value, save",
    async () => {
      await test.step("Verify filter visible in list", async () => {
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterName1,
          dataset.AuditProcessTemplates4x.filterCategory
        );
      });

      await test.step("Open edit dialog for saved filter", async () => {
        await adPtpage.openSavedFilterEditDialog(dataset.AuditProcessTemplates4x.filterName1);
      });

      await test.step("Change rule value and save", async () => {
        await adPtpage.changeRuleValueAndSave(dataset.AuditProcessTemplates4x.filterValueUpdated);
      });

      await test.step("Apply filter and verify updated data", async () => {
        await adPtpage.clickSavedFilterAndVerifyData(dataset.AuditProcessTemplates4x.filterName1);
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterName1}" edited and applied`);
      });

      await test.step("Click Refresh to clear filter", async () => {
        await adPtpage.clickRefresh();
      });
    }
  );

  test(
    "Audit > Process Templates: edit saved filter — cancel changes, verify data unchanged",
    async () => {
      await test.step("Click saved filter and verify current data", async () => {
        await adPtpage.clickSavedFilterAndVerifyData(dataset.AuditProcessTemplates4x.filterName1);
      });

      await test.step("Open edit dialog", async () => {
        await adPtpage.openSavedFilterEditDialog(dataset.AuditProcessTemplates4x.filterName1);
      });

      await test.step("Change value and then cancel — changes discarded", async () => {
        await adPtpage.changeRuleValueAndCancel(dataset.AuditProcessTemplates4x.filterValueCancel);
      });

      await test.step("Apply filter and verify original data still in effect", async () => {
        await adPtpage.clickSavedFilterAndVerifyData(dataset.AuditProcessTemplates4x.filterName1);
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterName1}" unchanged after cancel — verified`);
      });
    }
  );

  test.skip(
    "Audit > Process Templates: edit saved filter — close via X, verify data unchanged",
    async () => {
      await test.step("Open edit dialog", async () => {
        await adPtpage.openSavedFilterEditDialog(dataset.AuditProcessTemplates4x.filterName1);
      });

      await test.step("Close edit dialog via X button", async () => {
        await adPtpage.closeFilterDialog();
      });

      await test.step("Apply filter and verify data unchanged", async () => {
        await adPtpage.clickSavedFilterAndVerifyData(dataset.AuditProcessTemplates4x.filterName1);
        console.log("Edit dialog closed via X — filter unchanged, verified");
      });
    }
  );

  test(
    "Audit > Process Templates: delete filter1 — verify removed, category remains (filter2 still present)",
    async () => {
      await test.step("Delete first saved filter", async () => {
        await adPtpage.deleteSavedFilter(dataset.AuditProcessTemplates4x.filterName1);
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterName1}" deleted`);
      });

      await test.step("Verify filter2 still exists in category", async () => {
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterName2,
          dataset.AuditProcessTemplates4x.filterCategory
        );
        console.log(`Category still present — filter "${dataset.AuditProcessTemplates4x.filterName2}" visible`);
      });
    }
  );

  test(
    "Audit > Process Templates: delete filter2 — verify category removed from list",
    async () => {
      await test.step("Delete second saved filter", async () => {
        await adPtpage.deleteSavedFilter(dataset.AuditProcessTemplates4x.filterName2);
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterName2}" deleted`);
      });

      await test.step("Verify category is now removed from Saved Filters list", async () => {
        await adPtpage.verifyCategoryRemovedFromList(dataset.AuditProcessTemplates4x.filterCategory);
        console.log(`Category "${dataset.AuditProcessTemplates4x.filterCategory}" removed — verified`);
      });
    }
  );

  test(
    "Audit > Process Templates: create filter without category — verify under UNCATEGORIZED",
    async () => {
      await test.step("Open filter dialog", async () => {
        await adPtpage.openFilterDialog();
      });

      await test.step("Fill filter without category", async () => {
        await adPtpage.fillFilterDetails(
          dataset.AuditProcessTemplates4x.filterNameNoCategory,
          dataset.AuditProcessTemplates4x.filterDescNoCategory,
          ""
        );
        await adPtpage.addFilterRule(
          dataset.AuditProcessTemplates4x.filterAttr,
          dataset.AuditProcessTemplates4x.filterOp,
          dataset.AuditProcessTemplates4x.filterValue
        );
      });

      await test.step("Save filter", async () => {
        await adPtpage.saveFilter();
      });

      await test.step("Verify filter under UNCATEGORIZED", async () => {
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterNameNoCategory,
          dataset.AuditProcessTemplates4x.uncategorized
        );
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterNameNoCategory}" visible under UNCATEGORIZED`);
      });
    }
  );

  test(
    "Audit > Process Templates: delete UNCATEGORIZED filter — verify category removed",
    async () => {
      await test.step("Delete UNCATEGORIZED filter", async () => {
        await adPtpage.deleteSavedFilter(dataset.AuditProcessTemplates4x.filterNameNoCategory);
      });

      await test.step("Verify UNCATEGORIZED category removed", async () => {
        await adPtpage.verifyCategoryRemovedFromList(dataset.AuditProcessTemplates4x.uncategorized);
        console.log("UNCATEGORIZED category removed — verified");
      });

      await test.step("Click Refresh", async () => {
        await adPtpage.clickRefresh();
      });
    }
  );

  test(
    "Audit > Process Templates: delete confirmation — click No — verify filter still in list",
    async () => {
      await test.step("Open filter dialog and create a temp filter", async () => {
        await adPtpage.openFilterDialog();
        await adPtpage.fillFilterDetails(
          dataset.AuditProcessTemplates4x.filterNameTemp,
          dataset.AuditProcessTemplates4x.filterDescTemp,
          ""
        );
        await adPtpage.saveFilter();
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterNameTemp,
          dataset.AuditProcessTemplates4x.uncategorized
        );
      });

      await test.step("Open delete confirmation — click No", async () => {
        await adPtpage.openDeleteConfirmationDialog(dataset.AuditProcessTemplates4x.filterNameTemp);
        await page.getByRole("button", { name: "No" }).click();
        console.log('Clicked "No" — deletion cancelled');
      });

      await test.step("Verify filter still present after clicking No", async () => {
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterNameTemp,
          dataset.AuditProcessTemplates4x.uncategorized
        );
        console.log("Filter still present after clicking No — verified");
      });

      await test.step("Delete temp filter to clean up", async () => {
        await adPtpage.deleteSavedFilter(dataset.AuditProcessTemplates4x.filterNameTemp);
        await adPtpage.verifyCategoryRemovedFromList(dataset.AuditProcessTemplates4x.uncategorized);
        console.log("Temp filter deleted — cleanup complete");
      });
    }
  );

  test(
    "Audit > Process Templates: filter Name empty — Save button disabled",
    async () => {
      await test.step("Open filter dialog", async () => {
        await adPtpage.openFilterDialog();
      });

      await test.step("Verify Save button disabled with empty Name", async () => {
        await expect(
          adPtpage.saveFilterBtn,
          "Save button should be disabled when Name field is empty"
        ).toBeDisabled();
        console.log("Save button disabled with empty Name — verified");
      });

      await test.step("Cancel filter dialog", async () => {
        await adPtpage.cancelFilter();
      });
    }
  );

  test.skip(
    "Audit > Process Templates: Process Instance view — navigate and verify via auditProcessInstancepage4x",
    async () => {
      await test.step("Navigate to Process Instances from Audit dropdown", async () => {
        await page.locator('span[title="Process Instances"]').click();
        await page.waitForLoadState("domcontentloaded");
      });

      await test.step("Verify Process Instances page loads", async () => {
        await auditProcessInstancepage4x.verifyProcessInstancesPageLoaded();
      });

      await test.step("Navigate back to Process Templates", async () => {
        await adPtpage.navigateToProcessTemplates();
        await adPtpage.verifyPageLoaded();
      });
    }
  );

  test(
    "Audit > Process Templates: filter persistence — navigate away and back, verify saved filters still present",
    async () => {
      await test.step("Create a filter for persistence test", async () => {
        await adPtpage.openFilterDialog();
        await adPtpage.fillFilterDetails(
          dataset.AuditProcessTemplates4x.filterNamePersist,
          dataset.AuditProcessTemplates4x.filterDescPersist,
          dataset.AuditProcessTemplates4x.filterCategory
        );
        await adPtpage.addFilterRule(
          dataset.AuditProcessTemplates4x.filterAttr,
          dataset.AuditProcessTemplates4x.filterOp,
          dataset.AuditProcessTemplates4x.filterValue
        );
        await adPtpage.saveFilter();
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterNamePersist,
          dataset.AuditProcessTemplates4x.filterCategory
        );
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterNamePersist}" created for persistence test`);
      });

      await test.step("Navigate away to a different Audit section", async () => {
        await page.locator('span[title="Process Instances"]').click();
        await page.waitForLoadState("domcontentloaded");
        console.log("Navigated to Process Instances");
      });

      await test.step("Navigate back to Process Templates", async () => {
        await adPtpage.navigateToProcessTemplates();
        await adPtpage.verifyPageLoaded();
        console.log("Navigated back to Process Templates");
      });

      await test.step("Expand Saved Filters and verify filter still in list", async () => {
        await adPtpage.savedFiltersButton.click();
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterNamePersist,
          dataset.AuditProcessTemplates4x.filterCategory
        );
        console.log(`Filter "${dataset.AuditProcessTemplates4x.filterNamePersist}" persisted after navigation — verified`);
      });

      await test.step("Delete persistence test filter to clean up", async () => {
        await adPtpage.deleteSavedFilter(dataset.AuditProcessTemplates4x.filterNamePersist);
        await adPtpage.verifyCategoryRemovedFromList(dataset.AuditProcessTemplates4x.filterCategory);
        console.log("Persistence test filter deleted — cleanup complete");
      });

      await test.step("Click Refresh", async () => {
        await adPtpage.clickRefresh();
      });
    }
  );

  test(
    "Audit > Process Templates: Saved Filters panel toggle — collapse and expand",
    async () => {
      await test.step("Create a temp filter for toggle test", async () => {
        await adPtpage.openFilterDialog();
        await adPtpage.fillFilterDetails(
          dataset.AuditProcessTemplates4x.filterNameToggle,
          dataset.AuditProcessTemplates4x.filterDescToggle,
          ""
        );
        await adPtpage.saveFilter();
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterNameToggle,
          dataset.AuditProcessTemplates4x.uncategorized
        );
        console.log(`Toggle test filter "${dataset.AuditProcessTemplates4x.filterNameToggle}" created`);
      });

      await test.step("Click Saved Filters button to collapse the panel", async () => {
        await adPtpage.savedFiltersButton.click();
        console.log("Saved Filters panel collapsed");
      });

      await test.step("Verify filter is not visible when panel is collapsed", async () => {
        await expect(
          page.getByText(dataset.AuditProcessTemplates4x.filterNameToggle, { exact: true }).first(),
          "Filter should not be visible when Saved Filters panel is collapsed"
        ).not.toBeVisible();
        console.log("Panel collapsed — filter hidden, verified");
      });

      await test.step("Click Saved Filters button again to expand", async () => {
        await adPtpage.savedFiltersButton.click();
        console.log("Saved Filters panel expanded");
      });

      await test.step("Verify filter visible again after expanding", async () => {
        await adPtpage.verifySavedFilterInList(
          dataset.AuditProcessTemplates4x.filterNameToggle,
          dataset.AuditProcessTemplates4x.uncategorized
        );
        console.log("Panel expanded — filter visible again, verified");
      });

      await test.step("Delete toggle test filter to clean up", async () => {
        await adPtpage.deleteSavedFilter(dataset.AuditProcessTemplates4x.filterNameToggle);
        await adPtpage.verifyCategoryRemovedFromList(dataset.AuditProcessTemplates4x.uncategorized);
        console.log("Toggle test filter deleted — cleanup complete");
      });
    }
  );
});
