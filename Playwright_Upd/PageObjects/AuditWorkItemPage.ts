import { Locator, Page } from '@playwright/test';
import * as utility from "../fixtures/utility";

export class AuditWorkItemPage {
  readonly page: Page;
  readonly workItemTableHeader: Locator;
  readonly workItemrows: Locator;
  readonly allAttributesTab: Locator;
  readonly additionalAttributesTab: Locator;
  readonly allAttributesTableRows: Locator;
  readonly additionalAttributesTableRows: Locator;
  readonly relatedWorkItem: Locator;
  readonly relatedCases: Locator;
  readonly relatedCasesAlert: Locator;
  readonly columnSelector: Locator;
  readonly availableColumns: Locator;
  readonly selectedColumns: Locator;
  readonly cancelButton: Locator;
  readonly applyButton: Locator;
  readonly processInstanceID: Locator;
  readonly allAttributeSection: Locator;
  readonly additionAttributeSection: Locator;
  readonly workItemFilterIcon: Locator;
  readonly workItemAddFilterIcon: Locator;
  readonly addRuleButton: Locator;
  readonly clickOnRuleDropDown: Locator;
  readonly createRuleSearchField: Locator;
  readonly activityNameDropdownOption: Locator;
  readonly ruleValueInputField: Locator;
  readonly saveFilterButton: Locator;
  readonly applyFiltersButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.workItemTableHeader = page.locator('twc-table-head-cell[role="columnheader"]');
    this.workItemrows = page.locator('twc-table-row');
    this.allAttributesTab = page.locator('twc-tab#allAttributes');
    this.additionalAttributesTab = page.locator('div[name="additionalAttributes"] twc-table-row');
    this.allAttributesTableRows = page.locator('div[name="allAttributes"] twc-table-row');
    this.additionalAttributesTableRows = page.locator('div[name="additionalAttributes"] twc-table-row');
    this.relatedWorkItem = page.locator('text=Related work items').first();
    this.relatedCases = page.locator('twc-button').locator('text=Related cases').first();
    this.relatedCasesAlert = page.locator('twc-alert');
    this.columnSelector = page.locator("twc-toolbar-item[tooltipcontent='Column Selector']");
    this.availableColumns = page.getByText("Available Columns");
    this.selectedColumns = page.getByText("Selected Columns");
    this.cancelButton = page.locator('twc-button[slot="cancel"]');
    this.applyButton = page.getByText("Apply");
    this.processInstanceID = page.locator("twc-list-item").getByText("Process Instance ID");
    this.allAttributeSection = page.locator("#allAttributes");
    this.additionAttributeSection = page.locator("twc-tab[panel='additionalAttributes']");
    this.workItemFilterIcon = page.locator('twc-toolbar-item').filter({ hasText: 'Filter Filter' }).locator('svg');
    this.workItemAddFilterIcon = page.locator('twc-icon').filter({ hasText: '0' });
    this.addRuleButton = page.getByRole('button', { name: 'Rule Add Rule' });
    this.clickOnRuleDropDown = page.locator('twc-select').filter({ hasText: 'Work item priority Work item' }).getByRole('combobox');
    this.createRuleSearchField = page.getByRole('textbox');
    this.activityNameDropdownOption = page.getByRole('option', { name: 'Activity Name' }).locator('slot').nth(1);
    this.ruleValueInputField = page.locator('.defaultData').getByRole('textbox');
    this.saveFilterButton = page.getByRole('button', { name: 'Save' });
    this.applyFiltersButton = page.getByRole('button', { name: 'Apply Filters' });
  }

  /**
   * Get all header values as an array of strings.
   * @returns {Promise<string[]>}
   */
  async getHeaderValues(): Promise<string[]> {
    return this.workItemTableHeader.evaluateAll(
      (headers) => headers.map((header) => header.textContent?.trim() || '')
    );
  }

  /**
   * Validate the headers against the expected list of headers.
   * @param {string[]} expectedHeaders - The expected header values.
   * @returns {Promise<boolean>} - Returns true if the headers match.
   */
  async validateHeaders(expectedHeaders: string[]): Promise<boolean> {
    const actualHeaders = await this.getHeaderValues();
    return actualHeaders.length === expectedHeaders.length &&
      actualHeaders.every((header, index) => header.trim().toLowerCase() === expectedHeaders[index].trim().toLowerCase());
  }


  // Method to get all cells from a specific row
  async getRowData(rowIndex: number): Promise<string[]> {
    const row = this.workItemrows.nth(rowIndex).locator('twc-table-cell'); // Locate cells within the specified row
    const cellCount = await row.count(); // Count the number of cells
    const rowData: string[] = [];

    for (let i = 0; i < cellCount; i++) {
      const cellText = await row.nth(i).textContent(); // Get text content of each cell
      rowData.push(cellText?.trim() || ''); // Add trimmed text or an empty string if null
    }
    return rowData;
  }
  /**
  * Validate a row's data while skipping specific dynamic columns.
  * @param {number} rowIndex - The row index (0-based).
  * @param {string[]} expectedRowData - The expected row values.
  * @returns {Promise<boolean>} - True if the row data matches (excluding dynamic columns).
  */
  async validateRowDataSkippingDynamic(rowIndex: number, expectedRowData: string[]) {
    const dynamicColumnIndexes = [0, 2, 3]; // Skip Work Item ID (column 0) and First Offer Time (column 3)  
    const actualRowData = await this.getRowData(rowIndex);
    console.log(`Validating Row ${rowIndex}`);
    console.log("Actual Row Data:", actualRowData);
    console.log("Expected Row Data:", expectedRowData);
    // Validate number of columns (optional)
    if (actualRowData.length !== expectedRowData.length) {
      console.error(`Row ${rowIndex} length mismatch: Expected ${expectedRowData.length}, Found ${actualRowData.length}`);
      return false;
    }

    for (let i = 0; i < expectedRowData.length; i++) {
      // Skip validation for dynamic columns
      if (dynamicColumnIndexes.includes(i)) {
        console.log(`Skipping validation for dynamic column ${i}`);
        continue;
      }

      if (actualRowData[i] !== expectedRowData[i]) {
        console.error(
          `Mismatch at Row ${rowIndex}, Column ${i}: Expected "${expectedRowData[i]}", Found "${actualRowData[i]}"`
        );
        return false; // Validation failed
      }
    }
    return true; // Validation passed
  }


  //added
  async validateRowContains(rowIndex: number, expectedValues: string[]): Promise<boolean> {
    const rowLocator = this.workItemrows.nth(rowIndex).locator('twc-table-cell');
    const actualValues = await rowLocator.evaluateAll((cells) =>
      cells.map((cell) => cell.textContent?.trim() || '')
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
          console.error(`Mismatch at column ${index}: Expected substring "${expectedValues[index]}", Found "${value}"`);
        }
      });
    }
    return isValid;
  }

  async clickonInputNum1andNum2() {
    //await this.workItemrows.first().click();
    await this.page.locator(`twc-table-cell`)
      .getByText("InputNum1andNum2")
      .first()
      .click()
  }

  async clickonWorkItemRecord() {
    await this.workItemrows.first().click();
  }

  /**
  * * Get the text content of a specific cell.
  * @param {number} rowIndex - The row index (0-based).
  * @param {number} columnIndex - The column index (0-based).
  * @returns {Promise<string>} - The text content of the cell.
  */
  async getCellValue(rowIndex: number, columnIndex: number): Promise<string> {
    const cellLocator = this.workItemrows.nth(rowIndex).locator('twc-table-cell').nth(columnIndex); // Update cell selector
    return await cellLocator.textContent().then((text) => text?.trim() || '');
  }

  /**
   * Validate the text content of a specific cell.
   * @param {number} rowIndex - The row index (0-based).
   * @param {number} columnIndex - The column index (0-based).
   * @param {string} expectedValue - The expected value to validate.
   * @returns {Promise<boolean>} - True if the cell value matches the expected value.
   */
  async validateCellValue(rowIndex: number, columnIndex: number, expectedValue: string): Promise<boolean> {
    const actualValue = await this.getCellValue(rowIndex, columnIndex);
    const normalizedActual = actualValue.replace(/\s+/g, ' ').trim().toLowerCase();
    const normalizedExpected = expectedValue.replace(/\s+/g, ' ').trim().toLowerCase();
    console.log(`Validating Cell [${rowIndex}][${columnIndex}]: Expected "${expectedValue}", Found "${actualValue}"`);
    return actualValue === expectedValue;
  }

  /**
     * Validate attributes in a tab (All or Additional).
     * @param attributeRowsLocator Locator for the attribute rows
     * @param expectedAttributes Map of attribute names and expected values
     */
  async validateAttributes(
    attributeRowsLocator: Locator,
    expectedAttributes: { [key: string]: string }
  ): Promise<boolean> {
    const rowsCount = await attributeRowsLocator.count();
    for (let i = 0; i < rowsCount; i++) {
      const cells = attributeRowsLocator.nth(i).locator('twc-table-cell');
      const attributeName = (await cells.nth(0).textContent())?.trim();
      const attributeValue = (await cells.nth(1).textContent())?.trim();

      if (attributeName && expectedAttributes[attributeName] !== attributeValue) {
        console.error(
          `Attribute mismatch at Row ${i}: Expected "${expectedAttributes[attributeName]}" for "${attributeName}", Found "${attributeValue}"`
        );
        return false;
      }
    }
    return true;
  }

  async navigateToAdditionalAttributes() {
    await this.additionalAttributesTab.click();
  }

  async navigatetoRelatedWorkItem() {
    await this.relatedWorkItem.click();
  }

  async clickonRelatedCases() {
    await this.relatedCases.click();
  }

  /**
    * Trigger an alert and compare its text to the expected value.
    * @param locator - The locator for the element triggering the alert.
    * @param expectedText - The expected text of the alert dialog.
    */
  async validateAlertText(expectedText: string) {
    let alertText = '';
    this.page.on('dialog', async (dialog) => {
      alertText = dialog.message();
    });
  }

  async selectActivityNameRuleAndApply(value: string) {
    await this.addRuleButton.click();
    await this.clickOnRuleDropDown.click();
    await this.createRuleSearchField.click();
    await this.createRuleSearchField.fill('Activity Name');
    await this.activityNameDropdownOption.click();
    await this.ruleValueInputField.click();
    await this.ruleValueInputField.fill(value);
    await this.saveFilterButton.click();
    await this.applyFiltersButton.click();
  }

  async clickOnWorkItemFilterIcon() {
    await this.workItemFilterIcon.click();
  }

  async clickOnWorkItemAddFilterIcon() {
    await this.workItemAddFilterIcon.click();
  }

  async clickonColumnSelector() {
    await this.columnSelector.click();
  }
  async availableColoumnHeader() {
    return this.availableColumns;
  }
  selectedColoumnHeader() {
    return this.selectedColumns;
  }
  async clickonCancelButton() {
    await this.cancelButton.click();
  }
  async clickonApplyButton() {
    await this.applyButton.click();
  }
  async clickonAddtionAttributeSection() {
    await this.additionAttributeSection.click();
  }
  async clickOnCellValueText(rascName: string) {
    await this.page
      .locator(`twc-table-cell`)
      .getByText("InputNum1andNum2")
      .first()
      .click();
  }
}

