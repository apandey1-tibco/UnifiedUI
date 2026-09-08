import { type Locator, type Page, expect } from "@playwright/test";

export class OrgBrowserPage {
  readonly page: Page;

  // --- Static Locators ---
  readonly MoreOptions: Locator;
  readonly OrgBrowserWelcomeTitle: Locator;
  readonly CreateAnLdapCard: Locator;
  readonly ManageLdapContainerCard: Locator;
  readonly GoButton: Locator;
  readonly CreateContainer_PageHeader: Locator;
  readonly ContainerCreation_Name: Locator;
  readonly ContainerCreation_Description: Locator;
  readonly ContainerCreation_CancelButton: Locator;
  readonly ContainerCreation_NextButton: Locator;
  readonly ChooseLDAPSource_PageHeader: Locator;
  readonly LDAPSource_AliasList: Locator;
  readonly LDAPSource_BaseDN: Locator;
  readonly LDAPSource_cnValue: Locator;
  readonly LDAPSource__ShowSampleData: Locator;
  readonly QuerySourceSampleData_Dialog: Locator;
  readonly QuerySourceSampleData_Close: Locator;
  readonly LDAPSource_SaveButton: Locator;
  readonly MapResourceAttribute_PageHeader: Locator;
  readonly OrgModel_VersionList: Locator;
  readonly CreateLDAPContainer_Button: Locator;
  readonly OrgBrowserHomeIcon: Locator;
  readonly BrowseOrganization_Tab: Locator;
  readonly AddSelected_Button: Locator;
  readonly AddResource_Dialog: Locator;
  readonly CreateResource_Button: Locator;
  readonly Organizations_Tab: Locator;
  readonly Org_Version_selector: Locator;
  readonly Groups_Tab: Locator;
  readonly Map_Selected_Resource_Link: Locator;
  readonly OrgBrowserBack_Button: Locator;
  readonly LDAP_dialogue_title: Locator;
  readonly LDAP_dialogue_msg: Locator;
  readonly LDAP_BackButton: Locator;
  readonly GridItem: Locator;
  readonly SelectServer: Locator;
  readonly MoreResources: Locator;
  readonly EditButton: Locator;
  readonly EditCapaabilityButton: Locator;
  readonly DeleteButton: Locator;
  readonly RefreshInstances: Locator;
  readonly SaveButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Core & Navigation Locators
    this.OrgBrowserWelcomeTitle = page.locator('//div[@class="title"]');
    this.OrgBrowserHomeIcon = page.locator('div.org-browser-tab.home-icon');
    this.OrgBrowserBack_Button = page.locator("//mat-icon[normalize-space()='keyboard_arrow_left']");
    this.GoButton = page.locator('.launch-button');
    this.SelectServer = page.getByText('select server');
    this.MoreResources = page.locator('[data-mat-icon-name="fetchMore"]');
    this.MoreOptions = page.getByRole('button', { name: 'More' });
    this.SaveButton = page.getByRole('button', { name: 'Save' });
    this.EditCapaabilityButton = page.getByRole('button', { name: 'Edit' });

    // Cards & Tabs
    this.CreateAnLdapCard = page.locator("//div[normalize-space()='Create an LDAP container']");
    this.ManageLdapContainerCard = page.locator("//div[normalize-space()='Manage LDAP containers']");
    this.BrowseOrganization_Tab = page.locator("//span[contains(text(),'Browse organization')]");
    this.Organizations_Tab = page.locator('.organizations-btn');
    this.Groups_Tab = page.locator('.groups-btn');

    // Container Creation
    this.CreateContainer_PageHeader = page.locator('.ldap-create-header-part1', { hasText: 'Create container' });
    this.ContainerCreation_Name = page.locator('#mat-input-0');
    this.ContainerCreation_Description = page.locator('#mat-input-1');
    this.ContainerCreation_CancelButton = page.locator("//span[normalize-space()='Cancel']");
    this.ContainerCreation_NextButton = page.locator("//button//span[normalize-space()='Next']");

