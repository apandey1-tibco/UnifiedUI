import { Locator, Page, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class AuditSystemPage {
  readonly page: Page;
  readonly allSystemHeader: Locator;
  readonly systemHeader: Locator;
  readonly refreshIcon: Locator;
  readonly columnSelectorIcon: Locator;
  readonly filterIcon: Locator;
  readonly systemRows: Locator;
  readonly allAttributesSection: Locator;
  readonly additionAttributeSection: Locator;
  readonly systemrows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allSystemHeader = page
      .locator("twc-content-pane")
      .getByText("All Systems", { exact: true });
    this.systemHeader = page
      .locator("bpme-filter")
      .getByText("System", { exact: true });
    this.refreshIcon = page.locator("[tooltipcontent='Refresh']");
    this.columnSelectorIcon = page.locator(
      "[tooltipcontent='Column Selector']"
    );
    this.filterIcon = page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Filter Filter" })
      .locator("svg");
    this.allAttributesSection = page.locator("twc-tab[panel='allAttributes']");
    this.additionAttributeSection = page.locator(
      "twc-tab[panel='additionalAttributes']"
    );
    this.systemrows = page.locator("twc-table-row");
  }
  async navigateToSystem() {
    await this.page
      .locator("twc-list-item:nth-child(7) > .menu-item > .menu-item__label")
      .click();
    await this.page.waitForSelector("bpme-common-audit-table");
  }
  async getAllSystemHeader(): Promise<Locator> {
    return this.allSystemHeader;
  }
  async getSystemsHeader(): Promise<Locator> {
    return this.systemHeader;
  }

  async verifyDropdown() {
    await expect(this.page.getByRole("combobox")).toHaveValue("System");
  }
  async getRefreshIcon(): Promise<Locator> {
    return this.refreshIcon;
  }
  async getColumnSelectorIcon(): Promise<Locator> {
    return this.columnSelectorIcon;
  }
  async clickOnSysFilterIcon() {
    await this.filterIcon.click();
    await this.page.waitForTimeout(2000);
  }
  async selectMessageIDColumn() {
    await this.page
      .locator(".selectedData")
      .getByText("Message ID", { exact: true })
      .click();
  }
  async messageIDCheckBox(): Promise<Locator> {
    return this.page
      .getByRole("menuitem", { name: "Message ID", exact: true })
      .locator("twc-checkbox label input");
  }
  async clickonAllAttributesSection() {
    await this.allAttributesSection.click();
  }
  async clickonAddtionAttributeSection() {
    await this.additionAttributeSection.click();
  }
  async clickOnSystemRecord() {
    await this.systemrows.first().click();
  }
  async validateRowContains(
    rowIndex: number,
    expectedValues: string[]
  ): Promise<boolean> {
    const rowLocator = this.systemrows.nth(rowIndex).locator("twc-table-cell");
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
      const cells = attributeRowsLocator.nth(i).locator("twc-table-cell");
      const attributeName = (await cells.nth(0).textContent())?.trim();
      const attributeValue = (await cells.nth(1).textContent())?.trim();

      if (
        attributeName &&
        expectedAttributes[attributeName] !== attributeValue
      ) {
        console.error(
          `Attribute mismatch at Row ${i}: Expected "${expectedAttributes[attributeName]}" for "${attributeName}", Found "${attributeValue}"`
        );
        return false;
      }
    }
    return true;
  }
}
