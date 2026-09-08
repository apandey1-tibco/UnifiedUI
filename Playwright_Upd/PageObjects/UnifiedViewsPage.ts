import { expect, Locator, Page } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class UnifiedViewsPage {
    readonly page: Page;

    //Register New System Button
    readonly registerNewSystemButton: Locator;
    readonly systemNameInput: Locator;
    readonly systemTypeDropdown: Locator;
    readonly urlInput: Locator;
    readonly saveButton: Locator;
    readonly unifiedViewsHeader: Locator;
    readonly RegisterYourSystemDialog: Locator;


    constructor(page: Page) {
        this.page = page;

        //Register New System Button
        this.registerNewSystemButton = page.locator('.register-new-button button');
        //this.systemNameInput = page.locator('.view-input-container', {hasText: 'System name'}).locator('#twc-input').locator('#input');
        this.systemNameInput = page.locator('#input').first()
        this.systemTypeDropdown = page.locator('twc-button', { hasText: 'BPM 5.x (BPMe)' });
        //this.urlInput = page.locator('div.view-input-container', {hasText: 'URL'}).locator('twc-input').locator('input');
        //this.urlInput = page.getByText('URL').locator('twc-input').locator('input');
        this.urlInput = page.locator('#input').nth(1);
        this.saveButton = page.locator('twc-button', { hasText: 'Save' });
        this.unifiedViewsHeader = page.getByRole('button', { name: 'Unified views' });
        this.RegisterYourSystemDialog = page.locator("div[role='dialog'] >> text=Register your system");
    }

    //Method to click on Register New System Button
    async clickOnRegisterNewSystem() {
        await this.page.waitForTimeout(1000);
        await this.registerNewSystemButton.click();
    }

    async enterSystemName(systemName: string) {
        await this.systemNameInput.fill(systemName);
    }

    async enterSystemURL(systemURL: string) {
        await this.urlInput.click();
        await this.page.keyboard.type(systemURL, { delay: 100 });
        await this.urlInput.press('Enter');
        await this.page.waitForTimeout(10000);
        //await this.urlInput.pressSequentially(systemURL, { delay: 100 });
    }

    async selectSystemType(systemType: string) {
        await this.systemTypeDropdown.click();
        const option = this.page.locator(`twc-menu-item >> text=${systemType}`);
        await option.click();
    }

    async clickOnSaveButton() {
        // 1. Wait for the button to be enabled (This makes the test fail if it stays disabled)
        await expect(this.saveButton).toBeEnabled({ timeout: 10000 });

        // 2. Perform the click
        await this.saveButton.click();

        // 3. Instead of waitForTimeout (3000), wait for a state change
        // e.g., wait for the button to disappear or a success message to appear
        await this.page.waitForLoadState('networkidle');
    }

    async enterEditURL(systemURL: string) {
        // When the inline edit form is open alongside the registration sidebar, there are two
        // URL inputs in the DOM. Use the visible one — the edit form input is always the visible one.
        const visibleUrlInput = this.page.locator('div.view-input-container', { hasText: 'URL' })
            .locator('twc-input input')
            .filter({ visible: true });
        await visibleUrlInput.click();
        await visibleUrlInput.selectText();
        await visibleUrlInput.pressSequentially(systemURL, { delay: 30 });
        await visibleUrlInput.press('Tab');
        await this.page.waitForTimeout(2000);
    }

    getSystemFromList(systemName: string): Locator {
        // After save, new server appears as menuitem in the sidebar list
        return this.page.locator('[role="menuitem"], li, a, [role="listitem"], span')
            .filter({ hasText: systemName }).first();
    }

    async clickOnServerFromList(serverName: string) {
        // Playwright .click() triggers Angular navigation; evaluate only highlights the item
        await this.getSystemFromList(serverName).click();
        // Detail panel can take several seconds to load
        await this.page.waitForTimeout(4000);
    }

    getEditButton(): Locator {
        return this.page.locator('twc-button').filter({ hasText: /Edit server/i }).first();
    }

    async clickOnEditButton() {
        await this.getEditButton().click();
        await this.page.waitForTimeout(2000);
    }

    getDeleteButton(): Locator {
        return this.page.locator('twc-button').filter({ hasText: /Delete server/i }).first();
    }

    async clickOnDeleteButton() {
        await this.getDeleteButton().click();
        await this.page.waitForTimeout(2000);
    }

    // Confirms the delete dialog — button label is "Yes, delete" (starts with "yes").
    // Delegates to clickYesOnConfirmDialog which uses Playwright's getByRole that correctly
    // pierces shadow DOM and triggers TWC button actions.
    async clickConfirmDeleteDialog(): Promise<void> {
        await this.clickYesOnConfirmDialog();
        await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {});
    }

    async assertServerDeletedFromList(serverName: string): Promise<void> {
        // .first() on getSystemFromList always returns a single-element locator, so use a fresh
        // unfiltered locator here to get an accurate count of zero after deletion.
        const items = this.page.locator('[role="menuitem"]').filter({ hasText: serverName });
        await expect(items).toHaveCount(0, { timeout: 15000 });
    }

    getEnableServerButton(): Locator {
        // The slot div for "Enable server" text is in the light DOM but visually hidden.
        // The toggle host renders via shadow DOM — assert the slot content is attached.
        return this.page.locator('div[slot="labelText"]').filter({ hasText: /Enable server/i }).first();
    }

    async assertEnableServerVisible(): Promise<void> {
        // Walk the full DOM including shadow roots to find the toggle and verify it has a visible bounding box.
        await this.page.waitForFunction(() => {
            function find(root: Document | ShadowRoot): boolean {
                for (const el of Array.from(root.querySelectorAll('[role="switch"], twc-toggle, twc-switch'))) {
                    const r = (el as HTMLElement).getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) return true;
                }
                for (const el of Array.from(root.querySelectorAll('*'))) {
                    const sr = (el as Element).shadowRoot;
                    if (sr && find(sr)) return true;
                }
                return false;
            }
            return find(document);
        }, undefined, { timeout: 20000 });
    }

    async clickOnEnableServerToggle(): Promise<void> {
        // The toggle lives in shadow DOM — walk roots to find the visible switch and click it.
        await this.page.evaluate(() => {
            function find(root: Document | ShadowRoot): boolean {
                for (const el of Array.from(root.querySelectorAll('[role="switch"], twc-toggle, twc-switch'))) {
                    const r = (el as HTMLElement).getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) {
                        (el as HTMLElement).click();
                        return true;
                    }
                }
                for (const el of Array.from(root.querySelectorAll('*'))) {
                    const sr = (el as Element).shadowRoot;
                    if (sr && find(sr)) return true;
                }
                return false;
            }
            find(document);
        });
        await this.page.waitForTimeout(1500);
    }

    async clickYesOnConfirmDialog(): Promise<void> {
        // Matches "Yes" and "Yes, continue" — use /^yes/i (prefix) not /^yes$/i (exact).
        const yesBtn = this.page.getByRole('button', { name: /^yes/i });
        const found = await yesBtn.first().isVisible({ timeout: 5000 }).catch(() => false);
        if (found) {
            await yesBtn.first().click();
        } else {
            await this.page.evaluate(() => {
                function clickYes(root: Document | ShadowRoot): boolean {
                    for (const el of Array.from(root.querySelectorAll('button, twc-button'))) {
                        if (/^yes/i.test((el as HTMLElement).textContent?.trim() || '')) {
                            (el as HTMLElement).click();
                            return true;
                        }
                    }
                    for (const el of Array.from(root.querySelectorAll('*'))) {
                        const sr = (el as Element).shadowRoot;
                        if (sr && clickYes(sr)) return true;
                    }
                    return false;
                }
                clickYes(document);
            });
        }
        await this.page.waitForTimeout(2000);
    }

    // If the server toggle is already ON (enabled), click it to disable
    // so that the enable test can always start from a disabled state.
    async ensureServerDisabled(): Promise<void> {
        const ariaChecked = await this.page.evaluate(() => {
            function find(root: Document | ShadowRoot): string | null {
                for (const el of Array.from(root.querySelectorAll('[role="switch"]'))) {
                    const r = (el as HTMLElement).getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) return (el as HTMLElement).getAttribute('aria-checked');
                }
                for (const el of Array.from(root.querySelectorAll('*'))) {
                    const sr = (el as Element).shadowRoot;
                    const result = sr ? find(sr) : null;
                    if (result !== null) return result;
                }
                return null;
            }
            return find(document);
        });

        if (ariaChecked === 'true') {
            // Toggle is ON — click it to disable, then confirm via the working getByRole method
            await this.clickOnEnableServerToggle();
            await this.clickYesOnConfirmDialog();
        }
    }

    // If the server toggle is already OFF (disabled from a previous run), re-enable it
    // so that the disable test can always start from an enabled state.
    async ensureServerEnabled(): Promise<void> {
        const isAlreadyEnabled = await this.page.evaluate(() => {
            function find(root: Document | ShadowRoot): string | null {
                for (const el of Array.from(root.querySelectorAll('[role="switch"]'))) {
                    const r = (el as HTMLElement).getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) return (el as HTMLElement).getAttribute('aria-checked');
                }
                for (const el of Array.from(root.querySelectorAll('*'))) {
                    const sr = (el as Element).shadowRoot;
                    const result = sr ? find(sr) : null;
                    if (result !== null) return result;
                }
                return null;
            }
            return find(document);
        });

        if (isAlreadyEnabled === 'false') {
            // Toggle is OFF — click it to re-enable, then confirm if a dialog appears
            await this.clickOnEnableServerToggle();
            const yesBtn = this.page.getByRole('button', { name: /^yes$/i });
            const dialogVisible = await yesBtn.isVisible({ timeout: 3000 }).catch(() => false);
            if (dialogVisible) await yesBtn.click();
            await this.page.waitForTimeout(2000);
        }
    }

    async assertServerIsEnabled(): Promise<void> {
        await this.page.waitForFunction(() => {
            function find(root: Document | ShadowRoot): boolean {
                for (const el of Array.from(root.querySelectorAll('[role="switch"]'))) {
                    const r = (el as HTMLElement).getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) {
                        return (el as HTMLElement).getAttribute('aria-checked') === 'true';
                    }
                }
                for (const el of Array.from(root.querySelectorAll('*'))) {
                    const sr = (el as Element).shadowRoot;
                    if (sr && find(sr)) return true;
                }
                return false;
            }
            return find(document);
        }, undefined, { timeout: 15000 });
    }

    async assertServerIsDisabled(): Promise<void> {
        // After disabling, the toggle's aria-checked attribute becomes "false".
        // Walk shadow DOM to find the switch and verify its checked state.
        await this.page.waitForFunction(() => {
            function find(root: Document | ShadowRoot): boolean {
                for (const el of Array.from(root.querySelectorAll('[role="switch"]'))) {
                    const r = (el as HTMLElement).getBoundingClientRect();
                    if (r.width > 0 && r.height > 0) {
                        return (el as HTMLElement).getAttribute('aria-checked') === 'false';
                    }
                }
                for (const el of Array.from(root.querySelectorAll('*'))) {
                    const sr = (el as Element).shadowRoot;
                    if (sr && find(sr)) return true;
                }
                return false;
            }
            return find(document);
        }, undefined, { timeout: 15000 });
    }

    // Opens the global server switcher (the "You can change the server application here" icon)
    // and asserts the given server name appears as disabled in the list.
    async assertServerDisabledInSwitcher(serverName: string): Promise<void> {
        const switcherIcon = this.page
            .locator('twc-tooltip')
            .filter({ hasText: 'You can change the' })
            .locator('twc-icon div');

        await switcherIcon.click();
        await this.page.waitForTimeout(1500);

        const disabledItem = this.page.locator('twc-list-item').filter({ hasText: serverName });
        await disabledItem.waitFor({ state: 'attached', timeout: 10000 });

        // Collect the full element state from host + shadow DOM so we can detect any
        // disabled indicator the TWC component uses (attribute, class, opacity, cursor, etc.).
        const info = await disabledItem.evaluate((hostEl) => {
            const el = hostEl as HTMLElement;
            const style = window.getComputedStyle(el);

            const attrs: Record<string, string> = {};
            for (const a of Array.from(el.attributes)) attrs[a.name] = a.value;

            let shadowData: { classes: string[]; opacity: string; color: string; cursor: string; html: string } | null = null;
            const shadow = (el as Element).shadowRoot;
            if (shadow) {
                const base = shadow.querySelector('li, div, [part], button, a') as HTMLElement | null;
                if (base) {
                    const bs = window.getComputedStyle(base);
                    shadowData = {
                        classes: Array.from(base.classList),
                        opacity: bs.opacity,
                        color: bs.color,
                        cursor: bs.cursor,
                        html: base.outerHTML.substring(0, 400),
                    };
                }
            }

            return {
                attrs,
                classList: Array.from(el.classList),
                tabIndex: el.tabIndex,
                opacity: style.opacity,
                pointerEvents: style.pointerEvents,
                cursor: style.cursor,
                color: style.color,
                shadowData,
                outerHTML: el.outerHTML.substring(0, 300),
            };
        });

        const isDisabled =
            'disabled' in info.attrs ||
            info.attrs['aria-disabled'] === 'true' ||
            info.attrs['data-disabled'] === 'true' ||
            info.attrs['active'] === 'false' ||
            info.attrs['status'] === 'disabled' ||
            info.classList.some((c: string) => /disabled|inactive|unavailable/i.test(c)) ||
            parseFloat(info.opacity) < 0.9 ||
            info.pointerEvents === 'none' ||
            info.cursor === 'not-allowed' ||
            info.tabIndex === -1 ||
            (info.shadowData !== null && (
                info.shadowData.classes.some((c: string) => /disabled|inactive/i.test(c)) ||
                parseFloat(info.shadowData.opacity) < 0.9 ||
                info.shadowData.cursor === 'not-allowed'
            ));

        if (!isDisabled) {
            throw new Error(
                `Server "${serverName}" is not marked as disabled in the server switcher.\n` +
                `Debug info: ${JSON.stringify(info, null, 2)}`
            );
        }

        // Close the switcher
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
    }

    // Opens the global server switcher and asserts the given server is NOT present in the list.
    // Disabled servers are completely removed from the switcher (not just hidden or greyed out).
    async assertServerNotInSwitcher(serverName: string): Promise<void> {
        const switcherIcon = this.page
            .locator('twc-tooltip')
            .filter({ hasText: 'You can change the' })
            .locator('twc-icon div');

        await switcherIcon.click();
        await this.page.waitForTimeout(2000);

        const item = this.page.locator('twc-list-item').filter({ hasText: serverName });
        // Disabled server is fully removed from the switcher list.
        await expect(item).toHaveCount(0, { timeout: 10000 });

        // Close the switcher
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
    }

    async assertDuplicateNameError(): Promise<void> {
        // The error message appears inside the form — walk all text nodes including shadow DOM
        const errorVisible = await this.page.waitForFunction(() => {
            function find(root: Document | ShadowRoot): boolean {
                for (const el of Array.from(root.querySelectorAll('*'))) {
                    const text = (el as HTMLElement).textContent?.trim() || '';
                    if (text.includes('A view with this name already exists')) {
                        const r = (el as HTMLElement).getBoundingClientRect();
                        if (r.width > 0 && r.height > 0) return true;
                    }
                    const sr = (el as Element).shadowRoot;
                    if (sr && find(sr)) return true;
                }
                return false;
            }
            return find(document);
        }, undefined, { timeout: 10000 }).catch(() => null);

        if (!errorVisible) {
            throw new Error('Expected error "A view with this name already exists" was not visible');
        }
    }

    async clickOnCancelButton(): Promise<void> {
        // Try standard role-based locator first
        const cancelBtn = this.page.getByRole('button', { name: /cancel/i });
        const found = await cancelBtn.first().isVisible({ timeout: 5000 }).catch(() => false);
        if (found) {
            await cancelBtn.first().click();
        } else {
            // Fallback: walk shadow DOM to find Cancel button
            await this.page.evaluate(() => {
                function walkShadow(root: Document | ShadowRoot): boolean {
                    for (const el of Array.from(root.querySelectorAll('button, twc-button'))) {
                        if (/^cancel$/i.test((el as HTMLElement).textContent?.trim() || '')) {
                            (el as HTMLElement).click();
                            return true;
                        }
                    }
                    for (const el of Array.from(root.querySelectorAll('*'))) {
                        const sr = (el as Element).shadowRoot;
                        if (sr && walkShadow(sr)) return true;
                    }
                    return false;
                }
                walkShadow(document);
            });
        }
        await this.page.waitForTimeout(1500);
    }

    // Opens the global server switcher and asserts the given server is present in the list.
    // Enabled (but non-active) servers appear in the list with tabindex="-1" — that is normal TWC behaviour.
    // Only the currently active server has tabindex="0"; presence in the list confirms the server is enabled.
    async assertServerEnabledInSwitcher(serverName: string): Promise<void> {
        const switcherIcon = this.page
            .locator('twc-tooltip')
            .filter({ hasText: 'You can change the' })
            .locator('twc-icon div');

        await switcherIcon.click();
        await this.page.waitForTimeout(2000);

        const item = this.page.locator('twc-list-item').filter({ hasText: serverName });
        // Server is present in the switcher list — confirming it is enabled.
        await item.waitFor({ state: 'visible', timeout: 10000 });

        // Close the switcher
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
    }
}
