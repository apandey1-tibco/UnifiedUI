# Test info

- Name: Tear down BS >> Undeploy BS
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:108:7

# Error details

```
Error: locator.click: Error: strict mode violation: getByRole('row', { name: 'BS_AllTypes' }).getByRole('button') resolved to 2 elements:
    1) <button mat-icon-button="" aria-haspopup="menu" aria-expanded="false" _ngcontent-ng-c2513059460="" mat-ripple-loader-centered="" mat-ripple-loader-disabled="" mat-ripple-loader-uninitialized="" mat-ripple-loader-class-name="mat-mdc-button-ripple" class="mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-menu-trigger mat-unthemed">…</button> aka getByRole('row', { name: 'BS_AllTypesEx 1.1.0.' }).getByRole('button')
    2) <button mat-icon-button="" aria-haspopup="menu" aria-expanded="false" _ngcontent-ng-c2513059460="" mat-ripple-loader-centered="" mat-ripple-loader-disabled="" mat-ripple-loader-uninitialized="" mat-ripple-loader-class-name="mat-mdc-button-ripple" class="mdc-icon-button mat-mdc-icon-button mat-mdc-button-base mat-mdc-menu-trigger mat-unthemed">…</button> aka getByRole('row', { name: 'BS_AllTypes 1.2.0.' }).getByRole('button')

Call log:
  - waiting for getByRole('row', { name: 'BS_AllTypes' }).getByRole('button')

    at DeploymentManagerPage.undeployFiles (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\DeploymentManagerPage.ts:163:8)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:113:18
```

# Page snapshot

