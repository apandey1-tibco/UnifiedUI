# Test info

- Name: Process Manager Test
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\01_ProcessManager.spec.ts:43:5

# Error details

```
Error: locator.click: Element is not visible
Call log:
  - waiting for locator('twc-option[value="ACTIVE"]')
    - locator resolved to <twc-option role="option" value="ACTIVE" aria-selected="false" aria-disabled="false">…</twc-option>
  - attempting click action
    - scrolling into view if needed

    at ProcessPage.filterByState (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\ProcessPage.ts:436:75)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\01_ProcessManager.spec.ts:59:3
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - complementary
  - button "Local server":
    - text: Local server
    - img
  - dialog:
    - text: Process Templates
    - button "Start"
    - text: Clear filters Process Name = Array002 ProcessPackage
  - separator "Resize"
  - text: Array002
  - button "Find Instances"
  - img "Columns":
    - img
  - combobox
  - table:
    - row "Process Instance ID Process Name State Start Date Created Date Actions":
      - columnheader:
        - checkbox
      - columnheader "Process Instance ID"
      - columnheader "Process Name"
      - columnheader "State"
      - columnheader "Start Date"
      - columnheader "Created Date"
      - columnheader "Actions"
    - row "p:0a201 Array002 ACTIVE NA 31 Aug 2026 12:06 PM":
      - cell:
        - checkbox
      - cell "p:0a201"
      - cell "Array002"
      - cell "ACTIVE"
      - cell "NA"
      - cell "31 Aug 2026 12:06 PM"
      - cell:
        - button
- iframe
- alert: Started new instance of Array002
```

# Test source

