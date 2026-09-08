# Test info

- Name: Buisness Services Regression suite >> Test for buisnes services
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:46:7

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: locator('#f1_TibcoForms').getByText('User Task')
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for locator('#f1_TibcoForms').getByText('User Task')

    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:75:39
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - complementary
  - button "Local server":
    - text: Local server
    - img
  - dialog "Business Services": Business Services BPMTestProject BS_AllTypes BS_simple Exits
  - separator "Resize"
  - text: User Task  myText
  - textbox "myText": Bob
  - text:  myInt 
  - textbox "myInt": "11"
  - text:  myBoolean 
  - checkbox "myBoolean" [checked]
  - text:  myDate
  - table:
    - rowgroup:
      - row "Aug 18, 2026 ":
        - cell "Aug 18, 2026":
          - textbox: Aug 18, 2026
        - cell "":
          - button ""
  - text:  myTime
  - table:
    - rowgroup:
      - row "09:07:29 AM ":
        - cell "09:07:29 AM":
          - textbox: 09:07:29 AM
        - cell "":
          - button ""
  - text:  myDateTime
  - table:
    - rowgroup:
      - row "Aug 18, 2026 02:37:29 PM ":
        - cell "Aug 18, 2026 02:37:29 PM":
          - textbox: Aug 18, 2026 02:37:29 PM
        - cell "":
          - button ""
  - text:  myDecimal 
  - textbox "myDecimal": "12.20"
  - button "Label": Cancel
  - button "Label": Submit
- iframe
```

# Test source

```ts
   1 | import { test, expect, Page } from "@playwright/test";
   2 | import { POManager } from "../../PageObjects/POManager";
   3 | import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
   4 | import { AdministratorPage } from "../../PageObjects/AdministratorPage";
   5 | import { HomePage } from "../../PageObjects/HomePage";
   6 | import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
   7 | import { BS5xPage } from "../../PageObjects/BS5xPage";
   8 | //Json->string->js object
   9 | const dataset = JSON.parse(
   10 |   JSON.stringify(require("../../fixtures/TestData.json"))
   11 | );
   12 |
   13 | let page: Page;
   14 | let poManager: POManager;
   15 | let adminPage: AdministratorPage;
   16 | let dmPage: DeploymentManagerPage;
   17 | let homePage: HomePage;
   18 | let cmPage: CaseManagerPage;
   19 | let bsPage: BS5xPage;
   20 |
   21 | test.beforeAll(async ({ browser }) => {
   22 |   page = await browser.newPage();
   23 |   poManager = new POManager(page);
   24 |   dmPage = poManager.getDMPage();
   25 |   adminPage = poManager.getAdminPage();
   26 |   homePage = poManager.getHomePage();
   27 |   cmPage = poManager.getCaseManagerPage();
   28 |   bsPage = poManager.getBS5xPage();
   29 | });
   30 |
   31 |
   32 | test.describe("Pre reqisities: Deployments", () => {
   33 |   test("Deploy Rasc for Buiseness service", async () => {
   34 |     await page.goto(dataset.adminUrl);
   35 |     await adminPage.navigateToDeploymentManager();
   36 |     //dpendency
   37 |     await dmPage.deployRascFiles(dataset.bsFileName, dataset.bsRasc);
   38 |     const status = await dmPage.getAppStatus(dataset.bsFileName);
   39 |     const type = await dmPage.getAppType(dataset.bsFileName);
   40 |     expect(status).toHaveText(/Deployed/);
   41 |     expect(await type.innerText()).toBe("Process");
   42 |   });
   43 | });
   44 |
   45 | test.describe("Buisness Services Regression suite", () => {
   46 |   test("Test for buisnes services", async () => {
   47 |     await page.goto(dataset.workMangerUrlApp);
   48 |     await page.waitForLoadState("domcontentloaded");
   49 |     await homePage.clickOnBuisnessService();
   50 |     await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
   51 |     await cmPage.clickOnConfirmServerSelectionBtn();
   52 |     //To verify BS header
   53 |     expect(await bsPage.verifyBSheader()).toBe("Business Services");
   54 |     //To verify presence of refresh icon
   55 |     expect(await bsPage.refreshIcon()).toBeVisible();
   56 |     //Click on BS All types buisness services
   57 |     await bsPage.clickOnBS();
   58 |     //To veify presence of Cancel and Submit button
   59 |     await Promise.allSettled([
   60 |       expect(homePage.cancelBtn).toBeVisible(),
   61 |       expect(homePage.submitBtn).toBeVisible(),
   62 |     ]);
   63 |
   64 |     //Enter details
   65 |     await bsPage.enterAllDetails(
   66 |       dataset.buisnessService.text,
   67 |       dataset.buisnessService.number,
   68 |       dataset.buisnessService.inputDate,
   69 |       dataset.buisnessService.time
   70 |     );
   71 |     (await bsPage.refreshIcon()).click();
   72 |     await page.waitForTimeout(500);
   73 |     //start bs again
   74 |     await bsPage.clickOnBS();
>  75 |     await expect(bsPage.bsFormHeader).toBeVisible();
      |                                       ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
   76 |
   77 |     //To verify BS_All types worklist under my work
   78 |     await homePage.clickMyWork();
   79 |     expect(await homePage.isWorkItemPresent(dataset.bsFileName)).toBeTruthy();
   80 |   });
   81 |
   82 |   test("Verify submitted data", async () => {
   83 |     // await page.goto(dataset.workMangerUrlApp);
   84 |     await homePage.clickMyWork();
   85 |     await page.waitForLoadState("domcontentloaded");
   86 |     await homePage.openWorklist(dataset.bsFileName);
   87 |     await page.waitForLoadState("domcontentloaded");
   88 |     await page.waitForTimeout(1000);
   89 |     //To verify the data entered in the form
   90 |     expect(await bsPage.textField.inputValue()).toBe(
   91 |       dataset.buisnessService.text
   92 |     );
   93 |     expect(await bsPage.intField.inputValue()).toBe(
   94 |       dataset.buisnessService.number
   95 |     );
   96 |     // expect(await bsPage.dateField.inputValue()).toBe(
   97 |     //   dataset.buisnessService.recievedDate
   98 |     // );
   99 |     await expect(bsPage.booleanFIeld).toBeChecked();
  100 |     await bsPage.submitBtn.click();
  101 |     //Work item should not be present after submission
  102 |     expect(await homePage.isWorkItemPresent(dataset.bsFileName)).toBeFalsy();
  103 |   });
  104 | });
  105 |
  106 | test.describe("Tear down BS", () => {
  107 |   test("Undeploy BS", async () => {
  108 |     await page.goto(dataset.adminUrl);
  109 |     await page.waitForLoadState("domcontentloaded");
  110 |     await page.waitForTimeout(2000);
  111 |     await adminPage.navigateToDeploymentManager();
  112 |     await dmPage.undeployFiles(dataset.bsFileName);
  113 |     //await dmPage.logout();
  114 |   });
  115 | });
  116 |
  117 | test.afterAll(async () => {
  118 |   await page.close();
  119 | });
  120 |
```