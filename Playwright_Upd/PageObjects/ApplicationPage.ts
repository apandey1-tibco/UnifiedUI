
import { expect, Locator, Page } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class ApplicationPage {
  readonly page: Page;
  readonly applicationIcon: Locator;
  readonly dataAdmin: Locator;
  readonly caseModels: Locator;
  readonly liveViews: Locator;
  readonly auditViews: Locator;
  readonly selectedServer: Locator;
  readonly bdsVersion: Locator;

  constructor(page: Page) {
    this.page = page;
    this.applicationIcon = page.locator('.applications-icon');
    this.dataAdmin = page.locator("twc-icon[name='data_admin']");
    this.caseModels = page.locator('div.side-heading', { hasText: 'Case models' });
    this.liveViews = page.getByRole('tab', { name: 'Live view' });
    this.auditViews = page.getByRole('tab', { name: 'Audit view' });
    this.selectedServer = page.frameLocator("iframe").locator(".mat-mdc-select-min-line").getByText("2201");
  }

  async clickOnApplicationIcon() {
    await this.page.waitForTimeout(1000);
    await this.applicationIcon.click();
  }

  async clickOnDataAdmin() {
    await this.page.waitForTimeout(1000);
    await this.dataAdmin.click();
  }

  async clickDataAdminAndGetNewTab(): Promise<Page> {
    const [newTab] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.dataAdmin.click(),
    ]);
    return newTab;
  }

  async ensureServerSelected(tab: Page, serverName: string): Promise<void> {
    const serverDisplay = tab.locator('.mat-mdc-select-min-line');
    await serverDisplay.waitFor({ state: 'visible', timeout: 10000 });
    const currentServer = await serverDisplay.textContent();
    if (!currentServer?.includes(serverName)) {
      await serverDisplay.click();
      await tab.locator('mat-option', { hasText: serverName }).click();
    }
    await expect(serverDisplay).toContainText(serverName, { timeout: 10000 });
  }

  //-------------------------------Live View---------------------------------------
  async verifyDataAdminPage(newTab: Page, url: string): Promise<void> {
    await newTab.waitForURL(url);
    const caseModels = newTab.locator('div.side-heading', { hasText: 'Case models' });
    const liveView = newTab.getByRole('tab', { name: 'Live view' });
    const auditView = newTab.getByRole('tab', { name: 'Audit view' });
    const selectedServer = newTab.locator('.mat-mdc-select-min-line', { hasText: '2201' });
    await expect(caseModels).toBeVisible();
    await expect(liveView).toBeVisible();
    await expect(auditView).toBeVisible();
    await expect(selectedServer).toBeVisible();
  }

  async liveViewCreateScript(newTab: Page, url: string): Promise<void> {
    const projectName = 'com.example.caseactionstudy-2';
    const expectedVersion = '2.0.0.20251209113547743';

    await newTab.waitForURL(url, { timeout: 15000 });

    // Expand the case model panel
    const bdsProject = newTab.locator('mat-expansion-panel-header').getByText(projectName);
    await expect(bdsProject).toBeVisible({ timeout: 10000 });
    const isExpanded = await bdsProject.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await bdsProject.click();
    }

    // Click the target app version
    const panel = newTab.locator(`mat-expansion-panel:has-text("${projectName}")`);
    const appVersion = panel.locator('div.app-version', { hasText: expectedVersion });
    await expect(appVersion).toBeVisible({ timeout: 10000 });
    await appVersion.click();

    // Verify Create, Update and Drop script sections are visible
    await expect(newTab.getByText('Create script')).toBeVisible({ timeout: 10000 });
    await expect(newTab.getByText('Update script')).toBeVisible({ timeout: 10000 });
    await expect(newTab.getByText('Drop script')).toBeVisible({ timeout: 10000 });

    // Click Create script and validate its full content block
    await newTab.getByText('Create script').click();
    const scriptArea = newTab.getByRole('code');
    await expect(scriptArea).toBeVisible({ timeout: 10000 });
    const expectedTexts = [
      'TIBCO HEADER',
      'BOM Name           : Approval.bom',
      'BOM Namespace      : com.example.caseactionstudy',
      'Namespace Tag      : CASEACTIONSTUDY',
      'BOM Major Version  : 2',
      'com.example.caseactionstudy.ApplicationForApproval BDS_2_CASEACTIONSTUDY_PPLCTNFR',
      'create table [BDS_2_CASEACTIONSTUDY_PPLCTNFR]',
      '[BDS_ID] bigint not null',
      '[CASEID] numeric(31,0) not null unique',
      '[FIRSTNAME] varchar(400)',
      '[LASTNAME] varchar(400)',
      'create index BDS_2_CASEACTIONSTUDY_PPLCTNFRDTYPE',
      'create index IDX_2_CASEACTIONSTUDY'
    ];
    for (const text of expectedTexts) {
      await expect(scriptArea).toContainText(text);
    }

    // Verify Notify and Edit buttons are visible
    await expect(newTab.getByRole('button', { name: 'Notify' })).toBeVisible({ timeout: 10000 });
    await expect(newTab.getByRole('button', { name: 'Edit' })).toBeVisible({ timeout: 10000 });
  }

  async liveViewUpdateScript(newTab: Page): Promise<void> {
    // Click Update script section
    await newTab.getByText('Update script').click();

    // Verify Notify and Edit buttons are visible
    await expect(newTab.getByRole('button', { name: 'Notify' })).toBeVisible({ timeout: 10000 });
    await expect(newTab.getByRole('button', { name: 'Edit' })).toBeVisible({ timeout: 10000 });

    // Click Edit button to open the edit screen
    await newTab.getByRole('button', { name: 'Edit' }).click();

    // Add text in the edit screen
    const editArea = newTab.locator('textarea').first();
    await editArea.waitFor({ state: 'visible', timeout: 10000 });
    await editArea.fill('-- Test update script edit');

    // Click Save to trigger the Save script pop-up
    await newTab.getByRole('button', { name: 'Save' }).click();

    // Handle Save script pop-up
    const dialog = newTab.locator('mat-dialog-container');
    await dialog.waitFor({ state: 'visible', timeout: 10000 });

    // Add text in the Save script pop-up (e.g. version comment/description)
    const dialogInput = dialog.locator('input, textarea').first();
    await dialogInput.waitFor({ state: 'visible', timeout: 10000 });
    await dialogInput.fill('Test save comment');

    // Confirm save in the dialog
    await dialog.getByRole('button', { name: 'Save' }).click();
    await dialog.waitFor({ state: 'hidden', timeout: 10000 });
  }

  async liveViewDropScript(newTab: Page): Promise<void> {
    // Click Drop script section
    await newTab.getByText('Drop script').click();

    // Verify Notify and Edit buttons are visible
    await expect(newTab.getByRole('button', { name: 'Notify' })).toBeVisible({ timeout: 10000 });
    await expect(newTab.getByRole('button', { name: 'Edit' })).toBeVisible({ timeout: 10000 });

    // Validate Drop script content
    const scriptArea = newTab.getByRole('code');
    await expect(scriptArea).toBeVisible({ timeout: 10000 });
    const expectedTexts = [
      'TIBCO HEADER',
      'BOM Name           : Approval.bom',
      'BOM Namespace      : com.example.caseactionstudy',
      'Namespace Tag      : CASEACTIONSTUDY',
      'BOM Major Version  : 2',
      'Table Mappings     : (BOM Class -> DB Table)',
      'com.example.caseactionstudy.ApplicationForApproval BDS_2_CASEACTIONSTUDY_PPLCTNFR',
      'drop table if exists [BDS_2_CASEACTIONSTUDY_PPLCTNFR]'
    ];
    for (const text of expectedTexts) {
      await expect(scriptArea).toContainText(text);
    }
  }

  //-------------------------------Audit View---------------------------------------
  async navigateToAuditView(dataAdminPage: Page): Promise<void> {
    const auditViewTab = dataAdminPage.getByRole('tab', { name: 'Audit view' });

    await expect(auditViewTab).toBeVisible({ timeout: 10000 });

    await auditViewTab.click();
  }

  async verifyAuditViewCaseModel(dataAdminPage: Page): Promise<void> {
    const caseModelName = 'com.example.caseactionstudy';
    const expectedVersion = '2.0.0.20251209113547743';

    const caseModelHeader = dataAdminPage
      .locator('mat-expansion-panel-header')
      .getByText(caseModelName);

    await expect(caseModelHeader).toBeVisible({ timeout: 10000 });
    await caseModelHeader.click();

    const caseModelPanel = dataAdminPage
      .locator(`mat-expansion-panel:has-text("${caseModelName}")`
      );

    const appVersion = caseModelPanel.locator
      ('div.app-version',
        { hasText: expectedVersion }
      );

    await expect(appVersion).toBeVisible({ timeout: 10000 });
    await appVersion.click();
  }

  async auditViewCreateScript(page: Page): Promise<void> {
    await this.verifyScriptTabsVisible(page);
    await page.getByText('Create script').click();

    await this.verifyRevisionButton(page);

    const scriptArea = page.getByRole('code');
    await expect(scriptArea).toBeVisible({ timeout: 10000 });

    const expectedTexts = [
      'TIBCO HEADER',
      'BOM Name           : Approval.bom',
      'BOM Namespace      : com.example.caseactionstudy',
      'Namespace Tag      : CASEACTIONSTUDY',
      'BOM Major Version  : 2',
      'Table Mappings     : (BOM Class -> DB Table)',
      'com.example.caseactionstudy.ApplicationForApproval BDS_2_CASEACTIONSTUDY_PPLCTNFR',
      'create table [BDS_2_CASEACTIONSTUDY_PPLCTNFR]',
      '[BDS_ID] bigint not null',
      '[CASEID] numeric(31,0) not null unique',
      '[FIRSTNAME] varchar(400)',
      '[LASTNAME] varchar(400)',
      'create index BDS_2_CASEACTIONSTUDY_PPLCTNFRDTYPE',
      'create index IDX_2_CASEACTIONSTUDY'
    ];

    await this.verifyScriptContent(scriptArea, expectedTexts);
  }

  async auditViewUpdateScript(page: Page): Promise<void> {
    await page.getByText('Update script').click();

    await this.verifyRevisionButton(page);
  }

  async auditViewDropScript(page: Page): Promise<void> {
    await page.getByText('Drop script').click();

    await this.verifyRevisionButton(page);

    const dropScriptArea = page.getByRole('code');
    await expect(dropScriptArea).toBeVisible({ timeout: 10000 });

    const expectedTexts = [
      'TIBCO HEADER',
      'BOM Name           : Approval.bom',
      'BOM Namespace      : com.example.caseactionstudy',
      'Namespace Tag      : CASEACTIONSTUDY',
      'BOM Major Version  : 2',
      'Table Mappings     : (BOM Class -> DB Table)',
      'com.example.caseactionstudy.ApplicationForApproval BDS_2_CASEACTIONSTUDY_PPLCTNFR',
      'drop table if exists [BDS_2_CASEACTIONSTUDY_PPLCTNFR]'
    ];

    await this.verifyScriptContent(dropScriptArea, expectedTexts);
  }

  async verifyScriptTabsVisible(page: Page): Promise<void> {
    const tabs = ['Create script', 'Update script', 'Drop script'];

    for (const tab of tabs) {
      await expect(page.getByText(tab)).toBeVisible({ timeout: 10000 });
    }
  }

  async verifyRevisionButton(page: Page): Promise<void> {
    const revisionBtn = page.getByRole('button', { name: 'Revision' });

    await expect(revisionBtn).toBeVisible({ timeout: 10000 });
  }

  async verifyScriptContent(
    scriptArea: Locator,
    expectedTexts: string[]
  ): Promise<void> {
    for (const text of expectedTexts) {
      await expect(scriptArea).toContainText(text);
    }
  }
}
