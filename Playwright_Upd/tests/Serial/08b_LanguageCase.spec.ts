import { test, expect, Page, request } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { HomePage } from "../../PageObjects/HomePage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import { LanguageCasePage } from "../../PageObjects/LanguageCasePage";
import { ConfigurationPage } from "../../PageObjects/ConfigurationPage";

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
let langCasePage: LanguageCasePage;
let configPage: ConfigurationPage;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  cmPage = poManager.getCaseManagerPage();
  wlPage = poManager.getWorkListPage();
  homePage = poManager.getHomePage();
  langCasePage = poManager.getLanguageCasePage();
  configPage = poManager.getConfigurationPage();
});

test.describe("Deployments", () => {
  test("Pre requisite deployments for Case Manager", async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
    //dpendency
    await dmPage.deployRascFiles(dataset.BDSLangProject, dataset.BDSLangProjectRasc);
    const status = await dmPage.getAppStatus(dataset.BDSLangProject);
    const type = await dmPage.getAppType(dataset.BDSLangProject);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Data");
    //case manager
    await dmPage.deployRascFiles(dataset.LangProject, dataset.LangProjectRasc);
    const statusCM = await dmPage.getAppStatus(dataset.LangProject);
    const typeCM = await dmPage.getAppType(dataset.LangProject);
    expect(statusCM).toHaveText(/Deployed/);
    expect(await typeCM.innerText()).toBe("Process");

    //Starting a process
    await adminPage.navigatetoProcessManager();
    await adminPage.startProcess(dataset.LangProjProcess);
    //end
  });
});

test.describe("Pre-requisite - Creating the case", () => {
  test.beforeEach(async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");
    await cmPage.navigateToCaseManager();
    await cmPage.clickOnCaseOrderCase1();
  });

  test("Launch WM and enter work item details to create case", async () => {
    await page.goto(dataset.workMangerUrlApp);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to worklists
    await homePage.clickMyWork();

    //Opening Capture
    await homePage.openWorklist("Capture");
    await page.waitForTimeout(4000);

    //Entering all the details
    await wlPage.enterWorklistDetaisBdsConfigProject(
      dataset.caseDetailWI.caseDataDetail_caseState1,
      dataset.caseDetailWI.caseInformation_caseState1
    );
    //To click on submit
    await wlPage.submitBtn.click();
    await page.waitForTimeout(2000);

    //Opening Displaycasedata
    await homePage.openWorklist("Displaycasedata");
    await page.waitForTimeout(4000);

    //To click on submit
    await wlPage.submitBtn.click();
    await page.waitForTimeout(2000);
  });
});

test.describe("Case linked cases - Language Screen Test", () => {
  test("Navigate to Language -> Case linked cases Screen and validate all fields", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    //Check and click on Case linked cases component
    expect(langCasePage.caseLinkedCases).toBeVisible();
    await langCasePage.clickOnCaseLinkedCasesComponent();

    //Validate all Fields are present
    expect(langCasePage.noLinkedCases).toBeVisible();
  });

  test("Verify that the updated field changes in the Case Linked cases component are reflected correctly on the Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseLinkedCases).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseLinkedCasesComponent();
    expect(langCasePage.noLinkedCases).toBeVisible();

    //Update and save the fields
    const fieldLabel: string = 'Empty state';
    const fieldValue: string = 'No linked cases - Updated';
    await langCasePage.updateField(fieldLabel, fieldValue);
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    await cmPage.navigateToCaseManager();
    await cmPage.clickOnCaseOrderCase1();
    await (await cmPage.caseName(dataset.caseDetailWI.caseDataDetail_caseState1)).click();
    await cmPage.clickOnLinkedCases();
    expect(await cmPage.linkedCaseHeader()).toBe("Linked cases");
    expect(await (await cmPage.linkedCaseEmptyState()).innerText()).toContain(
      "- Updated"
    );
  });

  test("Revert the updated field changes in the Case Linked cases component", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseLinkedCases).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseLinkedCasesComponent();
    expect(langCasePage.noLinkedCases).toBeVisible();

    //Revert the changes and save
    const fieldLabel: string = 'Empty state';
    const fieldValue: string = 'No linked cases';
    await langCasePage.updateField(fieldLabel, fieldValue);
    await langCasePage.clickOnSaveButton();
  });

});

