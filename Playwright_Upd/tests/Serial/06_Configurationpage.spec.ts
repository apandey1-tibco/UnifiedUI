import { test, expect, Page, Locator, Browser } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import * as utility from "../../fixtures/utility";
import { ConfigurationPage } from "../../PageObjects/ConfigurationPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { ProcessPage } from "../../PageObjects/ProcessPage";
import { HomePage } from "../../PageObjects/HomePage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { AuditPage } from "../../PageObjects/AuditPage";
import { ProcessInstancesPage } from "../../PageObjects/ProcessInstancesPage";
import { WorkViewsPage } from "../../PageObjects/WorkViewsPage";
import { UserProfilePage } from "../../PageObjects/UserProfile";
import { log } from "console";
import { LoginPage } from "../../PageObjects/LoginPage";

const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let processPage: ProcessPage;
let configPage: ConfigurationPage;
let cmPage: CaseManagerPage;
let adPage: AuditPage;
let adPrcoessInstacesPage: ProcessInstancesPage;
let wv: WorkViewsPage;
let wlPage: WorkListPage;
let upPage: UserProfilePage;
let homePage: HomePage;
let caseManager: CaseManagerPage;
let loginPage: LoginPage;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  adPage = poManager.getAuditPage();
  loginPage = poManager.getLoginPage();
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  processPage = poManager.getProcessPage();
  configPage = poManager.getConfigurationPage();
  cmPage = poManager.getCaseManagerPage();
  adPrcoessInstacesPage = poManager.getAuditPrcoessInstancesPage();
  wv = poManager.getWorkViewsPage();
  wlPage = poManager.getWorkListPage();
  upPage = poManager.getUserProfilePage();
  homePage = poManager.getHomePage();
  caseManager = poManager.getCaseManagerPage();
});

test.afterEach(async () => {
  await page.close();
});

//test.describe.configure({ mode: 'parallel' });

test.describe("Pre-requisite : Deploay Rasc and Create Work View", () => {
  test("Create Work View to validate Edit and Delete option visibility post unchecked checkbox form Configuration screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await wv.navigateToWorkViews();
    await wv.clickCreateWorkView();
    // Enter Work View details
    await wv.workViewDetails(
      dataset.workViewforConfig.name,
      dataset.workViewforConfig.desc
    );
    await wv.workViewMakePublic();
    //Create the WorkView
    await wv.clickOnCreateButton();
    await page.waitForTimeout(1000);
    await expect
      .soft(wv.verifyCreatedWorkVIew(dataset.workViewforConfig.name).first())
      .toBeVisible();
  });

  test("Pre requisite deployments for Work View and Work List", async () => {
    let status: Locator;
    let type: Locator;

    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();

    //dpendency
    await dmPage.deployRascFiles(dataset.FacadeFileName, dataset.facadeRasc);
    status = await dmPage.getAppStatus(dataset.FacadeFileName);
    type = await dmPage.getAppType(dataset.FacadeFileName);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Process");

    //Starting a process
    await adminPage.navigatetoProcessManager();
    await adminPage.startProcess(dataset.FacadeFileName);
  });

  test("Deploy pre requisite rasc", async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
    //dependency and deply data and process project
    await dmPage.deployRascFiles(dataset.TestBDSProject, dataset.BDSConfigRasc);
    const status = await dmPage.getAppStatus(dataset.TestBDSProject);
    const type = await dmPage.getAppType(dataset.TestBDSProject);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Data");

    await dmPage.deployRascFiles(
      dataset.ConfigTestProject,
      dataset.configProcessRasc
    );
    const statusCM = await dmPage.getAppStatus(dataset.ConfigTestProject);
    const typeCM = await dmPage.getAppType(dataset.ConfigTestProject);
    expect(statusCM).toHaveText(/Deployed/);
    //await page.waitForTimeout(2000);
    expect(await typeCM.innerText()).toBe("Process");

    //Starting a process
    await adminPage.navigatetoProcessManager();
    await adminPage.startProcess(dataset.ConfigTestProject);
  });

  test("Launch WM and enter work item details to create case", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    //Navigate to worklists
    await homePage.clickMyWork();
    //Capturename
    await homePage.openWorklist("Capturename");
    await configPage.enterOnlyMandatoryDetails();
    await wlPage.submitBtn.click();
    await page.waitForTimeout(2000);
  });
});

test.describe("Configuration Screen Basic Test", () => {
  test("Navigate to Configuration Screen and validate all fields", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await page.waitForTimeout(1000);
    await expect(configPage.configtitle).toHaveText("Configuration");
    await page.waitForTimeout(1000);

    const visibilityElements = [
      configPage.caseDetails,
      configPage.caseDocuments,
      configPage.caseDocumentViewver,
      configPage.caseTypes,
      configPage.cases,
      configPage.audit,
      configPage.globalHeader,
      configPage.navbarHeaderTools,
      configPage.processInstanceTableFilter,
      configPage.processTemplates,
      configPage.userProfiles,
      configPage.workList,
      configPage.workItems,
    ];

    for (const element of visibilityElements) {
      await expect(element).toBeVisible();
    }
  });
});