    // LDAP Source
    this.ChooseLDAPSource_PageHeader = page.locator('.ldap-create-header-part1', { hasText: 'Choose LDAP source' });
    this.LDAPSource_AliasList = page.getByRole('combobox', { name: 'Alias' });
    this.LDAPSource_BaseDN = page.locator('input[data-placeholder="Base DN"]');
    this.LDAPSource_cnValue = page.locator('input[placeholder="Resource name attribute(s)"]');
    this.LDAPSource__ShowSampleData = page.locator("//span[normalize-space()='Show sample data']");
    this.LDAPSource_SaveButton = page.locator("//span[normalize-space()='Save LDAP source']");

    // Resource Mapping & Dialogues
    this.MapResourceAttribute_PageHeader = page.locator("//div[@class='ldap-resource-desc1'][normalize-space()='Map resource attributes']");
    this.OrgModel_VersionList = page.locator('span.mat-mdc-select-placeholder');
    this.CreateLDAPContainer_Button = page.locator("//span[normalize-space()='Create LDAP container']");
    this.QuerySourceSampleData_Dialog = page.locator('.mat-mdc-dialog-title.mdc-dialog__title');
    this.QuerySourceSampleData_Close = page.locator('.ldap-sample-close.mdc-button');
    this.AddResource_Dialog = page.locator('.mat-mdc-dialog-title.mdc-dialog__title');
    this.AddSelected_Button = page.getByRole('button', { name: 'Add selected' });
    this.CreateResource_Button = page.getByRole('button', { name: 'Create resource' });
    this.Org_Version_selector = page.locator("div.version-wrapper");
    this.Map_Selected_Resource_Link = page.getByRole('button', { name: 'Map selected resources' });

