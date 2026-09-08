import { test, expect, Page, Locator } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import * as utility from "../../fixtures/utility";
import * as fs from "fs";
import * as path from "path";
import { APIUtils } from "../../PageObjects/APIUtils";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { HomePage } from "../../PageObjects/HomePage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import { AuditPage } from "../../PageObjects/AuditPage";
import { AuditWorkItemPage } from "../../PageObjects/AuditWorkItemPage";
import { UserResourcesPage } from "../../PageObjects/UserResourcesPage";
import { AuditProcessTemplatesPage } from "../../PageObjects/AuditProcessTemplatesPage";
import { ProcessEnvOptions } from "child_process";
import { ProcessInstancesPage } from "../../PageObjects/ProcessInstancesPage";
import { AuditApplicationsPage } from "../../PageObjects/AuditApplicationsPage";
import { AuditSystemPage } from "../../PageObjects/AuditSystemPage";

const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let cmPage: CaseManagerPage;
let homePage: HomePage;
let wlPage: WorkListPage;
let adPage: AuditPage;
let adworkitempage: AuditWorkItemPage;
let urPage: UserResourcesPage;
let adPrcoessInstacesPage: ProcessInstancesPage;
let api: APIUtils;
let adPtpage: AuditProcessTemplatesPage;
let adAppPage: AuditApplicationsPage;
let adSysPage: AuditSystemPage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  adAppPage = poManager.getApplicationsPage();
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  cmPage = poManager.getCaseManagerPage();
  wlPage = poManager.getWorkListPage();
  homePage = poManager.getHomePage();
  adPage = poManager.getAuditPage();
  adPtpage = poManager.getAuditProcessTemplatesPage();
  adworkitempage = poManager.getAuditWorkItemPage();
  urPage = poManager.getUserResourcesPage();
  adPrcoessInstacesPage = poManager.getAuditPrcoessInstancesPage();
  adSysPage = poManager.getSystemPage();
});

test.describe("Deploy required RASCs files", () => {
  test("Pre requisite deployments for Case Manager", async () => {
    let status: Locator;
    let type: Locator;
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();

    //dpendency
    await dmPage.deployRascFiles(dataset.BDSfileName, dataset.BDSRasc);
    status = await dmPage.getAppStatus(dataset.BDSfileName);
    type = await dmPage.getAppType(dataset.BDSfileName);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Data");
    //case manager
    await dmPage.deployRascFiles(dataset.orderFileName, dataset.orderRasc);
    status = await dmPage.getAppStatus(dataset.orderFileName);
    type = await dmPage.getAppType(dataset.orderFileName);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Process");

    //HaltRetryProject
    await dmPage.deployRascFiles(dataset.HatltedFileName, dataset.HatltedRasc);
    status = await dmPage.getAppStatus(dataset.HatltedFileName);
    type = await dmPage.getAppType(dataset.HatltedFileName);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Process");

    //Starting a process
    await adminPage.navigatetoProcessManager();
    await adminPage.startProcess(dataset.orderFileName);
    await page.waitForTimeout(800);
    await adminPage.startProcess(dataset.HatltedFileName);
  });

  test("Submit the order worklist", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to worklists
    await homePage.clickMyWork();
    await homePage.openWorklist(dataset.orderDetails.wlName);

    //Entering all the details
    await wlPage.enterWorklistDetaisl(
      dataset.orderDetails.orderID,
      dataset.orderDetails.orderState.packed,
      dataset.orderDetails.name,
      dataset.orderDetails.quantity,
      dataset.orderDetails.product,
      dataset.orderDetails.time,
      dataset.orderDetails.date
    );
    await wlPage.submitBtn.click();
    await page.waitForTimeout(800);
  });
});

