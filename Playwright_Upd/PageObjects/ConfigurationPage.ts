import { expect, Locator, Page } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class ConfigurationPage {
  readonly page: Page;
  readonly setting: Locator;
  readonly settingmenu: Locator;
  readonly configurationbtn: Locator;
  readonly configtitle: Locator;
  readonly caseDetails: Locator;
  readonly caseDocuments: Locator;
  readonly caseDocumentViewver: Locator;
  readonly caseDocumentViewerCheckbox: Locator;
  readonly caseTypes: Locator;
  readonly cases: Locator;
  readonly audit: Locator;
  readonly globalHeader: Locator;
  readonly navbarHeaderTools: Locator;
  readonly processInstanceTableFilter: Locator;
  readonly processTemplates: Locator;
  readonly userProfiles: Locator;
  readonly workList: Locator;
  readonly workItems: Locator;
  readonly unifiedViews: Locator;

  readonly saveBtn: Locator;
  readonly resetDefaultBtn: Locator;
  readonly cancelBtn: Locator;

  readonly AdhocTask: Locator;
  readonly caseDetailsRefresh: Locator;
  readonly caseStateComponent: Locator;
  readonly caseDataComponent: Locator;
  readonly caseWorkItemComponent: Locator;
  readonly linkedCaseComponent: Locator;
  readonly caseDocumentComponent: Locator;
  readonly caseAuditComponent: Locator;

  readonly casedocumentsdownload: Locator;
  readonly casedocumentsdelete: Locator;
  readonly casedocumentsdescriptioncontainer: Locator;
  readonly casetypename: Locator;
  readonly applicationMajorVersion: Locator;
  readonly cmCaseDetailsRefreshIcon: Locator;
  readonly casename: Locator;
  readonly bomcasename: Locator;
  readonly configcasenamerow: Locator;
  readonly cmAdhoctaskbutton: Locator;
  readonly cmcaseStateComponent: Locator;

  readonly cmcaseDataComponent: Locator;
  readonly cmcaseDataComponent1: Locator;
  readonly cmcaseDataComponent2: Locator;
  readonly cmcaseWorkItemComponent: Locator;
  readonly cmlinkedCaseComponent: Locator;
  readonly cmcaseDocumentComponent: Locator;
  readonly cmcaseAuditComponent: Locator;
  readonly cmcaseDocdeleteicon: Locator;
  readonly cmcasejpgdeleteicon: Locator;
  readonly cmcasedocdownloadicon: Locator;
  readonly cmcasejpgdownloadicon: Locator;
  readonly cmcaseDocumentdeleteicon: Locator;
  readonly cmcaseDocumentdownloadicon: Locator;
  readonly cmdocdeletebutton: Locator;
  readonly casetyperefresh: Locator;
  readonly cmcasetyperefreshicon: Locator;
  readonly cmcasetypename: Locator;
  readonly cmapplicationMajorVersion: Locator;

  //Audit
  readonly commonAuditShowFilter: Locator;
  readonly commonAuditShowTable: Locator;
  readonly allWorkItem: Locator;
  readonly auditFilterAddNewIcon: Locator;

  //Work View
  readonly showWorkViewTypes: Locator;
  readonly showEditWorkView: Locator;
  readonly showDeleteWorkView: Locator;
  readonly showWorkViewFilter: Locator;
  readonly showCreateView: Locator;

  //Work List
  readonly showAutoRefresh: Locator;
  readonly showAllocateToSelf: Locator;
  readonly showPend: Locator;
  readonly showAutoRepeat: Locator;
  readonly showFilter: Locator;
  readonly showSort: Locator;
  readonly showRefresh: Locator;
  readonly showCancel: Locator;
  readonly showRelloacateToWorld: Locator;
  readonly showRelloacateToOfferSet: Locator;
  readonly showReoffer: Locator;
  readonly showAdhocTasks: Locator;
  readonly showSkip: Locator;
  readonly showWorkListActions: Locator;
  readonly showWorkItemActions: Locator;
  readonly showWorkListTableActionsColumn: Locator;
  readonly showWorkListTableOpenActionButton: Locator;
  readonly showWorkListMenuActionEllipsis: Locator;
  readonly showPriority: Locator;
  readonly showOpenNext: Locator;
  readonly cancelButton: Locator;

  //Prcoess Templates
  readonly showTemplateMoreMenu: Locator;
  readonly showTemplateRefresh: Locator;
  readonly showTemplateFilterIcon: Locator;
  readonly showInstanceStartButton: Locator;
  readonly showTemplateTags: Locator;

  //Cases
  readonly showCasesSearch: Locator;
  readonly showCasesFilter: Locator;
  readonly showCasesColumnSelector: Locator;
  readonly showCasesRefresh: Locator;

  //Process Instace table filter
  readonly showfindInstances: Locator;
  readonly showAdhocTask: Locator;
  readonly showCancelInstance: Locator;
  readonly showResumeTasks: Locator;
  readonly showSuspendTasks: Locator;
  readonly showRefreshIcon: Locator;
  readonly showColumnSelector: Locator;

  //User Profile
  readonly showThemeSwitcher: Locator;
  readonly showLanguageSwitcher: Locator;
  readonly showSignOut: Locator;
  readonly showProductNameVersion: Locator;
  readonly showProductCopyRight: Locator;

  //Navbar Header Tool
  readonly userProfile: Locator;
  readonly applicationSwitcher: Locator;

  //Global header
  readonly headerLogo: Locator;
  readonly headerLogoInput: Locator;
  readonly appTitle: Locator;
  readonly appTitleInput: Locator;
  readonly headerAppTitle: Locator;

  readonly signOutUrl: Locator;
  readonly signoutUrlText: Locator;

  //Case Doc - show case doc delete/download
  readonly showCaseDocumentsDeleteLabel: Locator;
  readonly showCaseDocumentsDeleteDescription: Locator;
  readonly showCaseDocumentsDownloadLabel: Locator;
  readonly showCaseDocumentsDownloadDescription: Locator;

  //Case types - Refresh/Name/ApplicationMajorVersion
  readonly showCaseTypesRefresh: Locator;
  readonly showCaseTypesRefreshDescription: Locator;
  readonly showCaseTypesName: Locator;
  readonly showCaseTypesNameDescription: Locator;
  readonly showCaseTypesApplicationMajorVersion: Locator;
  readonly showCaseTypesApplicationMajorVersionDescription: Locator;

  //Case document viewer
  readonly showCaseDocumentViewerDocumentContainer: Locator;
  readonly showCaseDocumentViewerDocumentContainerDescription: Locator;


  constructor(page: Page) {
    this.page = page;
    this.setting = page.locator('twc-icon[name="settings"]');
    this.settingmenu = page.locator('twc-menu[role$="menu"]');
    this.configurationbtn = page.locator(
      'twc-menu-item[value$="configuration"]'
    );
    this.configtitle = page.locator('div[title = "Configuration"]');

    //COnfig screen all sub screen option
    this.caseDetails = page.locator('twc-list-item[value="case-details"]');
    this.caseDocuments = page.locator('twc-list-item[value="case-documents"]');
    this.caseDocumentViewver = page.locator(
      'twc-list-item[value="case-documents-viewer"]'
    );

    this.caseTypes = page.locator('twc-list-item[value="case-types"]');
    this.cases = page.locator('twc-list-item[value="cases"]');
    this.audit = page.locator('twc-list-item[value="audit"]');
    this.globalHeader = page.locator('twc-list-item[value="navbarHeader"]');
    this.navbarHeaderTools = page.locator(
      'twc-list-item[value="navbarHeaderTools"]'
    );
    this.caseDocumentViewerCheckbox = page.locator(
      "#show-case-documents-description-container"
    );
    this.processInstanceTableFilter = page.locator(
      'twc-list-item[value="processTableFilter"]'
    );
    this.processTemplates = page.locator(
      'twc-list-item[value="process-templates"]'
    );
    this.userProfiles = page.locator('twc-list-item[value="userProfile"]');
    this.workItems = page.locator('twc-list-item[value="work-view"]');
    this.workList = page.locator('twc-list-item[value="work-list"]');
    //this.unifiedViews = page.locator('twc-list-item[value="unified-views"]');
    this.unifiedViews = page.getByRole('menuitem', { name: 'Unified views' })
    //this.createWorkView = page.locator('twc-list-item[value="work-view"]');

    //buttons
    this.saveBtn = page.getByText("Save");
    this.resetDefaultBtn = page.getByText("Reset default");
    this.cancelBtn = page.getByText("Cancel");
    this.cancelButton = page
      .locator("twc-button.cancel-button")
      .locator("button");

    this.AdhocTask = page.locator("#show-adhoc-tasks");
    this.cmAdhoctaskbutton = page.locator("twc-button[variant='primary']");
    this.caseDetailsRefresh = page.locator("#show-case-details-refresh");
    // this.cmCaseDetailsRefreshIcon = page.locator(
    //   "twc-icon[name='arrow-clockwise'][slot='icon']"
    // );
    this.cmCaseDetailsRefreshIcon = page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Refresh Refresh" })
      .locator("twc-icon");
    this.caseStateComponent = page.locator("#show-case-state-component");
    this.cmcaseStateComponent = page.locator(".menu-states");
    this.caseDataComponent = page.locator("#show-case-data-component");
    this.cmcaseDataComponent = page.locator(".tf-resp-row");
    this.cmcaseDataComponent1 = page.locator("bpme-case-data");
    this.cmcaseDataComponent2 = page.locator("bpme-case-data");
    //this.cmcaseDataComponent2 = page.getByText("caseState1 Created autoCaseIdentifier1 1 Name QA Surname TESTING");
    // this.caseManagercaseDataComponent3 = page.locator('#f1_widget_pane_messages-resp-row')
    this.caseWorkItemComponent = page.locator(
      "#show-case-work-items-component"
    );
    this.cmcaseWorkItemComponent = page.getByText("Work items").first();
    this.linkedCaseComponent = page.locator("#show-linked-cases-component");
    this.cmlinkedCaseComponent = page.locator(
      "twc-navmenu-item[label='Linked cases']"
    ); //getByText('Linked cases').first();
    this.caseDocumentComponent = page.locator("#show-case-document-component");
    this.cmcaseDocumentComponent = page.locator(
      "twc-navmenu-item[label='Documents']"
    ); //getByText('Documents').first();
    this.caseAuditComponent = page.locator("#show-case-audit-component");
    this.cmcaseAuditComponent = page.locator("twc-navmenu-item[label='Audit']");
    this.casedocumentsdelete = page.locator("#show-case-documents-delete");
    this.cmcaseDocumentdeleteicon = page.locator("svg[class='bi bi-trash3']");
    this.cmcaseDocdeleteicon = page.getByRole("menuitem", {
      name: "SampleDOC.doc Description for",
    });
    this.cmcasejpgdeleteicon = page.getByRole("menuitem", {
      name: "SampleJPG.jpg Description for",
    });
    this.casedocumentsdownload = page.locator("#show-case-documents-download");
    this.cmcaseDocumentdownloadicon = page.locator(
      "svg[class='bi bi-download']"
    );
    this.cmcasedocdownloadicon = page.getByRole("menuitem", {
      name: "SampleDOC.doc Description for",
    });
    this.cmcasejpgdownloadicon = page.getByRole("menuitem", {
      name: "SampleJPG.jpg Description for",
    });
    this.casedocumentsdescriptioncontainer = page.locator(
      "#show-case-documents-description-container"
    );
    this.casetyperefresh = page.locator("#show-case-types-refresh");
    this.cmcasetyperefreshicon = page
      .locator("twc-icon[name='arrow-clockwise']")
      .nth(0);
    this.casetypename = page.locator("#show-case-name");
    this.cmcasetypename = page
      .locator("twc-list-item")
      .filter({ hasText: "com.example.testbdsproject" });
    this.applicationMajorVersion = page.locator(
      "#show-applicationMajorVersion"
    );
    this.cmapplicationMajorVersion = page.locator("twc-list-item", {
      has: page.locator("div", { hasText: "ConfigCase1" }),
    });
    this.casename = page.getByText("ConfigCase1", { exact: true });
    this.bomcasename = page.getByText("com.example.testbdsproject", {
      exact: true,
    });
    this.configcasenamerow = page.locator("twc-table-row").first();
    this.cmdocdeletebutton = page.getByRole("button", { name: "Close" });

    //Audit
    this.commonAuditShowFilter = page.locator("#show-filter");
    this.commonAuditShowTable = page.locator("#show-table");
    this.allWorkItem = page.locator("#defaultListItem");

    //Work View
    this.auditFilterAddNewIcon = page.locator("twc-icon[name='add-new']");
    this.showWorkViewTypes = page.locator("#show-work-view-types");
    this.showEditWorkView = page.locator("#show-edit-work-view");
    this.showDeleteWorkView = page.locator("#show-delete-work-view");
    this.showWorkViewFilter = page.locator("#show-work-view-filter");
    this.showCreateView = page.locator("#show-create-view");

    //Work List
    this.showAutoRefresh = page.locator("#show-auto-refresh");
    this.showAllocateToSelf = page.locator("#show-allocate-to-self");
    this.showPend = page.locator("#show-pend");
    this.showAutoRepeat = page.locator("#show-auto-repeat");
    this.showFilter = page.locator("#show-filter");
    this.showSort = page.locator("#show-sort");
    this.showRefresh = page.locator("#show-refresh");
    this.showCancel = page.locator("#show-cancel");
    this.showRelloacateToWorld = page.locator("#show-reallocate-to-world");
    this.showRelloacateToOfferSet = page.locator(
      "#show-reallocate-to-offer-set"
    );
    this.showReoffer = page.locator("#show-reoffer");
    this.showAdhocTasks = page.locator("#show-adhoc-tasks");
    this.showSkip = page.locator("#show-skip");
    this.showWorkListActions = page.locator("#show-work-list-actions");
    this.showWorkItemActions = page.locator("#show-work-item-actions");
    this.showWorkListTableActionsColumn = page.locator(
      "#show-work-list-table-actions-column"
    );
    this.showWorkListTableOpenActionButton = page.locator(
      "#show-work-list-table-open-action-button"
    );
    this.showWorkListMenuActionEllipsis = page.locator(
      "#show-work-list-table-menu-action-ellipsis"
    );
    this.showPriority = page.locator("#show-priority");
    this.showOpenNext = page.locator("#show-open-next");

    //Process Template
    this.showTemplateMoreMenu = page.locator("#show-template-more-menu");
    this.showTemplateRefresh = page.locator("#show-template-refresh");
    this.showTemplateFilterIcon = page.locator("#show-template-filter");
    this.showInstanceStartButton = page.locator("#show-instance-start");
    this.showTemplateTags = page.locator("#show-template-tags");

    //Cases
    this.showCasesSearch = page.locator("#show-cases-search");
    this.showCasesFilter = page.locator("#show-cases-filter");
    this.showCasesColumnSelector = page.locator("#show-cases-columns-selector");
    this.showCasesRefresh = page.locator("#show-cases-refresh");

    //Process Instance table filter
    this.showfindInstances = page.locator("#show-find-instance-button");
    this.showAdhocTask = page.locator("#show-ad-hoc-tasks");
    this.showCancelInstance = page.locator("#show-cancel-instances-button");
    this.showResumeTasks = page.locator("#show-resume-tasks");
    this.showSuspendTasks = page.locator("#show-suspend-tasks");
    this.showRefreshIcon = page.locator("#show-refresh-instances-icon-button");
    this.showColumnSelector = page.locator("#show-column-selector-icon-button");

    //User Profile
    this.showThemeSwitcher = page.locator("#show-themes");
    this.showLanguageSwitcher = page.locator("#show-languages");
    this.showSignOut = page.locator("#show-sign-out");
    this.showProductNameVersion = page.locator("#show-product-version");
    this.showProductCopyRight = page.locator("#show-copy-right");

    //Navbar Header Tools
    this.userProfile = page.locator("#showProfile");
    this.applicationSwitcher = page.locator("#showApplicationSwitcher");

    //Global header
    this.headerLogo = page
      .locator("div#property_logURL.property-container")
      .locator("div.property-label");
    this.headerLogoInput = page.locator("#property__logURL").getByLabel("");
    this.appTitle = page.locator("#property__appTitle");
    this.appTitleInput = page.locator("#property__appTitle").getByLabel("");
    this.headerAppTitle = page.locator("div.application-title");

    this.signOutUrl = page.locator(".input__control");
    this.signoutUrlText = page
      .locator("#property__signOutURL")
      .locator('twc-input[type="text"]')
      .locator("#input");

    this.showCaseDocumentsDeleteLabel = page.locator('#property__show-case-documents-delete .property-label');
    this.showCaseDocumentsDeleteDescription = page.locator('#property__show-case-documents-delete .property-description');
    this.showCaseDocumentsDownloadLabel = page.locator('#property__show-case-documents-download .property-label');
    this.showCaseDocumentsDownloadDescription = page.locator('#property__show-case-documents-download .property-description');

    this.showCaseTypesApplicationMajorVersion = page.locator('#property__show-applicationMajorVersion .property-label');
    this.showCaseTypesApplicationMajorVersionDescription = page.locator('#property__show-applicationMajorVersion .property-description');
    this.showCaseTypesName = page.locator('#property__show-case-name .property-label');
    this.showCaseTypesNameDescription = page.locator('#property__show-case-name .property-description');
    this.showCaseTypesRefresh = page.locator('#property__show-case-types-refresh .property-label');
    this.showCaseTypesRefreshDescription = page.locator('#property__show-case-types-refresh .property-description');

    this.showCaseDocumentViewerDocumentContainer = page.locator('#property__show-case-documents-description-container .property-label');
    this.showCaseDocumentViewerDocumentContainerDescription = page.locator('#property__show-case-documents-description-container .property-description');
  }

  //Setting scree Navigation
  async clickOnSetting() {
    await this.page.waitForTimeout(1000);
    await this.setting.click();
  }
  async clickOnsettingMenu() {
    await this.page.waitForTimeout(1000);
    await this.settingmenu.click();
  }
  async clickOnConfiguration() {
    await this.configurationbtn.click();
  }

  // case details componenets
  async clickOnCaseDetails() {
    await this.caseDetails.click();
  }
  async clickOnCaseDetailsRefresh() {
    await this.caseDetailsRefresh.click();
  }
  async clickOnCaseDetailsRefreshicon() {
    await this.cmCaseDetailsRefreshIcon.click();
  }

  // case document components
  async clickOnCaseDocument() {
    await this.caseDocuments.click();
  }
  async clickonDocumentDeletebutton() {
    await this.cmdocdeletebutton.click();
  }

  //case document viewer components
  async clickOnCaseDocumentViewver() {
    await this.caseDocumentViewver.click();
  }
  async clickOnCaseTypes() {
    await this.caseTypes.click();
  }
  async clickOnCases() {
    await this.cases.click();
  }
  async clickOnAudit() {
    await this.audit.click();
  }
  async clickOnGlobalHeader() {
    await this.globalHeader.click();
  }
  async clickOnNavbarHeaderTools() {
    await this.navbarHeaderTools.click();
  }
  async clickOnProcessInstanceTableFilter() {
    await this.processInstanceTableFilter.click();
  }
  async clickOnUserProfiles() {
    await this.userProfiles.click();
  }
  async clickOnWorkList() {
    await this.workList.click();
  }
  async clickOnWorkItems() {
    await this.workItems.click();
  }
  async clickOnUnifiedViews() {
    await this.unifiedViews.click();
  }
  //change
  async clickOnWorkView() {
    await this.workItems.click();
  }
  async clickonCancelButton() {
    await this.cancelBtn.click();
  }
  async clickonResetDefaultButton() {
    await this.resetDefaultBtn.click();
  }
  async clickonSaveButton() {
    await this.saveBtn.click();
  }
  async isAdhocTaskChecked(): Promise<boolean> {
    return await this.AdhocTask.isChecked();
  }
  async navigateToConfigAudit() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnAudit();
  }
  async isCommonAuditShowFilterChecked(): Promise<boolean> {
    return await this.commonAuditShowFilter.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCommonAuditShowTableChecked(): Promise<boolean> {
    return await this.commonAuditShowTable.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }

  //Work View
  async navigateToConfigWorView() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnWorkView();
    await this.clickonResetDefaultButton();
  }
  async isShowWorkViewTypesChecked(): Promise<boolean> {
    return await this.showWorkViewTypes.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowEditWorkTypesChecked(): Promise<boolean> {
    return await this.showEditWorkView.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowDeleteWorkTypesChecked(): Promise<boolean> {
    return await this.showDeleteWorkView.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowWorkViewFilterChecked(): Promise<boolean> {
    return await this.showWorkViewFilter.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowCreateViewChecked(): Promise<boolean> {
    return await this.showCreateView.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async getRandomId() {
    return Math.floor(Math.random() * 1000); // Random number between 0 and 999
  }
  async getRandomDescription() {
    const descriptions = [
      "Testing configuration A",
      "Testing config functionality",
      "Auto-generated for test",
      "Random test config",
      "Generated for automation",
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  //Work List
  async navigateToConfigWorList() {
    await this.clickOnSetting();
    await this.page.waitForTimeout(1000);
    await this.clickOnConfiguration();
    await this.page.waitForTimeout(1000);
    await this.clickOnWorkList();
    await this.clickonResetDefaultButton();
  }
  async isShowAutoRefreshChecked(): Promise<boolean> {
    return await this.showAutoRefresh.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowAllocateToSelfChecked(): Promise<boolean> {
    return await this.showAllocateToSelf.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowPendChecked(): Promise<boolean> {
    return await this.showPend.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowAutoRepeatChecked(): Promise<boolean> {
    return await this.showAutoRepeat.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowFitlerChecked(): Promise<boolean> {
    return await this.showFilter.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowSortChecked(): Promise<boolean> {
    return await this.showSort.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowRefreshChecked(): Promise<boolean> {
    return await this.showRefresh.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowCancelChecked(): Promise<boolean> {
    return await this.showCancel.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowRelloacateToWorldChecked(): Promise<boolean> {
    return await this.showRelloacateToWorld.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowRelloacateToOfferSetChecked(): Promise<boolean> {
    return await this.showRelloacateToOfferSet.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowReOfferChecked(): Promise<boolean> {
    return await this.showReoffer.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowAdhocTasksChecked(): Promise<boolean> {
    return await this.showAdhocTasks.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowSkipChecked(): Promise<boolean> {
    return await this.showSkip.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowWorkListActionsChecked(): Promise<boolean> {
    return await this.showWorkListActions.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowWorkItemActionsChecked(): Promise<boolean> {
    return await this.showWorkItemActions.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowWorkListTableActionsColumnChecked(): Promise<boolean> {
    return await this.showWorkListTableActionsColumn.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowWorkListTableOpenActionButtonnChecked(): Promise<boolean> {
    return await this.showWorkListTableOpenActionButton.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowWorkListMenuActionEllipsisChecked(): Promise<boolean> {
    return await this.showWorkListMenuActionEllipsis.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowPriorityChecked(): Promise<boolean> {
    return await this.showPriority.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowOpenNextChecked(): Promise<boolean> {
    return await this.showOpenNext.evaluate((el) => el.hasAttribute("checked"));
  }

  //Process Template
  async clickOProcessTemplate() {
    await this.processTemplates.click();
  }
  async navigateToConfigProcessTemplate() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOProcessTemplate();
    await this.clickonResetDefaultButton();
  }
  async isShowTemplateMoreMenuChecked(): Promise<boolean> {
    return await this.showTemplateMoreMenu.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowTemplateRefreshChecked(): Promise<boolean> {
    return await this.showTemplateRefresh.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowTemplateFilterIconChecked(): Promise<boolean> {
    return await this.showTemplateFilterIcon.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowInstanceStartButtonChecked(): Promise<boolean> {
    return await this.showInstanceStartButton.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowTemplatesTagsChecked(): Promise<boolean> {
    return await this.showTemplateTags.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }

  //Cases
  async navigatetoConfigCases() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnCases();
    await this.clickonResetDefaultButton();
  }
  async isShowCasesSearchChecked(): Promise<boolean> {
    return await this.showCasesSearch.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowCasesFilterChecked(): Promise<boolean> {
    return await this.showCasesFilter.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowCasesColumnSelectorChecked(): Promise<boolean> {
    return await this.showCasesColumnSelector.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowCasesRefreshChecked(): Promise<boolean> {
    return await this.showCasesRefresh.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }

  //Process Instance table filter
  async navigateToConfigProcess() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnProcessInstanceTableFilter();
    await this.clickonResetDefaultButton();
  }
  async isShowFindInstances(): Promise<boolean> {
    return await this.showfindInstances.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isshowAdhocTask(): Promise<boolean> {
    return await this.showAdhocTask.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isshowCancelInstance(): Promise<boolean> {
    return await this.showCancelInstance.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isshowResumeTasks(): Promise<boolean> {
    return await this.showResumeTasks.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isshowSuspendTasks(): Promise<boolean> {
    return await this.showSuspendTasks.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isshowRefreshIcon(): Promise<boolean> {
    return await this.showRefreshIcon.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isshowColumnSelector(): Promise<boolean> {
    return await this.showColumnSelector.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }

  //User Profile
  async navigateToConfigUserProfile() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnUserProfiles();
    await this.clickonResetDefaultButton();
  }
  async isShowThemesSwitcher(): Promise<boolean> {
    return await this.showThemeSwitcher.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowLanguageSwitcher(): Promise<boolean> {
    return await this.showLanguageSwitcher.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowSignOut(): Promise<boolean> {
    return await this.showSignOut.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowProductNameVersion(): Promise<boolean> {
    return await this.showProductNameVersion.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isShowProductCopyRight(): Promise<boolean> {
    return await this.showProductCopyRight.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }

  //Navbar Header Tools
  async navigateToConfigNavbarHeaderTools() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnNavbarHeaderTools();
    await this.clickonResetDefaultButton();
  }
  async isShowUserProfile(): Promise<boolean> {
    return await this.userProfile.evaluate((el) => el.hasAttribute("checked"));
  }
  async isShowApplicationSwitcher(): Promise<boolean> {
    return await this.applicationSwitcher.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async navigateToGlobalHeader() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnGlobalHeader();
    await this.clickonResetDefaultButton();
  }
  async selectOrderState() {
    await this.page.getByLabel("caseState1").first().selectOption("CREATED");
  }
  async enterOnlyMandatoryDetails() {
    await this.selectOrderState();
  }
  async isAdhoctaskChecked(): Promise<boolean> {
    return await this.AdhocTask.evaluate((el) => el.hasAttribute("checked"));
  }
  async isCaseDetailsRefreshChecked(): Promise<boolean> {
    return await this.caseDetailsRefresh.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCaseStateComponentChecked(): Promise<boolean> {
    return await this.caseStateComponent.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCaseDataComponentChecked(): Promise<boolean> {
    return await this.caseDataComponent.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCaseWorkItemComponentChecked(): Promise<boolean> {
    return await this.caseWorkItemComponent.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isLinkedCaseComponentChecked(): Promise<boolean> {
    return await this.linkedCaseComponent.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCaseDocumentComponentChecked(): Promise<boolean> {
    return await this.caseDocumentComponent.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCaseAuditComponentChecked(): Promise<boolean> {
    return await this.caseAuditComponent.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCaseDocumentsDeleteChecked(): Promise<boolean> {
    return await this.casedocumentsdelete.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCaseDocumentsDownloadChecked(): Promise<boolean> {
    return await this.casedocumentsdownload.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async isCaseDocumentsDescriptionContainerChecked(): Promise<boolean> {
    return await this.casedocumentsdescriptioncontainer.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }

  async iscasetyperefreshChecked(): Promise<boolean> {
    return await this.casetyperefresh.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }
  async iscasetypenameChecked(): Promise<boolean> {
    return await this.casetypename.evaluate((el) => el.hasAttribute("checked"));
  }
  async isapplicationMajorVersionChecked(): Promise<boolean> {
    return await this.applicationMajorVersion.evaluate((el) =>
      el.hasAttribute("checked")
    );
  }

  async validateAppVersion() {
    // Validate subtext
    expect(
      this.cmapplicationMajorVersion
        .locator("twc-list-item")
        .filter({
          has: this.page.locator("div").filter({ hasText: "ConfigCase1" }),
        })
        .locator('[slot="subText"]')
    );
    //('[slot="subText"]')).toHaveText('com.example.testbdsproject');

    // Validate version number
    expect(
      this.cmapplicationMajorVersion
        .locator("twc-list-item")
        .filter({
          has: this.page.locator("div").filter({ hasText: "ConfigCase1" }),
        })
        .locator('[slot="version"]')
    );
    //locator('[slot="version"]')).toHaveText('1');
  }
}

function customExpect(arg0: Locator) {
  throw new Error("Function not implemented.");
}

function locator(arg0: string) {
  throw new Error("Function not implemented.");
}
function clickOnsettingMenu() {
  throw new Error("Function not implemented.");
}
