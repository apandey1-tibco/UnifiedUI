# Test info

- Name: Tear down BS >> Undeploy BS
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:108:7

# Error details

```
Error: page.goto: Target page, context or browser has been closed
Call log:
  - navigating to "http://10.64.197.35/apps/admin/#/homepage", waiting until "load"

    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:109:16
```

# Test source

```ts
   9 | //Json->string->js object
   10 | const dataset = JSON.parse(
   11 |   JSON.stringify(require("../../fixtures/TestData.json"))
   12 | );
   13 |
   14 | let page: Page;
   15 | let poManager: POManager;
   16 | let adminPage: AdministratorPage;
   17 | let dmPage: DeploymentManagerPage;
   18 | let homePage: HomePage;
   19 | let cmPage: CaseManagerPage;
   20 | let bsPage: BSPage;
   21 |
   22 | test.beforeAll(async ({ browser }) => {
   23 |   page = await browser.newPage();
   24 |   poManager = new POManager(page);
   25 |   dmPage = poManager.getDMPage();
   26 |   adminPage = poManager.getAdminPage();
   27 |   homePage = poManager.getHomePage();
   28 |   cmPage = poManager.getCaseManagerPage();
   29 |   bsPage = poManager.getBSPage();
   30 | });
   31 |
   32 |
   33 | test.describe("Pre reqisities: Deployments", () => {
   34 |   test("Deploy Rasc for Buiseness service", async () => {
   35 |     await page.goto(dataset.adminUrl);
   36 |     await adminPage.navigateToDeploymentManager();
   37 |     //dpendency
   38 |     await dmPage.deployRascFiles(dataset.bsFileName, dataset.bsRasc);
   39 |     const status = await dmPage.getAppStatus(dataset.bsFileName);
   40 |     const type = await dmPage.getAppType(dataset.bsFileName);
   41 |     expect(status).toHaveText(/Deployed/);
   42 |     expect(await type.innerText()).toBe("Process");
   43 |   });
   44 | });
   45 |
   46 | test.describe("Buisness Services Regression suite", () => {
   47 |   test("Test for buisnes services", async () => {
   48 |     await page.goto(dataset.workMangerUrlApp);
   49 |     await page.waitForLoadState("domcontentloaded");
   50 |     await homePage.clickOnBuisnessService();
   51 |     await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
   52 |     await cmPage.clickOnConfirmServerSelectionBtn();
   53 |     //To verify BS header
   54 |     expect(await bsPage.verifyBSheader()).toBe("Business Services");
   55 |     //To verify presence of refresh icon
   56 |     expect(await bsPage.refreshIcon()).toBeVisible();
   57 |     //Click on BS All types buisness services
   58 |     await bsPage.clickOnBS();
   59 |     //To veify presence of Cancel and Submit button
   60 |     await Promise.allSettled([
   61 |       expect(homePage.cancelBtn).toBeVisible(),
   62 |       expect(homePage.submitBtn).toBeVisible(),
   63 |     ]);
   64 |
   65 |     //Enter details
   66 |     await bsPage.enterAllDetails(
   67 |       dataset.buisnessService.text,
   68 |       dataset.buisnessService.number,
   69 |       dataset.buisnessService.inputDate,
   70 |       dataset.buisnessService.time
   71 |     );
   72 |     (await bsPage.refreshIcon()).click();
   73 |     await page.waitForTimeout(500);
   74 |     //start bs again
   75 |     await bsPage.clickOnBS();
   76 |     await expect(bsPage.bsFormHeader).toBeVisible();
   77 |
   78 |     //To verify BS_All types worklist under my work
   79 |     await homePage.clickMyWork();
   80 |     expect(await homePage.isWorkItemPresent(dataset.bsFileName)).toBeTruthy();
   81 |   });
   82 |
   83 |   test("Verify submitted data", async () => {
   84 |     // await page.goto(dataset.workMangerUrlApp);
   85 |     // await homePage.clickMyWork();
   86 |     // await page.waitForLoadState("domcontentloaded");
   87 |     await homePage.openWorklist(dataset.bsFileName);
   88 |     await page.waitForLoadState("domcontentloaded");
   89 |     await page.waitForTimeout(1000);
   90 |     //To verify the data entered in the form
   91 |     expect(await bsPage.textField.inputValue()).toBe(
   92 |       dataset.buisnessService.text
   93 |     );
   94 |     expect(await bsPage.intField.inputValue()).toBe(
   95 |       dataset.buisnessService.number
   96 |     );
   97 |     // expect(await bsPage.dateField.inputValue()).toBe(
   98 |     //   dataset.buisnessService.recievedDate
   99 |     // );
  100 |     await expect(bsPage.booleanFIeld).toBeChecked();
  101 |     await bsPage.submitBtn.click();
  102 |     //Work item should not be present after submission
  103 |     expect(await homePage.isWorkItemPresent(dataset.bsFileName)).toBeFalsy();
  104 |   });
  105 | });
  106 |
  107 | test.describe("Tear down BS", () => {
  108 |   test("Undeploy BS", async () => {
> 109 |     await page.goto(dataset.adminUrl);
      |                ^ Error: page.goto: Target page, context or browser has been closed
  110 |     await page.waitForLoadState("domcontentloaded");
  111 |     await page.waitForTimeout(2000);
  112 |     await adminPage.navigateToDeploymentManager();
  113 |     await dmPage.undeployFiles(dataset.bsFileName);
  114 |     //await dmPage.logout();
  115 |   });
  116 | });
  117 |
  118 | test.afterAll(async () => {
  119 |   await page.close();
  120 | });
  121 |
```