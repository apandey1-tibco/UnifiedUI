# Test info

- Name: Tear down BS >> Undeploy BS
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:108:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('button', { name: 'Go' }).first()

    at AdministratorPage.navigateToDeploymentManager (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\AdministratorPage.ts:49:42)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:112:5
```

# Page snapshot

```yaml
- text: 404 page not found
```

# Test source

```ts
   1 | import { type Locator, type Page, expect } from "@playwright/test";
   2 |
   3 | export class AdministratorPage {
   4 |   readonly page: Page;
   5 |   readonly goBtn: Locator;
   6 |   readonly prcoessManager: Locator;
   7 |   readonly haltedProcess: Locator;
   8 |   readonly filter: Locator;
   9 |   readonly packageName: Locator;
  10 |   readonly okButton: Locator;
  11 |   readonly startBtn: Locator;
  12 |   readonly AdministratorWelcomeTitle: Locator;
  13 |   readonly DeploymentManagerCard: Locator;
  14 |   readonly DeploymentManagerGoButton: Locator;
  15 |   readonly ProcessManagerGoButton: Locator;
  16 |   readonly ActiveTabTitle: Locator;
  17 |
  18 |   constructor(page: Page) {
  19 |     this.page = page;
  20 |     this.startBtn = page.getByRole("button", { name: "Start" }).first();
  21 |     this.prcoessManager = page.getByRole("link", { name: "Process Manager" });
  22 |     //this.haltedProcess = page.locator("#templates-container").locator('div[ng-reflect-message="Process Name : HaltRetryProjec"]').locator('button:has-text("Start")');
  23 |     this.haltedProcess = page
  24 |       .locator('div[class="process-list-item active ng-star-inserted"]')
  25 |       .getByRole("button", { name: "start" });
  26 |     this.filter = page
  27 |       .locator('div[class="search-icon-container"]')
  28 |       .locator('mat-icon[data-mat-icon-name="funnel"]');
  29 |     this.packageName = page.locator('input[formcontrolname="packageName"]');
  30 |     this.okButton = page.locator('button:has-text("OK")');
  31 |     this.AdministratorWelcomeTitle = page.locator('div.title');
  32 |     this.DeploymentManagerCard = page.locator("div:nth-child(1) > div.card-title");
  33 |     this.DeploymentManagerGoButton = page.getByRole('button', { name: 'Go' }).first();
  34 |     this.ProcessManagerGoButton = page.locator(
  35 |       "//div[normalize-space()='Process Manager']/following-sibling::div//button"
  36 |     ).first();
  37 |     this.ActiveTabTitle = page.getByRole('link', { name: 'Deployment Manager' });
  38 |   }
  39 |
  40 |   async getAdministratorWelcomeTitle(): Promise<Locator> {
  41 |     return this.AdministratorWelcomeTitle;
  42 |   }
  43 |
  44 |   async getDeploymentManangerCard(): Promise<Locator> {
  45 |     return this.DeploymentManagerCard;
  46 |   }
  47 |   async navigateToDeploymentManager() {
  48 |     await this.page.waitForLoadState("domcontentloaded");
> 49 |     await this.DeploymentManagerGoButton.click();
     |                                          ^ Error: locator.click: Target page, context or browser has been closed
  50 |     await this.page.waitForLoadState("networkidle");
  51 |     await this.page.waitForTimeout(2000);
  52 |   }
  53 |   async navigatetoProcessManager() {
  54 |     await this.prcoessManager.click();
  55 |   }
  56 |   async startHaltedPrcoess() {
  57 |     await this.haltedProcess.click();
  58 |   }
  59 |   async EnterPackageName(value: string): Promise<void> {
  60 |     await this.packageName.click();
  61 |     await this.packageName.fill(value);
  62 |     await this.page.waitForTimeout(2000);
  63 |   }
  64 |
  65 |   async startProcess(processName: string) {
  66 |     await this.filter.click();
  67 |     await this.page.waitForTimeout(2000);
  68 |     await this.packageName.fill(processName);
  69 |     await this.page.waitForTimeout(2000);
  70 |     await this.okButton.click();
  71 |     await this.startBtn.waitFor();
  72 |     await this.startBtn.click();
  73 |   }
  74 | }
  75 |
```