import { test, expect, Page } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { HomePage } from "../../PageObjects/HomePage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { BS5xPage } from "../../PageObjects/BS5xPage";
//Json->string->js object
const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let homePage: HomePage;
let cmPage: CaseManagerPage;
let bsPage: BS5xPage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  homePage = poManager.getHomePage();
  cmPage = poManager.getCaseManagerPage();
  bsPage = poManager.getBS5xPage();
});


test.describe("Pre reqisities: Deployments", () => {
  test("Deploy Rasc for Buiseness service", async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
    //dpendency
    await dmPage.deployRascFiles(dataset.bsFileName, dataset.bsRasc);
    const status = await dmPage.getAppStatus(dataset.bsFileName);
    const type = await dmPage.getAppType(dataset.bsFileName);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Process");
  });
});

test.describe("Buisness Services Regression suite", () => {
  test("Test for buisnes services", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
    //To verify BS header
    expect(await bsPage.verifyBSheader()).toBe("Business Services");
    //To verify presence of refresh icon
    expect(await bsPage.refreshIcon()).toBeVisible();
    //Click on BS All types buisness services
    await bsPage.clickOnBS();
    //To veify presence of Cancel and Submit button
    await Promise.allSettled([
      expect(homePage.cancelBtn).toBeVisible(),
      expect(homePage.submitBtn).toBeVisible(),
    ]);

    //Enter details
    await bsPage.enterAllDetails(
      dataset.buisnessService.text,
      dataset.buisnessService.number,
      dataset.buisnessService.inputDate,
      dataset.buisnessService.time
    );
    (await bsPage.refreshIcon()).click();
    await page.waitForTimeout(500);
    //start bs again
    await bsPage.clickOnBS();
    await expect(bsPage.bsFormHeader).toBeVisible();

    //To verify BS_All types worklist under my work
    await homePage.clickMyWork();
    expect(await homePage.isWorkItemPresent(dataset.bsFileName)).toBeTruthy();
  });

  test("Verify submitted data", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
    // await page.goto(dataset.workMangerUrlApp);
    await homePage.clickMyWork();
    await page.waitForLoadState("domcontentloaded");
    await homePage.openWorklist(dataset.bsFileName);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(1000);
    //To verify the data entered in the form
    expect(await bsPage.textField.inputValue()).toBe(
      dataset.buisnessService.text
    );
    expect(await bsPage.intField.inputValue()).toBe(
      dataset.buisnessService.number
    );
    // expect(await bsPage.dateField.inputValue()).toBe(
    //   dataset.buisnessService.recievedDate
    // );
    await expect(bsPage.booleanFIeld).toBeChecked();
    await bsPage.submitBtn.click();
    //Work item should not be present after submission
    expect(await homePage.isWorkItemPresent(dataset.bsFileName)).toBeFalsy();
  });
});

test.describe("Tear down BS", () => {
  test("Undeploy BS", async () => {
    await page.goto(dataset.adminUrl);
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
    await adminPage.navigateToDeploymentManager();
    await dmPage.undeployFiles(dataset.bsFileName);
    //await dmPage.logout();
  });
});

test.afterAll(async () => {
  await page.close();
});
