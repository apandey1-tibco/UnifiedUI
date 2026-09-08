import { type Locator, type Page, request } from "@playwright/test";
export class LoginPage {
  readonly page: Page;
  // readonly workManagerUrl: Locator;
  constructor(page: Page) {
    this.page = page;
  }

  async login(username: string, password: string) {
    /*await this.page.goto("http://10.64.197.35/userapps/bpmeapp/#/login");*/
    await this.page.goto("http://gasdbpmc2ebld01.dev.tibco.com/apps/bpmeapp/#/login");
    await this.page
      .locator('input[placeholder="Username"]')
      .pressSequentially(username, { delay: 100 });
    await this.page
      .locator('input[type="password"]')
      .pressSequentially(password, { delay: 100 });
    await this.page
      .getByRole("button", { name: "Sign in", exact: true })
      .click();
    await this.page.waitForLoadState("domcontentloaded");
  }
  async navigateToWorkManagerUrl(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState("domcontentloaded");
  }
  //   async addCokkiesLogin() {
  //
  //   }
}
module.exports = { LoginPage };