test.describe("Case Details - Configuration Screen test", () => {
  test("Validate Adhoc task, Refresh icon, Case state,Case data and Case action functionality on Case details -Configuration Screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await page.waitForTimeout(1000);

    //Check if the case details components are checked by default
    expect(await configPage.clickonResetDefaultButton());
    expect(await configPage.isAdhoctaskChecked()).toBeTruthy();

    //Uncheck the show Adhoc task refresh icon 1
    await configPage.AdhocTask.click();
    expect(await configPage.isAdhoctaskChecked()).toBeFalsy();

    //Uncheck the show case details refresh icon 2
    expect(await configPage.isCaseDetailsRefreshChecked()).toBeTruthy();
    await configPage.caseDetailsRefresh.click();
    expect(await configPage.isCaseDetailsRefreshChecked()).toBeFalsy();

    //Uncheck the show case state component icon 3
    expect(await configPage.isCaseStateComponentChecked()).toBeTruthy();
    await configPage.caseStateComponent.click();
    expect(await configPage.isCaseStateComponentChecked()).toBeFalsy();

    //Uncheck the show Case data component
    expect(await configPage.isCaseDataComponentChecked()).toBeTruthy();
    await configPage.caseDataComponent.click();
    expect(await configPage.isCaseDataComponentChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //To verify Case details components is not present in Case Manager-Case details
    await caseManager.navigateToCaseManager();

    //Click on the case name to open the case details page
    await configPage.bomcasename.click();
    await configPage.configcasenamerow.click();
    await page.waitForTimeout(2000);
    await expect(configPage.cmCaseDetailsRefreshIcon).toBeHidden();
    await expect(configPage.cmAdhoctaskbutton).toBeHidden();
    await expect(configPage.cmcaseStateComponent).toBeHidden();
    await expect(configPage.cmcaseDataComponent).toBeHidden();
    await page.waitForTimeout(2000);

    //Navigate to configuration page and set reset to default
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickonResetDefaultButton();

    //Validate all components are visible to the case details
    await caseManager.navigateToCaseManager();
    await configPage.bomcasename.click();
    await configPage.configcasenamerow.click();
    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await expect(configPage.cmCaseDetailsRefreshIcon).toBeVisible();
    await expect(configPage.cmAdhoctaskbutton).toBeVisible();
    await expect(configPage.cmcaseStateComponent).toBeVisible();
    await expect(configPage.cmcaseDataComponent1).toBeVisible({
      timeout: 10000,
    });
    await expect(configPage.cmcaseDataComponent2).toBeVisible();
    await page.waitForTimeout(2000);
  });

  test("Validate Work item, linked cases, document and Audit functionality on Case details components", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickonResetDefaultButton();

    expect(await configPage.isCaseWorkItemComponentChecked()).toBeTruthy();
    await configPage.caseWorkItemComponent.click();
    expect(await configPage.isCaseWorkItemComponentChecked()).toBeFalsy();
    expect(await configPage.isLinkedCaseComponentChecked()).toBeTruthy();
    await configPage.linkedCaseComponent.click();
    expect(await configPage.isLinkedCaseComponentChecked()).toBeFalsy();
    expect(await configPage.isCaseDocumentComponentChecked()).toBeTruthy();
    await configPage.caseDocumentComponent.click();
    expect(await configPage.isCaseDocumentComponentChecked()).toBeFalsy();

    expect(await configPage.isCaseAuditComponentChecked()).toBeTruthy();
    await configPage.caseAuditComponent.click();
    expect(await configPage.isCaseAuditComponentChecked()).toBeFalsy();
    //uncheck the show case work item component icon 1
    await configPage.clickonSaveButton();
    await page.waitForTimeout(2000);
    //TO verify show adhoc -task buttonicon is not present in case manager
    await caseManager.navigateToCaseManager();
    await configPage.bomcasename.click();
    await configPage.configcasenamerow.click();
    await page.waitForTimeout(2000);
    //const caseManagerCaseDetailsRefreshIcon = page.locator(".toolbaritem_icon.toolbaritem_icon_show.toolbaritem_only__icon");
    await expect(configPage.cmcaseWorkItemComponent).toBeHidden();
    await expect(configPage.cmlinkedCaseComponent).toBeHidden();
    await expect(configPage.cmcaseDocumentComponent).toBeHidden();
    await expect(configPage.cmcaseAuditComponent).toBeHidden();
    await page.waitForTimeout(2000);
    //back to configuration page and set reset to default
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickonResetDefaultButton();
    await page.waitForTimeout(2000);
    //check all components are visible to the case details page
    await caseManager.navigateToCaseManager();
    await configPage.bomcasename.click();
    await configPage.configcasenamerow.click();
    await expect(configPage.cmcaseWorkItemComponent).toBeVisible();
    await expect(configPage.cmlinkedCaseComponent).toBeVisible();
    await expect(configPage.cmcaseDocumentComponent).toBeVisible();
    await expect(configPage.cmcaseAuditComponent).toBeVisible();
    await page.waitForTimeout(2000);
  });
});

test.describe("Case Document - Configuration Screen test", () => {
  test("Case document component button", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickOnCaseDocument();
    await page.waitForTimeout(2000);
    await caseManager.navigateToCaseManager();

    // await page.getByText("com.example.testbdsproject",{exact:true}).click();
    await configPage.bomcasename.click();
    await configPage.configcasenamerow.click();
    //click on the document and add the document
    await caseManager.clickOnDocuments();
    expect(await caseManager.docHeader()).toBe("Documents");
    expect(await caseManager.uploadBtn()).toBeVisible();
    //Upload docs
    (await caseManager.uploadBtn()).click();
    //Upload doc conatiner
    expect(await caseManager.uploadDocConatinerText()).toContain(
      "Upload Document"
    );
    await expect(await caseManager.cancelButton()).toBeVisible();
    //To verify uploading gif
    await caseManager.caseDocumentUpload(
      `Description for ${dataset.caseDocument.jpg} file upload`,
      dataset.caseDocument.jpg
    );
    await caseManager.documentList.waitFor();
    expect(await caseManager.docLists()).toContain(dataset.caseDocument.jpg);
    await page.locator(".cancel-button").click();
    await configPage.clickonDocumentDeletebutton();
    // await page.locator('.iconsResize').click();
    await page.waitForTimeout(2000);
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDocument();
    await configPage.clickonResetDefaultButton();
    await expect(configPage.isCaseDocumentsDeleteChecked()).toBeTruthy();
    await expect(configPage.isCaseDocumentsDownloadChecked()).toBeTruthy();
    await configPage.casedocumentsdelete.click();
    await configPage.casedocumentsdownload.click();
    await page.waitForTimeout(2000);

    await configPage.clickonSaveButton();
    await page.waitForTimeout(2000);
    await caseManager.navigateToCaseManager();
    await configPage.bomcasename.click();
    await configPage.configcasenamerow.click();
    await caseManager.clickOnDocuments();
    await page.waitForTimeout(2000);
    await expect(configPage.cmcaseDocumentdeleteicon).toBeHidden();
    await expect(configPage.cmcaseDocumentdownloadicon).toBeHidden();
    await configPage.clickonDocumentDeletebutton();
    await page.waitForTimeout(2000);
    //back to configuration page and set reset to default
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDocument();
    await configPage.clickonResetDefaultButton();
    await page.waitForTimeout(2000);
    //check all components are visible to the case details page
    await caseManager.navigateToCaseManager();
    await configPage.bomcasename.click();
    await configPage.configcasenamerow.click();
    await caseManager.clickOnDocuments();
    await expect(configPage.cmcasejpgdeleteicon).toBeVisible();
    await expect(configPage.cmcasejpgdownloadicon).toBeVisible();
    await page.waitForTimeout(2000);
  });
});

test.describe("Case Document Viewer- Configuration Screen test", () => {
  test("Case document viewer", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDocumentViewver();
    await configPage.caseDocumentViewerCheckbox.click();
    await configPage.clickonSaveButton();

    //Navogate to case manager to verify
    await caseManager.navigateToCaseManager();
    await configPage.bomcasename.click();
    await configPage.configcasenamerow.click();
    await caseManager.clickOnDocuments();

    await page.waitForTimeout(2000);
    await page.locator("text=SampleJPG.jpg").click();
    await page.waitForTimeout(4000);
    await expect(page.locator(".file-title")).not.toBeVisible();
    await page.waitForTimeout(2000);
  });
});

