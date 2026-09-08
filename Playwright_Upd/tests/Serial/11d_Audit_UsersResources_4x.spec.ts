import { test, expect, Page } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { LoginPage } from "../../PageObjects/LoginPage";
import { AMXBPMUsersResourses } from "../../PageObjects/Audit_startPMandWMPage_4x";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { AuditUsersResourcesPage } from "../../PageObjects/Audit_UsersResourcesPage_4x";

const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let loginPage: LoginPage;
let amxbpmPage: AMXBPMUsersResourses;
let cmPage: CaseManagerPage;
let urPage: AuditUsersResourcesPage;

test.beforeAll(async ({ browser }) => {
  test.setTimeout(120000);
  page = await browser.newPage();
  poManager = new POManager(page);
  loginPage = poManager.getLoginPage();
  amxbpmPage = poManager.getAMXBPMUsersResoursesPage();
  cmPage = poManager.getCaseManagerPage();
  urPage = new AuditUsersResourcesPage(page);

  // Login and switch server once for the entire suite
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

async function goToWorkManager(): Promise<void> {
  const currentUrl = page.url();
  const isLoggedIn = await loginPage.isUserLoggedIn().catch(() => false);

  if (!isLoggedIn) {
    await loginPage.login(dataset.username1, dataset.password1);
  }

  if (!currentUrl.includes(dataset.auditWorkManagerUrl)) {
    await loginPage.navigateToWorkManagerUrl(dataset.auditWorkManagerUrl);
    await page.waitForLoadState("domcontentloaded");
  }

  await amxbpmPage.ensureServerSelected(dataset.amxbpmServer);
}

test.describe("AMXBPM 4.x Server - Audit Users/Resources Tests", () => {
  test.setTimeout(120000);

  test(
    "Audit > Users/Resources: Navigate to Audit, click Users/Resources — verify page loads",
    async () => {
      await test.step("Navigate to Audit section and click Users/Resources", async () => {
        await urPage.navigateToUsersResources();
      });

      await test.step("Verify Users/Resources page is loaded — table visible", async () => {
        await urPage.verifyPageLoaded();
      });
    }
  );

  test(
    "Audit > Users/Resources: verify column headers match expected list",
    async () => {
      await test.step("Navigate to Users/Resources", async () => {
        await goToWorkManager();
        await urPage.navigateToUsersResources();
      });

      await test.step("Verify all column headers match expected columns", async () => {
        const headers = await urPage.getColumnHeaders();
        console.log(`Users/Resources headers: [${headers.join(", ")}]`);
        expect(headers).toStrictEqual(dataset.AuditUsersResources4x.expectedHeaders);
      });
    }
  );

  test(
    "Audit > Users/Resources: click Refresh button — verify table reloads",
    async () => {
      await test.step("Click Refresh button", async () => {
        await urPage.clickRefresh();
      });

      await test.step("Verify table reloads after Refresh", async () => {
        await urPage.verifyPageLoaded();
        console.log("Refresh completed — table reloaded");
      });
    }
  );

  test(
    "Audit > Users/Resources: click first row — verify audit details table loads",
    async () => {
      await test.step("Click first row to drill into audit events", async () => {
        await urPage.drillIntoFirstRow();
      });

      await test.step("Verify audit details page loads with event columns", async () => {
        const auditHeaders = await urPage.verifyAuditDetailsLoaded();
        console.log(`Audit details headers: [${auditHeaders.join(", ")}]`);
      });
    }
  );

  test(
    "Audit > Users/Resources: audit details — verify Event ID, Message ID, Severity columns present",
    async () => {
      await test.step("Verify audit event table has required columns", async () => {
        const headers = await urPage.verifyAuditEventColumns();
        console.log(`Audit event columns: [${headers.join(", ")}]`);
        expect(headers).toContain("Event ID");
        expect(headers).toContain("Message ID");
        expect(headers).toContain("Severity");
      });
    }
  );

  test(
    "Audit > Users/Resources: drill into Message ID — verify Event Details panel opens",
    async () => {
      let auditHeaders: string[] = [];
      let eventId = "";
      let messageId = "";

      await test.step("Read first audit event row — capture Event ID and Message ID", async () => {
        auditHeaders = await urPage.verifyAuditEventColumns();
        const result = await urPage.readFirstAuditEventRow(auditHeaders);
        eventId = result.eventId;
        messageId = result.messageId;
        console.log(`Event ID: ${eventId}, Message ID: ${messageId}, Severity: ${result.severity}`);
      });

      await test.step("Click Message ID cell — navigate to Audit details page", async () => {
        await urPage.drillIntoMessageId(auditHeaders);
      });

      let detailHeaders: string[] = [];

      await test.step("Verify Audit details page — Event ID present", async () => {
        const result = await urPage.verifyAuditDetailsPage();
        detailHeaders = result.detailHeaders;
        console.log(`Audit details headers: [${detailHeaders.join(", ")}]`);
      });

      await test.step("Click Message ID in Audit details — open Event Details panel", async () => {
        await urPage.openEventDetailsPanel(detailHeaders);
      });

      await test.step("Verify Event Details panel heading matches Event ID and Message ID", async () => {
        await urPage.verifyEventDetailsPanel(eventId, messageId);
        console.log(`Event Details opened — Event ID: ${eventId}, Message ID: ${messageId}`);
      });
    }
  );

  test(
    "Audit > Users/Resources: Event Details panel — verify All Attributes section, loop through all events via Next",
    async () => {
      test.setTimeout(300000);

      await test.step("Verify All Attributes for first event, then click Next through all remaining events until last", async () => {
        await urPage.loopThroughAllEventDetails();
      });

      await test.step("Close Event Details panel", async () => {
        await urPage.closeEventDetailsDialog();
      });
    }
  );

  test(
    "Audit > Users/Resources: navigate back to Users/Resources list — verify page loads",
    async () => {
      await test.step("Navigate back to Users/Resources page", async () => {
        await urPage.navigateBackToUsersResources();
      });

      await test.step("Verify Users/Resources page reloaded — table visible", async () => {
        await urPage.verifyPageLoaded();
        console.log("Back on Users/Resources page — verified");
      });
    }
  );

  test(
    "Audit > Users/Resources: open filter dialog — verify filter attribute options match column headers",
    async () => {
      let tableHeaders: string[] = [];

      await test.step("Navigate to Audit > Users/Resources and capture column headers", async () => {
        await goToWorkManager();
        await urPage.navigateToUsersResources();
        tableHeaders = await urPage.getColumnHeaders();
        console.log(`Users/Resources column headers: [${tableHeaders.join(", ")}]`);
      });

      await test.step("Open filter dialog", async () => {
        await urPage.openFilterDialog();
      });

      await test.step("Verify filter attribute dropdown options match column headers, then cancel", async () => {
        await urPage.verifyFilterAttributesMatchHeaders(tableHeaders);
        await urPage.cancelFilter();
      });
    }
  );

  test(
    "Audit > Users/Resources: create filter — fill Name + Description + rule, save",
    async () => {
      await test.step("Open filter dialog", async () => {
        await urPage.openFilterDialog();
      });

      await test.step("Fill filter details", async () => {
        await urPage.fillFilterDetails(
          dataset.AuditUsersResources4x.filterName1,
          dataset.AuditUsersResources4x.filterDesc1,
          dataset.AuditUsersResources4x.filterCategory
        );
      });

      await test.step("Add filter rule", async () => {
        await urPage.addFilterRule(
          dataset.AuditUsersResources4x.filterAttr,
          dataset.AuditUsersResources4x.filterOp,
          dataset.AuditUsersResources4x.filterValue
        );
      });

      await test.step("Save filter", async () => {
        await urPage.saveFilter();
      });

      await test.step("Verify saved filter in list", async () => {
        await urPage.verifySavedFilterInList(
          dataset.AuditUsersResources4x.filterName1,
          dataset.AuditUsersResources4x.filterCategory
        );
        console.log(`Filter "${dataset.AuditUsersResources4x.filterName1}" saved and visible in list`);
      });
    }
  );

  test(
    "Audit > Users/Resources: click saved filter — verify table data filtered, click Refresh to clear",
    async () => {
      await test.step("Click saved filter and verify filtered table data", async () => {
        await urPage.clickSavedFilterAndVerifyData(dataset.AuditUsersResources4x.filterName1);
        console.log(`Filter "${dataset.AuditUsersResources4x.filterName1}" applied — data verified`);
      });

      await test.step("Click Refresh — clear active filter and reload all data", async () => {
        await urPage.clickRefresh();
        await urPage.verifyPageLoaded();
        console.log("Refresh clicked — filter cleared, all data reloaded");
      });
    }
  );

  test(
    "Audit > Users/Resources: edit saved filter — change rule value, save",
    async () => {
      await test.step("Verify filter is visible in saved filters list", async () => {
        await urPage.verifySavedFilterInList(
          dataset.AuditUsersResources4x.filterName1,
          dataset.AuditUsersResources4x.filterCategory
        );
      });

      await test.step("Open edit dialog for saved filter", async () => {
        await urPage.openSavedFilterEditDialog(dataset.AuditUsersResources4x.filterName1);
      });

      await test.step("Change rule value and save", async () => {
        await urPage.changeRuleValueAndSave(dataset.AuditUsersResources4x.filterValueUpdated);
      });

      await test.step("Click saved filter and verify updated data", async () => {
        await urPage.clickSavedFilterAndVerifyData(dataset.AuditUsersResources4x.filterName1);
        console.log(`Filter "${dataset.AuditUsersResources4x.filterName1}" updated and applied`);
      });

      await test.step("Click Refresh to clear filter", async () => {
        await urPage.clickRefresh();
      });
    }
  );

  test(
    "Audit > Users/Resources: delete saved filter — verify removed from list",
    async () => {
      await test.step("Verify filter is visible", async () => {
        await urPage.verifySavedFilterInList(
          dataset.AuditUsersResources4x.filterName1,
          dataset.AuditUsersResources4x.filterCategory
        );
      });

      await test.step("Delete saved filter and confirm", async () => {
        await urPage.deleteSavedFilter(dataset.AuditUsersResources4x.filterName1);
        console.log(`Filter "${dataset.AuditUsersResources4x.filterName1}" deleted`);
      });

      await test.step("Verify filter is no longer in list", async () => {
        await urPage.verifyCategoryRemovedFromList(dataset.AuditUsersResources4x.filterCategory);
        console.log(`Category "${dataset.AuditUsersResources4x.filterCategory}" removed from list`);
      });
    }
  );

  test(
    "Audit > Users/Resources: create filter without category — verify under UNCATEGORIZED",
    async () => {
      await test.step("Navigate to Audit > Users/Resources", async () => {
        await goToWorkManager();
        await urPage.navigateToUsersResources();
      });

      await test.step("Open filter dialog", async () => {
        await urPage.openFilterDialog();
      });

      await test.step("Fill filter details without category", async () => {
        await urPage.fillFilterDetails(
          dataset.AuditUsersResources4x.filterNameNoCategory,
          dataset.AuditUsersResources4x.filterDescNoCategory,
          ""
        );
      });

      await test.step("Add filter rule", async () => {
        await urPage.addFilterRule(
          dataset.AuditUsersResources4x.filterAttr,
          dataset.AuditUsersResources4x.filterOp,
          dataset.AuditUsersResources4x.filterValue
        );
      });

      await test.step("Save filter", async () => {
        await urPage.saveFilter();
      });

      await test.step("Verify filter appears under UNCATEGORIZED", async () => {
        await urPage.verifySavedFilterInList(
          dataset.AuditUsersResources4x.filterNameNoCategory,
          dataset.AuditUsersResources4x.uncategorized
        );
        console.log(`Filter "${dataset.AuditUsersResources4x.filterNameNoCategory}" visible under UNCATEGORIZED`);
      });
    }
  );

  test(
    "Audit > Users/Resources: delete UNCATEGORIZED filter — verify category removed",
    async () => {
      await test.step("Delete UNCATEGORIZED filter", async () => {
        await urPage.deleteSavedFilter(dataset.AuditUsersResources4x.filterNameNoCategory);
      });

      await test.step("Verify UNCATEGORIZED category removed", async () => {
        await urPage.verifyCategoryRemovedFromList(dataset.AuditUsersResources4x.uncategorized);
        console.log("UNCATEGORIZED category removed from list — verified");
      });

      await test.step("Click Refresh", async () => {
        await urPage.clickRefresh();
      });
    }
  );

  test(
    "Audit > Users/Resources: filter Name empty — Save button disabled",
    async () => {
      await test.step("Navigate to Audit > Users/Resources", async () => {
        await goToWorkManager();
        await urPage.navigateToUsersResources();
      });

      await test.step("Open filter dialog", async () => {
        await urPage.openFilterDialog();
      });

      await test.step("Verify Save button is disabled when Name is empty", async () => {
        await expect(
          urPage.saveFilterBtn,
          "Save button should be disabled when Name field is empty"
        ).toBeDisabled();
        console.log("Save button disabled with empty Name — verified");
      });

      await test.step("Cancel filter dialog", async () => {
        await urPage.cancelFilter();
      });
    }
  );
});
