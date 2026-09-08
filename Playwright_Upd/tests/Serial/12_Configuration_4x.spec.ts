import { test, expect, Page } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { ConfigurationPage4x } from "../../PageObjects/ConfigurationPage4x";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { ProcessPage } from "../../PageObjects/ProcessPage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { AuditPage } from "../../PageObjects/AuditPage";
import { ProcessInstancesPage } from "../../PageObjects/ProcessInstancesPage";
import { WorkViewsPage } from "../../PageObjects/WorkViewsPage";
import { UserProfilePage } from "../../PageObjects/UserProfile";
import { LoginPage } from "../../PageObjects/LoginPage";
import { AMXBPMUsersResourses } from "../../PageObjects/Audit_startPMandWMPage_4x";

const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let processPage: ProcessPage;
let configPage: ConfigurationPage4x;
let cmPage: CaseManagerPage;
let adPage: AuditPage;
let adPrcoessInstacesPage: ProcessInstancesPage;
let wv: WorkViewsPage;
let wlPage: WorkListPage;
let upPage: UserProfilePage;
let caseManager: CaseManagerPage;
let loginPage: LoginPage;
let amxbpmPage: AMXBPMUsersResourses;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  adPage = poManager.getAuditPage();
  loginPage = poManager.getLoginPage();
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  processPage = poManager.getProcessPage();
  configPage = poManager.getConfigurationPage4x();
  cmPage = poManager.getCaseManagerPage();
  adPrcoessInstacesPage = poManager.getAuditPrcoessInstancesPage();
  wv = poManager.getWorkViewsPage();
  wlPage = poManager.getWorkListPage();
  upPage = poManager.getUserProfilePage();
  caseManager = poManager.getCaseManagerPage();
  amxbpmPage = poManager.getAMXBPMUsersResoursesPage();

  // Login once for the entire suite
  await loginPage.login(dataset.username1, dataset.password1);
  await amxbpmPage.ensureServerSelected(dataset.amxbpmServer);
});

test.beforeEach(async () => {
  await amxbpmPage.ensureServerSelected(dataset.amxbpmServer);
  await page.waitForLoadState("domcontentloaded");
});

test.describe.skip("Pre-requisite : Start process and create SJ_Case", () => {
  test("Create Work View to validate Edit and Delete option visibility post unchecked checkbox form Configuration screen", async () => {
    await wv.navigateToWorkViews();
    await wv.clickCreateWorkView();
    await wv.workViewDetails(
      dataset.workViewforConfig.name,
      dataset.workViewforConfig.desc
    );
    await wv.workViewMakePublic();
    for (let i = 0; i < 7; i++) {
      await wv.workViewNextButton();
    }
    await page.locator('bpme-create-views .viewSave twc-button[variant="primary"]').click();
    await page.waitForTimeout(3000);
    await expect
      .soft(wv.verifyCreatedWorkVIew(dataset.workViewforConfig.name).first())
      .toBeVisible();
  });

  test("Start ProjectForAudit process instance on 2203_Automation server", async () => {
    await amxbpmPage.startAuditProcess(dataset.projectforAudit, dataset.projectforAuditProcess);
  });

  test("Complete AuditDetailsFromUsers and DisplayDataForAudit work items to create an SJ_Case case", async () => {
    await wlPage.navigateToMyWork();
    await wlPage.openWorkItemByNameAndState(dataset.defaultWorkList, dataset.workItemState, "last");
    await wlPage.fillTextInIframeForm(dataset.auditFormIframe, "CarName", dataset.carName);
    await wlPage.selectDropdownInIframeForm(dataset.auditFormIframe, "caseState1", dataset.caseState1Order);
    await wlPage.submitIframeForm(dataset.auditFormIframe);
    await page.waitForLoadState("domcontentloaded");

    await wlPage.navigateToMyWork();
    await wlPage.openWorkItemByNameAndState(dataset.displayDataWorkList, dataset.workItemState, "last");
    await wlPage.submitAnyIframeForm();
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(2000);
  });
});