test.describe("Work Item test", () => {
  test("Verify that navigate to Audit screen and validate all Audit screen options", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await expect.soft(adPage.workItem).toBeVisible();
    await expect.soft(adPage.processInstance).toBeVisible();
    await expect.soft(adPage.cases).toBeVisible();
    await expect.soft(adPage.userResources).toBeVisible();
    await expect.soft(adPage.processTemplates).toBeVisible();
    await expect.soft(adPage.applications).toBeVisible();
    await expect.soft(adPage.system).toBeVisible();
    //expect(await adPage.clickOnWorkItem());
  });

  test("Verify Work item header", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await adPage.navigateToAudit();
    await expect(adPage.workItem).toBeVisible();
    await adPage.clickOnWorkItem();
    await page.waitForTimeout(800);
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.WorkItem.workItemHeader).toStrictEqual(tableHeaderRecieved);
  });

  test("Verify Work item record", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    const expectedDate = utility.formatDate();
    await adPage.navigateToAudit();
    await page.waitForLoadState("domcontentloaded");
    await adPage.clickOnWorkItem();

    // Click add filter
    await urPage.clickOnFilter();
    await urPage.clickOnStateFilter();

    //Create and Save new filter for which state is OFFERED
    await urPage.createNewFilter(dataset.Audit.filter.offered);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).toBeVisible();

    //Validating row contain OFFERED state
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.workItemRow.ActivityName
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.workItemRow.State
    );

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });

  test("Verify Event Detail screen header", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await adworkitempage.clickonWorkItemRecord();
    await page.waitForTimeout(2000);
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.WorkItem.WorkItemAuditDetailsHeader).toStrictEqual(
      tableHeaderRecieved
    );
  });

  test("Navigate to Work item Event Detail page and validate row", async () => {
    await page.goto(dataset.workMangerUrlApp);
    const expectedDate = utility.formatDate();
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await adworkitempage.clickonInputNum1andNum2();
    await page.waitForTimeout(2000);
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.WorkItemAuditDetails.Severity
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.WorkItemAuditDetails.PrincipalID
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.WorkItemAuditDetails.AppActivityName
    );
  });

  test("Validate of Related Work Item screen Header and row", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await adworkitempage.navigatetoRelatedWorkItem();
    await page.goBack();
    await adworkitempage.navigatetoRelatedWorkItem();
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.WorkItem.workItemHeader).toStrictEqual(tableHeaderRecieved);
    expect(adworkitempage.relatedCases).toBeVisible();
  });

  test("Verify All attribute and Additional attribute section", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await adworkitempage.clickonInputNum1andNum2();
    await adworkitempage.clickonWorkItemRecord();
    await expect(adworkitempage.allAttributeSection).toBeVisible();
    await adworkitempage.clickonAddtionAttributeSection();
    await expect(adworkitempage.additionAttributeSection).toBeVisible();
  });

  test("Validate no related cases present for work item", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await adworkitempage.navigatetoRelatedWorkItem();
    await adworkitempage.clickonRelatedCases();
    expect(
      await adworkitempage.validateAlertText("No reference case available")
    );
  });

  test("Verify work item Column test", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    //user resources
    const tableHeadersArray = await utility.tableHeader(page);
    await urPage.clickOnCOlumn();

    //To Verify coloumn Headers
    expect(await (await cmPage.caseColoumHeader()).innerText()).toContain(
      dataset.Audit.coloumn.header
    );
    expect(await cmPage.availableColoumnHeader()).toBeVisible();
    expect(await cmPage.selectedColoumnHeader()).toBeVisible();
    expect(await cmPage.getAvailableColoumnTextContents()).toEqual(
      await cmPage.getSelectedColoumnTextContent()
    );

    //To verify coloumn search functionality by searching "Display Name"
    await cmPage.verifySelectColoumnFromSearch(dataset.ColumnSelector.PID);
    //To verify display name is present in selected column
    expect(await cmPage.getSelectedColoumnTextContent()).toContain(
      dataset.ColumnSelector.PID
    );
    //To reorder coloumns by moving Name to first
    await cmPage.selectActivityNameColoumn();
    await cmPage.clickUpArrow();
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    const newHeader = await utility.tableHeader(page);
    expect(newHeader[0]).not.toBe(tableHeadersArray[0]);
    //To verify first heading should be Name
    expect(newHeader[0]).toBe(dataset.ColumnSelector.ActivityName);
    //To verify Display Name should be present under heading
    expect(newHeader.includes(dataset.ColumnSelector.PID)).toBeTruthy();
    /* To  remove first coloumn i.e; Name from selected coloumns 
    by clicking x icon on selected columns tab */
    await (await cmPage.caseColoumnIcon()).click();
    await (await cmPage.searchColoumn()).clear();
    await cmPage.clickkOnCloseIcon();
    //To verify Name is removed from Selected Coloumns tab
    expect(await cmPage.getSelectedColoumnTextContent()).not.toBe(
      dataset.ColumnSelector.ActivityName
    );
    //To verify Name is unchecked from Available Coloumns tab
    expect(await cmPage.activityNameCheckBox()).toHaveAttribute(
      "aria-checked",
      "false"
    );
    //Apply changes
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    //To verify Name is not present under table headers
    expect(await cmPage.getTableHeader()).not.toStrictEqual(
      dataset.ColumnSelector.ActivityName
    );
  });

  test("Create, Duplicate Filter test", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    // Click add filter
    await urPage.clickOnFilter();
    //Filter Header Validations
    expect(await urPage.getFilterTitle()).toBe(dataset.Audit.filter.title);
    expect(await urPage.getFilterSubTitle()).toBe(
      dataset.Audit.filter.subtitle
    );

    //Buttons;
    await expect(await urPage.applyFilterBtn()).toBeVisible();
    //await expect(await urPage.resetAllBtn()).toBeVisible();
    await urPage.clickOnStateFilter();
    expect(await urPage.clearFilterBtn()).toBeVisible();

    //Create and Save new filter
    await urPage.createNewFilter(dataset.Audit.filter.offered);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).toBeVisible();
    //To verify created filter functionality
    (
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).click();
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.Audit.filter.offered
    );

    //Duplicate Filter
    await urPage.clickOnFilter();
    await urPage.clickOnStateFilter();
    await urPage.createNewFilter(dataset.Audit.filter.offered);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    //Alert dialog validation for duplicate entry
    await urPage.alertDialogValidations();
    (await urPage.dismissBtn()).click();
    await page.waitForTimeout(500);
    await page.reload();
    // await urPage.clickOnCancel();
    // (await urPage.backToFilters()).click();
    // await page.waitForTimeout(800);
  });

  test("Edit, Delete filter test", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    //Click on 3 dots
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    //Edit filter
    await (await urPage.editFilter()).click();
    await page.waitForTimeout(1000);
    //Changing State to CREATED and Validating
    await urPage.clickOnStateFilter();
    await urPage.createNewFilter(dataset.Audit.filter.failed);

    expect(await urPage.filterLabel()).toContain(dataset.Audit.filter.failed);

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await urPage.deleteFilterDialogValidation();

    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });
});

