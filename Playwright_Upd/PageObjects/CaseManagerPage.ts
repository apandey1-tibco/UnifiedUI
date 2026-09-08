import { type Locator, type Page, request, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class CaseManagerPage {
  readonly page: Page;
  readonly caseManager: Locator;
  readonly cmHeader: Locator;
  readonly backToCases: Locator;
  readonly createCase: Locator;
  readonly refreshCaseTypesIcon: Locator;
  readonly searchIcon: Locator;
  readonly filterIcon: Locator;
  readonly coloumnIcon: Locator;
  readonly coloumnsIcon: Locator
  readonly refreshIcon: Locator;
  readonly tableHeader: Locator;
  readonly caseColoumnHeader: Locator;
  readonly caseAvailableColoumnHeader: Locator;
  readonly caseSelectedColoumnHeader: Locator;
  readonly availableColoumnTextContents: Locator;
  readonly selectedColumnsTextContents: Locator;
  readonly upArrow: Locator;
  readonly appplyBtn: Locator;
  readonly cancelBtn: Locator;
  readonly caseOrder: Locator;
  readonly caseOrder_case1: Locator;
  readonly additionalOrder: Locator;
  readonly applicationForApproval: Locator;
  readonly adhocCase: Locator;
  readonly activeCases: Locator;
  //  readonly caseTypeName: Locator;
  readonly clearAllFilters: Locator;
  readonly caseFilterHeading: Locator;
  readonly submitBtn: Locator;
  readonly closeBtn: Locator;
  readonly documentList: Locator;
  readonly moreStates: Locator;

  readonly filterCardPanel: Locator;
  readonly filterCasesHeader: Locator;
  readonly filterConditionFieldSelector: Locator;
  readonly filterConditionOperatorSelector: Locator;
  readonly filterConditionValueField: Locator;
  readonly filterSearchButton: Locator;

  readonly docViewerDownloadButton: Locator;
  readonly docViewerDocumentDetails: Locator;
  readonly docViewerDescriptionValue: Locator;
  readonly docViewerLastUpdate: Locator;
  readonly docViewerLastUpdateBy: Locator;

  readonly globalServerSwitcherIcon: Locator;
  readonly closeRightSidePaneBtn: Locator;
  readonly localDataCaseState1: Locator;
  readonly localDataCaseID: Locator;
  readonly localDataFirstName: Locator;
  readonly localDataLastName: Locator;
  readonly updateCaseActionBtn: Locator;
  readonly updateFormCaseState1: Locator;
  readonly updateFormFirstName: Locator;
  readonly updateFormLastName: Locator;
  readonly updateFormSubmitBtn: Locator;
  readonly updateCaseActionBtn2nd: Locator;
  readonly localDataVerifyCaseState1: Locator;
  readonly localDataVerifyCaseID: Locator;
  readonly localDataVerifyFirstName: Locator;
  readonly localDataVerifyLastName: Locator;
  readonly caseRefVerifyCaseState1: Locator;
  readonly caseRefVerifyCaseID: Locator;
  readonly caseRefVerifyFirstName: Locator;
  readonly caseRefVerifyLastName: Locator;
  readonly viewCaseActionBtn: Locator;
  readonly viewFormCaseState1: Locator;
  readonly viewFormCaseID: Locator;
  readonly viewFormFirstName: Locator;
  readonly viewFormLastName: Locator;
  readonly workItemCancelBtn: Locator;
  readonly auditFormCaseState1: Locator;
  readonly auditFormCaseID: Locator;
  readonly auditFormFirstName: Locator;
  readonly auditFormLastName: Locator;

  //Unified UI
  readonly filterCaseHeader: Locator;
  readonly saveSearch: Locator;
  readonly saveSearchLabel: Locator;
  readonly saveSearchNameInput: Locator;
  readonly saveSearchDescriptionInput: Locator;
  readonly saveSearchCategoryInput: Locator;
  readonly saveBtn: Locator;
  readonly addRuleButton: Locator;
  readonly saveSearches: Locator;
  readonly testCategory: Locator;
  readonly testSavedSearch: Locator;
  readonly savedSearchThreeDots: Locator;
  readonly editMenuItem: Locator;
  readonly deleteMenuItem: Locator;
  readonly saveChangesBtn: Locator;
  readonly updatedFilterConditionValueField: Locator;

  //Create Advanced Case Search
  readonly createAdvancedCaseSearch: Locator;
  readonly caseViewsWizard: Locator;
  readonly details: Locator;
  readonly classInformation: Locator;
  readonly searchCondition: Locator;
  readonly sort: Locator;
  readonly summary: Locator;
  readonly columnSelectorCaseID: Locator;
  readonly selectedSortDataCaseID: Locator;
  readonly summaryName: Locator;
  readonly summaryDescription: Locator;
  readonly summaryCategory: Locator;
  readonly summarySearchCondition: Locator;
  readonly summaryCaseClassDetails: Locator;
  readonly summarySort: Locator;
  readonly caseactionstudy2: Locator;
  readonly caseTypeInfoApplicationForApproval: Locator;
  readonly next: Locator;
  readonly previous: Locator;
  readonly finish: Locator;

  //Case Action
  readonly updateCaseActionButton: Locator;
  readonly leftArrow: Locator;
  readonly showAdhocTask: Locator;
  adhocDialogCloseButton: any;

  constructor(page: Page) {
    this.page = page;
    this.caseManager = page.locator("#bpmCaseManager svg");
    this.caseFilterHeading = page
      .locator(".card-filter")
      .locator("[slot='header']");
    //changed
    //this.caseColoumnHeader = page.getByText("Cases column selector");
    this.caseColoumnHeader = page
      .locator(".dialog.column-selector-dialog")
      .locator("#title slot");
    this.caseAvailableColoumnHeader = page.getByText("Available Columns");
    this.caseSelectedColoumnHeader = page.getByText("Selected Columns");
    this.cmHeader = page.getByTitle("Case types", { exact: true });
    this.createCase = page.getByRole("button", { name: "create case" });
    this.activeCases = page.getByTitle("Active Cases");
    this.caseOrder = page
      .locator("twc-list-item")
      .getByTitle("Order", { exact: true });
    this.caseOrder_case1 = page
      .locator("twc-list-item")
      .getByTitle("Case1", { exact: true });
    this.availableColoumnTextContents = page.locator(
      ".selectedData > .content"
    ).first();
    this.additionalOrder = page
      .locator("twc-list-item")
      .getByTitle("AdditionalOrder", { exact: true });
    this.applicationForApproval = page
      .locator("twc-list-item")
      .getByTitle("ApplicationForApproval", { exact: true });
    this.adhocCase = page
      .locator("twc-list-item")
      .getByTitle("AdhocCase", { exact: true });
    this.submitBtn = page.getByText("Submit");
    this.cancelBtn = page.getByText("Cancel");
    this.closeBtn = page.getByTitle("Close");
    this.clearAllFilters = page.getByRole("button", {
      name: "Clear all filters",
    });

    this.upArrow = page
      .locator('#listSelector twc-tooltip')
      .filter({ hasText: 'Move selected item up' })
      .getByLabel('Settings');
    this.selectedColumnsTextContents = page.locator(
      "div > div.selectedData > div > twc-list-view"
    );

    this.backToCases = page
      .locator("twc-tooltip")
      .filter({ hasText: "Back to cases" })
      .locator("svg");
    this.coloumnIcon = page.getByLabel("Columns").getByRole("img");
    this.refreshCaseTypesIcon = page.locator('twc-split-panel twc-sidebar twc-toolbar-item').filter({ hasText: 'Refresh' }).locator('twc-icon');
    this.filterIcon = page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Filter Filter" })
      .locator("svg");
    this.coloumnsIcon = page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Columns" })
      .locator("svg");
    this.searchIcon = page.locator(".search-icon").nth(1);
    this.refreshIcon = page
      .locator(".arrow-clockwise")
      .locator("svg[class='bi bi-arrow-clockwise']");
    this.tableHeader = page.locator("twc-table-head");
    this.appplyBtn = page.getByRole("button", { name: "Apply" });
    this.documentList = page.locator('twc-sidebar[label="Documents"] twc-list-view');
    this.moreStates = page.locator("twc-progress-state[laststep]").locator(".progress-state-label-container ").locator("div[part='progress-state-label']");

    this.filterCardPanel = page.locator(".card-filter");
    this.filterCasesHeader = page.locator(".card-filter").locator("[slot='header']");
    this.filterConditionFieldSelector = page.locator(".card-filter").locator("twc-select, select").first();
    this.filterConditionOperatorSelector = page.locator(".card-filter").locator("twc-select, select").nth(1);
    this.filterConditionValueField = page.locator(".operatorDataField");
    this.updatedFilterConditionValueField = page.locator("bpme-load-saved-views").locator(".operatorDataField").first();
    this.filterSearchButton = page.locator(".advanced-search-cases");

    this.docViewerDocumentDetails = page.locator('div.document-details-container >> div.document-details');
    this.docViewerDownloadButton = page.locator('div.document-details-container >> twc-button[variant="primary"]');
    this.docViewerDescriptionValue = page.locator('div.document-details-container >> div.attr-label').nth(0);
    this.docViewerLastUpdate = page.locator('div.document-details-container >> div.attr-label').nth(1);
    this.docViewerLastUpdateBy = page.locator('div.document-details-container >> div.attr-value').nth(1);
    this.globalServerSwitcherIcon = page.locator('twc-tooltip').filter({ hasText: 'You can change the' }).locator('twc-icon div');
    this.closeRightSidePaneBtn = page.getByTitle("Close");
    this.localDataCaseState1 = page.locator("#f1_widget_control_caseState1");
    this.localDataCaseID = page.locator("#f1_widget_control_caseID");
    this.localDataFirstName = page.locator("#f1_widget_control_firstName");
    this.localDataLastName = page.locator("#f1_widget_control_lastName");
    this.updateCaseActionBtn = page.locator('twc-button[title="Update Case ActionProject-NotAvailableForOther State"]');
    this.updateFormCaseState1 = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_Case1_caseState1");
    this.updateFormFirstName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_Case1_firstName");
    this.updateFormLastName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_Case1_lastName");
    this.updateFormSubmitBtn = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_submit");
    this.updateCaseActionBtn2nd = page.locator('twc-button.twc-button-group__button--inner[title="Update Case ActionProject-NotAvailableForOther State"]');
    this.localDataVerifyCaseState1 = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_LocalData_caseState1");
    this.localDataVerifyCaseID = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_LocalData_caseID");
    this.localDataVerifyFirstName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_LocalData_firstName");
    this.localDataVerifyLastName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_LocalData_lastName");
    this.caseRefVerifyCaseState1 = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_CaseRef_caseState1");
    this.caseRefVerifyCaseID = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_CaseRef_caseID");
    this.caseRefVerifyFirstName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_CaseRef_firstName");
    this.caseRefVerifyLastName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_CaseRef_lastName");
    this.viewCaseActionBtn = page.locator('twc-button[title="ViewCaseActionProject-NotAvailableInYesNo"]');
    this.viewFormCaseState1 = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_Case1_caseState1");
    this.viewFormCaseID = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_Case1_caseID");
    this.viewFormFirstName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_Case1_firstName");
    this.viewFormLastName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_Case1_lastName");
    this.workItemCancelBtn = page.frameLocator('iframe[id$="__tfc_iframe"]').locator("#f1_widget_control_cancel");
    this.auditFormCaseState1 = page.locator("#f4_widget_control_caseState1");
    this.auditFormCaseID = page.locator("#f4_widget_control_caseID");
    this.auditFormFirstName = page.locator("#f4_widget_control_firstName");
    this.auditFormLastName = page.locator("#f4_widget_control_lastName");

    //Unified UI
    this.filterCaseHeader = page.locator(".card-filter").getByText("Filter Cases");
    this.saveSearch = page.locator('twc-toolbar-item[label="Save search"]');
    this.saveSearchLabel = page.getByRole("heading", { name: "Save search" });
    this.saveSearchNameInput = page.locator('twc-input[name="name"]:visible').locator('input');
    this.saveSearchDescriptionInput = page.locator('twc-input[name="description"]:visible').locator('input');
    this.saveSearchCategoryInput = page.locator('twc-input[name="category"]:visible').locator('input');
    this.selectedSortDataCaseID = page.locator(".selectedData").locator("twc-list-item").filter({ hasText: "caseID" });
    this.saveBtn = page.getByRole('button', { name: 'Save', exact: true });
    this.addRuleButton = page.getByRole("button", { name: "Rule Add rule" });
    this.saveSearches = page.locator('twc-categoriser[label ="Saved Searches"]').first();
    this.testCategory = page.locator("div.trigger-item[title='Test Category']");
    this.testSavedSearch = page.locator("twc-tree-item[title='Test Saved Search']");
    this.savedSearchThreeDots = page.locator("twc-tree-item[title='Test Saved Search']")
      .locator("[name='three-dots-vertical']");
    this.editMenuItem = page.getByRole("menuitem", { name: "Edit" });
    this.deleteMenuItem = page.getByRole("menuitem", { name: "Delete" });
    this.saveChangesBtn = page.getByRole("button", { name: "Save Changes" });

    // Create Advanced Case Search
    this.createAdvancedCaseSearch = page.locator('twc-toolbar-item').filter({ hasText: 'Advanced Create Advanced Case' }).locator('svg');
    this.caseViewsWizard = page.getByLabel("Case Views Wizard");
    this.details = page.locator('twc-wizard-header').locator('twc-tooltip[content="Details"]');
    this.classInformation = page.locator('twc-wizard-header').locator('twc-tooltip[content="Class Information"]');
    this.searchCondition = page.locator('twc-wizard-header').locator('twc-tooltip[content="Search Condition"]');
    this.sort = page.locator('twc-wizard-header').locator('twc-tooltip[content="Sort"]');
    this.summary = page.locator('twc-wizard-header').locator('twc-tooltip[content="Summary"]');
    this.caseactionstudy2 = page.getByRole('menuitem', { name: 'com.example.caseactionstudy-2', exact: true });
    this.caseTypeInfoApplicationForApproval = page.getByRole('menuitem', { name: 'ApplicationForApproval', exact: true });
    this.columnSelectorCaseID = page.locator('twc-list-view').locator('twc-list-item').getByText("CaseID");
    this.summaryName = page.locator('twc-input[label="Name"][disabled]');
    this.summaryDescription = page.locator('twc-input[label="Description"][disabled]');
    this.summaryCategory = page.locator('twc-input[label="Category"][disabled]');
    this.summarySearchCondition = page.locator('twc-input[label="Search Condition"][disabled]');
    this.summaryCaseClassDetails = page.locator('twc-input[label="Case Class Details(Major Version)"][disabled]');
    this.summarySort = page.locator('twc-input[label="Sort"][disabled]');
    this.next = page.locator('twc-wizard-button[actiontype="next"]');
    this.previous = page.locator('twc-wizard-button[actiontype="previous"]');
    this.finish = page.locator('twc-wizard-button[actiontype="finish"]');

    this.updateCaseActionButton = page.locator('twc-button[title="Update Case ActionProject-NotAvailableForOther State"]');
    this.leftArrow = page.locator('twc-icon[name="left-arrow"]');
    this.showAdhocTask = page.getByRole("button", { name: "Show Ad-hoc tasks" });
  }

  async clickOnSearchCases() {
    await this.searchIcon.click();
  }
  async getTableHeader() {
    const txt = await this.tableHeader.innerText();
    return utility.convertStringToArray(txt);
  }
  async caseHeader() {
    return await this.cmHeader.innerText();
  }
  async activeCasestxt(): Promise<Locator> {
    return this.activeCases;
  }
  async caseName(caseName: string): Promise<Locator> {
    return this.page.getByRole("cell", { name: caseName });
  }
  async getcaseFilterheading() {
    return await this.caseFilterHeading.innerText();
  }
  async clickOnCaseOrder() {
    await this.caseOrder.click();
    await this.page.waitForTimeout(1500);
  }
  async clickOnCaseOrderCase1() {
    await this.caseOrder_case1.click();
    await this.page.waitForTimeout(1500);
  }
  async clickOnAdditionalOrder() {
    await this.additionalOrder.click();
  }
  async clickOnApplicationForApproval() {
    await this.page.waitForTimeout(1000);
    await this.applicationForApproval.click();
    await this.page.waitForTimeout(2000);
  }
  async clickOnAdhocCase() {
    await this.adhocCase.click();
    await this.page.waitForTimeout(2000);
  }
  async clickOnUpdateCaseActionBtn() {
    await this.updateCaseActionBtn.click();
    await this.page.locator('tibco-form').waitFor({ state: 'visible' });
  }
  async fillUpdateCaseActionForm(caseState1: string, firstName: string) {
    await this.updateFormCaseState1.waitFor({ state: "visible", timeout: 10000 });
    await this.updateFormCaseState1.selectOption(caseState1);
    await this.updateFormFirstName.waitFor({ state: "visible", timeout: 5000 });
    await this.updateFormFirstName.clear();
    await this.updateFormFirstName.fill(firstName);
  }
  async submitUpdateCaseActionForm() {
    await this.updateFormSubmitBtn.click();
  }
  async clickOnUpdateCaseActionBtn2nd() {
    await this.updateCaseActionBtn2nd.click();
    await this.page.locator('tibco-form').waitFor({ state: 'visible' });
  }
  async fillUpdateCaseActionForm2nd(caseState1: string, lastName: string) {
    await this.updateFormCaseState1.selectOption(caseState1);
    await this.updateFormLastName.clear();
    await this.updateFormLastName.fill(lastName);
  }
  async verifyViewCaseActionForm2nd(caseState1: string, lastName: string) {
    await expect(this.viewFormCaseState1).toHaveValue(caseState1);
    await expect(this.viewFormLastName).toHaveValue(lastName);
  }
  async verifyLocalDataSection(caseState1: string, firstName: string, lastName: string) {
    await expect(this.localDataVerifyCaseState1).toHaveValue(caseState1);
    await expect(this.localDataVerifyFirstName).toHaveValue(firstName);
    await expect(this.localDataVerifyLastName).toHaveValue(lastName);
  }
  async verifyCaseRefSection(caseState1: string, firstName: string, lastName: string) {
    await expect(this.caseRefVerifyCaseState1).toHaveValue(caseState1);
    await expect(this.caseRefVerifyFirstName).toHaveValue(firstName);
    await expect(this.caseRefVerifyLastName).toHaveValue(lastName);
  }
  async clickOnViewCaseActionBtn() {
    await this.viewCaseActionBtn.click();
    await this.page.locator('tibco-form').waitFor({ state: 'visible' });
  }
  async verifyViewCaseActionForm(caseState1: string, firstName: string) {
    await expect(this.viewFormCaseState1).toHaveValue(caseState1);
    await expect(this.viewFormFirstName).toHaveValue(firstName);
  }
  async navigateToCaseManager() {
    await this.caseManager.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(2000);
  }
  async clickOnSubmitBtn() {
    await this.submitBtn.click();
  }

  async casesRefreshIcon(): Promise<Locator> {
    return this.refreshIcon;
  }
  async getCaseTypeHeaderName(caseName: string) {
    return await this.page
      .locator(`twc-header[label='${caseName}']`)
      .locator(".header__title")
      .innerText();
  }
  async firstRow(): Promise<Locator> {
    return this.page.locator("twc-table-row").first();
  }
  async clickOnCaseByCaseId(caseId: string) {
    await this.page
      .locator(`twc-table-row[details*='"caseID":${caseId}']`)
      .click();
  }
  async filterChip(): Promise<Locator> {
    return this.page.locator("twc-tag");
  }
  async caseSearchIcon(): Promise<Locator> {
    return this.searchIcon;
  }
  async caseColoumnIcon(): Promise<Locator> {
    return this.page.locator("[name='view_column']");
  }
  async caseFilterIcon(): Promise<Locator> {
    return this.filterIcon;
  }

  async clickUpArrow() {
    await this.upArrow.click();
  }
  async caseTypesRefreshIcon(): Promise<Locator> {
    return this.refreshCaseTypesIcon;
  }

  async getActiveCaseDetails(name: string) {
    const details = await this.page
      .locator(`twc-table-row[details*='"name":"${name}"']`)
      .getAttribute("details");

    // return details;
    if (details) {
      const data: {
        casedata: {
          orderID: string;
          orderState: string;
          name: string;
          product: string;
          quantity: number;
          time: string;
        };
        metadata: {
          creationTimestamp: string;
        };
      } = JSON.parse(details);
      return data;
    }
  }
  async verifyFilledLocalDataForm(caseState1: string, caseId: string, firstName: string, lastName: string) {
    await expect(this.localDataCaseState1).toHaveText(caseState1);
    await expect(this.localDataCaseID).toHaveText(caseId);
    await expect(this.localDataFirstName).toHaveText(firstName);
    await expect(this.localDataLastName).toHaveText(lastName);
  }
  async verifySearch(value: string) {
    await this.page.locator('bpme-cases').getByRole('textbox').fill(value);
    await this.page.keyboard.press("Enter");
    await this.page.waitForTimeout(2000);

    // expect(recievedVal).toContain(value);
    // expect(this.page.locator("twc-table-row")).toHaveCount(1);
  }

  async verifyCaseTypeSearch(value: string) {
    await this.page.locator('bpme-case-types').getByRole('textbox').fill(value);
    await this.page.keyboard.press("Enter");
    await this.page.waitForTimeout(2000);
  }
  async tableRow(): Promise<Locator> {
    return this.page.locator("twc-table-row");
  }
  async getAvailableColoumnTextContents() {
    return await this.availableColoumnTextContents.innerText();
  }
  async getSelectedColoumnTextContent() {
    return await this.selectedColumnsTextContents.innerText();
  }
  async searchColoumn(): Promise<Locator> {
    return this.page.locator('#listSelector #input');
  }
  async verifySelectColoumnFromSearch(coloumnName: string) {
    (await this.searchColoumn()).click();
    (await this.searchColoumn()).fill(coloumnName);
    await this.page.waitForTimeout(1000);
    //await this.page.getByRole("menuitem").nth(1).click();
    //to check
    await this.page
      .locator(".availableData")
      .locator("twc-list-item")
      .first()
      .click();
  }
  async selectNameColoumn() {
    await this.page
      .locator(".selectedData")
      .getByText("Name", { exact: true })
      .click();
  }
  async selectActivityNameColoumn() {
    await this.page
      .locator(".selectedData")
      .getByText("Activity Name", { exact: true })
      .click();
  }
  async selectTypeColoumn() {
    await this.page
      .locator(".selectedData")
      .getByText("Type", { exact: true })
      .click();
  }
  async selectPriorityColoumn() {
    await this.page
      .locator(".selectedData")
      .getByText("Priority", { exact: true })
      .click();
  }
  async clickkOnclocseIcon() {
    await this.page.locator(".bi.bi-x-circle").first().click();
  }
  async nameCheckBox(): Promise<Locator> {
    return this.page
      .getByRole("menuitem", { name: "Name", exact: true })
      .locator("twc-checkbox label input");
  }
  async activityNameCheckBox(): Promise<Locator> {
    return this.page
      .getByRole("menuitem", { name: "Activity Name", exact: true })
      .locator("twc-checkbox label input");
  }
  async typeCheckBox(): Promise<Locator> {
    return this.page
      .getByRole("menuitem", { name: "Type", exact: true })
      .locator("twc-checkbox label input");
  }
  async clickkOnCloseIcon() {
    await this.page.locator(".bi.bi-x-circle").first().click();
  }
  async getBackToCases(): Promise<Locator> {
    return this.backToCases;
  }
  async getApplyBtn(): Promise<Locator> {
    return this.appplyBtn;
  }
  async getCancelBtn(): Promise<Locator> {
    return this.cancelBtn;
  }

  async caseColoumHeader(): Promise<Locator> {
    return this.caseColoumnHeader;
  }
  async availableColoumnHeader(): Promise<Locator> {
    return this.caseAvailableColoumnHeader;
  }
  async selectedColoumnHeader(): Promise<Locator> {
    return this.caseSelectedColoumnHeader;
  }

  async deleteCase(value: string) {
    // await this.page.getByLabel("More").getByRole("img").click();
    // await this.page
    //   .getByRole("menuitem", { name: "DeleteCase" })
    //   .locator("div")
    //   .first()
    //   .click();
    await this.page.getByRole("button", { name: "DeleteCase" }).click();
    await this.submitBtn.click();
    await this.page.waitForTimeout(2000);
  }
  async updateCase(name: string, orderID: string) {
    await this.page.getByRole("button", { name: "UpdateCase" }).click();
    await this.page.getByLabel("Name").fill(name);
    await this.page.getByLabel("Quantity").fill(orderID);
    await this.submitBtn.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(1000);
  }
  async clickOnviewCase() {
    await this.page.getByRole("button", { name: "ViewCase" }).click();
  }
  async createNewCase(orderID: string, orderState: string, name: string) {
    await this.createCase.click();
    await this.page.locator('input[id="f2_widget_control_caseBomType_name"]').fill(name);
    await this.page.getByLabel("OrderID").fill(orderID);
    await this.page.getByLabel("OrderState").selectOption(orderState);
    await this.submitBtn.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(1000);
  }
  async selectFilter(state: string) {
    await this.page.getByRole("combobox").click();
    await this.page
      .getByRole("option", { name: state })
      .locator("div")
      .first()
      .click();

    //calendar
    await expect(this.page.locator("#filterDate svg")).toBeVisible();
    expect(this.page.getByRole("button", { name: "Cancel" })).toBeVisible();
    expect(this.page.getByRole("button", { name: "Apply" })).toBeVisible();
    await this.page.getByRole("button", { name: "Apply" }).click();
  }
  async validateFilterCasesPopup(): Promise<string> {
    await this.filterCardPanel.waitFor({ state: "visible" });
    return await this.caseFilterHeading.innerText();
  }

  async addFilterCondition(fieldName: string, operator: string, value: string): Promise<void> {
    await this.filterConditionFieldSelector.click();
    const fieldOption = this.page.getByRole("option", { name: fieldName, exact: true });
    await fieldOption.waitFor({ state: "visible", timeout: 5000 });
    await fieldOption.click();

    await this.filterConditionOperatorSelector.click();
    const exactOperator = this.page.getByRole("option", { name: operator, exact: true }).first();
    const partialOperator = this.page.locator(`[role="option"]`).filter({ hasText: operator }).first();
    const operatorOption = (await exactOperator.count()) > 0 ? exactOperator : partialOperator;
    await operatorOption.waitFor({ state: "visible", timeout: 5000 });
    await operatorOption.click();

    await this.filterConditionValueField.waitFor({ state: "visible", timeout: 5000 });
    await this.filterConditionValueField.click();
    await this.filterConditionValueField.pressSequentially(value);
  }

  async clickFilterSearch(): Promise<void> {
    await this.filterSearchButton.waitFor({ state: "visible", timeout: 5000 });
    await this.filterSearchButton.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(3000);
  }

  async selectFilterOperator(operator: string): Promise<void> {
    await this.filterConditionOperatorSelector.click();
    const exactOption = this.page.getByRole("option", { name: operator, exact: true }).first();
    const partialOption = this.page.locator(`[role="option"]`).filter({ hasText: operator }).first();
    const target = (await exactOption.count()) > 0 ? exactOption : partialOption;
    await target.waitFor({ state: "visible", timeout: 5000 });
    await target.click();
  }

  async fillFilterValue(value: string): Promise<void> {
    await this.filterConditionValueField.waitFor({ state: "visible", timeout: 5000 });
    await this.filterConditionValueField.click();
    await this.filterConditionValueField.pressSequentially(value);
  }

  async selectFilterValue(value: string): Promise<void> {
    await this.filterConditionValueField.waitFor({ state: "visible", timeout: 5000 });
    await this.filterConditionValueField.click();
    const exactOption = this.page.getByRole("option", { name: value, exact: true }).first();
    const partialOption = this.page.locator(`[role="option"]`).filter({ hasText: value }).first();
    const option = (await exactOption.count()) > 0 ? exactOption : partialOption;
    await option.waitFor({ state: "visible", timeout: 5000 });
    await option.click();
  }

  async selectUpdatedFilterValue(value: string): Promise<void> {
    await this.updatedFilterConditionValueField.waitFor({ state: "visible", timeout: 5000 });
    await this.updatedFilterConditionValueField.click();
    const exactOption = this.page.getByRole("option", { name: value, exact: true }).first();
    const partialOption = this.page.locator(`[role="option"]`).filter({ hasText: value }).first();
    const option = (await exactOption.count()) > 0 ? exactOption : partialOption;
    await option.waitFor({ state: "visible", timeout: 5000 });
    await option.click();
  }

  async getTableRowsApplicationIds(): Promise<number[]> {
    const rows = this.page.locator("twc-table-row");
    await rows.first().waitFor({ state: "visible", timeout: 10000 });
    const rowCount = await rows.count();
    const appIds: number[] = [];
    for (let i = 0; i < rowCount; i++) {
      const detailsAttr = await rows.nth(i).getAttribute("details");
      if (detailsAttr) {
        try {
          const parsed = JSON.parse(detailsAttr);
          const casedata = parsed.casedata ?? parsed;
          const id =
            parsed.caseID ?? parsed.caseId ??
            parsed.applicationId ?? parsed.applicationID ??
            parsed.appId ?? parsed.appID ??
            casedata.caseID ?? casedata.caseId ??
            casedata.applicationId ?? casedata.applicationID ??
            casedata.appId ?? casedata.appID;
          if (id !== undefined) appIds.push(Number(id));
        } catch {
          // skip malformed rows
        }
      }
    }
    return appIds;
  }

  async verifyAllCaseIDsGreaterThanOrEqual(minId: number): Promise<void> {
    const ids = await this.getTableRowsApplicationIds();
    expect(ids.length).toBeGreaterThan(0);
    for (const id of ids) {
      expect(id, `Case ID ${id} is not >= ${minId}`).toBeGreaterThanOrEqual(minId);
    }
  }

  async verifyAllRowsCaseState(expectedState: string): Promise<void> {
    const rows = this.page.locator("twc-table-row");
    await rows.first().waitFor({ state: "visible", timeout: 10000 });
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(0);
    for (let i = 0; i < rowCount; i++) {
      const detailsAttr = await rows.nth(i).getAttribute("details");
      if (detailsAttr) {
        const parsed = JSON.parse(detailsAttr);
        const casedata = parsed.casedata ?? parsed;
        const state = casedata.caseState1 ?? casedata.caseState ?? casedata.casestate;
        expect(state, `Row ${i}: expected caseState "${expectedState}" but got "${state}"`).toBe(expectedState);
      }
    }
  }

  async confirmCloseWarning(): Promise<void> {
    const yesCloseBtn = this.page.getByRole("button", { name: "Yes, close" });
    try {
      await yesCloseBtn.waitFor({ state: "visible", timeout: 3000 });
      await yesCloseBtn.click();
    } catch {
      // dialog did not appear — navigation already completed, continue
    }
  }

  async verifyRowCaseIDAndState(expectedCaseId: string | number, expectedState: string): Promise<void> {
    const rows = this.page.locator("twc-table-row");
    await rows.first().waitFor({ state: "visible", timeout: 20000 });
    const rowCount = await rows.count();
    expect(rowCount, "No rows found in the table").toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const detailsAttr = await rows.nth(i).getAttribute("details");
      if (!detailsAttr) continue;

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(detailsAttr);
      } catch {
        continue;
      }

      const casedata = (parsed.casedata as Record<string, unknown>) ?? parsed;
      const rowCaseId =
        parsed.caseID ?? parsed.caseId ??
        casedata.caseID ?? casedata.caseId;

      if (String(rowCaseId) !== String(expectedCaseId)) continue;

      const state =
        casedata.caseState1 ?? casedata.caseState ?? casedata.casestate;

      expect(
        state,
        `Row with caseID "${expectedCaseId}": expected caseState "${expectedState}" but got "${state}"`
      ).toBe(expectedState);
      return;
    }

    throw new Error(`No row found with caseID "${expectedCaseId}"`);
  }

  async clickonSaveSearch() {
    await this.saveSearch.click();
    await this.page.waitForTimeout(2000);
  }

  async clickonSaveSearches() {
    await this.saveSearches.click();
    await this.page.waitForTimeout(2000);
  }

  async openSavedSearches() {
    await this.testCategory.click();
    await this.testSavedSearch.click();
    await this.page.waitForTimeout(2000);
  }

  async confirmDeleteSavedSearch() {
    const dialog = this.page.locator('twc-dialog.dialog-delete-savedSearch');
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('text=Delete saved search')).toBeVisible();
    await expect(dialog.locator('text=Are you sure you want to do this?')).toBeVisible();
    await dialog.getByRole('button', { name: 'Yes' }).click();
    await expect(dialog).not.toBeVisible();
  }

  async clickThreeDotsOnSavedSearch() {
    await this.testSavedSearch.hover();
    await this.page.waitForTimeout(500);
    await this.savedSearchThreeDots.click({ force: true });
  }

  async clickEditFromContextMenu() {
    await this.editMenuItem.waitFor({ state: "visible", timeout: 5000 });
    await this.editMenuItem.click();
  }

  async clickDeleteFromContextMenu() {
    await this.deleteMenuItem.waitFor({ state: "visible", timeout: 5000 });
    await this.deleteMenuItem.click();
  }

  async changeSavedSearchCaseStateFilter(newValue: string) {
    const dropdown = this.page.locator("bpme-load-saved-views twc-select").filter({ hasText: newValue }).first()
      .locator("twc-popup div").first();
    const anyDropdown = this.page.locator("bpme-load-saved-views twc-select").first()
      .locator("twc-popup div").first();
    const trigger = (await dropdown.count()) > 0 ? dropdown : anyDropdown;
    await trigger.click();
    const exactOption = this.page.getByRole("option", { name: newValue, exact: true }).first();
    const partialOption = this.page.locator(`[role="option"]`).filter({ hasText: newValue }).first();
    const option = (await exactOption.count()) > 0 ? exactOption : partialOption;
    await option.waitFor({ state: "visible", timeout: 5000 });
    await option.click();
  }

  async clickSaveChanges() {
    await this.saveChangesBtn.waitFor({ state: "visible", timeout: 5000 });
    await this.saveChangesBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async fillSaveSearchForm(name: string, description: string, category: string) {
    await this.saveSearchNameInput.fill(name);
    await this.saveSearchDescriptionInput.fill(description);
    await this.saveSearchCategoryInput.fill(category);
    await this.page.waitForTimeout(2000);
  }

  async clickOnCaseFilterIcon() {
    await this.filterIcon.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnSaveSearches() {
    await this.saveSearches.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnCreateAdvanceCaseSearch() {
    await this.createAdvancedCaseSearch.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnNextBtn() {
    await this.next.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnFinishBtn() {
    await this.finish.click();
    await this.page.waitForTimeout(2000);
  }

  //Case Details
  //Linked Cases
  async clickOnLinkedCases() {
    await this.page.getByText("Linked cases").first().click();
  }
  async linkedCaseHeader() {
    return await this.page
      .locator("twc-header[label='Linked cases']")
      .locator(".header__title")
      .innerText();
  }
  async linkedCase(): Promise<Locator> {
    return this.page.locator("bpme-case-linked-cases").locator("twc-list-item");
  }

  async linkedCaseEmptyState(): Promise<Locator> {
    return this.page.locator('bpme-case-linked-cases div[part="empty-label"]');
  }
  async workItemsEmptyState(): Promise<Locator> {
    return this.page.locator("bpme-case-work-items >> div.empty-label");
  }
  async documentsEmptyState(): Promise<Locator> {
    return this.page.locator("bpme-case-documents >> div.empty-label");
  }
  async caseTypesEmptyState(): Promise<Locator> {
    return this.page.locator("bpme-empty-data-message >> div.empty-message");
  }
  async getCaseDocumentsVersion(): Promise<Locator> {
    return this.page.locator('div[slot="subText"]').locator('div').nth(2);
  }
  async getDisplayInlineParts(): Promise<string> {
    // get the 2nd display-inline (index 1 because nth is 0-based)
    const fullText = await this.page.locator('div.display-inline').nth(1).innerText();
    return fullText;
  }

  async getLastUpdatedByText(): Promise<string> {
    // get the 2nd display-inline (index 1 because nth is 0-based)
    const fullText = await this.docViewerLastUpdateBy.innerText();
    return fullText;
  }
  async caseDocsCancelButtonText() {
    return await await this.page
      .locator("twc-button[type='button'][slot='cancel']")
      .innerText();
  }
  async caseDocsDeleteConfirmationButtonText() {
    return await await this.page
      .locator("twc-button[type='button'][slot='confirm']")
      .innerText();
  }

  async linkedCaseState() {
    return await this.page
      .locator(
        ".component.control.control_AdditionalOrder_caseState1.control-label.control-non-list-mode.read-only"
      )
      .innerText();
  }
  //Case Details-- Work items
  async clickOnWorkItems() {
    await this.page.getByText("Work items").first().click();
    await this.page.waitForTimeout(1000);
  }
  async workItemsHeader() {
    return await this.page
      .locator("twc-header[label='Work items']")
      .locator(".header__title")
      .innerText();
  }
  async workItem(): Promise<Locator> {
    //return this.page.locator('//twc-sidebar[@label="Work items"]//twc-list-item[@role="menuitem"]');
    return this.page.locator('twc-list-item[role="menuitem"]').filter({ hasText: 'ViewLinkedCaseData' });
  }

  async linkedWorkItem(linkedWorkItem: string): Promise<Locator> {
    //return this.page.locator('//twc-sidebar[@label="Work items"]//twc-list-item[@role="menuitem"]');
    return this.page.locator('twc-list-item[role="menuitem"]').filter({ hasText: linkedWorkItem });
  }

  async clickOnWorkItemCancelBtn() {
    await this.workItemCancelBtn.click();
  }

  async closeWorkItem() {
    await this.page.getByRole("button", { name: "Close" }).click();
    await this.closeBtn.click();
  }
  async closeRightSidePane() {
    await this.page.getByRole("button", { name: "Close" }).click();
    await this.page.waitForTimeout(1000);
  }
  //Case Details Audit
  async clickOnAudit() {
    await this.page.locator("[name='case-audit']").click();
  }
  async auditHeader() {
    return await this.page
      .locator("twc-header[label='Audit']")
      .locator(".header__title")
      .innerText();
  }

  async auditTextContent() {
    return await this.page.locator(".audit-template").innerText();
  }
  async clickOnDownArrow() {
    await this.page.locator("twc-icon[name='chevron-down'][slot='trailing-close']").first().click();
  }
  async verifyAuditExpandedSection(caseState1: string, firstName: string, lastName: string) {
    const tibcoForm = this.page.locator('tibco-form[json2formdata]').first();
    await tibcoForm.waitFor({ state: 'attached', timeout: 15000 });
    const formDataStr = await tibcoForm.getAttribute('json2formdata');
    const formData = JSON.parse(formDataStr || '{}');
    expect(formData.caseState1).toBe(caseState1);
    expect(formData.firstName).toBe(firstName);
    expect(formData.lastName).toBe(lastName);
  }
  //Case Documents
  async clickOnDocuments() {
    await this.page.locator("twc-navmenu-item[label='Documents']").click();
  }
  async docHeader() {
    return await this.page
      .locator("twc-header[label='Documents']")
      .locator(".header__title")
      .innerText();
  }
  async uploadBtn(): Promise<Locator> {
    return this.page.locator('twc-button.upload-button');
  }
  async docUploadSuccessMsg(docName: string): Promise<Locator> {
    return this.page.locator(
      '//div[contains(text(),"Document ' +
      docName +
      ' uploaded to the case. You can ")]'
    );
  }

  async alertMsg() {
    return await this.page.locator("twc-alert").textContent();
  }

  async caseDocumentUpload(desc: string, fileName: string) {
    (await this.uploadBtn()).click();
    await this.page.waitForTimeout(500);
    await this.page.locator("#document-description #input").fill(desc);
    //uploading doc
    await this.page.setInputFiles(
      'input[type="file"]',
      `./fixtures/${fileName}`
    );
    //Upload btn
    await this.page.locator(".action-buttons twc-button").last().click();
    await this.page.waitForTimeout(1000);
    //Done btn
    await this.page.locator(".cancel-button").click();
  }
  async docLists() {
    return await this.documentList.innerText();
  }
  async uploadDocConatinerText() {
    return await this.page
      .locator(".upload-dialog-wrapper")
      .locator("#title")
      .innerText();
  }

  async getUploadedDocLocator(fileName: string): Promise<Locator> {
    const locator = this.page.locator('twc-list-item', { hasText: fileName });
    await locator.waitFor({ state: 'visible' }); // ensure element is visible
    return locator;
  }
  //Delete document
  async searchDocument(docName: string) {
    await this.page
      .locator("bpme-case-documents")
      .getByRole("textbox")
      .fill(docName);
    await this.page
      .locator("bpme-case-documents")
      .getByRole("textbox")
      .press("Enter");
  }
  async clickOnDeleteIcon(docName: string) {
    const docItem = this.page
      .locator("twc-list-item")
      .filter({ hasText: docName });
    await docItem.hover();
    await docItem.locator('twc-icon[name="trash3"]').click();
  }
  async documentDeleteHeader() {
    return await this.page
      .locator(".delete-dialog.bpm-designer-scrollbar")
      .locator("div[slot='labelText']")
      .innerText();
  }
  async delDocumentConfirmationTxt() {
    return await this.page
      .locator(".delete-dialog.bpm-designer-scrollbar")
      .locator("div[slot='bodyHeader']")
      .innerText();
  }
  async clickOnCancelBtn() {
    await this.page
      .locator("twc-button[type='button'][slot='cancel'] .button__label")
      .click();
  }
  async clickOnYesDelete() {
    await this.page
      .locator("twc-button[type='button'][slot='confirm']")
      .click();
    await this.page.waitForTimeout(1000);
  }
  async documentConatiner() {
    return await this.page
      .locator(".documents-container .empty-label")
      .innerText();
  }
  async cancelButton(): Promise<Locator> {
    return this.page.locator(".cancel-button");
  }
  async chooseFileBtn(): Promise<Locator> {
    return this.page.locator("#fileInputElement");
  }
  async selectServerFromGlobalSwitcher(serverName: string) {
    await this.globalServerSwitcherIcon.click();
    const serverOption = this.page.locator('twc-list-item').filter({ hasText: serverName });
    await serverOption.click();
    await this.page.waitForLoadState('networkidle');
  }

  async clickOnConfirmServerSelectionBtn() {
    await this.page
      .locator("twc-button[type='button'][slot='confirm']")
      .click();
    await this.page.waitForTimeout(1000);
  }

  async searchCaseById(caseIdentifier1: string): Promise<void> {
    await this.clickOnCaseFilterIcon();
    await this.addFilterCondition("caseIdentifier1", "EQ", caseIdentifier1);
    await this.clickFilterSearch();
    await this.page
      .locator(`twc-table-row[details*='"caseIdentifier1":"${caseIdentifier1}"']`)
      .first()
      .click();
  }

  async clickOnCaseByCaseIdentifier(caseIdentifier1: string): Promise<void> {
    await this.page
      .locator("twc-table-row")
      .filter({ has: this.page.locator(`twc-table-cell[title="${caseIdentifier1}"]`) })
      .click();
  }

  async verifyAdhocTaskRowDetails(rowIndex: number, taskName: string, executeStatus: string, canBeStartedStatus: string): Promise<void> {
    const adhocDialog = this.page.locator("twc-dialog").filter({ hasText: "Ad-hoc tasks" });
    await expect(adhocDialog).toBeVisible({ timeout: 15000 });

    const row = adhocDialog.locator("twc-details").nth(rowIndex);
    await expect(row).toBeVisible();
    await expect(row).toContainText(taskName);
    await expect(row).toContainText(executeStatus);
    await expect(row).toContainText(canBeStartedStatus);
  }

  async closeAdhocTaskDialog(): Promise<void> {
    const adhocDialog = this.page.locator('twc-dialog.adhoc-dialog');
    const adhocDialogCloseButton = this.page.locator('twc-dialog.adhoc-dialog twc-icon[part="close-button"]');
    await adhocDialogCloseButton.waitFor({ state: 'visible' });
    await adhocDialogCloseButton.click({ force: true });
    await expect(adhocDialog).toBeHidden();
  }

  async validateAdhocTaskDialogRows(): Promise<void> {
    const adhocDialog = this.page.locator("twc-dialog").filter({ hasText: "Ad-hoc tasks" });
    await expect(adhocDialog).toBeVisible({ timeout: 15000 });

    const rows = adhocDialog.locator("twc-details");
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      await expect(rows.nth(i)).toBeVisible();
    }
  }

  async verifyNoAdhocTaskRecords(): Promise<void> {
    const adhocDialog = this.page.locator("twc-dialog").filter({ hasText: "Ad-hoc tasks" });
    await expect(adhocDialog).toBeVisible({ timeout: 15000 });
    const rows = adhocDialog.locator("twc-details");
    await expect(rows).toHaveCount(0);
  }

  async startAdhocTask(taskName: string): Promise<void> {
    const adhocDialog = this.page.locator("twc-dialog").filter({ hasText: "Ad-hoc tasks" });
    await expect(adhocDialog).toBeVisible({ timeout: 15000 });
    await adhocDialog
      .locator("twc-details")
      .filter({ hasText: taskName })
      .locator("button")
      .click();
  }

  async clickOnCaseType(caseTypeName: string) {
    await this.page.waitForTimeout(2000);

    const allItems = await this.page.locator('twc-list-item').evaluateAll(
      (els: Element[]) => els.map(e => ({
        title: e.getAttribute('title'),
        text: (e.textContent ?? '').trim().slice(0, 60),
      }))
    );
    console.log('Case Manager sidebar items:', JSON.stringify(allItems, null, 2));

    let caseType = this.page.locator('twc-list-item').getByTitle(caseTypeName, { exact: true });
    if ((await caseType.count()) === 0) {
      caseType = this.page.locator('twc-list-item').filter({ hasText: new RegExp(caseTypeName, 'i') });
    }
    await caseType.first().waitFor({ state: 'visible', timeout: 15000 });
    await caseType.first().click();
    await this.page.waitForTimeout(1500);
  }

  async getCaseRowDetails(rowIndex: number = 0) {
    const row = this.page.locator('twc-table-row').nth(rowIndex);
    await row.waitFor({ state: 'visible', timeout: 15000 });
    const details = await row.getAttribute('details');
    return details ? JSON.parse(details) : null;
  }

  async openCase(rowIndex: number = 0) {
    await this.page.locator('twc-table-row').nth(rowIndex).click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
  }

  async getCaseFieldDisplayValue(sectionName: string, fieldName: string): Promise<string> {
    const baseSelector = `.component.control.control_${sectionName}_${fieldName}`;

    const ctrl = this.page.locator(`${baseSelector}.read-only`).first();
    if ((await ctrl.count()) === 0) return '';

    const gwtLabel = ctrl.locator('.tf-label-control').first();
    if ((await gwtLabel.count()) > 0) return (await gwtLabel.innerText()).trim();

    const input = ctrl.locator('input').first();
    if ((await input.count()) > 0) return (await input.inputValue()).trim();

    const displayVal = ctrl.locator('.control-display-value').first();
    if ((await displayVal.count()) > 0) return (await displayVal.innerText()).trim();

    const select = ctrl.locator('select').first();
    if ((await select.count()) > 0) {
      const val = await select.inputValue();
      if (val) return val.trim();
    }

    const tfContainer = ctrl.locator('.tf-container').first();
    if ((await tfContainer.count()) > 0) return (await tfContainer.innerText()).trim();

    return (await ctrl.innerText()).trim();
  }
}
