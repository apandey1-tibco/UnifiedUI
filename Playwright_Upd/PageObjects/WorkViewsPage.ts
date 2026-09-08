import { type Locator, type Page, request } from "@playwright/test";

export class WorkViewsPage {
  readonly page: Page;
  readonly workViewTab: Locator;
  readonly wvSortIcon: Locator;
  readonly wvSortHeader: Locator;
  readonly applyButton: Locator;
  readonly wvFilterIcon: Locator;
  readonly wvFilterHeader: Locator;
  readonly addRuleButton: Locator;
  readonly deleteButton: Locator;
  readonly deleteHeaderLocator: Locator;
  readonly workViewSelect: Locator;
  readonly threeDotsVertical : Locator;
  readonly editButton : Locator;
  readonly createIcon : Locator;
  readonly wvRefreshButton : Locator;

  constructor(page: Page) {
    this.page = page;
    this.workViewTab = page.locator('div[class="tabtitle"]');
    this.wvSortIcon = page.getByRole("img", { name: "Sort" }).getByRole("img");
    this.applyButton = page.getByRole("button", { name: "Apply" });
    this.wvFilterIcon = page.locator("bpme-work-views #Icon #Vector");
    this.addRuleButton = page.getByRole("button", {
      name: "Rule Add rule",
    });
    this.deleteButton = page.getByRole("menuitem", {
      name: "Delete",
    });
    this.wvFilterHeader = page
      .locator("bpme-work-views")
      .locator(".filter-dialog")
      .locator(".dialog")
      .locator("#title");
    this.wvSortHeader = page
      .locator("bpme-work-views")
      .locator(".dialog-overview-sort")
      .locator("#title");

    this.deleteHeaderLocator = page
      .locator("bpme-work-views")
      .locator(".dialog-delete-workView")
      .locator("#title");
      this.workViewSelect = page.locator('twc-select[class="workViewSelect"]');

    this.threeDotsVertical = page.locator('twc-icon-button[name="three-dots-vertical"][label="More"]').first();

    this.editButton = page.getByRole("menuitem", {
      name: "Edit",
    });

    this.createIcon = page.locator('twc-toolbar-item[label="Create"]');
    this.wvRefreshButton = page.locator('twc-tooltip[content="Refresh"]').locator('twc-icon.arrow-clockwise');
  }

  // WorkViewsTab
  WorkViewsTab(): Locator {
    return this.page.locator(".mat-tab-label-active > .tab-links");
  }

  async clickOnMyWork() {
    await this.page
      .locator('twc-navmenu-item[tooltipcontent="My Work"]')
      .waitFor();
    await this.page
      .locator('twc-navmenu-item[tooltipcontent="My Work"]')
      .click();
  }

  // WorkItemWithName
  WorkItemWithName(workItemName: string): Locator {
    return this.page.locator("td", { hasText: workItemName }).first();
  }

  // WorkItemWithAbsoluteName
  WorkItemWithAbsoluteName(workItemName: string): Locator {
    return this.page.locator(`//td[text() = "${workItemName}"][1]`);
  }

  // WorkItemWithProcessInstanceID
  WorkItemWithProcessInstanceID(ProcessInstanceID: string): Locator {
    return this.page.locator("td", { hasText: ProcessInstanceID }).first();
  }

  // WorkItemFormName
  WorkItemFormName(WIName: string): Locator {
    return this.page.locator(`//label[normalize-space()="${WIName}"]`);
  }

  // WorkItem_with_ID_and_Name
  WorkItem_with_ID_and_Name(
    WIName: string,
    ProcessInstanceID: string
  ): Locator {
    return this.page.locator(
      `//td[normalize-space()="${WIName}"]//following-sibling::td[text()="${ProcessInstanceID}"]`
    );
  }

  // WIDrpDwnSelect
  WIDrpDwnSelect(fieldName: string): Locator {
    return this.page.locator(
      `//label[normalize-space()="${fieldName}"]/following::select`
    );
  }

