import { test, expect, Page, request } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { HomePage } from "../../PageObjects/HomePage";
import { WorkListPage } from "../../PageObjects/WorkListPage";

//Json->string->js object
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

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  cmPage = poManager.getCaseManagerPage();
  wlPage = poManager.getWorkListPage();
  homePage = poManager.getHomePage();
});

test.describe("Deployments", () => {
  test("Pre requisite deployments for Case Manager", async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
    //dpendency
    await dmPage.deployRascFiles(dataset.BDSfileName, dataset.BDSRasc);
    const status = await dmPage.getAppStatus(dataset.BDSfileName);
    const type = await dmPage.getAppType(dataset.BDSfileName);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Data");
    //case manager
    await dmPage.deployRascFiles(dataset.orderFileName, dataset.orderRasc);
    const statusCM = await dmPage.getAppStatus(dataset.orderFileName);
    const typeCM = await dmPage.getAppType(dataset.orderFileName);
    expect(statusCM).toHaveText(/Deployed/);
    expect(await typeCM.innerText()).toBe("Process");

    //Starting a process
    await adminPage.navigatetoProcessManager();
    await adminPage.startProcess(dataset.orderFileName);
    //end
  });
});

test.describe("Case Manager Regression suite", () => {
  test.beforeEach(async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await homePage.clickOnBuisnessService();
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
    await cmPage.navigateToCaseManager();
    await cmPage.clickOnCaseOrder();
  });

  test("Launch WM and enter work item details to create case", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to worklists
    await homePage.clickMyWork();
    //Additional Order
    await homePage.openWorklist("GetAdditionalOrderDetails");
    await page
      .getByLabel("caseState1")
      .selectOption(dataset.orderDetails.orderState.picked);
    await wlPage.submitBtn.scrollIntoViewIfNeeded();
    await wlPage.submitBtn.click();
    await page.waitForTimeout(2000);

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
    //To click on ok and selecting date and time
    await wlPage.submitBtn.click();
    // await page.waitForTimeout(2000);
  });

  test("Verify the different UI component present in Case Manager view", async () => {
    expect(await cmPage.caseHeader()).toBe("Case types");
    expect(await cmPage.activeCasestxt()).toBeVisible();
    expect(await cmPage.getCaseTypeHeaderName("Order")).toBe("Order");
    await page.waitForSelector('twc-icon[name="arrow-clockwise"]');
    expect(await cmPage.caseSearchIcon()).toBeVisible();
    expect(await cmPage.caseFilterIcon()).toBeVisible();
    expect(await cmPage.caseColoumnIcon()).toBeVisible();
    expect(await cmPage.casesRefreshIcon()).toBeVisible();
    expect(await cmPage.caseTypesRefreshIcon()).toBeVisible();
  });

  test("Verify the data for Order Cases", async () => {
    const data = await cmPage.getActiveCaseDetails(dataset.orderDetails.name);
    if (!data) return;
    //data?

    //Validating case data coming from WM
    expect(data.casedata.orderState).toBe(
      dataset.orderDetails.orderState.packed
    );
    expect(data.casedata.name).toBe(dataset.orderDetails.name);
    expect(data.casedata.product).toBe(dataset.orderDetails.product);
    expect(data.casedata.quantity).toBe(2);
    expect(data.casedata.orderID).toBe(dataset.orderDetails.orderID);
  });

  test("Verify Case search functionality for different data types", async () => {
    await cmPage.clickOnSearchCases();
    //To search by number-- order id
    await cmPage.verifySearch(dataset.orderDetails.orderID);
    expect(await (await cmPage.firstRow()).innerText()).toContain(
      dataset.orderDetails.orderID
    );
    //To search by name
    await cmPage.verifySearch(dataset.orderDetails.name);
    expect(await (await cmPage.firstRow()).innerText()).toContain(
      dataset.orderDetails.name
    );
    //To search by time
    await cmPage.verifySearch("20:30:00");
    expect(await cmPage.tableRow()).toHaveCount(1);
    //To search by date
    await cmPage.verifySearch("2024-08-22");
    expect(await cmPage.tableRow()).toHaveCount(1);
  });

  test("Verify Case Filter functionality", async () => {
    //Filters
    await cmPage.clickOnCaseFilterIcon();
    expect(await cmPage.getcaseFilterheading()).toBe("Filter Cases");
    //Packed Picked
    await cmPage.selectFilter("Packed");
    //first row conatins packed
    expect(await (await cmPage.firstRow()).innerText()).toContain("Packed");
    //chip text content
    expect(await (await cmPage.filterChip()).innerText()).toContain("PACKED");
    //Clear all filter should be present
    await expect(cmPage.clearAllFilters).toBeVisible();
    await cmPage.clearAllFilters.click();
    //Filer chip and clear all filter should not be visible after click
    await expect(cmPage.clearAllFilters).not.toBeVisible();
    await expect(await cmPage.filterChip()).not.toBeVisible();
  });

  test("Case coloumn test", async () => {
    const tableHeaders = await cmPage.getTableHeader();
    await (await cmPage.caseColoumnIcon()).click();
    expect(await cmPage.caseColoumHeader()).toBeVisible();
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
    await (await cmPage.caseColoumnIcon()).click();
    await (await cmPage.searchColoumn()).clear();
    await cmPage.clickkOnclocseIcon();
    //To verify Name is removed from Selected Coloumns tab
    expect(await cmPage.getSelectedColoumnTextContent()).not.toContain("Name");
    //To verify Name is unchecked from Available Coloumns tab
    expect(await cmPage.nameCheckBox()).toHaveAttribute(
      "aria-checked",
      "false"
    );
    //Apply changes
    await (await cmPage.getApplyBtn()).click();
    await page.waitForTimeout(1000);
    //To verify Name is not present under table headers
    expect(await cmPage.getTableHeader()).not.toContain("Name");
  });

  test("Verify view case", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();

    //view case
    await cmPage.clickOnviewCase();
    expect(await wlPage.orderID.inputValue()).toBe(
      dataset.orderDetails.orderID
    );
    expect(await wlPage.orderState.inputValue()).toBe(
      dataset.orderDetails.orderState.packed
    );
    expect(await wlPage.name.inputValue()).toBe(dataset.orderDetails.name);
    expect(await wlPage.quantity.inputValue()).toBe(
      dataset.orderDetails.quantity
    );
    expect(await wlPage.product.inputValue()).toBe(
      dataset.orderDetails.product
    );
    await cmPage.clickOnSubmitBtn();
  });

  test("Verify Create case functionality by creating new case from existing case ", async () => {
    //To create a new case
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.createNewCase(
      dataset.newCase.orderID,
      dataset.orderDetails.orderState.packed,
      dataset.newCase.name
    );
    (await cmPage.getBackToCases()).click();
    await page.locator("twc-table-row").first().waitFor();
    await expect(await cmPage.caseName(dataset.newCase.name)).toBeVisible();
  });

  test("Verify click on more and delete the updated case", async () => {
    await (await cmPage.caseName(dataset.newCase.name)).click();

    //delete case
    await cmPage.deleteCase(dataset.newCase.name);
    await (await cmPage.getBackToCases()).click();
    await page.locator("twc-table-row").first().waitFor();
    await expect(await cmPage.caseName(dataset.newCase.name)).not.toBeVisible();
  });

  //Case Details
  test("Verify tha data for Additional Order cases", async () => {
    await page.waitForTimeout(1000);
    await cmPage.clickOnAdditionalOrder();
    expect(await cmPage.caseHeader()).toBe("Case types");
    expect(await cmPage.activeCasestxt()).toBeVisible();
    expect(await cmPage.getCaseTypeHeaderName("AdditionalOrder")).toBe(
      "AdditionalOrder"
    );
    expect(await cmPage.getTableHeader()).toStrictEqual([
      "AdditionalOrderID",
      "caseState1",
    ]);
  });

  test("To verify Work items under Case Details", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnWorkItems();
    //To verify Work items header
    expect(await cmPage.workItemsHeader()).toBe("Work items");
    //To verify work item name
    const workItem = await cmPage.workItem();

    await expect(workItem).toBeVisible();
    await expect(workItem).toContainText("ViewLinkedCaseData");

    //To verify state -- offered initially
    await expect(workItem).toContainText("Offered");

    await (await cmPage.workItem()).click();
    await page.waitForTimeout(700);

    //To verify Additional Order State
    expect(await wlPage.orderState.nth(0).inputValue()).toBe(
      dataset.orderDetails.orderState.picked
    );
    //To verify Order ID
    expect(await wlPage.orderID.nth(1).inputValue()).toBe(
      dataset.orderDetails.orderID
    );
    //To verify Order state
    expect(await wlPage.orderState.nth(1).inputValue()).toBe(
      dataset.orderDetails.orderState.packed
    );
    //To verify Order name
    expect(await wlPage.name.inputValue()).toBe(dataset.orderDetails.name);
    //To verift Order quantity
    expect(await wlPage.quantity.inputValue()).toBe(
      dataset.orderDetails.quantity
    );
    //To verify product
    expect(await wlPage.product.inputValue()).toBe(
      dataset.orderDetails.product
    );
    //To verify state -- opened after clicking WI
    expect(await (await cmPage.workItem()).innerText()).toContain("Opened");
    //close WI
    await cmPage.closeWorkItem();
    expect(await cmPage.alertMsg()).toContain("Work item saved successfully.");
  });

  test("To verify Linked Cases under Case Details", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnLinkedCases();
    //To verify Linked Case Header
    expect(await cmPage.linkedCaseHeader()).toBe("Linked cases");
    //To verify linked case title to be AdditionalOrder initally
    expect(await (await cmPage.linkedCase()).innerText()).toContain(
      "AdditionalOrder"
    );
    await (await cmPage.linkedCase()).click();
    await page.waitForTimeout(700);
    //To verify data-- state of AdditionalOrder
    expect(await cmPage.linkedCaseState()).toContain("Picked");
    //To verify linked case title to be Order
    expect(await (await cmPage.linkedCase()).innerText()).toContain("Order");
  });

  test("To verify Audit under Case Details", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnAudit();
    expect(await cmPage.auditHeader()).toBe("Audit");

    //Audit steps verification
    expect(await cmPage.auditTextContent()).toContain("created case");
    expect(await cmPage.auditTextContent()).toContain("linked case");
    //click on expand
    await cmPage.clickOnDownArrow();
  });

  //Documents
  test("To verify Documents UI under Case Details", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnDocuments();
    expect(await cmPage.docHeader()).toBe("Documents");
    expect(await cmPage.uploadBtn()).toBeVisible();
    //Upload docs
    await (await cmPage.uploadBtn()).click();
    //Upload doc conatiner
    expect(await cmPage.uploadDocConatinerText()).toContain("Upload Document");
    await expect(await cmPage.cancelButton()).toBeVisible();

    //Doc desc text box
    expect(page.locator("#document-description")).toBeVisible();
    expect(await page.locator(".drag-drop-text.mtb").innerText()).toContain(
      "Drag and drop a file or "
    );
    //Choose file btn
    await expect(await cmPage.chooseFileBtn()).toBeVisible();
    //cancel click()
    await (await cmPage.cancelButton()).click();
  });

  test("To verify document upload for Doc format", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnDocuments();
    //To verify uploading doc format
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.doc} file upload`,
      dataset.caseDocument.doc
    );
    expect(await cmPage.alertMsg()).toContain(
      `${dataset.caseDocument.doc} uploaded`
    );
    const list = cmPage.documentList;
    await expect(list).toBeVisible({ timeout: 10000 });
    await expect(list).toContainText(dataset.caseDocument.doc);
  });

  test("To verify document upload for Gif format", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnDocuments();
    //To verify uploading gif format
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.gif} file upload`,
      dataset.caseDocument.gif
    );
    expect(await cmPage.alertMsg()).toContain(
      `${dataset.caseDocument.gif} uploaded`
    );
    const list = cmPage.documentList;
    await expect(list).toBeVisible({ timeout: 10000 });
    await expect(list).toContainText(dataset.caseDocument.gif);
  });

  test("To verify document upload for JPG format", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnDocuments();
    //To verify uploading gif
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.jpg} file upload`,
      dataset.caseDocument.jpg
    );
    expect(await cmPage.alertMsg()).toContain(
      `${dataset.caseDocument.jpg} uploaded`
    );
    const list = cmPage.documentList;
    await expect(list).toBeVisible({ timeout: 10000 });
    await expect(list).toContainText(dataset.caseDocument.jpg);
  });

  test("To verify document upload for TXT format", async () => {
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnDocuments();
    //To verify uploading Txt
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.txt} file upload`,
      dataset.caseDocument.txt
    );
    expect(await cmPage.alertMsg()).toContain(
      `${dataset.caseDocument.txt} uploaded`
    );
    const list = cmPage.documentList;
    await expect(list).toBeVisible({ timeout: 10000 });
    await expect(list).toContainText(dataset.caseDocument.txt);
  });

  test("Search and Delete case document", async () => {
    const list = cmPage.documentList;
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnDocuments();

    //Search doc by name
    await cmPage.searchDocument(dataset.caseDocument.doc);
    expect(list).toHaveCount(1);
    //To Click on delete icon
    await cmPage.clickOnDeleteIcon(dataset.caseDocument.doc);
    //To verify Delete header
    expect(await cmPage.documentDeleteHeader()).toBe("Delete document");
    //To verify Body header bodyHeader
    expect(await cmPage.delDocumentConfirmationTxt()).toContain(
      `Are you sure you want to delete ${dataset.caseDocument.doc}?`
    );
    await cmPage.clickOnCancelBtn();
    //To verify doc is still present under the list
    await expect(list).toContainText(dataset.caseDocument.doc);
    await cmPage.clickOnDeleteIcon(dataset.caseDocument.doc);
    await cmPage.clickOnYesDelete();
    //To verify doc is deleted
    expect(await cmPage.documentConatiner()).toContain(
      "No document found name containing"
    );
  });

  test("To verify document upload for PDF format", async () => {
    const list = cmPage.documentList;
    await (await cmPage.caseName(dataset.orderDetails.name)).click();
    await cmPage.clickOnDocuments();
    //To verify uploading pdf
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.pdf} file upload`,
      dataset.caseDocument.pdf
    );
    await cmPage.clickOnAudit();
    await cmPage.clickOnDocuments();
    await page.waitForTimeout(1000);
    await expect(list).toContainText(dataset.caseDocument.pdf);
  });
});

test.describe("Tear down", () => {
  test.beforeEach(async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
  });

  test("Delete created cases ", async () => {
    //Additional Order
    await dmPage.deleteFilteredCase(
      dataset.BDSfileName,
      "AdditionalOrder",
      dataset.orderDetails.orderState.picked
    );
    //order
    await dmPage.deleteFilteredCase(
      dataset.BDSfileName,
      "Order",
      dataset.orderDetails.orderState.packed
    );
  });

  test("Purge process and undeploy", async () => {
    //Purge oder sample order process
    await dmPage.purgeProcess(dataset.orderFileName);
    //Undeploying proj
    await dmPage.undeployFiles(dataset.orderFileName);
    await dmPage.undeployFiles(dataset.BDSfileName);
  });
});

test.afterEach(async () => {
  await page.close();
});