    // Shared LDAP Dialogues & Grids
    this.LDAP_dialogue_title = page.locator('//div[@class="title"]');
    this.LDAP_dialogue_msg = page.locator('//div[@class="msg-text"]');
    this.LDAP_BackButton = page.locator('//button[contains(@class, "ldap-resource-list-back-btn")]');
    this.GridItem = page.locator('//div[@class="grid-item"]');
    this.EditButton = page.getByTitle('Edit').locator('svg');
    this.DeleteButton = page.getByTitle('Delete').locator('svg');
    this.RefreshInstances = page.getByText('refresh');
  }

  // --- Dynamic Locators (Parameterized) ---

  View_Manage_GoBtn(CardTitle: string): Locator {
    return this.page.locator(`//div[@class='card-title'][text()="${CardTitle}"]//following::button`);
  }

  SelectAlias_WithName(AliasName: string): Locator {
    return this.page.locator(`//span[normalize-space()="${AliasName}"]`);
  }

  SelectOrgModel_Version(OrgModelVersion: string): Locator {
    return this.page.locator(`//span[normalize-space()="${OrgModelVersion}"]`);
  }

  LDAPName(LDAPName: string): Locator {
    return this.page.locator(`//div[@class='ldap-list-header'][normalize-space()="${LDAPName}"]`);
  }

  LDAP_more_Btn(LDAPName: string): Locator {
    return this.page.locator(`//div[@class='ldap-list-header'][normalize-space()="${LDAPName}"]//following::div[@class='ldap-resource-menu']//button`);
  }

  LDAP_hover_LDAPName(LDAPName: string): Locator {
    return this.page.locator(`//div[@class='ldap-list-header'][normalize-space()="${LDAPName}"]`);
  }

  LDAP_options(BtnName: string): Locator {
    return this.page.locator(`//button[normalize-space()="${BtnName}"]`);
  }

  LDAP_dialogue_Btns(BtnName: string): Locator {
    return this.page.locator(`//span[text()="${BtnName}"]`);
  }

  Org_Version(version: string | number): Locator {
    return this.page.locator(`//mat-option//span[contains(text(),'${version}')]`);
  }

  ByTitle(title: string): Locator {
    return this.page.getByTitle(title);
  }

  selectCapability(capabilityName: string): Locator {
    return this.page.locator(`//div[normalize-space()='${capabilityName}']//parent::mat-checkbox[1]/div/div/input`);
  }

  hoverResource(resourceName: string): Locator {
    return this.page.locator(`//div[@class='mat-mdc-tooltip-trigger resource-ellipsis'][normalize-space()='${resourceName}']`);
  }

  resourceMoreOptions(): Locator {
    return this.page.locator('#ldap-resource-list-virtual-scroll-id').getByRole('button');
  }

  editResource(): Locator {
    return this.page.getByRole('menuitem', { name: 'Edit resource' });
  }

  selectLocation(locationName: string): Locator {
    return this.page.locator(`//td[normalize-space()="${locationName}"]/parent::tr/td/mat-radio-group/mat-radio-button/div/div/input`);
  }

  updateResourceButton(): Locator {
    return this.page.getByRole('button', { name: 'Update resource' });
  }

  ViewDetailsButton(resourceName: string): Locator {
    return this.page.locator(`//div[@class='mat-mdc-tooltip-trigger resource-ellipsis'][normalize-space()='${resourceName}']/following::span[@class="ldap-resource-list-view-details"]`);
  }

  detailsTab(name: string): Locator {
    return this.page.getByRole('button', { name });
  }

  locationTabDetails(): Locator {
    return this.page.getByLabel('Location (1)');
  }

  viewDetailsClose(): Locator {
    return this.page.locator('app-resource-details-view').getByText('close');
  }

  dialogContent(): Locator {
    return this.page.locator('mat-dialog-content');
  }

  continueButton(): Locator {
    return this.page.getByRole('button', { name: 'Continue' });
  }

  propertyDetails(): Locator {
    return this.page.locator(`.mat-expansion-panel.mat-expanded.mat-expansion-panel-spacing`);
  }

  // --- Async Action Methods ---

  async selectAliasWithName(aliasName: string): Promise<void> {
    await this.SelectAlias_WithName(aliasName).click();
  }

  async selectResourceWithName(resourceName: string): Promise<void> {
    await this.page.locator(
      `//div[@class='mat-mdc-tooltip-trigger resource-ellipsis'][normalize-space()='${resourceName}']//preceding::input[1]`
    ).click();
  }

  async click_Toggle_Button_In_Front_Of(orgStructureName: string): Promise<void> {
    await this.page.locator(`//div[@title='${orgStructureName}']//preceding::div[@aria-label='toggle ${orgStructureName}']`).click();
  }

  async select_Group_With_Name(groupName: string): Promise<void> {
    await this.page.locator(`//li//div[@title='${groupName}']`).click();
    await this.page.waitForTimeout(1000);
  }

  async selectOrgEntity(name: string): Promise<void> {
    await this.page.locator(`//div[@title='${name}']`).first().click();
  }

  async clickGoButton(): Promise<void> {
    await this.GoButton.first().click();
  }

  async fetchMoreResources(): Promise<void> {
    await this.MoreResources.click();
  }

  async fillContainerName(name: string): Promise<void> {
    await this.ContainerCreation_Name.fill(name);
  }

  async waitForElementVisible(locator: Locator): Promise<void> {
    await locator.waitFor({ state: 'visible' });
  }

  async selectServer(serverName: string): Promise<void> {
    await this.page.getByText('select server', { exact: true }).click();
    await this.page.getByRole('option', { name: serverName }).click();
    await expect(this.page.locator('#mat-select-value-0')).toContainText(serverName);
  }

  async hoverAndGetLdapMoreBtn(LDAPName: string): Promise<Locator> {
    await this.page.getByText(LDAPName, { exact: true }).hover();
    return this.page.locator("app-ladp-container-list").getByRole("button");
  }

  async clickonManageLdapContainerCard() {
    await this.page.locator("//div[@class='card-title'][text()='Manage LDAP containers']//following::button").click();
  }

  // --- Backward-compatible camelCase method wrappers ---
  goButton(): Locator { return this.GoButton; }
  createContainer_PageHeader(): Locator { return this.CreateContainer_PageHeader; }
  containerCreation_Name(): Locator { return this.ContainerCreation_Name; }
  containerCreation_Description(): Locator { return this.ContainerCreation_Description; }
  containerCreation_CancelButton(): Locator { return this.ContainerCreation_CancelButton; }
  containerCreation_NextButton(): Locator { return this.ContainerCreation_NextButton; }
  chooseLDAPSource_PageHeader(): Locator { return this.ChooseLDAPSource_PageHeader; }
  ldapSource_AliasList(): Locator { return this.LDAPSource_AliasList; }
  ldapSource_BaseDN(): Locator { return this.LDAPSource_BaseDN; }
  ldapSource_cnValue(): Locator { return this.LDAPSource_cnValue; }
  ldapSource__ShowSampleData(): Locator { return this.LDAPSource__ShowSampleData; }
  querySourceSampleData_Dialog(): Locator { return this.QuerySourceSampleData_Dialog; }
  querySourceSampleData_Close(): Locator { return this.QuerySourceSampleData_Close; }
  ldapSource_SaveButton(): Locator { return this.LDAPSource_SaveButton; }
  mapResourceAttribute_PageHeader(): Locator { return this.MapResourceAttribute_PageHeader; }
  orgModel_VersionList(): Locator { return this.OrgModel_VersionList; }
  selectOrgModel_Version(v: string): Locator { return this.SelectOrgModel_Version(v); }
  createLDAPContainer_Button(): Locator { return this.CreateLDAPContainer_Button; }
  orgBrowserHomeIcon(): Locator { return this.OrgBrowserHomeIcon; }
  browseOrganization_Tab(): Locator { return this.BrowseOrganization_Tab; }
  addSelected_Button(): Locator { return this.AddSelected_Button; }
  addResource_Dialog(): Locator { return this.AddResource_Dialog; }
  createResource_Button(): Locator { return this.CreateResource_Button; }
  organizations_Tab(): Locator { return this.Organizations_Tab; }
  groups_Tab(): Locator { return this.Groups_Tab; }
  org_Version_selector(): Locator { return this.Org_Version_selector; }
  org_Version(version: string | number): Locator { return this.Org_Version(version); }
  map_Selected_Resource_Link(): Locator { return this.Map_Selected_Resource_Link; }
  orgBrowserBack_Button(): Locator { return this.OrgBrowserBack_Button; }
  ldap_dialogue_title(): Locator { return this.LDAP_dialogue_title; }
  ldap_dialogue_msg(): Locator { return this.LDAP_dialogue_msg; }
  view_Manage_GoBtn(cardTitle: string): Locator { return this.View_Manage_GoBtn(cardTitle); }
  ldapName(ldapName: string): Locator { return this.LDAPName(ldapName); }
  ldap_more_Btn(ldapName: string): Locator { return this.LDAP_more_Btn(ldapName); }
  ldap_options(btnName: string): Locator { return this.LDAP_options(btnName); }
  ldap_dialogue_Btns(btnName: string): Locator { return this.LDAP_dialogue_Btns(btnName); }
  selectAlias_WithName(aliasName: string): Locator { return this.SelectAlias_WithName(aliasName); }
  moreOptions(): Locator { return this.MoreOptions; }
  editButton(): Locator { return this.EditButton; }
  deleteButton(): Locator { return this.DeleteButton; }
  refreshInstances(): Locator { return this.RefreshInstances; }
  select_Position_With_Name(title: string): Locator { return this.ByTitle(title); }
}

module.exports = { OrgBrowserPage };