test.describe("Process Instaces test", () => {
  test("Verify Prcoess Instances header", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await expect(adPage.processInstance).toBeVisible();
    await adPage.clickOnProcessInstance();
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.PrcoessInstance.PrcoessInstanceHeader).toStrictEqual(
      tableHeaderRecieved
    );
  });

  test("Validate Process Instances record", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await adPage.navigateToAudit();
    await expect(adPage.workItem).toBeVisible();
    await adPage.clickOnProcessInstance();

    // Click add filter
    await urPage.clickOnFilter();
    await urPage.clickOnStateFilter();

    //Create and Save new filter
    await urPage.createNewFilter(dataset.Audit.filter.started);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).toBeVisible();

    //Validating row contain OFFERED state
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.processinstanceRow.Priority
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.processinstanceRow.User
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.processinstanceRow.State
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.processinstanceRow.EventLinks
    );

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });

  test("Verify Even Detail screen header", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    await adPrcoessInstacesPage.clickonPrcoessInstancesRecord();
    await page.waitForTimeout(2000);
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.WorkItem.WorkItemAuditDetailsHeader).toStrictEqual(
      tableHeaderRecieved
    );
  });

  test("Navigate to Process Instance Event Detail page and validate row", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    await adPrcoessInstacesPage.clickonStartedPrcoess();
    await page.waitForTimeout(2000);
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.piAuditDetails.Severity
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.piAuditDetails.PrincipalID
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.piAuditDetails.AppActivityName
    );
  });

  test("Verify All attribute & Additional attribute section", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    await adworkitempage.clickonWorkItemRecord();
    await page.waitForTimeout(2000);
    await adworkitempage.clickonWorkItemRecord();
    await page.waitForTimeout(2000);
    await expect(adworkitempage.allAttributeSection).toBeVisible();
    await adworkitempage.clickonAddtionAttributeSection();
    await expect(adworkitempage.additionAttributeSection).toBeVisible();
  });

  test("Verify Refrenced Work item record for process", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    await adPrcoessInstacesPage.clickOnRefrenceWorkItems();
    await page.goBack();
    await adPrcoessInstacesPage.clickOnRefrenceWorkItems();
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.WorkItem.workItemHeader).toStrictEqual(tableHeaderRecieved);
    expect(adPrcoessInstacesPage.relatedWorkItems).toBeVisible();
  });

  test("Validate Referenced Processes, Refrenced Cases and Source Process template", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    //Referenced processes
    await adPrcoessInstacesPage.verticalthreeDots.click();
    expect(await adPrcoessInstacesPage.refrencedCases.isDisabled());
    //Referenced Cases
    await adPrcoessInstacesPage.refrencedCases.click();
    expect(
      await adworkitempage.validateAlertText("No reference case available")
    );
    //Source Process Template
    await adPrcoessInstacesPage.verticalthreeDots.click();
    await page.waitForTimeout(1000);
    await expect(adPrcoessInstacesPage.sourceProcessTemplate).toBeVisible();
    // await page.pause();
  });

  test("Verify Process Instance Column test", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    const tableHeadersArray = await utility.tableHeader(page);
    await urPage.clickOnCOlumn();

    //To Verify coloumn Headers
    expect(await (await cmPage.caseColoumHeader()).innerText()).toContain(
      dataset.Audit.coloumn.header
    );
    expect(await cmPage.availableColoumnHeader()).toBeVisible();
    expect(await cmPage.selectedColoumnHeader()).toBeVisible();
    expect(await cmPage.getAvailableColoumnTextContents()).toEqual(
      await cmPage.getSelectedColoumnTextContent()
    );

    //To verify coloumn search functionality by searching "Display Name"
    await cmPage.verifySelectColoumnFromSearch(dataset.ColumnSelector.Type);
    //To verify display name is present in selected column
    expect(await cmPage.getSelectedColoumnTextContent()).toContain(
      dataset.ColumnSelector.Type
    );
    //To reorder coloumns by moving Name to first
    await cmPage.selectPriorityColoumn();
    await cmPage.clickUpArrow();
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    const newHeader = await utility.tableHeader(page);
    expect(newHeader[0]).not.toBe(tableHeadersArray[0]);
    //To verify first heading should be Name
    expect(newHeader[0]).toBe(dataset.ColumnSelector.Priority);
    //To verify Display Name should be present under heading
    expect(newHeader.includes(dataset.ColumnSelector.Type)).toBeTruthy();
    /* To  remove first coloumn i.e; Name from selected coloumns by clicking x icon on selected columns tab */
    await (await cmPage.caseColoumnIcon()).click();
    (await cmPage.searchColoumn()).clear();
    await cmPage.clickkOnCloseIcon();
    //To verify Name is removed from Selected Coloumns tab
    expect(await cmPage.getSelectedColoumnTextContent()).not.toBe(
      dataset.ColumnSelector.Priority
    );
    //To verify Name is unchecked from Available Coloumns tab
    expect(await cmPage.typeCheckBox()).toHaveAttribute("aria-checked", "true");
    //Apply changes
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    //To verify Name is not present under table headers
    expect(await cmPage.getTableHeader()).not.toStrictEqual(
      dataset.ColumnSelector.Priority
    );
  });

  test("should not be able to find instace", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    await adPrcoessInstacesPage.findInstancebutton.click();
    await adPrcoessInstacesPage.fillProcessInstanceID("P0:");
    await adPrcoessInstacesPage.clickReset();
    await adPrcoessInstacesPage.fillProcessInstanceID("P0:1");
    await adPrcoessInstacesPage.clickSearch();
    await expect(adPrcoessInstacesPage.emptyMessage).toHaveText(
      "Audit details does not exist for this ID."
    );
  });

  test("Create,Edit,Duplicate and Delete Filter test", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    // Click add filter
    await urPage.clickOnFilter();
    //Filter Header Validations
    expect(await urPage.getFilterTitle()).toBe(dataset.Audit.filter.title);
    expect(await urPage.getFilterSubTitle()).toBe(
      dataset.Audit.filter.subtitle
    );

    //Buttons;
    await expect(await urPage.applyFilterBtn()).toBeVisible();
    //await expect(await urPage.resetAllBtn()).toBeVisible();
    await urPage.clickOnStateFilter();
    expect(await urPage.clearFilterBtn()).toBeVisible();

    //Create and Save new filter
    await urPage.createNewFilter(dataset.Audit.filter.started);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).toBeVisible();
    //To verify created filter functionality
    (
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).click();
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.Audit.filter.started
    );

    //Duplicate Filter
    await urPage.clickOnFilter();
    await page.waitForTimeout(500);
    await urPage.clickOnStateFilter();
    await urPage.createNewFilter(dataset.Audit.filter.started);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    //Alert dialog validation for duplicate entry
    await urPage.alertDialogValidations();
    (await urPage.dismissBtn()).click();
    await urPage.clickOnCancel();
    (await urPage.backToFilters()).click();

    //Click on 3 dots
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    //Edit filter
    (await urPage.editFilter()).click();
    await page.waitForTimeout(1000);
    //Changing State to CREATED and Validating
    await urPage.clickOnStateFilter();
    await urPage.createNewFilter(dataset.Audit.filter.failed);
    expect(await urPage.filterLabel()).toContain(dataset.Audit.filter.failed);

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });
});

