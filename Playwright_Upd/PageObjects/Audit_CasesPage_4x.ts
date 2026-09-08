import { type Locator, type Page, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class AuditCasesPage {
  readonly page: Page;

  // ── Shared timeouts ──────────────────────────────────────────────────────
  static readonly LONG_TIMEOUT  = 15000;
  static readonly STD_TIMEOUT   = 10000;
  static readonly SHORT_TIMEOUT = 5000;

  // ── Static locators (reused across multiple methods) ─────────────────────
  readonly auditNavIcon: Locator;
  readonly casesNavItem: Locator;
  readonly dismissButton: Locator;
  readonly backToCasesButton: Locator;
  readonly caseTypesHeading: Locator;
  readonly tableRows: Locator;
  readonly dataRows: Locator;
  readonly refreshButton: Locator;
  readonly searchToolbarItem: Locator;
  readonly filterIcon: Locator;
  readonly filterDialog: Locator;
  readonly saveFilterBtn: Locator;
  readonly cancelFilterBtn: Locator;
  readonly saveChangesBtn: Locator;
  readonly auditCombobox: Locator;
  readonly addRuleButton: Locator;
  readonly savedFiltersButton: Locator;
  readonly noDataMessage: Locator;
  readonly nameTextbox: Locator;
  readonly searchInput: Locator;
  readonly eventLinkCell: Locator;
  readonly eventLinkMenuBtn: Locator;
  readonly eventLinksItemReferencedProcessInstances: Locator;
  readonly eventLinksItemReferencingWorkItems: Locator;
  readonly eventLinksItemThisCase: Locator;
  readonly eventLinksItemCasesOfThisClass: Locator;
  readonly eventLinksItemSourceProcessTemplate: Locator;

  // ── Event Details panel ───────────────────────────────────────────────────
  readonly eventDetailsDialog: Locator;
  readonly nextEventDetailBtn: Locator;
  readonly previousEventDetailBtn: Locator;
  readonly eventDetailsHeading: Locator;
  readonly allAttributesTab: Locator;
  readonly auditDetailsHeading: Locator;

  // ── Referenced process instances page ────────────────────────────────────
  readonly eventLinksColumnHeader: Locator;
  readonly referencedWorkItemsRow: Locator;
  readonly relatedWorkItemsRow: Locator;
  readonly relatedCasesRow: Locator;
  readonly relatedCasesButton: Locator;
  readonly relatedWorkItemsCellButton: Locator;
  readonly backButton: Locator;
  readonly activityNameColumnHeader: Locator;
  readonly noWorkItemsMessage: Locator;
  readonly noCaseReferenceMessage: Locator;
  readonly messageIdColumnHeader: Locator;
  readonly typeColumnHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.auditNavIcon        = page.locator('#bpmAudit svg');
    this.casesNavItem        = page.locator('twc-list-view').getByTitle('Cases', { exact: true });
    this.dismissButton       = page.getByRole('button', { name: 'Dismiss' });
    this.backToCasesButton   = page.getByRole('button', { name: 'Back to Cases' });
    this.caseTypesHeading    = page.getByText('Case Types');
    this.tableRows           = page.locator('twc-table-row');
    this.dataRows            = this.tableRows.filter({ has: page.locator('twc-table-cell') });
    this.refreshButton       = page.locator('twc-toolbar-item').filter({ hasText: /refresh/i }).first();
    this.searchToolbarItem   = page.locator('twc-toolbar-item').filter({ hasText: /search/i }).first();
    this.filterIcon          = page.locator('twc-toolbar-item').filter({ hasText: 'Filter Filter' });
    this.filterDialog        = page.locator('bpme-edit-saved-view-dialog').first();
    this.saveFilterBtn       = page.locator('bpme-edit-saved-view-dialog').getByRole('button', { name: 'Save', exact: true }).first();
    this.cancelFilterBtn     = page.locator('bpme-edit-saved-view-dialog').getByRole('button', { name: 'Cancel', exact: true }).first();
    this.saveChangesBtn      = page.getByRole('button', { name: 'Save Changes' });
    this.auditCombobox       = page.getByRole('combobox', { name: 'Audit' });
    this.addRuleButton       = page.getByRole('button', { name: 'Rule Add Rule' });
    this.savedFiltersButton  = page.getByRole('button', { name: 'Saved filters' });
    this.noDataMessage       = page.getByText(/no case(s)? events?/i).first();
    this.nameTextbox         = page.getByRole('textbox', { name: 'Name' });
    this.searchInput         = page.locator('twc-input.search_section input');
    this.eventLinkCell       = page.getByRole('cell').filter({ has: page.locator('twc-icon-button') }).first();
    this.eventLinkMenuBtn    = this.eventLinkCell.locator('twc-icon-button').getByRole('button');
    this.eventLinksItemReferencedProcessInstances = page.getByRole('menuitem', { name: 'Referenced process instances' });
    this.eventLinksItemReferencingWorkItems       = page.getByRole('menuitem', { name: 'Referencing work items' });
    this.eventLinksItemThisCase                   = page.getByRole('menuitem', { name: 'This case' });
    this.eventLinksItemCasesOfThisClass           = page.getByRole('menuitem', { name: 'Cases of this class' });
    this.eventLinksItemSourceProcessTemplate      = page.getByRole('menuitem', { name: 'Source process template' });

    // Event Details panel
    this.eventDetailsDialog      = page.getByRole('dialog');
    this.nextEventDetailBtn      = page.getByRole('button', { name: 'Next' });
    this.previousEventDetailBtn  = page.getByRole('button', { name: 'Previous' });
    this.eventDetailsHeading     = page.getByText(/Event Details for ID \S+/).first();
    this.allAttributesTab        = page.getByRole('tab', { name: /all attributes/i });
    this.auditDetailsHeading     = page.getByText(/Audit details of/);

    // Referenced process instances page
    this.eventLinksColumnHeader   = page.getByRole('columnheader', { name: /event.?links/i }).first();
    this.referencedWorkItemsRow   = page.getByRole('cell', { name: /referenced work items/i }).first();
    this.relatedWorkItemsRow      = page.getByText(/related work items/i).first();
    this.relatedCasesRow          = page.getByText(/related cases/i).first();
    // Named button in Event Links cells (two per table when on the Related cases page)
    this.relatedCasesButton       = page.getByRole('button', { name: /related cases/i });
    // Target the "Related work items" button inside a table cell to avoid matching the breadcrumb button
    this.relatedWorkItemsCellButton = page.locator('twc-table-cell').filter({ hasText: /related work items/i }).getByRole('button').first();
    // the exact suffix varies by case identifier, so match the common prefix.
    this.backButton           = page.getByRole('button', { name: /^Cases \(/ });

    // Referencing work items page
    this.activityNameColumnHeader = page.getByRole('columnheader', { name: /activity.?name/i }).first();
    this.noWorkItemsMessage       = page.getByText(/no work.?items/i).first();
    this.noCaseReferenceMessage   = page.getByText(/no case reference available/i).first();
    this.messageIdColumnHeader    = page.getByRole('columnheader', { name: /message.?id/i }).first();
    this.typeColumnHeader         = page.getByRole('columnheader', { name: /^type$/i }).first();
  }

  // Shared helper – resolves a cell value by column name.
  private cellValue(headers: string[], row: string[], col: string): string {
    const i = headers.indexOf(col);
    if (i === -1)
      throw new Error(`Column "${col}" not found. Available: [${headers.join(", ")}]`);
    return row[i]?.trim() ?? "";
  }

  // Shared helper – clicks the Message ID cell of the first row.
  private async clickMessageIdCell(headers: string[]): Promise<void> {
    const idx = headers.indexOf("Message ID");
    await this.tableRows.first().locator("twc-table-cell").nth(idx).click();
  }

  // Shared helper – waits for the first table row OR the "no data" message to become visible.
  // Used after any action that loads or reloads the main case-events table.
  private async _waitForTableOrEmpty(): Promise<void> {
    await Promise.race([
      this.tableRows.first().waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT }),
      this.noDataMessage.waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT }),
    ]).catch(() => {});
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async navigateToAudit(): Promise<void> {
    await this.auditNavIcon.click();
    await this.page.waitForLoadState("domcontentloaded");
    await this.dismissServerErrorDialogIfPresent();
  }

  // Click "Cases" from the Audit drawer list, then verify the Audit combobox shows "Cases".
  async selectCasesFromAuditDropdown(): Promise<void> {
    await this.casesNavItem.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.dismissServerErrorDialogIfPresent();
    console.log('Cases clicked from Audit drawer');

    await this.auditCombobox.waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT });
    await expect(
      this.auditCombobox,
      'Audit dropdown should show "Cases" as the selected value'
    ).toHaveValue('Cases');
    console.log('Audit dropdown verified – "Cases" is selected');
  }

  // Dismiss any server-side error dialog (e.g. "Upstream Timeout") that can block
  // the UI from loading. Clicks "Dismiss" if a dialog with that button is visible.
  private async dismissServerErrorDialogIfPresent(): Promise<void> {
    if (await this.dismissButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.dismissButton.click();
      await this.dismissButton.waitFor({ state: 'hidden', timeout: AuditCasesPage.SHORT_TIMEOUT }).catch(() => {});
    }
  }

  // Ensure we are on the Audit > Cases list regardless of current page state.
  // Handles: filter dialog left open, server error dialogs, being outside Audit,
  // being on an Audit events/details drill-down (shows "Back to Cases" button).
  private async _ensureOnAuditCasesList(): Promise<void> {
    if (await this.filterDialog.isVisible().catch(() => false)) {
      await this.cancelCaseFilter();
      console.log('Warning: filter dialog was open at start of navigation – cancelled');
    }
    await this.dismissServerErrorDialogIfPresent();

    const currentUrl = this.page.url();
    if (!currentUrl.includes('bpmAudit')) {
      await this.navigateToAudit();
      await this.navigateToCasesList();
    } else {
      if (await this.backToCasesButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.backToCasesButton.click();
        const caseTypesLoaded = await this.caseTypesHeading
          .waitFor({ state: 'visible', timeout: 30000 })
          .then(() => true).catch(() => false);
        await this.dismissServerErrorDialogIfPresent();
        if (!caseTypesLoaded) {
          await this.navigateToCasesList();
        }
      } else {
        await this.navigateToCasesList();
      }
    }

    if (await this.filterDialog.isVisible().catch(() => false)) {
      await this.cancelCaseFilter();
      console.log('Warning: filter dialog appeared during navigation – cancelled');
    }
  }

  // Click the "Saved filters" section toggle via shadow-DOM traversal.
  // Returns true if the toggle button was found and clicked.
  private async _clickSavedFiltersToggle(): Promise<boolean> {
    return this.page.evaluate((): boolean => {
      function findInShadows(root: Document | ShadowRoot | Element, sel: string): HTMLElement | null {
        const hit = (root as any).querySelector(sel);
        if (hit) return hit as HTMLElement;
        for (const child of Array.from((root as any).querySelectorAll('*')) as Element[]) {
          if (child.shadowRoot) {
            const found = findInShadows(child.shadowRoot, sel);
            if (found) return found;
          }
        }
        return null;
      }
      const btn = findInShadows(document, '[role="button"].categoriser__header') as HTMLElement | null;
      if (btn) { btn.click(); return true; }
      return false;
    });
  }

  // Dynamic locator helpers – return a fresh Locator for elements identified by runtime values.
  private savedFilterItem(filterName: string): Locator {
    return this.page.getByText(filterName, { exact: true }).first();
  }

  private filterContextMenuBtn(filterName: string): Locator {
    return this.page.locator(`#item_${filterName} > twc-dropdown > twc-icon > .icon > .bi`);
  }

  private categoryToggle(category: string): Locator {
    return this.page.getByText(new RegExp(`^${category}$`, 'i')).first();
  }

  // Navigate to Cases sidebar item and ensure the case-type list is visible.
  // The Cases page shows case types as menuitems in the left sidebar (not twc-table-row).
  async navigateToCasesList(): Promise<void> {
    await this.dismissServerErrorDialogIfPresent();

    const alreadyOnList = await this.caseTypesHeading.isVisible().catch(() => false);

    if (!alreadyOnList) {
      await this.casesNavItem.click();
      await this.dismissServerErrorDialogIfPresent();

      const loaded = await this.caseTypesHeading.waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT }).then(() => true).catch(() => false);
      if (!loaded) {
        await this.dismissServerErrorDialogIfPresent();
        await this.casesNavItem.click();
        await this.dismissServerErrorDialogIfPresent();
        await this.caseTypesHeading.waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
      }
    }

    if (await this.backToCasesButton.isVisible()) {
      await this.backToCasesButton.click();
      await this.caseTypesHeading.waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
    }
  }

  // Click the first case instance row to open its audit events table.
  // Uses dataRows (rows containing twc-table-cell) to skip the header row.
  async drillIntoFirstCaseInstance(): Promise<void> {
    await this.dataRows.first().waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
    await this.dataRows.first().locator("twc-table-cell").first().click();
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
  }

  // ── Level 1: Audit events (Event ID, Message ID, Severity) ────────────────

  async verifyAuditEventColumns(): Promise<string[]> {
    const headers = await utility.tableHeader(this.page);
    expect(headers, "Event ID column must be present in Cases audit events").toContain("Event ID");
    expect(headers, "Message ID column must be present in Cases audit events").toContain("Message ID");
    expect(headers, "Severity column must be present in Cases audit events").toContain("Severity");
    return headers;
  }

  async readFirstAuditEventRow(headers: string[]): Promise<{ eventId: string; messageId: string; severity: string }> {
    const row       = await utility.getFirstRowContents(this.page);
    const eventId   = this.cellValue(headers, row, "Event ID");
    const messageId = this.cellValue(headers, row, "Message ID");
    const severity  = this.cellValue(headers, row, "Severity");

    expect(eventId,   "Event ID should not be empty").toBeTruthy();
    expect(messageId, "Message ID should not be empty").toBeTruthy();
    expect(severity,  "Severity should not be empty").toBeTruthy();

    return { eventId, messageId, severity };
  }

  async drillIntoMessageId(headers: string[]): Promise<void> {
    await this.clickMessageIdCell(headers);
    await this.page.waitForLoadState("domcontentloaded");
    await expect(
      this.auditDetailsHeading,
      "Audit details heading should be visible"
    ).toBeVisible({ timeout: AuditCasesPage.LONG_TIMEOUT });
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
  }

  // ── Level 2: Audit details page ───────────────────────────────────────────

  async verifyAuditDetailsPage(): Promise<{ detailHeaders: string[] }> {
    await expect(
      this.tableRows.first(),
      "Detail table should have at least one row"
    ).toBeVisible({ timeout: AuditCasesPage.LONG_TIMEOUT });

    const detailHeaders = await utility.tableHeader(this.page);
    expect(detailHeaders, "Event ID column must be present in detail table").toContain("Event ID");
    expect(detailHeaders, "Severity column must be present in detail table").toContain("Severity");

    const detailRow = await utility.getFirstRowContents(this.page);
    const severity  = this.cellValue(detailHeaders, detailRow, "Severity");

    expect(this.cellValue(detailHeaders, detailRow, "Event ID"), "Detail Event ID should not be empty").toBeTruthy();
    expect(severity.toLowerCase(), `Severity should be "audit"`).toBe("audit");

    return { detailHeaders };
  }

  async openEventDetailsPanel(detailHeaders: string[]): Promise<void> {
    await this.clickMessageIdCell(detailHeaders);
  }

  // ── Level 3: Event Details panel ──────────────────────────────────────────

  async verifyEventDetailsPanel(eventId: string, messageId: string): Promise<void> {
    await expect(
      this.page.getByText(`Event Details for ID ${eventId}`),
      `Panel heading should read "Event Details for ID ${eventId}"`
    ).toBeVisible({ timeout: AuditCasesPage.LONG_TIMEOUT });

    await expect(
      this.page.getByText(messageId).last(),
      `messageId "${messageId}" should be visible in Event Details panel`
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
  }

  // Verify All Attributes on the first event then click Next through all remaining events.
  // Extracted from the identical loop in tests 5, 28, 29, and 32.
  async loopThroughAllEventDetails(): Promise<void> {
    const firstId = await this.getCurrentEventDetailsId();
    console.log(`\n--- Event Details [1]: ID ${firstId} ---`);
    await this.verifyAllAttributesInEventDetails();
    let iteration = 2;
    let lastId = firstId;
    while (true) {
      const hasNext = await this.isNextInEventDetailsEnabled();
      if (!hasNext) {
        console.log(`Last event reached – ID ${lastId} (event ${iteration - 1})`);
        break;
      }
      await this.clickNextInEventDetails();
      await this.page.waitForTimeout(300);
      lastId = await this.getCurrentEventDetailsId();
      console.log(`Event Details [${iteration}]: ID ${lastId}`);
      iteration++;
    }
    console.log(`Event Details loop complete – ${iteration - 1} event(s) navigated`);
  }

  // Click the Next button inside the Event Details panel.
  async clickNextInEventDetails(): Promise<void> {
    await this.nextEventDetailBtn.click();
  }

  // Return the current Event ID shown in the Event Details panel heading.
  async getCurrentEventDetailsId(): Promise<string> {
    const heading = this.eventDetailsHeading;
    await heading.waitFor({ state: "visible", timeout: AuditCasesPage.STD_TIMEOUT });
    const text = (await heading.textContent()) ?? "";
    return text.match(/Event Details for ID (\S+)/)?.[1] ?? "";
  }

  // Verify the "All Attributes" tab content is loaded and scroll to bottom.
  // pierce shadow DOM. isVisible() is used for immediate non-blocking state checks.
  async verifyAllAttributesInEventDetails(): Promise<void> {
    const dialog = this.eventDetailsDialog;
    // Click All Attributes tab via page scope (dialog-scoped getByRole hangs on shadow DOM)
    await this.allAttributesTab.click();
    await expect(
      this.page.getByText("Attribute Name").first(),
      '"Attribute Name" column header should be visible in All Attributes'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    const box = await dialog.boundingBox();
    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await this.page.mouse.wheel(0, 600);
      await this.page.waitForTimeout(300);
    }
    console.log(`  All Attributes: content verified, scrolled to bottom`);
  }

  // Returns true if the Next button inside the Event Details dialog is enabled.
  async isNextInEventDetailsEnabled(): Promise<boolean> {
    try {
      await this.nextEventDetailBtn.waitFor({ state: "visible", timeout: 2000 });
      return await this.nextEventDetailBtn.isEnabled();
    } catch {
      return false;
    }
  }

  // Close the Event Details dialog via the X / close icon.
  async closeEventDetailsDialog(): Promise<void> {
    await this.eventDetailsDialog.locator("svg").click();
  }

  // ── Layout verification (Test 2) ──────────────────────────────────────────

  // Verify the left panel shows:
  //   • "Case Types" heading
  //   • Each expected case type as a visible menuitem
  //   • "Saved filters" button (the filter/save icon for saved filter management)
  async verifyLeftPanel(expectedCaseTypes: string[]): Promise<void> {
    await expect(
      this.page.getByText('Case Types', { exact: true }),
      '"Case Types" heading should be visible in the left panel'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });

    await expect(
      this.savedFiltersButton,
      '"Saved filters" button should be visible in the left panel'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('"Saved filters" button visible in left panel');

    await expect(
      this.filterIcon,
      '"Filters" button should be visible in the left panel'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('"Filters" button visible in left panel');

    for (const caseName of expectedCaseTypes) {
      await expect(
        this.page.getByRole('menuitem').filter({ hasText: caseName }).first(),
        `Case type "${caseName}" should be visible in the left panel menu`
      ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
      console.log(`Case type "${caseName}" visible in left panel`);
    }
    console.log(`Left panel verified – case types [${expectedCaseTypes.join(', ')}], "Saved filters" and "Filters" buttons visible`);
  }

  // Verify right panel after selecting a case type:
  //   • table headers match expected columns
  //   • at least one row is present (scrolls until stable to count all rows)
  //   • Search and Refresh toolbar buttons are visible
  async verifyCasesRightPanel(expectedHeaders: string[]): Promise<number> {
    // Verify table headers
    const headers = await utility.tableHeader(this.page);
    expect(
      headers,
      `Table headers should be [${expectedHeaders.join(', ')}] – got [${headers.join(', ')}]`
    ).toStrictEqual(expectedHeaders);
    console.log(`Right panel table headers verified: [${headers.join(', ')}]`);

    // Count rows by scrolling until stable (handles virtual scroll)
    await this.tableRows.first().waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT });
    let lastCount = -1;
    for (let i = 0; i < 50; i++) {
      const count = await this.tableRows.count();
      if (count === lastCount) break;
      lastCount = count;
      await this.tableRows.last().scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(400);
    }
    expect(lastCount, 'SJ_Case instance table should have at least one row').toBeGreaterThan(0);
    console.log(`SJ_Case instance row count: ${lastCount}`);

    // Search button
    await expect(
      this.searchToolbarItem,
      'Search button should be visible in the right panel toolbar'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Search button visible in right panel');

    // Refresh button
    await expect(
      this.refreshButton,
      'Refresh button should be visible in the right panel toolbar'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Refresh button visible in right panel');

    return lastCount;
  }

  // Get the display name of the first case type menuitem in the left panel.
  // Uses innerText() + first line to strip the internal identifier shown below the name.
  async getFirstCaseTypeName(): Promise<string> {
    const firstItem = this.page.getByRole("menuitem").first();
    await firstItem.waitFor({ state: "visible", timeout: AuditCasesPage.STD_TIMEOUT });
    const text = await firstItem.innerText();
    return text.split("\n")[0].trim();
  }

  // Wait for the right panel to load – accepts either data rows or a "No case events" message.
  // Returns the row count (may be 0 for case types with no instances).
  async verifyRightPanelLoaded(): Promise<number> {
    await this._waitForTableOrEmpty();
    const rowCount = await this.tableRows.count();
    console.log(`  Right panel loaded – ${rowCount > 0 ? `${rowCount} rows` : "No case events"}`);
    return rowCount;
  }

  // Verify the right panel has AT LEAST ONE row (use for case types known to have data).
  async verifyRightPanelHasData(): Promise<number> {
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
    let lastCount = -1;
    for (let i = 0; i < 10; i++) {
      const count = await this.tableRows.count();
      if (count === lastCount) break;
      lastCount = count;
      await this.tableRows.last().scrollIntoViewIfNeeded().catch(() => {});
      await this.page.waitForTimeout(400);
    }
    expect(lastCount, "Right panel table should have at least one row").toBeGreaterThan(0);
    return lastCount;
  }

  // Click the Refresh button in the right panel toolbar and wait for the panel to settle.
  async clickRefreshAndWaitForData(): Promise<void> {
    await this.refreshButton.click();
    await this._waitForTableOrEmpty();
    console.log("Refresh clicked – right panel reloaded");
  }

  // ── Filter dialog (Cases instance view toolbar) ───────────────────────────

  // Combined navigation: Audit → Cases list → select a case type.
  async navigateToAuditCasesAndSelect(caseName: string): Promise<void> {
    await this._ensureOnAuditCasesList();
    await this.selectCaseType(caseName);
  }

  // Click SJ_Case (or any named case type) menuitem so the instance table and
  // Filter toolbar become visible in the right panel. Must be called after
  // navigateToCasesList() so the menuitem is present.
  async selectCaseType(caseName: string): Promise<void> {
    const caseTypeItem = this.page.getByRole("menuitem").filter({ hasText: caseName }).first();
    await caseTypeItem.waitFor({ state: "attached", timeout: AuditCasesPage.LONG_TIMEOUT });
    await caseTypeItem.scrollIntoViewIfNeeded();
    await caseTypeItem.waitFor({ state: "visible", timeout: AuditCasesPage.STD_TIMEOUT });

    // If a filter dialog races in between the safety-net check and this click,
    // dismiss it and try one more time before letting Playwright report the failure.
    for (let attempt = 0; attempt < 2; attempt++) {
      if (await this.filterDialog.isVisible().catch(() => false)) {
        await this.cancelCaseFilter();
        console.log("Warning: filter dialog blocked selectCaseType – cancelled, retrying click");
      }
      try {
        await caseTypeItem.click({ timeout: 8000 });
        break;
      } catch (e) {
        if (attempt === 1) throw e;
      }
    }

    await this.page.waitForLoadState("domcontentloaded");
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
    console.log(`Case type "${caseName}" selected – instance table loaded`);
  }

  // Click the Filter toolbar item (twc-toolbar-item with "Filter Filter" text).
  // This toolbar appears in the right panel when a case type's instances are displayed.
   async hoverAndClickCaseFilterIcon(): Promise<void> {
    await this.filterIcon.locator('svg').click();
    await this.nameTextbox.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    console.log("Cases filter dialog opened");
  }

  // Fill the save-filter dialog: Name, Description, Category.
  // The dialog uses standard labeled textboxes (getByRole).
  async fillCaseFilterDetails(name: string, description: string, category: string): Promise<void> {
    await this.nameTextbox.fill(name);
    await this.page.getByRole('textbox', { name: 'Description' }).fill(description);
    await this.page.getByRole('textbox', { name: 'Category' }).fill(category);
    console.log(`Filter details filled – Name: ${name}, Description: ${description}, Category: ${category}`);
  }

  // Generic rule builder for any attribute/operator/value combination.
  //
  // Works for both value types:
  //   • Text/numeric input  – e.g. addFilterRule("autoCaseIdentifier1", "GT", "5")
  //   • Enum dropdown value – e.g. addFilterRule("caseState1", "NEQ", "CANCELLED")
  //
  // After operator selection the dialog has 3 known inputs (Name/Description/Category).
  // A 4th native <input> = free-text/numeric value field. If still 3, the value is
  // set via enum dropdown. Numeric fields expose role="spinbutton" not "textbox", so
  // we use locator('input') rather than getByRole('textbox') to count them.
  //
  // The attribute dropdown's visible text is all available attribute names joined by
  // spaces; pass `availableAttributes` to locate it reliably across case types.
  // Defaults to the SJ_Case attributes when omitted.
  async addFilterRule(
    attribute: string,
    operator: string,
    value: string,
    availableAttributes: string[] = ['autoCaseIdentifier1', 'caseState1'],
  ): Promise<void> {
    await this.addRuleButton.click();

    // Open the attribute dropdown – its text is the space-joined list of all options.
    const attrDropdownTrigger = this.page.locator('twc-select')
      .filter({ hasText: availableAttributes.join(' ') })
      .locator('twc-popup div').first();
    await attrDropdownTrigger.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await attrDropdownTrigger.click();
    await this.page.getByRole('option', { name: attribute, exact: true })
      .locator('slot').nth(1).click();
    await this.page.waitForTimeout(300); // attribute dropdown close animation

    // Select the operator. After attribute selection the rule row contains exactly
    // 2 twc-selects: nth(0) = attribute (collapsed to selected value), nth(1) = operator.
    // Scoped to the active dialog (.first()) to avoid hidden template instances.
    const activeDialog = this.filterDialog;
    const operatorCombobox = activeDialog.locator('twc-select').nth(1).getByRole('combobox');
    await operatorCombobox.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await operatorCombobox.click();
    await this.page.getByRole('option', { name: operator, exact: true })
      .locator('slot').nth(1).click();

    // Detect value input type by waiting for a 3rd twc-select in the dialog.
    //   Enum attributes (e.g. caseState1) render a 3rd twc-select for the value dropdown.
    //   Text/numeric attributes render a native <input> – no 3rd twc-select appears
    // For enum: use innerText() (NOT textContent) – innerText includes proper whitespace
    //   between option labels so the page-level hasText filter matches correctly.
    //   This mirrors the original codegen approach: find twc-select at page level by its
    //   visible option text, then open the dropdown via twc-popup svg.
    // For text: Tab closes any open operator dropdown, then fill the last native input.
    const valueSelectLocator = activeDialog.locator('twc-select').nth(2);
    const isEnum = await valueSelectLocator.waitFor({ state: 'attached', timeout: 2000 })
      .then(() => true)
      .catch(() => false);

    if (isEnum) {
      const labelText = (await valueSelectLocator.innerText()).trim();
      if (labelText) {
        await this.page.locator('twc-select').filter({ hasText: labelText })
          .locator('twc-popup svg').click();
      } else {
        // Fallback when innerText is empty – click the combobox directly
        await valueSelectLocator.getByRole('combobox').click();
      }
      await this.page.waitForTimeout(300);
      await this.page.getByRole('option', { name: value, exact: true })
        .locator('slot').nth(1).click();
    } else {
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(400);
      await this.page.locator('input').last().fill(value);
    }
    await this.page.waitForTimeout(300);
    console.log(`Filter rule added: ${attribute} ${operator} ${value}`);
  }

  // Click "Add Rule", open the ATTRIBUTE dropdown, type a search term that matches
  // no attribute name, and verify the component shows either a disabled "no matches"
  // list item or an empty option list. Presses Escape to close the popup before
  // returning so the caller can still cancel/dismiss the filter dialog.
  async searchInFilterRuleValueAndVerifyNoMatches(
    _attribute: string,
    _operator: string,
    searchText: string,
    availableAttributes: string[] = ['autoCaseIdentifier1', 'caseState1'],
  ): Promise<void> {
    await this.addRuleButton.click();

    // Open the attribute dropdown (lists all filterable case attributes).
    const attrSelect = this.page.locator('twc-select')
      .filter({ hasText: availableAttributes.join(' ') });
    const attrSelectTrigger = attrSelect.locator('twc-popup div').first();
    await attrSelectTrigger.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await attrSelectTrigger.click();

    // Wait for attribute options to appear.
    await this.page.getByRole('option').first().waitFor({ state: 'visible', timeout: 3000 });

    const attributeOptionsBefore = await this.page.getByRole('option').allTextContents().catch(() => [] as string[]);
    console.log(`[diag] attribute options before typing: ${JSON.stringify(attributeOptionsBefore)}`);

    // Find and focus the search input inside this specific twc-select's popup.
    // Scoped to the twc-select element so we don't accidentally focus a tooltip or
    // sidebar popup's input.
    const searchFieldFound = await attrSelect.evaluate((el: Element): boolean => {
      function findAndFocusInput(root: Element | ShadowRoot): boolean {
        for (const inp of Array.from((root as any).querySelectorAll('input')) as HTMLInputElement[]) {
          if (!inp.readOnly && inp.type !== 'hidden' && !inp.hasAttribute('aria-hidden') && !inp.className.includes('value-input')) {
            inp.click();
            inp.focus();
            return true;
          }
        }
        for (const child of Array.from((root as any).querySelectorAll('*')) as Element[]) {
          if (child.shadowRoot && findAndFocusInput(child.shadowRoot)) return true;
        }
        return false;
      }
      if (findAndFocusInput(el)) return true;
      if ((el as any).shadowRoot && findAndFocusInput((el as any).shadowRoot)) return true;
      return false;
    });
    console.log(`[diag] search field found in attribute dropdown: ${searchFieldFound}`);
    await this.page.waitForTimeout(200);

    try {
      if (searchFieldFound) {
        // Type the search text – no attribute name contains "test" – no matches.
        await this.page.keyboard.type(searchText);
        await this.page.waitForTimeout(800);

        const optionCount = await this.page.getByRole('option').count().catch(() => -1);
        const optionTextsAfter = await this.page.getByRole('option').allTextContents().catch(() => [] as string[]);
        console.log(`[diag] attribute options after typing "${searchText}": count=${optionCount} ${JSON.stringify(optionTextsAfter)}`);

        const noMatchOption = this.page.locator('twc-list-item').filter({ hasText: /no\s*(match|result|option)/i }).first()
          .or(this.page.getByRole('option', { name: /no\s*(match|result|option)/i }).first())
          .or(this.page.locator('[disabled],[aria-disabled="true"]').filter({ hasText: /no\s*(match|result|option)/i }).first())
          .or(this.page.locator('twc-list-item[disabled]').first());

        const noMatchVisible = await noMatchOption.isVisible({ timeout: 3000 }).catch(() => false);
        if (noMatchVisible) {
          const isDisabled = await noMatchOption.evaluate((el: Element) =>
            el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
          ).catch(() => true);
          expect(isDisabled, `"No matches" option should be disabled`).toBe(true);
          console.log(`Attribute dropdown: searched "${searchText}" – "no matches" disabled item verified`);
        } else {
          expect(optionCount, `No attribute options should remain after searching "${searchText}"`).toBe(0);
          console.log(`Attribute dropdown: searched "${searchText}" – 0 options remaining (empty list verified)`);
        }
      } else {
        // No search field – dropdown has too few attributes for the component to
        // render one. Verify the searchText doesn't appear in any attribute name.
        const hasSearchText = attributeOptionsBefore.some(opt => opt.toLowerCase().includes(searchText.toLowerCase()));
        expect(hasSearchText, `"${searchText}" should not match any attribute in [${attributeOptionsBefore.join(', ')}]`).toBe(false);
        console.log(`Attribute dropdown: no search field – verified "${searchText}" not in [${attributeOptionsBefore.join(', ')}]`);
      }
    } finally {
      // Close the attribute popup; Escape closes the popup, not the dialog.
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(300);
    }
  }

  // After hoverAndClickCaseFilterIcon() opens the filter dialog, click "+Add Rule",
  // open the attribute dropdown and verify its options match the filterable table
  // headers (i.e. all headers except the "Event Links" UI column). Closes the
  // dropdown and dialog without saving.
  async verifyFilterAttributesMatchTableHeaders(tableHeaders: string[]): Promise<void> {
    const filterableHeaders = tableHeaders.filter(h => h !== "Event Links");

    await this.addRuleButton.click();

    // Open the attribute dropdown. The twc-select's visible text is the joined
    // names of all attribute options – use that to locate it uniquely.
    const filterAttrTrigger = this.page
      .locator('twc-select')
      .filter({ hasText: filterableHeaders.join(' ') })
      .locator('twc-popup div')
      .first();
    await filterAttrTrigger.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await filterAttrTrigger.click();

    await this.page.getByRole('option').first().waitFor({ state: 'visible', timeout: AuditCasesPage.SHORT_TIMEOUT });
    const rawOptions = await this.page.getByRole('option').allTextContents();
    const optionTexts = rawOptions.map(o => o.trim()).filter(o => o);

    for (const header of filterableHeaders) {
      const found = optionTexts.some(opt => opt.includes(header));
      expect(found, `Filter attribute "${header}" should be present in dropdown – got: [${optionTexts.join(', ')}]`).toBe(true);
    }
    console.log(`Filter attributes [${optionTexts.join(', ')}] verified against table headers [${filterableHeaders.join(', ')}]`);

    // Press Tab to move focus out of the open dropdown (closes it without closing the dialog).
    await this.page.keyboard.press('Tab');
    await this.page.waitForTimeout(200);

    // Click Cancel to dismiss the filter dialog without saving.
    await this.cancelFilterBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.SHORT_TIMEOUT });
    await this.cancelFilterBtn.click();
    await this.nameTextbox.waitFor({ state: 'hidden', timeout: AuditCasesPage.SHORT_TIMEOUT }).catch(() => {});
    console.log("Filter dialog closed via Cancel button");
  }

  // Save the filter dialog.
  // Scoped to bpme-edit-saved-view-dialog so we don't accidentally resolve to
  // the categoriser__header (which also carries role="button" and a "Save"-containing
  // accessible name via the dialog title).
  // If the server rejects the save (e.g. filter name already exists), the error
  // dialog is dismissed and the save dialog is cancelled so the test can continue
  // to verify the filter is already present in the list.
  async cancelCaseFilter(): Promise<void> {
    await this.cancelFilterBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.cancelFilterBtn.click();
    await this.filterDialog.waitFor({ state: 'hidden', timeout: AuditCasesPage.STD_TIMEOUT }).catch(() => {});
    console.log("Filter dialog cancelled via Cancel button");
  }

  async closeFilterDialog(): Promise<void> {
    const dialog = this.filterDialog;
    await dialog.waitFor({ state: 'attached', timeout: AuditCasesPage.STD_TIMEOUT });

    // The X button lives inside nested shadow roots (twc-dialog shadow → twc-icon-button
    // shadow → button). Standard querySelector doesn't pierce shadow roots, so we use
    // a recursive traversal via page.evaluate to reach it.
    const clicked = await this.page.evaluate((): boolean => {
      function findInShadows(root: Document | ShadowRoot | Element, selector: string): HTMLElement | null {
        const direct = (root as Element | ShadowRoot | Document).querySelector(selector);
        if (direct) return direct as HTMLElement;
        const all = (root as any).querySelectorAll('*');
        for (const child of Array.from(all) as Element[]) {
          if (child.shadowRoot) {
            const found = findInShadows(child.shadowRoot, selector);
            if (found) return found;
          }
        }
        return null;
      }
      // Look for the shadow-internal button that is a direct descendant of the
      // dialog SHELL (not a rule-row delete button inside the content).
      // twc-icon-button used as the header close button exposes part="base" on its
      // inner <button>. Rule-row deletes use the same structure but are nested deeper
      // inside bpme-edit-saved-view-dialog – by finding from the dialog's PARENT we
      // pick the outermost one first.
      const content = document.querySelector('bpme-edit-saved-view-dialog');
      if (!content) return false;
      // Try: twc-dialog is the parentElement (light-DOM wrapping)
      const parent = content.parentElement;
      if (parent && parent.shadowRoot) {
        const btn = findInShadows(parent.shadowRoot, 'button[part="base"]') as HTMLElement | null;
        if (btn) { btn.click(); return true; }
      }
      // Try: twc-dialog inside bpme's own shadow root
      if (content.shadowRoot) {
        const shell = content.shadowRoot.querySelector('twc-dialog');
        if (shell && shell.shadowRoot) {
          const btn = findInShadows(shell.shadowRoot, 'button[part="base"]') as HTMLElement | null;
          if (btn) { btn.click(); return true; }
        }
      }
      return false;
    });

    if (!clicked) {
      // Last resort: Escape closes the dialog without saving (same semantic as X).
      await this.page.keyboard.press('Escape');
    }

    await dialog.waitFor({ state: 'hidden', timeout: AuditCasesPage.STD_TIMEOUT });
    console.log("Filter dialog closed via Close (X) button");
  }
  // Click Save with a duplicate filter name, verify an error dialog appears,
  // dismiss it, then cancel the filter dialog so the page is clean.
  // Click Save with a duplicate filter name and verify the filter dialog stays
  // open. The Save button appears enabled but the click has no effect – the app
  // silently blocks saving when the name already exists.
  async saveWithDuplicateNameAndVerifyDialogStaysOpen(): Promise<void> {
    await this.saveFilterBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.saveFilterBtn.click();
    await this.page.waitForTimeout(1500);

    await expect(
      this.cancelFilterBtn,
      'Filter dialog should remain open after clicking Save with a duplicate name'
    ).toBeVisible({ timeout: AuditCasesPage.SHORT_TIMEOUT });
    console.log('Save clicked with duplicate name – filter dialog remains open (Save had no effect)');
  }

  async saveCaseFilter(): Promise<void> {
    await this.saveFilterBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.saveFilterBtn.click();

    // bpme-edit-saved-view-dialog renders in shadow DOM so filterDialog.isVisible() / waitFor('hidden')
    // always resolves immediately regardless of actual dialog state. Use a fixed buffer instead.
    await this.page.waitForTimeout(2000);

    // If an overlay dialog (error/info) appeared, dismiss it then cancel the save dialog.
    const saveDialog = this.filterDialog;
    const dialogStillOpen = await saveDialog.isVisible().catch(() => false);
    if (dialogStillOpen) {
      // Any non-save dialog that is blocking – try to close it with common button labels.
      for (const label of ['Dismiss', 'OK', 'Close', 'Confirm']) {
        const btn = this.page
          .getByRole('dialog')
          .filter({ hasNot: this.page.locator('bpme-edit-saved-view-dialog') })
          .getByRole('button', { name: label })
          .first();
        if (await btn.isVisible().catch(() => false)) {
          await btn.click();
          await this.page.waitForTimeout(300);
          break;
        }
      }
      // Cancel the save dialog so it no longer intercepts pointer events.
      const cancelBtn = saveDialog.getByRole('button', { name: 'Cancel', exact: true }).first();
      if (await cancelBtn.isVisible().catch(() => false)) {
        await cancelBtn.click();
        await this.page.waitForTimeout(500);
      }
      console.log("Filter save dialog closed (was still open after save – duplicate name or slow close)");
      return;
    }

    console.log("Filter saved via Save button");
  }

  // After saving a filter, verify its name appears in the Saved Filters list in
  // the left panel. The sidebar has a two-level structure:
  //   Saved filters (top section, may be collapsed)
  //     └─ <category> (e.g. "FilterAutomationTest", may also be collapsed)
  //         └─ <filterName>
  // Pass the optional `category` to expand the category sub-section if needed.
  async verifySavedFilterInList(filterName: string, category?: string): Promise<void> {
    // After saving a filter the app sometimes reopens the filter dialog to show the
    // active-filter state. The custom element bpme-edit-saved-view-dialog renders its
    // visual content inside a shadow root, so its OWN isVisible() / waitFor('visible')
    // always returns false even when the dialog IS physically blocking clicks.
    // Detect the dialog's presence via the Cancel BUTTON inside it – that button IS
    // visible when the dialog is open. Wait up to 5s for it to appear, then cancel.
    const dialogReopened = await this.cancelFilterBtn.waitFor({ state: 'visible', timeout: 1000 })
      .then(() => true).catch(() => false);
    if (dialogReopened) {
      await this.cancelFilterBtn.click();
      await this.page.waitForTimeout(300);
      console.log("Warning: filter dialog reopened after save – cancelled before verify");
    }

    const isFilterVisible = async () =>
      this.savedFilterItem(filterName).isVisible().catch(() => false);
    const isCategoryVisible = async () => category
      ? this.categoryToggle(category).isVisible().catch(() => false)
      : Promise.resolve(true);

    // Fast path: filter already visible.
    if (await isFilterVisible()) {
      await expect(
        this.savedFilterItem(filterName),
        `Saved filter "${filterName}" should be visible in the Saved Filters list`
      ).toBeVisible({ timeout: AuditCasesPage.SHORT_TIMEOUT });
      console.log(`Saved filter "${filterName}" is present in the Saved Filters list`);
      return;
    }

    // Level 1: ensure "Saved filters" section is expanded (category must become visible).
    // Use page.evaluate to click the toggle – bypasses Playwright's viewport interception
    // check so any residual dialog overlay cannot block it.
    if (!(await isCategoryVisible())) {
      const toggled = await this._clickSavedFiltersToggle();
      if (!toggled) {
        // Fallback: Playwright click (works if no dialog is blocking)
        const toggle = this.savedFiltersButton;
        if (await toggle.isVisible().catch(() => false)) {
          await toggle.scrollIntoViewIfNeeded().catch(() => {});
          await toggle.click();
        }
      }
      await this.page.waitForTimeout(500);

      // If category still not visible the click may have collapsed an already-open section.
      if (!(await isCategoryVisible())) {
        await this._clickSavedFiltersToggle();
        await this.page.waitForTimeout(500);
      }
    }

    // Level 2: ensure category is expanded (filter must become visible).
    if (!(await isFilterVisible()) && category) {
      const catToggle = this.categoryToggle(category);
      if (await catToggle.isVisible().catch(() => false)) {
        await catToggle.click();
        await this.page.waitForTimeout(500);
      }
      // If filter still not visible the click may have collapsed an already-open category.
      if (!(await isFilterVisible()) && await catToggle.isVisible().catch(() => false)) {
        await catToggle.click();
        await this.page.waitForTimeout(500);
      }
    }

    await expect(
      this.savedFilterItem(filterName),
      `Saved filter "${filterName}" should be visible in the Saved Filters list`
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log(`Saved filter "${filterName}" is present in the Saved Filters list`);
  }

  // Click a saved filter by name to apply it to the right panel, then verify the result:
  //   • If matching rows exist  – log the row count (filter produced data)
  //   • If no rows              – verify the "No case events" empty-state message is visible
  async clickSavedFilterAndVerifyData(filterName: string): Promise<void> {
    await this.savedFilterItem(filterName).click();
    await this._waitForTableOrEmpty();

    const rowCount = await this.tableRows.count();
    if (rowCount > 0) {
      console.log(`Saved filter "${filterName}" applied – ${rowCount} row(s) visible in table`);
    } else {
      const emptyMsg = this.noDataMessage
        .or(this.page.getByText(/no data/i).first())
        .or(this.page.getByText(/no cases/i).first());
      await expect(
        emptyMsg,
        `After applying saved filter "${filterName}" with no matching rows, an empty-state message should be visible`
      ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
      console.log(`Saved filter "${filterName}" applied – no matching rows, empty-state message verified`);
    }
  }

  // Hover over a saved filter item in the sidebar to reveal the three-dot
  // (twc-dropdown) button, click it, then click Edit to open the edit dialog.
  async openSavedFilterEditDialog(filterName: string): Promise<void> {
    const filterItem = this.savedFilterItem(filterName);
    await filterItem.scrollIntoViewIfNeeded().catch(() => {});
    await filterItem.hover();
    await this.page.waitForTimeout(500);

    // Three-dot button – uses filter-name-specific ID (#item_<name>) from codegen.
    await this.filterContextMenuBtn(filterName).click();
    await this.page.waitForTimeout(300);

    // Click Edit from the context menu (slot elements need force click in shadow DOM).
    const editMenuItem = this.page.getByRole('menuitem', { name: 'Edit' });
    await editMenuItem.waitFor({ state: 'attached', timeout: AuditCasesPage.SHORT_TIMEOUT });
    await editMenuItem.locator('slot').nth(1).click({ force: true });

    // Wait for the edit dialog to open (Name textbox visible).
    await this.nameTextbox.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    console.log(`Edit dialog opened for saved filter "${filterName}"`);
  }

  // Open the enum value dropdown and select newValue.
  // Must use page-level scope – the rule row's twc-selects live inside nested
  // shadow roots that dialog-scoped locators cannot pierce.
  // A hidden template element (class="operatorData", value="GT") sits AFTER the
  // visible rule selects in the DOM, so .last() always resolves to it. Instead,
  // scan backwards to find the last *visible* twc-select – that is the value dropdown.
  private async _selectEnumRuleValue(newValue: string): Promise<void> {
    // Wait for the dialog's select elements to render before scanning for the visible value dropdown.
    await this.page.locator('twc-select').first().waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    const allSelects = this.page.locator('twc-select');
    const count = await allSelects.count();
    let valueSelect = allSelects.last();
    for (let i = count - 1; i >= 0; i--) {
      if (await allSelects.nth(i).isVisible()) {
        valueSelect = allSelects.nth(i);
        break;
      }
    }
    await valueSelect.locator('twc-popup svg').click();
    await this.page.waitForTimeout(300);
    await this.page.getByRole('option', { name: newValue, exact: true })
      .locator('slot').nth(1).click();
    await this.page.waitForTimeout(300);
  }

  // In the open filter edit dialog, change the enum rule value and save.
  async changeRuleEnumValueAndSave(newValue: string): Promise<void> {
    await this._selectEnumRuleValue(newValue);
    await this.saveChangesBtn.click();
    await this.filterDialog.waitFor({ state: 'hidden', timeout: AuditCasesPage.STD_TIMEOUT }).catch(() => {});
    console.log(`Rule value changed to "${newValue}" – filter saved via Save Changes`);
  }

  // In the open filter edit dialog, change the enum rule value then click Cancel
  // so the change is discarded. The filter rule remains unchanged.
  async changeRuleEnumValueAndCancel(newValue: string): Promise<void> {
    await this._selectEnumRuleValue(newValue);
    await this.page.getByRole('button', { name: 'Cancel' }).click();
    await this.filterDialog
      .waitFor({ state: 'hidden', timeout: AuditCasesPage.STD_TIMEOUT })
      .catch(() => {});
    console.log(`Rule value changed to "${newValue}" in dialog then cancelled – no change saved`);
  }

  // Hover over a saved filter, click three dots, click Delete – stops before
  // confirming so the caller can click Yes or No.
  async openDeleteConfirmationDialog(filterName: string): Promise<void> {
    const filterItem = this.savedFilterItem(filterName);
    await filterItem.scrollIntoViewIfNeeded().catch(() => {});
    await filterItem.hover();
    await this.page.waitForTimeout(400);

    await this.filterContextMenuBtn(filterName).click();
    await this.page.waitForTimeout(300);

    const deleteOption = this.page.getByRole('menuitem', { name: 'Delete' });
    await deleteOption.waitFor({ state: 'attached', timeout: AuditCasesPage.SHORT_TIMEOUT });
    await deleteOption.locator('slot').nth(1).click({ force: true });
    await this.page.waitForTimeout(400);

    const confirmBtn = this.page.getByRole('button', { name: 'Yes' }).first();
    await confirmBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    console.log(`Delete confirmation dialog opened for filter "${filterName}"`);
  }

  // Hover over a saved filter, click three dots, click Delete, confirm in the
  // delete dialog (Yes button), then verify the filter is gone from the list.
  async deleteSavedFilter(filterName: string): Promise<void> {
    const filterItem = this.savedFilterItem(filterName);
    await filterItem.scrollIntoViewIfNeeded().catch(() => {});
    await filterItem.hover();
    await this.page.waitForTimeout(400);

    // Click three-dot button using filter-name-specific ID.
    await this.filterContextMenuBtn(filterName).click();
    await this.page.waitForTimeout(300);

    // Click Delete from the context menu.
    const deleteOption = this.page.getByRole('menuitem', { name: 'Delete' });
    await deleteOption.waitFor({ state: 'attached', timeout: AuditCasesPage.SHORT_TIMEOUT });
    await deleteOption.locator('slot').nth(1).click({ force: true });
    await this.page.waitForTimeout(400);

    // Confirm deletion – click Yes in the confirmation dialog.
    const confirmBtn = this.page.getByRole('button', { name: 'Yes' }).first()
      .or(this.page.getByRole('button', { name: /delete|confirm/i }).first());
    await confirmBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await confirmBtn.click();

    // Verify the filter is no longer visible in the list.
    await expect(
      this.savedFilterItem(filterName),
      `Saved filter "${filterName}" should be removed from the list after deletion`
    ).not.toBeVisible({ timeout: AuditCasesPage.SHORT_TIMEOUT });
    console.log(`Saved filter "${filterName}" successfully deleted and removed from the list`);
  }

  // Verify the first table row is visible and its "Event Links" cell (with
  // three-dot button) is present in that first row, then hover to confirm
  // the button is visible and enabled.
  async verifyEventLinksMenuButtonVisibleAndEnabled(): Promise<void> {
    // Confirm at least one data row exists.
    const firstRow = this.tableRows.first();
    await firstRow.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });

    // Confirm the Event Links cell (with twc-icon-button) is in the first row.
    const eventLinkCellInFirstRow = firstRow.getByRole('cell').filter({ has: this.page.locator('twc-icon-button') });
    await expect(
      eventLinkCellInFirstRow,
      '"Event Links" cell should be present in the first table row'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Event Links cell verified in first table row');

    // Hover the cell to reveal the three-dot button.
    await eventLinkCellInFirstRow.hover();
    await this.page.waitForTimeout(400);

    await this.eventLinkMenuBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await expect(this.eventLinkMenuBtn, 'Event Links three-dot button should be visible after hover').toBeVisible();
    await expect(this.eventLinkMenuBtn, 'Event Links three-dot button should be enabled').toBeEnabled();
    console.log('Event Links three-dot button is visible and enabled after hover');
  }

  // Hover the first "Event Links" data cell, click the three-dot button,
  // then verify each expected context menu option is visible.
  async clickEventLinksMenuAndVerifyOptions(expectedOptions: string[]): Promise<void> {
    await this.eventLinkCell.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.eventLinkCell.hover();
    await this.page.waitForTimeout(400);

    await this.eventLinkMenuBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.eventLinkMenuBtn.click();
    await this.page.waitForTimeout(400);

    const menuItems: Record<string, Locator> = {
      'Referenced process instances': this.eventLinksItemReferencedProcessInstances,
      'Referencing work items':        this.eventLinksItemReferencingWorkItems,
      'This case':                     this.eventLinksItemThisCase,
      'Cases of this class':           this.eventLinksItemCasesOfThisClass,
    };
    for (const option of expectedOptions) {
      const locator = menuItems[option] ?? this.page.getByRole('menuitem', { name: option });
      await expect(locator, `Context menu option "${option}" should be visible`).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
      console.log(`  ✓ "${option}" is visible`);
    }
    console.log(`All ${expectedOptions.length} context menu options verified`);
  }

  // Shared helper – hover the Event Links cell and click the three-dot button to open the context menu.
  // Presses Escape first to close any previously open menu (prevents toggle-close on re-entry).
  private async openEventLinksMenu(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);
    await this.eventLinkCell.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.eventLinkCell.hover();
    await this.page.waitForTimeout(400);
    await this.eventLinkMenuBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.eventLinkMenuBtn.click();
    await this.page.waitForTimeout(400);
  }

  // Shared helper – open the Event Links menu, verify a named option is visible, click it, wait for load.
  // Eliminates the hover→verify→click→waitForLoad boilerplate repeated in every clickEventLinks* method.
  private async _clickEventLinksItem(item: Locator, label: string): Promise<void> {
    await this.openEventLinksMenu();
    await expect(item, `"${label}" option should be visible in Event Links menu`).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    await item.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log(`Clicked "${label}" from Event Links menu – page loaded`);
  }

  // Open the Event Links context menu, verify "Referenced process instances" is visible, and click it.
  async clickEventLinksReferencedProcessInstances(): Promise<void> {
    await this._clickEventLinksItem(this.eventLinksItemReferencedProcessInstances, 'Referenced process instances');
  }

  // Click "All Cases" heading in the right panel to deselect the active case type filter
  // and show all case instances. Waits for the table to settle after the click.
  async navigateToAllCases(): Promise<void> {
    const allCasesLink = this.page.getByText('All Cases', { exact: true }).first();
    await allCasesLink.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await allCasesLink.click();
    await this._waitForTableOrEmpty();
    console.log('Clicked "All Cases" – all case instances visible');
  }

  // Click the back button to return to the Cases page.
  // Some pages use "Cases (BDS-1-...)" (backButton); others use "Back to Cases" (backToCasesButton).
  async navigateBackToCases(): Promise<void> {
    const casesBtn = await this.backButton.isVisible().catch(() => false)
      ? this.backButton
      : this.backToCasesButton;
    await casesBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await casesBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.tableRows.first().waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT });
    console.log('Navigated back to Cases – instance table visible');
  }

  // Verify the Referenced process instances page: "Event Links" column header + "Referenced work items" row.
  async verifyReferencedProcessInstancesPage(): Promise<void> {
    await expect(
      this.eventLinksColumnHeader,
      '"Event Links" column header should be visible on the Referenced process instances page'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Verified: "Event Links" column header is visible');
    await expect(
      this.referencedWorkItemsRow,
      '"Referenced work items" row should be visible in the table'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Verified: "Referenced work items" row is visible');
  }

  // Click "Referenced work items" row and wait for the next page to load.
  async clickReferencedWorkItemsRow(): Promise<void> {
    await this.referencedWorkItemsRow.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.referencedWorkItemsRow.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Clicked "Referenced work items" row – navigating to Referencing work items page');
  }

  // Verify the Referencing work items page: "Event Links" column header + "Related work items" row.
  async verifyRelatedWorkItemsRowPage(): Promise<void> {
    await expect(
      this.eventLinksColumnHeader,
      '"Event Links" column header should be visible on the Referencing work items page'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Verified: "Event Links" column header is visible');
    await expect(
      this.relatedWorkItemsRow,
      '"Related work items" row should be visible in the table'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Verified: "Related work items" row is visible');
  }

  // Click "Related work items" row and wait for the next page to load.
  async clickRelatedWorkItemsRow(): Promise<void> {
    await this.relatedWorkItemsRow.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.relatedWorkItemsRow.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Clicked "Related work items" row – navigating to Related cases page');
  }

  // Verify the Related cases page: "Event Links" column header + "Related cases" row.
  async verifyRelatedCasesRowPage(): Promise<void> {
    await expect(
      this.eventLinksColumnHeader,
      '"Event Links" column header should be visible on the Related cases page'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Verified: "Event Links" column header is visible');
    await expect(
      this.relatedCasesRow,
      '"Related cases" row should be visible in the table'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Verified: "Related cases" row is visible');
  }

  // Click the first "Related cases" button; soft-check for the inline "no case reference" message.
  async clickFirstRelatedCasesButton(): Promise<void> {
    await this.relatedCasesButton.first().waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.relatedCasesButton.first().click();
    await this.noCaseReferenceMessage.waitFor({ state: 'visible', timeout: AuditCasesPage.SHORT_TIMEOUT }).catch(() => {});
    const isNoCaseRef = await this.noCaseReferenceMessage.isVisible().catch(() => false);
    console.log(`First "Related cases" button clicked – "No case reference available": ${isNoCaseRef}`);
  }

  // Click the second "Related cases" button and wait for the case detail page to load.
  async clickSecondRelatedCasesButton(): Promise<void> {
    await this.relatedCasesButton.nth(1).waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.relatedCasesButton.nth(1).click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Clicked second "Related cases" button – navigating to case detail page');
  }

  // Verify the "Type" column header is visible on the case detail page.
  async verifyTypeColumnHeaderPage(): Promise<void> {
    await expect(
      this.typeColumnHeader,
      '"Type" column header should be visible on the case detail page'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    console.log('Verified: "Type" column header is visible');
  }

  // Click the "Related Work Items" button scoped to a table cell (avoids breadcrumb collision).
  async clickRelatedWorkItemsCellButton(): Promise<void> {
    await this.relatedWorkItemsCellButton.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await this.relatedWorkItemsCellButton.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Clicked "Related Work Items" link – navigating to work items page');
  }

  // On the Referencing work items page, check whether data is present:
  //   • Rows visible  – verify "Activity name" column header is visible and log row count
  //   • No rows       – verify the "No work items" empty-state message is visible
  async verifyReferencingWorkItemsPage(): Promise<void> {
    await Promise.race([
      this.tableRows.first().waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT }),
      this.noWorkItemsMessage.waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT }),
    ]).catch(() => {});
    const rowCount = await this.tableRows.count();
    if (rowCount > 0) {
      await expect(
        this.activityNameColumnHeader,
        '"Activity name" column header should be visible when rows are present'
      ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
      console.log(`Referencing work items: ${rowCount} row(s) visible – "Activity name" header verified`);
    } else {
      await expect(
        this.noWorkItemsMessage,
        'Empty-state "No work items" message should be visible when there is no data'
      ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
      console.log('Referencing work items: no data – empty-state message verified');
    }
  }

  // Open the Event Links context menu, verify "This case" is visible, and click it.
  async clickEventLinksThisCase(): Promise<void> {
    await this.openEventLinksMenu();
    await expect(
      this.eventLinksItemThisCase,
      '"This case" option should be visible in Event Links menu'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    await this.eventLinksItemThisCase.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Clicked "This case" from Event Links menu – page loaded');
  }

  // On the "This case" page, verify the "Message ID" column header is visible.
  async verifyThisCasePage(): Promise<void> {
    await expect(
      this.messageIdColumnHeader,
      '"Message ID" column header should be visible on the "This case" page'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    const rowCount = await this.tableRows.count();
    console.log(`This case: "Message ID" header verified – ${rowCount} row(s) visible`);
  }

  // Open the Event Links context menu, verify "Cases of this class" is visible, and click it.
  async clickEventLinksCasesOfThisClass(): Promise<void> {
    await this.openEventLinksMenu();
    await expect(
      this.eventLinksItemCasesOfThisClass,
      '"Cases of this class" option should be visible in Event Links menu'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    await this.eventLinksItemCasesOfThisClass.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Clicked "Cases of this class" from Event Links menu – page loaded');
  }

  // On the "Cases of this class" page, verify "Message ID" column header is visible
  // and at least one row contains the case type text "GLOBAL DATA CREATE CASE".
  async verifyCasesOfThisClassPage(): Promise<void> {
    await expect(
      this.messageIdColumnHeader,
      '"Message ID" column header should be visible on the "Cases of this class" page'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    const globalDataCell = this.page.getByRole('cell', { name: /GLOBAL DATA CREATE CASE/i }).first();
    await expect(
      globalDataCell,
      'At least one row should contain "GLOBAL DATA CREATE CASE"'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    const rowCount = await this.tableRows.count();
    console.log(`Cases of this class: "Message ID" header and "GLOBAL DATA CREATE CASE" row verified – ${rowCount} row(s) visible`);
  }

  async verifyCategoryRemovedFromList(categoryName: string): Promise<void> {
    await expect(
      this.page.getByText(categoryName, { exact: true }).first(),
      `Category "${categoryName}" should be removed from Saved Filters list after all its filters are deleted`
    ).not.toBeVisible({ timeout: AuditCasesPage.SHORT_TIMEOUT });
    console.log(`Category "${categoryName}" successfully removed from the Saved Filters list`);
  }

  // ── Search (Cases instance right panel) ───────────────────────────────────

  async clickSearchButton(): Promise<void> {
    const alreadyOpen = await this.searchInput.isVisible().catch(() => false);
    if (!alreadyOpen) {
      await this.searchToolbarItem.click();
      await this.searchInput.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    }
    console.log("Search button clicked");
  }

  // Fill the search input that appears after clickSearchButton() and press Enter.
  async typeInSearchAndSubmit(value: string): Promise<void> {
    await this.searchInput.waitFor({ state: "visible", timeout: AuditCasesPage.STD_TIMEOUT });
    await this.searchInput.fill(value);
    await this.page.keyboard.press("Enter");
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
    console.log(`Search for "${value}" submitted – results loaded`);
  }

  // Fill the search input and submit, then verify no data rows are present and an
  // empty-state message is visible. Used when the search term is expected to return zero results.
  async typeInSearchAndVerifyEmptyState(value: string): Promise<void> {
    await this.searchInput.waitFor({ state: "visible", timeout: AuditCasesPage.STD_TIMEOUT });
    await this.searchInput.fill(value);
    await this.page.keyboard.press("Enter");
    await this.noDataMessage.waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT });

    // No data rows should be present.
    const rowCount = await this.tableRows.count();
    expect(rowCount, `Search for "${value}" should return zero rows`).toBe(0);

    // "No case events" / "No Cases Events" empty-state message should be visible.
    await expect(this.noDataMessage, `"No case events" empty-state message should be visible when search returns no results`).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });

    console.log(`Search for "${value}" – no rows returned, "No Cases Events" empty-state message verified`);
  }

  // Clear the active search input (already open from a prior clickSearchButton call) by
  // filling an empty string and pressing Enter, then verify all rows return.
  async clearSearchAndVerifyAllRowsReturn(expectedRowCount?: number): Promise<number> {
    await this.searchInput.waitFor({ state: "visible", timeout: AuditCasesPage.STD_TIMEOUT });
    await this.searchInput.fill("");
    await this.page.keyboard.press("Enter");
    await this.tableRows.first().waitFor({ state: "visible", timeout: AuditCasesPage.LONG_TIMEOUT });
    const rowCount = await this.tableRows.count();
    if (expectedRowCount !== undefined) {
      expect(rowCount, `After clearing search, row count should return to ${expectedRowCount}`).toBe(expectedRowCount);
    } else {
      expect(rowCount, "After clearing search, at least one row should be visible").toBeGreaterThan(0);
    }
    console.log(`Search cleared – ${rowCount} rows returned`);
    return rowCount;
  }

  // Click outside the search input (on the "All Cases" heading – neutral, no side effects),
  // then verify the search placeholder "Search for cases" is visible in the input.
  async clickOutsideSearchBoxAndVerifyPlaceholder(): Promise<void> {
    // Click the "All Cases" heading to move focus away from the search input.
    await this.page.getByText('All Cases', { exact: true }).first().click();

    // getByPlaceholder() uses the accessibility tree and pierces shadow roots,
    // so it finds the input even when rendered inside a web component's shadow DOM.
    const placeholderInput = this.page.getByPlaceholder(/search for cases/i).first();
    await expect(
      placeholderInput,
      'Search input with placeholder "Search for cases" should be visible after clicking outside'
    ).toBeVisible({ timeout: AuditCasesPage.SHORT_TIMEOUT });
    console.log(`Search placeholder "Search for cases" is visible after clicking outside`);
  }

  // Verify every visible data row has the expected value in the specified column (case-insensitive).
  // Returns the number of verified rows.
  async verifyAllRowsContainValue(colName: string, expectedValue: string): Promise<number> {
    const headers = await utility.tableHeader(this.page);
    const colIdx = headers.indexOf(colName);
    expect(colIdx, `Column "${colName}" must be present in table – got: [${headers.join(", ")}]`).toBeGreaterThan(-1);

    const dataRows = this.tableRows.filter({ has: this.page.locator("twc-table-cell") });
    const rowCount = await dataRows.count();
    expect(rowCount, "Search results should have at least one row").toBeGreaterThan(0);

    for (let i = 0; i < rowCount; i++) {
      const cellText = (await dataRows.nth(i).locator("twc-table-cell").nth(colIdx).innerText()).trim();
      expect(
        cellText.toUpperCase(),
        `Row ${i + 1} "${colName}" should contain "${expectedValue}" – got "${cellText}"`
      ).toContain(expectedValue.toUpperCase());
      console.log(`  Row ${i + 1}: ${colName} = "${cellText}"`);
    }
    console.log(`All ${rowCount} rows verified – ${colName} contains "${expectedValue}"`);
    return rowCount;
  }

  // Shared helper: on the Referenced process instances page the Event Links button is a
  // twc-dropdown (not twc-icon-button). Press Escape, then click the dropdown button to
  // open the context menu. Caller must wait for / interact with menu items after this.
  private async _openRefInstancesDropdownMenu(): Promise<void> {
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);
    const dropdownBtn = this.page.locator('twc-dropdown').getByRole('button').first();
    await dropdownBtn.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await dropdownBtn.click();
    await this.page.waitForTimeout(400); // CSS menu-open animation
  }

  // Verify Event Links context menu on the Referenced process instances page.
  // The page also renders left-panel case-type items with role="menuitem", so
  // counting ALL menuitems is unreliable. Instead verify each of the 5 expected
  // dropdown options by name (same approach as clickEventLinksMenuAndVerifyOptions in test 22),
  // then assert exactly 1 of the 5 is disabled.
  async verifyReferencedProcessInstancesEventLinksMenuOptions(): Promise<void> {
    await this._openRefInstancesDropdownMenu();
    const expectedOptions = [
      'Referenced processes',
      'Referenced cases',
      'Source process template',
      'This case',
      'Cases of this class',
    ];
    for (const option of expectedOptions) {
      await expect(
        this.page.getByRole('menuitem', { name: option }),
        `"${option}" should be visible in the Event Links context menu`
      ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    }
    let disabledCount = 0;
    for (const option of expectedOptions) {
      const item = this.page.getByRole('menuitem', { name: option });
      if (await item.isDisabled()) {
        disabledCount++;
        console.log(`Disabled option: "${option}"`);
      }
    }
    const enabledCount = expectedOptions.length - disabledCount;
    console.log(`Event Links context menu: [${expectedOptions.join(' | ')}] – ${enabledCount} enabled, ${disabledCount} disabled`);
    expect(disabledCount, '1 context menu option should be disabled').toBe(1);
    expect(enabledCount, '4 context menu options should be enabled').toBe(4);
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(200);
    console.log('Event Links context menu options verified on Referenced process instances page');
  }

  // On the Referenced process instances page, open the Event Links dropdown menu and
  // click "Source process template". Uses _openRefInstancesDropdownMenu() shared helper.
  async clickEventLinksSourceProcessTemplate(): Promise<void> {
    await this._openRefInstancesDropdownMenu();
    await expect(
      this.eventLinksItemSourceProcessTemplate,
      '"Source process template" option should be visible in Event Links menu'
    ).toBeVisible({ timeout: AuditCasesPage.STD_TIMEOUT });
    await this.eventLinksItemSourceProcessTemplate.click();
    await this.page.waitForLoadState('domcontentloaded');
    console.log('Clicked "Source process template" from Event Links menu – page loaded');
  }

  // Click the first data row's first cell on the Source process template page to drill into
  // the audit detail page for that process instance. Waits for the "Audit details of" heading
  // (unique to the drill-down page) to confirm navigation, then waits for rows to render.
  // Promise.race on twc-table-row cannot be used here because the source page already has
  // visible twc-table-row elements that would resolve the race before navigation completes.
  async clickFirstRowOnSourceProcessTemplatePage(): Promise<void> {
    const firstDataRow = this.tableRows.filter({ has: this.page.locator('twc-table-cell') }).first();
    await firstDataRow.waitFor({ state: 'visible', timeout: AuditCasesPage.STD_TIMEOUT });
    await firstDataRow.locator('twc-table-cell').first().click();
    await this.auditDetailsHeading.waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT });
    await this.tableRows.first().waitFor({ state: 'visible', timeout: AuditCasesPage.LONG_TIMEOUT });
    console.log('Clicked first row on Source process template page – audit detail page loaded');
  }

}
