# Test info

- Name: Adhoc tasks test for Case Manager >> Start adhocTaskTestingProcess and submit work item
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:201:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByText('adhocTaskTesting', { exact: true })

    at ProcessPage.startProcess (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\ProcessPage.ts:472:61)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:207:5
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - complementary
  - button "2201":
    - text: "2201"
    - img
  - dialog:
    - text: Process Templates
    - button "Start" [disabled]
    - text: Clear filters Process Name = adhocTaskTestingProcess No templates to display.
  - separator "Resize"
  - button "Find Instances"
  - tablist:
    - tab "Current" [selected]
    - tab "Historic"
  - text: No instances to display
- iframe
```

# Test source

```ts
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
  436 |     await this.page.locator(`twc-option[value="${state.toUpperCase()}"]`).click({ force: true });
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
  452 |     const dropValues = await this.page.locator(".menu-value").first().innerText();
  453 |     const arrDropValues = dropValues.split(/[\t\n]/g);
  454 |     return arrDropValues;
  455 |   }
  456 |
  457 |   async coloumnSelectorVerification(colName: string) {
  458 |     await this.page
  459 |       .getByRole("menuitem", { name: colName })
  460 |       .locator("div")
  461 |       .first()
  462 |       .click();
  463 |   }
  464 |
  465 |   async getTableHeader() {
  466 |     return await utility.tableHeader(this.page);
  467 |   }
  468 |
  469 |   async startProcess(packageName: string, processName: string) {
  470 |     await this.clickOnProcess(processName);
  471 |     await this.page.waitForTimeout(1000);
> 472 |     await this.page.getByText(packageName, { exact: true }).click();
      |                                                             ^ Error: locator.click: Target page, context or browser has been closed
  473 |     await this.page.getByText(processName, { exact: true }).click();
  474 |     await this.startButton.click();
  475 |   }
  476 |
  477 |   async OpenProcess(packageName: string, processName: string) {
  478 |     await this.clickOnProcess(processName);
  479 |     await this.page.waitForTimeout(1000);
  480 |     await this.page.getByText(packageName, { exact: true }).click();
  481 |     await this.page.getByText(processName, { exact: true }).click();
  482 |     await expect(this.processHeaderTitle).toContainText(processName);
  483 |   }
  484 |
  485 |   async clickOnPackage(packageName: string) {
  486 |     await this.page.getByText(packageName, { exact: true }).click();
  487 |   }
  488 |
  489 |   getProcessName(name: string) {
  490 |     return this.page.locator('twc-table-row', { has: this.page.locator(`twc-table-cell[tooltipvalue="${name}"]`) }).first();
  491 |   }
  492 |
  493 |   async clickonThreeDotsProcess(name: string) {
  494 |     await (this.getProcessName(name)).locator("twc-icon-button[name='three-dots-vertical']").click({ force: true });
  495 |   }
  496 |
  497 |   processTemplateTreeGroup(packageName: string): Locator {
  498 |     return this.page.locator('twc-tree-items-group').filter({ hasText: packageName });
  499 |   }
  500 |
  501 |   processTemplateTreeItem(processName: string): Locator {
  502 |     return this.page.locator(`twc-tree-item[itemvalue="${processName}"]`);
  503 |   }
  504 |
  505 |   processTemplateTreeItemByVersion(processName: string, version: string): Locator {
  506 |     return this.page.locator(`twc-tree-item[itemvalue="${processName}"]`)
  507 |       .filter({ has: this.page.locator('div[slot="subText"]', { hasText: version }) });
  508 |   }
  509 |
  510 |   async OpenProcessMenuByVersion(packageName: string, processName: string, version: string) {
  511 |     await this.clickOnProcess(processName);
  512 |     await this.page.waitForTimeout(1000);
  513 |     await this.page.getByText(packageName, { exact: true }).click();
  514 |     await this.processTemplateTreeItemByVersion(processName, version).click();
  515 |     await expect(this.processHeaderTitle).toContainText(processName);
  516 |     await this.processTemplateTreeItemByVersion(processName, version).locator('twc-icon-button[name="three-dots-vertical"]').click();
  517 |   }
  518 |
  519 |   async verifyMigrateDialogDefaultVersion(expectedVersion: string) {
  520 |     await expect(this.migrateDialogSourceVersionDropdown).toHaveAttribute('value', expectedVersion);
  521 |   }
  522 |
  523 |   async selectMigrateSourceVersion(version: string) {
  524 |     await this.migrateDialogSourceVersionDropdown.click();
  525 |     await this.migrateDialogSourceVersionDropdown.locator(`twc-option[value="${version}"]`).click({ force: true });
  526 |   }
  527 |
  528 |   async selectMigrateDestinationVersion(version: string) {
  529 |     await this.migrateDialogDestinationVersionDropdown.click();
  530 |     await this.migrateDialogDestinationVersionDropdown.locator(`twc-option[value="${version}"]`).click({ force: true });
  531 |   }
  532 |
  533 |   async verifyMigrateFromCheckboxItems(expectedItems: string[]) {
  534 |     const migrateFromBox = this.page.locator('div.migrate-from');
  535 |     for (const item of expectedItems) {
  536 |       await expect(migrateFromBox.locator('.select-checkbox-item twc-checkbox').filter({ hasText: item })).toBeVisible();
  537 |     }
  538 |   }
  539 |
  540 |   async clickMigrateFromSelectAll() {
  541 |     await this.migrateFromSelectAllCheckbox.click();
  542 |   }
  543 |
  544 |   async verifyMigrateToCheckboxItems(expectedItems: string[]) {
  545 |     const migrateToList = this.page.locator('div.migrate-points-list');
  546 |     for (const item of expectedItems) {
  547 |       await expect(migrateToList.locator('div.select-checkbox-item').filter({ hasText: item })).toBeVisible();
  548 |     }
  549 |   }
  550 |
  551 |   async verifyMigrateToAllItemsSelected(expectedItems: string[]) {
  552 |     const migrateToList = this.page.locator('div.migrate-points-list');
  553 |     for (const item of expectedItems) {
  554 |       await expect(
  555 |         migrateToList.locator('div.select-checkbox-item.select-checkbox-item--selected').filter({ hasText: item })
  556 |       ).toBeVisible();
  557 |     }
  558 |   }
  559 |
  560 |   async verifyMigrateConfirmDialogText(expectedText: string) {
  561 |     await expect(
  562 |       this.page.locator('#bpme-process-template-migration-amx-dialog').getByText(expectedText)
  563 |     ).toBeVisible();
  564 |   }
  565 |
  566 |   async verifyMigrationRules(sourceVersion: string, destinationVersion: string, points: string[]) {
  567 |     const rulesBox = this.page.locator('div.migrate-box.migration-amx-rules-box');
  568 |     for (const point of points) {
  569 |       const expectedText = `Version [${sourceVersion} ] to Version [${destinationVersion} ].  Point:${point}`;
  570 |       await expect(
  571 |         rulesBox.locator('div.migration-amx-rule-item > div').filter({ hasText: expectedText })
  572 |       ).toBeVisible();
```