test.describe("Configuration Screen Basic Test", () => {
  test("1. Navigate to Configuration Screen and validate all fields", async () => {
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
  test("2.Validate Adhoc task, Refresh icon, Case state, Case data and Case action functionality on Case details - Configuration Screen", async () => {
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await page.waitForTimeout(1000);

    expect(await configPage.clickonResetDefaultButton());
    expect(await configPage.isAdhoctaskChecked()).toBeTruthy();

    await configPage.AdhocTask.click();
    expect(await configPage.isAdhoctaskChecked()).toBeFalsy();

    expect(await configPage.isCaseDetailsRefreshChecked()).toBeTruthy();
    await configPage.caseDetailsRefresh.click();
    expect(await configPage.isCaseDetailsRefreshChecked()).toBeFalsy();

    expect(await configPage.isCaseStateComponentChecked()).toBeTruthy();
    await configPage.caseStateComponent.click();
    expect(await configPage.isCaseStateComponentChecked()).toBeFalsy();

    expect(await configPage.isCaseDataComponentChecked()).toBeTruthy();
    await configPage.caseDataComponent.click();
    expect(await configPage.isCaseDataComponentChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    await amxbpmPage.ensureServerSelected(dataset.amxbpmServer);
    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await page.waitForTimeout(2000);
    await expect(configPage.cmCaseDetailsRefreshIcon).toBeHidden();
    await expect(configPage.cmAdhoctaskbutton).toBeHidden();
    await expect(configPage.cmcaseStateComponent).toBeHidden();
    await expect(configPage.cmcaseDataComponent).toBeHidden();
    await page.waitForTimeout(2000);

    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickonResetDefaultButton();

    await amxbpmPage.ensureServerSelected(dataset.amxbpmServer);
    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await page.waitForTimeout(1000);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);
    await expect(configPage.cmCaseDetailsRefreshIcon).toBeVisible();
    await expect(configPage.cmAdhoctaskbutton).toBeVisible();
    await expect(configPage.cmcaseStateComponent).toBeVisible();
    await expect(configPage.cmcaseDataComponent1).toBeVisible({ timeout: 10000 });
    await expect(configPage.cmcaseDataComponent2).toBeVisible();
    await page.waitForTimeout(2000);
  });

  test("3.Validate Work item, linked cases, document and Audit functionality on Case details components", async () => {
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
    await configPage.clickonSaveButton();
    await page.waitForTimeout(2000);

    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await page.waitForTimeout(2000);
    await expect(configPage.cmcaseWorkItemComponent).toBeHidden();
    await expect(configPage.cmlinkedCaseComponent).toBeHidden();
    await expect(configPage.cmcaseDocumentComponent).toBeHidden();
    await expect(configPage.cmcaseAuditComponent).toBeHidden();
    await page.waitForTimeout(2000);

    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickonResetDefaultButton();
    await page.waitForTimeout(2000);

    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await expect(configPage.cmcaseWorkItemComponent).toBeVisible();
    await expect(configPage.cmlinkedCaseComponent).toBeVisible();
    await expect(configPage.cmcaseDocumentComponent).toBeVisible();
    await expect(configPage.cmcaseAuditComponent).toBeVisible();
    await page.waitForTimeout(2000);
  });
});

test.describe("Case Document - Configuration Screen test", () => {
  test("4.Case document component button", async () => {
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDetails();
    await configPage.clickOnCaseDocument();
    await page.waitForTimeout(2000);
    await caseManager.navigateToCaseManager();

    await configPage.clickOnCaseInCaseManager();
    await caseManager.clickOnDocuments();
    expect(await caseManager.docHeader()).toBe("Documents");
    expect(await caseManager.uploadBtn()).toBeVisible();
    (await caseManager.uploadBtn()).click();
    expect(await caseManager.uploadDocConatinerText()).toContain("Upload Document");
    await expect(await caseManager.cancelButton()).toBeVisible();
    await caseManager.caseDocumentUpload(
      `Description for ${dataset.caseDocument.jpg} file upload`,
      dataset.caseDocument.jpg
    );
    await caseManager.documentList.waitFor();
    expect(await caseManager.docLists()).toContain(dataset.caseDocument.jpg);
    await configPage.documentCancelButton.click();
    await configPage.clickonDocumentDeletebutton();
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
    await configPage.clickOnCaseInCaseManager();
    await caseManager.clickOnDocuments();
    await page.waitForTimeout(2000);
    await expect(configPage.cmcaseDocumentdeleteicon).toBeHidden();
    await expect(configPage.cmcaseDocumentdownloadicon).toBeHidden();
    await configPage.clickonDocumentDeletebutton();
    await page.waitForTimeout(2000);

    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDocument();
    await configPage.clickonResetDefaultButton();
    await page.waitForTimeout(2000);

    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await caseManager.clickOnDocuments();
    await expect(configPage.cmcaseDocumentdeleteicon.first()).toBeVisible();
    await expect(configPage.cmcaseDocumentdownloadicon.first()).toBeVisible();
    await page.waitForTimeout(2000);
  });
});

test.describe("Case Document Viewer - Configuration Screen test", () => {
  test("5.Case document viewer", async () => {
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDocumentViewver();
    await configPage.clickonResetDefaultButton();
    await configPage.caseDocumentViewerCheckbox.click();
    await configPage.clickonSaveButton();

    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await caseManager.clickOnDocuments();

    await page.waitForTimeout(2000);
    await page.locator(`text=${dataset.caseDocument.jpg}`).click();
    await page.waitForTimeout(4000);
    await expect(configPage.documentFileTitle).not.toBeVisible();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(1000);

    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseDocumentViewver();
    await configPage.clickonResetDefaultButton();
  });
});

test.describe("Case Type - Configuration Screen Test", () => {
  test("6.Validate show case type Refresh, Case type, application major version functionality on Case type - Configuration Screen", async () => {
    test.setTimeout(240000);

    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await page.waitForTimeout(1000);
    await expect(configPage.cmcasetyperefreshicon).toBeVisible();
    expect(await configPage.validateAppVersion());

    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseTypes();
    await configPage.clickonResetDefaultButton();

    expect(await configPage.iscasetyperefreshChecked()).toBeTruthy();
    await configPage.casetyperefresh.click();
    expect(await configPage.iscasetyperefreshChecked()).toBeFalsy();
    expect(await configPage.iscasetypenameChecked()).toBeTruthy();
    await configPage.casetypename.click();
    expect(await configPage.iscasetypenameChecked()).toBeFalsy();
    expect(await configPage.isapplicationMajorVersionChecked()).toBeTruthy();
    await configPage.applicationMajorVersion.click();
    expect(await configPage.isapplicationMajorVersionChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await page.waitForTimeout(2000);

    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await page.waitForTimeout(1000);
    await expect(configPage.cmcasetypename).toBeHidden();
    await expect(configPage.cmapplicationMajorVersion).toBeHidden();
    await page.waitForTimeout(2000);

    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnCaseTypes();
    await configPage.clickonResetDefaultButton();
    await configPage.clickonSaveButton();
    await page.waitForTimeout(2000);

    await caseManager.navigateToCaseManager();
    await configPage.clickOnCaseInCaseManager();
    await page.waitForTimeout(1000);
    await expect(configPage.cmcasetyperefreshicon).toBeVisible();
    expect(await configPage.validateAppVersion());
    await page.waitForTimeout(2000);
  });
});

test.describe("Common Audit - Configuration Screen Test", () => {
  test("7.Validate 'Show Filter' functionality on Common Audit", async () => {
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnAudit();
    await configPage.clickonResetDefaultButton();

    expect(await configPage.isCommonAuditShowFilterChecked()).toBeTruthy();
    await configPage.commonAuditShowFilter.click();
    expect(await configPage.isCommonAuditShowFilterChecked()).toBeFalsy();

    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await expect(configPage.allWorkItem).toBeHidden();
    await expect(configPage.auditFilterAddNewIcon).toBeHidden();

    await configPage.navigateToConfigAudit();
    await configPage.commonAuditShowFilter.click();
    await configPage.clickonSaveButton();
    expect(await configPage.isCommonAuditShowFilterChecked()).toBeTruthy();

    await adPage.navigateToAudit();
    await adPage.clickOnWorkItem();
    await expect(configPage.allWorkItem).toBeVisible();
    await expect(configPage.auditFilterAddNewIcon).toBeVisible();
  });

  test("8.Validate 'Show Table' functionality on Common Audit", async () => {
    await configPage.navigateToConfigAudit();
    await configPage.clickonResetDefaultButton();

    expect(await configPage.isCommonAuditShowTableChecked()).toBeTruthy();
    await configPage.commonAuditShowTable.click();
    await configPage.clickonSaveButton();
    expect(await configPage.isCommonAuditShowTableChecked()).toBeFalsy();

    await adPage.navigateToAudit();
    await adPage.clickOnProcessInstance();
    await expect(configPage.allWorkItem).toBeVisible();
    await expect(configPage.auditFilterAddNewIcon).toBeVisible();
    await expect(adPrcoessInstacesPage.findInstancebutton).toBeHidden();
    await expect(adPrcoessInstacesPage.processInstaceHeader).toBeHidden();
  });
});

test.describe("Work View - Configuration Screen Test", () => {
  test("9.Validate all configuration option in Work View", async () => {
    await configPage.navigateToConfigWorView();

    await expect(configPage.showWorkViewTypes).toBeVisible();
    await expect(configPage.showEditWorkView).toBeVisible();
    await expect(configPage.showDeleteWorkView).toBeVisible();
    await expect(configPage.showWorkViewFilter).toBeVisible();
    await expect(configPage.showCreateView).toBeVisible();
    await expect(configPage.saveBtn).toBeVisible();
    await expect(configPage.resetDefaultBtn).toBeVisible();
    await expect(configPage.cancelButton).toBeVisible();
  });

  test("10.Validate show work view functionality on Work View screen", async () => {
    await configPage.navigateToConfigWorView();

    expect(await configPage.isShowWorkViewTypesChecked()).toBeTruthy();
    await configPage.showWorkViewTypes.click();
    expect(await configPage.isShowWorkViewTypesChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await expect(wv.workViewSelect).toBeHidden();

    await configPage.navigateToConfigWorView();
    expect(await configPage.isShowWorkViewTypesChecked()).toBeTruthy();
    await wv.navigateToWorkViews();
    await expect(wv.workViewSelect).toBeVisible();
  });

  test("11.Validate show edit work view functionality on Work View screen", async () => {
    await configPage.navigateToConfigWorView();

    expect(await configPage.isShowEditWorkTypesChecked()).toBeTruthy();
    await configPage.showEditWorkView.click();
    expect(await configPage.isShowEditWorkTypesChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await wv.clickOnWorkViewDropdown("Editable");
    await wv.threeDotsVertical.click();
    await expect(wv.editButton).toBeHidden();

    await configPage.navigateToConfigWorView();
    expect(await configPage.isShowEditWorkTypesChecked()).toBeTruthy();
    await wv.navigateToWorkViews();
    await wv.clickOnWorkViewDropdown("Editable");
    await wv.threeDotsVertical.click();
    await expect(wv.editButton).toBeVisible();
  });

  test("12.Validate show delete work view functionality on Work View screen", async () => {
    await configPage.clickOnSetting();
    await configPage.clickOnConfiguration();
    await configPage.clickOnWorkView();
    await configPage.clickonResetDefaultButton();

    expect(await configPage.isShowDeleteWorkTypesChecked()).toBeTruthy();
    await configPage.showDeleteWorkView.click();
    expect(await configPage.isShowDeleteWorkTypesChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await wv.clickOnWorkViewDropdown("Editable");
    await wv.threeDotsVertical.click();
    await expect(wv.deleteButton).toBeHidden();

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

  test("13.Validate show create view functionality on Work View screen", async () => {
    await configPage.navigateToConfigWorView();

    expect(await configPage.isShowCreateViewChecked()).toBeTruthy();
    await configPage.showCreateView.click();
    expect(await configPage.isShowCreateViewChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await expect(configPage.createWorkViewIcon).toBeHidden();

    await configPage.navigateToConfigWorView();
    expect(await configPage.isShowCreateViewChecked()).toBeTruthy();
    await configPage.clickonSaveButton();
    await wv.navigateToWorkViews();
    await expect(configPage.createWorkViewIcon).toBeVisible();
  });
});

test.describe("Work List - Configuration Screen Test", () => {
  test("14.Validate all checkbox option and button in Work List - configuration screen", async () => {
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

  test("15.Validate 'Show Auto Refresh' and 'Show Auto Repeat' functionality in Work List screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowAutoRefreshChecked()).toBeTruthy();
    expect(await configPage.isShowAutoRepeatChecked()).toBeTruthy();
    await configPage.showAutoRefresh.click();
    expect(await configPage.isShowAutoRefreshChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRefresh).toBeHidden();
    await wv.navigateToWorkViews();
    await expect(wlPage.autoRefresh).toBeHidden();

    await configPage.navigateToConfigWorList();
    await page.waitForTimeout(2000);
    await configPage.showAutoRepeat.click();
    expect(await configPage.isShowAutoRepeatChecked()).toBeFalsy();
    await configPage.clickonSaveButton();
    await page.waitForTimeout(1000);

    expect(await wlPage.workList.click());
    await page.waitForTimeout(2000);
    await expect(configPage.autoRepeatLabel).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await configPage.isShowAutoRefreshChecked()).toBeTruthy();
    expect(await configPage.isShowAutoRepeatChecked()).toBeTruthy();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(configPage.autoRepeatLabel).toBeVisible();
    await expect(wlPage.autoRefresh).toBeVisible();
    await wv.navigateToWorkViews();
    await expect(wlPage.autoRefresh).toBeVisible();
  });

  test("16.Validate 'Show Filter', 'Show Sort' and 'Show Refresh' functionality in Work List screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowFitlerChecked()).toBeTruthy();
    expect(await configPage.isShowSortChecked()).toBeTruthy();
    expect(await configPage.isShowRefreshChecked()).toBeTruthy();

    await configPage.showFilter.click();
    expect(await configPage.isShowFitlerChecked()).toBeFalsy();
    await configPage.showSort.click();
    expect(await configPage.isShowSortChecked()).toBeFalsy();
    await configPage.showRefresh.click();
    expect(await configPage.isShowRefreshChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.wlRefreshButton).toBeHidden();
    await expect(wlPage.wlSortButton).toBeHidden();
    await wv.navigateToWorkViews();
    await expect(wv.wvRefreshButton).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(3000);
    await expect(wlPage.wlFilterButton).toBeVisible();
    await expect(wlPage.wlSortButton).toBeVisible();
    await expect(wlPage.wlRefreshButton).toBeVisible();
    await wv.navigateToWorkViews();
    await expect(wv.wvRefreshButton).toBeVisible();
  });

  test("17.Validate 'Open Next', 'Cancel', 'Skip' and 'Pend' functionality in Work List screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowOpenNextChecked()).toBeTruthy();
    expect(await configPage.isShowCancelChecked()).toBeTruthy();
    expect(await configPage.isShowSkipChecked()).toBeTruthy();
    expect(await configPage.isShowPendChecked()).toBeTruthy();

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

    expect(await wlPage.workList.click());
    await page.waitForTimeout(2000);
    await configPage.clickFirstThreeDotsWorklist();
    await page.waitForTimeout(1000);
    await expect(wlPage.openNext.first()).toBeHidden();
    await expect(wlPage.cancelItem.first()).toBeHidden();
    await expect(wlPage.skipItem.first()).toBeHidden();
    await expect(wlPage.pendItem.first()).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(2000);
    await configPage.clickFirstThreeDotsWorklist();
    await expect(wlPage.openNext.first()).toBeVisible();
    await expect(wlPage.cancelItem.first()).toBeVisible();
    await expect(wlPage.skipItem.first()).toBeVisible();
    await expect(wlPage.pendItem.first()).toBeVisible();
  });

  test("18.Validate 'Allocate to Self', 'Re-offer', 'Reallocate to offer set', 'Reallocate to world' and 'Change Priority' functionality in Work List screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowAllocateToSelfChecked()).toBeTruthy();
    expect(await configPage.isShowReOfferChecked()).toBeTruthy();
    expect(await configPage.isShowRelloacateToOfferSetChecked()).toBeTruthy();
    expect(await configPage.isShowRelloacateToWorldChecked()).toBeTruthy();
    expect(await configPage.isShowPriorityChecked()).toBeTruthy();

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

    expect(await wlPage.workList.click());
    await wlPage.clickonThreeDotsWorklist(dataset.defaultWorkList);
    await page.waitForTimeout(1000);
    await expect(wlPage.allocatetoSelfItem.first()).toBeHidden();
    await expect(wlPage.reOffer.first()).toBeHidden();
    await expect(wlPage.reallocatetoWorldItem.first()).toBeHidden();
    await expect(wlPage.reallocatetoOfferset.first()).toBeHidden();
    await expect(wlPage.changePriority.first()).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(2000);
    await configPage.clickFirstThreeDotsWorklist();
    await page.waitForTimeout(1000);
    await expect(wlPage.allocatetoSelfItem.first()).toBeVisible();
    await expect(wlPage.reOffer.first()).toBeVisible();
    await expect(wlPage.reallocatetoWorldItem.first()).toBeVisible();
    await expect(wlPage.reallocatetoOfferset.first()).toBeVisible();
    await expect(wlPage.changePriority.first()).toBeVisible();
  });

  test("19.Validate 'ShowAdhocTask' functionality in Worklist screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowAdhocTasksChecked()).toBeTruthy();
    await configPage.showAdhocTasks.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowAdhocTasksChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox(dataset.defaultWorkList);
    await expect(wlPage.showAdhocTask).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox(dataset.defaultWorkList);
    await expect(wlPage.showAdhocTask).toBeVisible();
  });

  test("20.Validate 'Work List Actions' functionality in Worklist screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowWorkListActionsChecked()).toBeTruthy();
    await configPage.showWorkListActions.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowWorkListActionsChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRepeatButton).toBeHidden();
    await expect(wlPage.autoRefresh).toBeHidden();
    await expect(wlPage.filterButton).toBeHidden();
    await expect(wlPage.sortButton).toBeHidden();
    await expect(wlPage.refreshButton).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRepeatButton).toBeVisible();
    await expect(wlPage.autoRefresh).toBeVisible();
    await expect(wlPage.filterButton).toBeVisible();
    await expect(wlPage.sortButton).toBeVisible();
    await expect(wlPage.refreshButton).toBeVisible();
  });

  test("21.Validate 'Work Item Actions' functionality in Worklist screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowWorkItemActionsChecked()).toBeTruthy();
    await configPage.showWorkItemActions.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowWorkItemActionsChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox(dataset.defaultWorkList);
    await expect(wlPage.showAdhocTask).toBeHidden();
    await expect(wlPage.autoRefresh).toBeHidden();
    await expect(wlPage.filterButton).toBeHidden();
    await expect(wlPage.sortButton).toBeHidden();
    await expect(wlPage.refreshButton).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.autoRepeatButton).toBeVisible();
    await expect(wlPage.autoRefresh).toBeVisible();
    await expect(wlPage.filterButton).toBeVisible();
    await expect(wlPage.sortButton).toBeVisible();
    await expect(wlPage.refreshButton).toBeVisible();
  });

  test("22.Validate 'Work List Table Actions Column' functionality in Worklist screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowWorkListTableActionsColumnChecked()).toBeTruthy();
    await configPage.showWorkListTableActionsColumn.click();
    await configPage.clickonSaveButton();
    await page.waitForTimeout(5000);
    expect(await configPage.isShowWorkListTableActionsColumnChecked()).toBeFalsy();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox(dataset.defaultWorkList);
    await page.waitForTimeout(1000);
    await expect(wlPage.cancelToolbarItem).toBeHidden();
    await expect(wlPage.AllocateToSelfToolbarItem).toBeHidden();
    await expect(wlPage.reOfferToolbarItem).toBeHidden();
    await expect(wlPage.skipToolbarItem).toBeHidden();
    await expect(wlPage.pendToolbarItem).toBeHidden();
    await expect(wlPage.reallocatetoWorldToolbarItem).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await wlPage.clickoncheckbox(dataset.defaultWorkList);
    await expect(wlPage.cancelToolbarItem).toBeVisible();
    await expect(wlPage.AllocateToSelfToolbarItem).toBeVisible();
    await expect(wlPage.reOfferToolbarItem).toBeVisible();
    await expect(wlPage.skipToolbarItem).toBeVisible();
    await expect(wlPage.pendToolbarItem).toBeVisible();
    await expect(wlPage.reallocatetoWorldToolbarItem).toBeVisible();
  });

  test("23.Validate 'Work List Table Open Action Button' functionality in Worklist screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowWorkListTableOpenActionButtonnChecked()).toBeTruthy();
    await configPage.showWorkListTableOpenActionButton.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowWorkListTableOpenActionButtonnChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.open).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(2000);
    await configPage.firstTableRow.hover();
    await page.waitForTimeout(500);
    await expect(wlPage.open).toBeVisible();
  });

  test("24.Validate 'Work List Table Menu Action Ellipsis' functionality in Worklist screen", async () => {
    await configPage.navigateToConfigWorList();

    expect(await configPage.isShowWorkListMenuActionEllipsisChecked()).toBeTruthy();
    await configPage.showWorkListMenuActionEllipsis.click();
    await page.waitForTimeout(5000);
    expect(await configPage.isShowWorkListMenuActionEllipsisChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await wlPage.workList.click());
    await page.waitForTimeout(1000);
    await expect(wlPage.ellipsisWorklist).toBeHidden();

    await configPage.navigateToConfigWorList();
    expect(await wlPage.workList.click());
    await page.waitForTimeout(3000);
    await wlPage.clickoncheckbox(dataset.defaultWorkList);
    await expect(wlPage.ellipsisWorklist).toBeVisible();
  });
});

