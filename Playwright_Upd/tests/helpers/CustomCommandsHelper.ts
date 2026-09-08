import { type Page, type Locator, expect } from '@playwright/test';
import { CalendarPage } from '../../PageObjects/CalendarPage';

//const TestData = JSON.parse(JSON.stringify(require('../../fixtures/TestData.json')));
import TestData from '../../fixtures/TestData.json';
/**
 * Playwright equivalents of Cypress custom commands defined in
 * BPME_Cypress_Automation/cypress/support/commands.js
 */
export class CustomCommandsHelper {
    constructor(private page: Page, private calendarPage?: CalendarPage) {}

    async loginAdministrator(url: string, user: string, pass: string) {
        // Log in via the shared SSO login page (same domain, cookie covers all apps)
        await this.page.goto(TestData.webcomponenturl, { waitUntil: 'networkidle' });
        await this.page.locator('input[type="text"]').fill(user);
        await this.page.locator('input[type="password"]').fill(pass);
        await this.page.getByRole('button', { name: 'Sign in' }).click();
        await this.page.waitForLoadState('networkidle');
        // Navigate to the target admin URL now that the SSO cookie is set
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    async loginWorkManager(url: string, user: string, pass: string) {
        await this.page.goto(url);
        await this.page.locator('#mat-input-0').clear();
        await this.page.locator('#mat-input-0').fill(user);
        await this.page.locator('#mat-input-1').clear();
        await this.page.locator('#mat-input-1').fill(pass);
        await this.page.locator('button[type=submit]').click();
    }

    async logout() {
        await this.page.locator('.profile-icon').click();
        await this.page.locator('.sign-out-link').click();
    }
    async changeServer(name: string) {
        const tooltip = this.page.locator('twc-tooltip').filter({ hasText: 'You can change the' }).locator('svg');
        const isVisible = await tooltip.isVisible({ timeout: 5000 }).catch(() => false);
        if (isVisible) {
            await tooltip.click();
            await this.page.getByTitle(`${name}`).click();
            await this.page.getByRole('button', { name: 'Confirm' }).click();
        }
    }
    async selectFileToDeploy(filename: string) {
        await this.page.setInputFiles('input[type=file]', `./fixtures/${filename}`);
    }

    async resetOrg() {
        const credentials = btoa('tibco-admin:secret');
        const response = await this.page.context().request.post(TestData.DE_BASE_PATH, {
            headers: {
                'Authorization': `Basic ${credentials}`
            },
            data: { isDynamicOrg: true }
        });
        return { status: response.status() };
    }

    async selectAliasWithName(name: string) {
        await this.page.locator(`//span[normalize-space()='${name}']`).click();
    }

    async selectResourceWithName(name: string) {
        await this.page.locator(
            `(//div[@class='mat-tooltip-trigger resource-ellipsis'][normalize-space()='${name}']//preceding::mat-checkbox)[last()]`
        ).click();
    }

    async changeFilter() {
        //await this.page.locator('.org-bro-settings-container > .mat-icon > svg').click();
        await this.page.locator('[mattooltip="Filter settings"]').click();
        //await this.page.waitForTimeout(1000);
        //await this.page.locator('//input[@type="radio"]').last().click({ force: true });
        /*await this.page.getByRole('radio', { name: 'Name' }).click();
        await this.page.waitForTimeout(2000);
        await this.page.locator('//span[normalize-space()="Apply"]').click();
        await this.page.waitForTimeout(3000); */
        await this.page.getByRole('radio', { name: 'Name' }).check();
        await this.page.getByPlaceholder('Enter value').click();
        await this.page.getByPlaceholder('Enter value').fill('5');
        await this.page.getByRole('button', { name: 'Apply' }).click()
    }

    async expandOrganization() {
        await this.page.getByLabel('toggle Organizations').getByText('chevron_right').click();
        await this.page.getByLabel('toggle DynamicOrg').getByText('chevron_right').click();
        await this.page.getByLabel('toggle Board').getByText('chevron_right').click();
        await this.page.getByText('settings Branches').click();

    }

    async addCandidateQuery(name: string) {
        await this.page.getByRole('button', { name: 'Add Candidate Query' }).click();
        await expect(this.page.getByRole('heading', { name: 'Add Candidate Query' })).toContainText('Add Candidate Query');
        await this.page.getByRole('combobox', { name: 'Ldap Container' }).locator('span').click();
        await this.page.getByRole('option', { name: 'DynamicOrg' }).click();
        await this.page.getByRole('textbox', { name: 'Query' }).click();
        await this.page.getByRole('textbox', { name: 'Query' }).fill(`(ou=${name})`);
        await this.page.getByRole('radio', { name: 'Sub Tree' }).check();
        await this.page.getByRole('button', { name: 'Add', exact: true }).click();
    }

    async addExtensionPoints() {

        await this.page.getByRole('button', { name: 'Extension points (0)' }).click();
        //await this.page.locator('//mat-expansion-panel[4]//mat-expansion-panel-header[1]//span[2]').click();
        await this.page.getByRole('button', { name: 'Configure extension point' }).click();
        await this.page.getByRole('combobox', { name: 'Ldap Connection' }).locator('span').click();
        await this.page.getByRole('option', { name: 'easyAs' }).locator('span').click();
        await this.page.getByRole('radio', { name: 'Sub Tree' }).check();
        await this.page.getByRole('combobox', { name: 'Instance Name Attribute' }).locator('span').click();
        await this.page.getByRole('option', { name: 'ou' }).click();
        await this.page.getByLabel('Add Extension Point').getByLabel('', { exact: true }).locator('svg').click();
        await this.page.getByRole('option', { name: 'ou' }).click();
        await this.page.getByRole('button', { name: 'Add' }).click();
    }

    async doCheckOrgUser(city: string, name: string) {

        await this.page.getByLabel('toggle Branches').getByText('chevron_right').click();
        await this.page.getByLabel(`toggle ${city}`).getByText('chevron_right').click()
        await this.page.getByTitle('BranchManager').click();
        // Filters the list of elements down to the right one, then asserts the exact text
        await expect(this.page.locator('.resource-guid').filter({ hasText: name })).toHaveText(name);

    }

    async editAttributes(){

    //await this.page.locator('input[type="date"]').fill('2026-06-08');
  /*await this.page.getByRole('combobox', { name: 'AttributeEnum', exact: true }).locator('span').click();
  await this.page.getByRole('option', { name: 'EnumValue1' }).click();
  await this.page.getByRole('textbox', { name: 'AttributeText' }).click();
  await this.page.getByRole('textbox', { name: 'AttributeText' }).fill('abc');
  await this.page.getByRole('checkbox', { name: 'AttributeBoolean' }).check(); */
  await this.page.getByRole('textbox', { name: 'DN' }).click();
  await this.page.getByRole('textbox', { name: 'DN' }).fill('ou=Tony,ou=Richard,dc=example,dc=com');
  /*await this.page.getByRole('textbox', { name: 'AttributeDecimal' }).click();
  await this.page.getByRole('textbox', { name: 'AttributeDecimal' }).fill('10.2');
  await this.page.getByRole('combobox', { name: 'AttributeEnumSet' }).locator('span').click();
  await this.page.getByRole('option', { name: 'EnumValueSet1' }).click();
  await this.page.getByRole('option', { name: 'EnumValueSet2' }).locator('mat-pseudo-checkbox').click();
  await this.page.locator('.cdk-overlay-container > div:nth-child(3)').click();
  await this.page.getByRole('textbox', { name: 'AttributeInteger' }).click();
  await this.page.getByRole('textbox', { name: 'AttributeInteger' }).fill('10');
  await this.page.getByLabel('Edit Resource Attributes').getByText('AttributeTime').click();
  await this.page.locator('.cdk-overlay-container > div:nth-child(3)').click();
  await this.page.locator('input[type="datetime-local"]').click();
  await this.page.locator('input[type="datetime-local"]').click(); */
  await this.page.getByRole('textbox', { name: 'CN' }).click();
  await this.page.getByRole('textbox', { name: 'CN' }).fill('Tony Pulis');
  await this.page.getByRole('textbox', { name: 'OU' }).click();
  await this.page.getByRole('textbox', { name: 'OU' }).fill('Richard');
  await this.page.getByRole('button', { name: 'Save' }).click();
    }

    async editCandidateQuery(city: string, name: string) {
        await this.page.getByLabel('toggle Branches').getByText('chevron_right').click();
        await this.page.getByLabel(`toggle ${city}`).getByText('chevron_right').click()
        await this.page.getByTitle('BranchManager').click();
        await this.page.getByRole('button', { name: 'More' }).click();
        await this.page.getByRole('button', { name: 'Candidate query (1)' }).click();
        await this.page.getByTitle('Edit').locator('svg').click();
        await this.page.getByRole('textbox', { name: 'Query' }).click();
        await this.page.getByRole('textbox', { name: 'Query' }).fill(`(ou=${name})`);
        await this.page.getByRole('button', { name: 'Update' }).click();
    }

    async doCheckGroupUser(group: string, name: string) {
        await this.page.getByLabel('toggle groups').getByText('chevron_right').click();
        //await this.page.getByLabel(`toggle ${group}`).getByText('chevron_right').click();
        await this.page.getByTitle('DynamicOrgGroup001').click();
        await expect(this.page.locator('.resource-guid').filter({ hasText: name })).toHaveText(name);

    }

     async  loginWebComponent(page: Page, url: string, username: string, password: string) {
    // Navigate to the dynamic URL
        await page.waitForTimeout(5000);
        await page.goto(url);
        await page.locator('input[type="text"]').fill(username);
        await page.locator('input[type="password"]').fill(password);
        await page.getByRole('button', { name: 'Sign in' }).click();
    }

    async  clickComponentIcon(page: Page, component: string) {
        // Inject the dynamic processId into the locator string
        await page.locator(`#${component} svg`).click();
    }

    async deleteExtensionPoints() {
        //await this.page.locator(':nth-child(2) > .mat-tree-node > .card-expanded > .mat-focus-indicator > .mat-button-wrapper').click();
        await this.page.waitForTimeout(2000);
        await this.page.getByRole('button', { name: 'Extension points (1)' }).click();
        await this.page.getByTitle('Delete').locator('svg').click();
    }

    async adminHome(url: string) {
        await this.page.goto(url);
    }

    async DialogConfirm() {
        await expect(this.page.locator('//div[@class="title"]')).toContainText('confirm');
        await expect(this.page.locator('.msg-text')).toContainText('Do you want to delete this extension point ?');
        await expect(this.page.locator('//span[normalize-space()="Cancel"]')).toBeVisible();

        await expect(this.page.locator('//span[normalize-space()="Confirm"]')).toBeVisible();
        await this.page.locator('//span[normalize-space()="Confirm"]').click();
    }

    async addQueryDynamicGroup() {

       await this.page.getByLabel('toggle groups').getByText('chevron_right').click();
       await this.page.getByLabel('toggle DynamicOrgGroup001').getByText('chevron_right').click();
       await this.page.getByTitle('DynamicOrgGroup001').click();
       await this.page.getByRole('button', { name: 'More' }).click();
       await this.page.getByRole('button', { name: 'Candidate query (0)' }).click();
    }

    async verifyAndCloseTemplates() {
        await expect(this.page.locator(':nth-child(2) > :nth-child(3) > .mat-tree-node > .drop-hover')).toContainText('(?) BranchManager');

        await this.page.locator(':nth-child(2) > :nth-child(3) > .mat-tree-node > .drop-hover').click();
        await this.page.waitForTimeout(2000);
        await expect(this.page.locator('.edit-query-wrapper > .mdc-button')).toBeVisible();
        await this.page.locator('.mat-mdc-dialog-actions > .close-btn').click();
        await this.page.locator('.details-title > .close-btn > .mat-icon').click();
    }

    async openTemplates() {

       await this.page.getByRole('button', { name: 'More' }).click();
       await this.page.getByRole('button', { name: 'Templates (1)' }).click();
       await expect(this.page.getByRole('button', { name: 'View template' })).toBeVisible();
       //await expect(this.page.getByLabel('Templates (1)').getByRole('button')).toContainText('View template');
       await this.page.getByRole('button', { name: 'View template' }).click();
       await this.page.getByRole('treeitem', { name: 'BranchManager', exact: true }).getByRole('listitem').click();

    }

    // ── Calendar: locator helpers ─────────────────────────────────────

    eventTitle(name: string): Locator {
        return this.page.locator(
            `//span[@class = "cal-event-title" and contains(text(),"${name}")]`
        );
    }

    endDateField(): Locator {
        return this.page.locator('//input[@placeholder="Select end date"]');
    }

    // ── Calendar: creation ────────────────────────────────────────────
    async serverSelectAngular(name: string): Promise<void> {
        await this.page.getByRole('combobox', { name: 'select server' }).click()
            await this.page.getByRole('option', {name:`${name}`}).click();

    }

    async loginCalendar(url: string, username: string, password: string): Promise<void> {
        await this.page.goto(url);
        await this.page.locator('input[type="text"]').fill(username);
        await this.page.locator('input[type="password"]').fill(password);
        await this.page.locator('button[type="submit"]').click();
    }

    async newBaseCalendar(
        name: string,
        category: string,
        day: number,
        timezone: string,
        timezoneId: string
    ): Promise<void> {
        const cp = this.calendarPage!;
        await cp.createNewCalendar.click();
        await this.page.waitForTimeout(500);
        await cp.createBaseCalendar.click();
        await this.page.waitForTimeout(500);
        await this.page.locator('input[placeholder="Name"]').fill(name);
        await this.page.locator('input[placeholder="Category"]').fill(category);
        await this.page.locator(`//span[normalize-space()="${day}"]`).first().click();
        await this.page.getByRole('option', {name:`${day}`}).first().click();
        await this.page.waitForTimeout(500);
        await this.page.locator('//app-calendar-time-zones//mat-select[@role="combobox"]').first().click();
        await this.page.locator('input[placeholder="Search for timezone"]').click({ force: true });
        await this.page.locator('input[placeholder="Search for timezone"]').fill('India');
        await this.page.waitForTimeout(500);
        await this.page.locator(`//span[normalize-space()="${timezone}"]`).last().click();
        await this.page.waitForTimeout(500);
        await this.page
            .locator('//app-calendar-time-zones//mat-form-field[2]//mat-select[@role="combobox"]')
            .click();
        await this.page.waitForTimeout(500);
        await this.page.locator(`//span[normalize-space()="${timezoneId}"]`).click();
        await this.page.waitForTimeout(500);
        await this.page
            .locator('//button/span[@class = "mdc-button__label" and contains(text(),"Add")]')
            .click();
    }

    async newOverlayCalendar(name: string, category: string): Promise<void> {
        const cp = this.calendarPage!;
        await cp.createNewCalendar.click();
        await this.page.waitForTimeout(500);
        await cp.createOverlayCalendar.click();
        await this.page.waitForTimeout(500);
        await this.page.locator('input[placeholder="Name"]').fill(name);
        await this.page.locator('input[placeholder="Category"]').fill(category);
        await this.page
            .locator('//button/span[@class = "mdc-button__label" and contains(text(),"Add")]')
            .click();
    }

    // ── Calendar: list interactions ───────────────────────────────────

    async selectCalendarFromList(name: string): Promise<void> {
        await this.page
            .locator(`//div[contains(@class,"calendar-list-item")]/div[normalize-space()="${name}"]`)
            .click();
    }

    async optionButtonFor(name: string): Promise<void> {
        await this.page
            .locator(
                `//div[contains(@class,"calendar-list-item")][.//div[contains(@class,"calendar-name") and normalize-space()="${name}"]]/div/button`
            )
            .click();
    }

    async selectOption(option: string): Promise<void> {
        await this.page.locator(`//button//span[normalize-space(text())='${option}']`).click();
    }

    // ── Calendar: working hours ───────────────────────────────────────

    async addWorkingDay(day: string, startTime: string, endTime: string): Promise<void> {
        //await this.page.locator(`//div[@class = "day-name-label" and contains(text(),"${day}")]/preceding::mat-slide-toggle[1]`).click();
        //await this.page.waitForTimeout(300);
        await this.page.locator(`(//div[@class = "day-name-label" and contains(text(),"${day}")]/following::mat-select)[1]`).click();
        await this.page.waitForTimeout(500);
        await this.page.locator(`//span[normalize-space()="${startTime}"]`).last().click();
        await this.page.waitForTimeout(300);
        await this.page.locator(`(//div[@class = "day-name-label" and contains(text(),"${day}")]/following::mat-select)[2]`).click();
        await this.page.waitForTimeout(500);
        await this.page.locator(`//span[normalize-space()="${endTime}"]`).last().click();
        await this.page.waitForTimeout(300);
    }

    // ── Calendar: exclusions ──────────────────────────────────────────

    async workingDayExclusion(reason: string, startTime: string, endTime: string): Promise<void> {
        await this.page.locator('//mat-form-field/div//input[@placeholder = "Reason"]').fill(reason);
        await this.page.waitForTimeout(300);
        await this.page.locator('mat-select[placeholder="Start time"]').click();
        await this.page.waitForTimeout(500);
        await this.page.locator(`//mat-option//span[normalize-space()="${startTime}"]`).click();
        await this.page.waitForTimeout(300);
        await this.page.locator('mat-select[placeholder="End time"]').click();
        await this.page.waitForTimeout(500);
        await this.page.locator(`//mat-option//span[normalize-space()="${endTime}"]`).click();
        await this.page.waitForTimeout(300);
        await this.page.locator('.save-btn-enabled').first().click();
    }

    async recurringExclusion(
        reason: string,
        startTime: string,
        endTime: string,
        _type: number
    ): Promise<void> {
        await this.page.locator('//mat-form-field/div//input[@placeholder = "Reason"]').fill(reason);
        await this.page.waitForTimeout(300);
        await this.page.locator('mat-select[placeholder="Start time"]').click();
        await this.page.waitForTimeout(500);
        await this.page.locator(`//mat-option//span[normalize-space()="${startTime}"]`).click();
        await this.page.waitForTimeout(300);
        await this.page.locator('mat-select[placeholder="End time"]').click();
        await this.page.waitForTimeout(500);
        await this.page.locator(`//mat-option//span[normalize-space()="${endTime}"]`).click();
        await this.page.waitForTimeout(300);
    }

    async allDayExclusion(name: string): Promise<void> {
        await this.page.locator('//mat-form-field/div//input[@placeholder = "Reason"]').fill(name);
        await this.page.locator('//mat-checkbox[1]').first().click();
        await this.page.getByRole('button', {name: `Add`}).click();
    }

    async deleteExclusion(name: string): Promise<void> {
        await this.page.locator(`//span[@class = "month-event-title" and contains(text(),"${name}")]`).first().click();
        await this.page.waitForTimeout(1000);
        const deleteBtn = this.page.getByRole('button', {name: `Delete`}).first();
        if (await deleteBtn.isVisible()) {
            await deleteBtn.click({ force: true });
            await this.page.waitForTimeout(500);
        }
        const confirmBtn = this.page.getByRole('button', {name: `Confirm`})

        if (await confirmBtn.isVisible()) {
            await confirmBtn.click();
        }
        await this.page.waitForTimeout(1000);
    }

    // ── Calendar: recurrence settings ─────────────────────────────────

    async selectRepeats(type: string): Promise<void> {
        /*await this.page
            .locator('mat-select[placeholder="Repeats"], mat-select[aria-label="Repeats"]')
            .click(); */
        await this.page.waitForTimeout(300);
        //await this.page.locator(`repeat-every-div, {has-text("${type}") }`).click();
        await this.page.getByText(`${type}`).click();
    }

    async repeatsOn(day: string): Promise<void> {
        await this.page
            .locator(
                `//div[@class = "repeats-weekly-options"]/div[contains(text(),"${day}")]`
            )
            .first()
            .click();
    }

    async selectEnds(type: string): Promise<void> {
        await this.page
            .locator(`//div[@class = "end-details-container"]/div[normalize-space()="${type}"]`)
            .click();
    }

    async setOccurrence(count: number): Promise<void> {
    await this.page.waitForTimeout(1000);
    const input = this.page.locator('//input[@placeholder="Enter number of occurrences"]');
    await input.clear();
    await input.fill(count.toString());
}

    async setInterval(n: number): Promise<void> {
        //const input = this.page.locator('input[placeholder="Interval"], input[aria-label="interval"]');
        await this.page.locator('//mat-select[@placeholder="Repeats"]').click();
        await this.page.getByRole("option", { name: `${n}`, exact: true }).click();
    }

    async startsOn(year: string, month: string, day: string): Promise<void> {
        const monthShort: { [k: string]: string } = {
            JAN: 'Jan', FEB: 'Feb', MAR: 'Mar', APR: 'Apr',
            MAY: 'May', JUN: 'Jun', JUL: 'Jul', AUG: 'Aug',
            SEP: 'Sep', OCT: 'Oct', NOV: 'Nov', DEC: 'Dec',
        };
        const cp = this.calendarPage!;
        //await cp.startsOn.click();
        await this.page.waitForTimeout(300);
        await this.page.locator("//button[@aria-label= 'Open calendar']").last().click();
        await this.page.waitForTimeout(300);
        await cp.monthAndYear.click();
        await this.page.waitForTimeout(300);
        //await cp.next24Years.click();
        await this.page.waitForTimeout(300);
        await cp.selectYear(year).click();
        await this.page.waitForTimeout(300);
        await cp.selectMonth(month).click();
        await this.page.waitForTimeout(300);
        await cp.selectDate(day).click();
    }

    // ── Calendar: navigation ──────────────────────────────────────────

    async goTo(year: string, month: string, date: string): Promise<void> {
        await this.page.waitForTimeout(2000);
        await this.page.locator('//mat-icon[@class="mat-icon notranslate material-icons mat-ligature-font mat-icon-no-color"][normalize-space()="keyboard_arrow_down"]').click({ force: true });
        await this.page.waitForTimeout(1000);

        await this.page.locator('//button[@aria-label="Choose month and year"]').click({ force: true });
        await this.page.waitForTimeout(1000);

        await this.page.locator(`//td/button[@aria-label="${year}"]`).click({ force: true });
        await this.page.waitForTimeout(1000);

        await this.page.locator(`//span[contains(@class, "mat-calendar-body-cell-content") and contains(text(), "${month}")]`).click({ force: true });
        await this.page.waitForTimeout(1000);

        await this.page.locator(`//td[@role="gridcell"]/button[normalize-space()="${date}"]`).click({ force: true });
    }

    async selectView(view: string): Promise<void> {
        await this.page
            .locator(
                'mat-select[placeholder="View"], mat-select.calendar-view-select'
            )
            .click();
        await this.page.waitForTimeout(300);
        await this.page.locator(`mat-option:has-text("${view}")`).click();
    }

    async selectDateForEvent(date: string): Promise<void> {
        await this.page
            .locator(
                `//mwl-calendar-month-cell[contains(@class,"cal-in-month")]//div[contains(@class,"cal-cell-top")]//label[normalize-space()="${date}"]`
            )
            .click();
    }

    // ── Calendar: side navigation ─────────────────────────────────────

    /*async sideNavOption(option: string): Promise<void> {

        await this.page.locator(`//mat-panel-description[normalize-space()="${option}"]`).click();
    }*/
   async sideNavOption(option: string): Promise<void> {
    const panelHeader = this.page.getByRole('button', {name: option});

    await panelHeader.click({force:true});
    }

    // ── Calendar: alias management ────────────────────────────────────

    async selectCalendarForAlias(name: string): Promise<void> {
        await this.page
            .locator(`//div[@class="calendar-list-item" and contains(text(), "${name}")]`)
            .first()
            .click();
        await this.page.waitForTimeout(500);
    }

    async addAlias(name: string): Promise<void> {
        await this.page.locator('//span[@class="mdc-button__label" and contains(text(),"Add new alias")]').click()

        await this.page.locator("//input[@placeholder='Alias name']").fill(name);
        await this.page.locator('//mat-icon[@data-mat-icon-name="icon-input-check-mark"]').click({ force: true });
        await this.page.waitForTimeout(500);
    }
    async verifyAlias(name: string): Promise<void> {
        await expect(this.page.locator('//div[@class="alias-list-item"]').first()).toContainText(name);
    }
    async verifyAddedAlias(name: string): Promise<void> {
        await expect(this.page.locator('//div[@class="alias-list none"]').first()).toContainText(name);
    }

    async selectAlias(name: string): Promise<void> {
        await this.page.locator(`//div[normalize-space()="${name}"]`).first().click();
        await this.page.waitForTimeout(300);
    }

    async aliasOption(name:string,option: string): Promise<void> {
        await this.page.locator(`//div[normalize-space()="${name}"]/following::mat-icon[contains(text(), "more_vert")]`).click();
        await this.page.locator(`//button/span[@class = "mat-mdc-menu-item-text" and contains(text(),"${option}")]`).first().click();
        await this.page.waitForTimeout(300);
    }

    async editAlias(newName: string): Promise<void> {
        const input = this.page.locator(
            '//input[@placeholder="Alias name"]'
        );
        await input.clear();
        await input.fill(newName);
        await this.page
            .locator('//mat-icon[@data-mat-icon-name="icon-input-check-mark"]').click({ force: true });
        await this.page.waitForTimeout(500);
    };
    async reassignAliasTo(calendarName: string): Promise<void> {
        //await this.page.locator(`mat-option:has-text("${calendarName}")`).first().click();
        await this.page.getByRole('combobox', {name: "Calendar"}).click();
        await this.page.waitForTimeout(300);
        await this.page.locator(`mat-option:has-text("${calendarName}")`).first().click();
        await this.page.waitForTimeout(2000);
        await this.page.locator('//button/span[@class = "mdc-button__label" and contains(text(),"Reassign")]').click({ force: true });
        await this.page.waitForTimeout(500);
    }

    // ── Calendar: org model mapping ───────────────────────────────────

    async showEntityNames(): Promise<void> {
        await this.page
            .getByRole('checkbox').first().check();
        await this.page.waitForTimeout(300);
    }

    async expandOrgEntity(name: string): Promise<void> {
        await this.page.locator(`//button[@aria-label='toggle ${name}']`).first().click();
        await this.page.waitForTimeout(300);
    }

    async selectOrgEntity(name: string): Promise<void> {
        await this.page
            .locator(`//div[@title='${name}']`).first().click();
        await this.page.waitForTimeout(300);
    }

    async selectVersion(n: number): Promise<void> {
        await this.page
            .locator(`//div[contains(@class,"version-item")][${n}]`)
            .first()
            .click();
        await this.page.waitForTimeout(300);
    }
    async calendarselectVersion(n :string): Promise<void>{
         await this.page.getByRole('combobox', { name: 'Version' }).locator('svg').click();
        await this.page.getByRole('option', { name: n }).click();
    }
}
