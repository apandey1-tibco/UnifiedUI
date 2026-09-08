# Test info

- Name: Tear down BS >> Undeploy BS
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:107:7

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "BS_AllTypes"
Received string:        "All Deployments
New Deployment
New deployment
Name
Version
ID
Status
Deployed
Application Type
Action
emailErrors
1.12.0.20260210061909822
155
Deployed
a few seconds ago
Process
more_vert
emailEmbedded
1.8.0.20260603104300756
154
Deployed
a minute ago
Process
more_vert
emailEmbeddedModel
1.6.0.20260210061903739
153
Deployed
a minute ago
Data
more_vert
emailbom
1.8.0.20260603104241545
152
Deployed
2 minutes ago
Process
more_vert
emailbomModel
1.6.0.20260210061853650
151
Deployed
2 minutes ago
Data
more_vert
emailAttachments
1.17.0.20260210061843633
150
Deployed
2 minutes ago
Process
more_vert
EmailArray
1.12.0.20260603104247671
149
Deployed
3 minutes ago
Process
more_vert
BB-Process
1.0.0.20230511103050688
148
Deployed
3 minutes ago
Process
more_vert
BB-Main
1.0.0.20230511103050553
147
Deployed
4 minutes ago
Data
more_vert
BB-Reference
1.0.0.20230511103050790
146
Deployed
4 minutes ago
Data
more_vert
BS_simple
1.1.0.20251222081701986
3
Deployed
an hour ago
Process
more_vert
BS_AllTypes
1.0.0.20241118064524597
2
Undeploying
2 hours ago
Process
more_vert"
    at DeploymentManagerPage.undeployFiles (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\DeploymentManagerPage.ts:174:32)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:112:5
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
  - row "emailErrors 1.12.0.20260210061909822 155 Deployed a few seconds ago process":
    - cell "emailErrors"
    - cell "1.12.0.20260210061909822"
    - cell "155"
    - cell "Deployed"
    - cell "a few seconds ago"
    - cell "process"
    - cell:
      - button
  - row "emailEmbedded 1.8.0.20260603104300756 154 Deployed a minute ago process":
    - cell "emailEmbedded"
    - cell "1.8.0.20260603104300756"
    - cell "154"
    - cell "Deployed"
    - cell "a minute ago"
    - cell "process"
    - cell:
      - button
  - row "emailEmbeddedModel 1.6.0.20260210061903739 153 Deployed a minute ago data":
    - cell "emailEmbeddedModel"
    - cell "1.6.0.20260210061903739"
    - cell "153"
    - cell "Deployed"
    - cell "a minute ago"
    - cell "data"
    - cell:
      - button
  - row "emailbom 1.8.0.20260603104241545 152 Deployed 2 minutes ago process":
    - cell "emailbom"
    - cell "1.8.0.20260603104241545"
    - cell "152"
    - cell "Deployed"
    - cell "2 minutes ago"
    - cell "process"
    - cell:
      - button
  - row "emailbomModel 1.6.0.20260210061853650 151 Deployed 2 minutes ago data":
    - cell "emailbomModel"
    - cell "1.6.0.20260210061853650"
    - cell "151"
    - cell "Deployed"
    - cell "2 minutes ago"
    - cell "data"
    - cell:
      - button
  - row "emailAttachments 1.17.0.20260210061843633 150 Deployed 2 minutes ago process":
    - cell "emailAttachments"
    - cell "1.17.0.20260210061843633"
    - cell "150"
    - cell "Deployed"
    - cell "2 minutes ago"
    - cell "process"
    - cell:
      - button
  - row "EmailArray 1.12.0.20260603104247671 149 Deployed 3 minutes ago process":
    - cell "EmailArray"
    - cell "1.12.0.20260603104247671"
    - cell "149"
    - cell "Deployed"
    - cell "3 minutes ago"
    - cell "process"
    - cell:
      - button
  - row "BB-Process 1.0.0.20230511103050688 148 Deployed 3 minutes ago process":
    - cell "BB-Process"
    - cell "1.0.0.20230511103050688"
    - cell "148"
    - cell "Deployed"
    - cell "3 minutes ago"
    - cell "process"
    - cell:
      - button
  - row "BB-Main 1.0.0.20230511103050553 147 Deployed 4 minutes ago data":
    - cell "BB-Main"
    - cell "1.0.0.20230511103050553"
    - cell "147"
    - cell "Deployed"
    - cell "4 minutes ago"
    - cell "data"
    - cell:
      - button
  - row "BB-Reference 1.0.0.20230511103050790 146 Deployed 4 minutes ago data":
    - cell "BB-Reference"
    - cell "1.0.0.20230511103050790"
    - cell "146"
    - cell "Deployed"
    - cell "4 minutes ago"
    - cell "data"
    - cell:
      - button
  - row "BS_simple 1.1.0.20251222081701986 3 Deployed an hour ago process":
    - cell "BS_simple"
    - cell "1.1.0.20251222081701986"
    - cell "3"
    - cell "Deployed"
    - cell "an hour ago"
    - cell "process"
    - cell:
      - button
  - row "BS_AllTypes 1.0.0.20241118064524597 2 Undeploying 2 hours ago process":
    - cell "BS_AllTypes"
    - cell "1.0.0.20241118064524597"
    - cell "2"
    - cell "Undeploying"
    - cell "2 hours ago"
    - cell "process"
    - cell:
      - button
- iframe
- text: BS_AllType... undeploy request submitted successfully
```

# Test source

```ts
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
  163 |       .click();
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
> 174 |     expect(deployBodyText).not.toContain(rascName);
      |                                ^ Error: expect(received).not.toContain(expected) // indexOf
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