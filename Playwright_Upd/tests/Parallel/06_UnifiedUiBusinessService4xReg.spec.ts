import { test, expect, Page } from "@playwright/test";
import { getCurrentDate, getRandomSixDigitNumber } from "../../fixtures/utility";
import { POManager } from "../../PageObjects/POManager";
import { HomePage } from "../../PageObjects/HomePage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { BSPage } from "../../PageObjects/BSPage";
import { ConfigurationPage } from "../../PageObjects/ConfigurationPage";
import { UnifiedViewsPage } from "../../PageObjects/UnifiedViewsPage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import { ProcessPage } from "../../PageObjects/ProcessPage";

//Json->string->js object
const dataset = JSON.parse(
    JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let homePage: HomePage;
let cmPage: CaseManagerPage;
let bsPage: BSPage;
let configPage: ConfigurationPage;
let unifiedViewsPage: UnifiedViewsPage;
let wlPage: WorkListPage;
let randomCaseNumber: string;
let processPage: ProcessPage;

test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    poManager = new POManager(page);
    homePage = poManager.getHomePage();
    cmPage = poManager.getCaseManagerPage();
    bsPage = poManager.getBSPage();
    configPage = poManager.getConfigurationPage();
    unifiedViewsPage = poManager.getUnifiedViewsPage();
    wlPage = poManager.getWorkListPage();
    processPage = poManager.getProcessPage();
});

// test.describe("Unified Views Configuration", () => {
//     test("Navigate to Unified Views screen under settings and Register New System", async () => {
//         // Assuming login is handled or page is already authenticated
//         await page.goto(dataset.gasdbWorkManagerUrl);
//         await page.waitForLoadState("domcontentloaded");
//         await homePage.clickOnBuisnessService();

//         // Navigate to Configuration > Unified Views
//         await configPage.clickOnSetting();
//         await configPage.clickOnUnifiedViews();

//         // Verify the Unified Views screen is loaded
//         await expect(page.getByText("Unified views", { exact: true }).first()).toBeVisible();

//         // Click on Register New System button
//         await unifiedViewsPage.clickOnRegisterNewSystem();

//         // Verify the Register your server dialog is visible
//         await expect(page.locator("div[role='dialog']").getByText("Register your server")).toBeVisible();

//         //Fill the Register your system form and submit
//         await unifiedViewsPage.enterSystemName("Test Server Name");

//         //Select System Type from dropdown
//         await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");

//         //Enter System URL
//         await unifiedViewsPage.enterSystemURL("http://gasdbpmqasw2202.dev.tibco.com:8080");

//         //Click on Save button
//         await unifiedViewsPage.clickOnSaveButton();
//         await page.waitForTimeout(3000); // Wait for the system to be registered

//         // Verify success alert is shown after saving
//         await expect(page.locator('twc-alert[variant="success"]')).toContainText('Server saved');

//     });
// });

