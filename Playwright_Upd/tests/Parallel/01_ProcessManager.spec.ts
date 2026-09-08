import { test, expect, request, Page, chromium } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import * as utility from "../../fixtures/utility";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { ProcessPage } from "../../PageObjects/ProcessPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { HomePage } from "../../PageObjects/HomePage";

//Json->string->js object
const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let processPage: ProcessPage;
let homePage: HomePage;
let cmPage: CaseManagerPage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  processPage = poManager.getProcessPage();
  homePage = poManager.getHomePage();
  cmPage = poManager.getCaseManagerPage();
});

test("Deploy rasc", async () => {
  await page.goto(dataset.adminUrl);
  await adminPage.navigateToDeploymentManager();
  await dmPage.deployRascFiles(dataset.array002fileName, dataset.array002Rasc);
  const status = await dmPage.getAppStatus(dataset.array002fileName);
  const type = await dmPage.getAppType(dataset.array002fileName);
  expect(status).toHaveText(/Deployed/);
  expect(await type.innerText()).toBe("Process");
});

test("Process Manager Test", async () => {
  await page.goto(dataset.workMangerUrlApp);
  await page.waitForLoadState("domcontentloaded");
  await homePage.clickOnBuisnessService();
  await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
  await cmPage.clickOnConfirmServerSelectionBtn();
  await processPage.naviagteToProcessTab();

  await expect(processPage.header).toBeVisible();
  await expect(processPage.findInstancesButton).toBeVisible();
  await expect(processPage.startButton).toBeDisabled();

  //start the process
  await processPage.startProcess("ProcessPackage", "Array002");

  //State filter validations
  await processPage.filterByState("Active");
  expect(await processPage.filterTag.innerText()).toBe("ACTIVE");

  //other filter --suspended -->

  //Coloumn validations
  await processPage.coloumnSelector.click();

  const columnValues = await processPage.getColoumnValues();
  expect(columnValues).toStrictEqual(dataset.process.processHeader);
  await page.waitForTimeout(1000);

  // Click on Process Instance ID
  await processPage.procesInstanceId().click();
  await page.waitForTimeout(1000);

  // To verify Process Instance ID is Unchecked
  await expect(processPage.procesInstanceId()).toHaveAttribute(
    "aria-checked",
    "false"
  );

  const tableHeader = await processPage.getTableHeader();
  expect(tableHeader).not.toContain("Process Instance ID");
});

test("Verify no Process Instance is available in the process view", async () => {
  await page.goto(dataset.workMangerUrl);
  await processPage.naviagteToProcessTab();
  await processPage.clickOnProcess("Array002");
  //Array001
  expect(await processPage.getEmptyMsg()).toBe("No instances to display");

  // expect(await processPage.noProcessInstanceText.innerText()).toBe(
  //   "No Process Instances available"
  // );
});

test("Purge process and undeploy", async () => {
  await page.goto(dataset.adminUrl);
  await adminPage.navigateToDeploymentManager();
  //Purge oder sample order process
  await dmPage.purgeProcess(dataset.array002fileName);
  //Undeploying proj
  await dmPage.undeployFiles(dataset.array002fileName);
});
//await page.getByRole("button", { name: "Clear all filters" }).click();
