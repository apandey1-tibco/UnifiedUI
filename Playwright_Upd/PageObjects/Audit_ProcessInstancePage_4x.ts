//Created by Deepali Shelke
// Page Object for Audit > Process Instances on 4x server (2203_Automation)
// URL: http://gasdbpmc2ebld01.dev.tibco.com/apps/bpmeapp/#/work-manager/nav-menu/bpmAudit
import { expect, type Locator, type Page } from "@playwright/test";

const dataset = JSON.parse(JSON.stringify(require("../fixtures/TestData.json")));
const d = dataset.auditProcessInstance4x;

export class Audit_ProcessInstancePage_4x {
  readonly page: Page;
  readonly mainAuditPage: Locator;
  readonly processInstanceRows: Locator;
  readonly findInstanceButton: Locator;
  readonly closeDialogButton: Locator;
  readonly processInstanceInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly emptyMessage: Locator;
  readonly noDataAvailableLabel: Locator;
  readonly verticalThreeDots: Locator;
  readonly referencedProcesses: Locator;
  readonly referencedCases: Locator;
  readonly sourceProcessTemplate: Locator;
  readonly refreshButton: Locator;
  readonly navigateBackButton: Locator;
  readonly auditDetailsWrapper: Locator;
  readonly auditDetailsRows: Locator;
  readonly closeEventDetailsButton: Locator;
  readonly eventDetailsSidebar: Locator;
  readonly filterIcon: Locator;
  readonly addFilterIcon: Locator;
  readonly addRuleButton: Locator;
  readonly ruleValueInput: Locator;
  readonly saveFilterButton: Locator;
  readonly filterQueryText: Locator;
  readonly addRulesetButton: Locator;
  readonly filterNoText: Locator;
  readonly applyFilterActionButton: Locator;
  readonly filterLabelTag: Locator;
  readonly saveFilterButtonafterapply: Locator;
  readonly saveQueryDialogHeader: Locator;
  readonly saveQuerySaveButton: Locator;
  readonly saveQueryInputField: Locator;
  readonly saveQueryDialogCloseBtn: Locator;
  readonly ruleFieldSelect: Locator;
  readonly operatorSelect: Locator;
  readonly ruleBuilderCloseBtn: Locator;
  readonly processInstancesNavLink: Locator;
  readonly arrowBackButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainAuditPage = page.locator("twc-navmenu-item#bpmAudit");
    this.processInstanceRows = page.locator("div > twc-table twc-table-row");
    this.findInstanceButton = page.locator("twc-button[class='save-filter-btn']");
    this.closeDialogButton = page.locator('bpme-process-instance-find-dialog').locator('twc-icon[part="close-button"]');
    this.processInstanceInput = page.locator("twc-dialog").getByRole("textbox");
    this.searchButton = page.locator("twc-button").getByText("Search");
    this.resetButton = page.locator("bpme-process-instance-find-dialog twc-button").getByText("Reset");
    this.emptyMessage = page.locator('div[class="empty-message"]');
    this.noDataAvailableLabel = page.locator('div[part="nodata-available-Label"]');
    this.verticalThreeDots = page.locator('twc-icon-button[name="three-dots-vertical"]').first();
    this.referencedProcesses = page.locator("twc-menu-item").getByText("Referenced processes").first();
    this.referencedCases = page.locator("twc-menu-item").getByText("Referenced cases").first();
    this.sourceProcessTemplate = page.locator("twc-menu-item").getByText("Source process template", { exact: true }).first();
    this.refreshButton = page.locator("twc-toolbar-item[tooltipcontent='Refresh']");
    this.navigateBackButton = page.locator('twc-button').filter({ hasText: 'Back to Process Instances' });
    this.auditDetailsWrapper = page.locator('div.audit-details-wrapper');
    this.auditDetailsRows = page.locator('bpme-audit-list-managed-objects twc-table-row');
    this.closeEventDetailsButton = page.locator('twc-icon.close-icon[name="x-lg"]');
    this.eventDetailsSidebar = page.locator('twc-sidebar.audit-details-sidebar');
    this.filterIcon = page.locator("twc-toolbar-item").filter({ hasText: "Filter Filter" }).locator("svg");
    this.addFilterIcon = page.locator("twc-icon").filter({ hasText: "0" });
    this.addRuleButton = page.getByRole("button", { name: "Rule Add Rule" });
    this.saveFilterButton = page.getByRole("button", { name: "Save", exact: true });
    this.filterQueryText = page.locator("div > twc-dialog div.filter-text.queryResult");
    this.addRulesetButton = page.getByRole("button", { name: "Ruleset Add Ruleset" });
    this.filterNoText = page.locator('div[part="filter-no-text"].queryResult');
    this.applyFilterActionButton = page.locator("div.actionBtn twc-button");
    this.filterLabelTag = page.locator("div.filter-label twc-tag");
    this.saveFilterButtonafterapply = page.getByRole("button", { name: "Save filters" });
    this.saveQueryDialogHeader = page.locator("twc-dialog").getByText(d.saveQueryDialogTitle);
    this.saveQuerySaveButton = page.locator("twc-dialog").filter({ hasText: d.saveQueryDialogTitle }).getByRole("button", { name: "Save", exact: true });
    this.saveQueryInputField = page.locator("twc-dialog").filter({ hasText: d.saveQueryDialogTitle }).getByRole("textbox");
    this.saveQueryDialogCloseBtn = page.locator("twc-dialog").filter({ hasText: d.saveQueryDialogTitle }).locator('twc-icon[part="close-button"][label="Close"]');
    this.ruleFieldSelect = page.locator("div.field-with-search twc-select");
    this.operatorSelect = page.locator("twc-select.operatorData");
    this.ruleValueInput = page.locator("div.defaultData twc-input");
    this.ruleBuilderCloseBtn = page.locator('#bpme-filter-ctrl twc-button').filter({ hasText: 'Close' });
    this.processInstancesNavLink = page.locator('#PROCESS_INSTANCE');
    this.arrowBackButton = page.locator('twc-icon[name="arrow-back"]');
  }

  savedFilterItem(name: string): Locator {
    return this.page.locator(`twc-list-item#${name}`);
  }

  async selectDropdownFirstOption(select: Locator): Promise<void> {
    await select.locator('twc-popup svg').click();
    await this.page.waitForTimeout(300);
    await select.locator('div.options-list > twc-option:nth-child(1)').click();
  }

  async selectDropdownOptionByText(select: Locator, text: string): Promise<void> {
    await select.locator('twc-popup svg').click();
    await this.page.waitForTimeout(300);
    await select.locator('div.options-list twc-option').filter({ hasText: text }).click();
  }

  async verifyPriorityColumnOrNoData(expectedPriority: string, noDataText: string): Promise<void> {
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

  async navigateToProcessInstancesList(): Promise<void> {
    await this.processInstancesNavLink.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async navigateToAudit() {
    await this.mainAuditPage.click();
    await this.page.waitForLoadState("domcontentloaded");
  }

  async refresh(): Promise<void> {
    await this.refreshButton.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(1000);
  }

  async fillProcessInstanceID(value: string): Promise<void> {
    await this.processInstanceInput.click();
    await this.processInstanceInput.pressSequentially(value);
  }

  async clickSearch(): Promise<void> {
    await this.searchButton.click();
  }

  async clickReset(): Promise<void> {
    await this.resetButton.click();
  }

  async closeFindInstanceDialog(): Promise<void> {
    await this.closeDialogButton.click();
  }

  async verifyAuditFilterDialog(): Promise<void> {
    await expect(
      this.page.locator('div[part="panel"][role="dialog"][aria-hidden="false"]')
        .filter({ hasText: d.auditFilterDialogTitle })
    ).toBeVisible();
    await expect(this.addRuleButton).toBeVisible();
    await expect(this.addRulesetButton).toBeDisabled();
    await expect(this.filterNoText).toContainText(d.noFilterAppliedMsg);
  }

  async verifyRuleBuilderPanel(): Promise<void> {
    await expect(this.ruleFieldSelect).toBeVisible();
    await expect(this.operatorSelect).toBeVisible();
    await expect(this.ruleValueInput).toBeVisible();

    const ruleLabel = await this.ruleFieldSelect.locator('input.select__display-input').inputValue();
    const operatorLabel = await this.operatorSelect.locator('input.select__display-input').inputValue();
    const inputValue = await this.ruleValueInput.locator('#input').inputValue();

    const expectedText = `Filter: ${ruleLabel} ${operatorLabel}${inputValue ? ` ${inputValue}` : ''}`;
    await expect(this.filterQueryText).toContainText(expectedText);

    await this.ruleBuilderCloseBtn.click();
  }

  async clickOnFilterIcon() {
    await this.filterIcon.click();
  }

  async clickOnAddFilterIcon() {
    await this.addFilterIcon.click();
  }

  async getCellValue(rowIndex: number, columnIndex: number): Promise<string> {
    const cell = this.processInstanceRows.nth(rowIndex).locator("twc-table-cell").nth(columnIndex);
    return (await cell.textContent())?.trim() || "";
  }

  async verifyAndConfirmDeleteFilterDialog(): Promise<void> {
    const alertDialog = this.page.locator('twc-alert-dialog.filter-delete-dialog');
    const dialog = this.page.getByRole('dialog', { name: d.deleteFilterTitle });

    await expect(alertDialog.locator('[slot="labelIcon"]')).toBeVisible();
    await expect(alertDialog.locator('[slot="labelText"]')).toContainText(d.deleteFilterTitle);
    await expect(alertDialog.locator('[slot="bodyHeader"]')).toContainText(d.deleteFilterConfirmMsg);
    await expect(alertDialog.locator('[slot="bodyContent"]')).toContainText(d.deleteFilterPermanentMsg);
    await expect(alertDialog.locator('twc-button[slot="confirm"]')).toBeVisible();
    await expect(dialog.locator('twc-icon-button[part="close-button"]')).toBeVisible();

    await alertDialog.locator('twc-button[slot="confirm"]').click();
  }
}
