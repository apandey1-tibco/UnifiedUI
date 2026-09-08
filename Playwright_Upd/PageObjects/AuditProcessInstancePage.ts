//Created by Deepali Shelke
// Page Object for Audit > Process Instances on 4x server (2203_Automation)
// URL: http://gasdbpmc2ebld01.dev.tibco.com/apps/bpmeapp/#/work-manager/nav-menu/bpmAudit
import { expect, type Locator, type Page } from "@playwright/test";
import { LoginPage } from "./LoginPage";
//import { SwitchServerPage_4x } from "./SwitchServerPage_4x";

export class Audit_ProcessInstancePage_4x {
  readonly page: Page;
  readonly loginPage: LoginPage;
  //readonly switchServerPage: SwitchServerPage_4x;
  readonly mainAuditPage: Locator;
  readonly processInstance: Locator;
  readonly processInstanceTableHeader: Locator;
  readonly processInstanceRows: Locator;
  readonly findInstanceButton: Locator;
  readonly closeDialogButton: Locator;
  readonly processInstanceInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly emptyMessage: Locator;
  readonly verticalThreeDots: Locator;
  readonly referencedProcesses: Locator;
  readonly referencedCases: Locator;
  readonly sourceProcessTemplate: Locator;
  readonly referencedWorkItems: Locator;
  readonly relatedWorkItems: Locator;
  readonly relatedCases: Locator;
  readonly relatedCasesAlert: Locator;
  readonly parentProcessID: Locator;
  readonly rootProcessID: Locator;
  readonly refreshButton: Locator;
  readonly navigateBackButton: Locator;
  readonly auditDetailsWrapper: Locator;
  readonly auditDetailsRows: Locator;
  readonly closeEventDetailsButton: Locator;
  readonly eventDetailsSidebar: Locator;
  readonly columnSelector: Locator;
  readonly availableColumns: Locator;
  readonly selectedColumns: Locator;
  readonly cancelButton: Locator;
  readonly applyButton: Locator;
  readonly filterIcon: Locator;
  readonly addFilterIcon: Locator;
  readonly addRuleButton: Locator;
  readonly ruleDropdown: Locator;
  readonly ruleSearchField: Locator;
  readonly ruleValueInput: Locator;
  readonly saveFilterButton: Locator
  readonly applyFiltersButton: Locator;
  readonly filterQueryText: Locator;
  readonly filterDialogCloseButton: Locator;
  readonly filterDialogResetButton: Locator;
  readonly filterDialogSaveButton: Locator;
  readonly addRulesetButton: Locator;
  readonly filterNoText: Locator;
  readonly operatorDropdown: Locator;
  readonly ruleInputField: Locator;
  readonly applyFilterActionButton: Locator;
  readonly filterLabelTag: Locator;
  readonly saveFilterButtonafterapply: Locator;
  readonly saveQueryDialogHeader: Locator;
  readonly saveQueryCancelButton: Locator;
  readonly saveQuerySaveButton: Locator;
  readonly saveQueryInputField: Locator;
  readonly ruleFieldSelect: Locator;
  readonly operatorSelect: Locator;
  readonly ruleBuilderCloseBtn: Locator;

