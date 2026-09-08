import { type Locator, type Page } from "@playwright/test";

export class WorkingHoursPage {
  readonly page: Page;
  readonly confirmTitle: Locator;
  readonly confirmButton: Locator;
  readonly workingHoursDialogTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.confirmTitle = page.locator('div.title');
    this.confirmButton = page.getByRole('button', {name: `Confirm`});
    this.workingHoursDialogTitle = page.locator('mat-dialog-container h2, mat-dialog-container [mat-dialog-title]');
  }
}
