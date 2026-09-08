# Test info

- Name: Case Manager Regression suite >> Verify Case search functionality for different data types
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\02_CaseManager.spec.ts:126:7

# Error details

```
Error: locator.fill: Error: strict mode violation: getByRole('textbox') resolved to 2 elements:
    1) <input id="input" type="text" part="input" aria-invalid="false" class="input__control" aria-describedby="help-text" placeholder="Search for case types"/> aka locator('bpme-case-types').getByLabel('')
    2) <input id="input" type="text" part="input" aria-invalid="false" class="input__control" aria-describedby="help-text" placeholder="Search for cases"/> aka locator('bpme-cases').getByRole('textbox')

Call log:
  - waiting for getByRole('textbox')

    at CaseManagerPage.verifySearch (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\CaseManagerPage.ts:450:42)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\02_CaseManager.spec.ts:129:18
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME Applications
  - complementary
  - button "Local server":
    - text: Local server
    - img
  - dialog:
    - text: Case types
    - separator
    - textbox
    - menu:
      - menuitem "AdditionalOrder com.example.samplebdsproject1 1"
      - menuitem "Order com.example.samplebdsproject1 1"
  - separator "Resize"
  - text: Order Active Cases
  - textbox
  - separator
  - separator
  - table:
    - row "OrderID Name Quantity Product Text Date OrderState":
      - columnheader "OrderID"
      - columnheader "Name"
      - columnheader "Quantity"
      - columnheader "Product"
      - columnheader "Text"
      - columnheader "Date"
      - columnheader "OrderState"
    - row "1 Auto created order 2 Apple ear pods 22 Aug 2024 05:30 AM Packed":
      - cell "1"
      - cell "Auto created order"
      - cell "2"
      - cell "Apple ear pods"
      - cell
      - cell "22 Aug 2024 05:30 AM"
      - cell "Packed"
- iframe
```

# Test source

```ts
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
  445 |     await expect(this.localDataCaseID).toHaveText(caseId);
  446 |     await expect(this.localDataFirstName).toHaveText(firstName);
  447 |     await expect(this.localDataLastName).toHaveText(lastName);
  448 |   }
  449 |   async verifySearch(value: string) {
> 450 |     await this.page.getByRole("textbox").fill(value);
      |                                          ^ Error: locator.fill: Error: strict mode violation: getByRole('textbox') resolved to 2 elements:
  451 |     await this.page.keyboard.press("Enter");
  452 |     await this.page.waitForTimeout(2000);
  453 |
  454 |     // expect(recievedVal).toContain(value);
  455 |     // expect(this.page.locator("twc-table-row")).toHaveCount(1);
  456 |   }
  457 |   async tableRow(): Promise<Locator> {
  458 |     return this.page.locator("twc-table-row");
  459 |   }
  460 |   async getAvailableColoumnTextContents() {
  461 |     return await this.availableColoumnTextContents.innerText();
  462 |   }
  463 |   async getSelectedColoumnTextContent() {
  464 |     return await this.selectedColumnsTextContents.innerText();
  465 |   }
  466 |   async searchColoumn(): Promise<Locator> {
  467 |     return this.page.getByRole("textbox");
  468 |   }
  469 |   async verifySelectColoumnFromSearch(coloumnName: string) {
  470 |     (await this.searchColoumn()).click();
  471 |     (await this.searchColoumn()).fill(coloumnName);
  472 |     await this.page.waitForTimeout(1000);
  473 |     //await this.page.getByRole("menuitem").nth(1).click();
  474 |     //to check
  475 |     await this.page
  476 |       .locator(".availableData")
  477 |       .locator("twc-list-item")
  478 |       .first()
  479 |       .click();
  480 |   }
  481 |   async selectNameColoumn() {
  482 |     await this.page
  483 |       .locator(".selectedData")
  484 |       .getByText("Name", { exact: true })
  485 |       .click();
  486 |   }
  487 |   async selectActivityNameColoumn() {
  488 |     await this.page
  489 |       .locator(".selectedData")
  490 |       .getByText("Activity Name", { exact: true })
  491 |       .click();
  492 |   }
  493 |   async selectTypeColoumn() {
  494 |     await this.page
  495 |       .locator(".selectedData")
  496 |       .getByText("Type", { exact: true })
  497 |       .click();
  498 |   }
  499 |   async selectPriorityColoumn() {
  500 |     await this.page
  501 |       .locator(".selectedData")
  502 |       .getByText("Priority", { exact: true })
  503 |       .click();
  504 |   }
  505 |   async clickkOnclocseIcon() {
  506 |     await this.page.locator(".bi.bi-x-circle").first().click();
  507 |   }
  508 |   async nameCheckBox(): Promise<Locator> {
  509 |     return this.page
  510 |       .getByRole("menuitem", { name: "Name", exact: true })
  511 |       .locator("twc-checkbox label input");
  512 |   }
  513 |   async activityNameCheckBox(): Promise<Locator> {
  514 |     return this.page
  515 |       .getByRole("menuitem", { name: "Activity Name", exact: true })
  516 |       .locator("twc-checkbox label input");
  517 |   }
  518 |   async typeCheckBox(): Promise<Locator> {
  519 |     return this.page
  520 |       .getByRole("menuitem", { name: "Type", exact: true })
  521 |       .locator("twc-checkbox label input");
  522 |   }
  523 |   async clickkOnCloseIcon() {
  524 |     await this.page.locator(".bi.bi-x-circle").first().click();
  525 |   }
  526 |   async getBackToCases(): Promise<Locator> {
  527 |     return this.backToCases;
  528 |   }
  529 |   async getApplyBtn(): Promise<Locator> {
  530 |     return this.appplyBtn;
  531 |   }
  532 |   async getCancelBtn(): Promise<Locator> {
  533 |     return this.cancelBtn;
  534 |   }
  535 |
  536 |   async caseColoumHeader(): Promise<Locator> {
  537 |     return this.caseColoumnHeader;
  538 |   }
  539 |   async availableColoumnHeader(): Promise<Locator> {
  540 |     return this.caseAvailableColoumnHeader;
  541 |   }
  542 |   async selectedColoumnHeader(): Promise<Locator> {
  543 |     return this.caseSelectedColoumnHeader;
  544 |   }
  545 |
  546 |   async deleteCase(value: string) {
  547 |     // await this.page.getByLabel("More").getByRole("img").click();
  548 |     // await this.page
  549 |     //   .getByRole("menuitem", { name: "DeleteCase" })
  550 |     //   .locator("div")
```