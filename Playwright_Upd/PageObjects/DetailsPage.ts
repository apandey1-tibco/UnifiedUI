import { type Locator, type Page, request } from "@playwright/test";

export class DetailsPage {
  readonly page: Page;
  readonly finishBtn: Locator;
  constructor(page: Page) {
    this.page = page;
    this.finishBtn = page.getByRole("button", { name: "Finish" });
  }

  async cancelBtn() {
    return await this.page.getByRole("button", { name: "Cancel" });
  }
  async nextBtn() {
    return await this.page.getByRole("button", { name: "Next" });
  }
  async finishBtnClick() {
    await this.finishBtn.click();
  }

  async enterDetails(name: string, description: string) {
    await this.page.getByRole("textbox", { name: "Name" }).fill(name);
    await this.page
      .getByRole("textbox", { name: "Description" })
      .fill(description);
  }
}
module.exports = { DetailsPage };
