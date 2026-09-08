# Test info

- Name: Data Admin e2e suite >> Verify Create, Update and Drop Script tab on Live View screen
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:499:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('mat-option').filter({ hasText: '2201' })

    at ApplicationPage.ensureServerSelected (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\ApplicationPage.ts:49:64)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:519:5
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - dialog: Tibco BPM Enterprise BPME applications Work manager Case manager Administrator Organization browser App Development API Explorer Calendar BPME Application Component explorer AMXBPM applications Data admin
  - complementary
  - button "2201":
    - text: "2201"
    - img
  - dialog "Business Services": Business Services BSCat BPMSimpleCaseActionProject BSPF1 BSPF2 BS_AllTypes
  - separator "Resize"
- iframe
```

# Test source

```ts
   1 |
   2 | import { expect, Locator, Page } from "@playwright/test";
   3 | import * as utility from "../fixtures/utility";
   4 |
   5 | export class ApplicationPage {
   6 |   readonly page: Page;
   7 |   readonly applicationIcon: Locator;
   8 |   readonly dataAdmin: Locator;
   9 |   readonly caseModels: Locator;
   10 |   readonly liveViews: Locator;
   11 |   readonly auditViews: Locator;
   12 |   readonly selectedServer: Locator;
   13 |   readonly bdsVersion: Locator;
   14 |
   15 |   constructor(page: Page) {
   16 |     this.page = page;
   17 |     this.applicationIcon = page.locator('.applications-icon');
   18 |     this.dataAdmin = page.locator("twc-icon[name='data_admin']");
   19 |     this.caseModels = page.locator('div.side-heading', { hasText: 'Case models' });
   20 |     this.liveViews = page.getByRole('tab', { name: 'Live view' });
   21 |     this.auditViews = page.getByRole('tab', { name: 'Audit view' });
   22 |     this.selectedServer = page.frameLocator("iframe").locator(".mat-mdc-select-min-line").getByText("qasw2203");
   23 |   }
   24 |
   25 |   async clickOnApplicationIcon() {
   26 |     await this.page.waitForTimeout(1000);
   27 |     await this.applicationIcon.click();
   28 |   }
   29 |
   30 |   async clickOnDataAdmin() {
   31 |     await this.page.waitForTimeout(1000);
   32 |     await this.dataAdmin.click();
   33 |   }
   34 |
   35 |   async clickDataAdminAndGetNewTab(): Promise<Page> {
   36 |     const [newTab] = await Promise.all([
   37 |       this.page.context().waitForEvent("page"),
   38 |       this.dataAdmin.click(),
   39 |     ]);
   40 |     return newTab;
   41 |   }
   42 |
   43 |   async ensureServerSelected(tab: Page, serverName: string): Promise<void> {
   44 |     const serverDisplay = tab.locator('.mat-mdc-select-min-line');
   45 |     await serverDisplay.waitFor({ state: 'visible', timeout: 10000 });
   46 |     const currentServer = await serverDisplay.textContent();
   47 |     if (!currentServer?.includes(serverName)) {
   48 |       await serverDisplay.click();
>  49 |       await tab.locator('mat-option', { hasText: serverName }).click();
      |                                                                ^ Error: locator.click: Target page, context or browser has been closed
   50 |     }
   51 |     await expect(serverDisplay).toContainText(serverName, { timeout: 10000 });
   52 |   }
   53 |
   54 |   //-------------------------------Live View---------------------------------------
   55 |   async verifyDataAdminPage(newTab: Page, url: string): Promise<void> {
   56 |     await newTab.waitForURL(url);
   57 |     const caseModels = newTab.locator('div.side-heading', { hasText: 'Case models' });
   58 |     const liveView = newTab.getByRole('tab', { name: 'Live view' });
   59 |     const auditView = newTab.getByRole('tab', { name: 'Audit view' });
   60 |     const selectedServer = newTab.locator('.mat-mdc-select-min-line', { hasText: 'qasw2203' });
   61 |     await expect(caseModels).toBeVisible();
   62 |     await expect(liveView).toBeVisible();
   63 |     await expect(auditView).toBeVisible();
   64 |     await expect(selectedServer).toBeVisible();
   65 |   }
   66 |
   67 |   async liveViewCreateScript(newTab: Page, url: string): Promise<void> {
   68 |     const projectName = 'com.example.caseactionstudy-2';
   69 |     const expectedVersion = '2.0.0.20251209113547743';
   70 |
   71 |     await newTab.waitForURL(url, { timeout: 15000 });
   72 |
   73 |     // Expand the case model panel
   74 |     const bdsProject = newTab.locator('mat-expansion-panel-header').getByText(projectName);
   75 |     await expect(bdsProject).toBeVisible({ timeout: 10000 });
   76 |     const isExpanded = await bdsProject.getAttribute('aria-expanded');
   77 |     if (isExpanded !== 'true') {
   78 |       await bdsProject.click();
   79 |     }
   80 |
   81 |     // Click the target app version
   82 |     const panel = newTab.locator(`mat-expansion-panel:has-text("${projectName}")`);
   83 |     const appVersion = panel.locator('div.app-version', { hasText: expectedVersion });
   84 |     await expect(appVersion).toBeVisible({ timeout: 10000 });
   85 |     await appVersion.click();
   86 |
   87 |     // Verify Create, Update and Drop script sections are visible
   88 |     await expect(newTab.getByText('Create script')).toBeVisible({ timeout: 10000 });
   89 |     await expect(newTab.getByText('Update script')).toBeVisible({ timeout: 10000 });
   90 |     await expect(newTab.getByText('Drop script')).toBeVisible({ timeout: 10000 });
   91 |
   92 |     // Click Create script and validate its full content block
   93 |     await newTab.getByText('Create script').click();
   94 |     const scriptArea = newTab.getByRole('code');
   95 |     await expect(scriptArea).toBeVisible({ timeout: 10000 });
   96 |     const expectedTexts = [
   97 |       'TIBCO HEADER',
   98 |       'BOM Name           : Approval.bom',
   99 |       'BOM Namespace      : com.example.caseactionstudy',
  100 |       'Namespace Tag      : CASEACTIONSTUDY',
  101 |       'BOM Major Version  : 2',
  102 |       'com.example.caseactionstudy.ApplicationForApproval BDS_2_CASEACTIONSTUDY_PPLCTNFR',
  103 |       'create table [BDS_2_CASEACTIONSTUDY_PPLCTNFR]',
  104 |       '[BDS_ID] bigint not null',
  105 |       '[CASEID] numeric(31,0) not null unique',
  106 |       '[FIRSTNAME] varchar(400)',
  107 |       '[LASTNAME] varchar(400)',
  108 |       'create index BDS_2_CASEACTIONSTUDY_PPLCTNFRDTYPE',
  109 |       'create index IDX_2_CASEACTIONSTUDY'
  110 |     ];
  111 |     for (const text of expectedTexts) {
  112 |       await expect(scriptArea).toContainText(text);
  113 |     }
  114 |
  115 |     // Verify Notify and Edit buttons are visible
  116 |     await expect(newTab.getByRole('button', { name: 'Notify' })).toBeVisible({ timeout: 10000 });
  117 |     await expect(newTab.getByRole('button', { name: 'Edit' })).toBeVisible({ timeout: 10000 });
  118 |   }
  119 |
  120 |   async liveViewUpdateScript(newTab: Page): Promise<void> {
  121 |     // Click Update script section
  122 |     await newTab.getByText('Update script').click();
  123 |
  124 |     // Verify Notify and Edit buttons are visible
  125 |     await expect(newTab.getByRole('button', { name: 'Notify' })).toBeVisible({ timeout: 10000 });
  126 |     await expect(newTab.getByRole('button', { name: 'Edit' })).toBeVisible({ timeout: 10000 });
  127 |
  128 |     // Click Edit button to open the edit screen
  129 |     await newTab.getByRole('button', { name: 'Edit' }).click();
  130 |
  131 |     // Add text in the edit screen
  132 |     const editArea = newTab.locator('textarea').first();
  133 |     await editArea.waitFor({ state: 'visible', timeout: 10000 });
  134 |     await editArea.fill('-- Test update script edit');
  135 |
  136 |     // Click Save to trigger the Save script pop-up
  137 |     await newTab.getByRole('button', { name: 'Save' }).click();
  138 |
  139 |     // Handle Save script pop-up
  140 |     const dialog = newTab.locator('mat-dialog-container');
  141 |     await dialog.waitFor({ state: 'visible', timeout: 10000 });
  142 |
  143 |     // Add text in the Save script pop-up (e.g. version comment/description)
  144 |     const dialogInput = dialog.locator('input, textarea').first();
  145 |     await dialogInput.waitFor({ state: 'visible', timeout: 10000 });
  146 |     await dialogInput.fill('Test save comment');
  147 |
  148 |     // Confirm save in the dialog
  149 |     await dialog.getByRole('button', { name: 'Save' }).click();
```