  // WorkList_Col_selector
  WorkList_Col_selector(): Locator {
    return this.page.locator(
      "//mat-icon[@svgicon='columns_icon']//*[local-name()='svg']"
    );
  }

  // WorkList_Col_Selector_field
  WorkList_Col_Selector_field(ColumnName: string): Locator {
    return this.page.locator(`//span[normalize-space()="${ColumnName}"]`);
  }

  // WorkList_Col_With_Name
  WorkList_Col_With_Name(): Locator {
    return this.page.locator(
      "//div[contains(@class,'mat-sort-header-content')][text()='Process Instance ID']"
    );
  }

  // WorkList_Col_Name
  WorkList_Col_Name(ColumnName: string): Locator {
    return this.page.locator(`//th//div[text()="${ColumnName}"]`);
  }

  // WorkItemField
  WorkItemField(fieldName: string): Locator {
    return this.page.locator(`//label[normalize-space()="${fieldName}"]`);
  }

  // WorkItemField_Text
  WorkItemField_Text(fieldName: string): Locator {
    return this.page.locator(
      `//label[normalize-space()="${fieldName}"]//following::input[1]`
    );
  }

  // workItemData
  workItemData(fieldName: string): Locator {
    return this.page.locator(
      `//label[normalize-space()="${fieldName}"]/following::div[1]//input[@type="text"][@tabindex="0"]`
    );
  }

  // WIDataBooleanField
  WIDataBooleanField(fieldName: string): Locator {
    return this.page.locator(
      `//label[normalize-space()="${fieldName}"]/following::div[1]//input[@type="checkbox"]`
    );
  }

  // WorkListRefreshbtn
  WorkListRefreshbtn(): Locator {
    return this.page.locator(
      '//bpm-work-list-table//mat-icon[@data-mat-icon-name="refresh_icon"]'
    );
  }

  // WorkItemSubmit
  WorkItemSubmit(): Locator {
    return this.page.locator('[title="Submit"]');
  }

  // WorkItemCancel
  WorkItemCancel(): Locator {
    return this.page.locator('[title="Cancel"]');
  }

  // WorkItemClose
  WorkItemClose(): Locator {
    return this.page.locator('[title="Close"]');
  }

  // NoWIText
  NoWIText(): Locator {
    return this.page.locator('//div[normalize-space()="No work items"]');
  }

  // WI_With_Name
  WI_With_Name(WIName: string): Locator {
    return this.page.locator(
      `//td[@class='mat-tooltip-trigger mat-cell cdk-cell ellipsis cdk-column-name mat-column-name ng-star-inserted'][normalize-space()="${WIName}"]`
    );
  }

  // Number_Of_WI_In_Worklist
  Number_Of_WI_In_Worklist(): Locator {
    return this.page
      .locator("div.table-container")
      .locator("tr.mat-row.cdk-row");
  }

  // WIStatus
  WIStatus(WIName: string): Locator {
    return this.page.locator(
      `//td[@class='mat-tooltip-trigger mat-cell cdk-cell ellipsis cdk-column-name mat-column-name ng-star-inserted'][normalize-space()="${WIName}"]/following-sibling::td[3]`
    );
  }

  // AppMenu
  AppMenu(): Locator {
    return this.page.locator("div.nav-item.app-switcher");
  }

  // Appicon_WithName
  Appicon_WithName(appName: string): Locator {
    return this.page.locator("span.application-name", { hasText: appName });
  }

  async clickWorkViews() {
    await this.workViewTab.click();
  }

  // Click on Create Work View
  async clickCreateWorkView() {
    const createWorkView = this.page.locator(
      'twc-toolbar-item[label="Create work view"]'
    );
    await createWorkView.waitFor();
    await createWorkView.click();
  }

  // Enter Work View Name
  async workViewName(workItemName: string) {
    await this.page
      .getByRole("textbox", { name: "Name" })
      .pressSequentially(workItemName);
  }

  // Enter Work View Description
  async workViewDescription(description: string) {
    await this.page
      .getByRole("textbox", { name: "Description" })
      .pressSequentially(description, { delay: 50 });
  }

