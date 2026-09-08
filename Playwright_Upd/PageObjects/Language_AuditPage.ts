import { expect, Locator, Page } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class LanguageAuditPage {
  readonly page: Page;
  //Language main screen
  readonly setting: Locator;
  readonly settingmenu: Locator;
  readonly languageBtn: Locator;
  readonly languageTitle: Locator;
  readonly defaultLanguage : Locator;

  //Ad-hoc Activties
  readonly adhocActivites: Locator;
  readonly searchInputPlaceholder: Locator;

  //Audit list
  readonly auditList: Locator;
  readonly auditText: Locator;
  readonly auditTextField: Locator;
  readonly saveButton: Locator;

  //Audit Main Menu
  readonly audit: Locator;
  readonly headerTitle: Locator;

constructor(page: Page) {
    this.page = page;
    //Language main screen
    this.setting = page.locator('twc-icon[name="settings"]');
    this.settingmenu = page.locator('twc-menu[role$="menu"]');
    this.languageBtn = page.locator('twc-menu-item[value$="languages"]');
    this.languageTitle = page.locator('div[title = "Languages"]');
    this.defaultLanguage = page.locator('twc-list-item[value="en"]');

    this.adhocActivites = page.locator('twc-list-item[value="adhoctasks"]');
    this.searchInputPlaceholder = page.locator(".input-container").locator(".key-input-label").getByText("Search input placeholder");

    this.auditList = page.locator('twc-list-item[value="auditList"]');
    this.auditText = page.locator(".input-container").locator(".key-input-label").getByText("Audit");
    this.auditTextField = page.locator(".input-container").locator('twc-input').locator('input[id="input"]');
    this.saveButton = page.locator("bpme-language-keys").locator(".language-keys-container").locator(".keys-toolbar").locator("twc-button").first().locator("button");

    this.audit = page.locator("twc-navmenu-item#bpmAudit");
    this.headerTitle = page.locator('header').locator(".header__title");

}

  //Setting screen Navigation
  async clickOnSetting() {
    await this.page.waitForTimeout(1000);
    await this.setting.click();
  }
  async clickOnsettingMenu() {
    await this.page.waitForTimeout(1000);
    await this.settingmenu.click();
  }
  async clickOnLanguage() {
    await this.languageBtn.click();
  }
  async clickOnAuditListComponent(){
    await this.page.waitForTimeout(1000);
    await this.auditList.click();
  }
  async updatingTheFields_AuditList(){
    if(await this.auditTextField.isVisible())
    {
      await this.auditTextField.click();
      await this.auditTextField.pressSequentially(' updated');
    }
  }

  async clickOnSaveButton(){
    await this.page.waitForTimeout(4000);
    await this.saveButton.click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnAudit() {
    await this.page.waitForTimeout(1000);
    await this.audit.click();
  }
  async verifyTheUpdatedFields_AuditList() {
    await this.page.waitForTimeout(3000);
    if (!(await this.headerTitle.isVisible())) {
      throw new Error("Header title is not visible");
    }
    return await this.headerTitle.innerText();
  }
  async revertTheUpdatedFields_AuditList(){
    await this.auditTextField.click();
    for (let i = 0; i < 8; i++)
    {
      await this.auditTextField.press('Backspace');
    }
  }
}