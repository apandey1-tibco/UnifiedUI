import { expect, type Locator, type Page } from '@playwright/test';

const SHORT_TIMEOUT   = 5000;
const STD_TIMEOUT     = 10000;
const LONG_TIMEOUT    = 15000;
const NETWORK_TIMEOUT = 30000;
const CONNECT_TIMEOUT = 60000;

export class AMXBPMUsersResourses {
  readonly page: Page;
  readonly switcherIcon: Locator;
  readonly confirmButton: Locator;
  readonly serverList: Locator;

  constructor(page: Page) {
    this.page = page;

    // The server-switcher icon appears in two DOM shapes depending on render state:
    // 1. A <div> inside twc-icon inside twc-tooltip (standard)
    // 2. A bare <svg> inside twc-tooltip (fallback)
    const byDiv = page.locator('twc-tooltip')
      .filter({ hasText: 'You can change the' })
      .locator('twc-icon div');
    const bySvg = page.locator('twc-tooltip')
      .filter({ hasText: 'You can change the' })
      .locator('svg');
    this.switcherIcon = byDiv.or(bySvg).first();

    // Confirm button varies by dialog implementation
    this.confirmButton = page
      .getByRole('button', { name: /^confirm$/i })
      .or(page.locator('twc-button').filter({ hasText: /^confirm$/i }))
      .or(page.locator('button').filter({ hasText: /^confirm$/i }))
      .first();

    this.serverList = page.locator('twc-list-item');
  }

  // ---------------------------------------------------------------------------
  // Server switcher
  // ---------------------------------------------------------------------------

  async openServerSwitcher(): Promise<void> {
    // If the switcher tooltip is not present the user is already on the target server;
    // clicking anyway is safe – it just opens the picker.
    try {
      await this.switcherIcon.waitFor({ state: 'visible', timeout: SHORT_TIMEOUT });
      await this.switcherIcon.click({ force: true });
      await this.page.waitForTimeout(800);
    } catch {
      // Switcher icon not found – server may already be selected or page not ready yet.
      // Try a broader fallback: any server-switcher button
      const fallback = this.page.locator('[aria-label*="server" i], [title*="server" i]').first();
      try {
        await fallback.waitFor({ state: 'visible', timeout: SHORT_TIMEOUT });
        await fallback.click({ force: true });
        await this.page.waitForTimeout(800);
      } catch {
        // Nothing found – proceed; ensureServerSelected will verify state
      }
    }
  }

  async selectServerFromSwitcher(serverName: string): Promise<void> {
    const serverItem = this.page.locator('twc-list-item').filter({ hasText: serverName }).first();
    await serverItem.waitFor({ state: 'visible', timeout: LONG_TIMEOUT });
    await serverItem.click();
    await this.page.waitForTimeout(500);
  }

  async clickConfirmOnSwitcherDialog(): Promise<void> {
    await this.confirmButton.waitFor({ state: 'visible', timeout: STD_TIMEOUT });
    await this.confirmButton.click();

    // Wait for the dialog to close before continuing
    const dialog = this.page.locator('twc-dialog, [role="dialog"]').first();
    try {
      await dialog.waitFor({ state: 'hidden', timeout: LONG_TIMEOUT });
    } catch {
      // Dialog may have already closed or never matched
    }
    await this.page.waitForTimeout(500);
  }

  async assertServerIsSelected(serverName: string): Promise<void> {
    // The selected server name surfaces either as a link or a button in the top bar
    const serverIndicator = this.page
      .getByRole('link', { name: new RegExp(serverName, 'i') })
      .or(this.page.getByRole('button', { name: new RegExp(serverName, 'i') }))
      .first();

    await expect(serverIndicator).toBeVisible({ timeout: LONG_TIMEOUT });
  }

  // ---------------------------------------------------------------------------
  // Idempotent server-switch — skips the switch when already on the target
  // ---------------------------------------------------------------------------

  async ensureServerSelected(serverName: string): Promise<void> {
    // Check if the server indicator is already visible
    const serverIndicator = this.page
      .getByRole('link', { name: new RegExp(serverName, 'i') })
      .or(this.page.getByRole('button', { name: new RegExp(serverName, 'i') }))
      .first();

    const alreadySelected = await serverIndicator.isVisible().catch(() => false);
    if (alreadySelected) return;

    // Not selected yet — open the switcher and pick the server
    await this.openServerSwitcher();
    await this.selectServerFromSwitcher(serverName);
    await this.clickConfirmOnSwitcherDialog();
    await this.assertServerIsSelected(serverName);
  }

  // ---------------------------------------------------------------------------
  // Process start helper
  // ---------------------------------------------------------------------------

  /**
   * Navigates to the Process tab, expands the given package, clicks the named
   * process, clicks Start, and returns the new process-instance ID.
   */
  async startAuditProcess(packageName: string, processName: string): Promise<string> {
    // Navigate to the Processes tab in Work Manager
    const processesTab = this.page
      .getByRole('tab', { name: /processes/i })
      .or(this.page.locator('twc-navmenu-item').filter({ hasText: /process/i }))
      .first();
    await processesTab.waitFor({ state: 'visible', timeout: LONG_TIMEOUT });
    await processesTab.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(1000);

    // Expand the package tree node
    const packageNode = this.page.getByText(packageName, { exact: true }).first();
    await packageNode.waitFor({ state: 'visible', timeout: LONG_TIMEOUT });
    await packageNode.click();
    await this.page.waitForTimeout(500);

    // Select the process
    const processNode = this.page.getByText(processName, { exact: true }).first();
    await processNode.waitFor({ state: 'visible', timeout: LONG_TIMEOUT });
    await processNode.click();
    await this.page.waitForTimeout(500);

    // Click the Start button
    const startBtn = this.page
      .getByRole('button', { name: /^start$/i })
      .or(this.page.locator('twc-button').filter({ hasText: /^start$/i }))
      .first();
    await startBtn.waitFor({ state: 'visible', timeout: STD_TIMEOUT });
    await startBtn.click();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForTimeout(2000);

    // Extract the process-instance ID from the URL or page heading
    const url = this.page.url();
    const match = url.match(/\/(\d+)(?:\/|$)/);
    if (match) return match[1];

    // Fallback: read instance ID from a visible heading/cell
    const instanceHeading = this.page
      .locator('[data-testid="instance-id"], .instance-id, h1, h2')
      .first();
    try {
      await instanceHeading.waitFor({ state: 'visible', timeout: SHORT_TIMEOUT });
      const text = await instanceHeading.textContent();
      const numMatch = text?.match(/\d+/);
      if (numMatch) return numMatch[0];
    } catch {
      // heading not found
    }

    return '';
  }

  // ---------------------------------------------------------------------------
  // Utility helpers
  // ---------------------------------------------------------------------------

  async waitForPageReady(timeout = NETWORK_TIMEOUT): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
    await this.page.waitForLoadState('networkidle', { timeout: SHORT_TIMEOUT }).catch(() => {});
  }
}