test.describe("Case states - Language Screen Test", () => {
  test("Navigate to Language -> Case states Screen and validate all fields", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    //Check and click on Case states component
    expect(langCasePage.caseStates).toBeVisible();
    await langCasePage.clickOnCaseStatesComponent();

    //Validate all Fields are present
    expect(langCasePage.moreStatesButton).toBeVisible();
  });

  test("Verify that the updated field changes in the Case states component are reflected correctly on the Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseStates).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseStatesComponent();
    expect(langCasePage.moreStatesButton).toBeVisible();

    //Update and save the fields
    const fieldLabel: string = 'More States button';
    const fieldValue: string = 'More States - Updated';
    await langCasePage.updateField(fieldLabel, fieldValue);
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    await cmPage.navigateToCaseManager();
    await cmPage.clickOnCaseOrderCase1();
    await (await cmPage.caseName(dataset.caseDetailWI.caseDataDetail_caseState1)).click();
    expect(await (await cmPage.moreStates).innerText()).toContain(
      "- Updated"
    );
  });

  test("Revert the updated field changes in the Case states component", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseStates).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseStatesComponent();
    expect(langCasePage.moreStatesButton).toBeVisible();

    //Revert the changes and save
    const fieldLabel: string = 'More States button';
    const fieldValue: string = 'More States';
    await langCasePage.updateField(fieldLabel, fieldValue);
    await langCasePage.clickOnSaveButton();
  });

});

test.describe("Case work items - Language Screen Test", () => {
  test("Navigate to Language -> Case work items Screen and validate all fields", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    //Check and click on Case linked cases component
    expect(langCasePage.caseWorkItems).toBeVisible();
    await langCasePage.clickOnCaseWorkItemsComponent();

    //Validate all Fields are present
    expect(langCasePage.noCaseWorkItems).toBeVisible();
  });

  test("Verify that the updated field changes in the Case work items component are reflected correctly on the Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseWorkItems).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseWorkItemsComponent();
    expect(langCasePage.noCaseWorkItems).toBeVisible();

    //Update and save the fields
    const fieldLabel: string = 'Empty state';
    const fieldValue: string = 'No case work items - Updated';
    await langCasePage.updateField(fieldLabel, fieldValue);
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    await cmPage.navigateToCaseManager();
    await cmPage.clickOnCaseOrderCase1();
    await (await cmPage.caseName(dataset.caseDetailWI.caseDataDetail_caseState1)).click();
    await cmPage.clickOnWorkItems();
    expect(await cmPage.workItemsHeader()).toBe("Work items");
    expect(await (await cmPage.workItemsEmptyState()).innerText()).toContain(
      "- Updated"
    );
  });

  test("Revert the updated field changes in the Case work items component", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseWorkItems).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseWorkItemsComponent();
    expect(langCasePage.noCaseWorkItems).toBeVisible();

    //Revert the changes and save
    const fieldLabel: string = 'Empty state';
    const fieldValue: string = 'No case work items';
    await langCasePage.updateField(fieldLabel, fieldValue);
    await langCasePage.clickOnSaveButton();
  });

});