test.describe("Cases test", () => {
  test("Validate header and row for Order cases", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await expect(adPage.cases).toBeVisible();
    await adPage.clickOnCases();
    await cmPage.clickOnCaseOrder();
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.AuditCases.AuditCaseHeader).toStrictEqual(
      tableHeaderRecieved
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.orderDetails.orderID
    );
  });

  test("Case coloumn test", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await expect(adPage.cases).toBeVisible();
    await adPage.clickOnCases();
    await cmPage.clickOnCaseOrder();
    const tableHeaders = await cmPage.getTableHeader();
    await adworkitempage.clickonColumnSelector();

    //To Verify coloumn Headers
    expect(await adworkitempage.columnSelector).toBeVisible();
    expect(await cmPage.availableColoumnHeader()).toBeVisible();
    expect(await cmPage.selectedColoumnHeader()).toBeVisible();
    expect(await cmPage.getAvailableColoumnTextContents()).toEqual(
      await cmPage.getSelectedColoumnTextContent()
    );

    //To verify coloumn search functionality
    await cmPage.verifySelectColoumnFromSearch("OrderState");
    expect(await cmPage.getSelectedColoumnTextContent()).not.toContain(
      "OrderState"
    );
    //To reorder coloumns by moving Name to first
    await cmPage.selectNameColoumn();
    await cmPage.clickUpArrow();
    await (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    const newHeader = await cmPage.getTableHeader();
    expect(newHeader[0]).not.toBe(tableHeaders[0]);
    //To verify first heading should be Name
    expect(newHeader[0]).toBe("Name");
    //To verify order state should not be present under heading
    expect(newHeader).not.toContain("OrderState");

    /* To  remove first coloumn i.e; Name from selected coloumns 
    by clicking x icon on selected columns tab */
    await adworkitempage.clickonColumnSelector();
    (await cmPage.searchColoumn()).clear();
    await cmPage.clickkOnclocseIcon();
    //To verify Name is removed from Selected Coloumns tab
    expect(await cmPage.getSelectedColoumnTextContent()).not.toContain("Name");
    //To verify Name is unchecked from Available Coloumns tab
    expect(await cmPage.nameCheckBox()).toHaveAttribute(
      "aria-checked",
      "false"
    );
    //Apply changes
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    //To verify Name is not present under table headers
    expect(await cmPage.getTableHeader()).not.toContain("Name");
  });

  test("Audit details for Order Cases", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await expect(adPage.cases).toBeVisible();
    await adPage.clickOnCases();
    await cmPage.clickOnCaseOrder();
    await adworkitempage.clickonWorkItemRecord();
    await page.waitForTimeout(2000);

    //Validate Header of Case Event Details
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.AuditCases.caseAuditDetailsHeader).toStrictEqual(
      tableHeaderRecieved
    );

    //Validate row content for date value
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.AuditCases.caseAuditDetailsrow.Severity
    );
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.AuditCases.caseAuditDetailsrow.PrincipalID
    );

    //Open Additional Attribute section
    await adworkitempage.clickonWorkItemRecord();
    await page.waitForTimeout(2000);
    await adworkitempage.clickonAddtionAttributeSection();
    expect(adworkitempage.additionAttributeSection).toBeVisible();
  });
});

test.describe("User/Resource test", () => {
  // test.describe.configure({ mode: "parallel" });
  test.beforeEach(async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await adPage.navigateToAudit();
    await urPage.navigateToUserResources();
    //user resources
  });

  test("Deployment", async () => {
    await page.goto(dataset.adminUrl);
    await page.waitForLoadState("domcontentloaded");
    await adminPage.navigateToDeploymentManager();

    //Org
    await dmPage.deployRascFiles(dataset.OrgName, dataset.OrgRasc);
    const statusOrg = await dmPage.getAppStatus(dataset.OrgName);
    const typeOrg = await dmPage.getAppType(dataset.OrgName);
    expect(statusOrg).toHaveText(/Deployed/);
    expect(await typeOrg.innerText()).toBe("Organization");
  });

  test("Pre: Create a resource through API", async ({ request }) => {
    const api = new APIUtils(request);
    const containerId = await api.createLDAP();

    // Get resource
    const resource_dn = await api.getResource(containerId, "Tony Pulis");

    // Add Resource to container
    const rsponse = await api.addResource(containerId, resource_dn);
    const resourceID = await rsponse[0].id;
    console.log(resourceID);

    //Map rsource
    const a = await api.getOrgIds();
    const groupId = a.groups[0].guid;
    console.log(groupId);
    await page.waitForTimeout(700);
    const map = await api.mapResources(resourceID, groupId);
    console.log(map);

    await expect(map.ok()).toBeTruthy();
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await adPage.navigateToAudit();
    await urPage.navigateToUserResources();
    //User validation
    const rowData = await utility.getFirstRowContents(page);
    expect(rowData.includes("Tony Pulis")).toBeTruthy();
    expect(rowData.includes("CREATED")).toBeTruthy();
    const response = await api.deleteLDAP(containerId);
  });

  test("Verifying UI components of User/Resources", async () => {
    //Headers
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.Audit.header.tableHeader).toStrictEqual(tableHeaderRecieved);

    await urPage.verifyDropdown();
    //Verify headers
    expect(await urPage.getAllUserResourceHeader()).toBeVisible();
    expect(await urPage.getUserResourceHeader()).toBeVisible();
    //Refresh icon
    expect(await urPage.getRefreshIcon()).toBeVisible();
  });

  test("Create New Filter test", async () => {
    // Click add filter
    await urPage.clickOnFilter();
    //Filter Header Validations
    expect(await urPage.getFilterTitle()).toBe(dataset.Audit.filter.title);
    expect(await urPage.getFilterSubTitle()).toBe(
      dataset.Audit.filter.subtitle
    );

    //Buttons;
    await expect(await urPage.applyFilterBtn()).toBeVisible();
    //await expect(await urPage.resetAllBtn()).toBeVisible();
    await urPage.clickOnFilter();
    expect(await urPage.clearFilterBtn()).toBeVisible();

    //Create and Save new filter
    await urPage.createNewFilter(dataset.Audit.filter.deleted);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);
    await (
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).waitFor();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).toBeVisible();
    //To verify created filter functionality
    (
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).click();
    //Chip validation
    expect(await urPage.filterLabel()).toContain(dataset.Audit.filter.deleted);
  });

  test("Duplicate Filter test", async () => {
    //Duplicate entry creation
    await urPage.clickOnFilter();
    await page.waitForTimeout(500);
    await urPage.clickOnFilter();
    await urPage.createNewFilter(dataset.Audit.filter.deleted);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    //Alert dialog validation for duplicate entry
    await urPage.alertDialogValidations();
    (await urPage.dismissBtn()).click();
    await urPage.clickOnCancel();
    // (await urPage.backToFilters()).click();
  });

  test("Edit/ Delete Filter", async () => {
    //Click on 3 dots
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    //Edit filter
    (await urPage.editFilter()).click();
    await page.waitForTimeout(1000);
    //Changing State to CREATED and Validating
    await urPage.clickOnFilter();
    await urPage.createNewFilter(dataset.Audit.filter.created);
    expect(await urPage.filterLabel()).toContain(dataset.Audit.filter.created);

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });

  test("Column test", async () => {
    //user resources
    const tableHeadersArray = await utility.tableHeader(page);
    await urPage.clickOnCOlumn();

    //To Verify coloumn Headers
    expect(await (await cmPage.caseColoumHeader()).innerText()).toContain(
      dataset.Audit.coloumn.header
    );
    expect(await cmPage.availableColoumnHeader()).toBeVisible();
    expect(await cmPage.selectedColoumnHeader()).toBeVisible();
    expect(await cmPage.getAvailableColoumnTextContents()).toEqual(
      await cmPage.getSelectedColoumnTextContent()
    );

    //To verify coloumn search functionality by searching "Display Name"
    await cmPage.verifySelectColoumnFromSearch(
      dataset.Audit.coloumn.displayName
    );
    //To verify display name is present in selected column
    expect(await cmPage.getSelectedColoumnTextContent()).toContain(
      dataset.Audit.coloumn.displayName
    );
    //To reorder coloumns by moving Name to first
    await cmPage.selectNameColoumn();
    await cmPage.clickUpArrow();
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    const newHeader = await utility.tableHeader(page);
    expect(newHeader[0]).not.toBe(tableHeadersArray[0]);
    //To verify first heading should be Name
    expect(newHeader[0]).toBe(dataset.Audit.coloumn.nameColoumn);
    //To verify Display Name should be present under heading
    expect(newHeader.includes(dataset.Audit.coloumn.displayName)).toBeTruthy();
    /* To  remove first coloumn i.e; Name from selected coloumns 
    by clicking x icon on selected columns tab */
    await (await cmPage.caseColoumnIcon()).click();
    (await cmPage.searchColoumn()).clear();
    await cmPage.clickkOnCloseIcon();
    //To verify Name is removed from Selected Coloumns tab
    expect(await cmPage.getSelectedColoumnTextContent()).not.toBe(
      dataset.Audit.coloumn.nameColoumn
    );
    //To verify Name is unchecked from Available Coloumns tab
    expect(await cmPage.nameCheckBox()).toHaveAttribute(
      "aria-checked",
      "false"
    );
    //Apply changes
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    //To verify Name is not present under table headers
    expect(await cmPage.getTableHeader()).not.toStrictEqual(
      dataset.Audit.coloumn.nameColoumn
    );
  });

  test("Undeployments", async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
    await dmPage.undeployFiles(dataset.OrgName);
  });
});

