import { type Locator, type Page, expect } from "@playwright/test";

export class AdministratorPage {
  readonly page: Page;
  readonly goBtn: Locator;
  readonly prcoessManager: Locator;
  readonly haltedProcess: Locator;
  readonly filter: Locator;
  readonly packageName: Locator;
  readonly processName: Locator;
  readonly okButton: Locator;
  readonly startBtn: Locator;
  readonly AdministratorWelcomeTitle: Locator;
  readonly DeploymentManagerCard: Locator;
  readonly DeploymentManagerGoButton: Locator;
  readonly ProcessManagerGoButton: Locator;
  readonly ActiveTabTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.startBtn = page.getByRole("button", { name: "Start" }).first();
    this.prcoessManager = page.getByRole("link", { name: "Process Manager" });
    //this.haltedProcess = page.locator("#templates-container").locator('div[ng-reflect-message="Process Name : HaltRetryProjec"]').locator('button:has-text("Start")');
    this.haltedProcess = page
      .locator('div[class="process-list-item active ng-star-inserted"]')
      .getByRole("button", { name: "start" });
    this.filter = page
      .locator('div[class="search-icon-container"]')
      .locator('mat-icon[data-mat-icon-name="funnel"]');
    this.packageName = page.locator('input[formcontrolname="packageName"]');
    this.processName = page.locator('input[formcontrolname="processName"]');
    this.okButton = page.locator('button:has-text("OK")');
    this.AdministratorWelcomeTitle = page.locator('div.title');
    this.DeploymentManagerCard = page.locator("div:nth-child(1) > div.card-title");
    this.DeploymentManagerGoButton = page.getByRole('button', { name: 'Go' }).first();
    this.ProcessManagerGoButton = page.locator(
      "//div[normalize-space()='Process Manager']/following-sibling::div//button"
    ).first();
    this.ActiveTabTitle = page.getByRole('link', { name: 'Deployment Manager' });
  }

  async getAdministratorWelcomeTitle(): Promise<Locator> {
    return this.AdministratorWelcomeTitle;
  }

  async getDeploymentManangerCard(): Promise<Locator> {
    return this.DeploymentManagerCard;
  }
  async navigateToDeploymentManager() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.DeploymentManagerGoButton.click();
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(2000);
  }
  async navigatetoProcessManager() {
    await this.prcoessManager.click();
  }
  async startHaltedPrcoess() {
    await this.haltedProcess.click();
  }
  async EnterPackageName(value: string): Promise<void> {
    await this.packageName.click();
    await this.packageName.fill(value);
    await this.page.waitForTimeout(2000);
  }

  async startProcess(processName: string) {
    await this.filter.click();
    await this.page.waitForTimeout(2000);
    await this.packageName.fill(processName);
    await this.page.waitForTimeout(2000);
    await this.okButton.click();
    await this.startBtn.waitFor();
    await this.startBtn.click();
  }

  async startProcessByName(processName: string) {
    await this.filter.click();
    await this.page.waitForTimeout(2000);
    await this.processName.fill(processName);
    await this.page.waitForTimeout(2000);
    await this.okButton.click();
    await this.startBtn.waitFor();
    await this.startBtn.click();
  }
}
