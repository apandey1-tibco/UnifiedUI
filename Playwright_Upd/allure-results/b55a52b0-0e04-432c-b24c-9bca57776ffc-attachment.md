# Test info

- Name: Cases e2e suite >> 2nd Update Case Action and Verify Updated Values
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:293:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('twc-button.twc-button-group__button--inner[title="Update Case ActionProject-NotAvailableForOther State"]')

    at CaseManagerPage.clickOnUpdateCaseActionBtn2nd (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\CaseManagerPage.ts:344:39)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:295:18
```

# Test source

```ts
  244 |
  245 |     //Unified UI
  246 |     this.filterCaseHeader = page.locator(".card-filter").getByText("Filter Cases");
  247 |     this.saveSearch = page.locator('twc-toolbar-item[label="Save search"]');
  248 |     this.saveSearchLabel = page.getByRole("heading", { name: "Save search" });
  249 |     this.saveSearchNameInput = page.locator('twc-input[name="name"]:visible').locator('input');
  250 |     this.saveSearchDescriptionInput = page.locator('twc-input[name="description"]:visible').locator('input');
  251 |     this.saveSearchCategoryInput = page.locator('twc-input[name="category"]:visible').locator('input');
  252 |     this.selectedSortDataCaseID = page.locator(".selectedData").locator("twc-list-item").filter({ hasText: "caseID" });
  253 |     this.saveBtn = page.getByRole('button', { name: 'Save', exact: true });
  254 |     this.addRuleButton = page.getByRole("button", { name: "Rule Add rule" });
  255 |     this.saveSearches = page.locator('twc-categoriser[label ="Saved Searches"]').first();
  256 |     this.testCategory = page.locator("div.trigger-item[title='Test Category']");
  257 |     this.testSavedSearch = page.locator("twc-tree-item[title='Test Saved Search']");
  258 |     this.savedSearchThreeDots = page.locator("twc-tree-item[title='Test Saved Search']")
  259 |       .locator("[name='three-dots-vertical']");
  260 |     this.editMenuItem = page.getByRole("menuitem", { name: "Edit" });
  261 |     this.deleteMenuItem = page.getByRole("menuitem", { name: "Delete" });
  262 |     this.saveChangesBtn = page.getByRole("button", { name: "Save Changes" });
  263 |
  264 |     // Create Advanced Case Search
  265 |     this.createAdvancedCaseSearch = page.locator('twc-toolbar-item').filter({ hasText: 'Advanced Create Advanced Case' }).locator('svg');
  266 |     this.caseViewsWizard = page.getByLabel("Case Views Wizard");
  267 |     this.details = page.locator('twc-wizard-header').locator('twc-tooltip[content="Details"]');
  268 |     this.classInformation = page.locator('twc-wizard-header').locator('twc-tooltip[content="Class Information"]');
  269 |     this.searchCondition = page.locator('twc-wizard-header').locator('twc-tooltip[content="Search Condition"]');
  270 |     this.sort = page.locator('twc-wizard-header').locator('twc-tooltip[content="Sort"]');
  271 |     this.summary = page.locator('twc-wizard-header').locator('twc-tooltip[content="Summary"]');
  272 |     this.caseactionstudy2 = page.getByRole('menuitem', { name: 'com.example.caseactionstudy-2', exact: true });
  273 |     this.caseTypeInfoApplicationForApproval = page.getByRole('menuitem', { name: 'ApplicationForApproval', exact: true });
  274 |     this.columnSelectorCaseID = page.locator('twc-list-view').locator('twc-list-item').getByText("CaseID");
  275 |     this.summaryName = page.locator('twc-input[label="Name"][disabled]');
  276 |     this.summaryDescription = page.locator('twc-input[label="Description"][disabled]');
  277 |     this.summaryCategory = page.locator('twc-input[label="Category"][disabled]');
  278 |     this.summarySearchCondition = page.locator('twc-input[label="Search Condition"][disabled]');
  279 |     this.summaryCaseClassDetails = page.locator('twc-input[label="Case Class Details(Major Version)"][disabled]');
  280 |     this.summarySort = page.locator('twc-input[label="Sort"][disabled]');
  281 |     this.next = page.locator('twc-wizard-button[actiontype="next"]');
  282 |     this.previous = page.locator('twc-wizard-button[actiontype="previous"]');
  283 |     this.finish = page.locator('twc-wizard-button[actiontype="finish"]');
  284 |
  285 |     this.updateCaseActionButton = page.locator('twc-button[title="Update Case ActionProject-NotAvailableForOther State"]');
  286 |     this.leftArrow = page.locator('twc-icon[name="left-arrow"]');
  287 |     this.showAdhocTask = page.getByRole("button", { name: "Show Ad-hoc tasks" });
  288 |   }
  289 |
  290 |   async clickOnSearchCases() {
  291 |     await this.searchIcon.click();
  292 |   }
  293 |   async getTableHeader() {
  294 |     const txt = await this.tableHeader.innerText();
  295 |     return utility.convertStringToArray(txt);
  296 |   }
  297 |   async caseHeader() {
  298 |     return await this.cmHeader.innerText();
  299 |   }
  300 |   async activeCasestxt(): Promise<Locator> {
  301 |     return this.activeCases;
  302 |   }
  303 |   async caseName(caseName: string): Promise<Locator> {
  304 |     return this.page.getByRole("cell", { name: caseName });
  305 |   }
  306 |   async getcaseFilterheading() {
  307 |     return await this.caseFilterHeading.innerText();
  308 |   }
  309 |   async clickOnCaseOrder() {
  310 |     await this.caseOrder.click();
  311 |     await this.page.waitForTimeout(1500);
  312 |   }
  313 |   async clickOnCaseOrderCase1() {
  314 |     await this.caseOrder_case1.click();
  315 |     await this.page.waitForTimeout(1500);
  316 |   }
  317 |   async clickOnAdditionalOrder() {
  318 |     await this.additionalOrder.click();
  319 |   }
  320 |   async clickOnApplicationForApproval() {
  321 |     await this.page.waitForTimeout(1000);
  322 |     await this.applicationForApproval.click();
  323 |     await this.page.waitForTimeout(2000);
  324 |   }
  325 |   async clickOnAdhocCase() {
  326 |     await this.adhocCase.click();
  327 |     await this.page.waitForTimeout(2000);
  328 |   }
  329 |   async clickOnUpdateCaseActionBtn() {
  330 |     await this.updateCaseActionBtn.click();
  331 |     await this.page.locator('tibco-form').waitFor({ state: 'visible' });
  332 |   }
  333 |   async fillUpdateCaseActionForm(caseState1: string, firstName: string) {
  334 |     await this.updateFormCaseState1.waitFor({ state: "visible", timeout: 10000 });
  335 |     await this.updateFormCaseState1.selectOption(caseState1);
  336 |     await this.updateFormFirstName.waitFor({ state: "visible", timeout: 5000 });
  337 |     await this.updateFormFirstName.clear();
  338 |     await this.updateFormFirstName.fill(firstName);
  339 |   }
  340 |   async submitUpdateCaseActionForm() {
  341 |     await this.updateFormSubmitBtn.click();
  342 |   }
  343 |   async clickOnUpdateCaseActionBtn2nd() {
> 344 |     await this.updateCaseActionBtn2nd.click();
      |                                       ^ Error: locator.click: Target page, context or browser has been closed
  345 |     await this.page.locator('tibco-form').waitFor({ state: 'visible' });
  346 |   }
  347 |   async fillUpdateCaseActionForm2nd(caseState1: string, lastName: string) {
  348 |     await this.updateFormCaseState1.selectOption(caseState1);
  349 |     await this.updateFormLastName.clear();
  350 |     await this.updateFormLastName.fill(lastName);
  351 |   }
  352 |   async verifyViewCaseActionForm2nd(caseState1: string, lastName: string) {
  353 |     await expect(this.viewFormCaseState1).toHaveValue(caseState1);
  354 |     await expect(this.viewFormLastName).toHaveValue(lastName);
  355 |   }
  356 |   async verifyLocalDataSection(caseState1: string, firstName: string, lastName: string) {
  357 |     await expect(this.localDataVerifyCaseState1).toHaveValue(caseState1);
  358 |     await expect(this.localDataVerifyFirstName).toHaveValue(firstName);
  359 |     await expect(this.localDataVerifyLastName).toHaveValue(lastName);
  360 |   }
  361 |   async verifyCaseRefSection(caseState1: string, firstName: string, lastName: string) {
  362 |     await expect(this.caseRefVerifyCaseState1).toHaveValue(caseState1);
  363 |     await expect(this.caseRefVerifyFirstName).toHaveValue(firstName);
  364 |     await expect(this.caseRefVerifyLastName).toHaveValue(lastName);
  365 |   }
  366 |   async clickOnViewCaseActionBtn() {
  367 |     await this.viewCaseActionBtn.click();
  368 |     await this.page.locator('tibco-form').waitFor({ state: 'visible' });
  369 |   }
  370 |   async verifyViewCaseActionForm(caseState1: string, firstName: string) {
  371 |     await expect(this.viewFormCaseState1).toHaveValue(caseState1);
  372 |     await expect(this.viewFormFirstName).toHaveValue(firstName);
  373 |   }
  374 |   async navigateToCaseManager() {
  375 |     await this.caseManager.click();
  376 |     await this.page.waitForLoadState("domcontentloaded");
  377 |     await this.page.waitForTimeout(2000);
  378 |   }
  379 |   async clickOnSubmitBtn() {
  380 |     await this.submitBtn.click();
  381 |   }
  382 |
  383 |   async casesRefreshIcon(): Promise<Locator> {
  384 |     return this.refreshIcon;
  385 |   }
  386 |   async getCaseTypeHeaderName(caseName: string) {
  387 |     return await this.page
  388 |       .locator(`twc-header[label='${caseName}']`)
  389 |       .locator(".header__title")
  390 |       .innerText();
  391 |   }
  392 |   async firstRow(): Promise<Locator> {
  393 |     return this.page.locator("twc-table-row").first();
  394 |   }
  395 |   async clickOnCaseByCaseId(caseId: string) {
  396 |     await this.page
  397 |       .locator(`twc-table-row[details*='"caseID":${caseId}']`)
  398 |       .click();
  399 |   }
  400 |   async filterChip(): Promise<Locator> {
  401 |     return this.page.locator("twc-tag");
  402 |   }
  403 |   async caseSearchIcon(): Promise<Locator> {
  404 |     return this.searchIcon;
  405 |   }
  406 |   async caseColoumnIcon(): Promise<Locator> {
  407 |     return this.page.locator("[name='view_column']");
  408 |   }
  409 |   async caseFilterIcon(): Promise<Locator> {
  410 |     return this.filterIcon;
  411 |   }
  412 |
  413 |   async clickUpArrow() {
  414 |     await this.upArrow.click();
  415 |   }
  416 |   async caseTypesRefreshIcon(): Promise<Locator> {
  417 |     return this.refreshCaseTypesIcon;
  418 |   }
  419 |
  420 |   async getActiveCaseDetails(name: string) {
  421 |     const details = await this.page
  422 |       .locator(`twc-table-row[details*='"name":"${name}"']`)
  423 |       .getAttribute("details");
  424 |
  425 |     // return details;
  426 |     if (details) {
  427 |       const data: {
  428 |         casedata: {
  429 |           orderID: string;
  430 |           orderState: string;
  431 |           name: string;
  432 |           product: string;
  433 |           quantity: number;
  434 |           time: string;
  435 |         };
  436 |         metadata: {
  437 |           creationTimestamp: string;
  438 |         };
  439 |       } = JSON.parse(details);
  440 |       return data;
  441 |     }
  442 |   }
  443 |   async verifyFilledLocalDataForm(caseState1: string, caseId: string, firstName: string, lastName: string) {
  444 |     await expect(this.localDataCaseState1).toHaveText(caseState1);
```