  // Make Work View Public
  async workViewMakePublic() {
    const makePublicCheckbox = this.page.locator(
      'twc-checkbox[name="makePublic"] .checkbox__control'
    );
    await makePublicCheckbox.click();
    await this.page.waitForTimeout(1000);
  }

  // Click Next button on Work View
  async workViewNextButton() {
    const nextButton = this.page.locator('twc-wizard-button[class="nextStep"]');
    await nextButton.click();
  }

  // Select Target Type of View from dropdown
  async targetTypeofView(viewname: string) {
    const typeOfViewDropdown = this.page.locator(
      'twc-select[name="typeOfView"]'
    );
    await typeOfViewDropdown.click();
    await this.page.waitForTimeout(2000);
    const viewOption = this.page
      .locator("twc-option")
      .locator(`text=${viewname}`);
    await viewOption.click();
  }

  // Select Version from dropdown
  async selectVersionDropdown() {
    const versionDropdown = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(7) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator('twc-select[value="2"]')
      .locator(".select__display-input");
    await versionDropdown.click();
  }

  // Fill in Work View Details (Name and Description)
  async workViewDetails(name: string, desc: string) {
    await this.page.waitForTimeout(600);
    await this.workViewName(name);
    await this.workViewDescription(desc);
  }

  async selectVersionForTarget(version: string) {
    // Locate and click the select combobox for version
    await this.page
      .locator(
        ".version-wrapper > div > twc-select > .form-control > .form-control-input > .select > .select__combobox"
      )
      .first()
      .click();

    // Locate and select the specific version option based on the provided version
    await this.page.getByRole("option", { name: version }).click();
  }

  async selectedUserInTarget(user: string) {
    // Select QA as user
    const qaElement = this.page
      .locator("twc-tree-items-group[groupvalue='QA']")
      .getByText("QA", { exact: true })
      .first()
      .click();

    // Add Richard Cresswell by clicking the plus icon next to his name
    const addRichardElement = this.page
      .locator('bpme-mini-org-browser[allowentities="true"]')
      .locator('twc-tree[class="resourceTree"]')
      .locator(`twc-tree-items-group[groupvalue="${user}"]`)
      .locator('twc-icon[name="plus-lg"]');
    await addRichardElement.click();
  }

  async addColumn(columnName: string) {
    // Locate the column search input and type the column name
    const searchInput = this.page
      .locator("bpme-create-views")
      .locator("#sortListSelector")
      .locator('twc-input[placeholder="Search Columns"]')
      .locator("#input");

    await searchInput.fill(columnName); // Type the column name

    // Locate the checkbox for the column and click it
    const columnCheckbox = this.page
      .locator("bpme-create-views")
      .locator("#sortListSelector")
      .locator(".bpm-designer-scrollbar")
      .locator('twc-list-item[role="menuitem"]')
      .locator("twc-checkbox")
      .locator(".checkbox__control");

    await columnCheckbox.waitFor({ state: "visible" });
    await columnCheckbox.click();
  }

  async addFilterRule(value: string) {
    // Ensure reset button is visible
    const resetButton = this.page
      .locator("bpme-create-views")
      .locator(".reset")
      .locator('twc-button[variant="primary"]')
      .locator(
        ".button.button--primary.button--small.button--outline.button--has-label.button--has-prefix.button--has-suffix"
      );

    await resetButton.waitFor({ state: "visible" }); // Ensure button is visible

    // Click the "and/or" dropdown
    const andOrDropdown = this.page
      .locator("bpme-create-views")
      .locator("twc-query-builder")
      .locator(".groupClass")
      .locator(".select__combobox");

    await andOrDropdown.click();

    // Click the "and" option in the dropdown
    const andOption = this.page
      .locator("bpme-create-views")
      .locator("twc-query-builder")
      .locator('twc-option[value="and"]')
      .locator(".option__label");

    await andOption.click();

    // Click the "Add Rule" button
    const addRuleButton = this.page
      .locator("bpme-create-views")
      .locator("twc-query-builder")
      .locator('twc-tooltip[content="Add Rule"]')
      .locator('button[role="button"]');

    await addRuleButton.click();
    await this.page.waitForTimeout(1000);
    //dropdown

    // await this.page
    //   .locator("twc-select")
    //   .filter({ hasText: "Id Name Description Priority" })
    //   .getByRole("combobox")
    //   .click();
    // await this.page
    //   .getByRole("option", { name: "Name", exact: true })
    //   .locator("div")
    //   .first()
    //   .click();

    // await this.page.getByRole("textbox").fill("name");

    // Enter the value into the text input
    // const inputField = this.page.locator("#input");
    // .locator("twc-query-builder")
    // .locator(".operatorDataField")
    // .locator("input[type='number']");

    // await inputField.fill(value); // Fill the input field with the provided value
    await this.page.getByRole("spinbutton").pressSequentially(value);
  }