test.describe("Case Type - Configuration Configuration Screen Test", () => {
  test("Validate show case type Refresh, Case type, application major version functionality on Case type - Configuration Screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    //check if case type component are visible on the case manager
    await caseManager.navigateToCaseManager();
    //await expect(configPage.cmcasetypename).toBeVisible();
    await expect(configPage.cmcasetyperefreshicon).toBeVisible();
    expect(await configPage.validateAppVersion());
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickOnCaseTypes();
    //click on reset button
    await configPage.clickonResetDefaultButton();
    //Verify Show filter checkbox is checked
    expect(await configPage.iscasetyperefreshChecked()).toBeTruthy();
    await configPage.casetyperefresh.click();
    //Verify Show filter checkbox is unchecked
    expect(await configPage.iscasetyperefreshChecked()).toBeFalsy();
    expect(await configPage.iscasetypenameChecked()).toBeTruthy();
    await configPage.casetypename.click();
    //Verify Show filter checkbox is unchecked
    expect(await configPage.iscasetypenameChecked()).toBeFalsy();
    expect(await configPage.isapplicationMajorVersionChecked()).toBeTruthy();
    await configPage.applicationMajorVersion.click();
    //Verify Show filter checkbox is unchecked
    expect(await configPage.isapplicationMajorVersionChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await page.waitForTimeout(2000);
    //To verify show case type name, application mejor version and refresh icon is not present in Case Type

    await caseManager.navigateToCaseManager();
    await expect(configPage.cmcasetypename).toBeHidden();
    //await expect(configPage.cmcasetyperefreshicon).toBeHidden(); --> Check
    await expect(configPage.cmapplicationMajorVersion).toBeHidden();

    await page.waitForTimeout(2000);
    //back to configuration page and set reset to default
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickOnCaseTypes();
    await configPage.clickonResetDefaultButton();
    await page.waitForTimeout(2000);
    //check all components are visible to the case details page
    await caseManager.navigateToCaseManager();
    await expect(configPage.cmcasetypename).toBeVisible();
    //await expect(configPage.cmcasetyperefreshicon).toBeVisible(); --> Check
    expect(await configPage.validateAppVersion());
    //await expect(configPage.cmapplicationMajorVersion).toBeVisible(); --> Check
    await page.waitForTimeout(2000);
  });
});

test.describe("Common Audit - Configuration Screen Test", () => {
  test("Validate 'Show Filter' functionality on Common Audit", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    // Step 1: Navigate to Common Audit Settings
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnAudit();

    // Step 2: Reset to default
    await configPage.clickonResetDefaultButton();

    // Step 3: Verify checkbox is initially checked and then uncheck
    expect(await configPage.isCommonAuditShowFilterChecked()).toBeTruthy();
    await configPage.commonAuditShowFilter.click();
    expect(await configPage.isCommonAuditShowFilterChecked()).toBeFalsy();

    // Step 4: Navigate to Audit screen and confirm filter is hidden
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await expect(configPage.allWorkItem).toBeHidden();
    await expect(configPage.auditFilterAddNewIcon).toBeHidden();

    // Step 5: Re-enable Show Filter
    await configPage.navigateToConfigAudit();

    await configPage.commonAuditShowFilter.click();
    await configPage.clickonSaveButton();
    expect(await configPage.isCommonAuditShowFilterChecked()).toBeTruthy();

    // Step 6: Confirm filter is visible again
    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await expect(configPage.allWorkItem).toBeVisible();
    await expect(configPage.auditFilterAddNewIcon).toBeVisible();
  });

  test("Validate 'Show Table' functionality on Common Audit", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    // Step 1: Navigate to Common Audit Settings
    await configPage.navigateToConfigAudit();

    // Step 2: Reset to default
    await configPage.clickonResetDefaultButton();

    // Step 3: Verify checkbox is initially checked and then uncheck
    expect(await configPage.isCommonAuditShowTableChecked()).toBeTruthy();
    await configPage.commonAuditShowTable.click();
    await configPage.clickonCancelButton();
    await page.waitForTimeout(3000);
    expect(await configPage.isCommonAuditShowTableChecked()).toBeTruthy();
    await configPage.commonAuditShowTable.click();
    await configPage.clickonSaveButton();
    expect(await configPage.isCommonAuditShowTableChecked()).toBeFalsy();

    //Step 4: Navigate to Audit > Process Instance and confirm Header is Hidden
    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    await expect(configPage.allWorkItem).toBeVisible();
    await expect(configPage.auditFilterAddNewIcon).toBeVisible();
    await expect(adPrcoessInstacesPage.findInstancebutton).toBeHidden();
    await expect(adPrcoessInstacesPage.processInstaceHeader).toBeHidden();
  });
});

test.describe("Work View - Configuration Screen Test", () => {
  test("Validate all configuration option in Work View", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    // Step 1: Navigate to Work View configuration
    await configPage.navigateToConfigWorView();

    // Step 2: Validate presence of all configuration elements
    await expect(configPage.showWorkViewTypes).toBeVisible();
    await expect(configPage.showEditWorkView).toBeVisible();
    await expect(configPage.showDeleteWorkView).toBeVisible();
    await expect(configPage.showWorkViewFilter).toBeVisible();
    await expect(configPage.showCreateView).toBeVisible();

    // Step 3: Validate action buttons
    await expect(configPage.saveBtn).toBeVisible();
    await expect(configPage.resetDefaultBtn).toBeVisible();
    await expect(configPage.cancelBtn).toBeVisible();
  });

  test("Validate show work view functionality on Work View screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigWorView();

    //Uncheck Show Work View type and Work View type should be hidden on Work View screen
    expect(await configPage.isShowWorkViewTypesChecked()).toBeTruthy();
    await configPage.showWorkViewTypes.click();
    expect(await configPage.isShowWorkViewTypesChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await expect(wv.workViewSelect).toBeHidden();

    //click on Reset Button make sure all checkbox selected and Work View type should be visible
    await configPage.navigateToConfigWorView();
    expect(await configPage.isShowWorkViewTypesChecked()).toBeTruthy();
    await wv.navigateToWorkViews();
    await expect(wv.workViewSelect).toBeVisible();
  });

  test("Validate show edit work view functionality on Work View screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigWorView();

    //Uncheck Show Edit Work View and Work View type should be hidden on Work View screen
    expect(await configPage.isShowEditWorkTypesChecked()).toBeTruthy();
    await configPage.showEditWorkView.click();
    expect(await configPage.isShowEditWorkTypesChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await wv.clickOnWorkViewDropdown("Editable");
    await wv.threeDotsVertical.click();
    await expect(wv.editButton).toBeHidden();

    //Check Show Edit Work View and Edit Work View should be visible on Work View screen
    await configPage.navigateToConfigWorView();
    expect(await configPage.isShowEditWorkTypesChecked()).toBeTruthy();
    await wv.navigateToWorkViews();
    await wv.clickOnWorkViewDropdown("Editable");
    await wv.threeDotsVertical.click();
    await expect(wv.editButton).toBeVisible();
  });

  test("Validate show delete work view functionality on Work View screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    //await configPage.navigateToConfigWorView();
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnWorkView();
    await configPage.clickonResetDefaultButton();

    //Uncheck Show Delete Work View and Delete button should be hidden on Work View screen
    expect(await configPage.isShowDeleteWorkTypesChecked()).toBeTruthy();
    await configPage.showDeleteWorkView.click();
    expect(await configPage.isShowDeleteWorkTypesChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await wv.clickOnWorkViewDropdown("Editable");
    await wv.threeDotsVertical.click();
    await expect(wv.deleteButton).toBeHidden();

    //Check Show Delete Work View and Delete button should be visible on Work View screen
    await configPage.navigateToConfigWorView();
    expect(await configPage.isShowDeleteWorkTypesChecked()).toBeTruthy();

    await wv.navigateToWorkViews();
    await wv.clickOnWorkViewDropdown("Editable");
    await wv.threeDotsVertical.click();
    await expect(wv.deleteButton).toBeVisible();
    await wv.deleteButton.click();
    await wv.verifyDeleteHeader();
    await wv.clickOnYesButton();
    await expect.soft(wv.verifyCreatedWorkVIew("Work View")).not.toBeVisible();
  });

  test("Validate show work view filter functionality on Work View screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigWorView();

    //Uncheck Show Work View fitler and filter should be hidden on Work View screen
    expect(await configPage.isShowWorkViewFilterChecked()).toBeTruthy();
    await configPage.showWorkViewFilter.click();
    expect(await configPage.isShowWorkViewFilterChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    await wv.navigateToWorkViews();
    await expect(wv.wvFilterIcon).toBeHidden();

    //Check Show Work View fitler and filter icon should be visible on Work View screen
    await configPage.navigateToConfigWorView();
    expect(await configPage.isShowWorkViewFilterChecked()).toBeTruthy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await expect(wv.wvFilterIcon).toBeVisible();
  });

  test("Validate show create view functionality on Work View screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigWorView();

    //Uncheck Show Create View and Create icon should be hidden on Work View screen
    expect(await configPage.isShowCreateViewChecked()).toBeTruthy();
    await configPage.showCreateView.click();
    expect(await configPage.isShowCreateViewChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    await wv.navigateToWorkViews();
    await expect(wv.createIcon).toBeHidden();

    //Check Show Work View fitler and filter icon should be visible on Work View screen
    await configPage.navigateToConfigWorView();
    expect(await configPage.isShowCreateViewChecked()).toBeTruthy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await expect(wv.createIcon).toBeVisible();
  });
});