test.describe("Audit-Process Templates test", () => {
  test.beforeEach(async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await adPage.navigateToAudit();
    await adPtpage.navigateToProcessTemplate();
  });

  test("Verifying UI components of Audit->Process Templates", async () => {
    const tableHeaderRecieved = await utility.tableHeader(page);

    expect(dataset.Audit.ptHeader.ptTableHeader).toStrictEqual(
      tableHeaderRecieved
    );
    //Verify selected value in dropdown
    await adPtpage.verifyDropdown();

    //Verify headers
    expect(await adPtpage.getAllProcessTemplatesHeader()).toBeVisible();
    expect(await adPtpage.getProcessTemplatesHeader()).toBeVisible();

    //Refresh icon
    expect(await adPtpage.getRefreshIcon()).toBeVisible();
    expect(await adPtpage.getColumnSelectorIcon()).toBeVisible();

    //Refresh icon
    expect(await adPtpage.getRefreshIcon()).toBeVisible();

    // Column icon
    expect(await adPtpage.caseColoumnIcon()).toBeVisible();
  });

  test("Create New Filter test of Audit->Process Templates", async () => {
    const adprocesstemplatespage = poManager.getAuditProcessTemplatesPage();

    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();

    // validate - Process Templates option on Audit screen
    await expect(adPage.processTemplates).toBeVisible();

    // validate Process Templates header
    await adPage.clickOnProcessTemplates();

    // Click add filter
    await adprocesstemplatespage.clickOnPtFilterIcon();
    expect(await urPage.getFilterTitle()).toBe(dataset.Audit.filter.title);
    expect(await urPage.getFilterSubTitle()).toBe(
      dataset.Audit.filter.subtitle
    );

    //Verify ApplyFilter and ResetAll buttons;
    await expect(await urPage.applyFilterBtn()).toBeVisible();
    //await expect(await urPage.resetAllBtn()).toBeVisible();
    await urPage.clickOnFilter();
    expect(await urPage.clearFilterBtn()).toBeVisible();

    //Create and Save new filter
    await urPage.createNewFilter(dataset.Audit.filter.deployed);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).toBeVisible();

    //To verify created filter functionality
    (
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).click();
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.Audit.filter.deployed
    );
  });

  test("Duplicate Filter test of Audit->Process Templates", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();

    // validate - Process Templates option on Audit screen
    await expect(adPage.processTemplates).toBeVisible();

    // validate Process Templates header
    await adPage.clickOnProcessTemplates();

    // Duplicate entry creation
    await urPage.clickOnFilter();
    await page.waitForTimeout(500);
    await urPage.clickOnFilter();
    await urPage.createNewFilter(dataset.Audit.filter.deployed);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    //Alert dialog validation for duplicate entry
    await urPage.alertDialogValidations();
    (await urPage.dismissBtn()).click();
    await urPage.clickOnCancel();
    (await urPage.backToFilters()).click();
  });

  test("Edit / Delete Filter of Audit->Process Templates", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    //validate - Process Templates option on Audit screen
    await expect(adPage.processTemplates).toBeVisible();

    //validate Process Templates header
    await adPage.clickOnProcessTemplates();

    //Click on 3 dots
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);

    //Edit filter
    (await urPage.editFilter()).click();
    await page.waitForTimeout(1000);

    //Changing State to UNDEPLOYED and Validating
    await urPage.clickOnFilter();
    await urPage.createNewFilter(dataset.Audit.filter.undeployed);
    expect(await urPage.filterLabel()).toContain(
      dataset.Audit.filter.undeployed
    );

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });

  test("Column test of Audit->Process Templates", async () => {
    const adprocesstemplatespage = poManager.getAuditProcessTemplatesPage();
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();

    //validate - Process Templates option on Audit screen
    await expect(adPage.processTemplates).toBeVisible();

    // validate Process Templates header
    await adPage.clickOnProcessTemplates();

    //Validate Process Templates
    const tableHeadersArray = await utility.tableHeader(page);
    await urPage.clickOnCOlumn();

    //To Verify coloumn Headers
    expect(await (await cmPage.caseColoumHeader()).innerText()).toContain(
      dataset.Audit.coloumn.header
    );
    expect(await cmPage.availableColoumnHeader()).toBeVisible();
    expect(await cmPage.selectedColoumnHeader()).toBeVisible();
    expect(await cmPage.getAvailableColoumnTextContents()).toEqual(
      await cmPage.getSelectedColoumnTextContent()
    );

    //To verify coloumn search functionality by searching "Display Name"
    await cmPage.verifySelectColoumnFromSearch(
      dataset.Audit.coloumn.moduleName
    );

    //To verify display name is present in selected column
    expect(await cmPage.getSelectedColoumnTextContent()).toContain(
      dataset.Audit.coloumn.moduleName
    );

    //To reorder coloumns by moving Name to first
    await adprocesstemplatespage.selectStateColoumn();
    await cmPage.clickUpArrow();
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    const newHeader = await utility.tableHeader(page);
    expect(newHeader[0]).not.toBe(tableHeadersArray[0]);

    //To verify first heading should be Name
    expect(newHeader[0]).toBe(dataset.Audit.coloumn.stateColumn);

    //To verify Display Name should be present under heading
    expect(newHeader.includes(dataset.Audit.coloumn.moduleName)).toBeTruthy();

    /* To  remove first coloumn i.e; Name from selected coloumns by clicking x icon on selected columns tab */
    await (await cmPage.caseColoumnIcon()).click();
    (await cmPage.searchColoumn()).clear();
    await cmPage.clickkOnCloseIcon();

    //To verify Name is removed from Selected Coloumns tab
    expect(await cmPage.getSelectedColoumnTextContent()).not.toBe(
      dataset.Audit.coloumn.stateColumn
    );

    //To verify Name is unchecked from Available Coloumns tab
    expect(await adprocesstemplatespage.stateCheckBox()).toHaveAttribute(
      "aria-checked",
      "false"
    );

    //Apply changes
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);

    //To verify Name is not present under table headers
    expect(await cmPage.getTableHeader()).not.toStrictEqual(
      dataset.Audit.coloumn.stateColumn
    );
  });

  test("Verify Process Template > Event Detail screen header of Audit->Process Templates", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessTemplates();
    await adworkitempage.clickonWorkItemRecord();
    await page.waitForTimeout(2000);

    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.ptAuditDetailsHeader.ptAuditDetailsHeaderArr).toStrictEqual(
      tableHeaderRecieved
    );
  });

  test("Verify All attribute and Additional attribute section in Event Detail of Audit->Process Templates", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    adworkitempage.clickonWorkItemRecord();
    await page.waitForTimeout(2000);
    adworkitempage.clickonWorkItemRecord();
    await page.waitForTimeout(2000);
    await adworkitempage.clickonAddtionAttributeSection();
  });

  test("Navigate to Process Template Event Detail page and validate row of Audit->Process Templates", async () => {
    const testDataPath = path.resolve(
      __dirname,
      "../../fixtures/TestData.json"
    );
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
    const ptAuditDetails = testData.ptAuditDetails.ptAuditDetailsArr;

    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessTemplates();

    // Create a filter for Deploy HaltedRetryProjectProcess rasc
    await adPtpage.clickOnPtFilterIcon();
    await urPage.clickOnFilter();
    await urPage.createNewFilter(dataset.Audit.filter.deployed);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    await adPtpage.getCellValueText(dataset.rascName);
    const isRowValid = await utility.getFirstRowContents(page);
    expect(ptAuditDetails[1]).toBe(isRowValid[1]);

    // back to process templates
    await adPtpage.backToProcessTemplates();

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await page.waitForTimeout(1000);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });

  test("Verify Process Template records of Audit->Process Templates", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await expect(adPage.processTemplates).toBeVisible();
    await adPage.clickOnProcessTemplates();

    const testDataPath = path.resolve(
      __dirname,
      "../../fixtures/TestData.json"
    );
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
    const processTemplateRowDetails =
      testData.processTemplateRowDetails.processTemplateRowDetailsArr;

    const isRowValid = await utility.getFirstRowContents(page);
    expect(processTemplateRowDetails[1]).toBe(isRowValid[1]);
  });

  test("Verify that able to Related Process Template screen and validate Process Template record of Audit->Process Templates", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnProcessTemplates();
    await adPtpage.navigatetoProcessInstances();

    const testDataPath = path.resolve(
      __dirname,
      "../../fixtures/TestData.json"
    );
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
    const ptProcessInstanceRowHeader =
      testData.ptProcessInstanceRowHeader.ptProcessInstanceRowHeaderArr;

    const isRowValid = await utility.tableHeader(page);
    expect(ptProcessInstanceRowHeader[1]).toBe(isRowValid[1]);
  });
});