  // Initializes all locators for the Audit Process Instances 4x page
  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    //this.switchServerPage = new SwitchServerPage_4x(page);
    this.mainAuditPage = page.locator("twc-navmenu-item#bpmAudit");
    this.processInstance = this.createListViewLocator("Process Instances");
    this.processInstanceTableHeader = page.locator("div > twc-table twc-table-head-cell[role='columnheader']");
    this.processInstanceRows = page.locator("div > twc-table twc-table-row");
    this.findInstanceButton = page.locator("twc-button[class='save-filter-btn']");
    this.closeDialogButton = page.locator('bpme-process-instance-find-dialog').locator('twc-icon[part="close-button"]');
    this.processInstanceInput = page.locator("twc-dialog").getByRole("textbox");
    this.searchButton = page.locator("twc-button").getByText("Search");
    this.resetButton = page.locator("bpme-process-instance-find-dialog twc-button").getByText("Reset");
    this.emptyMessage = page.locator('div[class="empty-message"]');
    this.verticalThreeDots = page.locator('twc-icon-button[name="three-dots-vertical"]').first();
    this.referencedProcesses = page.locator("twc-menu-item").getByText("Referenced processes").first();
    this.referencedCases = page.locator("twc-menu-item").getByText("Referenced cases").first();
    this.sourceProcessTemplate = page.locator("twc-menu-item").getByText("Source process template", { exact: true }).first();
    this.referencedWorkItems = page.locator("text=Referenced work items").first();
    this.relatedWorkItems = page.locator("text=Related work items").first();
    this.relatedCases = page.locator("twc-button").locator("text=Related cases").first();
    this.relatedCasesAlert = page.locator("twc-alert");
    this.parentProcessID = page.locator("twc-list-item").getByText("Parent Process ID");
    this.rootProcessID = page.locator("twc-list-item").getByText("Root Process ID");
    this.refreshButton = page.locator("twc-toolbar-item[tooltipcontent='Refresh']");
    this.navigateBackButton = page.locator('twc-button').filter({ hasText: 'Back to Process Instances' });
    this.auditDetailsWrapper = page.locator('div.audit-details-wrapper');
    this.auditDetailsRows = page.locator('bpme-audit-list-managed-objects twc-table-row');
    this.closeEventDetailsButton = page.locator('twc-icon.close-icon[name="x-lg"]');
    this.eventDetailsSidebar = page.locator('twc-sidebar.audit-details-sidebar');
    this.columnSelector = page.locator("twc-toolbar-item[tooltipcontent='Column Selector']");
    this.availableColumns = page.getByText("Available Columns");
    this.selectedColumns = page.getByText("Selected Columns");
    this.cancelButton = page.locator('twc-button[slot="cancel"]');
    this.applyButton = page.getByText("Apply");
    this.filterIcon = page.locator("twc-toolbar-item").filter({ hasText: "Filter Filter" }).locator("svg");
    this.addFilterIcon = page.locator("twc-icon").filter({ hasText: "0" });
    this.addRuleButton = page.getByRole("button", { name: "Rule Add Rule" });
    this.ruleDropdown = page.locator("twc-select").getByRole("combobox").first();
    this.ruleSearchField = page.getByRole("textbox");
    this.ruleValueInput = page.locator(".defaultData").getByRole("textbox");
    this.saveFilterButton = page.getByRole("button", { name: "Save", exact: true });
    this.applyFiltersButton = page.getByRole("button", { name: "Apply Filters" });
    this.filterQueryText = page.locator("div > twc-dialog div.filter-text.queryResult");
    this.filterDialogCloseButton = page.locator("twc-dialog header twc-icon[part='close-button']");
    this.filterDialogResetButton = page.locator("twc-dialog").getByRole("button", { name: "Reset" });
    this.filterDialogSaveButton = page.locator("twc-dialog").getByRole("button", { name: "Save" });
    this.addRulesetButton = page.getByRole("button", { name: "Ruleset Add Ruleset" });
    this.filterNoText = page.locator('div[part="filter-no-text"].queryResult');
    this.operatorDropdown = page.locator("twc-select").getByRole("combobox").nth(1);
    this.ruleInputField = page.locator("#input");
    this.applyFilterActionButton = page.locator("div.actionBtn twc-button");
    this.filterLabelTag = page.locator("div.filter-label twc-tag");
    this.saveFilterButtonafterapply = page.getByRole("button", { name: "Save filters" });
    this.saveQueryDialogHeader = page.locator("twc-dialog").getByText("Save query for selected filters");
    this.saveQueryCancelButton = page.locator("twc-dialog twc-button").filter({ hasText: "Cancel" });
    this.saveQuerySaveButton = page.locator("twc-dialog").filter({ hasText: "Save query for selected filters" }).getByRole("button", { name: "Save", exact: true });
    this.saveQueryInputField = page.locator("twc-dialog").filter({ hasText: "Save query for selected filters" }).getByRole("textbox");
    this.ruleFieldSelect = page.locator("div.field-with-search twc-select");
    this.operatorSelect = page.locator("twc-select.operatorData");
    this.ruleValueInput = page.locator("div.defaultData twc-input");
    this.ruleBuilderCloseBtn = page.locator('#bpme-filter-ctrl twc-button').filter({ hasText: 'Close' });
  }

  // Returns a locator for a list view item by its exact title
  private createListViewLocator(title: string): Locator {
    return this.page.locator("twc-list-view").getByTitle(title, { exact: true });
  }

  // Clicks the Audit nav menu item and waits for the page to load
  async navigateToAudit() {
    await this.mainAuditPage.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  // Clicks Process Instances under Audit and waits for the list to render
  async clickOnProcessInstance() {
    await this.processInstance.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(1000);
  }

  // Clicks the first row in the Process Instances table
  async clickOnProcessInstanceRecord() {
    await this.processInstanceRows.first().click();
  }

  // Clicks the first row whose state cell shows STARTED
  async clickOnStartedProcess() {
    await this.page.locator("twc-table-cell").getByText("STARTED").first().click();
  }

  // Clicks the Referenced work items button in the detail panel
  async clickOnReferencedWorkItems() {
    await this.referencedWorkItems.click();
    await this.page.waitForTimeout(700);
  }

  // Clicks the Related work items button in the detail panel
  async clickOnRelatedWorkItems() {
    await this.relatedWorkItems.click();
  }

  // Clicks the Related cases button in the detail panel
  async clickOnRelatedCases() {
    await this.relatedCases.click();
  }

  // Types a Process Instance ID into the Find Instance search input
  async fillProcessInstanceID(value: string): Promise<void> {
    await this.processInstanceInput.click();
    await this.processInstanceInput.pressSequentially(value);
  }

  // Clicks the Search button in the Find Instance dialog
  async clickSearch(): Promise<void> {
    await this.searchButton.click();
  }

  // Clicks the Reset button in the Find Instance dialog
  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async closeDialog(): Promise<void> {
    await this.page.getByLabel('Close').click();
  }

  // Closes the Find Instance dialog
  async closeFindInstanceDialog(): Promise<void> {
    await this.closeDialogButton.click();
  }

  // Verifies the Audit Filter dialog is open with initial state:
  // dialog visible, Add Rule visible, Add Ruleset disabled, no filter text shown
  async verifyAuditFilterDialog(): Promise<void> {
    await expect(
      this.page.locator('div[part="panel"][role="dialog"][aria-hidden="false"]')
        .filter({ hasText: 'Audit filter' })
    ).toBeVisible();
    await expect(this.addRuleButton).toBeVisible();
    await expect(this.addRulesetButton).toBeDisabled();
    await expect(this.filterNoText).toContainText("No filter applied. To get started, add rules.");
  }

  // Verifies the rule builder panel after clicking Add Rule:
  // rule dropdown, operator dropdown, value input visible; filter query text matches dynamic selection
  async verifyRuleBuilderPanel(): Promise<void> {
    await expect(this.ruleFieldSelect).toBeVisible();
    await expect(this.operatorSelect).toBeVisible();
    await expect(this.ruleValueInput).toBeVisible();

    // Read current selections dynamically
    const ruleLabel = await this.ruleFieldSelect.locator('input.select__display-input').inputValue();
    const operatorLabel = await this.operatorSelect.locator('input.select__display-input').inputValue();
    const inputValue = await this.ruleValueInput.locator('#input').inputValue();

    // Build expected filter text: "Filter: <rule> <operator>" and append value if present
    const expectedText = `Filter: ${ruleLabel} ${operatorLabel}${inputValue ? ` ${inputValue}` : ''}`;
    await expect(this.filterQueryText).toContainText(expectedText);

    // Close the Audit filter dialog
    await this.ruleBuilderCloseBtn.click();
  }

  // Opens the Column Selector dialog
  async clickOnColumnSelector() {
    await this.columnSelector.click();
  }

  // Clicks Cancel in the Column Selector dialog
  async clickOnCancelButton() {
    await this.cancelButton.click();
  }

  // Clicks Apply in the Column Selector dialog
  async clickOnApplyButton() {
    await this.applyButton.click();
  }

  // Opens the filter panel
  async clickOnFilterIcon() {
    await this.filterIcon.click();
  }

  // Clicks the add-filter icon to open the rule builder
  async clickOnAddFilterIcon() {
    await this.addFilterIcon.click();
  }

  // Returns all column header text values as a string array
  async getHeaderValues(): Promise<string[]> {
    return this.processInstanceTableHeader.evaluateAll(
      (headers) => headers.map((h) => h.textContent?.trim() || "")
    );
  }

  // Returns the trimmed text of a specific table cell by row and column index
  async getCellValue(rowIndex: number, columnIndex: number): Promise<string> {
    const cell = this.processInstanceRows.nth(rowIndex).locator("twc-table-cell").nth(columnIndex);
    return (await cell.textContent())?.trim() || "";
  }

  // Returns the state cell (column 3) of the row matching the given Instance ID
  processInstanceState(instanceID: string): Locator {
    const row = this.page
      .locator("twc-table")
      .locator("twc-table-cell")
      .getByText(instanceID)
      .locator("xpath=ancestor::twc-table-row");
    return row.locator("twc-table-cell").nth(3);
  }

  // Verifies all elements of the Delete filter confirmation dialog and clicks "Yes, delete"
  async verifyAndConfirmDeleteFilterDialog(): Promise<void> {
    const alertDialog = this.page.locator('twc-alert-dialog.filter-delete-dialog');
    const dialog = this.page.getByRole('dialog', { name: 'Delete filter' });

    // Label icon visible (light DOM slot)
    await expect(alertDialog.locator('[slot="labelIcon"]')).toBeVisible();

    // Label text "Delete filter" (light DOM slot)
    await expect(alertDialog.locator('[slot="labelText"]')).toContainText("Delete filter");

    // Body header (light DOM slot)
    await expect(alertDialog.locator('[slot="bodyHeader"]')).toContainText("Are you sure you want to delete?");

    // Body content (light DOM slot)
    await expect(alertDialog.locator('[slot="bodyContent"]')).toContainText("This action is permanent and cannot be undone.");

    // Verify "Yes, delete" button visible (light DOM slot)
    await expect(alertDialog.locator('twc-button[slot="confirm"]')).toBeVisible();

    // Verify close button visible (shadow DOM)
    await expect(dialog.locator('twc-icon-button[part="close-button"]')).toBeVisible();

    // Click "Yes, delete"
    await alertDialog.locator('twc-button[slot="confirm"]').click();
  }

  // Adds a filter rule by name, fills the value, saves and applies the filter
  async selectRuleAndApply(ruleName: string, value: string) {
    await this.addRuleButton.click();
    await this.ruleDropdown.click();
    await this.ruleSearchField.click();
    await this.ruleSearchField.fill(ruleName);
    await this.page.getByRole("option", { name: ruleName }).locator("slot").nth(1).click();
    await this.ruleValueInput.click();
    await this.ruleValueInput.fill(value);
    await this.saveFilterButton.click();
    await this.applyFiltersButton.click();
  }

  async getProcessStateByInstanceID(instanceID: string): Promise<string | null> {
  return await this.page
    .locator('twc-table-row')
    .filter({ hasText: instanceID }) // 1. Find the row containing the instance ID
    .locator('twc-table-cell')       // 2. Target the cells within that specific row
    .nth(3)                          // 3. Select the 4th column (index 3)
    .textContent();                  // 4. Extract and return the text (e.g., 'COMPLETED')
}
}
