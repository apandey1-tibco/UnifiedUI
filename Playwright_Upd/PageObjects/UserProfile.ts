import { type Locator, type Page, request, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
export class UserProfilePage {
  readonly page: Page;
  readonly userProfile: Locator;
  readonly userProfileClose: Locator;
  readonly themesSwitcher: Locator;
  readonly languageSwitcher: Locator;
  readonly signOut: Locator;
  readonly productNameVersion: Locator;
  readonly productVersion: Locator

  readonly applicationSwitcher: Locator;
  

  // readonly UserProfile: Locator;
  constructor(page: Page) {
    this.page = page;
    this.userProfile = page.locator("twc-icon[name='user-profile']")
    this.userProfileClose = page.locator("div[class='profile-close-group']")
    this.themesSwitcher = page.locator("twc-categoriser[label='Themes']")
    this.languageSwitcher  = page.locator("twc-categoriser[label='Languages']")
    this.signOut = page.locator("div[part='user-profile-signout']")
    this.productNameVersion = page.locator("div[part='user-profile-version']")
    this.productVersion = page.locator("div[part='user-profile-copy']")

    //Navbar Header Tools Locators
    this.applicationSwitcher = page.locator("twc-icon[class='applications-icon']")
  }
}