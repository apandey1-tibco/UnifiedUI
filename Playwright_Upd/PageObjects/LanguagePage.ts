import { expect, Locator, Page } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class LanguagePage {
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

  readonly applicationsSwitcher: Locator;
  readonly auditDetailsManagedObjects: Locator;
  readonly auditListManagedObjects: Locator;
  readonly businessService: Locator;
  readonly caseAudit: Locator;
  readonly caseDetails: Locator;
  readonly caseDocumentsViewer: Locator;
  readonly caseDocuments: Locator;
  readonly caseLinkedCases: Locator;


constructor(page: Page) {
    this.page = page;
    //Language main screen
    this.setting = page.locator('twc-icon[name="settings"]');
    this.settingmenu = page.locator('twc-menu[role$="menu"]');
    this.languageBtn = page.locator('twc-menu-item[value$="languages"]');
    this.languageTitle = page.locator('div[title = "Languages"]');
    this.defaultLanguage = page.locator('twc-list-item[value="en"]');
    
    //Ad-hoc Activties
    this.adhocActivites = page.locator('twc-list-item[value="adhoctasks"]');
    this.searchInputPlaceholder = page.locator(".input-container").locator(".key-input-label").getByText("Search input placeholder");

    this.applicationsSwitcher = page.locator('twc-list-item[value="applicationsSwitcher"]');
    this.auditDetailsManagedObjects = page.locator('twc-list-item[value="auditDetailsManagedObjects"]');
    this.auditListManagedObjects = page.locator('twc-list-item[value="auditListManagedObjects"]');
    this.businessService = page.locator('twc-list-item[value="businessService"]');
    this.caseAudit = page.locator('twc-list-item[value="caseAudit"]');
    this.caseDetails = page.locator('twc-list-item[value="caseDetails"]');
    this.caseDocumentsViewer = page.locator('twc-list-item[value="caseDocumentsViewer"]');
    this.caseDocuments = page.locator('twc-list-item[value="caseDocuments"]');
    this.caseLinkedCases = page.locator('twc-list-item[value="caseLinkedCases"]');
}

  //Setting scree Navigation
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
}