test.describe("Work List - Configuration Screen Test", () => {
  test("Validate all checkbox option and button in Work List- configuration screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigWorList();

    const visibilityElements = [
      configPage.showAutoRefresh,
      configPage.showAllocateToSelf,
      configPage.showPend,
      configPage.showAutoRepeat,
      configPage.showFilter,
      configPage.showSort,
      configPage.showRefresh,
      configPage.showCancel,
      configPage.showRelloacateToWorld,
      configPage.showReoffer,
      configPage.showAdhocTasks,
      configPage.showSkip,
      configPage.showWorkListActions,
      configPage.showWorkItemActions,
      configPage.showWorkListTableActionsColumn,
      configPage.showWorkListTableOpenActionButton,
      configPage.showWorkListMenuActionEllipsis,
      configPage.showPriority,
      configPage.showOpenNext,
      configPage.saveBtn,
      configPage.resetDefaultBtn,
      configPage.cancelButton,
    ];

    for (const element of visibilityElements) {
      await expect(element).toBeVisible();
    }
  });

  test("Validate 'Show Auto Refresh' and 'Show Auto Repeat'functionality in Work List screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to Work List configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Show Auto Refresh
    expect(await configPage.isShowAutoRefreshChecked()).toBeTruthy();
    expect(await configPage.isShowAutoRepeatChecked()).toBeTruthy();
    await configPage.showAutoRefresh.click();
    expect(await configPage.isShowAutoRefreshChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Auto refresh icon is hidden on both Work View and WOrk List screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRefresh).toBeHidden();
    await wv.navigateToWorkViews();
    await expect(wlPage.autoRefresh).toBeHidden();

    await configPage.navigateToConfigWorList();
    await configPage.showAutoRepeat.click();
    expect(await configPage.isShowAutoRepeatChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Auto Repeat icon is hidden on both Work View and WOrk List screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRepeatButton).toBeHidden();
    await wv.navigateToWorkViews();
    await expect(wlPage.autoRepeatButton).toBeHidden();

    //Post Reset Default both Auto refresh and Auto Repeat icon should be visible
    await configPage.navigateToConfigWorList();
    expect(await configPage.isShowAutoRefreshChecked()).toBeTruthy();
    expect(await configPage.isShowAutoRepeatChecked()).toBeTruthy();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRepeatButton).toBeVisible();
    await expect(wlPage.autoRefresh).toBeVisible();
    await wv.navigateToWorkViews();
    await expect(wlPage.autoRepeatButton).toBeVisible();
    await expect(wlPage.autoRefresh).toBeVisible();
  });

  test("Validate 'Show Filter', 'Show Sort' and 'Show Refresh' functionality in Work List screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to Work List configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Show Auto Refresh
    expect(await configPage.isShowFitlerChecked()).toBeTruthy();
    expect(await configPage.isShowSortChecked()).toBeTruthy();
    expect(await configPage.isShowRefreshChecked()).toBeTruthy();

    //Uncheck Show Filter, Show Sort and Show Refresh checkbox
    await configPage.showFilter.click();
    expect(await configPage.isShowFitlerChecked()).toBeFalsy();
    await configPage.showSort.click();
    expect(await configPage.isShowSortChecked()).toBeFalsy();
    await configPage.showRefresh.click();
    expect(await configPage.isShowRefreshChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Filter icon is hidden on both Work View and WOrk List screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.wlRefreshButton).toBeHidden();
    await expect(wlPage.wlSortButton).toBeHidden();
    await expect(wlPage.wlRefreshButton).toBeHidden();

    await wv.navigateToWorkViews();
    await expect(wv.wvRefreshButton).toBeHidden();

    ////Navigate to Work List configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(3000);
    await expect(wlPage.wlFilterButton).toBeVisible();
    await expect(wlPage.wlSortButton).toBeVisible();
    await expect(wlPage.wlRefreshButton).toBeVisible();

    await wv.navigateToWorkViews();
    await expect(wv.wvRefreshButton).toBeVisible();
  });

  test("Validate 'Open Next', 'Cancel', 'Skip' and 'Pend' functionality in Work List screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to Work List configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Open Next, Cancel, Skip and Pend
    expect(await configPage.isShowOpenNextChecked()).toBeTruthy();
    expect(await configPage.isShowCancelChecked()).toBeTruthy();
    expect(await configPage.isShowSkipChecked()).toBeTruthy();
    expect(await configPage.isShowPendChecked()).toBeTruthy();

    //Uncheck Open Next, Cancel, Skip and Pend checkbox
    await configPage.showOpenNext.click();
    expect(await configPage.isShowOpenNextChecked()).toBeFalsy();
    await configPage.showCancel.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowCancelChecked()).toBeFalsy();
    await configPage.showSkip.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowSkipChecked()).toBeFalsy();
    await configPage.showPend.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowPendChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Filter icon is hidden on Work List screen
    expect(await wlPage.workList.click());

    // Filter by column name
    await wlPage.filterByColumnName("name", "equal", "T1");
    await page.waitForTimeout(3000);
    await wlPage.clickonThreeDotsWorklist("T1");
    await page.waitForTimeout(1000);
    //await expect(wlPage.openNextVisibility).toBeHidden();
    await expect(wlPage.openNext.first()).toBeHidden();
    await expect(wlPage.cancelItem.first()).toBeHidden();
    await expect(wlPage.skipItem.first()).toBeHidden();
    await expect(wlPage.pendItem.first()).toBeHidden();

    ////Navigate to Work List configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await wlPage.clickonThreeDotsWorklist("T1");
    await page.waitForTimeout(3000);
    await expect(wlPage.openNext.first()).toBeVisible();
    await expect(wlPage.cancelItem.first()).toBeVisible();
    await expect(wlPage.skipItem.first()).toBeVisible();
    await expect(wlPage.pendItem.first()).toBeVisible();
  });

  test("Validate 'Allocate to Self', 'Re-offer', 'Reallocate to offer set', 'Reallocate to world' and 'Change Priority' functionality in Work List screen", async () => {
    await page.goto(dataset.webcomponenturl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to Work List configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Allocate to Self, Re-offer, Reallocate to offer set, Reallocate to world and Change Priority
    expect(await configPage.isShowAllocateToSelfChecked()).toBeTruthy();
    expect(await configPage.isShowReOfferChecked()).toBeTruthy();
    expect(await configPage.isShowRelloacateToOfferSetChecked()).toBeTruthy();
    expect(await configPage.isShowRelloacateToWorldChecked()).toBeTruthy();
    expect(await configPage.isShowPriorityChecked()).toBeTruthy();

    //Uncheck Open Next, Cancel, Skip and Pend checkbox
    await configPage.showAllocateToSelf.click();
    expect(await configPage.isShowAllocateToSelfChecked());

    await configPage.showReoffer.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowReOfferChecked()).toBeFalsy();

    await configPage.showRelloacateToOfferSet.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowRelloacateToOfferSetChecked()).toBeFalsy();

    await configPage.showRelloacateToWorld.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowRelloacateToWorldChecked()).toBeFalsy();

    await configPage.showPriority.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowPriorityChecked()).toBeFalsy();

    await configPage.clickonSaveButton();
    await page.waitForTimeout(3000);

    //Validate Filter icon is hidden on Work List screen
    expect(await wlPage.workList.click());
    await wlPage.clickonThreeDotsWorklist("T1");
    await page.waitForTimeout(1000);
    await expect(wlPage.allocatetoSelfItem.first()).toBeHidden();
    await expect(wlPage.reOffer.first()).toBeHidden();
    await expect(wlPage.reallocatetoWorldItem.first()).toBeHidden();
    await expect(wlPage.reallocatetoOfferset.first()).toBeHidden();
    await expect(wlPage.changePriority.first()).toBeHidden();

    ////Navigate to Work List configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();

    expect(await wlPage.workList.click());
    await wlPage.clickonThreeDotsWorklist("T1");
    await page.waitForTimeout(3000);
    await expect(wlPage.allocatetoSelfItem.first()).toBeVisible();
    await expect(wlPage.reOffer.first()).toBeVisible();
    await expect(wlPage.reallocatetoWorldItem.first()).toBeVisible();
    await expect(wlPage.reallocatetoOfferset.first()).toBeVisible();
    await expect(wlPage.changePriority.first()).toBeVisible();
  });

  test("Validate 'ShowAdhocTask' functionality in Worklist screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Themes, Languages, Sign Out
    expect(await configPage.isShowAdhocTasksChecked()).toBeTruthy();

    //Uncheck Themes, Languages, Sign Out, Product Name Version and Product Copy Righ
    await configPage.showAdhocTasks.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowAdhocTasksChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Filter icon is hidden on User Profile screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox("T1");
    await expect(wlPage.showAdhocTask).toBeHidden();

    ////Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox("T1");
    await expect(wlPage.showAdhocTask).toBeVisible();
  });

  test("Validate 'Work List Actions' functionality in Worklist screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Themes, Languages, Sign Out
    expect(await configPage.isShowWorkListActionsChecked()).toBeTruthy();

    //Uncheck Themes, Languages, Sign Out, Product Name Version and Product Copy Righ
    await configPage.showWorkListActions.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowWorkListActionsChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Filter icon is hidden on User Profile screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRepeatButton).toBeHidden();
    await expect(wlPage.autoRefresh).toBeHidden();
    await expect(wlPage.filterButton).toBeHidden();
    await expect(wlPage.sortButton).toBeHidden();
    await expect(wlPage.refreshButton).toBeHidden();

    ////Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRepeatButton).toBeVisible();
    await expect(wlPage.autoRefresh).toBeVisible();
    await expect(wlPage.filterButton).toBeVisible();
    await expect(wlPage.sortButton).toBeVisible();
    await expect(wlPage.refreshButton).toBeVisible();
  });

  test("Validate 'Work Item Actions' functionality in Worklist screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Themes, Languages, Sign Out
    expect(await configPage.isShowWorkItemActionsChecked()).toBeTruthy();

    //Uncheck Themes, Languages, Sign Out, Product Name Version and Product Copy Righ
    await configPage.showWorkItemActions.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowWorkItemActionsChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Filter icon is hidden on User Profile screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox("T1");
    await expect(wlPage.showAdhocTask).toBeHidden();
    await expect(wlPage.autoRefresh).toBeHidden();
    await expect(wlPage.filterButton).toBeHidden();
    await expect(wlPage.sortButton).toBeHidden();
    await expect(wlPage.refreshButton).toBeHidden();

    ////Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRepeatButton).toBeVisible();
    await expect(wlPage.autoRefresh).toBeVisible();
    await expect(wlPage.filterButton).toBeVisible();
    await expect(wlPage.sortButton).toBeVisible();
    await expect(wlPage.refreshButton).toBeVisible();
  });

  test("Validate 'Work List Table Actions Column' functionality in Worklist screen", async () => {
    await page.goto(dataset.webcomponenturl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Themes, Languages, Sign Out
    expect(
      await configPage.isShowWorkListTableActionsColumnChecked()
    ).toBeTruthy();

    //Uncheck Themes, Languages, Sign Out, Product Name Version and Product Copy Righ
    await configPage.showWorkListTableActionsColumn.click();
    await configPage.clickonSaveButton();
    await page.waitForTimeout(5000);
    expect(
      await configPage.isShowWorkListTableActionsColumnChecked()
    ).toBeFalsy();

    //Validate Filter icon is hidden on User Profile screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox("T1");
    await page.waitForTimeout(1000);
    await expect(wlPage.cancelToolbarItem).toBeHidden();
    await expect(wlPage.AllocateToSelfToolbarItem).toBeHidden();
    await expect(wlPage.reOfferToolbarItem).toBeHidden();
    await expect(wlPage.skipToolbarItem).toBeHidden();
    await expect(wlPage.pendToolbarItem).toBeHidden();
    await expect(wlPage.reallocatetoWorldToolbarItem).toBeHidden();

    ////Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox("T1");
    await expect(wlPage.cancelToolbarItem).toBeVisible();
    await expect(wlPage.AllocateToSelfToolbarItem).toBeVisible();
    await expect(wlPage.reOfferToolbarItem).toBeVisible();
    await expect(wlPage.skipToolbarItem).toBeVisible();
    await expect(wlPage.pendToolbarItem).toBeVisible();
    await expect(wlPage.reallocatetoWorldToolbarItem).toBeVisible();
  });

  test("Validate 'Work List Table Open Action Button' functionality in Worklist screen", async () => {
    await page.goto(dataset.webcomponenturl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Work List Table Open Action Button
    expect(
      await configPage.isShowWorkListTableOpenActionButtonnChecked()
    ).toBeTruthy();

    //Uncheck Work List Table Open Action Button
    await configPage.showWorkListTableOpenActionButton.click();
    await page.waitForTimeout(1000);
    expect(
      await configPage.isShowWorkListTableOpenActionButtonnChecked()
    ).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Filter icon is hidden on User Profile screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.open).toBeHidden();

    ////Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await wlPage.clickoncheckbox("T1");
    await page.waitForTimeout(3000);
    await expect(wlPage.open).toBeVisible();
  });

  test("Validate 'Work List Table Menu Action Ellipsis' functionality in Worklist screen", async () => {
    await page.goto(dataset.webcomponenturl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigWorList();

    //validate visbility and uncheck checkbox for Themes, Languages, Sign Out
    expect(
      await configPage.isShowWorkListMenuActionEllipsisChecked()
    ).toBeTruthy();

    //Uncheck Themes, Languages, Sign Out, Product Name Version and Product Copy Righ
    await configPage.showWorkListMenuActionEllipsis.click();
    await page.waitForTimeout(5000);
    expect(
      await configPage.isShowWorkListMenuActionEllipsisChecked()
    ).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Filter icon is hidden on User Profile screen
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.ellipsisWorklist).toBeHidden();

    ////Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(3000);
    await wlPage.clickoncheckbox("T1");
    await expect(wlPage.ellipsisWorklist).toBeVisible();
  });
});

