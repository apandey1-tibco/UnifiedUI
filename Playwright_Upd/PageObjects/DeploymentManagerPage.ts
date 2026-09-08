import { type Locator, type Page, request, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";
import { log } from "console";
export class DeploymentManagerPage {
  readonly page: Page;

  // Legacy camelCase properties (disk-only)
  readonly adminUrl: Locator;
  readonly newDeploymentBtn: Locator;
  readonly deployBtn: Locator;
  readonly allDeploymentTab: Locator;
  readonly undeploy: Locator;

  // Shared properties (same in both)
  readonly selectRascFileBtn: Locator;
  readonly undeployHeader: Locator;
  readonly yesUnDeployBtn: Locator;
  readonly deploymentTable: Locator;

  // PascalCase properties (attached)
  readonly NewDeploymentButton: Locator;
  readonly DeployButton: Locator;
  readonly AllDeploymentsTab: Locator;
  readonly Undeploy: Locator;
  readonly RascUploadVerficationText: Locator;
  readonly DragFileMenu: Locator;
  readonly DeployedAppList: Locator;
  readonly DependencyError_Dialogue_title: Locator;
  readonly DependencyError_Dialogue_msg: Locator;
  readonly DependencyError_Dialogue_btn: Locator;
  readonly DependencyError_Dialogue_closeIcon: Locator;
  readonly Undeploy_Dialogue_Conf_Msg: Locator;
  readonly Undeploy_Dialogue_Warning_Msg: Locator;
  readonly DeployBody: Locator;
  readonly tabLinks: Locator;

  constructor(page: Page) {
    this.page = page;

    // Legacy camelCase (disk-only)
    this.newDeploymentBtn = page.getByRole("button", { name: "New deployment" });
    this.deployBtn = page.getByRole("button", { name: "Deploy", exact: true });
    this.allDeploymentTab = page.getByText(" All Deployments ");
    this.undeploy = page.getByRole("menuitem", { name: "Undeploy" });

    // Shared
    this.selectRascFileBtn = page.getByRole("button", { name: "Select RASC file" });
    this.yesUnDeployBtn = page.getByRole("button", { name: "Yes, undeploy" });
    this.undeployHeader = page.locator(".msg-text");
    this.deploymentTable = page.locator(".mat-table.cdk-table.main-table");

    // PascalCase (attached)
    this.NewDeploymentButton = page.getByRole("button", { name: "New deployment" });
    this.DeployButton = page.getByRole("button", { name: "Deploy", exact: true });
    this.AllDeploymentsTab = page.getByText(" All Deployments ");
    this.Undeploy = page.getByRole("menuitem", { name: "Undeploy" });
    this.RascUploadVerficationText = page.locator('.file-name');
    this.DragFileMenu = page.locator('.file-select');
    this.DeployedAppList = page.locator('.cdk-table.main-table');
    this.DeployBody = page.locator('.deploy-body');
    this.DependencyError_Dialogue_title = page.getByText(' Error ').first();
    this.DependencyError_Dialogue_msg = page.getByText('Requirement not found [com.').first();
    this.DependencyError_Dialogue_btn = page.getByRole('button', { name: 'Dismiss' });
    this.DependencyError_Dialogue_closeIcon = page.locator('[class*="close"], button[aria-label*="close"], button[aria-label*="Close"]').first();
    this.Undeploy_Dialogue_Conf_Msg = page.locator('.msg-text');
    this.Undeploy_Dialogue_Warning_Msg = page.locator("//h3[normalize-space()='This action cannot be undone']");
    this.tabLinks = page.locator("span.tab-links");
  }

  async deployRascFiles(name: string, fileName: string) {
    await this.page.waitForTimeout(2000);
    const deployBodyText: string = await this.page
      .locator(".deploy-body")
      .innerText();

    if (new RegExp(`\\b${name}\\b`).test(deployBodyText)) {
      console.log(`${name} App is already deployed!`);
      await this.allDeploymentTab.click();
      await this.page.waitForTimeout(2000);
    } else {
      console.log(`Deploying the  Project ${name}`);
      await this.newDeploymentBtn.click();
      // Deploying the project
      await this.page.setInputFiles(
        'input[type="file"]',
        `./fixtures/${fileName}`
      );
      await this.deployBtn.click();
      const txtRasc = await this.getDragFileMenu();
      expect(await txtRasc.innerText()).toContain("Drag a RASC file");
      await this.allDeploymentTab.click();
      await this.page.waitForTimeout(2000);
    }
  }

  async purgeProcess(rascName: string) {
    await this.page
      .getByRole("row", { name: rascName })
      .getByRole("button")
      .click();
    await this.page.getByRole("menuitem", { name: "Details" }).click();
    await this.page.getByText("Process instances").click();
    //3 dots
    await this.page.locator("app-templates svg").click();
    await this.page.getByRole("menuitem", { name: "Purge" }).click();
    await this.page.getByRole("button", { name: "Yes, purge" }).click();
    await this.page.waitForTimeout(500);
  }

  async purgeProcesswithProcessName(rascName: string, processName: string) {
    await this.page
      .getByRole("row", { name: rascName })
      .getByRole("button")
      .click();
    await this.page.getByRole("menuitem", { name: "Details" }).click();
    await this.page.getByText("Process instances").click();
    //3 dots
    const processElement = this.page.locator(
      `div.process-title.dm-template-title:has-text("${processName}")`
    );

    const siblingElement = processElement.locator(
      `xpath=..//following-sibling::div[@class="process-meta-container"]`
    );
    await siblingElement.click();
    await this.page.getByRole("menuitem", { name: "Purge" }).click();
    await this.page.getByRole("button", { name: "Yes, purge" }).click();
    await this.page.waitForTimeout(500);
  }

  async deleteFilteredCase(
    fileName: string,
    orderName: string,
    orderState: string
  ) {
    await this.page
      .getByRole("row", { name: fileName })
      .getByRole("button")
      .click();
    await this.page.getByRole("menuitem", { name: "Details" }).click();
    await this.page.getByText("Case/Data models").click();
    await this.page
      .locator("#tab-switch")
      .getByText(orderName, { exact: true })
      .click();
    await this.page.locator("mat-toolbar").getByRole("button").nth(1).click();
    await this.page
      .locator("div")
      .filter({ hasText: /^Filter by State$/ })
      .nth(1)
      .click();
    await this.page.getByRole("option", { name: orderState }).click();
    await this.page.locator(".mat-datepicker-toggle").click();
    //await this.page.getByLabel("Open calendar").click();
    await this.page.locator(".mat-calendar-body-today").click();
    await this.page.getByRole("button", { name: "Apply" }).click();
    await this.page.getByRole("button", { name: "Delete cases" }).click();
    await this.page.getByRole("button", { name: "Yes, delete" }).click();
  }

  async undeployFiles(rascName: string) {
    await this.page
      .getByRole("row", { name: rascName })
      .getByRole("button")
      .click();
    await this.undeploy.click();
    //header verify
    expect(this.undeployHeader).toHaveText(
      "Are you sure you want to undeploy this file ?"
    );
    await this.yesUnDeployBtn.click();
    await this.page.waitForTimeout(2000);
    const deployBodyText: string = await this.page
      .locator(".deploy-body")
      .innerText();
    expect(deployBodyText).not.toContain(rascName);
  }

  async logout() {
    await this.page.locator(".nav-item.app-profile").click();
    await this.page.locator(".sign-out-label").click();
    await this.page.close();
  }

  // Sync parameterized locators (attached)
  DeployedAndUnDeployingCount(status: string): Locator {
    return this.page.locator(
      `//div[@class="icon-container"]/following::span[text()="${status}"]/following::span[1]`
    );
  }

  AppStatus(appName: string): Locator {
    return this.page.locator(
      `//mat-row//mat-cell[normalize-space()="${appName}"]/following-sibling::mat-cell[3]`
    );
  }

  AppType(appName: string): Locator {
    return this.page.locator(
      `//mat-row//mat-cell[normalize-space()="${appName}"]/following-sibling::mat-cell[5]`
    );
  }

  Action(appName: string): Locator {
    return this.page.locator(
      `//mat-row//mat-cell[normalize-space()="${appName}"]/following-sibling::mat-cell[6]//button`
    );
  }

  DeployedApp(appName: string): Locator {
    return this.DeployedAppList.locator(`text=${appName}`);
  }

  Undeploy_Dialogue_button(btnName: string): Locator {
    return this.page.getByRole('button', { name: btnName });
  }

  // Async getters (conflict resolution: use attached routing to properties/sync methods)
  async getDeployedAppList(): Promise<Locator> {
    return this.DeployedAppList;
  }

  async getDragFileMenu(): Promise<Locator> {
    return this.DragFileMenu;
  }

  async getAppType(appName: string): Promise<Locator> {
    return this.AppType(appName);
  }

  async getAppStatus(appName: string): Promise<Locator> {
    return this.AppStatus(appName);
  }

  async getAppVersion(appName: string): Promise<Locator> {
    return this.page.locator(
      `//mat-row//mat-cell[normalize-space()="${appName}"]/following-sibling::mat-cell[1]`
    );
  }

  async getAction(appName: string): Promise<Locator> {
    return this.Action(appName);
  }
}