test.describe("Audit-Applications test", () => {
  test.beforeEach(async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await adPage.navigateToAudit();
    await adAppPage.navigateToApplications();
  });

  test("Verifying UI components of Audit-Applications", async () => {
    const tableHeaderRecieved = await utility.tableHeader(page);
    expect(dataset.Audit.appHeader.appTableHeader).toStrictEqual(
      tableHeaderRecieved
    );

    //Selected val in dropdown
    await adAppPage.verifyDropdown();

    //Verify headers
    expect(await adAppPage.getAllApplicationsHeader()).toBeVisible();
    expect(await adAppPage.getApplicationsHeader()).toBeVisible();

    //Refresh icon
    expect(await adAppPage.getRefreshIcon()).toBeVisible();
    expect(await adAppPage.getColumnSelectorIcon()).toBeVisible();
  });

  test("Create New Filter test of Audit-Applications", async () => {
    // Click add filter
    await adAppPage.clickOnPtFilterIcon();

    //Filter Header Validations
    expect(await urPage.getFilterTitle()).toBe(dataset.Audit.filter.title);
    expect(await urPage.getFilterSubTitle()).toBe(
      dataset.Audit.filter.subtitle
    );

    //Buttons;
    await expect(await urPage.applyFilterBtn()).toBeVisible();
    //await expect(await urPage.resetAllBtn()).toBeVisible();
    await urPage.clickOnStateFilter();
    expect(await urPage.clearFilterBtn()).toBeVisible();

    //Create and Save new filter
    await urPage.createNewFilter(dataset.Audit.filter.deployed);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).toBeVisible();

    //To verify created filter functionality
    (
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).click();
    expect(await utility.getFirstRowContents(page)).toContain(
      dataset.Audit.filter.deployed
    );
  });

  test("Duplicate Filter test of Audit-Applications", async () => {
    //Duplicate entry creation
    await urPage.clickOnFilter();
    await page.waitForTimeout(500);
    await urPage.clickOnStateFilter();
    await urPage.createNewFilter(dataset.Audit.filter.deployed);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    //Alert dialog validation for duplicate entry
    await urPage.alertDialogValidations();
    (await urPage.dismissBtn()).click();
    await urPage.clickOnCancel();
    (await urPage.backToFilters()).click();
  });

  test("Edit / Delete Filter of Audit-Applications", async () => {
    //Click on 3 dots
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);

    //Edit filter
    (await urPage.editFilter()).click();
    await page.waitForTimeout(1000);

    //Changing State to UNDEPLOYED and Validating
    await urPage.clickOnStateFilter();
    await urPage.createNewFilter(dataset.Audit.filter.undeployed);
    expect(await urPage.filterLabel()).toContain(
      dataset.Audit.filter.undeployed
    );

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });

  test("Column test of Audit-Applications", async () => {
    //Validate Process Templates
    const tableHeadersArray = await utility.tableHeader(page);
    await urPage.clickOnCOlumn();

    //To Verify coloumn Headers
    expect(await (await cmPage.caseColoumHeader()).innerText()).toContain(
      dataset.Audit.coloumn.header
    );
    expect(await cmPage.availableColoumnHeader()).toBeVisible();
    expect(await cmPage.selectedColoumnHeader()).toBeVisible();
    expect(await cmPage.getAvailableColoumnTextContents()).toEqual(
      await cmPage.getSelectedColoumnTextContent()
    );

    //To verify coloumn search functionality by searching "type"
    await cmPage.verifySelectColoumnFromSearch(dataset.Audit.coloumn.type);
    //To verify display name is present in selected column
    expect(await cmPage.getSelectedColoumnTextContent()).toContain(
      dataset.Audit.coloumn.type
    );
    //To reorder coloumns by moving Name to first
    await adAppPage.selectTypeColoumn();
    await cmPage.clickUpArrow();
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    const newHeader = await utility.tableHeader(page);

    expect(newHeader[0]).not.toBe(tableHeadersArray[1]);

    //To verify first heading should be Name
    expect(newHeader[3]).toBe(dataset.Audit.coloumn.stateColumn);

    //To verify Display Name should be present under heading
    expect(newHeader.includes(dataset.Audit.coloumn.type)).toBeTruthy();

    /* To  remove first coloumn i.e; Name from selected coloumns
    by clicking x icon on selected columns tab */
    await (await cmPage.caseColoumnIcon()).click();
    (await cmPage.searchColoumn()).clear();
    await cmPage.clickkOnCloseIcon();

    //To verify Name is removed from Selected Coloumns tab
    expect(await cmPage.getSelectedColoumnTextContent()).not.toBe(
      dataset.Audit.coloumn.stateColumn
    );

    //To verify Name is unchecked from Available Coloumns tab
    expect(await adAppPage.typeCheckBox()).toHaveAttribute(
      "aria-checked",
      "true"
    );

    //Apply changes
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);

    //To verify Name is not present under table headers
    expect(await cmPage.getTableHeader()).not.toStrictEqual(
      dataset.Audit.coloumn.stateColumn
    );
  });
  test("Verify Applications > Event Detail screen header of Audit-Applications", async () => {
    await adAppPage.clickonApplicationsRecord();
    await page.waitForTimeout(2000);

    const testDataPath = path.resolve(
      __dirname,
      "../../fixtures/TestData.json"
    );
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
    const ptAuditDetailsHeader =
      testData.ptAuditDetailsHeader.ptAuditDetailsHeaderArr;

    const isHeadersValid = await utility.tableHeader(page);
    expect(isHeadersValid).toStrictEqual(ptAuditDetailsHeader);
  });

  test("Verify All attribute and Additional attribute section in Event Detail of Audit-Applications", async () => {
    adAppPage.clickonApplicationsRecord();
    await page.waitForTimeout(2000);
    adAppPage.clickonApplicationsRecord();
    await page.waitForTimeout(2000);
    await adAppPage.clickonAddtionAttributeSection();
  });

  test("Navigate to Applications Event Detail page and validate row of Audit-Applications", async () => {
    const testDataPath = path.resolve(
      __dirname,
      "../../fixtures/TestData.json"
    );
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
    const ptAuditDetails = testData.ptAuditDetails.ptAuditDetailsArr;

    //Create and Save new filter
    await adAppPage.clickOnPtFilterIcon();
    await urPage.clickOnStateFilter();
    await urPage.createNewFilter(dataset.Audit.filter.deployed);
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    await adPtpage.getCellValueText(dataset.HatltedFileName);
    const isRowValid = await utility.getFirstRowContents(page);
    expect(ptAuditDetails[1]).toBe(isRowValid[1]);

    // back to process templates
    await adAppPage.backToApplication();

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await page.waitForTimeout(1000);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });

  test("Verify Applications records of Audit-Applications", async () => {
    const testDataPath = path.resolve(
      __dirname,
      "../../fixtures/TestData.json"
    );
    const testData = JSON.parse(fs.readFileSync(testDataPath, "utf-8"));
    const applicationeRow = testData.applicationeRow.applicationeRowArr;

    const isRowValid = await utility.getFirstRowContents(page);
    await page.waitForTimeout(1000);
    // expect(await applicationeRow[1]).toBe(isRowValid[1]);
    expect(isRowValid[1]).toBe("OrgNew");
  });
});

