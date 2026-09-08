import { test, Page } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { LoginPage } from "../../PageObjects/LoginPage";
import { AMXBPMUsersResourses } from "../../PageObjects/Audit_startPMandWMPage_4x";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { WorkListPage } from "../../PageObjects/WorkListPage";

const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let loginPage: LoginPage;
let amxbpmPage: AMXBPMUsersResourses;
let cmPage: CaseManagerPage;
let wlPage: WorkListPage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  loginPage = poManager.getLoginPage();
  amxbpmPage = poManager.getAMXBPMUsersResoursesPage();
  cmPage = poManager.getCaseManagerPage();
  wlPage = poManager.getWorkListPage();
});

test.afterAll(async () => {
  await page.close();
});

/** Navigate to Work Manager and guarantee the AMXBPM server is active. */
async function goToWorkManager(): Promise<void> {
  await loginPage.navigateToWorkManagerUrl(dataset.auditWorkManagerUrl);
  await page.waitForLoadState("domcontentloaded");
  await amxbpmPage.ensureServerSelected(dataset.amxbpmServer);
}

/**
 * Shared helper — navigate to Process Manager, expand the audit package,
 * select the audit process, click Start, and verify the new instance row.
 * All locator logic lives in amxbpmPage.startAuditProcess().
 */
async function startProcessInstance(): Promise<void> {
  await test.step("Navigate to Work Manager and ensure server is selected", async () => {
    await goToWorkManager();
  });

  await test.step(
    `Navigate to Process tab, expand "${dataset.projectforAudit}", select "${dataset.projectforAuditProcess}", start and verify instance`,
    async () => {
      await amxbpmPage.startAuditProcess(dataset.projectforAudit, dataset.projectforAuditProcess);
    }
  );
}

/**
 * Shared helper — open AuditDetailsFromUsers work item, fill CarName,
 * optionally select caseState1 (pass "" to leave blank), submit,
 * then open DisplayDataForAudit, assert values carried over, and submit.
 */
async function completeWorkItems(caseState1Value: string): Promise<void> {
  await test.step("Navigate to Work Manager and ensure server is selected", async () => {
    await goToWorkManager();
  });

  await test.step(
    `Open "${dataset.defaultWorkList}" / ${dataset.workItemState}, fill CarName${caseState1Value ? ` and set caseState1 = ${caseState1Value}` : " only (caseState1 blank)"}, then submit`,
    async () => {
      await wlPage.navigateToMyWork();
      await wlPage.openWorkItemByNameAndState(dataset.defaultWorkList, dataset.workItemState, 'last');
      await wlPage.fillTextInIframeForm(dataset.auditFormIframe, "CarName", dataset.carName);
      if (caseState1Value) {
        await wlPage.selectDropdownInIframeForm(dataset.auditFormIframe, "caseState1", caseState1Value);
      }
      await wlPage.submitIframeForm(dataset.auditFormIframe);
      await page.waitForLoadState("domcontentloaded");
    }
  );

  await test.step(
    `Open "${dataset.displayDataWorkList}" / ${dataset.workItemState}, assert CarName and caseState1${caseState1Value ? ` = ${caseState1Value}` : " blank"}, then submit`,
    async () => {
      await wlPage.navigateToMyWork();
      await wlPage.openWorkItemByNameAndState(dataset.displayDataWorkList, dataset.workItemState, 'last');
      await wlPage.assertAnyFrameInputValue(dataset.carName);
      await wlPage.assertIframeFormFieldValue(dataset.displayDataFormIframe, "caseState1", caseState1Value);
      await wlPage.submitAnyIframeForm();
      await page.waitForLoadState("domcontentloaded");
    }
  );
}

test.describe("AMXBPM 4.x Server - Audit Tests", () => {
  test.setTimeout(120000);

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 1 — Login and switch BPM server
  // ─────────────────────────────────────────────────────────────────────────
  test("Login, navigate to Work Manager, switch to AMXBPM 4.x server and verify selection", async () => {
    await test.step("Login with a fresh session (clearCookies forces full auth)", async () => {
      await page.context().clearCookies();
      await loginPage.login(dataset.username1, dataset.password1);
      await page.waitForLoadState("networkidle");
    });

    await test.step(`Switch to server "${dataset.amxbpmServer}" and verify it is selected`, async () => {
      await cmPage.selectServerFromGlobalSwitcher(dataset.amxbpmServer);
      await cmPage.clickOnConfirmServerSelectionBtn();
      await amxbpmPage.assertServerIsSelected(dataset.amxbpmServer);
    });
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 2 — Start first process instance
  // ─────────────────────────────────────────────────────────────────────────
  test("Navigate to Process Manager, select ProjectForAuditProcess and start process instance", async () => {
    await startProcessInstance();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 3 — Complete work items with caseState1 = ORDERED
  // ─────────────────────────────────────────────────────────────────────────
  test("Navigate to Work Manager, go to My Work, fill CarName and set caseState1 = ORDERED and submit both work items", async () => {
    await completeWorkItems(dataset.caseState1Order);
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 4 — Start second process instance
  // ─────────────────────────────────────────────────────────────────────────
  test("Navigate to Process Manager, select ProjectForAuditProcess and start a second process instance", async () => {
    await startProcessInstance();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 5 — Complete work items with caseState1 blank
  // ─────────────────────────────────────────────────────────────────────────
  test("Navigate to Work Manager, go to My Work, fill CarName only (caseState1 blank) and submit both work items", async () => {
    await completeWorkItems("");
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 6 — Start third process instance
  // ─────────────────────────────────────────────────────────────────────────
  test("Navigate to Process Manager, select ProjectForAuditProcess and start a third process instance", async () => {
    await startProcessInstance();
  });

  // ─────────────────────────────────────────────────────────────────────────
  // TEST 7 — Complete work items with caseState1 = CANCELLED
  // ─────────────────────────────────────────────────────────────────────────
  test("Navigate to Work Manager, go to My Work, fill CarName and set caseState1 = CANCELLED and submit both work items", async () => {
    await completeWorkItems(dataset.caseState1Cancelled);
  });

});