test.describe("Process Templates - Configuration Screen Test", () => {
  test("Validate all checkbox option and button in Process Templates - configuration screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigProcessTemplate();

    const visibilityElements = [
      configPage.showTemplateMoreMenu,
      configPage.showTemplateRefresh,
      configPage.showTemplateFilterIcon,
      configPage.showInstanceStartButton,
      configPage.showTemplateTags,
      configPage.saveBtn,
      configPage.resetDefaultBtn,
      configPage.cancelButton,
    ];

    for (const element of visibilityElements) {
      await expect(element).toBeVisible();
    }
  });

  test("Validate 'Show template refresh', 'Show template filter icon' and 'Show instance start button' functionality in Process Templates - configuration screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigProcessTemplate();

    //validate visbility and uncheck checkbox for Show Template Refresh, Show Filter Icon, Show Start button
    expect(await configPage.isShowTemplateRefreshChecked()).toBeTruthy();
    expect(await configPage.isShowTemplateFilterIconChecked()).toBeTruthy();
    expect(await configPage.isShowInstanceStartButtonChecked()).toBeTruthy();

    //Uncheck Show Template Refresh, Show Filter Icon and Show Start button checkbox
    await configPage.showTemplateRefresh.click();
    expect(await configPage.isShowTemplateRefreshChecked()).toBeFalsy();
    await configPage.showTemplateFilterIcon.click();
    expect(await configPage.isShowTemplateFilterIconChecked()).toBeFalsy();
    await configPage.showInstanceStartButton.click();
    expect(await configPage.isShowInstanceStartButtonChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Refresh, Filter and Start icon is hidden on Process Template screen
    expect(await processPage.naviagteToProcessTab());
    await page.waitForTimeout(1000);
    await expect(processPage.refreshIcon).toBeHidden();
    await expect(processPage.filterInstancesBy).toBeHidden();
    await expect(processPage.startButton).toBeHidden();
  });

  test("Validate 'Show template more menu'  functionality in Process Templates - configuration screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigProcessTemplate();

    //validate visbility and uncheck checkbox for Show template more menu
    expect(await configPage.isShowTemplateMoreMenuChecked()).toBeTruthy();
    await configPage.showTemplateMoreMenu.click();
    expect(await configPage.isShowTemplateMoreMenuChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate more menu icon is hidden on Process Template screen
    expect(await processPage.naviagteToProcessTab());
    await processPage.clickOnProcess("ACE_TestFacadeAttributesProcess");
    await page.waitForTimeout(1500);
    await processPage.ACE_TestFacadeAttributes.click();
    await expect(processPage.moreMenu).toBeHidden();

    //validate visbility and check checkbox for Show template more menu
    await configPage.navigateToConfigProcessTemplate();
    expect(await configPage.isShowTemplateMoreMenuChecked()).toBeTruthy();
    await configPage.clickonSaveButton();
    expect(await processPage.naviagteToProcessTab());
    await processPage.clickOnProcess("ACE_TestFacadeAttributesProcess");
    await page.waitForTimeout(1500);
    await processPage.ACE_TestFacadeAttributes.click();
    await expect(processPage.moreMenu).toBeVisible();
  });

  test("Validate 'Show template tags' functionality in Process Template - configuration screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToConfigProcessTemplate();

    //Uncheck Show Template tags checkbox
    expect(await configPage.isShowTemplatesTagsChecked()).toBeTruthy();
    await configPage.showTemplateTags.click();
    expect(await configPage.isShowTemplatesTagsChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    //Validate Show Template tags is hidden on Process Template screen
    expect(await processPage.naviagteToProcessTab());
    await processPage.clickOnProcess("ACE_TestFacadeAttributesProcess");
    await expect(processPage.templateTag).toBeHidden();

    //validate visbility and check checkbox for Show templatetag
    await configPage.navigateToConfigProcessTemplate();
    expect(await configPage.isShowTemplatesTagsChecked()).toBeTruthy();
    expect(await processPage.naviagteToProcessTab());
    await processPage.clickOnProcess("ACE_TestFacadeAttributesProcess");
    await expect(processPage.templateTag).toBeVisible();
  });
});

