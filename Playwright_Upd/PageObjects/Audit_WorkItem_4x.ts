import { expect, Locator, Page } from '@playwright/test';

export class AuditWorkItem4xPage {
  readonly page: Page;
  readonly auditMenu: Locator;
  readonly workItemMenu: Locator;
  readonly workItemTableHeader: Locator;
  readonly workItemRows: Locator;
  readonly workItemPageTitle: Locator;
  readonly refreshIcon: Locator;
  readonly columnSelectorIcon: Locator;
  readonly filterIcon: Locator;
  readonly backToWorkItemLink: Locator;
  readonly relatedWorkItemsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.auditMenu = page.locator('twc-navmenu-item#bpmAudit');
    this.workItemMenu = page.locator('twc-list-view').getByTitle('Work Items', { exact: true });
    this.workItemTableHeader = page.locator('twc-table-head-cell[role="columnheader"]');
    this.workItemRows = page.locator('twc-table-row');
    this.workItemPageTitle = page.getByText('Work Items', { exact: true }).first();
    this.refreshIcon = page.locator("twc-toolbar-item[tooltipcontent='Refresh']");
    this.columnSelectorIcon = page.locator("twc-toolbar-item[tooltipcontent='Column Selector']");
    this.filterIcon = page.locator("twc-toolbar-item[tooltipcontent='Filter']");
    this.backToWorkItemLink = page.getByRole('link', { name: /back to work item/i }).or(
      page.locator('a, twc-button, button').filter({ hasText: /back to work item/i })
    ).first();
    this.relatedWorkItemsLink = page.locator('text=Related work items').first();
  }

  async navigateToWorkItemPage(workManagerUrl: string) {
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.goto(workManagerUrl);
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
    await this.page.waitForTimeout(500);
    await this.auditMenu.waitFor({ state: 'visible', timeout: 15000 });
    await this.auditMenu.click({ force: true });
    await this.page.waitForLoadState('domcontentloaded');
    await this.workItemMenu.waitFor({ state: 'visible', timeout: 15000 });
    await this.workItemMenu.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async getTableHeaderValues(): Promise<string[]> {
    return this.workItemTableHeader.evaluateAll(
      (headers) => headers.map((h) => h.textContent?.trim() || '')
    );
  }

  async getFirstRowContents(): Promise<string[]> {
    const cells = this.workItemRows.first().locator('twc-table-cell');
    return cells.evaluateAll(
      (cellNodes) => cellNodes.map((c) => c.textContent?.trim() || '')
    );
  }

  async isWorkItemPageVisible(): Promise<boolean> {
    return this.workItemMenu.isVisible();
  }

  async isTableVisible(): Promise<boolean> {
    return this.workItemTableHeader.first().isVisible();
  }

  async clickRelatedWorkItemsLink(): Promise<void> {
    await this.relatedWorkItemsLink.waitFor({ state: 'visible', timeout: 10000 });
    await this.relatedWorkItemsLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async clickRefreshButton(): Promise<void> {
    await this.refreshIcon.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async clickSavedFilter(filterName: string) {
    await this.page.locator(`[title="${filterName}"]`).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async clickFirstTableRow() {
    await this.workItemRows.first().click();
    await this.page.waitForTimeout(500);
  }

  async clickLastTableRow() {
    const lastRow = this.workItemRows.last();
    await lastRow.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    await lastRow.click();
    await this.page.waitForTimeout(500);
  }

  async verifyAllAttributeSection() {
    const section = this.page.locator('text=All Attribute').or(this.page.locator('[title="All Attribute"]')).first();
    await expect(section).toBeVisible({ timeout: 8000 });
  }

  async verifyAdditionalAttributeSection() {
    const section = this.page.locator('text=Additional Attribute').or(this.page.locator('[title="Additional Attribute"]')).first();
    await expect(section).toBeVisible({ timeout: 8000 });
  }

  async navigateAllRowsViaNext() {
    const nextBtn = this.page.getByRole('button', { name: /^next$/i }).or(
      this.page.locator('twc-button').filter({ hasText: /^next$/i })
    ).first();
    while (true) {
      try {
        await nextBtn.waitFor({ state: 'visible', timeout: 3000 });
        const isEnabled = await nextBtn.isEnabled();
        if (!isEnabled) break;
        await nextBtn.click();
        await this.page.waitForTimeout(500);
      } catch {
        break;
      }
    }
  }

  async openFilterPanel(): Promise<void> {
    await this.filterIcon.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(500);
  }

  async clickAddNewIcon() {
    await this.filterIcon.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
    const addNewIcon = this.page.locator('.filter-container').locator("twc-icon[name='add-new']").first();
    await addNewIcon.evaluate((el: HTMLElement) => el.click());
    await this.page.waitForTimeout(500);
  }

  async clickEqualsIcon() {
    await this.page.waitForLoadState('domcontentloaded');
    const equalsIcon = this.page.locator("twc-icon[name='equals']");
    try {
      await equalsIcon.waitFor({ state: 'visible', timeout: 5000 });
      await equalsIcon.click();
    } catch {
      // equals icon not present at this stage; it may appear after a rule is added
    }
    await this.page.waitForTimeout(500);
  }

  async clickAddRule() {
    await this.page.locator('twc-button')
      .filter({ hasText: 'Add Rule' })
      .filter({ hasNotText: 'Ruleset' })
      .first()
      .click();
    await this.page.waitForTimeout(500);
  }

  async selectWorkItemPriorityFromDropdown() {
    await this.page.locator('twc-query-builder [role="combobox"]').first().click({ force: true });
    await this.page.getByRole('option', { name: 'AND' }).click();
    await this.page.waitForTimeout(300);
    await this.page.locator('twc-query-builder [role="combobox"]').nth(1).click({ force: true });
    await this.page.getByRole('option', { name: 'Work Item priority' }).click();
    await this.page.waitForTimeout(500);
  }

  async selectActivityNameFromDropdown() {
    // Select AND from the group operator dropdown (first combobox)
    await this.page.locator('twc-query-builder [role="combobox"]').first().click({ force: true });
    await this.page.getByRole('option', { name: 'AND' }).click();
    await this.page.waitForTimeout(300);
    // Select Activity name from the rule field dropdown (second combobox)
    await this.page.locator('twc-query-builder [role="combobox"]').nth(1).click({ force: true });
    await this.page.getByRole('option', { name: 'Activity name' }).click();
    await this.page.waitForTimeout(500);
  }

  async enterActivityNameValue(value: string) {
    // Use twc-query-builder input to match both text and number inputs
    await this.page.locator('twc-query-builder input').last().fill(value);
    await this.page.waitForTimeout(300);
  }

  async clickSaveButton() {
    await this.page.locator('#bpme-filter-ctrl twc-button').filter({ hasText: 'Save' }).click();
    await this.page.waitForTimeout(500);
  }

  async clickApplyFilters() {
    await this.page.locator('.filter-container').getByText('Apply Filters').click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(500);
  }

  async clickSaveFilterButton() {
    await this.page.locator('.filter-container twc-button').filter({ hasText: 'Save filters' }).click();
    await this.page.waitForTimeout(500);
  }

  async openSavedFiltersDropdown() {
    // Target the twc-button that wraps the chevron-down icon (the split button's dropdown trigger),
    // not the chevron icons inside twc-select elements in the filter builder
    await this.page.locator('.filter-container twc-button:has(twc-icon[name="chevron-down"])').click();
    await this.page.waitForTimeout(500);
  }

  async enterFilterName(name: string) {
    await this.page.locator('#save-filter-control input').fill(name);
    await this.page.waitForTimeout(300);
  }

  async clickSaveFilterDialog(): Promise<string> {
    const input = this.page.locator('#save-filter-control input');
    const baseName = await input.inputValue().catch(() => 'Auto_Activity_Name');

    // Press Tab to blur the input – reliably triggers validation and enables the Save button
    await input.press('Tab');
    await this.page.waitForTimeout(300);

    // The dialog Save button is a native <button>, not a twc-button
    const saveBtn = this.page.getByRole('button', { name: 'Save', exact: true });
    await saveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await saveBtn.click();
    await this.page.locator('text=Save query for selected filters').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
    await this.page.waitForTimeout(500);
    return baseName;
  }

  async deleteFilter(filterName: string) {
    // twc-list-item spans the full sidebar row; use its bounding box so the mouse click
    // lands on the 3-dots icon at the right edge (12px from the right), which only
    // becomes interactable after hover.
    const filterMenuItem = this.page.getByRole('menuitem', { name: filterName, exact: true });
    await filterMenuItem.waitFor({ state: 'visible', timeout: 5000 });
    await filterMenuItem.hover();
    await this.page.waitForTimeout(500);
    const box = await filterMenuItem.boundingBox();
    if (box) {
      await this.page.mouse.click(box.x + box.width - 12, box.y + box.height / 2);
    } else {
      await filterMenuItem.locator("twc-icon[name='three-dots-vertical']").click();
    }
    await this.page.waitForTimeout(500);
    await this.page.getByRole('menuitem', { name: /delete/i }).click();
    await this.page.waitForTimeout(500);
  }

  async editFilter(filterName: string, newActivityNameValue: string) {
    // Hover over the filter menuitem to reveal the 3-dot icon
    const filterMenuItem = this.page.getByRole('menuitem', { name: filterName, exact: true });
    await filterMenuItem.hover();
    await this.page.waitForTimeout(300);
    // Click the three-dots-vertical icon
    await filterMenuItem.locator("twc-icon[name='three-dots-vertical']").click();
    await this.page.waitForTimeout(500);
    // Select 'Edit' from the context menu
    await this.page.getByRole('menuitem', { name: /edit/i }).click();
    await this.page.waitForTimeout(500);
    // Clear existing value and enter the new one – twc-query-builder input covers text and number fields
    const valueInput = this.page.locator('twc-query-builder input').last();
    await valueInput.clear();
    await valueInput.fill(newActivityNameValue);
    await this.page.waitForTimeout(300);
    // Click outside the input to enable the Save button, then save the modal
    await this.page.locator('text=Audit filter').click();
    await this.page.waitForTimeout(300);
    await this.page.getByRole('button', { name: 'Save', exact: true }).click();
    await this.page.locator('text=Audit filter').waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
    await this.page.waitForTimeout(500);

    // Click 'Save filters' to persist the edit – auto-saves without a dialog
    await this.page.locator('.filter-container twc-button').filter({ hasText: 'Save filters' }).click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async getDuplicateFilterNameMessage(): Promise<string | null> {
    // Primary check: Save button in the save-filter dialog disabled = duplicate rejected
    try {
      const saveBtn = this.page.locator('#save-filter-control').locator('..').getByRole('button', { name: 'Save', exact: true });
      await saveBtn.waitFor({ state: 'visible', timeout: 2000 });
      const isDisabled = await saveBtn.isDisabled();
      if (isDisabled) return 'Duplicate name not allowed: Save button is disabled';
    } catch {
      // fallback: check via dialog role
      try {
        const saveBtn = this.page.getByRole('dialog').getByRole('button', { name: 'Save', exact: true });
        await saveBtn.waitFor({ state: 'visible', timeout: 1000 });
        const isDisabled = await saveBtn.isDisabled();
        if (isDisabled) return 'Duplicate name not allowed: Save button is disabled';
      } catch { /* dialog not open */ }
    }

    // Secondary check: inline error, alert, or toast text
    const candidates = [
      this.page.locator('#save-filter-control [class*="error"], #save-filter-control [class*="invalid"], #save-filter-control [class*="helper"]').first(),
      this.page.locator('[role="alert"]').first(),
      this.page.locator('twc-toast, twc-notification, [class*="toast"], [class*="snack"]').first(),
      this.page.locator('text=/already exist|duplicate|name is taken/i').first(),
    ];
    for (const loc of candidates) {
      try {
        await loc.waitFor({ state: 'visible', timeout: 2000 });
        const text = await loc.textContent();
        if (text?.trim()) return text.trim();
      } catch { /* not this one */ }
    }
    return null;
  }

  async closeEventDetailsDialog(): Promise<void> {
    await this.page.getByRole("dialog").locator("svg").click();
  }

  async navigateBackToWorkItemPage(): Promise<void> {
    await this.backToWorkItemLink.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.workItemTableHeader.first().waitFor({ state: 'visible', timeout: 10000 });
  }

  async getAuditDetailCellValueByColumn(columnName: string): Promise<string> {
    const headers = this.page.locator('twc-table-head-cell');
    const headerCount = await headers.count();
    let colIndex = -1;
    for (let i = 0; i < headerCount; i++) {
      const text = await headers.nth(i).innerText();
      if (text.trim() === columnName) {
        colIndex = i;
        break;
      }
    }
    if (colIndex === -1) throw new Error(`Column "${columnName}" not found in audit detail table`);
    const firstRow = this.page.locator('twc-table-row').first();
    return (await firstRow.locator('twc-table-cell').nth(colIndex).innerText()).trim();
  }

  async confirmDeleteFilter() {
    // Wait up to 3 s for a confirmation dialog; click if it appears, skip if it doesn't
    try {
      const confirmBtn = this.page.getByRole('button', { name: /confirm|yes|delete/i });
      await confirmBtn.waitFor({ state: 'visible', timeout: 3000 });
      await confirmBtn.click();
      await this.page.waitForTimeout(500);
    } catch {
      // No confirmation dialog – deletion was immediate
    }
  }

  async click3DotsOnFirstRow(): Promise<void> {
    const firstRow = this.workItemRows.first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    // The 3-dots (⋮) is an unnamed <button> – last button in the Event Links cell.
    // Clicking twc-icon directly fails because it is inside a shadow DOM slot (reported hidden).
    const threeDotsButton = firstRow.locator('twc-table-cell').last().locator('button').last();
    await threeDotsButton.waitFor({ state: 'visible', timeout: 5000 });
    await threeDotsButton.click();
    await this.page.waitForTimeout(500);
  }

  async clickContextMenuOption(optionName: string): Promise<void> {
    const option = this.page.getByRole('menuitem', { name: new RegExp(optionName, 'i') }).first();
    await option.waitFor({ state: 'visible', timeout: 5000 });
    await option.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);
  }

  async getLastRowWorkItemId(): Promise<string> {
    const lastRow = this.workItemRows.last();
    await lastRow.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    return (await lastRow.locator('twc-table-cell').first().innerText()).trim();
  }

  async click3DotsOnLastRow(): Promise<void> {
    const lastRow = this.workItemRows.last();
    await lastRow.waitFor({ state: 'visible', timeout: 10000 });
    await lastRow.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(300);
    const threeDotsButton = lastRow.locator('twc-table-cell').last().locator('button').last();
    await threeDotsButton.waitFor({ state: 'visible', timeout: 5000 });
    await threeDotsButton.click();
    await this.page.waitForTimeout(500);
  }

  async hoverWorkItemAndClickThisWorkItem(): Promise<void> {
    // Use exact match to avoid matching sidebar "All work items" (which also contains "work items")
    const workitemOption = this.page.getByRole('menuitem', { name: /^workitem$/i }).first();
    await workitemOption.waitFor({ state: 'visible', timeout: 5000 });
    // Use .? to match both "This work item" and "This Workitem" (the app renders it without a space)
    const thisWorkItem = this.page.getByRole('menuitem', { name: /this work.?item/i })
      .or(this.page.locator('[role="menuitem"]').filter({ hasText: /this work.?item/i }))
      .first();

    // Strategy 1: full event dispatch in browser context (same approach that works for Processes)
    await workitemOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await thisWorkItem.isVisible().catch(() => false)) {
      await thisWorkItem.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(1000);
      return;
    }

    // Strategy 2: native Playwright hover
    await workitemOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await thisWorkItem.isVisible().catch(() => false)) {
      await thisWorkItem.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(1000);
      return;
    }

    // Strategy 3: physical mouse sweep left→right
    const box = await workitemOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(100);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await thisWorkItem.isVisible().catch(() => false)) {
      await thisWorkItem.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(1000);
      return;
    }

    // Strategy 4: keyboard ArrowRight to open submenu
    await workitemOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);
    if (await thisWorkItem.isVisible().catch(() => false)) {
      await thisWorkItem.click();
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(1000);
      return;
    }

    throw new Error('"This work item" submenu never appeared – all strategies failed');
  }

  async hoverProcessesAndClickThisInstance(): Promise<void> {
    const processesOption = this.page.getByRole('menuitem', { name: /^processes$/i }).first();
    await processesOption.waitFor({ state: 'visible', timeout: 5000 });

    // Broad submenu selector – covers "This instance", "This process", etc.
    const submenuItem = this.page.getByRole('menuitem', { name: /this instance|this process/i })
      .or(this.page.locator('text=This instance'))
      .first();

    // Strategy 1: dispatch events in the browser context (window is available there)
    await processesOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 2: native Playwright hover (real mouse move to element center)
    await processesOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 3: physical mouse sweep left→right
    const box = await processesOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(200);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 4: keyboard ArrowRight to open submenu
    await processesOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    throw new Error('"This instance" submenu never appeared – evaluate, hover, mouse.move, and keyboard all failed');
  }

  async hoverProcessesAndClickThisTaskForThisInstance(): Promise<void> {
    const processesOption = this.page.getByRole('menuitem', { name: /^processes$/i }).first();
    await processesOption.waitFor({ state: 'visible', timeout: 5000 });

    const submenuItem = this.page.getByRole('menuitem', { name: /this task for this instance/i })
      .or(this.page.locator('text=This task for this instance'))
      .first();

    // Strategy 1: dispatch events in the browser context (window is available there)
    await processesOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 2: native Playwright hover
    await processesOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 3: physical mouse sweep left→right
    const box = await processesOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(200);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 4: keyboard ArrowRight to open submenu
    await processesOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    throw new Error('"This task for this instance" submenu never appeared – all strategies failed');
  }

  async hoverProcessesAndClickThisTaskForAllInstances(): Promise<void> {
    const processesOption = this.page.getByRole('menuitem', { name: /^processes$/i }).first();
    await processesOption.waitFor({ state: 'visible', timeout: 5000 });

    const submenuItem = this.page.getByRole('menuitem', { name: /this task for all instances/i })
      .or(this.page.locator('text=This task for all instances'))
      .first();

    // Strategy 1: dispatch events in the browser context (window is available there)
    await processesOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 2: native Playwright hover
    await processesOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 3: physical mouse sweep left→right
    const box = await processesOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(200);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 4: keyboard ArrowRight to open submenu
    await processesOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    throw new Error('"This task for all instances" submenu never appeared – all strategies failed');
  }

  async hoverProcessesAndClickInstanceOfThisProcess(): Promise<void> {
    const processesOption = this.page.getByRole('menuitem', { name: /^processes$/i }).first();
    await processesOption.waitFor({ state: 'visible', timeout: 5000 });

    const submenuItem = this.page.getByRole('menuitem', { name: /instances of this process/i })
      .or(this.page.locator('text=Instances of this process'))
      .first();

    // Strategy 1: dispatch events in the browser context (window is available there)
    await processesOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 2: native Playwright hover
    await processesOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 3: physical mouse sweep left→right
    const box = await processesOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(200);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 4: keyboard ArrowRight to open submenu
    await processesOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    throw new Error('"Instances of this process" submenu never appeared – all strategies failed');
  }

  async hoverResourcesAndClickForThisWorkItem(): Promise<void> {
    const resourcesOption = this.page.getByRole('menuitem', { name: /^resource$/i }).first();
    await resourcesOption.waitFor({ state: 'visible', timeout: 5000 });

    const submenuItem = this.page.getByRole('menuitem', { name: /for this work.?item/i })
      .or(this.page.locator('text=For this WorkItem'))
      .first();

    // Strategy 1: dispatch events in the browser context (window is available there)
    await resourcesOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 2: native Playwright hover
    await resourcesOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 3: physical mouse sweep left→right
    const box = await resourcesOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(200);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 4: keyboard ArrowRight to open submenu
    await resourcesOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    throw new Error('"For this WorkItem" submenu never appeared – all strategies failed');
  }

  async hoverResourcesAndClickThisTaskForThisInstance(): Promise<void> {
    const resourcesOption = this.page.getByRole('menuitem', { name: /^resource$/i }).first();
    await resourcesOption.waitFor({ state: 'visible', timeout: 5000 });

    const submenuItem = this.page.locator('[role="menuitem"]').filter({ hasText: /for this task/i }).first();

    // Strategy 1: dispatch events in the browser context (window is available there)
    await resourcesOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 2: native Playwright hover
    await resourcesOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 3: keyboard ArrowRight – then navigate down to "For this task" and Enter
    await resourcesOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(800);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }
    // "Activity by this resource" may be disabled – ArrowDown skips to "For this work item", another ArrowDown lands on "For this task"
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
    const menuStillOpen = await this.page.locator('[role="menuitem"]').isVisible().catch(() => false);
    if (!menuStillOpen) {
      return; // menu closed or page navigated – keyboard Enter succeeded
    }

    // Strategy 4: physical mouse sweep left→right
    const box = await resourcesOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(200);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    throw new Error('"For this task" submenu under Resource never appeared – all strategies failed');
  }

  async hoverResourcesAndClickThisTaskForAllInstances(): Promise<void> {
    const resourcesOption = this.page.getByRole('menuitem', { name: /^resource$/i }).first();
    await resourcesOption.waitFor({ state: 'visible', timeout: 5000 });

    const submenuItem = this.page.getByRole('menuitem', { name: /^for this task$/i })
      .or(this.page.locator('text=For this task'))
      .first();

    // Strategy 1: dispatch events in the browser context (window is available there)
    await resourcesOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 2: native Playwright hover
    await resourcesOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 3: physical mouse sweep left→right
    const box = await resourcesOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(200);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 4: keyboard ArrowRight to open submenu
    await resourcesOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    throw new Error('"For this task" submenu under Resource never appeared – all strategies failed');
  }

  async hoverResourcesAndClickForThisWorkItemKeyboard(): Promise<void> {
    const resourcesOption = this.page.getByRole('menuitem', { name: /^resource$/i }).first();
    await resourcesOption.waitFor({ state: 'visible', timeout: 5000 });

    const submenuItem = this.page.locator('[role="menuitem"]').filter({ hasText: /for this work.?item/i }).first();

    // Strategy 1: dispatch events in the browser context
    await resourcesOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 2: native Playwright hover
    await resourcesOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }

    // Strategy 3: keyboard ArrowRight – Enter ("For this work item" is the first focused item after open)
    await resourcesOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(800);
    if (await submenuItem.isVisible().catch(() => false)) {
      await submenuItem.click();
      return;
    }
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
    const menuStillOpen = await this.page.locator('[role="menuitem"]').isVisible().catch(() => false);
    if (!menuStillOpen) {
      return;
    }

    throw new Error('"For this work item" submenu under Resource never appeared – all strategies failed');
  }

  async clickRelatedCasesThreeDotsAndSelectWorkItem(): Promise<void> {
    const firstRow = this.workItemRows.first();
    await firstRow.waitFor({ state: 'visible', timeout: 10000 });
    const threeDotsButton = firstRow.locator('twc-table-cell').last().locator('button').last();
    await threeDotsButton.waitFor({ state: 'visible', timeout: 5000 });
    await threeDotsButton.click();
    await this.page.waitForTimeout(500);

    // Hover 'Work item' to reveal the submenu, then click 'This work item'
    // Use exact match to avoid matching sidebar "All work items" (which also contains "work items")
    const workitemOption = this.page.getByRole('menuitem', { name: /^workitem$/i }).first();
    await workitemOption.waitFor({ state: 'visible', timeout: 5000 });
    // Use .? to match both "This work item" and "This Workitem" (no space variant)
    const thisWorkItem = this.page.getByRole('menuitem', { name: /this work.?item/i })
      .or(this.page.locator('[role="menuitem"]').filter({ hasText: /this work.?item/i }))
      .first();

    // Strategy 1: full event dispatch in browser context
    await workitemOption.evaluate((el) => {
      el.dispatchEvent(new MouseEvent('pointerover',  { bubbles: true,  cancelable: true, composed: true }));
      el.dispatchEvent(new MouseEvent('pointerenter', { bubbles: false, cancelable: false, composed: true }));
      el.dispatchEvent(new MouseEvent('mouseover',    { bubbles: true,  cancelable: true, composed: true, view: window }));
      el.dispatchEvent(new MouseEvent('mouseenter',   { bubbles: false, cancelable: false, composed: true, view: window }));
      el.dispatchEvent(new FocusEvent('focus',        { bubbles: false, cancelable: false }));
    });
    await this.page.waitForTimeout(1500);
    if (await thisWorkItem.isVisible().catch(() => false)) {
      await thisWorkItem.click();
      return;
    }

    // Strategy 2: native Playwright hover
    await workitemOption.hover({ force: true });
    await this.page.waitForTimeout(1500);
    if (await thisWorkItem.isVisible().catch(() => false)) {
      await thisWorkItem.click();
      return;
    }

    // Strategy 3: physical mouse sweep left→right
    const box = await workitemOption.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + 5, box.y + box.height / 2);
      await this.page.waitForTimeout(100);
      await this.page.mouse.move(box.x + box.width * 0.9, box.y + box.height / 2, { steps: 15 });
      await this.page.waitForTimeout(1500);
    }
    if (await thisWorkItem.isVisible().catch(() => false)) {
      await thisWorkItem.click();
      return;
    }

    // Strategy 4: keyboard ArrowRight to open submenu
    await workitemOption.focus();
    await this.page.keyboard.press('ArrowRight');
    await this.page.waitForTimeout(1000);

    await thisWorkItem.waitFor({ state: 'visible', timeout: 5000 });
    await thisWorkItem.click();
  }
}