```ts
  336 |     await this.page.waitForTimeout(1000);
  337 |     await this.page.waitForLoadState("domcontentloaded");
  338 |     await this.page.waitForTimeout(3000);
  339 |     await this.page.locator("#bpmProcess svg").waitFor();
  340 |     await this.page.locator("#bpmProcess svg").click({ force: true });
  341 |   }
  342 |
  343 |   async getFirstRowProcessInstanceId(): Promise<string> {
  344 |     const id = await this.page.locator('twc-table-row').first()
  345 |       .locator('twc-table-cell[tooltipvalue]').first()
  346 |       .getAttribute('tooltipvalue');
  347 |     return id ?? '';
  348 |   }
  349 |
  350 |   async verifyProcessInfo(moduleName: string, processName: string) {
  351 |     await expect(
  352 |       this.processInfoPopup.locator('div').filter({ hasText: /^Module Name/ })
  353 |     ).toContainText(moduleName);
  354 |     await expect(
  355 |       this.processInfoPopup.locator('div').filter({ hasText: /^Process Name/ })
  356 |     ).toContainText(processName);
  357 |   }
  358 |
  359 |   async clickOnProcess(processName: string) {
  360 |     await this.processTemplatesFilter.click();
  361 |     await this.processName.fill(processName);
  362 |     await this.saveBtn.click();
  363 |   }
  364 |
  365 |   async selectACETestFacadeAttributesProcess(processName: string) {
  366 |     await this.processTemplatesFilter.click();
  367 |     await this.processName.fill(processName);
  368 |     await this.saveBtn.click();
  369 |     await this.page.waitForTimeout(1500);
  370 |     await this.ACE_TestFacadeAttributes.click();
  371 |     await this.ACE_TestFacadeAttributesProcess.click();
  372 |     await this.checkbox.click();
  373 |     await this.actionThreeDotsVertical.click();
  374 |   }
  375 |
  376 |   async waitForToastMessage(message: string, timeout = 15000) {
  377 |     await this.page.waitForFunction(
  378 |       (msg) => {
  379 |         function hasText(root: Document | ShadowRoot): boolean {
  380 |           if (!root) return false;
  381 |           if (root.textContent && root.textContent.includes(msg)) return true;
  382 |           const elements = Array.from(root.querySelectorAll('*'));
  383 |           for (const el of elements) {
  384 |             const sr = (el as Element).shadowRoot;
  385 |             if (sr && hasText(sr)) return true;
  386 |           }
  387 |           return false;
  388 |         }
  389 |         return hasText(document);
  390 |       },
  391 |       message,
  392 |       { timeout }
  393 |     );
  394 |   }
  395 |
  396 |   async clickOnProcesses(groupValue: string, processItemValue: string) {
  397 |     await this.page.locator(`twc-tree-items-group[groupvalue="${groupValue}"] div[slot="trigger"]`).click();
  398 |     await this.page.locator(`twc-tree-item[itemvalue="${processItemValue}"]`).click();
  399 |   }
  400 |
  401 |   async verifyFirstRowState(expectedState: string) {
  402 |     const firstRowStateCell = this.page.locator('twc-table-row').first()
  403 |       .locator(`twc-table-cell[tooltipvalue="${expectedState}"]`);
  404 |     await expect(firstRowStateCell).toBeVisible();
  405 |   }
  406 |
  407 |   async getEmptyMsg() {
  408 |     return await this.page.locator(".empty-message").last().innerText();
  409 |   }
  410 |
  411 |   procesInstanceId(): Locator {
  412 |     return this.page.locator('twc-list-item', { hasText: 'Process Instance ID' })
  413 |       .filter({ has: this.page.locator('twc-checkbox') })
  414 |       .last();
  415 |   }
  416 |
  417 |   actionMenuForFirstRowByState(state: string): Locator {
  418 |     return this.page.locator('twc-table-row')
  419 |       .filter({ has: this.page.locator(`twc-table-cell[tooltipvalue="${state.toUpperCase()}"]`) })
  420 |       .first()
  421 |       .locator('twc-icon-button[name="three-dots-vertical"]');
  422 |   }
  423 |
  424 |   async sortByStartDateDescending() {
  425 |     await this.page.locator('twc-toolbar-item[label="Sort"]').click();
  426 |     await this.page.locator('twc-list-item', { hasText: 'Start Time' })
  427 |       .filter({ has: this.page.locator('twc-checkbox') })
  428 |       .click();
  429 |     await this.page.locator('twc-list-item', { hasText: 'Start Time ( Ascending )' }).click();
  430 |     await this.page.getByRole('button', { name: 'Save' }).click();
  431 |   }
  432 |
  433 |   async filterByState(state: string) {
  434 |     await this.page.getByRole("combobox").first().click();
  435 |     await this.page.waitForTimeout(500);
> 436 |     await this.page.locator(`twc-option[value="${state.toUpperCase()}"]`).click({ force: true });
      |                                                                           ^ Error: locator.click: Element is not visible
  437 |   }
  438 |
  439 |   async templateFilter(packageName: string) {
  440 |     await this.processTemplatesFilter.click();
  441 |     await expect(this.page.getByLabel("Filter templates by:")).toBeVisible();
  442 |     await this.page
  443 |       .locator(".package-name-filter-container")
  444 |       .locator("twc-select")
  445 |       .selectOption({ value: "lt" });
  446 |     await this.page
  447 |       .locator(".package-name-filter-container twc-input")
  448 |       .fill(packageName);
  449 |   }
  450 |
  451 |   async getColoumnValues() {
  452 |     const items = this.page.locator('twc-list-item').filter({ has: this.page.locator('twc-checkbox') });
  453 |     const count = await items.count();
  454 |     const values: string[] = [''];
  455 |     for (let i = 0; i < count; i++) {
  456 |       const text = (await items.nth(i).innerText()).trim();
  457 |       values.push(text);
  458 |     }
  459 |     return values;
  460 |   }
  461 |
  462 |   async coloumnSelectorVerification(colName: string) {
  463 |     await this.page
  464 |       .getByRole("menuitem", { name: colName })
  465 |       .locator("div")
  466 |       .first()
  467 |       .click();
  468 |   }
  469 |
  470 |   async getTableHeader() {
  471 |     return await utility.tableHeader(this.page);
  472 |   }
  473 |
  474 |   async startProcess(packageName: string, processName: string) {
  475 |     await this.clickOnProcess(processName);
  476 |     await this.page.waitForTimeout(1000);
  477 |     await this.page.getByText(packageName, { exact: true }).click();
  478 |     await this.page.getByText(processName, { exact: true }).click();
  479 |     await this.startButton.click();
  480 |   }
  481 |
  482 |   async OpenProcess(packageName: string, processName: string) {
  483 |     await this.clickOnProcess(processName);
  484 |     await this.page.waitForTimeout(1000);
  485 |     await this.page.getByText(packageName, { exact: true }).click();
  486 |     await this.page.getByText(processName, { exact: true }).click();
  487 |     await expect(this.processHeaderTitle).toContainText(processName);
  488 |   }
  489 |
  490 |   async clickOnPackage(packageName: string) {
  491 |     await this.page.getByText(packageName, { exact: true }).click();
  492 |   }
  493 |
  494 |   getProcessName(name: string) {
  495 |     return this.page.locator('twc-table-row', { has: this.page.locator(`twc-table-cell[tooltipvalue="${name}"]`) }).first();
  496 |   }
  497 |
  498 |   async clickonThreeDotsProcess(name: string) {
  499 |     await (this.getProcessName(name)).locator("twc-icon-button[name='three-dots-vertical']").click({ force: true });
  500 |   }
  501 |
  502 |   processTemplateTreeGroup(packageName: string): Locator {
  503 |     return this.page.locator('twc-tree-items-group').filter({ hasText: packageName });
  504 |   }
  505 |
  506 |   processTemplateTreeItem(processName: string): Locator {
  507 |     return this.page.locator(`twc-tree-item[itemvalue="${processName}"]`);
  508 |   }
  509 |
  510 |   processTemplateTreeItemByVersion(processName: string, version: string): Locator {
  511 |     return this.page.locator(`twc-tree-item[itemvalue="${processName}"]`)
  512 |       .filter({ has: this.page.locator('div[slot="subText"]', { hasText: version }) });
  513 |   }
  514 |
  515 |   async OpenProcessMenuByVersion(packageName: string, processName: string, version: string) {
  516 |     await this.clickOnProcess(processName);
  517 |     await this.page.waitForTimeout(1000);
  518 |     await this.page.getByText(packageName, { exact: true }).click();
  519 |     await this.processTemplateTreeItemByVersion(processName, version).click();
  520 |     await expect(this.processHeaderTitle).toContainText(processName);
  521 |     await this.processTemplateTreeItemByVersion(processName, version).locator('twc-icon-button[name="three-dots-vertical"]').click();
  522 |   }
  523 |
  524 |   async verifyMigrateDialogDefaultVersion(expectedVersion: string) {
  525 |     await expect(this.migrateDialogSourceVersionDropdown).toHaveAttribute('value', expectedVersion);
  526 |   }
  527 |
  528 |   async selectMigrateSourceVersion(version: string) {
  529 |     await this.migrateDialogSourceVersionDropdown.click();
  530 |     await this.migrateDialogSourceVersionDropdown.locator(`twc-option[value="${version}"]`).click({ force: true });
  531 |   }
  532 |
  533 |   async selectMigrateDestinationVersion(version: string) {
  534 |     await this.migrateDialogDestinationVersionDropdown.click();
  535 |     await this.migrateDialogDestinationVersionDropdown.locator(`twc-option[value="${version}"]`).click({ force: true });
  536 |   }
```