test.describe("Cases - Configuration Screen Test", () => {
  test("Validate all checkbox option and button in Cases - configuration screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigatetoConfigCases();

    const visibilityElements = [
      configPage.showCasesSearch,
      configPage.showCasesFilter,
      configPage.showCasesColumnSelector,
      configPage.showCasesRefresh,
      configPage.saveBtn,
      configPage.resetDefaultBtn,
      configPage.cancelButton,
    ];

    for (const element of visibilityElements) {
      await expect(element).toBeVisible();
    }
  });

  test("Validate 'Show cases search', 'Show case filter', 'Show case column selector' and 'Show cases refresh' functionality in Cases - configuration screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigatetoConfigCases();

    expect(await configPage.isShowCasesSearchChecked()).toBeTruthy();
    expect(await configPage.isShowCasesFilterChecked()).toBeTruthy();
    expect(await configPage.isShowCasesColumnSelectorChecked()).toBeTruthy();
    expect(await configPage.isShowCasesRefreshChecked()).toBeTruthy();

    await configPage.showCasesSearch.click();
    await configPage.showCasesFilter.click();
    await configPage.showCasesColumnSelector.click();
    await configPage.showCasesRefresh.click();

    expect(await configPage.isShowCasesSearchChecked()).toBeFalsy();
    expect(await configPage.isShowCasesFilterChecked()).toBeFalsy();
    expect(await configPage.isShowCasesColumnSelectorChecked()).toBeFalsy();
    expect(await configPage.isShowCasesRefreshChecked()).toBeFalsy();

    await configPage.clickonSaveButton();

    expect(await cmPage.navigateToCaseManager());
    await expect(cmPage.searchIcon).toBeHidden();
    await expect(cmPage.filterIcon).toBeHidden();
    await expect(cmPage.coloumnsIcon).toBeHidden();
    await expect(cmPage.refreshIcon).toBeHidden();

    //Click on Reset Default and make sure all checkbox are checked and all four icon are visible on Cases screen
    await configPage.navigatetoConfigCases();
    expect(await configPage.isShowCasesSearchChecked()).toBeTruthy();
    expect(await configPage.isShowCasesFilterChecked()).toBeTruthy();
    expect(await configPage.isShowCasesColumnSelectorChecked()).toBeTruthy();
    expect(await configPage.isShowCasesRefreshChecked()).toBeTruthy();

    expect(await cmPage.navigateToCaseManager());
    await expect(cmPage.searchIcon).toBeVisible();
    await expect(cmPage.filterIcon).toBeVisible();
    await expect(cmPage.coloumnsIcon).toBeVisible();
    await expect(cmPage.refreshIcon).toBeVisible();
  });
});

