import { expect, type Locator, type Page } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class AuditUsersResourcesPage {
  readonly page: Page;

  // ── Shared timeouts ────────────────────────────────────────────────────────
  static readonly SHORT_TIMEOUT =  5000;
  static readonly STD_TIMEOUT   = 10000;
  static readonly LONG_TIMEOUT  = 15000;

  // ── Static locators ────────────────────────────────────────────────────────
  readonly tableRows: Locator;
  readonly backToUsersResourcesBtn: Locator;
  readonly allUsersResourcesMenuItem: Locator;
  readonly filterToolbarBtn: Locator;
  readonly filterBadgeIcon: Locator;
  readonly addRuleBtn: Locator;
  readonly refreshToolbarBtn: Locator;
  readonly columnSelectorBtn: Locator;
  readonly showMoreBtn: Locator;
  readonly applyColumnsBtn: Locator;
  readonly auditDetailsHeading: Locator;
  readonly eventDetailsHeading: Locator;
  readonly nextBtn: Locator;
  readonly resetFilterBtn: Locator;
  readonly auditFilterDialog: Locator;
  readonly bpmAuditNav: Locator;
  readonly entityNavItem: Locator;
  readonly applyFiltersBtn: Locator;
  readonly saveQueryTitle: Locator;
  readonly fieldDropdownCaret: Locator;
  readonly yesDeleteBtn: Locator;
  readonly noDeleteBtn: Locator;
  readonly alertDialog: Locator;
  readonly noUsersResourcesMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.tableRows               = page.locator('twc-table-row');
    this.backToUsersResourcesBtn = page.getByRole('button', { name: 'Back to Users/Resources' });
    this.allUsersResourcesMenuItem = page.getByRole('menuitem', { name: 'All Users/Resources', exact: true });
    this.filterToolbarBtn        = page.locator('twc-toolbar-item').filter({ hasText: 'Filter Filter' }).locator('svg');
    this.filterBadgeIcon         = page.locator('twc-icon').filter({ hasText: '0' }).locator('#Vector').first();
    this.addRuleBtn              = page.getByRole('button', { name: 'Rule Add Rule' });
    this.refreshToolbarBtn       = page.locator('twc-toolbar-item').filter({ hasText: /refresh/i }).locator('svg');
    this.columnSelectorBtn       = page.locator('twc-categoriser').filter({ hasText: 'Selected Columns' }).locator('#Vector');
    this.showMoreBtn             = page.getByRole('button', { name: 'Show more...' });
    this.applyColumnsBtn         = page.getByRole('button', { name: 'Apply', exact: true });
    this.auditDetailsHeading     = page.getByText(/Audit details of/);
    this.eventDetailsHeading     = page.getByText(/Event Details for ID/);
    this.nextBtn                 = page.getByRole('button', { name: 'Next' });
    this.resetFilterBtn          = page.getByRole('button', { name: 'Reset' });
    this.auditFilterDialog       = page.locator('twc-dialog[label="Audit filter"]');
    this.bpmAuditNav             = page.locator('#bpmAudit svg');
    this.entityNavItem           = page.locator('twc-list-view').getByTitle('Users/Resources', { exact: true });
    this.applyFiltersBtn         = page.getByRole('button', { name: 'Apply Filters' });
    this.saveQueryTitle          = page.getByText('Save query for selected filters');
    // Targets the FIRST rule row's field-name dropdown. For rule 2+ use scoped locators.
    this.fieldDropdownCaret      = page.locator('twc-select').filter({ hasText: 'Application activity instance' }).locator('twc-popup svg').first();
    // getByRole pierces shadow DOM — more reliable than locator('twc-button').filter()
    this.yesDeleteBtn            = page.getByRole('button', { name: /yes.*delete/i });
    this.noDeleteBtn             = page.getByRole('button', { name: 'Cancel', exact: true });
    this.alertDialog             = page.getByRole('alertdialog');
    this.noUsersResourcesMessage = page.getByText(/no users.?resources events/i);
  }

  // Returns today's date at midnight in datetime-local format (YYYY-MM-DDT00:00).
  // Used by Creation Time filter tests so the date is always dynamic, never hardcoded.
  static buildTodayStart(): string {
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T00:00`;
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  // Scroll the virtual table until the row count stabilises, invoking `check(rowIndex)`
  // for each newly rendered row. Returns the final stable row count.
  private async scrollAndCheckEachRow(
    check: (rowIndex: number) => Promise<void>,
    delayMs = 800
  ): Promise<number> {
    let checked = 0;
    let lastCount = -1;
    for (let iter = 0; iter < 100; iter++) {
      const count = await this.tableRows.count();
      for (let i = checked; i < count; i++) await check(i);
      checked = count;
      if (count === lastCount) break;
      lastCount = count;
      try { await this.tableRows.last().scrollIntoViewIfNeeded(); } catch { /* virtual-list re-render */ }
      await this.page.waitForTimeout(delayMs);
    }
    return checked;
  }

  // Pick a named field from the first rule row's field dropdown.
  private async selectFieldOption(optionName: string): Promise<void> {
    await this.fieldDropdownCaret.click();
    const option = this.page.getByRole('option', { name: optionName });
    await option.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await option.locator('slot').nth(1).click();
  }

  // Change the operator dropdown in the active rule row (defaults to "equal" after field selection).
  private async selectRuleOperator(operatorText: RegExp | string): Promise<void> {
    const operatorSelect = this.page.locator('twc-select').filter({ hasText: /equal/i }).first();
    await operatorSelect.locator('twc-popup svg').click();
    await this.page.getByRole('option', { name: operatorText }).locator('slot').nth(1).click();
  }

  // Fill the text value input in the active rule row (0-based index for multi-input rules).
  private async fillRuleTextInput(value: string, inputIndex = 0): Promise<void> {
    const input = this.page.getByRole('textbox').nth(inputIndex);
    await input.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await input.click();
    await input.fill(value);
  }

  // Open the "Save as" split-button dropdown and fill in the filter name.
  // Shared between applyAndSaveFilter and applyAndTrySaveAs.
  private async openSaveAsDialog(filterName: string): Promise<void> {
    const chevron = this.page.locator('twc-dropdown').filter({ hasText: 'Save as' }).locator('svg').first();
    await chevron.waitFor({ state: 'attached', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await chevron.dispatchEvent('click');
    await this.page.getByText('Save as').last().waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await this.page.getByText('Save as').last().click();

    const textbox = this.page.getByRole('textbox');
    await textbox.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await textbox.clear();
    // pressSequentially fires input events that enable the Save button — fill() alone does not.
    await textbox.pressSequentially(filterName, { delay: 50 });
    await textbox.press('Tab');
  }

  // Resolve a cell value by column name; throws when the column is absent.
  private cellValue(headers: string[], row: string[], col: string): string {
    const i = headers.indexOf(col);
    if (i === -1)
      throw new Error(`Column "${col}" not found. Available: [${headers.join(", ")}]`);
    return row[i]?.trim() ?? "";
  }

  // Click the Message ID cell of the given row (defaults to the first row).
  private async clickMessageIdCell(headers: string[], rowIndex: number = 0): Promise<void> {
    const idx  = headers.indexOf("Message ID");
    const cell = this.tableRows.nth(rowIndex).locator("twc-table-cell").nth(idx);
    await cell.scrollIntoViewIfNeeded().catch(() => {});
    await cell.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await cell.click();
  }

  // ── Navigation ─────────────────────────────────────────────────────────────

  async navigateToAudit(): Promise<void> {
    // When already inside the Audit section (URL contains 'bpmAudit'), clicking
    // the Audit nav icon again renders a blank page. Skip the icon click and just
    // press Escape to dismiss any open overlay.
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.page.keyboard.press('Escape').catch(() => {});
    await this.page.waitForTimeout(300);
    if (!this.page.url().includes('bpmAudit')) {
      await this.bpmAuditNav.click({ force: true });
      await this.page.waitForLoadState("domcontentloaded");
      console.log('Navigated to Audit section');
    }
  }

  // Navigate to Users/Resources and ensure the audit events view is shown.
  // Clicking "Users/Resources" in the sidebar can restore a cached drilled-down
  // page ("Audit details of [entity]") that lacks the Filter toolbar. Detect this
  // via the "Back to Users/Resources" breadcrumb button and navigate back to the
  // entity list first, then drill in fresh so the toolbar is always present.
  async clickOnUserResources(): Promise<void> {
    const onEntityList = await this.entityNavItem
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false);

    if (onEntityList) {
      await this.entityNavItem.scrollIntoViewIfNeeded().catch(() => {});
      await this.entityNavItem.click();
      await this.page.waitForLoadState('domcontentloaded');
      console.log('Clicked Users/Resources entity nav item');
    }

    // After navigation, an active filter with 0 results will leave the table empty.
    // Reset to the unfiltered "All Users/Resources" view so subsequent steps have rows.
    const hasRows = await this.tableRows.first()
      .waitFor({ state: 'visible', timeout: 2000 })
      .then(() => true)
      .catch(() => false);
    if (!hasRows) {
      const menuVisible = await this.allUsersResourcesMenuItem
        .waitFor({ state: 'visible', timeout: 1500 })
        .then(() => true).catch(() => false);
      if (menuVisible) {
        await this.allUsersResourcesMenuItem.click();
        await this.tableRows.first().waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
        console.log('Reset to All Users/Resources (no rows visible)');
      }
    }

    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditUsersResourcesPage.LONG_TIMEOUT });

    // If we landed on a drilled-down page, go back to the entity list.
    if (await this.backToUsersResourcesBtn.isVisible()) {
      await this.backToUsersResourcesBtn.click();
      await this.tableRows.first().waitFor({ state: "visible", timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
      console.log('Navigated back from drilled-down page to entity list');
    }

    const headers = await utility.tableHeader(this.page);
    if (!headers.includes("Event ID")) {
      // Entity list shown — click first row to navigate to its audit events.
      await this.tableRows.first().locator("twc-table-cell").first().click();
      await this.page.waitForLoadState("networkidle");
      await this.tableRows.first().waitFor({ state: "visible", timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
      console.log('Drilled into first entity to load audit events');
    }
  }

  // ── Level 1: Audit events (Event ID, Message ID, Severity) ────────────────

  async verifyAuditEventColumns(): Promise<string[]> {
    const headers = await utility.tableHeader(this.page);
    expect(headers, "Event ID column must be present in audit events").toContain("Event ID");
    expect(headers, "Message ID column must be present in audit events").toContain("Message ID");
    expect(headers, "Severity column must be present in audit events").toContain("Severity");
    console.log(`Audit event columns verified: [${headers.join(', ')}]`);
    return headers;
  }

  async readFirstAuditEventRow(headers: string[]): Promise<{ eventId: string; messageId: string; severity: string; rowIndex: number }> {
    await this.tableRows.first().waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });

    const severityIdx = headers.indexOf("Severity");

    // Scan rows (scrolling to load virtual rows) for the first AUDIT-severity row.
    // Non-AUDIT rows (ERROR, INFO) are not drillable.
    let lastCount = -1;
    for (let attempt = 0; attempt < 50; attempt++) {
      const count = await this.tableRows.count();
      for (let i = 0; i < count; i++) {
        const txt = await this.tableRows.nth(i).innerText();
        const row = txt.split(/[\t\n]/g);
        const sev = (row[severityIdx] ?? "").trim();
        if (sev.toUpperCase() === "AUDIT") {
          const eventId   = this.cellValue(headers, row, "Event ID");
          const messageId = this.cellValue(headers, row, "Message ID");
          expect(eventId,   "Event ID should not be empty").toBeTruthy();
          expect(messageId, "Message ID should not be empty").toBeTruthy();
          console.log(`First audit event — row ${i}, EventID: ${eventId}, MessageID: ${messageId}, Severity: ${sev}`);
          return { eventId, messageId, severity: sev, rowIndex: i };
        }
      }
      if (count === lastCount) break;
      lastCount = count;
      try { await this.tableRows.last().scrollIntoViewIfNeeded(); } catch { /* virtual-list re-render */ }
      await this.page.waitForTimeout(500);
    }

    // Fallback: no AUDIT row found — use first row
    const row       = await utility.getFirstRowContents(this.page);
    const eventId   = this.cellValue(headers, row, "Event ID");
    const messageId = this.cellValue(headers, row, "Message ID");
    const severity  = this.cellValue(headers, row, "Severity");
    console.log(`No AUDIT row found — fallback row 0: EventID: ${eventId}, Severity: ${severity}`);
    return { eventId, messageId, severity, rowIndex: 0 };
  }

  async drillIntoMessageId(headers: string[], rowIndex: number = 0): Promise<void> {
    await this.clickMessageIdCell(headers, rowIndex);
    await this.page.waitForLoadState("networkidle");
    await expect(this.auditDetailsHeading, "Audit details heading should be visible").toBeVisible({ timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    console.log('Drilled into Message ID — Audit details page loaded');
  }

  // ── Level 2: Audit details page ───────────────────────────────────────────

  async verifyAuditDetailsPage(): Promise<{ detailHeaders: string[] }> {
    await expect(this.tableRows.first(), "Detail table should have at least one row").toBeVisible({ timeout: AuditUsersResourcesPage.LONG_TIMEOUT });

    const detailHeaders = await utility.tableHeader(this.page);
    expect(detailHeaders, "Event ID column must be present in detail table").toContain("Event ID");
    expect(detailHeaders, "Severity column must be present in detail table").toContain("Severity");

    const detailRow = await utility.getFirstRowContents(this.page);
    const severity  = this.cellValue(detailHeaders, detailRow, "Severity");

    expect(this.cellValue(detailHeaders, detailRow, "Event ID"), "Detail Event ID should not be empty").toBeTruthy();
    expect(severity.toLowerCase(), `Severity should be "audit"`).toBe("audit");

    console.log(`Audit details page verified — headers: [${detailHeaders.join(', ')}]`);
    return { detailHeaders };
  }

  async openEventDetailsPanel(detailHeaders: string[]): Promise<void> {
    await this.clickMessageIdCell(detailHeaders);
    await this.eventDetailsHeading.first().waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    console.log('Event details panel opened');
  }

  // ── Level 3: Event Details panel ──────────────────────────────────────────

  async verifyEventDetailsPanel(eventId: string, messageId: string): Promise<void> {
    await expect(
      this.page.getByText(`Event Details for ID ${eventId}`),
      `Panel heading should read "Event Details for ID ${eventId}"`
    ).toBeVisible({ timeout: AuditUsersResourcesPage.LONG_TIMEOUT });

    await expect(
      this.page.getByText(messageId).last(),
      `messageId "${messageId}" should be visible in Event Details panel`
    ).toBeVisible({ timeout: AuditUsersResourcesPage.STD_TIMEOUT });

    await this.page.waitForTimeout(2000);
    console.log(`Event Details panel verified — EventID: ${eventId}, MessageID: ${messageId}`);
  }

  // Loop through all rows in the Event Details panel by clicking Next until it is disabled.
  // Pauses 2s on each new panel so the details are visible on screen.
  // Returns the number of additional rows navigated (0 if Next was never enabled).
  async clickNextThroughAllEventDetails(): Promise<number> {
    let count = 0;

    while (true) {
      await this.nextBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
      if (!(await this.nextBtn.isEnabled())) break;

      const currentHeading = await this.eventDetailsHeading.first().textContent() ?? '';
      const currentId = currentHeading.replace('Event Details for ID', '').trim();

      await this.nextBtn.click();

      await expect.poll(async () => {
        const heading = await this.eventDetailsHeading.first()
          .textContent({ timeout: 2000 }).catch(() => '');
        const newId = (heading ?? '').replace('Event Details for ID', '').trim();
        return newId !== '' && newId !== currentId;
      }, { timeout: AuditUsersResourcesPage.STD_TIMEOUT, message: 'Event Details panel heading should update after clicking Next' }).toBe(true);

      const newHeading = await this.eventDetailsHeading.first().textContent() ?? '';
      const newId = newHeading.replace('Event Details for ID', '').trim();

      await expect(
        this.page.getByText(`Event Details for ID ${newId}`),
        `Panel should show "Event Details for ID ${newId}" after clicking Next`
      ).toBeVisible({ timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });

      await this.page.waitForTimeout(2000);
      count++;
      console.log(`Next Event Details for ID ${newId} verified (row ${count + 1})`);
    }

    return count;
  }

  async closeEventDetailsPanel(): Promise<void> {
    const dialog = this.page.getByRole("dialog");
    await dialog.locator("svg").click();
    await dialog.waitFor({ state: 'hidden', timeout: AuditUsersResourcesPage.STD_TIMEOUT }).catch(() => {});
    console.log('Event details panel closed');
  }

  // Assert "Managed Object Name" column header is present, find the first row whose
  // Managed Object Name cell is empty, click it, and verify the "NO more Audit details available" error.
  async verifyManagedObjectNameAndClickEmptyRowEventId(): Promise<void> {
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditUsersResourcesPage.LONG_TIMEOUT });

    const headers = await utility.tableHeader(this.page);
    const moHeader = headers.find(h => /managed obj/i.test(h));
    expect(
      moHeader,
      `"Managed Object Name" column must be present. Actual headers: [${headers.join(", ")}]`
    ).toBeTruthy();

    const moIdx = headers.indexOf(moHeader!);
    const count = await this.tableRows.count();

    let clickedEmptyCell = false;
    for (let i = 0; i < count; i++) {
      const moCell = this.tableRows.nth(i).locator("twc-table-cell").nth(moIdx);
      const moText = (await moCell.innerText()).trim();
      if (moText === "") {
        await moCell.click();
        clickedEmptyCell = true;
        console.log(`Clicked empty Managed Object Name cell in row ${i + 1}`);
        break;
      }
    }

    expect(
      clickedEmptyCell,
      'At least one row with an empty "Managed Object Name" cell must exist in the Audit details table'
    ).toBe(true);

    await expect(
      this.page.getByText(/no more audit details available/i),
      '"NO more Audit details available this record" error should appear when clicking an empty Managed Object Name cell'
    ).toBeVisible({ timeout: AuditUsersResourcesPage.STD_TIMEOUT });

    await this.page.waitForTimeout(5000);
  }

  async clickBackToUsersResources(): Promise<void> {
    await this.backToUsersResourcesBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await this.backToUsersResourcesBtn.scrollIntoViewIfNeeded().catch(() => {});
    await this.backToUsersResourcesBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
    await expect(
      this.tableRows.first(),
      "Users/Resources table should be visible after navigating back"
    ).toBeVisible({ timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    console.log('Navigated back to Users/Resources list');
  }

  // Click "All Users/Resources" in the sidebar to reset to the unfiltered default view.
  async resetToDefaultView(): Promise<void> {
    await this.allUsersResourcesMenuItem.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await this.allUsersResourcesMenuItem.click();
    await this.tableRows.first().waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    await this.page.waitForTimeout(500);
    console.log('Reset to default All Users/Resources view');
  }

  // Scroll through the full virtual table and return the total row count.
  async getAllRecordsCount(): Promise<number> {
    await this.tableRows.first().waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    const count = await this.scrollAndCheckEachRow(async () => {}, 500);
    const result = count < 0 ? 0 : count;
    console.log(`Total row count: ${result}`);
    return result;
  }

  async clickRefreshButton(): Promise<void> {
    await this.refreshToolbarBtn.click();
    await this.page.waitForLoadState('networkidle');
    await this.tableRows.first().waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    console.log('Refresh button clicked — table reloaded');
  }

  // ── Filter panel ───────────────────────────────────────────────────────────

  // Two clicks required — first the Filter toolbar item, then the filter badge icon.
  async openFilterPanel(): Promise<void> {
    await this.filterToolbarBtn.click();
    await this.filterBadgeIcon.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await this.filterBadgeIcon.click();
    await this.addRuleBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    console.log('Filter panel opened');
  }

  // Opens the filter sidebar to the saved-filters list (step 1 only — does NOT enter the filter editor).
  async openFilterSidebar(): Promise<void> {
    await this.filterToolbarBtn.click();
    await this.allUsersResourcesMenuItem.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    console.log('Filter sidebar opened');
  }

  // Convenience: open filter panel then add a rule in a single call.
  async openFilterPanelAndAddRule(): Promise<void> {
    await this.openFilterPanel();
    await this.clickAddRule();
    console.log('Filter panel opened and +Add Rule clicked');
  }

  async clickAddRule(): Promise<void> {
    await this.addRuleBtn.click();
    // Use .last() — when multiple rules exist each row shows an 'Application activity instance'
    // dropdown, causing strict-mode if we await the locator directly.
    const lastCaret = this.page.locator('twc-select').filter({ hasText: 'Application activity instance' }).locator('twc-popup svg').last();
    await lastCaret.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    console.log('Add Rule clicked — rule editor ready');
  }

  // Configure Severity = AUDIT rule. Pass `save = false` to skip the Save button click
  // (used in test 6 where the next step is Reset).
  async configureSeverityAuditRule(save = true): Promise<void> {
    await this.selectFieldOption('Severity');
    await this.page.locator('twc-select').filter({ hasText: 'TRACE DEBUG INFO SERVICE' }).locator('twc-popup svg').click();
    const auditOption = this.page.getByRole('option', { name: 'AUDIT' });
    await auditOption.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await auditOption.locator('slot').nth(1).click();
    if (save) {
      await this.page.getByRole('button', { name: 'Save' }).click();
      console.log('Filter rule saved: Severity = AUDIT');
    } else {
      console.log('Filter rule configured: Severity = AUDIT (no save)');
    }
  }

  async clickFilterResetButton(): Promise<void> {
    // dispatchEvent bypasses visibility — the button may be covered by the rule sub-panel
    await this.resetFilterBtn.waitFor({ state: 'attached', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await this.resetFilterBtn.dispatchEvent('click');
    await this.addRuleBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    console.log('Filter reset button clicked');
  }

  async clickFilterCloseButton(): Promise<void> {
    await this.auditFilterDialog.getByRole('button', { name: 'Close' }).click();
    await this.auditFilterDialog.waitFor({ state: 'hidden', timeout: AuditUsersResourcesPage.STD_TIMEOUT }).catch(() => {});
    console.log('Filter dialog closed');
  }

  async clickFiltersBackButton(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded').catch(() => {});
    await this.navigateToAudit();
    await this.clickOnUserResources();
    console.log('Navigated back to Users/Resources after filter close');
  }

  // Select "Creation time" field, leave operator as >= (default), fill the datetime value.
  async configureFilterRuleCreationTime(dateTimeValue: string): Promise<void> {
    await this.selectFieldOption('Creation time');
    const dateInput = this.page.locator('input[type="datetime-local"]').first();
    await dateInput.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await dateInput.click();
    await dateInput.fill(dateTimeValue);
    await dateInput.press('Tab');
    await this.page.getByRole('button', { name: 'Save' }).click();
    console.log(`Filter rule saved: Creation time >= "${dateTimeValue}"`);
  }

  // Configure Message ID = <value> rule (no Save — caller adds more rules or calls clickFilterDialogSave).
  async configureRuleMessageIdEquals(value: string): Promise<void> {
    await this.selectFieldOption('Message ID');
    await this.fillRuleTextInput(value);
    console.log(`Filter rule configured: Message ID = "${value}"`);
  }

  // Configure Principal name = <value> rule for the SECOND rule row (no Save — caller handles Save).
  // Scoped to div:nth-child(2) > section because fieldDropdownCaret (.first()) targets rule 1 only.
  async configureRulePrincipalNameEquals(value: string): Promise<void> {
    await this.page.locator('div:nth-child(2) > section > .field-with-search').locator('twc-popup svg').click();
    const principalNameOption = this.page.getByRole('option', { name: 'Principal name' });
    await principalNameOption.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await principalNameOption.locator('slot').nth(1).click();
    await this.fillRuleTextInput(value, 1);
    console.log(`Filter rule configured: Principal name = "${value}"`);
  }

  // Click the Save button inside the filter dialog to commit all configured rules.
  async clickFilterDialogSave(): Promise<void> {
    await this.page.getByRole('button', { name: 'Save' }).click();
    console.log('Filter dialog Save clicked');
  }

  // Configure Managed Object Name = <value> rule (no Save — caller handles Save).
  async configureRuleManagedObjectNameEquals(value: string): Promise<void> {
    await this.selectFieldOption('Managed Object Name');
    await this.fillRuleTextInput(value);
    console.log(`Filter rule configured: Managed Object Name = "${value}"`);
  }

  // Configure Managed Object Name ≠ <value> rule using the "not equal" operator.
  async configureRuleManagedObjectNameNotEquals(value: string): Promise<void> {
    await this.selectFieldOption('Managed Object Name');
    await this.selectRuleOperator(/not equal/i);
    await this.fillRuleTextInput(value);
    console.log(`Filter rule configured: Managed Object Name != "${value}"`);
  }

  // Configure Priority >= <value> rule. No Save call — caller must call clickFilterDialogSave().
  async configureRuleWorkitemPriorityGreaterThanOrEqual(value: string): Promise<void> {
    await this.selectFieldOption('Process instance priority');
    await this.selectRuleOperator(/greater than or equal/i);
    await this.fillRuleTextInput(value);
    await this.page.getByRole('textbox').first().press('Tab');
    console.log(`Filter rule configured: Priority >= "${value}"`);
  }

  // ── Column management ──────────────────────────────────────────────────────

  // Generic column-adder — pass any list of column display names.
  async addColumns(columnNames: string[]): Promise<void> {
    await this.columnSelectorBtn.click();
    await this.showMoreBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await this.showMoreBtn.click();
    for (const name of columnNames) {
      await this.page.getByRole('menuitem', { name }).locator('label span').first().click();
      await this.page.waitForTimeout(100);
    }
    await this.applyColumnsBtn.click();
    console.log(`Columns added: ${columnNames.join(', ')}`);
  }

  // Open the column selector and uncheck the given column names, then Apply.
  async deselectColumns(columns: string[]): Promise<void> {
    await this.columnSelectorBtn.click();
    await this.showMoreBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await this.showMoreBtn.click();
    for (const colName of columns) {
      const menuItem = this.page.getByRole('menuitem').filter({ hasText: colName });
      const checkbox = menuItem.locator('input[type="checkbox"]');
      if (await checkbox.count() > 0 && await checkbox.isChecked()) {
        await menuItem.locator('label span').first().click();
        await this.page.waitForTimeout(100);
      }
    }
    await this.applyColumnsBtn.click();
    console.log(`Columns deselected: [${columns.join(', ')}]`);
  }

  // Check every unchecked column and apply.
  async addAllAvailableColumns(): Promise<void> {
    await this.columnSelectorBtn.click();
    await this.showMoreBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await this.showMoreBtn.click();
    const menuItems = this.page.getByRole('menuitem');
    const count = await menuItems.count();
    for (let i = 0; i < count; i++) {
      const item     = menuItems.nth(i);
      const checkbox = item.locator('input[type="checkbox"]');
      if (await checkbox.count() > 0 && !(await checkbox.isChecked())) {
        await item.locator('label span').first().click();
        await this.page.waitForTimeout(50);
      }
    }
    await this.applyColumnsBtn.click();
    console.log(`All ${count} available columns selected and applied`);
  }

  // ── Filter save / apply ────────────────────────────────────────────────────

  async applyAndSaveFilter(filterName: string): Promise<void> {
    await this.applyFiltersBtn.click();
    await this.openSaveAsDialog(filterName);

    const saveBtn = this.page.getByRole('button', { name: 'Save' }).last();
    await saveBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await expect(saveBtn).toBeEnabled({ timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await saveBtn.click();
    console.log(`Attempted to save filter as "${filterName}"`);

    // Wait for the save dialog to close (success) or stay open (duplicate/error).
    await this.saveQueryTitle.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});

    // Case 1: explicit alertdialog (duplicate name warning).
    if (await this.alertDialog.isVisible()) {
      await this.page.getByRole('button', { name: 'Dismiss' }).click();
      await this.page.waitForTimeout(500);
    }

    // Case 2: dialog still open (inline error or duplicate name) — cancel and reset the Audit page.
    if (await this.saveQueryTitle.isVisible()) {
      const cancelBtn = this.page.getByRole('button', { name: 'Cancel' });
      if (await cancelBtn.isVisible()) await cancelBtn.click();
      await this.page.waitForTimeout(500);
      const auditUrl = this.page.url().split('#')[0] + '#/bpmAudit';
      await this.page.goto(auditUrl);
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForTimeout(1500);
      await this.clickOnUserResources();
      return;
    }
  }

  // Step 1 of the duplicate-name flow: apply the filter and attempt to save with a given name.
  // Leaves the Save dialog open if a duplicate is detected.
  async applyAndTrySaveAs(filterName: string): Promise<void> {
    await this.applyFiltersBtn.click();
    await this.openSaveAsDialog(filterName);

    const saveBtn = this.page.getByRole('button', { name: 'Save' }).last();
    await saveBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await expect(saveBtn).toBeEnabled({ timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await saveBtn.click();
    console.log(`Attempted to save filter as "${filterName}"`);

    await this.page.waitForTimeout(3000);

    if (await this.alertDialog.isVisible()) {
      await this.page.getByRole('button', { name: 'Dismiss' }).click();
      await this.page.waitForTimeout(500);
    }
  }

  // Step 2: assert that the Save dialog is still open — confirms a duplicate-name error occurred.
  async assertDuplicateFilterNameError(): Promise<void> {
    await expect(
      this.saveQueryTitle,
      'Save dialog should still be open — indicates a duplicate filter name error'
    ).toBeVisible({ timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    console.log('Duplicate filter name error confirmed — save dialog still open');
  }

  // Step 3: with the Save dialog already open (after a duplicate error), rename and save.
  async renameSaveDialogFilterAndSave(newName: string): Promise<void> {
    const tb = this.page.getByRole('textbox');
    await tb.clear();
    await tb.pressSequentially(newName, { delay: 50 });
    await tb.press('Tab');

    const saveBtn = this.page.getByRole('button', { name: 'Save' }).last();
    await expect(saveBtn).toBeEnabled({ timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await saveBtn.click();

    await this.saveQueryTitle.waitFor({ state: 'hidden', timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    console.log(`Filter renamed and saved as "${newName}"`);
  }

  // Convenience: apply → try preferredName → handle duplicate → rename to fallbackName.
  async applyAndSaveFilterWithRename(preferredName: string, fallbackName: string): Promise<string> {
    await this.applyAndTrySaveAs(preferredName);
    if (await this.saveQueryTitle.isVisible()) {
      await this.renameSaveDialogFilterAndSave(fallbackName);
      console.log(`Filter saved as fallback name "${fallbackName}"`);
      return fallbackName;
    }
    console.log(`Filter saved as preferred name "${preferredName}"`);
    return preferredName;
  }

  // ── Filter management ──────────────────────────────────────────────────────

  // Returns the sidebar row element for a saved filter by name.
  // Uses [id="..."] not #id — CSS IDs cannot start with a digit (e.g. "2ruleFilter").
  savedFilterRow(filterName: string): Locator {
    return this.page.locator(`[id="${filterName}"]`);
  }

  async verifyAndClickSavedFilter(filterName: string): Promise<void> {
    const filterItem = this.page.getByRole('menuitem', { name: filterName });

    await expect.poll(async () => {
      return await filterItem.isVisible();
    }, {
      timeout: AuditUsersResourcesPage.LONG_TIMEOUT,
      message: `"${filterName}" should appear in the saved filters list`,
    }).toBe(true);

    console.log(`"${filterName}" found in saved filters list`);

    await filterItem.scrollIntoViewIfNeeded().catch(() => {});
    await filterItem.click();
    await Promise.race([
      this.tableRows.first().waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.LONG_TIMEOUT }),
      this.page.getByText(/no users.?resources events/i).waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.LONG_TIMEOUT }),
    ]).catch(() => {});
  }

  // Click the three-dots suffix icon to open the filter context menu.
  async clickSavedFilterMenu(filterName: string): Promise<void> {
    const filterRow  = this.savedFilterRow(filterName);
    const suffixItem = filterRow.locator('.suffix-item');
    await filterRow.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await filterRow.scrollIntoViewIfNeeded();
    await filterRow.hover();
    await this.page.waitForTimeout(400);
    // The inner SVG is the actual click target for twc-dropdown.
    const suffixSvg = suffixItem.locator('svg').first();
    await suffixSvg.waitFor({ state: 'attached', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await suffixSvg.dispatchEvent('click');
    await this.page.waitForTimeout(500);
    console.log(`Saved filter menu opened for "${filterName}"`);
  }

  // Open Edit filter for a saved filter, change the severity value, then save.
  async editSavedFilterSeverity(filterName: string, newSeverity: string): Promise<void> {
    await this.clickSavedFilterMenu(filterName);
    const editItem = this.page.getByRole('menuitem', { name: 'Edit filter' });
    await editItem.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await editItem.dispatchEvent('click');

    const dialog = this.page.getByRole('dialog');
    await dialog.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await this.page.waitForTimeout(500);

    const severities = ['TRACE', 'DEBUG', 'INFO', 'SERVICE', 'AUDIT', 'WARN', 'ERROR'];
    const severitySelect = this.page.locator('twc-select').filter({ hasText: 'AUDIT' }).last();
    await severitySelect.click({ force: true });
    await this.page.waitForTimeout(200);
    await severitySelect.locator('twc-popup svg').click();
    await this.page.waitForTimeout(200);

    // +1 because the first ArrowDown moves focus from the INPUT into the list.
    const steps = severities.indexOf(newSeverity) - severities.indexOf('AUDIT') + 1;
    for (let i = 0; i < steps; i++) {
      await this.page.keyboard.press('ArrowDown');
    }
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(300);

    await this.page.getByRole('button', { name: 'Save', exact: true }).click();
    await this.page.getByRole('button', { name: 'Save filters' }).click();
    await this.page.getByRole('dialog').waitFor({ state: 'hidden', timeout: AuditUsersResourcesPage.LONG_TIMEOUT }).catch(() => {});
    console.log(`Filter "${filterName}" severity edited to "${newSeverity}"`);
  }

  // Delete a saved filter only if it is currently visible in the list.
  async deleteFilterIfExists(filterName: string): Promise<void> {
    const filterRow = this.savedFilterRow(filterName);
    const exists = await filterRow.waitFor({ state: 'visible', timeout: 3000 }).then(() => true).catch(() => false);
    if (exists) {
      await filterRow.click();
      await this.page.waitForLoadState('networkidle');
      await this.deleteSavedFilter(filterName);
      console.log(`"${filterName}" deleted`);
    } else {
      console.log(`"${filterName}" not found — skipping`);
    }
  }

  // Delete a saved filter by name and confirm.
  async deleteSavedFilter(filterName: string): Promise<void> {
    await this.clickSavedFilterMenu(filterName);
    const deleteItem = this.page.getByRole('menuitem', { name: 'Delete filter', exact: true });
    await deleteItem.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await deleteItem.dispatchEvent('click');
    await this.page.waitForTimeout(500);
    await this.yesDeleteBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await this.yesDeleteBtn.click();
    await this.yesDeleteBtn.waitFor({ state: 'hidden', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await expect(
      this.page.getByRole('menuitem', { name: filterName, exact: true }),
      `"${filterName}" should no longer be present in the saved filters list after deletion`
    ).not.toBeVisible({ timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    console.log(`Filter "${filterName}" deleted successfully`);
  }

  // Open the delete confirmation dialog for a saved filter but click "No, cancel".
  async cancelDeleteSavedFilter(filterName: string): Promise<void> {
    await this.clickSavedFilterMenu(filterName);
    const deleteItem = this.page.getByRole('menuitem', { name: 'Delete filter', exact: true });
    await deleteItem.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.STD_TIMEOUT });
    await deleteItem.dispatchEvent('click');
    await this.noDeleteBtn.waitFor({ state: 'visible', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    await this.noDeleteBtn.click();
    await this.noDeleteBtn.waitFor({ state: 'hidden', timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    console.log(`Delete cancelled for "${filterName}" — dialog dismissed`);
  }

  // Assert that none of the given filter names appear in the saved filters list.
  async verifyFiltersNotInSavedList(filterNames: string[]): Promise<void> {
    for (const filterName of filterNames) {
      await expect(
        this.page.getByRole('menuitem', { name: filterName, exact: true }),
        `"${filterName}" should not be visible in the saved filters list after deletion`
      ).not.toBeVisible({ timeout: AuditUsersResourcesPage.SHORT_TIMEOUT });
    }
    console.log(`Verified not in saved list: [${filterNames.join(', ')}]`);
  }

  // ── Row-level verification ─────────────────────────────────────────────────

  // Scroll through the full table and assert every Severity cell equals the given value.
  async verifyAllRowsSeverityIs(severity: string): Promise<void> {
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    const headers = await utility.tableHeader(this.page);
    expect(headers, '"Severity" column must be present in filtered results').toContain("Severity");
    const severityIdx = headers.indexOf("Severity");

    const count = await this.scrollAndCheckEachRow(async (i) => {
      const cell = this.tableRows.nth(i).locator("twc-table-cell").nth(severityIdx);
      const text = (await cell.innerText()).trim();
      expect(
        text.toLowerCase(),
        `Row ${i + 1}: Severity should be "${severity.toLowerCase()}" but found "${text}"`
      ).toBe(severity.toLowerCase());
    });

    console.log(`Severity column verified — all ${count} rows contain "${severity}"`);
  }

  async verifyAllRowsSeverityIsAudit(): Promise<void> {
    await this.verifyAllRowsSeverityIs('AUDIT');
  }

  // Scroll through the full table and assert every Message ID cell contains <messageId>.
  async verifyAllRowsMessageIdEquals(messageId: string): Promise<void> {
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditUsersResourcesPage.LONG_TIMEOUT });
    const headers   = await utility.tableHeader(this.page);
    const msgHeader = headers.find(h => h.toLowerCase() === "message id");
    expect(msgHeader, '"Message ID" column must be present in filtered results').toBeTruthy();
    const msgIdx = headers.indexOf(msgHeader!);

    const count = await this.scrollAndCheckEachRow(async (i) => {
      const cell = this.tableRows.nth(i).locator("twc-table-cell").nth(msgIdx);
      const text = (await cell.innerText()).trim();
      expect(
        text,
        `Row ${i + 1}: Message ID should be "${messageId}" but found "${text}"`
      ).toContain(messageId);
    });

    console.log(`Message ID verified — all ${count} rows contain "${messageId}"`);
  }

  // Verify the empty-state message is visible and the given column names are NOT in the headers.
  async verifyEmptyStateAndColumnHeadersAbsent(
    emptyTextPattern: RegExp,
    absentColumnNames: string[]
  ): Promise<void> {
    await expect(
      this.page.getByText(emptyTextPattern),
      `Empty-state message matching ${emptyTextPattern} should be visible when filter returns zero rows`
    ).toBeVisible({ timeout: AuditUsersResourcesPage.LONG_TIMEOUT });

    const rowCount = await this.tableRows.count();
    expect(rowCount, 'Table should have zero data rows when the filter returns no results').toBe(0);

    const headerCells = this.page.locator('twc-table-head-cell');
    const headerCount = await headerCells.count();
    const visibleHeaders: string[] = [];
    for (let i = 0; i < headerCount; i++) {
      visibleHeaders.push((await headerCells.nth(i).innerText()).trim().toLowerCase());
    }
    for (const col of absentColumnNames) {
      const found = visibleHeaders.some(h => h.includes(col.toLowerCase()));
      expect(
        found,
        `Column "${col}" should NOT appear in table headers after deselection. Visible: [${visibleHeaders.join(', ')}]`
      ).toBe(false);
    }
    console.log(`Empty-state confirmed. Absent columns verified: [${absentColumnNames.join(', ')}]`);
  }

  // Verify the "Creation time" header is present and every row's Creation time is >= filterDateTime.
  async verifyAllRowsCreationTimeIsAfterOrEqual(filterDateTime: string): Promise<void> {
    const initialCount = await this.tableRows.count();
    if (initialCount === 0) {
      console.log(`No rows found for Creation time >= "${filterDateTime}" — skipping row verification`);
      return;
    }
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditUsersResourcesPage.LONG_TIMEOUT });

    const headers = await utility.tableHeader(this.page);
    const ctHeader = headers.find(h => h.toLowerCase() === "creation time");
    expect(ctHeader, '"Creation time" column must be present in filtered results').toBeTruthy();
    const ctIdx = headers.indexOf(ctHeader!);
    const filterDate = new Date(filterDateTime);

    const count = await this.scrollAndCheckEachRow(async (i) => {
      const cell    = this.tableRows.nth(i).locator("twc-table-cell").nth(ctIdx);
      const text    = (await cell.innerText()).trim();
      const rowDate = new Date(text);
      expect(
        isNaN(rowDate.getTime()) ? false : rowDate.getTime() >= filterDate.getTime(),
        `Row ${i + 1}: Creation time "${text}" should be >= "${filterDateTime}"`
      ).toBe(true);
    });

    console.log(`Creation time verified — all ${count} rows have Creation time >= "${filterDateTime}"`);
  }
}