  async addColumnSortTab(columnName: string) {
    // Ensure reset button is visible
    const resetButton = this.page
      .locator("bpme-create-views")
      .locator(".reset")
      .locator('twc-button[variant="primary"]')
      .locator(
        ".button.button--primary.button--small.button--outline.button--has-label.button--has-prefix.button--has-suffix"
      );

    await resetButton.waitFor({ state: "visible" });

    // Search box: Type the column name
    const searchBox = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(5) > twc-list-selector:nth-child(2)"
      )
      .locator('twc-input[placeholder="Search Columns"]')
      .locator("#input");

    await searchBox.fill(columnName);

    // Checkbox: Click the checkbox
    const checkbox = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(5) > twc-list-selector:nth-child(2)"
      )
      .locator(".bpm-designer-scrollbar")
      .locator('twc-list-item[role="menuitem"]')
      .locator("twc-checkbox")
      .locator(".checkbox__control");

    await checkbox.click();
  }

  async selectUserInUsersTab(version: string) {
    // Version selection
    const versionSelect = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(6) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator('twc-select[value="2"]')
      .locator(".select__display-input");

    await versionSelect.click();

    // 0 version selection
    const versionOption = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(6) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator(`twc-option[value="${version}"]`)
      .locator(".option__label");

    await versionOption.click();

    // System admin selection
    const systemAdmin = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(6) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator(
        "div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > twc-tree:nth-child(1) > twc-tree-items-group:nth-child(1) > div:nth-child(2) > span:nth-child(2)"
      );

    await systemAdmin.click();

    // Adding Tibco Admin user
    const tibcoAdminUser = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(6) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator(
        "div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > twc-tree:nth-child(1) > twc-tree-items-group:nth-child(1) > div:nth-child(2)"
      );

    await tibcoAdminUser.click();
  }

  async selectUserInAuthorsTab(version: string) {
    // Version selection
    const versionSelect = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(7) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator('twc-select[value="2"]')
      .locator(".select__display-input");

    await versionSelect.click();

    // Selecting 0 version
    const versionOption = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(7) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator(`twc-option[value="${version}"]`)
      .locator(".option__label");

    await versionOption.click();

    // System admin selection
    const systemAdmin = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(7) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator(
        "div:nth-child(1) > div:nth-child(4) > div:nth-child(1) > div:nth-child(2) > twc-tree:nth-child(1) > twc-tree-items-group:nth-child(1) > div:nth-child(2) > span:nth-child(2)"
      );

    await systemAdmin.click();

    // Adding Tibco Admin user
    const tibcoAdminUser = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(7) > div:nth-child(2) > bpme-mini-org-browser:nth-child(1)"
      )
      .locator(
        "div:nth-child(1) > div:nth-child(4) > div:nth-child(2) > div:nth-child(2) > twc-tree:nth-child(1) > twc-tree-items-group:nth-child(1) > div:nth-child(2)"
      );

    await tibcoAdminUser.click();
  }

  //****************************Verification of Summary tab***************************************

  //Name and description verification
  async verifyNameAndDescOnSummary(name: string, description: string) {
    // Verifying Name field
    const nameField = this.page
      .locator("bpme-create-views")
      .locator(
        "form:nth-child(1) > twc-wizard:nth-child(2) > twc-wizard-step:nth-child(8) > div:nth-child(2) > twc-input:nth-child(1)"
      )
      .locator("#input");

    await nameField.isDisabled(); // Verifying the input is disabled
    const nameValue = await nameField.inputValue();
    if (nameValue !== name) {
      throw new Error(
        `Name value is not correct. Expected: "${name}", Found: "${nameValue}"`
      );
    }

    // Verifying Description field
    const descriptionField = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Description"]')
      .locator("#input");

    const descriptionValue = await descriptionField.inputValue();
    if (descriptionValue !== description) {
      throw new Error(
        `Description value is not correct. Expected: "${description}", Found: "${descriptionValue}"`
      );
    }
  }

  //Make this view
  async verifyMakeThisPublic(flag: boolean) {
    const publicViewField = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Make this view public"]')
      .locator("#input");

    await publicViewField.isVisible(); // Verifying the input exists
    const fieldValue = await publicViewField.inputValue();

    if (!fieldValue) {
      throw new Error(
        `Field value is not correct. Expected: "${flag}", Found: "${fieldValue}"`
      );
    }
  }

  //Target
  async verifyTargetOnSummary(name: string) {
    const targetField = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Target"]')
      .locator("#input");

    // Ensure the field is visible
    await targetField.isVisible();

    // Get the current value of the "Target" field
    const fieldValue = await targetField.inputValue();

    // Validate the field value
    if (fieldValue !== name) {
      throw new Error(
        `Expected value for "Target" is "${name}", but found "${fieldValue}"`
      );
    }
  }

  //type of wrok item
  async verifyTypeOfWorkItemOnSummary(type: string) {
    const typeOfWorkItemField = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Type of work items"]')
      .locator("#input");

    // Ensure the field is visible
    await typeOfWorkItemField.isVisible();

    // Get the current value of the "Type of work items" field
    const fieldValue = await typeOfWorkItemField.inputValue();

    // Validate the field value
    if (fieldValue !== type) {
      throw new Error(
        `Expected value for "Type of work items" is "${type}", but found "${fieldValue}"`
      );
    }
  }

  //Filter
  async verifyFilterOnSummary(filter: string) {
    const filterField = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Filter"]')
      .locator("#input");

    // Ensure the filter field exists and is visible
    await filterField.isVisible();

    // Get the current value of the filter input field
    const fieldValue = await filterField.inputValue();

    // Validate the field value matches the expected filter value
    if (fieldValue !== filter) {
      throw new Error(
        `Expected value for "Filter" is "${filter}", but found "${fieldValue}"`
      );
    }
  }

  async verifySortOnSummary(sortName: string) {
    const sortField = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Sort"]')
      .locator("#input");

    // Get the current value of the sort input field
    const fieldValue = await sortField.inputValue();

    // Validate the field value matches the expected sort name
    if (fieldValue !== sortName) {
      throw new Error(
        `Expected value for "Sort" is "${sortName}", but found "${fieldValue}"`
      );
    }
  }

  async verifyColumnsOnSummary(text: string): Promise<void> {
    const columnsLocator = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Columns"]')
      .locator("#input");
    const elements = await columnsLocator.inputValue();

    // for (let index = 0; index < elements.length; index++) {
    //   const element = elements[index];
    //   const value = await element.evaluate(
    //     (el) => (el as HTMLInputElement).value
    //   );
    if (elements !== text) {
      throw new Error(`Value mismatch: expected ${text}, but got ${elements}`);
    }
  }
  // }

  async verifyUsersOnSummary(user: string) {
    const userLocator = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Users"]')
      .locator("#input");
    const value = await userLocator.inputValue();

    if (value !== user) {
      throw new Error(`Expected value "${user}", but got "${value}"`);
    }
  }

  async verifyAuthorsOnSummary(author: string) {
    const authorLocator = this.page
      .locator("bpme-create-views")
      .locator('twc-input[type="text"][label="Authors"]')
      .locator("#input");

    const value = await authorLocator.inputValue();

    if (value !== author) {
      throw new Error(`Expected value "${author}", but got "${value}"`);
    }
  }

  async clickOnCreateButton() {
    const createButtonLocator = this.page
      .locator("bpme-create-views")
      .locator(".viewSave")
      .locator('twc-button[variant="primary"]')
      .locator(
        ".button.button--primary.button--small.button--outline.button--has-label.button--has-prefix.button--has-suffix"
      );

    await createButtonLocator.click({ force: true });
  }

  async wvSortHeaderVerification() {
    const headerText = await this.wvSortHeader.innerText();
    return headerText;
  }
  async wvFilterHeaderVerification() {
    const headerText = await this.wvFilterHeader.innerText();
    return headerText;
  }
  async getWorkViewName() {
    const name = await this.page
      .locator("twc-list-view[part='workViewList'] twc-list-item")
      .last()
      .innerText();
    return name;
  }
  async verifyWorkViewSort(sortName: string) {
    // Search in the column box
    const searchBoxLocator = this.page.getByRole("textbox");
    await searchBoxLocator.fill(sortName);
    // Select the first option
    const firstOptionLocator = this.page
      .locator("bpme-work-views")
      .locator("#listSelector")
      .locator(".bpm-designer-scrollbar")
      .locator('twc-list-item[role="menuitem"]')
      .locator(".menu-item__label");
    await firstOptionLocator.click();
    await this.applyButton.click();
    await this.page.waitForTimeout(1000);
  }

  async workViewFilter(wvName: string) {
    await this.addRuleButton.click();
    // await this.page.locator(".fieldData .select__combobox").click();
    await this.page.getByText("Id Name Description", { exact: true }).click();
    await this.page.getByRole("option", { name: "Name" }).click();
    await this.page.getByRole("textbox").fill(wvName);
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.waitForTimeout(1000);
  }

  async clickOnWorkViewDropdown(name: string) {
    // Click on the work view dropdown
    const dropdownLocator = this.page
      .locator("bpme-work-views")
      .locator(".workViewSelect")
      .locator(".select__combobox");
    await dropdownLocator.click({ force: true });

    // Click on the editable work view option
    const optionLocator = this.page
      .locator("bpme-work-views")
      .locator('twc-option[role="option"]')
      .locator(`text=${name}`);
    await optionLocator.click({ force: true });
  }

  async clickOnDelete(name: string) {
    // Click on the 3 dots (More) of the work view
    const moreButtonLocator = this.page
      .locator("bpme-work-views")
      .locator('twc-list-view[part="workViewList"]')
      .locator('twc-list-item[role="menuitem"]')
      .locator(`text=${name}`)
      .locator('twc-dropdown[slot="suffix"]')
      .locator('twc-icon-button[label="More"]');

    await moreButtonLocator.click();
    await this.page.waitForTimeout(600);
    // Click on the "Delete" option in the dropdown menu
    await this.deleteButton.click();
  }

  // Verify Delete header

  async verifyDeleteHeader() {
    const headerText = await this.deleteHeaderLocator.innerText();
    if (!headerText.includes("Delete work view")) {
      throw new Error(
        `Expected header "Delete work view", but got "${headerText}"`
      );
    }
  }
  async clickOnYesButton() {
    // Click on "Yes" to confirm deletion
    const yesButtonLocator = this.page
      .locator("bpme-work-views")
      .locator('twc-button[slot="footer"][variant="primary"]')
      .locator("text=Yes");
    await yesButtonLocator.click();
    await this.page.waitForTimeout(800);
  }

  verifyCreatedWorkVIew(workView: string): Locator {
    const wvLocator = this.page
      .getByRole("menuitem")
      .filter({ hasText: workView });
    return wvLocator;
  }
  async navigateToWorkViews() {
    await this.clickOnMyWork();
    await this.page.waitForLoadState("networkidle");
    await this.workViewTab.waitFor();
    await this.clickWorkViews();
  }
}
module.exports = { WorkViewsPage };