test.describe("Process Instance table filter - Configuration Screen Test", () => {
  test("Validate 'Find Instances', 'Show Adhoc Tasks', 'Refresh icon' and 'Column Selector' functionality in Process Instance Table Filter screen", async () => {
    await page.goto(dataset.webcomponenturl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigProcess();

    //validate visbility and uncheck checkbox for Themes, Languages, Sign Out
    expect(await configPage.isShowFindInstances()).toBeTruthy();
    expect(await configPage.isshowAdhocTask()).toBeTruthy();
    expect(await configPage.isshowRefreshIcon()).toBeTruthy();
    expect(await configPage.isshowColumnSelector()).toBeTruthy();

    //Uncheck Themes, Languages, Sign Out, Product Name Version and Product Copy Righ
    await configPage.showfindInstances.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowFindInstances()).toBeFalsy();

    await configPage.showAdhocTask.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isshowAdhocTask()).toBeFalsy();

    await configPage.showRefreshIcon.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isshowRefreshIcon()).toBeFalsy();

    await configPage.showColumnSelector.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isshowColumnSelector()).toBeFalsy();

    await page.waitForTimeout(3000);
    await configPage.clickonSaveButton();

    //Validate Filter icon is hidden on User Profile screen
    expect(await processPage.processPage.click());
    await page.waitForTimeout(1000);
    await expect(processPage.findInstances).toBeHidden();
    await expect(processPage.adhocTasks).toBeHidden();
    await expect(processPage.refreshInstances).toBeHidden();
    await expect(processPage.columnSelector).toBeHidden();

    ////Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigProcess();
    expect(await processPage.processPage.click());
    await page.waitForTimeout(3000);
    await expect(processPage.findInstances).toBeVisible();
    await expect(processPage.adhocTasks).toBeVisible();
    await expect(processPage.refreshInstances).toBeVisible();
    await expect(processPage.columnSelector).toBeVisible();
  });

  test("Validate 'Cancel Instances', 'Resume' and 'Suspend Button' functionality in Process Instance Table Filter screen", async () => {
    await page.goto(dataset.webcomponenturl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to Process Instance table filter configuration
    await configPage.navigateToConfigProcess();

    //validate visbility and uncheck checkbox for Cancel Instance, Resume Task and Suspended Task
    expect(await configPage.isshowCancelInstance()).toBeTruthy();
    expect(await configPage.isshowResumeTasks()).toBeTruthy();
    expect(await configPage.isshowSuspendTasks()).toBeTruthy();

    await configPage.showCancelInstance.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isshowCancelInstance()).toBeFalsy();
    await configPage.showResumeTasks.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isshowResumeTasks()).toBeFalsy();
    await configPage.showSuspendTasks.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isshowSuspendTasks()).toBeFalsy();

    await page.waitForTimeout(3000);
    await configPage.clickonSaveButton();

    //Validate Cancel Instance, Resume Task and Suspended Task are hidden on Process Instance table filter screen
    expect(await processPage.processPage.click());
    await page.waitForTimeout(1000);
    await processPage.selectACETestFacadeAttributesProcess(
      "ACE_TestFacadeAttributesProcess"
    );

    await expect(processPage.cancelInstances).toBeHidden();
    await expect(processPage.resumeTasks).toBeHidden();
    await expect(processPage.suspendTasks).toBeHidden();

    //Navigate to Process Instance table filter configuration and click on ResetDefault
    await configPage.navigateToConfigProcess();

    //Navigate to Process template screen to validate visibiliti odf icon
    expect(await processPage.processPage.click());
    await page.waitForTimeout(1000);
    await processPage.selectACETestFacadeAttributesProcess(
      "ACE_TestFacadeAttributesProcess"
    );

    await expect(processPage.cancelInstances).toBeVisible();
    await expect(processPage.resumeTasks).toBeVisible();
    await expect(processPage.suspendTasks).toBeVisible();
  });
});