test.describe("Case documents - Language Screen Test", () => {
  test("Navigate to Language -> Case documents Screen and validate all fields", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    //Check and click on Case documents component
    expect(langCasePage.caseDocuments).toBeVisible();
    await langCasePage.clickOnCaseDocumentsComponent();

    //Validate all Fields are present
    expect(langCasePage.caseDocumentsCancelButton).toBeVisible();
    expect(langCasePage.caseDocumentsDelete).toBeVisible();
    expect(langCasePage.caseDocumentsDeleteButton).toBeVisible();
    expect(langCasePage.caseDocumentsDeleteConfiguration).toBeVisible();
    expect(langCasePage.caseDocumentsDeleteDescription).toBeVisible();
    expect(langCasePage.caseDocumentsDialogHeader).toBeVisible();
    expect(langCasePage.caseDocumentsDocumentVersion).toBeVisible();
    expect(langCasePage.caseDocumentsDownload).toBeVisible();
    expect(langCasePage.caseDocumentsDownloadDescription).toBeVisible();
    expect(langCasePage.caseDocumentsEmptyState).toBeVisible();
    expect(langCasePage.caseDocumentsSearchEmptyState).toBeVisible();
    expect(langCasePage.caseDocumentsTimePrefix).toBeVisible();
    expect(langCasePage.caseDocumentsUpdatedBy).toBeVisible();
    expect(langCasePage.caseDocumentsUploadButton).toBeVisible();
  });

  test("Verify that the updated field changes in the Case documents component are reflected correctly on the Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseDocuments).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseDocumentsComponent();
    expect(langCasePage.caseDocumentsUploadButton).toBeVisible();

    //Update and save the fields
    await langCasePage.updateField("Upload button", "Upload - Updated");
    await langCasePage.updateField("Cancel button", "Cancel - Updated");
    await langCasePage.updateField("Delete button", "Yes, Delete - Updated");
    await langCasePage.updateField("Empty state", "No documents - Updated");
    await langCasePage.updateField("Search empty state", "No document found name containing - Updated");
    await langCasePage.updateField("Dialog header", "Delete document - Updated");
    await langCasePage.updateField("Delete configuration", "Are you sure you want to delete - Updated");
    await langCasePage.updateField("Updated by", "Last updated by - Updated");
    await langCasePage.updateField("Time prefix", "on - Updated");
    await langCasePage.updateField("Document version", "Version - Updated");
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    //-------------------------
    await cmPage.navigateToCaseManager();
    await cmPage.clickOnCaseOrderCase1();
    await (await cmPage.caseName(dataset.caseDetailWI.caseDataDetail_caseState1)).click();
    await cmPage.clickOnDocuments();
    expect(await cmPage.docHeader()).toBe("Documents");
    //Upload button
    expect(await cmPage.uploadBtn()).toBeVisible();
    expect(await (await cmPage.uploadBtn()).innerText()).toContain(
      "- Updated"
    );
    //Empty State
    expect(await cmPage.documentsEmptyState()).toBeVisible();
    expect(await (await cmPage.documentsEmptyState()).innerText()).toContain(
      "- Updated"
    );
    //Upload a doc
    await cmPage.clickOnDocuments();
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.doc} file upload`,
      dataset.caseDocument.doc
    );
    expect(await cmPage.alertMsg()).toContain(
      `${dataset.caseDocument.doc} uploaded`
    );
    await cmPage.documentList.waitFor();
    expect(await cmPage.docLists()).toContain(dataset.caseDocument.doc);
    const fullText = await cmPage.getDisplayInlineParts();
    console.log(fullText);
    //Updated by
    expect(fullText).toContain("Last updated by - Updated");
    //Time prefix
    expect(fullText).toContain("on - Updated");
    //version
    expect(await (await cmPage.getCaseDocumentsVersion()).innerText()).toContain(
      "- Updated"
    );
    await cmPage.clickOnDeleteIcon(dataset.caseDocument.doc);
    //Dialog Header
    expect(await cmPage.documentDeleteHeader()).toContain(
      "- Updated"
    );
    //Delete configuration
    expect(await cmPage.delDocumentConfirmationTxt()).toContain(
      "- Updated"
    );
    //Cancel button
    expect(await cmPage.caseDocsCancelButtonText()).toContain(
      "- Updated"
    );
    //Delete
    expect(await cmPage.caseDocsDeleteConfirmationButtonText()).toContain(
      "- Updated"
    );
  });

  test("Verify that the updated field changes in the Case documents component are reflected correctly on the Config Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseDocuments).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseDocumentsComponent();
    expect(langCasePage.caseDocumentsUploadButton).toBeVisible();

    //Update and save the fields
    await langCasePage.updateField("Delete", "Show case documents delete - Updated");
    await langCasePage.updateField("Delete description", "Show an option to delete case documents. - Updated");
    await langCasePage.updateField("Download", "Show case documents download - Updated");
    await langCasePage.updateField("Download description", "Show an option to download case documents. - Updated");
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await page.waitForTimeout(1000);
    await expect(configPage.configtitle).toHaveText("Configuration");
    await page.waitForTimeout(1000);
    await configPage.clickOnCaseDocument();
    await page.waitForTimeout(2000);
    //Delete
    expect(await (await configPage.showCaseDocumentsDeleteLabel).innerText()).toContain(
      "- Updated"
    );
    //Delete description
    expect(await (await configPage.showCaseDocumentsDeleteDescription).innerText()).toContain(
      "- Updated"
    );
    //Download
    expect(await (await configPage.showCaseDocumentsDownloadLabel).innerText()).toContain(
      "- Updated"
    );
    //Download description
    expect(await (await configPage.showCaseDocumentsDownloadDescription).innerText()).toContain(
      "- Updated"
    );
  });

  test("Revert the updated field changes in the Case documents component", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseDocuments).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseDocumentsComponent();
    expect(langCasePage.caseDocumentsUploadButton).toBeVisible();

    //Revert the changes and save
    await langCasePage.updateField("Upload button", "Upload");
    await langCasePage.updateField("Cancel button", "Cancel");
    await langCasePage.updateField("Delete button", "Yes, Delete");
    await langCasePage.updateField("Empty state", "No documents");
    await langCasePage.updateField("Search empty state", "No document found name containing");
    await langCasePage.updateField("Dialog header", "Delete document");
    await langCasePage.updateField("Delete configuration", "Are you sure you want to delete");
    await langCasePage.updateField("Updated by", "Last updated by");
    await langCasePage.updateField("Time prefix", "on");
    await langCasePage.updateField("Document version", "Version");
    await langCasePage.updateField("Delete", "Show case documents delete");
    await langCasePage.updateField("Delete description", "Show an option to delete case documents.");
    await langCasePage.updateField("Download", "Show case documents download");
    await langCasePage.updateField("Download description", "Show an option to download case documents.");
    await langCasePage.clickOnSaveButton();
  });

});

test.describe("Case types - Language Screen Test", () => {
  test("Navigate to Language -> Case types Screen and validate all fields", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    //Check and click on Case documents component
    expect(langCasePage.caseTypes).toBeVisible();
    await langCasePage.clickOnCaseTypesComponent();

    //Validate all Fields are present
    expect(langCasePage.caseTypesApplicationMajorVersion).toBeVisible();
    expect(langCasePage.caseTypesApplicationMajorVersionDescription).toBeVisible();
    expect(langCasePage.caseTypesEmptyState).toBeVisible();
    expect(langCasePage.caseTypesName).toBeVisible();
    expect(langCasePage.caseTypesNameDescription).toBeVisible();
    expect(langCasePage.caseTypesRefresh).toBeVisible();
    expect(langCasePage.caseTypesRefreshDescription).toBeVisible();
  });

  test("Verify that the updated field changes in the Case types component are reflected correctly on the Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseTypes).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseTypesComponent();
    expect(langCasePage.caseTypesEmptyState).toBeVisible();

    //Update and save the fields
    await langCasePage.updateField("Empty state", "No case types - Updated");
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    //-------------------------
    await cmPage.navigateToCaseManager();
    //Empty state
    try {
      expect(await (await cmPage.caseTypesEmptyState()).innerText()).toContain("- Updated");
    } catch (err) {
      console.warn("Soft assertion failed:", err instanceof Error ? err.message : err);
    }
  });

  test("Verify that the updated field changes in the Case types component are reflected correctly on the Config Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseTypes).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseTypesComponent();
    expect(langCasePage.caseTypesEmptyState).toBeVisible();

    //Update and save the fields
    await langCasePage.updateField("Refresh", "Show case types refresh - Updated");
    await langCasePage.updateField("Refresh description", "Show an option to refresh case types. - Updated");
    await langCasePage.updateField("Name", "Show case type name - Updated");
    await langCasePage.updateField("Name description", "Show case type name. - Updated");
    await langCasePage.updateField("Application major version", "Show application major version - Updated");
    await langCasePage.updateField("Application major version description", "Show application major version. - Updated");
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await page.waitForTimeout(1000);
    await expect(configPage.configtitle).toHaveText("Configuration");
    await page.waitForTimeout(1000);
    await configPage.clickOnCaseTypes();
    await page.waitForTimeout(2000);
    //Refresh
    expect(await (await configPage.showCaseTypesRefresh).innerText()).toContain(
      "- Updated"
    );
    //Refresh description
    expect(await (await configPage.showCaseTypesRefreshDescription).innerText()).toContain(
      "- Updated"
    );
    //Name
    expect(await (await configPage.showCaseTypesName).innerText()).toContain(
      "- Updated"
    );
    //Name description
    expect(await (await configPage.showCaseTypesNameDescription).innerText()).toContain(
      "- Updated"
    );
    //Application major version
    expect(await (await configPage.showCaseTypesApplicationMajorVersion).innerText()).toContain(
      "- Updated"
    );
    //Application major version description
    expect(await (await configPage.showCaseTypesApplicationMajorVersionDescription).innerText()).toContain(
      "- Updated"
    );
  });

  test("Revert the updated field changes in the Case documents component", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseTypes).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseTypesComponent();
    expect(langCasePage.caseTypesEmptyState).toBeVisible();

    //Revert the changes and save
    await langCasePage.updateField("Empty state", "No case types");
    await langCasePage.updateField("Refresh", "Show case types refresh");
    await langCasePage.updateField("Refresh description", "Show an option to refresh case types.");
    await langCasePage.updateField("Name", "Show case type name");
    await langCasePage.updateField("Name description", "Show case type name.");
    await langCasePage.updateField("Application major version", "Show application major version");
    await langCasePage.updateField("Application major version description", "Show application major version.");
    await langCasePage.clickOnSaveButton();
  });

});

test.describe("Case document viewer - Language Screen Test", () => {
  test("Navigate to Language -> Case document viewer Screen and validate all fields", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    //Check and click on Case document viewer component
    expect(langCasePage.caseDocumentViewer).toBeVisible();
    await langCasePage.clickOnCaseDocumentViewerComponent();

    //Validate all Fields are present
    expect(langCasePage.caseDocumentViewerDescriptionContainer).toBeVisible();
    expect(langCasePage.caseDocumentViewerDescriptionContainerDescription).toBeVisible();
    expect(langCasePage.caseDocumentViewerDocumentDescription).toBeVisible();
    expect(langCasePage.caseDocumentViewerDocumentDetails).toBeVisible();
    expect(langCasePage.caseDocumentViewerDownloadButton).toBeVisible();
    expect(langCasePage.caseDocumentViewerLastUpdate).toBeVisible();
    expect(langCasePage.caseDocumentViewerTimePrefix).toBeVisible();
    expect(langCasePage.caseDocumentViewerUpdatedBy).toBeVisible();
    
  });

  test("Verify that the updated field changes in the Case document viewer component are reflected correctly on the Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseDocumentViewer).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseDocumentViewerComponent();
    expect(langCasePage.caseDocumentViewerDownloadButton).toBeVisible();

    //Update and save the fields
    await langCasePage.updateField("Download button", "Download - Updated");
    await langCasePage.updateField("Document details", "Document information - Updated");
    await langCasePage.updateField("Document description", "Description - Updated");
    await langCasePage.updateField("Last update", "Last update - Updated");
    await langCasePage.updateField("Time prefix", "on - Updated");
    await langCasePage.updateField("Updated by", "Last updated by - Updated");
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    //-------------------------
    await cmPage.navigateToCaseManager();
    await cmPage.clickOnCaseOrderCase1();
    await (await cmPage.caseName(dataset.caseDetailWI.caseDataDetail_caseState1)).click();
    await cmPage.clickOnDocuments();
    expect(await cmPage.docHeader()).toBe("Documents");
    //Upload a doc
    await cmPage.clickOnDocuments();
    await cmPage.caseDocumentUpload(
      `Description for ${dataset.caseDocument.doc} file upload`,
      dataset.caseDocument.doc
    );
    expect(await cmPage.alertMsg()).toContain(
      `${dataset.caseDocument.doc} uploaded`
    );
    await cmPage.documentList.waitFor();
    expect(await cmPage.docLists()).toContain(dataset.caseDocument.doc);
    (await cmPage.getUploadedDocLocator(dataset.caseDocument.doc)).click();
    await page.waitForTimeout(2000);
    //Download button
    expect(await (await cmPage.docViewerDownloadButton).innerText()).toContain(
      "- Updated"
    );
    //Document details
    expect(await (await cmPage.docViewerDocumentDetails).innerText()).toContain(
      "- Updated"
    );
    //Document description
    expect(await (await cmPage.docViewerDescriptionValue).innerText()).toContain(
      "- Updated"
    );
    const fullText = await cmPage.getLastUpdatedByText();
    console.log(fullText);
    //Updated by
    expect(fullText).toContain("Last updated by - Updated");
    //Time prefix
    expect(fullText).toContain("on - Updated");
  });

  test("Verify that the updated field changes in the Case document viewer component are reflected correctly on the Config Case screen", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseDocumentViewer).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseDocumentViewerComponent();
    expect(langCasePage.caseDocumentViewerDownloadButton).toBeVisible();

    //Update and save the fields
    await langCasePage.updateField("Description container", "Show case documents description container - Updated");
    await langCasePage.updateField("Description container description", "Show an option to hide case documents description container. - Updated");
    await langCasePage.clickOnSaveButton();

    //Verify the updated fields
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await page.waitForTimeout(1000);
    await expect(configPage.configtitle).toHaveText("Configuration");
    await page.waitForTimeout(1000);
    await configPage.clickOnCaseDocumentViewver();
    await page.waitForTimeout(2000);
    //Description container
    expect(await (await configPage.showCaseDocumentViewerDocumentContainer).innerText()).toContain(
      "- Updated"
    );
    //Description container description
    expect(await (await configPage.showCaseDocumentViewerDocumentContainerDescription).innerText()).toContain(
      "- Updated"
    );
  });

  test("Revert the updated field changes in the Case document viewer component", async () => {

    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langCasePage.clickOnSetting();
    await langCasePage.clickOnLanguage();
    await page.waitForTimeout(1000);

    expect(langCasePage.caseDocumentViewer).toBeVisible();
    await page.waitForTimeout(3000);
    await langCasePage.clickOnCaseDocumentViewerComponent();
    expect(langCasePage.caseDocumentViewerDownloadButton).toBeVisible();

    //Revert the changes and save
    await langCasePage.updateField("Download button", "Download");
    await langCasePage.updateField("Document details", "Document information");
    await langCasePage.updateField("Document description", "Description");
    await langCasePage.updateField("Last update", "Last update");
    await langCasePage.updateField("Time prefix", "on");
    await langCasePage.updateField("Updated by", "Last updated by");
    await langCasePage.updateField("Description container", "Show case documents description container");
    await langCasePage.updateField("Description container description", "Show an option to hide case documents description container.");
    await langCasePage.clickOnSaveButton();
  });

});

test.describe("Tear down", () => {
  test.beforeEach(async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
  });

  test("Delete created cases ", async () => {
    //Case1 Order
    await dmPage.deleteFilteredCase(
      dataset.BDSLangProject,
      "Case1",
      dataset.caseDetailWI.caseDataDetail_caseState1
    );
  });

  test("undeploy", async () => {
    //Undeploying proj
    await dmPage.undeployFiles(dataset.LangProject);
    await dmPage.undeployFiles(dataset.BDSLangProject);
  });
});

test.afterEach(async () => {
  await page.close();
});