test.describe("Audit-System test", () => {
  // test.describe.configure({ mode: "parallel" });
  test.beforeEach(async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await adPage.navigateToAudit();
    await adSysPage.navigateToSystem();
  });

  test("Verifying UI components of Audit-System Page", async () => {
    const tableHeaderRecieved = await utility.tableHeader(page);

    expect(dataset.Audit.sysHeader.sysTableHeader).toStrictEqual(
      tableHeaderRecieved
    );

    //Selected val in dropdown
    await adSysPage.verifyDropdown();

    await page.waitForTimeout(1000);
    //Verify headers
    expect(await adSysPage.getAllSystemHeader()).toBeVisible();
    expect(await adSysPage.getSystemsHeader()).toBeVisible();

    //Refresh icon
    expect(await adSysPage.getRefreshIcon()).toBeVisible();
    expect(await adSysPage.getColumnSelectorIcon()).toBeVisible();
  });

  test("Create New Filter test of Audit-System", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();

    //validate - Process Templates option on Audit screen
    await expect(adPage.system).toBeVisible();

    // validate Process Templates header
    await adPage.clickOnSystem();

    // Click add filter
    await adSysPage.clickOnSysFilterIcon();

    //Filter Header Validations
    expect(await urPage.getFilterTitle()).toBe(dataset.Audit.filter.title);
    expect(await urPage.getFilterSubTitle()).toBe(
      dataset.Audit.filter.subtitle
    );

    //Buttons;
    await expect(await urPage.applyFilterBtn()).toBeVisible();
    //await expect(await urPage.resetAllBtn()).toBeVisible();

    await urPage.clickOnSeverityFilter();
    expect(await urPage.clearFilterBtn()).toBeVisible();

    //Create and Save new filter
    await urPage.createNewSeverityFilter(dataset.Audit.sysServerityFilter.info);
    await urPage.clickOnMessageCategoryFilter();

    //Create and Save new filter
    await urPage.createMessageCategoryFilter(
      dataset.Audit.sysMsgCategoryFilter.processTemplate
    );
    await urPage.filterSaveDialog(dataset.Audit.filter.name);
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).toBeVisible();

    //To verify created filter functionality
    (
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).click();
  });

  test("Duplicate Filter test of Audit-System", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();

    //validate - Process Templates option on Audit screen
    await expect(adPage.system).toBeVisible();

    // validate Process Templates header
    await adPage.clickOnSystem();
    await adSysPage.clickOnSysFilterIcon();
    await urPage.clickOnMessageCategoryFilter();
    await page.waitForTimeout(500);
    await urPage.createMessageCategoryFilter(
      dataset.Audit.sysMsgCategoryFilter.processTemplate
    );
    await urPage.filterSaveDialog(dataset.Audit.filter.name);

    //Alert dialog validation for duplicate entry
    await urPage.alertDialogValidations();
    (await urPage.dismissBtn()).click();
    await urPage.clickOnCancel();
    (await urPage.backToFilters()).click();
  });

  test("Edit / Delete Filter of Audit-System", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();

    //validate - Process Templates option on Audit screen
    await expect(adPage.system).toBeVisible();

    // validate Process Templates header
    await adPage.clickOnSystem();

    //Click on 3 dots
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);

    //Edit filter
    (await urPage.editFilter()).click();
    await page.waitForTimeout(1000);

    //Changing State to UNDEPLOYED and Validating
    await urPage.clickOnMessageCategoryFilter();
    await urPage.createMessageCategoryFilter(
      dataset.Audit.sysMsgCategoryFilter.workItem
    );

    //Delete Filter
    await urPage.clickOnThreeDotsIconForSavedFIlter(dataset.Audit.filter.name);
    await urPage.deleteFilterDialogValidation();
    expect(
      await urPage.selectSavedFilterRowContent(dataset.Audit.filter.name)
    ).not.toBeVisible();
  });

  test("Column test of Audit-System", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();

    //validate - Process Templates option on Audit screen
    await expect(adPage.system).toBeVisible();

    // validate Process Templates header
    await adPage.clickOnSystem();

    //Validate Process Templates
    const tableHeadersArray = await utility.tableHeader(page);
    await urPage.clickOnCOlumn();

    //To Verify coloumn Headers
    expect(await (await cmPage.caseColoumHeader()).innerText()).toContain(
      dataset.Audit.coloumn.header
    );
    expect(await cmPage.availableColoumnHeader()).toBeVisible();
    expect(await cmPage.selectedColoumnHeader()).toBeVisible();
    expect(await cmPage.getAvailableColoumnTextContents()).toEqual(
      await cmPage.getSelectedColoumnTextContent()
    );

    //To verify coloumn search functionality by searching "Display Name"
    await cmPage.verifySelectColoumnFromSearch(
      dataset.Audit.coloumn.managedObjVersion
    );

    //To verify display name is present in selected column
    expect(await cmPage.getSelectedColoumnTextContent()).toContain(
      dataset.Audit.coloumn.managedObjVersion
    );

    //To reorder coloumns by moving Name to first
    await adSysPage.selectMessageIDColumn();
    await cmPage.clickUpArrow();
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);

    const newHeader = await utility.tableHeader(page);
    expect(newHeader[1]).not.toBe(tableHeadersArray[0]);

    //To verify first heading should be Name
    expect(newHeader[1]).toBe(dataset.Audit.coloumn.messageIdColumn);

    //To verify Display Name should be present under heading
    expect(
      newHeader.includes(dataset.Audit.coloumn.managedObjVersion)
    ).toBeTruthy();

    /* To  remove first coloumn i.e; Name from selected coloumns
    by clicking x icon on selected columns tab */
    await (await cmPage.caseColoumnIcon()).click();
    (await cmPage.searchColoumn()).clear();
    await cmPage.clickkOnCloseIcon();

    //To verify Name is removed from Selected Coloumns tab
    expect(await cmPage.getSelectedColoumnTextContent()).not.toBe(
      dataset.Audit.coloumn.messageIdColumn
    );

    //To verify Name is unchecked from Available Coloumns tab
    expect(await adSysPage.messageIDCheckBox()).toHaveAttribute(
      "aria-checked",
      "true"
    );

    //Apply changes
    (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);

    //To verify Name is not present under table headers
    expect(await cmPage.getTableHeader()).not.toStrictEqual(
      dataset.Audit.coloumn.messageIdColumn
    );
  });

  test("Verify All attribute and Additional attribute section in Event Detail of Audit-System", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await adPage.navigateToAudit();
    await adPage.clickOnSystem();
    await adSysPage.clickOnSystemRecord();
    await adSysPage.clickonAllAttributesSection();

    expect(adSysPage.allAttributesSection).toBeVisible();
    await adSysPage.clickonAddtionAttributeSection();
    expect(adSysPage.additionAttributeSection).toBeVisible();
  });
});

test.describe("Tear down", () => {
  test.beforeEach(async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
  });

  test("Delete created cases ", async () => {
    //Delete order
    await dmPage.deleteFilteredCase(
      dataset.BDSfileName,
      "Order",
      dataset.orderDetails.orderState.packed
    );
  });

  test("Purge process and undeploy", async () => {
    //Purge oder sample order process
    await dmPage.purgeProcess(dataset.orderFileName);
    await dmPage.purgeProcess(dataset.HatltedFileName);

    //Undeploy file
    await dmPage.undeployFiles(dataset.HatltedFileName);
    //Undeploying proj
    // await dmPage.undeployFiles(dataset.OrgName);
    await dmPage.undeployFiles(dataset.orderFileName);
    await dmPage.undeployFiles(dataset.BDSfileName);
  });
});

test.afterAll(async () => {
  await page.close();
});
