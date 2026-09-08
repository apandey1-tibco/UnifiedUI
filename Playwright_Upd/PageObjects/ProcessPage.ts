import { type Locator, type Page, request, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";
import * as TestData from "../fixtures/TestData.json";

export class ProcessPage {
  readonly page: Page;

  // --- Locators (Disk) ---
  readonly header: Locator;
  readonly tableHeader: Locator;
  readonly findInstancesButton: Locator;
  readonly filterInstancesBy: Locator;
  readonly resetAllFieldsButton: Locator;
  readonly searchButton: Locator;
  readonly filterCriteria: Locator;
  readonly startButton: Locator;
  readonly processTemplatesFilter: Locator;
  readonly filterTag: Locator;
  readonly coloumnSelector: Locator;
  readonly processName: Locator;
  readonly saveBtn: Locator;
  readonly refreshIcon: Locator;
  readonly ACE_TestFacadeAttributes: Locator;
  readonly ACE_TestFacadeAttributesProcess: Locator;
  readonly moreMenu: Locator;
  readonly templateTag: Locator;
  readonly processPage: Locator;
  readonly checkbox: Locator;
  readonly findInstances: Locator;
  readonly adhocTasks: Locator;
  readonly refreshInstances: Locator;
  readonly columnSelector: Locator;
  readonly cancelInstances: Locator;
  readonly cancelMenuItem: Locator;
  readonly resumeMenuItem: Locator;
  readonly suspendMenuItem: Locator;
  readonly resumeTasks: Locator;
  readonly suspendTasks: Locator;
  readonly actionThreeDotsVertical: Locator;
  readonly applyButton: Locator;
  readonly fixProcess: Locator;
  readonly showMoreInfo: Locator;
  readonly causeOfFailure: Locator;
  readonly inspectDataTab: Locator;
  readonly cancelInstance: Locator;
  readonly cancelConfirmDialog: Locator;
  readonly yesButton: Locator;
  readonly alertMessage: Locator;
  readonly failedAlertMessage: Locator;
  readonly allowToError: Locator;
  readonly refreshInstancesIcon: Locator;
  readonly failedStateCell: Locator;
  readonly subProcessHaltSetTreeButton: Locator;
  readonly purgeMenuItem: Locator;
  readonly migrateMenuItem: Locator;
  readonly migrateDialogSourceVersionDropdown: Locator;
  readonly migrateDialogDestinationVersionDropdown: Locator;
  readonly deferredOption: Locator;
  readonly ignoreAndContinue: Locator;
  readonly ignoreConfirmDialog: Locator;
  readonly activeStateCell: Locator;
  readonly suspendedStateCell: Locator;
  readonly immediateOption: Locator;
  readonly processInfoIcon: Locator;
  readonly processInfoPopup: Locator;
  readonly dismissButton: Locator;
  readonly historicTab: Locator;
  readonly currentTab: Locator;

  // Find Instances dialog
  readonly processInstanceIdRadio: Locator;
  readonly processInstanceIdInput: Locator;
  readonly selectAllCheckbox: Locator;
  readonly cancelSelectedInstancesButton: Locator;
  readonly cancelSelectedConfirmDialog: Locator;
  readonly cancelSelectedYesButton: Locator;
  readonly suspendSelectedConfirmDialog: Locator;
  readonly suspendSelectedYesButton: Locator;
  readonly resumeSelectedConfirmDialog: Locator;
  readonly resumeSelectedYesButton: Locator;
  readonly suspendSelectedInstancesButton: Locator;
  readonly resumeSelectedInstancesButton: Locator;
  readonly packageNameOperator: Locator;
  readonly packageNameInput: Locator;
  readonly processNameOperator: Locator;
  readonly processNameInput: Locator;
  readonly versionOperator: Locator;
  readonly versionInput: Locator;
  readonly instanceStartedOperator: Locator;
  readonly instanceStartedInput: Locator;
  readonly priorityOperator: Locator;
  readonly priorityInput: Locator;
  readonly filterDialogClose: Locator;
  readonly filterDialogResetAll: Locator;
  readonly filterDialogSearch: Locator;
  readonly searchResultClose: Locator;
  readonly searchResultSubtitle: Locator;
  readonly processTemplateTagsWrapper: Locator;
  readonly clearFiltersIcon: Locator;
  readonly templateFilterPackageNameInput: Locator;
  readonly templateFilterProcessNameInput: Locator;
  readonly templateFilterVersionInput: Locator;
  readonly templateFilterPackageNameSelect: Locator;
  readonly templateFilterProcessNameSelect: Locator;
  readonly templateFilterVersionSelect: Locator;
  readonly processHeaderTitle: Locator;
  readonly filterTagRemoveButton: Locator;
  readonly migrateFromSelectAllCheckbox: Locator;
  readonly migrateAddRuleButton: Locator;
  readonly migrateDialogMigrateButton: Locator;
  readonly migrateDeleteAllRulesButton: Locator;
  readonly migrateDialogCancelButton: Locator;

  // --- Locators (Attached-only additions) ---
  readonly ProcessManagerCard: Locator;
  readonly ProcessManagerGo: Locator;
  readonly PMAppTitle: Locator;
  readonly ProcessTemplateName: Locator;
  readonly ProcessInstanceListTitle: Locator;
  readonly NumberOfProcessInstances: Locator;
  readonly Refresh_Process_Templates_Icon: Locator;
  readonly Filter_Process_Templates_Icon: Locator;
  readonly Find_Instance_Filter_Menu: Locator;
  readonly Refresh_Process_Instances_Icon: Locator;
  readonly Dialogue_msg: Locator;
  readonly Filter_Dialogue_Close_Btn: Locator;
  readonly Retry_Dialogue_Close_Btn: Locator;
  readonly Number_Of_Process_Templates: Locator;
  readonly Number_Of_Process_Templates_Filters: Locator;
  readonly PI_FilterByState: Locator;
  readonly Number_Of_ProcessInstances: Locator;
  readonly Process_Instances_List: Locator;
  readonly Process_Instance_ID: Locator;
  readonly Process_Instance_State: Locator;
  readonly Process_Instance_IDs: Locator;
  readonly PI_SelectAll_Instances_chkbox: Locator;
  readonly NoPIText: Locator;
  readonly ActiveAppTabTitle: Locator;
  readonly PI_Summary_title: Locator;
  readonly Click_Anywhere: Locator;
  readonly PI_Cancel_Purge_Dialogue_title: Locator;
  readonly PI_Cancel_Purge_Dialogue_Msg: Locator;
  readonly PI_Cancel_Purge_Dialogue_Warning_Msg: Locator;
  readonly PI_Cancel_Purge_Dialogue_Close_Btn: Locator;
  readonly PI_migrate_msg: Locator;
  readonly No_Templates_Msg: Locator;
  readonly ProcessTemplates_tab_switch: Locator;
  readonly ProcessTemplates_tab_title: Locator;
  readonly PI_Fix_ProcessRetry_Heading: Locator;
  readonly PI_FixProcess_tabheader: Locator;
  readonly PI_FixProcess_CancelInstance_Btn: Locator;
  readonly PI_FixProcess_InspectData: Locator;
  readonly PI_FixProcess_Retry_Btn: Locator;
  readonly PI_InspectData_back_btn: Locator;
  readonly PI_Retry_Status_Msg: Locator;
  readonly PI_Migration_msg: Locator;
  readonly Filter_Calendar_Icon: Locator;
  readonly Filter_Calendar_CurrentDate: Locator;
  readonly Filter_Calendar_Time_field: Locator;

  constructor(page: Page) {
    this.page = page;

    // --- Core / Header ---
    this.header = page.locator("text=Process Templates");
    this.findInstancesButton = page.getByRole("button", { name: "Find Instances" });
    this.startButton = page.getByRole("button", { name: "Start" });
    this.filterInstancesBy = page.getByRole("heading", { name: "Filter instances by:" });
    this.resetAllFieldsButton = page.getByRole("button", { name: "Reset all fields" });
    this.tableHeader = page.locator("twc-table-head");
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.coloumnSelector = page.locator('twc-toolbar-item[label="Column Selector"]');
    this.saveBtn = page.getByRole("button", { name: "Save" });
    this.filterCriteria = page.locator(
      "text=Filter criteria Process instance ID Select an option Package Name Equals Less"
    );
    this.processTemplatesFilter = page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Filter Filter" })
      .locator("svg");
    this.processName = page.locator("#twcInput").locator("#input");
    this.filterTag = page.locator("twc-tag");
    this.refreshIcon = page.locator('twc-toolbar-item.toolbar-section-refresh')
      .locator('twc-toolbar-item[labelposition="right"]');
    this.ACE_TestFacadeAttributes = page.locator('twc-tree-items-group[groupname="ACE_TestFacadeAttributes"]');
    this.ACE_TestFacadeAttributesProcess = page.locator('twc-tree-item[itemvalue="ACE_TestFacadeAttributesProcess"]');
    this.moreMenu = page.locator('twc-icon-button[name="three-dots-vertical"]').first();
    this.templateTag = page.locator('div.tags-removable');

    this.processPage = page.locator('twc-navmenu-item[id="bpmProcess"]');
    this.findInstances = page.locator('twc-icon[name="search"]');
    this.adhocTasks = page.locator('button[class=" button button--primary button--small button--disabled button--outline button--has-label "]');
    this.refreshInstances = page.locator('twc-toolbar-item[label="Refresh Instances"]');
    this.columnSelector = page.locator('twc-toolbar-item[label="Column Selector"]');
    this.cancelInstances = this.page.locator('twc-menu >>> twc-menu-item', { hasText: 'Cancel' });
    this.cancelMenuItem = page.getByRole('menuitem', { name: 'Cancel' }).locator('div').first();
    this.resumeMenuItem = page.getByRole('menuitem', { name: 'Resume' });
    this.suspendMenuItem = page.getByRole('menuitem', { name: 'Suspend' });
    this.resumeTasks = this.page.locator('twc-menu >>> twc-menu-item', { hasText: 'Resume' });
    this.suspendTasks = page.locator('twc-icon[name="x-octagon"]').first();
    this.actionThreeDotsVertical = page
      .locator("twc-table-cell")
      .locator("twc-dropdown")
      .locator('twc-icon-button[name="three-dots-vertical"]')
      .first();
    this.checkbox = page.locator('twc-checkbox.tableBodyCheckbox').first();
    this.applyButton = page.getByRole('button', { name: 'Apply' });
    this.fixProcess = page.getByRole('menuitem', { name: 'Fix process' }).locator('div').first();
    this.showMoreInfo = page.getByRole('button', { name: 'Show more info' });
    this.causeOfFailure = page.locator('.show-more-data');
    this.inspectDataTab = page.getByRole('tab', { name: 'Inspect data' });
    this.cancelInstance = page.getByRole('button', { name: 'Cancel instance' });
    this.cancelConfirmDialog = page.locator('[slot="bodyContent"]').filter({ hasText: 'subProcessHaltSet instance' });
    this.yesButton = page.getByRole('button', { name: 'Yes' });
    this.alertMessage = page.locator('twc-alert[open][variant="success"]');
    this.failedAlertMessage = page.locator('twc-alert[open][variant="danger"]');
    this.allowToError = page.getByRole('button', { name: 'Allow to error' });
    this.refreshInstancesIcon = page.locator('twc-toolbar-item').filter({ hasText: 'Refresh Instances Refresh' }).locator('svg');
    this.failedStateCell = page.locator('twc-table-cell[tooltipvalue="FAILED"]').first();
    this.subProcessHaltSetTreeButton = page.locator('twc-tree-item[itemvalue="subProcessHaltSet"] twc-icon-button[name="three-dots-vertical"]');
    this.purgeMenuItem = page.getByRole('menuitem', { name: 'Purge' }).locator('div').first();
    this.migrateMenuItem = page.getByRole('menuitem', { name: 'Migrate' }).locator('div').first();
    this.migrateDialogSourceVersionDropdown = page.locator('.migrate-amx-container-box twc-select').nth(0);
    this.migrateDialogDestinationVersionDropdown = page.locator('.migrate-amx-container-box twc-select').nth(1);
    this.migrateFromSelectAllCheckbox = page.locator('div.migrate-from div.amx-margin-bottom twc-checkbox');
    this.migrateAddRuleButton = page.locator('twc-button', { hasText: 'Add rule' });
    this.migrateDialogMigrateButton = page.locator('#bpme-process-template-migration-amx-dialog twc-button[variant="primary"]:not([outline])', { hasText: 'Migrate' });
    this.migrateDeleteAllRulesButton = page.locator('twc-button', { hasText: 'Delete All Existing Migration Rules' });
    this.migrateDialogCancelButton = page.locator('.migrate-amx-container-box').locator('twc-button[outline]', { hasText: 'Cancel' });
    this.suspendSelectedInstancesButton = page.locator('twc-button', { hasText: 'Suspend' });
    this.resumeSelectedInstancesButton = page.locator('twc-button', { hasText: 'Resume' });
    this.deferredOption = page.getByText('Deferred');
    this.ignoreAndContinue = page.getByRole('button', { name: 'Ignore & continue' });
    this.ignoreConfirmDialog = page.locator('[slot="bodyContent"]').filter({ hasText: 'This causes the failed task' });
    this.activeStateCell = page.locator('twc-table-cell[tooltipvalue="ACTIVE"]').first();
    this.suspendedStateCell = page.locator('twc-table-cell[tooltipvalue="SUSPENDED"]').first();
    this.immediateOption = page.getByText('Immediate');
    this.processInfoIcon = page.locator('twc-tree-item[itemvalue="BPMCreateCaseProcess"] twc-icon[name="info-circle"]');
    this.processInfoPopup = page.locator('[slot="bodyContent"].popup-content');
    this.dismissButton = page.locator('#bpme-process-template-info-dialog twc-button[slot="cancel"]', { hasText: 'Dismiss' });
    this.historicTab = page.locator('twc-tab[panel="historic"]');
    this.currentTab = page.locator('twc-tab[panel="current"]');

    // Find Instances dialog
    const findInstancesDialog = page.locator('bpme-process-instance-find-dialog');
    this.processInstanceIdRadio = page.locator('twc-radio[part="process-instance-item"]').filter({ hasText: 'Process Instance ID' });
    this.processInstanceIdInput = findInstancesDialog.locator('twc-input[size="small"][type="text"]').locator('#input');
    this.selectAllCheckbox = page.locator('twc-table-head-cell.checkBox twc-checkbox');
    this.cancelSelectedInstancesButton = page.locator('twc-button').filter({ hasText: 'Cancel selected instances' });
    this.cancelSelectedConfirmDialog = page.locator('bpme-proces-instance-cancel-tasks-dialog div[slot="bodyContent"]');
    this.cancelSelectedYesButton = page.locator('bpme-proces-instance-cancel-tasks-dialog twc-button[slot="confirm"]');
    this.suspendSelectedConfirmDialog = page.locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('div[slot="bodyContent"]');
    this.suspendSelectedYesButton = page.locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('twc-button[slot="confirm"]');
    this.resumeSelectedConfirmDialog = page.locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('div[slot="bodyContent"]');
    this.resumeSelectedYesButton = page.locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('twc-button[slot="confirm"]');
    this.packageNameOperator = findInstancesDialog.locator('twc-select').nth(0);
    this.packageNameInput = findInstancesDialog.locator('twc-input[type="text"]').nth(0).locator('#input');
    this.processNameOperator = findInstancesDialog.locator('twc-select').nth(1);
    this.processNameInput = findInstancesDialog.locator('twc-input[type="text"]').nth(1).locator('#input');
    this.versionOperator = findInstancesDialog.locator('twc-select').nth(2);
    this.versionInput = findInstancesDialog.locator('twc-input[type="text"]').nth(2).locator('#input');
    this.instanceStartedOperator = findInstancesDialog.locator('twc-select').nth(3);
    this.instanceStartedInput = findInstancesDialog.locator('twc-input[type="datetime-local"]').locator('#input');
    this.priorityOperator = findInstancesDialog.locator('twc-select').nth(4);
    this.priorityInput = findInstancesDialog.locator('twc-input[type="number"]').locator('#input');
    this.filterDialogClose = page.locator('twc-icon[name="x"][library="system"]');
    this.filterDialogResetAll = findInstancesDialog.getByRole('button', { name: 'Reset all fields' });
    this.filterDialogSearch = findInstancesDialog.getByRole('button', { name: 'Search' });
    this.searchResultClose = page.locator('bpme-process-instance-table-filter twc-icon.close-icon[name="x-lg"]');
    this.searchResultSubtitle = page.locator('bpme-process-instance-table-filter [part="header__subtitle"]');
    this.processTemplateTagsWrapper = page.locator('div[part="tags-wrapper"]');
    this.clearFiltersIcon = page.locator('twc-toolbar-item[label="Clear filters"] twc-icon[name="x"]');
    const templateFilterDialog = page.locator('bpme-process-template-filter-dialog');
    this.templateFilterPackageNameInput = templateFilterDialog.locator('.package-name-filter-container twc-input').locator('#input');
    this.templateFilterProcessNameInput = templateFilterDialog.locator('.process-name-filter-container twc-input').locator('#input');
    this.templateFilterVersionInput = templateFilterDialog.locator('.version-name-filter-container twc-input').locator('#input');
    this.templateFilterPackageNameSelect = templateFilterDialog.locator('.package-name-filter-container twc-option[value="="]');
    this.templateFilterProcessNameSelect = templateFilterDialog.locator('.process-name-filter-container twc-option[value="="]');
    this.templateFilterVersionSelect = templateFilterDialog.locator('.version-name-filter-container twc-option[value="="]');
    this.processHeaderTitle = page.locator('#bpme-process-instance-table-filter div[part="header__title"]');
    this.filterTagRemoveButton = page.locator('twc-tag [part="remove-button"]');

    // --- Attached-only additions ---
    this.PMAppTitle = page.locator('span', { hasText: 'Process Manager' });
    this.ProcessManagerCard = page.locator('div:nth-child(3) > div.card-title');
    this.ProcessManagerGo = page.locator('div:nth-child(3) > div:nth-child(4) > button > span > span');
    this.ActiveAppTabTitle = page.locator('.mdc-tab.mat-mdc-tab-link.mat-mdc-focus-indicator.ace-adoption-mdc-mat-tab-link.ng-star-inserted.mdc-tab--active.mdc-tab-indicator--active');
    this.ProcessTemplateName = page.locator('div', { hasText: TestData.processTemplateName });
    this.Refresh_Process_Templates_Icon = page.locator("mat-icon[mattooltip='Refresh process templates']");
    this.Filter_Process_Templates_Icon = page.locator("mat-icon[mattooltip='Filter process templates']");
    this.Number_Of_Process_Templates = page.locator('div.templatesList.ng-star-inserted div.process-title');
    this.Number_Of_Process_Templates_Filters = page.locator('span.mdc-evolution-chip__text-label');
    this.ProcessTemplates_tab_switch = page.locator("//div[@class='process-tab-cell1']");
    this.ProcessTemplates_tab_title = page.locator("//div[@class='process-tab-cell']");
    this.No_Templates_Msg = page.locator("//p[normalize-space()='No templates to display.']");
    this.ProcessInstanceListTitle = page.locator('.instance-title');
    this.NumberOfProcessInstances = page.locator('.mat-row');
    this.Find_Instance_Filter_Menu = page.locator("button[mattooltip='Use queries to find instances']");
    this.Refresh_Process_Instances_Icon = page.locator('twc-toolbar-item').filter({ hasText: 'Refresh Instances Refresh' }).locator('svg');
    this.PI_FilterByState = page.locator("//span[normalize-space()='Filter by state']");
    this.Number_Of_ProcessInstances = page.locator('div.table-container tr.mat-mdc-row');
    this.Process_Instances_List = page.locator('table.mat-table.cdk-table.mat-sort.mat-elevation-z8.ng-star-inserted');
    this.Process_Instance_ID = page.locator('tr.mat-mdc-row td.mat-mdc-cell.mdc-data-table__cell.cdk-cell.def-column.cdk-column-instanceId.mat-column-instanceId.ng-star-inserted').first();
    this.Process_Instance_State = page.locator('tr.mat-mdc-row td.mat-mdc-cell.cdk-cell.def-column.cdk-column-State.mat-column-State').first();
    this.Process_Instance_IDs = page.locator('td.mat-mdc-cell.cdk-cell.def-column.cdk-column-instanceId.mat-column-instanceId');
    this.PI_SelectAll_Instances_chkbox = page.locator("//div[contains(@class,'mat-sort-header-content ng-tns')][text()='Process Instance ID']//preceding::input[1]");
    this.NoPIText = page.locator(".empty-message");
    this.PI_Summary_title = page.locator("//h3[normalize-space()='Instance Summary']");
    this.Click_Anywhere = page.locator("//div[@class='mat-drawer-backdrop ng-star-inserted mat-drawer-shown']");
    this.Dialogue_msg = page.locator("//span[@class='dialog-title']");
    this.Filter_Dialogue_Close_Btn = page.locator("//mat-icon[@svgicon='clear']//*[local-name()='svg']");
    this.Retry_Dialogue_Close_Btn = page.locator("//button[@class='btn-secondary']");
    this.PI_Cancel_Purge_Dialogue_title = page.locator('bpme-process-template').getByText('Confirm').nth(2);
    this.PI_Cancel_Purge_Dialogue_Msg = page.getByText('Do you want to purge all the');
    this.PI_Cancel_Purge_Dialogue_Warning_Msg = page.locator("//div[normalize-space()=\"This action can't be undone!\"]");
    this.PI_Cancel_Purge_Dialogue_Close_Btn = page.getByRole('button', { name: 'Close' });
    this.PI_migrate_msg = page.locator("//p[@class='ng-star-inserted']");
    this.PI_Fix_ProcessRetry_Heading = page.locator("//h3[text()='Retry Status']");
    this.PI_FixProcess_tabheader = page.locator("//h3[@class='halt-tab-header ng-star-inserted']");
    this.PI_FixProcess_CancelInstance_Btn = page.locator("//mat-icon[@svgicon='cancel_process']");
    this.PI_FixProcess_InspectData = page.locator("//mat-icon[@svgicon='inspect_process']");
    this.PI_FixProcess_Retry_Btn = page.locator("//mat-icon[@svgicon='retry_process']");
    this.PI_InspectData_back_btn = page.locator("//button[@class='back-error-button']");
    this.PI_Retry_Status_Msg = page.locator("//p[normalize-space()='Retry request has been submitted successfully.']");
    this.PI_Migration_msg = page.locator("//p[normalize-space()='Process Migration Successful']");
    this.Filter_Calendar_Icon = page.locator("//button[@class='calendar-trigger']");
    this.Filter_Calendar_CurrentDate = page.locator("//span[@class='owl-dt-calendar-cell-content owl-dt-calendar-cell-today']");
    this.Filter_Calendar_Time_field = page.locator("//owl-date-time-timer-box[1]//label[1]//input[1]");
  }

  // ==========================================
  // --- Action Methods (Disk) ---
  // ==========================================

  async naviagteToProcessTab() {
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(3000);
    await this.page.locator("#bpmProcess svg").waitFor();
    await this.page.locator("#bpmProcess svg").click({ force: true });
  }

  async getFirstRowProcessInstanceId(): Promise<string> {
    const id = await this.page.locator('twc-table-row').first()
      .locator('twc-table-cell[tooltipvalue]').first()
      .getAttribute('tooltipvalue');
    return id ?? '';
  }

  async verifyProcessInfo(moduleName: string, processName: string) {
    await expect(
      this.processInfoPopup.locator('div').filter({ hasText: /^Module Name/ })
    ).toContainText(moduleName);
    await expect(
      this.processInfoPopup.locator('div').filter({ hasText: /^Process Name/ })
    ).toContainText(processName);
  }

  async clickOnProcess(processName: string) {
    await this.processTemplatesFilter.click();
    await this.processName.fill(processName);
    await this.saveBtn.click();
  }

  async selectACETestFacadeAttributesProcess(processName: string) {
    await this.processTemplatesFilter.click();
    await this.processName.fill(processName);
    await this.saveBtn.click();
    await this.page.waitForTimeout(1500);
    await this.ACE_TestFacadeAttributes.click();
    await this.ACE_TestFacadeAttributesProcess.click();
    await this.checkbox.click();
    await this.actionThreeDotsVertical.click();
  }

  async waitForToastMessage(message: string, timeout = 15000) {
    await this.page.waitForFunction(
      (msg) => {
        function hasText(root: Document | ShadowRoot): boolean {
          if (!root) return false;
          if (root.textContent && root.textContent.includes(msg)) return true;
          const elements = Array.from(root.querySelectorAll('*'));
          for (const el of elements) {
            const sr = (el as Element).shadowRoot;
            if (sr && hasText(sr)) return true;
          }
          return false;
        }
        return hasText(document);
      },
      message,
      { timeout }
    );
  }

  async clickOnProcesses(groupValue: string, processItemValue: string) {
    await this.page.locator(`twc-tree-items-group[groupvalue="${groupValue}"] div[slot="trigger"]`).click();
    await this.page.locator(`twc-tree-item[itemvalue="${processItemValue}"]`).click();
  }

  async verifyFirstRowState(expectedState: string) {
    const firstRowStateCell = this.page.locator('twc-table-row').first()
      .locator(`twc-table-cell[tooltipvalue="${expectedState}"]`);
    await expect(firstRowStateCell).toBeVisible();
  }

  async getEmptyMsg() {
    return await this.page.locator(".empty-message").last().innerText();
  }

  procesInstanceId(): Locator {
    return this.page.locator('twc-list-item', { hasText: 'Process Instance ID' })
      .filter({ has: this.page.locator('twc-checkbox') })
      .last();
  }

  actionMenuForFirstRowByState(state: string): Locator {
    return this.page.locator('twc-table-row')
      .filter({ has: this.page.locator(`twc-table-cell[tooltipvalue="${state.toUpperCase()}"]`) })
      .first()
      .locator('twc-icon-button[name="three-dots-vertical"]');
  }

  async sortByStartDateDescending() {
    await this.page.locator('twc-toolbar-item[label="Sort"]').click();
    await this.page.locator('twc-list-item', { hasText: 'Start Time' })
      .filter({ has: this.page.locator('twc-checkbox') })
      .click();
    await this.page.locator('twc-list-item', { hasText: 'Start Time ( Ascending )' }).click();
    await this.page.getByRole('button', { name: 'Save' }).click();
  }

  async filterByState(state: string) {
    await this.page.getByRole("combobox").first().click();
    await this.page.waitForTimeout(500);
    await this.page.locator(`twc-option[value="${state.toUpperCase()}"]`).click({ force: true });
  }

  async templateFilter(packageName: string) {
    await this.processTemplatesFilter.click();
    await expect(this.page.getByLabel("Filter templates by:")).toBeVisible();
    await this.page
      .locator(".package-name-filter-container")
      .locator("twc-select")
      .selectOption({ value: "lt" });
    await this.page
      .locator(".package-name-filter-container twc-input")
      .fill(packageName);
  }

  async getColoumnValues() {
    const items = this.page.locator('twc-list-item').filter({ has: this.page.locator('twc-checkbox') });
    const count = await items.count();
    const seen = new Set<string>();
    const values: string[] = [''];
    for (let i = 0; i < count; i++) {
      const text = (await items.nth(i).innerText()).trim();
      if (!seen.has(text)) {
        seen.add(text);
        values.push(text);
      }
    }
    return values;
  }

  async coloumnSelectorVerification(colName: string) {
    await this.page
      .getByRole("menuitem", { name: colName })
      .locator("div")
      .first()
      .click();
  }

  async getTableHeader() {
    if (await this.applyButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await this.applyButton.click();
      await this.page.waitForTimeout(1000);
    }
    return await utility.tableHeader(this.page);
  }

  async startProcess(packageName: string, processName: string) {
    await this.clickOnProcess(processName);
    await this.page.waitForTimeout(1000);
    await this.page.getByText(packageName, { exact: true }).click();
    await this.page.getByText(processName, { exact: true }).click();
    await this.startButton.click();
  }

  async OpenProcess(packageName: string, processName: string) {
    await this.clickOnProcess(processName);
    await this.page.waitForTimeout(1000);
    await this.page.getByText(packageName, { exact: true }).click();
    await this.page.getByText(processName, { exact: true }).click();
    await expect(this.processHeaderTitle).toContainText(processName);
  }

  async clickOnPackage(packageName: string) {
    await this.page.getByText(packageName, { exact: true }).click();
  }

  getProcessName(name: string) {
    return this.page.locator('twc-table-row', { has: this.page.locator(`twc-table-cell[tooltipvalue="${name}"]`) }).first();
  }

  async clickonThreeDotsProcess(name: string) {
    await (this.getProcessName(name)).locator("twc-icon-button[name='three-dots-vertical']").click({ force: true });
  }

  processTemplateTreeGroup(packageName: string): Locator {
    return this.page.locator('twc-tree-items-group').filter({ hasText: packageName });
  }

  processTemplateTreeItem(processName: string): Locator {
    return this.page.locator(`twc-tree-item[itemvalue="${processName}"]`);
  }

  processTemplateTreeItemByVersion(processName: string, version: string): Locator {
    return this.page.locator(`twc-tree-item[itemvalue="${processName}"]`)
      .filter({ has: this.page.locator('div[slot="subText"]', { hasText: version }) });
  }

  async OpenProcessMenuByVersion(packageName: string, processName: string, version: string) {
    await this.clickOnProcess(processName);
    await this.page.waitForTimeout(1000);
    await this.page.getByText(packageName, { exact: true }).click();
    await this.processTemplateTreeItemByVersion(processName, version).click();
    await expect(this.processHeaderTitle).toContainText(processName);
    await this.processTemplateTreeItemByVersion(processName, version).locator('twc-icon-button[name="three-dots-vertical"]').click();
  }

  async verifyMigrateDialogDefaultVersion(expectedVersion: string) {
    await expect(this.migrateDialogSourceVersionDropdown).toHaveAttribute('value', expectedVersion);
  }

  async selectMigrateSourceVersion(version: string) {
    await this.migrateDialogSourceVersionDropdown.click();
    await this.migrateDialogSourceVersionDropdown.locator(`twc-option[value="${version}"]`).click({ force: true });
  }

  async selectMigrateDestinationVersion(version: string) {
    await this.migrateDialogDestinationVersionDropdown.click();
    await this.migrateDialogDestinationVersionDropdown.locator(`twc-option[value="${version}"]`).click({ force: true });
  }

  async verifyMigrateFromCheckboxItems(expectedItems: string[]) {
    const migrateFromBox = this.page.locator('div.migrate-from');
    for (const item of expectedItems) {
      await expect(migrateFromBox.locator('.select-checkbox-item twc-checkbox').filter({ hasText: item })).toBeVisible();
    }
  }

  async clickMigrateFromSelectAll() {
    await this.migrateFromSelectAllCheckbox.click();
  }

  async verifyMigrateToCheckboxItems(expectedItems: string[]) {
    const migrateToList = this.page.locator('div.migrate-points-list');
    for (const item of expectedItems) {
      await expect(migrateToList.locator('div.select-checkbox-item').filter({ hasText: item })).toBeVisible();
    }
  }

  async verifyMigrateToAllItemsSelected(expectedItems: string[]) {
    const migrateToList = this.page.locator('div.migrate-points-list');
    for (const item of expectedItems) {
      await expect(
        migrateToList.locator('div.select-checkbox-item.select-checkbox-item--selected').filter({ hasText: item })
      ).toBeVisible();
    }
  }

  async verifyMigrateConfirmDialogText(expectedText: string) {
    await expect(
      this.page.locator('#bpme-process-template-migration-amx-dialog').getByText(expectedText)
    ).toBeVisible();
  }

  async verifyMigrationRules(sourceVersion: string, destinationVersion: string, points: string[]) {
    const rulesBox = this.page.locator('div.migrate-box.migration-amx-rules-box');
    for (const point of points) {
      const expectedText = `Version [${sourceVersion} ] to Version [${destinationVersion} ].  Point:${point}`;
      await expect(
        rulesBox.locator('div.migration-amx-rule-item > div').filter({ hasText: expectedText })
      ).toBeVisible();
    }
  }

  async clickMigrationRuleEditIcon(sourceVersion: string, destinationVersion: string, point: string) {
    const rulesBox = this.page.locator('div.migrate-box.migration-amx-rules-box');
    const expectedText = `Version [${sourceVersion} ] to Version [${destinationVersion} ].  Point:${point}`;
    await rulesBox.locator('div.migration-amx-rule-item').filter({ hasText: expectedText })
      .locator('twc-icon[name="editfilter"]').click();
  }

  async clickMigrationRuleDeleteIcon(sourceVersion: string, destinationVersion: string, point: string) {
    const rulesBox = this.page.locator('div.migrate-box.migration-amx-rules-box');
    const expectedText = `Version [${sourceVersion} ] to Version [${destinationVersion} ].  Point:${point}`;
    await rulesBox.locator('div.migration-amx-rule-item').filter({ hasText: expectedText })
      .locator('twc-icon[name="delete-forever"]').click();
  }

  async updateMigrationRuleInput(newValue: string) {
    const editInput = this.page.locator('div.migrate-box.migration-amx-rules-box')
      .locator('twc-input').locator('input');
    await editInput.clear();
    await editInput.fill(newValue);
  }

  async clickMigrationRuleSaveIcon() {
    await this.page.locator('div.migrate-box.migration-amx-rules-box')
      .locator('twc-icon[name="savefilter"]').click();
  }

  async verifyUpdatedMigrationRule(updatedText: string) {
    await expect(
      this.page.locator('div.migrate-box.migration-amx-rules-box')
        .locator('div.migration-amx-rule-item > div').filter({ hasText: updatedText })
    ).toBeVisible();
  }

  async verifyMigrationRuleNotPresent(sourceVersion: string, destinationVersion: string, point: string) {
    const expectedText = `Version [${sourceVersion} ] to Version [${destinationVersion} ].  Point:${point}`;
    await expect(
      this.page.locator('div.migrate-box.migration-amx-rules-box')
        .locator('div.migration-amx-rule-item > div').filter({ hasText: expectedText })
    ).not.toBeVisible({ timeout: 5000 });
  }

  async verifyMigrateToPlaceholder(expectedText: string) {
    await expect(
      this.page.locator('div.migrate-box.migrate-points div.no-migration').filter({ hasText: expectedText })
    ).toBeVisible();
  }

  // ==========================================
  // --- Dynamic Locators (Attached-only) ---
  // ==========================================

  Find_Instances_filterType(filterType: string): Locator {
    return this.page.locator(`//label[@class='mdc-label' and contains(text(),'${filterType}')]/preceding::input[1]`);
  }

  Col_Selector_field(ColumnName: string): Locator {
    return this.page.locator(`//span[normalize-space()='${ColumnName}']`);
  }

  Filter_fields(fieldName: string): Locator {
    return this.page.locator(`//div[normalize-space()='${fieldName}']`);
  }

  Filter_field_operator_selector(fieldName: string): Locator {
    return this.page.locator(`//div[normalize-space()='${fieldName}']/following-sibling::div[1]/mat-select/div`);
  }

  Filter_field_operator(operator: string): Locator {
    return this.page.locator(`//span[@class='mdc-list-item__primary-text'][normalize-space()='${operator}']`);
  }

  Filter_text_field(fieldName: string): Locator {
    return this.page.locator(`//div[normalize-space()='${fieldName}']/following-sibling::div[2]`);
  }

  Filter_dialogue_btn(BtnName: string): Locator {
    return this.page.locator(`//span[normalize-space()='${BtnName}']`);
  }

  Filter_Calendar_Btns(BtnName: string): Locator {
    return this.page.locator(`//button/span[text()=' ${BtnName} ']`);
  }

  Applied_Filter(_filterName: string): Locator {
    return this.page.locator('span.mdc-evolution-chip__text-label');
  }

  Process_Templates_applied_filter_Cancel_Btn(filterName: string): Locator {
    return this.page.locator(`//mat-chip-option/span/following::span/button/span[@class='mdc-evolution-chip__text-label mat-mdc-chip-action-label' and contains(text(),'${filterName}')]/following::span[1]/mat-icon[@svgicon='clear']`);
  }

  Filter_By_StateName(stateName: string): Locator {
    return this.page.locator(`//label[@class='mdc-label' and contains(text(),'${stateName}')]`);
  }

  Filter_By_StateName_chckbox(stateName: string): Locator {
    return this.page.locator(`//label[@class='mdc-label' and contains(text(),'${stateName}')]//preceding::input[1]`);
  }

  Start_PIForTemplate(ProcessName: string): Locator {
    return this.page.locator(`//div[normalize-space()='${ProcessName}']/following::div[@class='process-meta-container']/button`).first();
  }

  Upgraded_PI_startBtn(ProcessName: string, version: string): Locator {
    return this.page.locator(`//div[normalize-space()='${ProcessName}']//following-sibling::div[contains(text(),'${version}')]//following::div[@class='process-meta-container']//span[text()='Start']`).first();
  }

  Status_Of_PI(ProcessInstanceID: string): Locator {
    return this.page.locator(`//td[normalize-space()='${ProcessInstanceID}']/following-sibling::td[1]`);
  }

  PI_ProcessName(ProcessName: string): Locator {
    return this.page.locator(`//td[normalize-space()='${ProcessName}']`);
  }

  PI_withProcessName(ProcessName: string): Locator {
    return this.page.locator('td', { hasText: ProcessName });
  }

  PI_Actions_Icon(InstanceID: string): Locator {
    return this.page.locator(`//td[normalize-space()='${InstanceID}']//following-sibling::td[3]/button`);
  }

  PI_Actions_Btn(ActionName: string): Locator {
    return this.page.locator(`//button/span[text()='${ActionName}']`);
  }

  PI_Summary_InstanceID(InstanceID: string): Locator {
    return this.page.locator(`//div[@class='component control control_id control-label control-non-list-mode read-only']//label[text()='Id']/following::div[@class='gwt-HTML gwt-Label control-widget tf-label-control'][text()='${InstanceID}']`);
  }

  PI_Cancel_Purge_Dialogue_Btn(BtnText: string): Locator {
    return this.page.getByRole('button', { name: `${BtnText}` });
  }

  PI_clickProcess(name: String): Locator {
    return this.page.getByText(`${name}`, { exact: true });
  }

  PI_hamburger_Icon(itemName: string): Locator {
    return this.page.locator(`#item_${itemName}`).getByRole('button');
  }

  PI_Purge_Migrate_Btn(BtnName: string): Locator {
    return this.page.getByRole('menuitem', { name: `${BtnName}` }).locator('div').first();
  }

  PI_Fix_Process_Heading(headingName: string): Locator {
    return this.page.locator(`//h3/span[text()='${headingName}']`);
  }

  PI_Fix_Process_Tabs(TabListName: string): Locator {
    return this.page.locator(`//div[@class='mat-mdc-tab-list']/div//div/span/span[text()='${TabListName}']`);
  }

  PI_FixProcess_halt_label(labelName: string): Locator {
    return this.page.locator(`//div[@class='halt-label ng-star-inserted'][text()='${labelName}']`);
  }

  PI_FixProcess_halt_data(labelName: string, dataField: string): Locator {
    return this.page.locator(`//div[@class='halt-label ng-star-inserted'][text()='${labelName}']//following::div[text()='${dataField}']`);
  }

  PI_InspectData_fields(fieldName: string): Locator {
    return this.page.locator(`//div[@class='gwt-HTML label']//label[contains(@id, 'widget_control_${fieldName}')]`);
  }

  PI_InspectData_TextFields(fieldName: string): Locator {
    return this.page.locator(`//div[@class='tf-container']//input[contains(@id, 'widget_control_${fieldName}')]`);
  }

  PI_Close_Cancel_Btn(BtnName: string): Locator {
    return this.page.locator(`//button[text()='${BtnName}']`);
  }

  PI_Migration_cols_heading(headingName: string): Locator {
    return this.page.locator(`//p[normalize-space()='${headingName}']`);
  }

  PI_Migrate_from_to_List(migrateStep: string, listContent: string): Locator {
    return this.page.locator(`//p[normalize-space()='${migrateStep}']//following-sibling::div[@class='migrate-list']`, { hasText: listContent });
  }

  PI_MIgration_points(MigPointName: string): Locator {
    return this.page.locator(`//p[normalize-space()='Migration points:']//following-sibling::div[@class='migrate-points-list']`, { hasText: MigPointName });
  }

  PI_migrate_Btns(path: string, btnName: string): Locator {
    return this.page.locator(`//div[@class='button-actions']//${path}[text()='${btnName}']`);
  }

  getProcess(alias: string): Locator {
    const rawId = `items_group/${alias}/Process Packages/${alias}.xpdl`;
    const escapedId = CSS.escape(rawId);
    return this.page.locator(`twc-tree-items-group[id=${escapedId}]`);
  }

  async getProcessInstanceId(): Promise<string> {
    const instanceIdCells = this.page.locator('twc-table-cell[tooltipvalue^="p:"]');
    const lastCell = instanceIdCells.last();
    const idValue = await lastCell.innerText();
    return idValue.trim();
  }

  async getStateRow(instanceId: string): Promise<string | null> {
    const targetRow = this.page.getByRole('row').filter({
      has: this.page.locator(`twc-table-cell[tooltipvalue="${instanceId}"]`)
    });
    const stateCell = targetRow.locator('twc-table-cell').nth(3);
    return await stateCell.getAttribute('tooltipvalue');
  }
}
