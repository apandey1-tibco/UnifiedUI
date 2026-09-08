# Test info

- Name: Pre requisite LDAP - to test Case Manager  >> Delete Ldap container
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:592:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByRole('option', { name: '2203_Automation' })

    at OrgBrowserPage.selectServer (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\OrgBrowserPage.ts:245:63)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:594:5
```

# Page snapshot

```yaml
- text: select server
- combobox "select server" [expanded]: Local server
- img
- text: Organization Browser
- button
- button
- button
- text: Welcome back! From here you can manage your LDAP containers and map resources to groups and positions. Create an LDAP container Configure a new LDAP container for the org model.
- button "Go"
- text: Manage LDAP containers View LDAP resource details and edit or delete LDAP containers.
- button "Go"
- iframe
- listbox "select server":
  - option "Local server" [selected]
  - option "2204"
  - option "2201"
```

# Test source

```ts
  145 |
  146 |   ByTitle(title: string): Locator {
  147 |     return this.page.getByTitle(title);
  148 |   }
  149 |
  150 |   selectCapability(capabilityName: string): Locator {
  151 |     return this.page.locator(`//div[normalize-space()='${capabilityName}']//parent::mat-checkbox[1]/div/div/input`);
  152 |   }
  153 |
  154 |   hoverResource(resourceName: string): Locator {
  155 |     return this.page.locator(`//div[@class='mat-mdc-tooltip-trigger resource-ellipsis'][normalize-space()='${resourceName}']`);
  156 |   }
  157 |
  158 |   resourceMoreOptions(): Locator {
  159 |     return this.page.locator('#ldap-resource-list-virtual-scroll-id').getByRole('button');
  160 |   }
  161 |
  162 |   editResource(): Locator {
  163 |     return this.page.getByRole('menuitem', { name: 'Edit resource' });
  164 |   }
  165 |
  166 |   selectLocation(locationName: string): Locator {
  167 |     return this.page.locator(`//td[normalize-space()="${locationName}"]/parent::tr/td/mat-radio-group/mat-radio-button/div/div/input`);
  168 |   }
  169 |
  170 |   updateResourceButton(): Locator {
  171 |     return this.page.getByRole('button', { name: 'Update resource' });
  172 |   }
  173 |
  174 |   ViewDetailsButton(resourceName: string): Locator {
  175 |     return this.page.locator(`//div[@class='mat-mdc-tooltip-trigger resource-ellipsis'][normalize-space()='${resourceName}']/following::span[@class="ldap-resource-list-view-details"]`);
  176 |   }
  177 |
  178 |   detailsTab(name: string): Locator {
  179 |     return this.page.getByRole('button', { name });
  180 |   }
  181 |
  182 |   locationTabDetails(): Locator {
  183 |     return this.page.getByLabel('Location (1)');
  184 |   }
  185 |
  186 |   viewDetailsClose(): Locator {
  187 |     return this.page.locator('app-resource-details-view').getByText('close');
  188 |   }
  189 |
  190 |   dialogContent(): Locator {
  191 |     return this.page.locator('mat-dialog-content');
  192 |   }
  193 |
  194 |   continueButton(): Locator {
  195 |     return this.page.getByRole('button', { name: 'Continue' });
  196 |   }
  197 |
  198 |   propertyDetails(): Locator {
  199 |     return this.page.locator(`.mat-expansion-panel.mat-expanded.mat-expansion-panel-spacing`);
  200 |   }
  201 |
  202 |   // --- Async Action Methods ---
  203 |
  204 |   async selectAliasWithName(aliasName: string): Promise<void> {
  205 |     await this.SelectAlias_WithName(aliasName).click();
  206 |   }
  207 |
  208 |   async selectResourceWithName(resourceName: string): Promise<void> {
  209 |     await this.page.locator(
  210 |       `//div[@class='mat-mdc-tooltip-trigger resource-ellipsis'][normalize-space()='${resourceName}']//preceding::input[1]`
  211 |     ).click();
  212 |   }
  213 |
  214 |   async click_Toggle_Button_In_Front_Of(orgStructureName: string): Promise<void> {
  215 |     await this.page.locator(`//div[@title='${orgStructureName}']//preceding::div[@aria-label='toggle ${orgStructureName}']`).click();
  216 |   }
  217 |
  218 |   async select_Group_With_Name(groupName: string): Promise<void> {
  219 |     await this.page.locator(`//li//div[@title='${groupName}']`).click();
  220 |     await this.page.waitForTimeout(1000);
  221 |   }
  222 |
  223 |   async selectOrgEntity(name: string): Promise<void> {
  224 |     await this.page.locator(`//div[@title='${name}']`).first().click();
  225 |   }
  226 |
  227 |   async clickGoButton(): Promise<void> {
  228 |     await this.GoButton.first().click();
  229 |   }
  230 |
  231 |   async fetchMoreResources(): Promise<void> {
  232 |     await this.MoreResources.click();
  233 |   }
  234 |
  235 |   async fillContainerName(name: string): Promise<void> {
  236 |     await this.ContainerCreation_Name.fill(name);
  237 |   }
  238 |
  239 |   async waitForElementVisible(locator: Locator): Promise<void> {
  240 |     await locator.waitFor({ state: 'visible' });
  241 |   }
  242 |
  243 |   async selectServer(serverName: string): Promise<void> {
  244 |     await this.page.getByText('select server', { exact: true }).click();
> 245 |     await this.page.getByRole('option', { name: serverName }).click();
      |                                                               ^ Error: locator.click: Target page, context or browser has been closed
  246 |     await expect(this.page.locator('#mat-select-value-0')).toContainText(serverName);
  247 |   }
  248 |
  249 |   async hoverAndGetLdapMoreBtn(LDAPName: string): Promise<Locator> {
  250 |     await this.page.getByText(LDAPName, { exact: true }).hover();
  251 |     return this.page.locator("app-ladp-container-list").getByRole("button");
  252 |   }
  253 |
  254 |   async clickonManageLdapContainerCard() {
  255 |     await this.page.locator("//div[@class='card-title'][text()='Manage LDAP containers']//following::button").click();
  256 |   }
  257 |
  258 |   // --- Backward-compatible camelCase method wrappers ---
  259 |   goButton(): Locator { return this.GoButton; }
  260 |   createContainer_PageHeader(): Locator { return this.CreateContainer_PageHeader; }
  261 |   containerCreation_Name(): Locator { return this.ContainerCreation_Name; }
  262 |   containerCreation_Description(): Locator { return this.ContainerCreation_Description; }
  263 |   containerCreation_CancelButton(): Locator { return this.ContainerCreation_CancelButton; }
  264 |   containerCreation_NextButton(): Locator { return this.ContainerCreation_NextButton; }
  265 |   chooseLDAPSource_PageHeader(): Locator { return this.ChooseLDAPSource_PageHeader; }
  266 |   ldapSource_AliasList(): Locator { return this.LDAPSource_AliasList; }
  267 |   ldapSource_BaseDN(): Locator { return this.LDAPSource_BaseDN; }
  268 |   ldapSource_cnValue(): Locator { return this.LDAPSource_cnValue; }
  269 |   ldapSource__ShowSampleData(): Locator { return this.LDAPSource__ShowSampleData; }
  270 |   querySourceSampleData_Dialog(): Locator { return this.QuerySourceSampleData_Dialog; }
  271 |   querySourceSampleData_Close(): Locator { return this.QuerySourceSampleData_Close; }
  272 |   ldapSource_SaveButton(): Locator { return this.LDAPSource_SaveButton; }
  273 |   mapResourceAttribute_PageHeader(): Locator { return this.MapResourceAttribute_PageHeader; }
  274 |   orgModel_VersionList(): Locator { return this.OrgModel_VersionList; }
  275 |   selectOrgModel_Version(v: string): Locator { return this.SelectOrgModel_Version(v); }
  276 |   createLDAPContainer_Button(): Locator { return this.CreateLDAPContainer_Button; }
  277 |   orgBrowserHomeIcon(): Locator { return this.OrgBrowserHomeIcon; }
  278 |   browseOrganization_Tab(): Locator { return this.BrowseOrganization_Tab; }
  279 |   addSelected_Button(): Locator { return this.AddSelected_Button; }
  280 |   addResource_Dialog(): Locator { return this.AddResource_Dialog; }
  281 |   createResource_Button(): Locator { return this.CreateResource_Button; }
  282 |   organizations_Tab(): Locator { return this.Organizations_Tab; }
  283 |   groups_Tab(): Locator { return this.Groups_Tab; }
  284 |   org_Version_selector(): Locator { return this.Org_Version_selector; }
  285 |   org_Version(version: string | number): Locator { return this.Org_Version(version); }
  286 |   map_Selected_Resource_Link(): Locator { return this.Map_Selected_Resource_Link; }
  287 |   orgBrowserBack_Button(): Locator { return this.OrgBrowserBack_Button; }
  288 |   ldap_dialogue_title(): Locator { return this.LDAP_dialogue_title; }
  289 |   ldap_dialogue_msg(): Locator { return this.LDAP_dialogue_msg; }
  290 |   view_Manage_GoBtn(cardTitle: string): Locator { return this.View_Manage_GoBtn(cardTitle); }
  291 |   ldapName(ldapName: string): Locator { return this.LDAPName(ldapName); }
  292 |   ldap_more_Btn(ldapName: string): Locator { return this.LDAP_more_Btn(ldapName); }
  293 |   ldap_options(btnName: string): Locator { return this.LDAP_options(btnName); }
  294 |   ldap_dialogue_Btns(btnName: string): Locator { return this.LDAP_dialogue_Btns(btnName); }
  295 |   selectAlias_WithName(aliasName: string): Locator { return this.SelectAlias_WithName(aliasName); }
  296 |   moreOptions(): Locator { return this.MoreOptions; }
  297 |   editButton(): Locator { return this.EditButton; }
  298 |   deleteButton(): Locator { return this.DeleteButton; }
  299 |   refreshInstances(): Locator { return this.RefreshInstances; }
  300 |   select_Position_With_Name(title: string): Locator { return this.ByTitle(title); }
  301 | }
  302 |
  303 | module.exports = { OrgBrowserPage };
  304 |
```