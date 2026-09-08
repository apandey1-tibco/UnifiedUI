import { Locator, Page, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class AuditApplicationsPage {
  readonly page: Page;
  readonly allApplicationsHeader: Locator;
  readonly applicationsHeader: Locator;
  readonly refreshIcon: Locator;
  readonly columnSelectorIcon: Locator;
  readonly filterIcon: Locator;
  readonly applicationsRows: Locator;
  readonly additionAttributeSection: Locator;
  readonly appProcessTemplates: Locator;
  readonly applicationEventRows: Locator;
  readonly backtoApplicationsBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.allApplicationsHeader = page
      .locator("twc-content-pane")
      .getByText("All Applications");
    this.applicationsHeader = page
      .locator("twc-content-pane")
      .getByText("Applications");
    this.refreshIcon = page.locator("[tooltipcontent='Refresh']");
    this.columnSelectorIcon = page.locator(
      "[tooltipcontent='Column Selector']"
    );
    this.filterIcon = page
      .locator("twc-toolbar-item")
      .filter({ hasText: "Filter Filter" })
      .locator("svg");

    this.applicationsRows = page.locator("twc-table-row");
    this.additionAttributeSection = page.locator(
      "twc-tab[panel='additionalAttributes']"
    );
    this.appProcessTemplates = page
      .locator("twc-button")
      .locator("text=Process templates")
      .first();
    this.applicationEventRows = page.locator("twc-table-row");
    this.backtoApplicationsBtn = page
      .locator("twc-button")
      .locator("text=Back to Applications");
  }
  async navigateToApplications() {
    await this.page
      .locator("twc-list-item:nth-child(6) > .menu-item > .menu-item__label")
      .click();
    await this.page.locator("bpme-common-audit-table").waitFor();
  }
  async getAllApplicationsHeader(): Promise<Locator> {
    return this.allApplicationsHeader;
  }
  async getApplicationsHeader(): Promise<Locator> {
    return this.applicationsHeader;
  }

  async verifyDropdown() {
    await expect(this.page.getByRole("combobox")).toHaveValue("Applications");
  }
  async getRefreshIcon(): Promise<Locator> {
    return this.refreshIcon;
  }
  async getColumnSelectorIcon(): Promise<Locator> {
    return this.columnSelectorIcon;
  }
  async clickOnPtFilterIcon() {
    await this.filterIcon.click();
    await this.page.waitForTimeout(2000);
  }
  async selectTypeColoumn() {
    await this.page
      .locator(".selectedData")
      .getByText("type", { exact: true })
      .click();
  }
  async selectStateColoumn() {
    await this.page
      .locator(".selectedData")
      .getByText("State", { exact: true })
      .click();
  }
  async typeCheckBox(): Promise<Locator> {
    return this.page
      .getByRole("menuitem", { name: "type", exact: true })
      .locator("twc-checkbox label input");
  }
  async clickonApplicationsRecord() {
    await this.applicationsRows.first().click();
  }
  async clickonAddtionAttributeSection() {
    await this.additionAttributeSection.click();
  }
  async navigatetoAppProcessTemplates() {
    await this.appProcessTemplates.click();
  }
  async clickonWorkItemRecord() {
    await this.applicationEventRows.first().click();
  }
  async backToApplication() {
    await this.backtoApplicationsBtn.click();
  }
}
