# Test info

- Name: Data Admin e2e suite >> Verify Create, Update and Drop Scrip tabt on Audit View screen
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:537:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('mat-expansion-panel:has-text("com.example.caseactionstudy")').locator('div.app-version').filter({ hasText: '2.0.0.20251209113547743' })
    - locator resolved to <div fxlayout="row" class="app-version" _ngcontent-ng-c2911882424="">2.0.0.20251209113547743</div>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="mat-mdc-tooltip-surface mdc-tooltip__surface">com.example.caseactionstudy-2</div> from <div class="cdk-overlay-container">…</div> subtree intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="mat-mdc-tooltip-surface mdc-tooltip__surface">com.example.caseactionstudy-2</div> from <div class="cdk-overlay-container">…</div> subtree intercepts pointer events
    - retrying click action
      - waiting 100ms
    95 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="mat-mdc-tooltip-surface mdc-tooltip__surface">com.example.caseactionstudy-2</div> from <div class="cdk-overlay-container">…</div> subtree intercepts pointer events
     - retrying click action
       - waiting 500ms

    at ApplicationPage.verifyAuditViewCaseModel (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\ApplicationPage.ts:209:22)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:563:5
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
  150 |     await dialog.waitFor({ state: 'hidden', timeout: 10000 });
  151 |   }
  152 |
  153 |   async liveViewDropScript(newTab: Page): Promise<void> {
  154 |     // Click Drop script section
  155 |     await newTab.getByText('Drop script').click();
  156 |
  157 |     // Verify Notify and Edit buttons are visible
  158 |     await expect(newTab.getByRole('button', { name: 'Notify' })).toBeVisible({ timeout: 10000 });
  159 |     await expect(newTab.getByRole('button', { name: 'Edit' })).toBeVisible({ timeout: 10000 });
  160 |
  161 |     // Validate Drop script content
  162 |     const scriptArea = newTab.getByRole('code');
  163 |     await expect(scriptArea).toBeVisible({ timeout: 10000 });
  164 |     const expectedTexts = [
  165 |       'TIBCO HEADER',
  166 |       'BOM Name           : Approval.bom',
  167 |       'BOM Namespace      : com.example.caseactionstudy',
  168 |       'Namespace Tag      : CASEACTIONSTUDY',
  169 |       'BOM Major Version  : 2',
  170 |       'Table Mappings     : (BOM Class -> DB Table)',
  171 |       'com.example.caseactionstudy.ApplicationForApproval BDS_2_CASEACTIONSTUDY_PPLCTNFR',
  172 |       'drop table if exists [BDS_2_CASEACTIONSTUDY_PPLCTNFR]'
  173 |     ];
  174 |     for (const text of expectedTexts) {
  175 |       await expect(scriptArea).toContainText(text);
  176 |     }
  177 |   }
  178 |
  179 |   //-------------------------------Audit View---------------------------------------
  180 |   async navigateToAuditView(dataAdminPage: Page): Promise<void> {
  181 |     const auditViewTab = dataAdminPage.getByRole('tab', { name: 'Audit view' });
  182 |
  183 |     await expect(auditViewTab).toBeVisible({ timeout: 10000 });
  184 |
  185 |     await auditViewTab.click();
  186 |   }
  187 |
  188 |   async verifyAuditViewCaseModel(dataAdminPage: Page): Promise<void> {
  189 |     const caseModelName = 'com.example.caseactionstudy';
  190 |     const expectedVersion = '2.0.0.20251209113547743';
  191 |
  192 |     const caseModelHeader = dataAdminPage
  193 |       .locator('mat-expansion-panel-header')
  194 |       .getByText(caseModelName);
  195 |
  196 |     await expect(caseModelHeader).toBeVisible({ timeout: 10000 });
  197 |     await caseModelHeader.click();
  198 |
  199 |     const caseModelPanel = dataAdminPage
  200 |       .locator(`mat-expansion-panel:has-text("${caseModelName}")`
  201 |       );
  202 |
  203 |     const appVersion = caseModelPanel.locator
  204 |       ('div.app-version',
  205 |         { hasText: expectedVersion }
  206 |       );
  207 |
  208 |     await expect(appVersion).toBeVisible({ timeout: 10000 });
> 209 |     await appVersion.click();
      |                      ^ Error: locator.click: Target page, context or browser has been closed
  210 |   }
  211 |
  212 |   async auditViewCreateScript(page: Page): Promise<void> {
  213 |     await this.verifyScriptTabsVisible(page);
  214 |     await page.getByText('Create script').click();
  215 |
  216 |     await this.verifyRevisionButton(page);
  217 |
  218 |     const scriptArea = page.getByRole('code');
  219 |     await expect(scriptArea).toBeVisible({ timeout: 10000 });
  220 |
  221 |     const expectedTexts = [
  222 |       'TIBCO HEADER',
  223 |       'BOM Name           : Approval.bom',
  224 |       'BOM Namespace      : com.example.caseactionstudy',
  225 |       'Namespace Tag      : CASEACTIONSTUDY',
  226 |       'BOM Major Version  : 2',
  227 |       'Table Mappings     : (BOM Class -> DB Table)',
  228 |       'com.example.caseactionstudy.ApplicationForApproval BDS_2_CASEACTIONSTUDY_PPLCTNFR',
  229 |       'create table [BDS_2_CASEACTIONSTUDY_PPLCTNFR]',
  230 |       '[BDS_ID] bigint not null',
  231 |       '[CASEID] numeric(31,0) not null unique',
  232 |       '[FIRSTNAME] varchar(400)',
  233 |       '[LASTNAME] varchar(400)',
  234 |       'create index BDS_2_CASEACTIONSTUDY_PPLCTNFRDTYPE',
  235 |       'create index IDX_2_CASEACTIONSTUDY'
  236 |     ];
  237 |
  238 |     await this.verifyScriptContent(scriptArea, expectedTexts);
  239 |   }
  240 |
  241 |   async auditViewUpdateScript(page: Page): Promise<void> {
  242 |     await page.getByText('Update script').click();
  243 |
  244 |     await this.verifyRevisionButton(page);
  245 |   }
  246 |
  247 |   async auditViewDropScript(page: Page): Promise<void> {
  248 |     await page.getByText('Drop script').click();
  249 |
  250 |     await this.verifyRevisionButton(page);
  251 |
  252 |     const dropScriptArea = page.getByRole('code');
  253 |     await expect(dropScriptArea).toBeVisible({ timeout: 10000 });
  254 |
  255 |     const expectedTexts = [
  256 |       'TIBCO HEADER',
  257 |       'BOM Name           : Approval.bom',
  258 |       'BOM Namespace      : com.example.caseactionstudy',
  259 |       'Namespace Tag      : CASEACTIONSTUDY',
  260 |       'BOM Major Version  : 2',
  261 |       'Table Mappings     : (BOM Class -> DB Table)',
  262 |       'com.example.caseactionstudy.ApplicationForApproval BDS_2_CASEACTIONSTUDY_PPLCTNFR',
  263 |       'drop table if exists [BDS_2_CASEACTIONSTUDY_PPLCTNFR]'
  264 |     ];
  265 |
  266 |     await this.verifyScriptContent(dropScriptArea, expectedTexts);
  267 |   }
  268 |
  269 |   async verifyScriptTabsVisible(page: Page): Promise<void> {
  270 |     const tabs = ['Create script', 'Update script', 'Drop script'];
  271 |
  272 |     for (const tab of tabs) {
  273 |       await expect(page.getByText(tab)).toBeVisible({ timeout: 10000 });
  274 |     }
  275 |   }
  276 |
  277 |   async verifyRevisionButton(page: Page): Promise<void> {
  278 |     const revisionBtn = page.getByRole('button', { name: 'Revision' });
  279 |
  280 |     await expect(revisionBtn).toBeVisible({ timeout: 10000 });
  281 |   }
  282 |
  283 |   async verifyScriptContent(
  284 |     scriptArea: Locator,
  285 |     expectedTexts: string[]
  286 |   ): Promise<void> {
  287 |     for (const text of expectedTexts) {
  288 |       await expect(scriptArea).toContainText(text);
  289 |     }
  290 |   }
  291 | }
  292 |
```