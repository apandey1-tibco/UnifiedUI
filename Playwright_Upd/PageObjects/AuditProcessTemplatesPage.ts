import { Locator, Page, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class AuditProcessTemplatesPage {
  readonly page: Page;
  readonly processTemplatesTable: Locator;
  readonly processTemplatesrows: Locator;
  readonly processTemplatesCell: Locator;

  readonly filterIcon: Locator;
  readonly stateFilterIcon: Locator;
  readonly applyFilterBtn: Locator;
  readonly cancelBtn: Locator;
  readonly clearFilters: Locator;
  readonly submitBtn: Locator;
  readonly closeBtn: Locator;
  readonly resetAllBtn: Locator;
  readonly saveFilterBtn: Locator;
  readonly ptFilterHeading: Locator;
  readonly stFilterHeading: Locator;
  readonly stateDdl: Locator;
  readonly stateDdlOption: Locator;
  readonly filterTxtBox: Locator;
  readonly saveBtn: Locator;
  readonly savedFilterOption: Locator;
  readonly editFilterBtn: Locator;
  readonly deleteFilterBtn: Locator;
  readonly dismissBtn: Locator;
  readonly ptInputName: Locator;

  readonly coloumnIcon: Locator;
  readonly refreshIcon: Locator;
  readonly columnSelectorIcon: Locator;
  readonly processTemplatesHeader: Locator;
  readonly allProcessTemplatesHeader: Locator;
  readonly saveBtnForSate: Locator;
  readonly processTempRows: Locator;
  readonly additionAttributeSection: Locator;
  readonly processInstances: Locator;
  readonly processTempTableHeader: Locator;
  readonly processInstancesCases: Locator;
  readonly columnSelector: Locator;
  readonly processTemplates: Locator;
  readonly ptProcInstRows: Locator;
  readonly backoProcessTemplatesBtn: Locator;
  readonly auditDetailsWrapper: Locator;
  readonly auditDetailsRows: Locator;
  readonly eventDetailsSidebar: Locator;
  readonly closeEventDetailsButton: Locator;
  readonly addRuleButton4x: Locator; // 4x
  readonly ruleFieldSelect4x: Locator; // 4x
  readonly operatorSelect4x: Locator; // 4x
  readonly ruleValueInput4x: Locator; // 4x
  readonly ruleValueSelect4x: Locator; // 4x - dropdown value (e.g. Severity)
  readonly filterQueryText4x: Locator; // 4x
  readonly ruleBuilderCloseBtn4x: Locator; // 4x
  readonly saveAuditFilterBtn4x: Locator; // 4x
  readonly resetAuditFilterBtn4x: Locator; // 4x
  readonly applyFilterActionButton4x: Locator; // 4x
  readonly filterLabelTag4x: Locator; // 4x
  readonly saveFilterButtonafterapply4x: Locator; // 4x
  readonly saveQueryDialogHeader4x: Locator; // 4x
  readonly saveQuerySaveButton4x: Locator; // 4x
  readonly saveQueryInputField4x: Locator; // 4x
  readonly saveQueryDialogCloseBtn4x: Locator; // 4x

  constructor(page: Page) {
    this.page = page;
    this.processTemplatesTable = page.locator("twc-table");
    //this.processTemplatesHeader = page.locator('twc-table-head-cell')
    this.processTemplatesrows = page.locator("twc-table-row");
    this.processTemplatesCell = page.locator("twc-table-cell");

    this.filterIcon = page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Filter Filter" })
      .locator("svg");

    this.stateFilterIcon = page.locator("twc-icon[name='add-new']");
    this.applyFilterBtn = page.getByRole("button", { name: "Apply Filters" });
    this.cancelBtn = page.getByText("Cancel");
    this.clearFilters = page.getByRole("button", {
      name: "Clear filter",
    });
    this.submitBtn = page.getByText("Submit");
    this.closeBtn = page.getByTitle("Close");
    this.resetAllBtn = page.getByRole("button", { name: "Reset all" });
    //this.saveFilterBtn = page.getByRole('button', { name: 'Save' })
    this.saveFilterBtn = page.locator("twc-icon[name='savefilter']");

    this.ptFilterHeading = page
      .locator(".filter-container")
      .locator(".header__title")
      .getByText("Filters");

    this.stFilterHeading = page
      .locator(".content-section")
      .locator("[part='clear-filter-btn-wrapper']")
      .getByText("Clear filter");

    this.stateDdl = page.locator("#CURRENT_STATE twc-popup div").first();

    this.stateDdlOption = page.getByRole("option", {
      name: "Deployed",
      exact: true,
    });

    this.filterTxtBox = page.getByRole("textbox");
    //.getByPlaceholder('Save filter');

    this.saveBtn = page
      .locator("twc-dialog")
      .locator("twc-button")
      .getByText("Save");

    this.saveBtnForSate = page.getByRole("button", { name: "Save" });

    this.dismissBtn = page
      .locator("twc-alert-dialog")
      .locator("twc-button")
      .getByText("Dismiss");

    this.editFilterBtn = page
      .getByRole("menuitem", { name: "Edit filter" })
      .locator("div")
      .first();

    this.deleteFilterBtn = page
      .getByRole("menuitem", { name: "Delete filter" })
      .locator("div")
      .first();

    this.ptInputName = page.getByRole("textbox");

    this.refreshIcon = page.locator("[tooltipcontent='Refresh']");
    this.columnSelectorIcon = page.locator(
      "[tooltipcontent='Column Selector']"
    );
    this.processTemplatesHeader = page.getByTitle("Process templates", {
      exact: true,
    });
    this.allProcessTemplatesHeader = page
      .locator("twc-content-pane")
      .getByText("All Process templates");

    this.processTempRows = page.locator("twc-table-row");
    this.additionAttributeSection = page.locator(
      "twc-tab[panel='additionalAttributes']"
    );
    this.processInstances = page
      .locator("twc-button")
      .locator("text=Process instances")
      .first();
    this.processInstancesCases = page
      .locator("twc-button")
      .locator("text=Applications")
      .first();
    this.columnSelector = page.locator(
      "twc-toolbar-item[tooltipcontent='Column Selector']"
    );
    this.ptProcInstRows = page.locator("twc-table-row");

    //this.processInstances = page.locator("text=Process instances").first();
    this.backoProcessTemplatesBtn = page
      .locator("twc-button")
      .locator("text=Back to Process Templates");
    this.auditDetailsWrapper = page.locator('div.audit-details-wrapper');
    this.auditDetailsRows = page.locator('bpme-audit-list-managed-objects twc-table-row');
    this.eventDetailsSidebar = page.locator('twc-sidebar.audit-details-sidebar');
    this.closeEventDetailsButton = page.locator('twc-icon.close-icon[name="x-lg"]');
    this.addRuleButton4x = page.getByRole('button', { name: 'Rule Add Rule' }); // 4x
    this.ruleFieldSelect4x = page.locator('twc-dialog[label="Audit filter"] div.field-with-search twc-select'); // 4x
    this.operatorSelect4x = page.locator('twc-dialog[label="Audit filter"] twc-select.operatorData'); // 4x
    this.ruleValueInput4x = page.locator("div.defaultData twc-input").locator('input'); // 4x
    this.ruleValueSelect4x = page.locator("div.defaultData twc-select"); // 4x
    this.filterQueryText4x = page.locator('div > twc-dialog div.filter-text.queryResult'); // 4x
    this.ruleBuilderCloseBtn4x = page.locator('twc-dialog[label="Audit filter"]').locator('twc-icon[name="x"]').first(); // 4x
    this.saveAuditFilterBtn4x = page.locator('twc-dialog[label="Audit filter"]').getByRole('button', { name: 'Save', exact: true }); // 4x
    this.resetAuditFilterBtn4x = page.locator('twc-dialog[label="Audit filter"]').getByRole('button', { name: 'Reset', exact: true }); // 4x
    this.applyFilterActionButton4x = page.locator("div.actionBtn twc-button"); // 4x
    this.filterLabelTag4x = page.locator("div.filter-label twc-tag"); // 4x
    this.saveFilterButtonafterapply4x = page.getByRole("button", { name: "Save filters" }); // 4x
    this.saveQueryDialogHeader4x = page.locator("twc-dialog").getByText("Save query for selected filters"); // 4x
    this.saveQuerySaveButton4x = page.locator("twc-dialog").filter({ hasText: "Save query for selected filters" }).getByRole("button", { name: "Save", exact: true }); // 4x
    this.saveQueryInputField4x = page.locator("twc-dialog").filter({ hasText: "Save query for selected filters" }).getByRole("textbox"); // 4x
    this.saveQueryDialogCloseBtn4x = page.locator("twc-dialog").filter({ hasText: "Save query for selected filters" }).locator('twc-icon[part="close-button"][label="Close"]'); // 4x
  }

  /**
   * Get all header values as an array of strings.
   * @returns {Promise<string[]>}
   */
  async getHeaderValues(): Promise<string[]> {
    const headerTexts = await this.processTemplatesHeader.evaluateAll(
      (workItemTableHeader) =>
        workItemTableHeader.map((header) => header.textContent?.trim() || "")
    );
    return headerTexts;
  }

  /**
   * Validate the headers against the expected list of headers.
   * @param {string[]} expectedHeaders - The expected header values.
   * @returns {Promise<boolean>} - Returns true if the headers match.
   */
  async validateHeaders(expectedHeaders: string[]): Promise<boolean> {
    const actualHeaders = await this.getHeaderValues();

    // Normalize headers by trimming and converting to lowercase
    const normalizedActualHeaders = actualHeaders.map((header) =>
      header.trim().toLowerCase()
    );
    const normalizedExpectedHeaders = expectedHeaders.map((header) =>
      header.trim().toLowerCase()
    );

    return (
      JSON.stringify(normalizedActualHeaders) ===
      JSON.stringify(normalizedExpectedHeaders)
    );
  }

  /**
   * Wait for the table headers to be visible.
   */
  async waitForHeadersToLoad(): Promise<void> {
    await this.processTemplatesHeader.first().waitFor({ state: "visible" });
  }

  // Method to fetch the data of a specific row by index
  async getRowData(rowIndex: number): Promise<string[]> {
    const row = this.processTemplatesrows.nth(rowIndex);
    const cells = row.locator("twc-table-cell"); // Update this selector with your cell selector
    const cellCount = await cells.count();
    const rowData: string[] = [];

    for (let i = 0; i < cellCount; i++) {
      const cellText = await cells.nth(i).textContent();
      rowData.push(cellText?.trim() || "");
    }
    return rowData;
  }

  // Method to validate a single row
  async validateRow(rowIndex: number, expectedValues: string[]): Promise<void> {
    const actualValues = await this.getRowData(rowIndex);
  }

  async caseFilterIcon(): Promise<Locator> {
    return this.filterIcon;
  }
  async getptFilterheading() {
    return await this.ptFilterHeading.innerText();
  }

  async getstFilterheading() {
    return await this.stFilterHeading.innerText();
  }
  async clickOnPtFilterIcon() {
    await this.filterIcon.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnSelectState() {
    await this.stateFilterIcon.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnStateDropdown() {
    await this.stateDdl.click();
    await this.page.waitForTimeout(2000);
  }

  async selectStateOption() {
    await this.stateDdlOption.click();
  }

  async clickOnApplyFilterBtn() {
    await this.applyFilterBtn.click();
  }

  async clickOnSaveFilterBtn() {
    await this.saveFilterBtn.click();
  }

  async clickOnFilterTxtBox() {
    await this.filterTxtBox.click();
    await this.filterTxtBox.fill("Deployed");
    await this.page.waitForTimeout(2000);
  }

  async clickOnClearTextBoxValue() {
    await this.filterTxtBox.clear();
    //await this.filterTxtBox.fill('Deployed1')
    await this.page.waitForTimeout(2000);
  }

  async clickOnSaveBtn() {
    await this.saveBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnSaveBtnForSate() {
    await this.saveBtnForSate.click();
    await this.page.waitForTimeout(2000);
  }

  // async clickOnSavedFilterOptions (){
  //   await this.savedFilterOption.hover();
  // }

  async selectSavedFilterRowContent(value: string): Promise<Locator> {
    return this.page
      .locator(".filter-container bpme-infinite-scroll")
      .getByRole("menuitem", { name: value });
  }
  async clickOnThreeDotsIconForSavedFIlter(value: string) {
    (await this.selectSavedFilterRowContent(value)).hover();
    (await this.selectSavedFilterRowContent(value))
      .locator("[name='three-dots-vertical']")
      .click();
  }

  async clickOnEditFilterBtn() {
    await this.editFilterBtn.click();
  }
  async clickOnDeleteFilterBtn() {
    await this.deleteFilterBtn.click();
  }

  async clickOnCancelBtn() {
    await this.cancelBtn.click();
  }

  async clickOnDeleteBtn() {
    await this.deleteFilterBtn.click();
  }

  async clickOnDismissBtn() {
    await this.dismissBtn.click();
  }

  async ClickOnInputBoxName(value: string): Promise<void> {
    await this.ptInputName.click();
    await this.ptInputName.fill(value);
  }

  //  Process Template Tabular Section
  async caseColoumnIcon(): Promise<Locator> {
    return this.page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Column selector" })
      .locator("svg");
  }

  async casesRefreshIcon(): Promise<Locator> {
    return this.page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Refresh" })
      .locator("svg");
  }

  // async getPtTableDetails(rowName: string, cellIndex: number) {
  // const cell = await this.page
  //   .locator(`twc-table-row[details*='"name":"${rowName}"']`)
  //   .locator(`twc-table-cell:nth-child(${cellIndex})`);
  // return cell;
  // }

  //   async getPtTableDetails(name: string) {
  //   const details = await this.page
  //     .locator(`twc-table-row[details*='"name":"${name}"']`)
  //     .getAttribute("details");

  //   // return details;
  //   if (details) {
  //     const data: {
  //       casedata: {
  //         ptID: string;
  //         ptState: string;
  //         ptName: string;
  //         ptVersion: string;

  //       };
  //     } = JSON.parse(details);
  //     return data;
  //   }
  // }

  // const table = await this.page.locator('twc-table');
  // const tableRows = await table.locator('twc-table-row').elements();

  async getRefreshIcon(): Promise<Locator> {
    return this.refreshIcon;
  }

  async getColumnSelectorIcon(): Promise<Locator> {
    return this.columnSelectorIcon;
  }
  async getProcessTemplatesHeader(): Promise<Locator> {
    return this.processTemplatesHeader;
  }
  async getAllProcessTemplatesHeader(): Promise<Locator> {
    return this.allProcessTemplatesHeader;
  }
  async verifyPtDropdown() {
    await expect(this.page.getByRole("combobox")).toHaveValue(
      "Process Templates"
    );
  }

  async stateCheckBox(): Promise<Locator> {
    return this.page
      .getByRole("menuitem", { name: "State", exact: true })
      .locator("twc-checkbox label input");
  }

  async selectStateColoumn() {
    await this.page
      .locator(".selectedData")
      .getByText("State", { exact: true })
      .click();
  }
  async nameCheckBox(): Promise<Locator> {
    return this.page
      .getByRole("menuitem", { name: "State", exact: true })
      .locator("twc-checkbox label input");
  }

  async validateRowContains(
    rowIndex: number,
    expectedValues: string[]
  ): Promise<boolean> {
    const rowLocator = this.processTempRows
      .nth(rowIndex)
      .locator("twc-table-cell");
    const actualValues = await rowLocator.evaluateAll((cells) =>
      cells.map((cell) => cell.textContent?.trim() || "")
    );

    // console.log(`Row ${rowIndex} Validation (Contains Check):`);
    //console.log('Actual:', actualValues);
    //console.log('Expected Substrings:', expectedValues);

    // Validate each cell contains the corresponding expected substring
    const isValid = expectedValues.every((expected, index) =>
      actualValues[index]?.includes(expected)
    );

    if (!isValid) {
      console.error(`Validation failed for row ${rowIndex}`);
      actualValues.forEach((value, index) => {
        if (!value.includes(expectedValues[index])) {
          console.error(
            `Mismatch at column ${index}: Expected substring "${expectedValues[index]}", Found "${value}"`
          );
        }
      });
    }
    return isValid;
  }

  async clickonWorkItemRecord() {
    await this.processTempRows.first().click();
  }

  async clickonAddtionAttributeSection() {
    await this.additionAttributeSection.click();
  }
  async navigatetoProcessInstances() {
    await this.processInstances.click();
    await this.page.waitForTimeout(600);
  }
  async navigateToProcessTemplate() {
    await this.page
      .locator("twc-list-item:nth-child(5) > .menu-item > .menu-item__label")
      .click();
    await this.page.waitForSelector("bpme-common-audit-table");
  }

  // async navigateToProcessTemplate() {
  //   await this.processTemplates.click();
  // }
  async clickonProcessInstancesCases() {
    await this.processInstancesCases.click();
  }

  async validateAlertText(expectedText: string) {
    let alertText = "";
    this.page.on("dialog", async (dialog) => {
      alertText = dialog.message();
    });
  }

  async clickonColumnSelector() {
    await this.columnSelector.click();
  }

  async clickonColumnSelector4x() { // 4x
    await this.page.locator('twc-icon[name="add-new"][slot="trailing-close"]').last().click();
  }

  async clickOnAuditFilterDialog4x() { // 4x
    await this.page.locator('twc-icon[name="add-new"][slot="trailing-close"]').first().click();
  }

  async verifyAuditFilterDialog4x() { // 4x
    const dialog = this.page.locator('twc-dialog[label="Audit filter"]');
    await expect(dialog).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Rule Add Rule' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Ruleset Add Ruleset' })).toBeDisabled();
  }

  async closeAFDialog4x() { // 4x
    await this.page.locator('twc-icon[name="arrow-back"]').click();
    await this.page.waitForTimeout(1000);
  }

  async closecreationAFDialog4x() { // 4x
    await this.page
      .locator('twc-dialog[label="Audit filter"]')
      .locator('twc-icon[part="close-button"] div[aria-label="Close"]').click();
    await this.page.waitForTimeout(500);
  }

  async verifyFilterRuleBuilder4x(): Promise<void> { // 4x
    await expect(this.ruleFieldSelect4x).toBeVisible();
    await expect(this.operatorSelect4x).toBeVisible();
    await expect(this.ruleValueInput4x).toBeVisible();

    const ruleLabel = await this.ruleFieldSelect4x.locator('input.select__display-input').inputValue();
    const operatorLabel = await this.operatorSelect4x.locator('input.select__display-input').inputValue();
    const inputValue = await this.ruleValueInput4x.inputValue();

    const expectedText = `Filter: ${ruleLabel} ${operatorLabel}${inputValue ? ` '${inputValue}'` : ''}`;
    await expect(this.filterQueryText4x).toContainText(expectedText);

    await this.ruleBuilderCloseBtn4x.click();
  }

  savedFilterItem4x(name: string): Locator { // 4x
    return this.page.locator(`twc-list-item#${name}`);
  }

  async selectDropdownFirstOption4x(select: Locator): Promise<void> { // 4x
    await select.locator('twc-popup svg').click();
    await this.page.waitForTimeout(300);
    await select.locator('twc-option').first().click();
  }

  async selectDropdownOptionByText4x(select: Locator, text: string): Promise<void> { // 4x
    await select.locator('twc-popup svg').click();
    await this.page.waitForTimeout(300);
    await select.locator('twc-option').filter({ hasText: text }).click();
  }

  async selectDropdownOptionBySearch4x(select: Locator, text: string): Promise<void> { // 4x - for searchable field dropdowns
    await select.locator('twc-popup svg').click();
    await this.page.waitForTimeout(300);
    await select.locator('input.select__display-input').pressSequentially(text, { delay: 50 });
    await this.page.waitForTimeout(500);
    await select.locator('twc-option').filter({ hasText: text }).click();
  }

  async verifyPriorityColumnOrNoData4x(expectedPriority: string, noDataText: string): Promise<void> { // 4x
    const colIndex = await this.page.locator("div > twc-table twc-table-head-cell").evaluateAll(
      (cells) => cells.findIndex((c) => (c as HTMLElement).id === 'Priority')
    );
    const nth = colIndex >= 0 ? colIndex + 1 : 2;
    const texts = await this.page.locator(
      `div > twc-table twc-table-row twc-table-cell:nth-child(${nth})`
    ).allTextContents();
    const nonEmpty = texts.map(t => t.trim()).filter(t => t !== '');
    if (nonEmpty.length > 0) {
      for (const text of nonEmpty) {
        expect(text).toContain(expectedPriority);
      }
    } else {
      await expect(this.page.getByText(noDataText)).toBeVisible();
    }
  }

  async verifyAndConfirmDeleteFilterDialog4x(): Promise<void> { // 4x
    const alertDialog = this.page.locator('twc-alert-dialog.filter-delete-dialog');
    await expect(alertDialog.locator('[slot="labelIcon"]')).toBeVisible();
    await expect(alertDialog.locator('[slot="labelText"]')).toContainText("Delete filter");
    await expect(alertDialog.locator('[slot="bodyHeader"]')).toContainText("Are you sure you want to delete?");
    await expect(alertDialog.locator('[slot="bodyContent"]')).toContainText("This action is permanent and cannot be undone.");
    await expect(alertDialog.locator('twc-button[slot="confirm"]')).toBeVisible();
    await alertDialog.locator('twc-button[slot="confirm"]').click();
  }

  async clickOnCOlumn() {
    await this.page.locator("[name='view_column']").click();
    await this.page.waitForTimeout(1000);
  }

  async verifyDropdown() {
    await expect(this.page.getByRole("combobox")).toHaveValue(
      "Process Templates"
    );
  }

  async getCellValueText(rascName: string) {
    await this.page
      .locator(`twc-table-cell`)
      .getByText(rascName, { exact: true })
      .click();
  }

  async validateptProcInstRowContains(
    rowIndex: number,
    expectedValues: string[]
  ): Promise<boolean> {
    const rowLocator = this.ptProcInstRows
      .nth(rowIndex)
      .locator("twc-table-cell");
    const actualValues = await rowLocator.evaluateAll((cells) =>
      cells.map((cell) => cell.textContent?.trim() || "")
    );
    const isValid = expectedValues.every((expected, index) =>
      actualValues[index]?.includes(expected)
    );

    if (!isValid) {
      console.error(`Validation failed for row ${rowIndex}`);
      actualValues.forEach((value, index) => {
        if (!value.includes(expectedValues[index])) {
          console.error(
            `Mismatch at column ${index}: Expected substring "${expectedValues[index]}", Found "${value}"`
          );
        }
      });
    }
    return isValid;
  }

  async backToProcessTemplates() {
    await this.backoProcessTemplatesBtn.click();
  }

  async getRowIndexByTemplateName4x(name: string): Promise<number> {
    const count = await this.processTempRows.count();
    for (let i = 0; i < count; i++) {
      const nameCell = await this.processTempRows
        .nth(i)
        .locator("twc-table-cell")
        .nth(2)
        .textContent();
      if (nameCell?.trim().includes(name)) return i;
    }
    return -1;
  }
}