test.describe("Process Templates - Configuration Screen Test", () => {
  test("25.Validate all checkbox option and button in Process Templates - configuration screen", async () => {
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

  test("26.Validate 'Show template refresh', 'Show template filter icon' and 'Show instance start button' functionality in Process Templates - configuration screen", async () => {
    await configPage.navigateToConfigProcessTemplate();

    expect(await configPage.isShowTemplateRefreshChecked()).toBeTruthy();
    expect(await configPage.isShowTemplateFilterIconChecked()).toBeTruthy();
    expect(await configPage.isShowInstanceStartButtonChecked()).toBeTruthy();

    await configPage.showTemplateRefresh.click();
    expect(await configPage.isShowTemplateRefreshChecked()).toBeFalsy();
    await configPage.showTemplateFilterIcon.click();
    expect(await configPage.isShowTemplateFilterIconChecked()).toBeFalsy();
    await configPage.showInstanceStartButton.click();
    expect(await configPage.isShowInstanceStartButtonChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await processPage.naviagteToProcessTab());
    await page.waitForTimeout(1000);
    await expect(processPage.refreshIcon).toBeHidden();
    await expect(processPage.filterInstancesBy).toBeHidden();
    await expect(processPage.startButton).toBeHidden();
  });

  test("27.Validate 'Show template more menu' functionality in Process Templates - configuration screen", async () => {
    await configPage.navigateToConfigProcessTemplate();

    expect(await configPage.isShowTemplateMoreMenuChecked()).toBeTruthy();
    await configPage.showTemplateMoreMenu.click();
    expect(await configPage.isShowTemplateMoreMenuChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await processPage.naviagteToProcessTab());
    await processPage.clickOnProcess(dataset.projectforAuditProcess);
    await page.waitForTimeout(1500);
    await configPage.ProjectForAuditProcess.click();
    await page.waitForTimeout(1000);
    await configPage.firstTreeItem.hover();
    await page.waitForTimeout(500);
    await expect(processPage.moreMenu).toBeHidden();

    await configPage.navigateToConfigProcessTemplate();
    expect(await configPage.isShowTemplateMoreMenuChecked()).toBeTruthy();
    await configPage.clickonSaveButton();
    expect(await processPage.naviagteToProcessTab());
    await processPage.clickOnProcess(dataset.projectforAuditProcess);
    await page.waitForTimeout(1500);
    await configPage.ProjectForAuditProcess.click();
    await page.waitForTimeout(1000);
    await configPage.firstTreeItem.hover();
    await page.waitForTimeout(500);
    await expect(processPage.moreMenu).toBeVisible();
  });

  test("28.Validate 'Show template tags' functionality in Process Template - configuration screen", async () => {
    await configPage.navigateToConfigProcessTemplate();

    expect(await configPage.isShowTemplatesTagsChecked()).toBeTruthy();
    await configPage.showTemplateTags.click();
    expect(await configPage.isShowTemplatesTagsChecked()).toBeFalsy();
    await configPage.clickonSaveButton();

    expect(await processPage.naviagteToProcessTab());
    await processPage.clickOnProcess(dataset.projectforAuditProcess);
    await page.waitForTimeout(1500);
    await configPage.ProjectForAuditProcess.click();
    await page.waitForTimeout(1000);
    await expect(processPage.templateTag).toBeHidden();

    await configPage.navigateToConfigProcessTemplate();
    expect(await configPage.isShowTemplatesTagsChecked()).toBeTruthy();
  });
});

test.describe("Cases - Configuration Screen Test", () => {
  test("29.Validate all checkbox option and button in Cases - configuration screen", async () => {
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

  test("30.Validate 'Show cases search', 'Show case filter', 'Show case column selector' and 'Show cases refresh' functionality in Cases - configuration screen", async () => {
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

    await page.waitForTimeout(2000);
    await configPage.navigatetoConfigCasesNoReset();
    expect(await configPage.isShowCasesSearchChecked()).toBeFalsy();
    expect(await configPage.isShowCasesFilterChecked()).toBeFalsy();
    expect(await configPage.isShowCasesColumnSelectorChecked()).toBeFalsy();
    expect(await configPage.isShowCasesRefreshChecked()).toBeFalsy();

    await configPage.navigatetoConfigCases();
    expect(await configPage.isShowCasesSearchChecked()).toBeTruthy();
    expect(await configPage.isShowCasesFilterChecked()).toBeTruthy();
    expect(await configPage.isShowCasesColumnSelectorChecked()).toBeTruthy();
    expect(await configPage.isShowCasesRefreshChecked()).toBeTruthy();

    expect(await cmPage.navigateToCaseManager());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await expect(configPage.caseManagerSearchInput).toBeVisible();
    await expect(cmPage.filterIcon).toBeVisible();
    await expect(cmPage.coloumnsIcon).toBeVisible();
    await expect(cmPage.refreshIcon).toBeVisible();
  });
});

test.describe("Process Instance table filter - Configuration Screen Test", () => {
  test("31.Validate 'Find Instances', 'Show Adhoc Tasks', 'Refresh icon' and 'Column Selector' functionality in Process Instance Table Filter screen", async () => {
    await configPage.navigateToConfigProcess();

    expect(await configPage.isShowFindInstances()).toBeTruthy();
    expect(await configPage.isshowRefreshIcon()).toBeTruthy();
    expect(await configPage.isshowColumnSelector()).toBeTruthy();

    await configPage.showfindInstances.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isShowFindInstances()).toBeFalsy();
    await configPage.showRefreshIcon.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isshowRefreshIcon()).toBeFalsy();
    await configPage.showColumnSelector.click();
    await page.waitForTimeout(1000);
    expect(await configPage.isshowColumnSelector()).toBeFalsy();
    await page.waitForTimeout(3000);
    await configPage.clickonSaveButton();

    await page.waitForTimeout(2000);
    expect(await processPage.processPage.click());
    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(2000);
    await expect(processPage.findInstances).toBeHidden();
    await expect(processPage.refreshInstances).toBeHidden();
    await expect(processPage.columnSelector).toBeHidden();

    await configPage.navigateToConfigProcess();
    expect(await configPage.isShowFindInstances()).toBeTruthy();
    expect(await configPage.isshowRefreshIcon()).toBeTruthy();
    expect(await configPage.isshowColumnSelector()).toBeTruthy();
    expect(await processPage.processPage.click());
    await page.waitForTimeout(1000);
  });

  test("32.Validate 'Cancel Instances', 'Resume' and 'Suspend Button' functionality in Process Instance Table Filter screen", async () => {
    await configPage.navigateToConfigProcessNoReset();
    await configPage.expandResumeSuspendSections();

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

    expect(await processPage.processPage.click());
    await page.waitForTimeout(1000);
    await configPage.selectAuditForProjectProcessAndOpenMenu();

    await expect(processPage.cancelInstances).toBeHidden();
    await expect(processPage.resumeTasks).toBeHidden();
    await expect(processPage.suspendTasks).toBeHidden();

    await configPage.navigateToConfigProcess();

    expect(await processPage.processPage.click());
    await page.waitForTimeout(1000);
    await configPage.selectAuditForProjectProcessAndOpenMenu();

    await expect(processPage.cancelInstances).toBeVisible();
    await expect(processPage.resumeTasks).toBeVisible();
    await expect(processPage.suspendTasks).toBeVisible();
  });
});

test.afterAll(async () => {
  //await page.close();
});