test.describe("Buisness Services Pageflow(BSPF2) Regression suite", () => {

    test("BPMX-18839 | Verify unsaved form changes trigger a navigation warning alert", async () => {
        test.info().annotations.push({ type: 'testId', description: 'BPMX-18839' });

        await page.goto(dataset.workMangerUrlApp);
        await page.waitForLoadState("domcontentloaded");
        await homePage.clickOnBuisnessService();
        await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
        await cmPage.clickOnConfirmServerSelectionBtn();

        //To verify BS header
        expect(await bsPage.verifyBSheader()).toBe("Business Services");

        //To verify presence of refresh icon
        expect(await bsPage.refreshIcon()).toBeVisible();

        //Click on particular buisness services
        await bsPage.clickOnBusinessService_BSPF2();

        //To veify presence of Cancel and Submit button
        await Promise.all([
            expect(bsPage.cancelBtn).toBeVisible(),
            expect(bsPage.submitBtn).toBeVisible(),
        ]);

        //Update a field
        await bsPage.bspf2TextAtt.clear();
        await bsPage.bspf2TextAtt.fill("Text Field 3");

        await homePage.clickOnBuisnessService();

        // Verify navigation warning dialog and close
        await bsPage.verifyNavigationWarningAndClose();

    });

    test("BPMX-18843 | Verify that Submitting buisness services works correctly", async () => {
        test.info().annotations.push({ type: 'testId', description: 'BPMX-18843' });

        await homePage.clickOnBuisnessService();
        await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
        await cmPage.clickOnConfirmServerSelectionBtn();

        //To verify BS header
        expect(await bsPage.verifyBSheader()).toBe("Business Services");

        //To verify presence of refresh icon
        expect(await bsPage.refreshIcon()).toBeVisible();

        //Click on particular buisness services
        await bsPage.clickOnBusinessService_BSPF2();

        //To veify presence of Cancel and Submit button
        await Promise.all([
            expect(bsPage.cancelBtn).toBeVisible(),
            expect(bsPage.submitBtn).toBeVisible(),
        ]);

        // Verify BSPF2 form fields using data from TestData.json
        await bsPage.verifyBSPF2Form(dataset.bspf2);

        //Submit the BSPF2 form
        await bsPage.submitBtn.click();
        await page.waitForTimeout(1000);
    });

    test("BPMX-18840 | Verify no other Business Service loads after a successful submission", async () => {
        test.info().annotations.push({ type: 'testId', description: 'BPMX-18840' });

        await homePage.clickOnBuisnessService();

        //To verify BS header
        expect(await bsPage.verifyBSheader()).toBe("Business Services");

        //To verify presence of refresh icon
        expect(await bsPage.refreshIcon()).toBeVisible();

        //Click on particular buisness services
        await bsPage.clickOnBusinessService_BSAllTypes();

        //To veify presence of Cancel and Submit button
        await Promise.all([
            expect(bsPage.cancelBtn).toBeVisible(),
            expect(bsPage.submitBtn).toBeVisible(),
        ]);

    });

    test("BPMX-18841 | Verify Process Instance is in ACTIVE state", async () => {
        test.info().annotations.push({ type: 'testId', description: 'BPMX-18841' });

        await processPage.naviagteToProcessTab();

        // Click on the process to view details
        await processPage.clickOnProcesses(dataset.bspf2.groupValue, dataset.bspf2.processItemValue);
        await processPage.verifyFirstRowState("ACTIVE");
        await page.waitForTimeout(2000);
    });

    test("Submit Work Item", async () => {

        await homePage.clickMyWork();
        const workItemPage = await wlPage.clickOpenBSPF2WorkItem("Process2UT");
        await workItemPage.waitForTimeout(2000);

        // Verify BSPF2 fields using data from TestData.json
        await wlPage.verifyPInOutClassForm(dataset.bspf2);

        await wlPage.submitLocalDataForm();
        await workItemPage.waitForTimeout(1000);
    });

    test("BPMX-18844 | Verify Business Service Form Opens on Selection", async () => {
        test.info().annotations.push({ type: 'testId', description: 'BPMX-18844' });

        await homePage.clickOnBuisnessService();

        //To verify BS header
        expect(await bsPage.verifyBSheader()).toBe("Business Services");

        //To verify presence of refresh icon
        expect(await bsPage.refreshIcon()).toBeVisible();

        //Click on particular buisness services
        await bsPage.clickOnBusinessService_BSAllTypes();

        //To veify presence of Cancel and Submit button
        await Promise.all([
            expect(bsPage.cancelBtn).toBeVisible(),
            expect(bsPage.submitBtn).toBeVisible(),
        ]);

    });

    test.describe("Buisness Services Pageflow(BSPF1) Regression suite", () => {

        test("BPMX-18842 | Verify BS Pageflow Loads Second Form After Submitting the First", async () => {
            test.info().annotations.push({ type: 'testId', description: 'BPMX-18842' });

            await page.goto(dataset.workMangerUrlApp);
            await page.waitForLoadState("domcontentloaded");
            await homePage.clickOnBuisnessService();
            await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
            await cmPage.clickOnConfirmServerSelectionBtn();

            //To verify BS header
            expect(await bsPage.verifyBSheader()).toBe("Business Services");

            //To verify presence of refresh icon
            expect(await bsPage.refreshIcon()).toBeVisible();

            //Click on particular buisness services
            await bsPage.clickOnBusinessService_BSPF1();

            //To veify presence of Cancel and Submit button
            await Promise.all([
                expect(bsPage.cancelBtn).toBeVisible(),
                expect(bsPage.submitBtn).toBeVisible(),
            ]);

            // Verify BSPF1 form fields using data from TestData.json
            await bsPage.verifyBSPF2Form(dataset.bspf1);

            //Submit the BSPF1 form
            await bsPage.submitBtn.click();
            await page.waitForTimeout(1000);

            // Verify BSPF1 2nd form fields using data from TestData.json
            await bsPage.verifyBSPF1_SecondForm(dataset.bspf1);

            //Submit the BSPF1 form
            await bsPage.submitBtn.click();
            await page.waitForTimeout(1000);

        });

        test("Submit Work Item", async () => {

            await page.goto(dataset.workMangerUrlApp);
            await page.waitForLoadState("domcontentloaded");

            await homePage.clickMyWork();
            await wlPage.sortByStartDateDescending();
            const workItemPage = await wlPage.clickOpenBSPF2WorkItem("ProcessUT");
            await workItemPage.waitForTimeout(2000);

            // Verify BSPF2 fields using data from TestData.json
            await wlPage.verifyPInOutClassForm(dataset.bspf1);

            await wlPage.submitLocalDataForm();
            await workItemPage.waitForTimeout(1000);
        });
    });

    test.describe("Buisness Services Error Message Regression suite", () => {

        test("BPMX-18838 | Verify error message display on the page in Unified UI", async () => {
            test.info().annotations.push({ type: 'testId', description: 'BPMX-18838' });

            await page.goto(dataset.workMangerUrlApp);
            await page.waitForLoadState("domcontentloaded");
            await homePage.clickOnBuisnessService();
            await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
            await cmPage.clickOnConfirmServerSelectionBtn();

            //To verify BS header
            expect(await bsPage.verifyBSheader()).toBe("Business Services");

            //To verify presence of refresh icon
            expect(await bsPage.refreshIcon()).toBeVisible();

            //Click on particular buisness services
            await bsPage.clickOnBusinessService_DbInsert();

            //To veify presence of Cancel and Submit button
            await Promise.all([
                expect(bsPage.cancelBtn).toBeVisible(),
                expect(bsPage.submitBtn).toBeVisible(),
            ]);

            await bsPage.enterDetailsInDbInsertForm(dataset.dbInsert.custId, dataset.dbInsert.custName);

            // Verify error message is displayed on the page
            await bsPage.verifyErrorMessageDialog();
        });
    });
});