test.describe("User Profile - Configuration Screen Test", () => {
  test("Validate 'Themes', 'Languages', 'Sign Out', 'Product Name and Version' and 'Product Copy Right' functionality in User Profile screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigUserProfile();

    //validate visbility and uncheck checkbox for Themes, Languages, Sign Out Product Name Version and Product Copy Right
    expect(await configPage.isShowThemesSwitcher()).toBeTruthy();
    expect(await configPage.isShowLanguageSwitcher()).toBeTruthy();
    expect(await configPage.isShowSignOut()).toBeTruthy();
    expect(await configPage.isShowProductNameVersion()).toBeTruthy();
    expect(await configPage.isShowProductCopyRight()).toBeTruthy();

    //Uncheck Themes, Languages, Sign Out, Product Name Version and Product Copy Right
    await configPage.showThemeSwitcher.click();
    await configPage.showLanguageSwitcher.click();
    await configPage.showSignOut.click();
    await configPage.showProductNameVersion.click();
    await configPage.showProductCopyRight.click();
    await configPage.clickonSaveButton();
    await page.waitForTimeout(3000);

    expect(await configPage.isShowThemesSwitcher()).toBeFalsy();
    expect(await configPage.isShowLanguageSwitcher()).toBeFalsy();
    expect(await configPage.isShowSignOut()).toBeFalsy();
    expect(await configPage.isShowProductNameVersion()).toBeFalsy();
    expect(await configPage.isShowProductCopyRight()).toBeFalsy();

    //Validate Filter icon is hidden on User Profile screen
    //expect(await wlPage.workList.click());
    (await upPage.userProfile).click();
    await page.waitForTimeout(1000);
    await expect(upPage.themesSwitcher).toBeHidden();
    await expect(upPage.languageSwitcher).toBeHidden();
    await expect(upPage.signOut).toBeHidden();
    await expect(upPage.productNameVersion).toBeHidden();
    await expect(upPage.productVersion).toBeHidden();
    (await upPage.userProfileClose).click();

    //Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigUserProfile();
    await page.waitForTimeout(3000);
    expect(await wlPage.workList.click());
    await (await upPage.userProfile).click();
    await expect(upPage.themesSwitcher).toBeVisible();
    await expect(upPage.languageSwitcher).toBeVisible();
    await expect(upPage.signOut).toBeVisible();
    await expect(upPage.productNameVersion).toBeVisible();
    await expect(upPage.productVersion).toBeVisible();
  });
});

test.describe("Navbar Header Tools - Configuration Screen Test", () => {
  test("Validate 'User Profile' functionality in Navbar header tools screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    // Navigate to Navbar Header Tools Configuration Screen
    await configPage.navigateToConfigNavbarHeaderTools();
    // Assert User Profile checkbox is visible and checked
    await expect(
      configPage.userProfile,
      "User Profile checkbox should be visible"
    ).toBeVisible();
    expect(
      await configPage.isShowUserProfile(),
      "User Profile checkbox should be checked"
    ).toBeTruthy();

    // Uncheck User Profile and Save
    await configPage.userProfile.click();
    await page.waitForTimeout(1000); // allow UI update
    expect(
      await configPage.isShowUserProfile(),
      "User Profile checkbox should now be unchecked"
    ).toBeFalsy();
    await configPage.clickonSaveButton();

    // Validate User Profile icon is hidden on the app UI
    await page.waitForLoadState("networkidle");
    await expect(
      upPage.userProfile,
      "User Profile icon should be hidden after disabling it"
    ).toBeHidden();

    // Re-navigate to Navbar Header Tools and Reset Defaults
    await configPage.navigateToConfigNavbarHeaderTools();

    // Wait for UI update and validate User Profile is visible again
    await page.waitForTimeout(2000); // minimal wait to allow icon to reappear
    await expect(
      upPage.userProfile,
      "User Profile icon should be visible after reset"
    ).toBeVisible();
  });

  test("Validate 'Application switcher' functionality in Navbar header tools screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigNavbarHeaderTools();

    //validate visbility and uncheck checkbox for Application switcher and User Profile
    await configPage.applicationSwitcher.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowApplicationSwitcher()).toBeTruthy();
    await configPage.clickonSaveButton();
    await expect(upPage.applicationSwitcher).toBeVisible();

    //Navigate to User Profile configuration and click on ResetDefault
    await configPage.navigateToConfigNavbarHeaderTools();
    await page.waitForTimeout(1000);
    await expect(upPage.applicationSwitcher).toBeHidden();
  });

  test("Validate 'Sign out url' functionality in Navbar header tools screen", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");

    //Navigate to User Profile configuration
    await configPage.navigateToConfigNavbarHeaderTools();

    //Validate Sign Out Url functionalty
    await configPage.signOutUrl.fill(dataset.signOutUrl);
    await page.waitForTimeout(3000);
    await configPage.clickonSaveButton();
    expect(await configPage.signoutUrlText.inputValue()).toBe(
      dataset.signOutUrl
    );
    await page.waitForTimeout(3000);

    await upPage.userProfile.click();
    await upPage.signOut.click();
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(dataset.signOutUrl);
    await page.goBack();
    await page.waitForLoadState("domcontentloaded");
    await page.reload();
    // await page.locator('input[type="text"]').fill("tibco-admin");
    // await page.locator('input[type="password"]').fill("secret");
    // await page.getByRole("button", { name: "Sign in", exact: true }).click();
    // await page.waitForTimeout(2000);
    // await page.waitForLoadState("networkidle");
    await loginPage.login(dataset.username1, dataset.password1);
    await page.waitForLoadState("domcontentloaded");
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnNavbarHeaderTools();
    await expect(configPage.signoutUrlText).toHaveValue(dataset.signOutUrl);
    await configPage.clickonResetDefaultButton();
    await expect(configPage.signoutUrlText).toHaveValue("");
    await page.waitForTimeout(1000);
  });
});

test.describe("Global header - Configuration Screen Test", () => {
  test("Test header logo configuration", async ({}) => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await configPage.navigateToGlobalHeader();
    await expect(configPage.configtitle).toBeVisible();
    await expect(configPage.globalHeader).toBeVisible();
    expect(await configPage.headerAppTitle).toContainText(
      "BPME web components"
    );

    //Application Title
    await configPage.appTitle.click();
    await configPage.appTitleInput.fill("Test Application Title");
    await configPage.appTitle.click();
    await configPage.clickonSaveButton();
    await expect(configPage.headerAppTitle).toContainText(
      "Test Application Title"
    );
    await configPage.appTitle.click();
    await page.waitForTimeout(2000);
    await configPage.resetDefaultBtn.click();
    await expect(configPage.headerAppTitle).toContainText(
      "BPME web components"
    );

    //Header Logo
    await configPage.headerLogoInput.click();
    await configPage.headerLogoInput.fill("../../fixtures/SampleJPG.jpg");
    await configPage.appTitle.click();
    await configPage.clickonSaveButton();
    await page.waitForTimeout(2000);
    // No expect*****************
  });
});

test.describe("Tear down", () => {
  test.beforeEach(async () => {
    await page.goto(dataset.adminUrl);
    await adminPage.navigateToDeploymentManager();
  });

  test("Purge all ACE_TestFacadeAttributes Process Instances", async () => {
    await dmPage.purgeProcess(dataset.FacadeFileName);
    await dmPage.purgeProcess(dataset.ConfigTestProject);
    await dmPage.deleteFilteredCase(
      dataset.TestBDSProject,
      "ConfigCase1",
      "CREATED"
    );
  });

  test("Undeploy all Projects", async () => {
    await dmPage.undeployFiles(dataset.FacadeFileName);
    await dmPage.undeployFiles(dataset.ConfigTestProject);
    await dmPage.undeployFiles(dataset.TestBDSProject);
  });
});

test.afterAll(async () => {
  await page.close();
});