```yaml
- img
- text: Administrator
- button
- button
- button
- img "home icon": home
- img "home icon": more_vert
- navigation:
  - link "Deployment Manager":
    - /url: "#/deploy-manager"
  - link "Shared Resources Manager":
    - /url: "#/Shared-Resources-Container"
  - link "Process Manager":
    - /url: "#/process-manager"
  - link "Integrate Your App":
    - /url: "#/dashboard"
  - link "Configuration Management":
    - /url: "#/property-management"
- text: "Deployment metrics: Deployed Undeploying"
- separator
- text: "Application metrics: All"
- button
- navigation:
  - link "All Deployments":
    - /url: "#/deploy-manager/all"
  - link "New Deployment":
    - /url: "#/deploy-manager/new"
- button "New deployment"
- table:
  - row "Name Version ID Status Deployed Application Type Action":
    - columnheader "Name"
    - columnheader "Version"
    - columnheader "ID"
    - columnheader "Status"
    - columnheader "Deployed"
    - columnheader "Application Type"
    - columnheader "Action"
  - row "retryfailure 1.0.0.20251030094253058 78 Deployed 15 hours ago process":
    - cell "retryfailure"
    - cell "1.0.0.20251030094253058"
    - cell "78"
    - cell "Deployed"
    - cell "15 hours ago"
    - cell "process"
    - cell:
      - button
  - row "com.abnamro.nl.pmt.entrypoints.bs 1.0.0.20260817071333876 77 Deployed 22 hours ago process":
    - cell "com.abnamro.nl.pmt.entrypoints.bs"
    - cell "1.0.0.20260817071333876"
    - cell "77"
    - cell "Deployed"
    - cell "22 hours ago"
    - cell "process"
    - cell:
      - button
  - row "com.abnamro.nl.pmt.jqueryui.bom 1.0.0.20260817071338416 76 Deployed 22 hours ago data":
    - cell "com.abnamro.nl.pmt.jqueryui.bom"
    - cell "1.0.0.20260817071338416"
    - cell "76"
    - cell "Deployed"
    - cell "22 hours ago"
    - cell "data"
    - cell:
      - button
  - row "deepCopyBusinessService 1.0.0.20260129062214718 75 Deployed a day ago process":
    - cell "deepCopyBusinessService"
    - cell "1.0.0.20260129062214718"
    - cell "75"
    - cell "Deployed"
    - cell "a day ago"
    - cell "process"
    - cell:
      - button
  - row "deepCopyDataModel 1.0.0.20260129062217070 74 Deployed a day ago data":
    - cell "deepCopyDataModel"
    - cell "1.0.0.20260129062217070"
    - cell "74"
    - cell "Deployed"
    - cell "a day ago"
    - cell "data"
    - cell:
      - button
  - row "Test_BusinessService 1.0.0.20250731063004495 73 Deployed a day ago process":
    - cell "Test_BusinessService"
    - cell "1.0.0.20250731063004495"
    - cell "73"
    - cell "Deployed"
    - cell "a day ago"
    - cell "process"
    - cell:
      - button
  - row "UserIDIndependentBS 1.2.0.20251222081702596 72 Deployed a day ago process":
    - cell "UserIDIndependentBS"
    - cell "1.2.0.20251222081702596"
    - cell "72"
    - cell "Deployed"
    - cell "a day ago"
    - cell "process"
    - cell:
      - button
  - row "BOM_UserIDIndependentBS 1.1.0.20251222081701740 70 Deployed a day ago data":
    - cell "BOM_UserIDIndependentBS"
    - cell "1.1.0.20251222081701740"
    - cell "70"
    - cell "Deployed"
    - cell "a day ago"
    - cell "data"
    - cell:
      - button
  - row "BS_AllTypesEx 1.1.0.20251222081701824 69 Deployed a day ago process":
    - cell "BS_AllTypesEx"
    - cell "1.1.0.20251222081701824"
    - cell "69"
    - cell "Deployed"
    - cell "a day ago"
    - cell "process"
    - cell:
      - button
  - row "BOM_AllTypesEx 1.1.0.20251222081642843 68 Deployed a day ago data":
    - cell "BOM_AllTypesEx"
    - cell "1.1.0.20251222081642843"
    - cell "68"
    - cell "Deployed"
    - cell "a day ago"
    - cell "data"
    - cell:
      - button
  - row "BS_AllTypes 1.2.0.20251222081701783 67 Deployed a day ago process":
    - cell "BS_AllTypes"
    - cell "1.2.0.20251222081701783"
    - cell "67"
    - cell "Deployed"
    - cell "a day ago"
    - cell "process"
    - cell:
      - button
  - row "OrgModelPart1ACE 1.2.0.20251117055443037 66 Deployed a day ago organization":
    - cell "OrgModelPart1ACE"
    - cell "1.2.0.20251117055443037"
    - cell "66"
    - cell "Deployed"
    - cell "a day ago"
    - cell "organization"
    - cell:
      - button
  - row "OrgNew 1.3.0.20251222081702467 65 Deployed a day ago organization":
    - cell "OrgNew"
    - cell "1.3.0.20251222081702467"
    - cell "65"
    - cell "Deployed"
    - cell "a day ago"
    - cell "organization"
    - cell:
      - button
  - row "GeneratedBOMProcess 1.0.0.20250915083331650 64 Deployed a day ago process":
    - cell "GeneratedBOMProcess"
    - cell "1.0.0.20250915083331650"
    - cell "64"
    - cell "Deployed"
    - cell "a day ago"
    - cell "process"
    - cell:
      - button
  - row "SwaggertoBOMservice 1.0.0.20250915083337993 63 Deployed a day ago data":
    - cell "SwaggertoBOMservice"
    - cell "1.0.0.20250915083337993"
    - cell "63"
    - cell "Deployed"
    - cell "a day ago"
    - cell "data"
    - cell:
      - button
- iframe
```

# Test source

