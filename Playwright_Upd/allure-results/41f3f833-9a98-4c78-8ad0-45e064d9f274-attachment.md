# Test info

- Name: Buisness Services Regression suite >> Verify submitted data
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:83:7

# Error details

```
Error: locator.hover: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('cell', { name: 'BS_AllTypes' }).last()

    at HomePage.openWorklist (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\HomePage.ts:73:62)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:87:20
```

# Test source

```ts
   1 | import { type Locator, type Page } from "@playwright/test";
   2 | import * as utility from "../fixtures/utility";
   3 |
   4 | export class HomePage {
   5 |   page: Page;
   6 |   readonly myWork: Locator;
   7 |   readonly myWorkViews: Locator;
   8 |   readonly createWorkViewBtn: Locator;
   9 |   readonly buisnessServices: Locator;
   10 |   readonly caseManager: Locator;
   11 |   readonly BS_Simple: Locator;
   12 |   readonly cancelBtn: Locator;
   13 |   readonly submitBtn: Locator;
   14 |   readonly closeBtn: Locator;
   15 |   readonly open: Locator;
   16 |
   17 |   constructor(page: Page) {
   18 |     this.page = page;
   19 |     this.cancelBtn = page.getByTitle("Cancel");
   20 |     this.submitBtn = page.getByTitle("Submit");
   21 |     this.closeBtn = page.getByTitle("Close");
   22 |     this.myWork = page
   23 |       .locator("twc-navmenu-item")
   24 |       .filter({ hasText: "My Work" })
   25 |       .locator("svg");
   26 |     this.caseManager = page
   27 |       .locator("twc-navmenu-item")
   28 |       .filter({ hasText: "Case Manager" })
   29 |       .locator("svg");
   30 |     this.myWorkViews = page.getByText("Work views", { exact: true });
   31 |     this.createWorkViewBtn = page
   32 |       .locator("twc-toolbar-item")
   33 |       .filter({ hasText: "Create Create" })
   34 |       .locator("path");
   35 |     this.buisnessServices = page.locator("#bpmBizServices svg");
   36 |     this.BS_Simple = page
   37 |       .locator("div")
   38 |       .filter({ hasText: /^SampleBPMOrderProject$/ });
   39 |     this.open = page.getByRole("button", { name: "Open" });
   40 |   }
   41 |
   42 |   async clickOnCancelBtn() {
   43 |     await this.cancelBtn.click();
   44 |   }
   45 |   async clickOnSubmitBtn() {
   46 |     await this.submitBtn.click();
   47 |   }
   48 |   async clickMyWork() {
   49 |     await this.myWork.click();
   50 |     await this.page.waitForLoadState("domcontentloaded");
   51 |     await this.page.locator("twc-table-row").first().waitFor();
   52 |   }
   53 |
   54 |   async clickCaseManager() {
   55 |     await this.caseManager.click();
   56 |     await this.page.waitForLoadState("domcontentloaded");
   57 |     await this.page.locator("twc-table-row").first().waitFor();
   58 |   }
   59 |
   60 |   async clickOnWorkViews() {
   61 |     await this.myWorkViews.click();
   62 |   }
   63 |   async clickOnSampleOrderProcess() {
   64 |     //star icon
   65 |     await this.page.getByText("SampleBPMOrderProject-Process").click();
   66 |   }
   67 |   async clickOnCreateWorkiView() {
   68 |     await this.createWorkViewBtn.click();
   69 |   }
   70 |
   71 |   // opens the worklist
   72 |   async openWorklist(name: string) {
>  73 |     await this.page.getByRole("cell", { name: name }).last().hover();
      |                                                              ^ Error: locator.hover: Target page, context or browser has been closed
   74 |     await this.open.click();
   75 |   }
   76 |   async isWorkItemPresent(name: string): Promise<Boolean> {
   77 |     return await this.page.getByRole("cell", { name: name }).last().isVisible();
   78 |   }
   79 |   async workViewDropdown(value: string) {
   80 |     await this.page.getByRole("combobox").click();
   81 |     await this.page
   82 |       .getByRole("option", { name: value })
   83 |       .locator("slot")
   84 |       .nth(1)
   85 |       .click();
   86 |   }
   87 |   async deleteWorkView(name: string) {
   88 |     await this.page
   89 |       .getByRole("menuitem", { name: name })
   90 |       .getByLabel("More")
   91 |       .click();
   92 |     await this.page
   93 |       .getByRole("menuitem", { name: "Delete" })
   94 |       .locator("div")
   95 |       .first()
   96 |       .click();
   97 |   }
   98 |   async clickOnYes() {
   99 |     await this.page.getByRole("button", { name: "Yes" }).click();
  100 |   }
  101 |   async clickOnBuisnessService() {
  102 |     await this.buisnessServices.click();
  103 |   }
  104 |
  105 |   async goToWorkManagerUrl(url: string) {
  106 |     await this.page.goto(url);
  107 |     await this.page.waitForLoadState("domcontentloaded");
  108 |   }
  109 |
  110 |   async clickOnSampleOrder() {
  111 |     await this.page.getByText("SampleBPMOrderProject").first().click();
  112 |     await this.page
  113 |       .locator("#item_SampleBPMOrderProject")
  114 |       .getByText("SampleBPMOrderProject", { exact: true })
  115 |       .click();
  116 |     await this.page.getByText("SampleBPMOrderProject-Process").click();
  117 |   }
  118 | }
  119 | module.exports = { HomePage };
  120 |
```