```ts
   63 |     this.DependencyError_Dialogue_btn = page.getByRole('button', { name: 'Dismiss' });
   64 |     this.DependencyError_Dialogue_closeIcon = page.locator('[class*="close"], button[aria-label*="close"], button[aria-label*="Close"]').first();
   65 |     this.Undeploy_Dialogue_Conf_Msg = page.locator('.msg-text');
   66 |     this.Undeploy_Dialogue_Warning_Msg = page.locator("//h3[normalize-space()='This action cannot be undone']");
   67 |     this.tabLinks = page.locator("span.tab-links");
   68 |   }
   69 |
   70 |   async deployRascFiles(name: string, fileName: string) {
   71 |     await this.page.waitForTimeout(2000);
   72 |     const deployBodyText: string = await this.page
   73 |       .locator(".deploy-body")
   74 |       .innerText();
   75 |
   76 |     if (deployBodyText.includes(name)) {
   77 |       console.log(`${name} App is already deployed!`);
   78 |     } else {
   79 |       console.log(`Deploying the  Project ${name}`);
   80 |       await this.newDeploymentBtn.click();
   81 |       // Deploying the project
   82 |       await this.page.setInputFiles(
   83 |         'input[type="file"]',
   84 |         `./fixtures/${fileName}`
   85 |       );
   86 |       await this.deployBtn.click();
   87 |       const txtRasc = await this.getDragFileMenu();
   88 |       expect(await txtRasc.innerText()).toContain("Drag a RASC file");
   89 |       await this.allDeploymentTab.click();
   90 |       await this.page.waitForTimeout(2000);
   91 |     }
   92 |   }
   93 |
   94 |   async purgeProcess(rascName: string) {
   95 |     await this.page
   96 |       .getByRole("row", { name: rascName })
   97 |       .getByRole("button")
   98 |       .click();
   99 |     await this.page.getByRole("menuitem", { name: "Details" }).click();
  100 |     await this.page.getByText("Process instances").click();
  101 |     //3 dots
  102 |     await this.page.locator("app-templates svg").click();
  103 |     await this.page.getByRole("menuitem", { name: "Purge" }).click();
  104 |     await this.page.getByRole("button", { name: "Yes, purge" }).click();
  105 |     await this.page.waitForTimeout(500);
  106 |   }
  107 |
  108 |   async purgeProcesswithProcessName(rascName: string, processName: string) {
  109 |     await this.page
  110 |       .getByRole("row", { name: rascName })
  111 |       .getByRole("button")
  112 |       .click();
  113 |     await this.page.getByRole("menuitem", { name: "Details" }).click();
  114 |     await this.page.getByText("Process instances").click();
  115 |     //3 dots
  116 |     const processElement = this.page.locator(
  117 |       `div.process-title.dm-template-title:has-text("${processName}")`
  118 |     );
  119 |
  120 |     const siblingElement = processElement.locator(
  121 |       `xpath=..//following-sibling::div[@class="process-meta-container"]`
  122 |     );
  123 |     await siblingElement.click();
  124 |     await this.page.getByRole("menuitem", { name: "Purge" }).click();
  125 |     await this.page.getByRole("button", { name: "Yes, purge" }).click();
  126 |     await this.page.waitForTimeout(500);
  127 |   }
  128 |
  129 |   async deleteFilteredCase(
  130 |     fileName: string,
  131 |     orderName: string,
  132 |     orderState: string
  133 |   ) {
  134 |     await this.page
  135 |       .getByRole("row", { name: fileName })
  136 |       .getByRole("button")
  137 |       .click();
  138 |     await this.page.getByRole("menuitem", { name: "Details" }).click();
  139 |     await this.page.getByText("Case/Data models").click();
  140 |     await this.page
  141 |       .locator("#tab-switch")
  142 |       .getByText(orderName, { exact: true })
  143 |       .click();
  144 |     await this.page.locator("mat-toolbar").getByRole("button").nth(1).click();
  145 |     await this.page
  146 |       .locator("div")
  147 |       .filter({ hasText: /^Filter by State$/ })
  148 |       .nth(1)
  149 |       .click();
  150 |     await this.page.getByRole("option", { name: orderState }).click();
  151 |     await this.page.locator(".mat-datepicker-toggle").click();
  152 |     //await this.page.getByLabel("Open calendar").click();
  153 |     await this.page.locator(".mat-calendar-body-today").click();
  154 |     await this.page.getByRole("button", { name: "Apply" }).click();
  155 |     await this.page.getByRole("button", { name: "Delete cases" }).click();
  156 |     await this.page.getByRole("button", { name: "Yes, delete" }).click();
  157 |   }
  158 |
  159 |   async undeployFiles(rascName: string) {
  160 |     await this.page
  161 |       .getByRole("row", { name: rascName })
  162 |       .getByRole("button")
> 163 |       .click();
      |        ^ Error: locator.click: Error: strict mode violation: getByRole('row', { name: 'BS_AllTypes' }).getByRole('button') resolved to 2 elements:
  164 |     await this.undeploy.click();
  165 |     //header verify
  166 |     expect(this.undeployHeader).toHaveText(
  167 |       "Are you sure you want to undeploy this file ?"
  168 |     );
  169 |     await this.yesUnDeployBtn.click();
  170 |     await this.page.waitForTimeout(2000);
  171 |     const deployBodyText: string = await this.page
  172 |       .locator(".deploy-body")
  173 |       .innerText();
  174 |     expect(deployBodyText).not.toContain(rascName);
  175 |   }
  176 |
  177 |   async logout() {
  178 |     await this.page.locator(".nav-item.app-profile").click();
  179 |     await this.page.locator(".sign-out-label").click();
  180 |     await this.page.close();
  181 |   }
  182 |
  183 |   // Sync parameterized locators (attached)
  184 |   DeployedAndUnDeployingCount(status: string): Locator {
  185 |     return this.page.locator(
  186 |       `//div[@class="icon-container"]/following::span[text()="${status}"]/following::span[1]`
  187 |     );
  188 |   }
  189 |
  190 |   AppStatus(appName: string): Locator {
  191 |     return this.page.locator(
  192 |       `//mat-row//mat-cell[normalize-space()="${appName}"]/following-sibling::mat-cell[3]`
  193 |     );
  194 |   }
  195 |
  196 |   AppType(appName: string): Locator {
  197 |     return this.page.locator(
  198 |       `//mat-row//mat-cell[normalize-space()="${appName}"]/following-sibling::mat-cell[5]`
  199 |     );
  200 |   }
  201 |
  202 |   Action(appName: string): Locator {
  203 |     return this.page.locator(
  204 |       `//mat-row//mat-cell[normalize-space()="${appName}"]/following-sibling::mat-cell[6]//button`
  205 |     );
  206 |   }
  207 |
  208 |   DeployedApp(appName: string): Locator {
  209 |     return this.DeployedAppList.locator(`text=${appName}`);
  210 |   }
  211 |
  212 |   Undeploy_Dialogue_button(btnName: string): Locator {
  213 |     return this.page.getByRole('button', { name: btnName });
  214 |   }
  215 |
  216 |   // Async getters (conflict resolution: use attached routing to properties/sync methods)
  217 |   async getDeployedAppList(): Promise<Locator> {
  218 |     return this.DeployedAppList;
  219 |   }
  220 |
  221 |   async getDragFileMenu(): Promise<Locator> {
  222 |     return this.DragFileMenu;
  223 |   }
  224 |
  225 |   async getAppType(appName: string): Promise<Locator> {
  226 |     return this.AppType(appName);
  227 |   }
  228 |
  229 |   async getAppStatus(appName: string): Promise<Locator> {
  230 |     return this.AppStatus(appName);
  231 |   }
  232 |
  233 |   async getAppVersion(appName: string): Promise<Locator> {
  234 |     return this.page.locator(
  235 |       `//mat-row//mat-cell[normalize-space()="${appName}"]/following-sibling::mat-cell[1]`
  236 |     );
  237 |   }
  238 |
  239 |   async getAction(appName: string): Promise<Locator> {
  240 |     return this.Action(appName);
  241 |   }
  242 | }
  243 |
```