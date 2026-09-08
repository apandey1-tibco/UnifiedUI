import { type Locator, type Page, request, type FrameLocator, expect } from "@playwright/test";
import { POManager } from "../PageObjects/POManager";
export class WorkListPage {
  readonly page: Page;
  readonly orderID: Locator;
  readonly name: Locator;
  readonly quantity: Locator;
  readonly product: Locator;
  readonly date: Locator;
  readonly time: Locator;
  readonly submitBtn: Locator;
  readonly orderState: Locator;
  readonly cancelBtn: Locator;
  readonly open: Locator;
  // readonly workManagerUrl: Locator;

  readonly workList: Locator;
  readonly autoRefresh: Locator;
  readonly autoRepeatButton: Locator;
  readonly wlFilterButton: Locator;
  readonly wlSortButton: Locator;
  readonly wlRefreshButton: Locator;
  readonly filterButton: Locator;
  readonly sortButton: Locator;
  readonly refreshButton: Locator;

  readonly threedotsWorklist: Locator;
  readonly openNext: Locator;
  readonly skipItem: Locator;
  readonly cancelItem: Locator;
  readonly pendItem: Locator;
  readonly allocatetoSelfItem: Locator;
  readonly reOffer: Locator;
  readonly reallocatetoWorldItem: Locator;
  readonly reallocatetoOfferset: Locator;
  readonly changePriority: Locator;
  readonly showAdhocTask: Locator;
  readonly showAdhocTasks: Locator;

  // TI - Toolbar Item
  readonly cancelToolbarItem: Locator;
  readonly AllocateToSelfToolbarItem: Locator;
  readonly reOfferToolbarItem: Locator;
  readonly skipToolbarItem: Locator;
  readonly pendToolbarItem: Locator;
  readonly reallocatetoWorldToolbarItem: Locator;
  readonly ellipsisWorklist: Locator;
  readonly caseDetails_CaseStateDropdown: Locator;
  readonly caseinfomation_CaseStateDropdown: Locator;
  readonly localData_caseState1: Locator;
  readonly localData_caseID: Locator;
  readonly localData_caseIdentifier1: Locator;
  readonly localData_firstName: Locator;
  readonly localData_lastName: Locator;
  readonly localData_customerName: Locator;
  readonly localData_customerAddress: Locator;
  readonly localData_submitBtn: Locator;

  // BSPF2 PInOutClass read-only pane locators
  readonly pInOutTextAtt: Locator;
  readonly pInOutIntegerAtt: Locator;
  readonly pInOutDecimalAtt: Locator;
  readonly pInOutDateAtt: Locator;
  readonly pInOutDateTimeAtt: Locator;
  readonly pInOutDateTimeTimezoneAtt: Locator;
  readonly pInOutTimeAtt: Locator;
  readonly pInOutBooleanAtt: Locator;
  readonly pInOutDurationDays: Locator;
  readonly pInOutDurationHours: Locator;
  readonly pInOutIDAtt: Locator;
  readonly pInOutURIAtt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderID = page.getByLabel("OrderID");
    this.name = page.getByRole("textbox", { name: "Name" });
    this.quantity = page.getByLabel("Quantity");
    this.product = page.getByLabel("Product");
    this.date = page
      .locator(".advanced-TextButtonPanel.control-widget.tf-widget-date")
      .locator(".selected-value.form-control");
    this.submitBtn = page.getByTitle("Submit");
    this.cancelBtn = page.getByTitle("Cancel");
    this.time = page
      .locator(".advanced-TextButtonPanel.control-widget.tf-widget-time")
      .locator(".selected-value.form-control");
    this.orderState = page.locator(
      ".gwt-ListBox.control-widget.form-control.control-lg.tf-select-fixer"
    );
    this.open = page.getByRole("button", { name: "Open" });

    this.workList = page.locator("#bpmMyWork");
    this.autoRefresh = page.locator("twc-icon.refresh-icon");
    this.autoRepeatButton = page
      .locator("span[part='autorepeat']")
      .locator("twc-switch");
    this.filterButton = page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-icon[name="filter"]')
      .first();
    //page.locator("twc-toolbar-item[tooltipcontent='Filter']").locator('twc-toolbar-item.controlShow');
    //.locator('twc-icon.action-icons').locator("twc-icon[name='filter']");
    this.sortButton = page.locator(
      "[id='WORK_MANAGER'] bpme-work-items twc-icon[name='import_export']"
    );
    this.refreshButton = page
      .locator('div[class="work-items-header"]')
      .locator('twc-header[label="Default work list"]')
      .locator('span[slot="trailing"]')
      .locator('span[part="work-list-action-block"]')
      .locator('div[part="refresh"]')
      .locator("twc-icon[name='arrow-clockwise']");
    this.wlFilterButton = page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-icon[name="filter"]')
      .first();
    this.wlSortButton = page.locator(
      "[id='WORK_MANAGER'] bpme-work-items twc-icon[name='import_export']"
    );
    this.wlRefreshButton = page
      .locator('div[class="work-items-header"]')
      .locator('twc-header[label="Default work list"]')
      .locator('span[slot="trailing"]')
      .locator('span[part="work-list-action-block"]')
      .locator('div[part="refresh"]')
      .locator("twc-icon[name='arrow-clockwise']");
    this.cancelToolbarItem = page.locator('twc-toolbar-item[label="Cancel"]');
    this.AllocateToSelfToolbarItem = page.locator(
      'twc-toolbar-item[label="Allocate to self"]'
    );
    this.reOfferToolbarItem = page.locator(
      'twc-toolbar-item[label="Re-offer"]'
    );
    this.skipToolbarItem = page.locator('twc-toolbar-item[label="Skip"]');
    this.pendToolbarItem = page.locator('twc-toolbar-item[label="Pend"]');
    this.reallocatetoWorldToolbarItem = page.locator(
      'twc-toolbar-item[label="Reallocate to world"]'
    );
    //////////////////
    this.threedotsWorklist = page.locator(
      "twc-dropdown[part='action-ellipsis']"
    );
    this.ellipsisWorklist = page
      .locator("twc-icon-button[name='three-dots-vertical']")
      .first();
    this.openNext = page.locator('twc-menu-item[title="Open next"]');
    this.skipItem = page.locator('twc-menu-item[title="Skip"]');
    this.cancelItem = page.locator('twc-menu-item[title="Cancel"]');
    this.pendItem = page.locator('twc-menu-item[title="Pend"]');
    this.allocatetoSelfItem = page.locator(
      'twc-menu-item[title="Allocate to self"]'
    );
    this.reOffer = page.locator('twc-menu-item[title="Re-offer"]');
    this.reallocatetoWorldItem = page.locator(
      'twc-menu-item[title="Reallocate to world"]'
    );
    this.reallocatetoOfferset = page.locator(
      'twc-menu-item[title="Reallocate to offer set"]'
    );
    this.changePriority = page.locator(
      "twc-menu-item[title='Change priority']"
    );
    this.showAdhocTask = page.locator('twc-button:has(twc-icon[name="adhoctasks"])');
    this.showAdhocTasks = page.locator('twc-button:has(twc-icon[name="adhoctasks"])');
    this.caseDetails_CaseStateDropdown = page.locator('#f1_widget_control_Casedatadetails_caseState1');
    this.caseinfomation_CaseStateDropdown = page.locator('#f1_widget_control_Caseinfomation_caseState1');
    this.localData_caseState1 = page.frameLocator('iframe[id$="__tfc_iframe"]').locator('#f1_widget_control_LocalData_caseState1');
    this.localData_caseID = page.frameLocator('iframe[id$="__tfc_iframe"]').locator('#f1_widget_control_LocalData_caseID');
    this.localData_caseIdentifier1 = page.frameLocator('iframe[id$="__tfc_iframe"]').locator('#f1_widget_control_LocalData_caseIdentifier1');
    this.localData_firstName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator('#f1_widget_control_LocalData_firstName');
    this.localData_lastName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator('#f1_widget_control_LocalData_lastName');
    this.localData_customerName = page.frameLocator('iframe[id$="__tfc_iframe"]').locator('#f1_widget_control_LocalData_CustomerName');
    this.localData_customerAddress = page.frameLocator('iframe[id$="__tfc_iframe"]').locator('#f1_widget_control_LocalData_CustomerAddress');
    this.localData_submitBtn = page.frameLocator('iframe[id$="__tfc_iframe"]').locator('#f1_widget_control_submit');

    // BSPF2 PInOutClass read-only fields
    const formFrame: FrameLocator = page.frameLocator('iframe[src*="formsclient"]');
    this.pInOutTextAtt = formFrame.locator("#f1_widget_control_PInOutClass_textAtt");
    this.pInOutIntegerAtt = formFrame.locator("#f1_widget_control_PInOutClass_integerAtt");
    this.pInOutDecimalAtt = formFrame.locator("#f1_widget_control_PInOutClass_decimalAtt");
    this.pInOutDateAtt = formFrame.locator("#f1_widget_control_PInOutClass_dateAtt input.selected-value");
    this.pInOutDateTimeAtt = formFrame.locator("#f1_widget_control_PInOutClass_dateTimeAtt input.selected-value");
    this.pInOutDateTimeTimezoneAtt = formFrame.locator("#f1_widget_control_PInOutClass_dateTimeTimezoneAtt input.selected-value");
    this.pInOutTimeAtt = formFrame.locator("#f1_widget_control_PInOutClass_timeAtt input.selected-value");
    this.pInOutBooleanAtt = formFrame.locator("#f1_widget_control_PInOutClass_booleanAtt input[type='checkbox']");
    this.pInOutDurationDays = formFrame.locator("#container_days_duration_panel_f1_widget_control_PInOutClass_durationAtt input");
    this.pInOutDurationHours = formFrame.locator("#container_hours_duration_panel_f1_widget_control_PInOutClass_durationAtt input");
    this.pInOutIDAtt = formFrame.locator("#f1_widget_control_PInOutClass_IDAtt");
    this.pInOutURIAtt = formFrame.locator("#f1_widget_control_PInOutClass_URIAtt");

  }

  async enterTime(time: string) {
    this.time.fill(time);
  }
  async selectOrderState(state: string) {
    await this.page.getByLabel("OrderState").selectOption(state);
  }

  async selectCaseDetailCaseState(state: string) {
    await this.caseDetails_CaseStateDropdown.selectOption(state);
  }

  async selectCaseInformationCaseState(state: string) {
    await this.caseinfomation_CaseStateDropdown.selectOption(state);
  }

  async getOrderState(): Promise<Locator> {
    return this.page.locator(
      ".gwt-ListBox.control-widget.form-control.control-lg.tf-select-fixer"
    );
  }
  async getName(): Promise<Locator> {
    return this.name;
  }

  async openButton(): Promise<Locator> {
    return this.page.locator('twc-button[part="open-button"]');
  }

  async enterDate(): Promise<Locator> {
    await this.date.click();
    return this.date;
  }
  async enterWorklistDetaisl(
    value: string,
    state: string,
    name: string,
    quant: string,
    product: string,
    time: string,
    date: string
  ) {
    await this.orderID.fill(value);
    await this.selectOrderState(state);
    await this.name.fill(name);
    await this.quantity.fill(quant);
    await this.product.fill(product);
    await this.page.waitForTimeout(1000);
    await this.time.pressSequentially(time, { delay: 100 });
    await this.page.waitForTimeout(1000);
    await this.date.pressSequentially(date, { delay: 100 });
  }

  async verifyPInOutClassForm(data: {
    textAtt: string;
    integerAtt: string;
    decimalAtt: string;
    dateAtt: string;
    booleanAtt: boolean;
    durationDays: string;
    durationHours: string;
    idAtt: string;
    uriAtt: string;
  }) {
    await expect(this.pInOutTextAtt).toHaveValue(data.textAtt);
    await expect(this.pInOutIntegerAtt).toHaveValue(data.integerAtt);
    await expect(this.pInOutDecimalAtt).toHaveValue(data.decimalAtt);
    await expect(this.pInOutDateAtt).toHaveValue(data.dateAtt);
    await expect(this.pInOutTimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
    if (data.booleanAtt) {
      await expect(this.pInOutBooleanAtt).toBeChecked();
    } else {
      await expect(this.pInOutBooleanAtt).not.toBeChecked();
    }
    await expect(this.pInOutDurationDays).toHaveValue(data.durationDays);
    await expect(this.pInOutDurationHours).toHaveValue(data.durationHours);
    await expect(this.pInOutIDAtt).toHaveValue(data.idAtt);
    await expect(this.pInOutURIAtt).toHaveValue(data.uriAtt);
  }

  async enterWorklistDetaisBdsConfigProject(
    caseDataDetail_caseState1: string,
    caseInformation_caseState1: string,
  ) {
    await this.selectCaseDetailCaseState(caseDataDetail_caseState1);
    await this.selectCaseInformationCaseState(caseInformation_caseState1);
  }

  async enterOnlyMandatoryDetails(orderID: string, state: string) {
    await this.orderID.fill(orderID);
    await this.selectOrderState(state);
    await this.cancelBtn.click();
    //await this.submitBtn.click();
  }
  async selectDateandTime() {
    // //calendar
    await this.page
      .locator(
        "#f1_widget_control_OrderDataIn_dateTimeandTimezoneField > table > tbody > tr > td:nth-child(2) > div"
      )
      .click();
    await this.page.getByRole("button", { name: "OK" }).click();
  }

  async clickonAutoRepeatButton() {
    await this.page
      .locator("span[part='autorepeat']")
      .locator("twc-switch")
      .click();
  }

  async openNextWorkItem(inputText: string, name: string) {
    // Click on the "three-dots-vertical" icon
    await this.getWorkItemName(name)
      .locator("twc-icon[name='three-dots-vertical']")
      .click({ force: true });

    // Click on the "Open next" menu item
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Open next"]')
      .first()
      .click({ force: true });

    // Wait for the checkbox to be visible, then click it
    await this.page.waitForTimeout(2000);
    await this.page
      .locator(
        'span.gwt-CheckBox.control-widget.form-control input[type="checkbox"]'
      )
      .click({ force: true });

    // Click on the "Add" link
    await this.page
      .locator("span.list-add a.gwt-Anchor.btn-xs")
      .click({ force: true });

    // Type the input string into the textbox
    await this.page.locator("input.gwt-TextBox.form-control").fill(inputText);

    // Wait for any potential page updates
    await this.page.waitForTimeout(2000);

    // Click on the primary action button
    await this.page
      .locator('div[tf-comp-type="button primary"] div.tf-container button')
      .click({ force: true });
  }

  async reOfferWorkItem(name: string) {
    // Click on the "three-dots-vertical" icon
    await this.getWorkItemName(name)
      .locator('twc-icon[name="three-dots-vertical"]')
      .click({ force: true });

    // Click on 'Re-offer to world' menu item
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Re-offer"]')
      .click({ force: true });
  }

  async skipWorkItem(name: string) {
    // Click on the "three-dots-vertical" icon
    await this.getWorkItemName(name)
      .locator('twc-icon[name="three-dots-vertical"]')
      .click({ force: true });

    // Click on 'Skip' menu item
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Skip"]')
      .click({ force: true });
  }

  async allocatetoSelf(name: string) {
    // Click on the "three-dots-vertical" icon
    await this.getWorkItemName(name)
      .locator('twc-icon[name="three-dots-vertical"]')
      .click({ force: true });

    // Click on 'Allocate to Self' menu item
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Allocate to self"]')
      .click({ force: true });
  }

  async reallocatetoOfferSet(resource: string, name: string) {
    // Click on the "three-dots-vertical" icon
    await this.getWorkItemName(name)
      .locator("twc-icon[name='three-dots-vertical']")
      .first()
      .click({ force: true });

    // Navigate through the DOM to click on the "Reallocate to offer set" menu item
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Reallocate to offer set"]')
      .click({ force: true });

    // Locate the dialog and select the resource
    const listItemLocator = this.page
      .locator("bpme-work-items-allocate-offer-set-dialog")
      .locator('div[part="base"]')
      .first()
      .locator("twc-dialog")
      .locator("div")
      .first()
      .locator("twc-list-view")
      .locator('div[part="content"]')
      .locator("twc-list-item");

    await listItemLocator.locator(`text="${resource}"`).click({ force: true });

    // Click on the "Primary" button to finalize the reallocation
    await this.page
      .locator("bpme-work-items-allocate-offer-set-dialog")
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]')
      .click({ force: true });
  }

  async showAdhocTasksStart(taskName: string, name: string) {
    // Click the first "open-button"
    await this.getWorkItemName(name)
      .locator('twc-button[part="open-button"]')
      .click({ force: true });

    // Navigate to the header and click the button inside it
    await this.page
      .locator("bpme-work-item-form")
      .locator("div.base")
      .first()
      .locator('div[part="header-container"]')
      .locator("twc-button")
      .click({ force: true });

    await this.page.waitForTimeout(2000);

    // Find the summary heading with the task name and click the sibling button
    await this.page
      .locator("twc-details")
      .filter({ hasText: taskName })
      .locator("button")
      .click();

    // Wait for 3 seconds
    await this.page.waitForTimeout(3000);

    // Verify that the status is "In progress"
    const statusText = await this.page
      .locator("span.subheadingvalue")
      .first()
      .textContent();

    if (!statusText) {
      throw new Error("Status text is null or empty");
    }

    const status = statusText.trim();
    if (status !== "In progress") {
      throw new Error(
        `Expected status to be "In progress", but got "${status}"`
      );
    }

    // Click the default variant button in the footer section of the dialog
    await this.page
      .locator("bpme-adhoc-tasks")
      .locator('div[part="base"]')
      .locator("twc-dialog")
      .locator('div[part="footer"]')
      .locator('twc-button[variant="default"]')
      .click({ force: true });

    //Wait for 2 seconds
    await this.page.waitForTimeout(2000);

    // Click the first button in the form panel
    await this.page.getByTitle("Cancel").click({ force: true });
  }

  async showAdhocTasksCancel(taskName: string, name: string) {
    // Click the first "open-button"
    await this.getWorkItemName(name)
      .locator('twc-button[part="open-button"]')
      .first()
      .click({ force: true });

    // Navigate to the header and click the button inside it
    await this.page
      .locator("bpme-work-item-form")
      .locator("div.base")
      .first()
      .locator('div[part="header-container"]')
      .locator("twc-button")
      .click({ force: true });

    // Find the summary heading with the task name and click the sibling button
    await this.page
      .locator("twc-details")
      .filter({ hasText: taskName })
      .locator("button")
      .click();

    // Wait for 3 seconds
    await this.page.waitForTimeout(4000);

    // Verify that the status is "Not yet started"
    const statusText = await this.page
      .locator("span.subheadingvalue")
      .first()
      .textContent();

    if (!statusText) {
      throw new Error("Status text is null or empty");
    }

    const status = statusText.trim();
    if (status !== "Not yet started") {
      throw new Error(
        `Expected status to be "Not yet started", but got "${status}"`
      );
    }

    // Click the default variant button in the footer section of the dialog
    await this.page
      .locator("bpme-adhoc-tasks")
      .locator('div[part="base"]')
      .locator("twc-dialog")
      .locator('div[part="footer"]')
      .locator('twc-button[variant="default"]')
      .click({ force: true });

    //Wait for 2 seconds
    await this.page.waitForTimeout(2000);

    // Click the first button in the form panel
    await this.page.getByTitle("Cancel").click({ force: true });
  }

  async reallocatetoWorld(
    version: number,
    orgname: string,
    resource: string,
    name: string
  ) {
    // Click on the 'three-dots-vertical' icon
    await this.getWorkItemName(name)
      .locator("twc-icon[name='three-dots-vertical']")
      .click({ force: true });

    // Click on 'Reallocate to world' menu item
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Reallocate to world"]')
      .first()
      .click({ force: true });

    // Open the version select dropdown and select the given version
    await this.page
      .locator('bpme-mini-org-browser[allowentities="true"]')
      .locator('twc-select[name="version"]')
      .locator(".select__combobox")
      .click({ force: true });

    await this.page
      .locator(`#WORK_MANAGER`)
      .locator(`twc-option[value="${version}"]`)
      .locator(".option__label")
      .click({ force: true });

    // Open the organization group and select the given organization
    await this.page
      .locator('bpme-mini-org-browser[allowentities="true"]')
      .locator('div[class="org-browser-wrapper contenttext"]')
      .locator('div[class="org-section"]')
      .locator('div[class="organizations"]')
      .locator("twc-tree")
      .locator(`twc-tree-items-group[groupvalue="${orgname}"]`)
      .locator('div[slot="trigger"]')
      .first()
      .click({ force: true });

    // Open the resource group and select the given resource
    await this.page
      .locator('bpme-mini-org-browser[allowentities="true"]')
      .locator('div[class="org-section"]')
      .locator('div[class="resources"]')
      .locator(
        'div[class="resources-container section-wrapper bpm-designer-scrollbar"]'
      )
      .locator("twc-tree")
      .locator(`twc-tree-items-group[groupvalue="${resource}"]`)
      .locator('div[slot="lockedTreeGroup"]')
      .click({ force: true });

    // Click on the primary button to finalize reallocation
    await this.page
      .locator("bpme-work-items")
      .locator("twc-dialog")
      .locator('div[class="reallocate-dialog-footer"]')
      .locator('twc-button[variant="primary"]')
      .first()
      .click({ force: true });
  }

  async signOutButton() {
    await this.page.waitForTimeout(1000);
    await this.page.locator('twc-icon[name="user-profile"]').waitFor();
    await this.page.locator('twc-icon[name="user-profile"]').click();
    await this.page.waitForTimeout(2000);
    await this.page.locator('div[class="sign-out-link"]').waitFor();
    await this.page.locator('div[class="sign-out-link"]').click();
    await this.page.waitForTimeout(2000);
  }

  async clickonRefreshButton() {
    await this.page
      .locator('div[class="work-items-header"]')
      .locator('twc-header[label="Default work list"]')
      .locator('span[slot="trailing"]')
      .locator('span[part="work-list-action-block"]')
      .locator('div[part="refresh"]')
      .locator("twc-icon[name='arrow-clockwise']")
      .click();
  }

  async pendWorkItemDate(DateTime: string, name: string) {
    // Click on the three dots vertical icon
    await this.getWorkItemName(name)
      .locator("twc-icon[name='three-dots-vertical']")
      .click({ force: true });
    await this.page.waitForTimeout(5000); // Equivalent to cy.wait(5000)

    // Navigate to the "Pend" menu option
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Pend"]')
      .first()
      .click({ force: true });

    // Select the "date" radio option in the Pend dialog
    await this.page
      .locator(
        'div[class="pend-dialog-contents work-list-pend-dialog-content"]'
      )
      .locator('div[part="radio-group-container"]')
      .locator('twc-radio[value="date"]')
      .click({ force: true });

    // Type the DateTime into the input field
    await this.page
      .locator(
        'div[class="pend-dialog-contents work-list-pend-dialog-content"]'
      )
      .locator('div[class="time-input-container"]')
      .locator('div[part="datetime-container"]')
      .locator('div[part="form-control-input"]')
      .locator('input[type="datetime-local"]')
      .fill(DateTime); // .type() is replaced with .fill() for setting the value

    // Click the Save button to confirm
    await this.page
      .locator("bpme-work-items-pend-dialog")
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]')
      .click({ force: true });
  }

  async pendWorkItemTimeOffset(name: string) {
    // Click on the three dots vertical icon
    await this.getWorkItemName(name)
      .locator("twc-icon[name='three-dots-vertical']")
      .click({ force: true });
    await this.page.waitForTimeout(5000); // Equivalent to cy.wait(5000)

    // Navigate to the "Pend" menu option
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Pend"]')
      .first()
      .click({ force: true });

    // Select the "time" radio option in the Pend dialog
    await this.page
      .locator(
        'div[class="pend-dialog-contents work-list-pend-dialog-content"]'
      )
      .locator('div[part="radio-group-container"]')
      .locator('twc-radio[value="offset"]')
      .click({ force: true });

    // Increase the time offset by clicking the up arrow button
    await this.page
      .locator('div[class="time-input-container"]')
      .locator('div[class="counter-content"]')
      .nth(5)
      .locator("twc-counter")
      .locator('twc-icon[name="chevron-up"]')
      .click({ force: true });

    // Click the Save button to confirm
    await this.page
      .locator("bpme-work-items-pend-dialog")
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]')
      .click({ force: true });
  }

  async sortByColumnNameDescending(columnName: string) {
    // Click the import/export icon
    await this.page
      .locator(
        "[id='WORK_MANAGER'] bpme-work-items twc-icon[name='import_export']"
      )
      .click({ force: true });

    // Open the sorting dialog and select the column name
    const dialog = this.page.locator("bpme-work-items-sort-config-dialog");
    await dialog.locator(`text="${columnName}"`).click({ force: true });

    // Click again on the column name to make it descending
    const listView = this.page
      .locator(".dialog.sort-dialog")
      .locator(".selectedData");
    await listView.locator(`text=${columnName}`).click();

    // Confirm the selection
    const footer = dialog.locator('div[part="footer"] twc-button >> nth=2');
    await footer.locator("button").click({ force: true });
  }

  async openWorkItem(inputText: string, name: string) {
    // Click the first 'open-button'

    await this.openWorklist(name);
    // await this.page.locator('twc-button[part="open-button"]').first().click({ force: true });
    await this.page.waitForTimeout(1000);

    // Click on the checkbox input
    await this.page
      .locator(
        'span.gwt-CheckBox.control-widget.form-control input[type="checkbox"]'
      )
      .click({ force: true });

    // Click on the 'list-add' link
    await this.page
      .locator("span.list-add a.gwt-Anchor.btn-xs")
      .click({ force: true });

    // Type the provided string into the input field
    await this.page
      .locator("input.gwt-TextBox.form-control")
      .pressSequentially(inputText, { delay: 50 }); // Using fill() instead of type() for exact text input
    await this.page.waitForTimeout(2000);

    // Click the primary button
    await this.page
      .locator('div[tf-comp-type="button primary"] div.tf-container button')
      .click({ force: true });
  }

  async changeTheme(name: string) {
    await this.page.locator("twc-icon.profile-icon").click();

    await this.page
      .locator("twc-categoriser[label='Themes']")
      .locator("twc-icon[name='sizer']")
      .click();

    await this.page.locator("twc-button[slot='trigger']").click();

    await this.page.locator("twc-menu-item[value='tibcoDefault']").click();

    await this.page.locator("twc-list-item").filter({ hasText: name }).click();

    await this.page.locator("div.profile-close-group").click();
  }

  async applyAutoRefresh(seconds: number) {
    await this.page.locator("twc-icon.refresh-icon").click();
  }

  async verifyAutoRepeatWorkItem(inputText: string) {
    // Click the first 'open-button'

    await (await this.textReallocatetoSelf()).fill(inputText, { force: true });

    // Submit the form
    await (await this.array001SubmitButton()).click({ force: true });
  }

  getWorkItemName(name: string) {
    return this.page
      .locator("twc-table-row", {
        has: this.page.locator('twc-table-cell[data-column-id="name"]', {
          hasText: name,
        }),
      })
      .first();
  }

  async changePriorityWorkItemAbsolute(
    priority: string | number,
    name: string
  ) {
    //Click the first three-dots vertical icon
    await this.getWorkItemName(name)
      .locator("twc-icon[name='three-dots-vertical']")
      .click({ force: true });

    // Click the "Change priority" menu item
    await this.getWorkItemName(name)
      .locator("twc-menu-item[title='Change priority']")
      .first()
      .click({ force: true });
    // await this.page
    //   .locator('twc-menu-item[title="Change priority"]')
    //   .first()
    //   .click();

    // Locate the range input and update the priority
    const rangeInput = this.page
      .locator("twc-input[id='rangeInputControl']")
      .locator("input[id='input']");

    // Clear and type the new priority
    await rangeInput.clear();
    await rangeInput.pressSequentially(priority.toString(), { delay: 150 });
  }

  async saveButton(): Promise<Locator> {
    return this.page
      .locator("bpme-work-items-priority-dialog")
      .locator('div[part="base"]')
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]')
      .locator("button");
  }

  async saveBtnChangePriority() {
    // Locate the Save button and click it
    const saveButton = this.page
      .locator("bpme-work-items-priority-dialog")
      .locator('div[part="base"]')
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]');

    await saveButton.click({ force: true });
  }

  async changePriorityWorkItemOffset(priority: string | number, name: string) {
    // Click the first three-dots vertical icon
    await this.getWorkItemName(name)
      .locator("twc-icon[name='three-dots-vertical']")
      .click({ force: true });

    // Click the "Change priority" menu item
    await this.getWorkItemName(name)
      .locator('twc-menu-item[title="Change priority"]')
      .click({ force: true });

    // Select the "Offset" radio option
    const offsetRadio = this.page
      .locator('div[class="p-6 space-y-6 work-list-priority-dialog-content"]')
      .locator('div[class="content"]')
      .locator('div[part="label-container"]')
      .locator('div[part="radio-group-container"]')
      .locator("twc-radio-group")
      .locator('twc-radio[id="offsetRadio"]');

    await offsetRadio.click({ force: true });

    // Update the priority in the range input
    const rangeInput = this.page
      .locator('div[class="p-6 space-y-6 work-list-priority-dialog-content"]')
      .locator('div[class="content"]')
      .locator('div[part="label-container"]')
      .locator('div[class="range-container"]')
      .locator('div[class="range-number-control"]')
      .locator('twc-input[id="rangeInputControl"]')
      .locator('input[id="input"]');

    await rangeInput.clear();
    await rangeInput.pressSequentially(priority.toString(), { delay: 150 });
  }

  async selectingParticularColumn(columnname: string) {
    // Click the view column icon to open the column selector
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-icon[name="view_column"]')
      .click({ force: true });

    // Open the column selector dialog and click on the column based on its name
    const column = this.page
      .locator("bpme-work-items-column-selector-dialog")
      .locator("twc-list-view")
      .locator("twc-list-item");

    await column.locator(`text="${columnname}"`).click();

    // Click the button in the footer to apply the selection
    await this.page
      .locator("bpme-work-items-column-selector-dialog")
      .locator('div[part="footer"]')
      .locator("twc-button")
      .nth(1)
      .locator("button")
      .click({ force: true });
  }

  async filterByColumnNameDropdown(
    columnname: string,
    operatordata: string,
    data: string
  ) {
    // Click on the filter icon
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-icon[name="filter"]')
      .first()
      .click({ force: true });

    // Click the "Add Rule" button in the filter dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items-filter-dialog")
      .locator("twc-query-builder")
      .locator('twc-button-group[label="Rule"]')
      .locator('twc-tooltip[content="Add Rule"]')
      .locator("twc-button")
      .click({ force: true });

    // Select the column from the first dropdown
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-select[class="fieldData"]')
      .click();
    await this.page
      .locator(`twc-option[value="${columnname}"]`)
      .click({ force: true });

    // Select the operator from the second dropdown
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-select[class="operatorData"]')
      .click();
    await this.page
      .locator(`twc-option[value="${operatordata}"]`)
      .click({ force: true });

    // Select the value from the third dropdown
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-select[class="operatorDataField"]')
      .click();
    await this.page
      .locator(`twc-option[value="${data}"]`)
      .click({ force: true });

    // Wait for the UI to update (if necessary)
    await this.page.waitForTimeout(3000); // Adjust the wait time if necessary

    // Click the "Apply" button in the filter dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items-filter-dialog")
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]')
      .click({ force: true });
  }
  async filterByColumnName(
    columnname: string,
    operatordata: string,
    data: string
  ) {
    // Click on the filter icon
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-icon[name="filter"]')
      .first()
      .click({ force: true });

    // Click the "Add Rule" button in the filter dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items-filter-dialog")
      .locator("twc-query-builder")
      .locator('twc-button-group[label="Rule"]')
      .locator('twc-tooltip[content="Add Rule"]')
      .locator("twc-button")
      .click({ force: true });

    // Select the column from the first dropdown
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-select[class="fieldData"]')
      .click();
    await this.page
      .locator(`twc-option[value="${columnname}"]`)
      .click({ force: true });

    // Select the operator from the second dropdown
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-select[class="operatorData"]')
      .click();
    await this.page
      .locator(`twc-option[value="${operatordata}"]`)
      .click({ force: true });

    // Select the value from the third field
    await this.page.locator(`twc-input.operatorDataField`).click();
    await this.page
      .locator(`twc-input.operatorDataField`)
      .pressSequentially(data);

    // Wait for the UI to update (if necessary)
    await this.page.waitForTimeout(3000); // Adjust the wait time if necessary

    // Click the "Apply" button in the filter dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items-filter-dialog")
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]')
      .click({ force: true });
  }

  async clickonThreeDotsWorklist(name: string) {
    await this.getWorkItemName(name)
      .locator("twc-icon[name='three-dots-vertical']")
      .click({ force: true });
  }
  async openNextVisibility() {
    await this.clickonThreeDotsWorklist("T1");
    await this.page.locator('twc-menu-item[title="Open next"]').click();
  }
  async clickoncheckbox(name: string) {
    await this.getWorkItemName(name)
      .locator("input[class='checkbox__input']")
      .click({ force: true });
  }

  async filterByStartDate(columnname: string, operatordata: string, data: any) {
    // Click on the filter icon
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-icon[name="filter"]')
      .first()
      .click({ force: true });

    // Click the "Add Rule" button in the filter dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items-filter-dialog")
      .locator("twc-query-builder")
      .locator('twc-button-group[label="Rule"]')
      .locator('twc-tooltip[content="Add Rule"]')
      .locator("twc-button")
      .click({ force: true });

    // Select the column from the first dropdown
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-select[class="fieldData"]')
      .click();
    await this.page
      .locator(`twc-option[value="${columnname}"]`)
      .click({ force: true });

    // Select the operator from the second dropdown
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-select[class="operatorData"]')
      .click();
    await this.page
      .locator(`twc-option[value="${operatordata}"]`)
      .click({ force: true });
    await this.page.waitForTimeout(1000);
    // Select the value from the third dropdown
    await this.page.locator('input[type="datetime-local"]').waitFor();
    await this.page.fill('input[type="datetime-local"]', data);

    // Wait for the UI to update (if necessary)
    await this.page.waitForTimeout(3000); // Adjust the wait time if necessary

    // Click the "Apply" button in the filter dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items-filter-dialog")
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]')
      .click({ force: true });
  }

  async resetFilter() {
    // Click on the filter icon to open the filter dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator('twc-icon[name="filter"]')
      .first()
      .click({ force: true });

    // Click the second button (reset filter) in the footer section of the dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items")
      .locator("bpme-work-items-filter-dialog")
      .locator('div[part="footer-section"]')
      .locator("twc-button")
      .nth(1) // `.eq(1)` in Cypress is `.nth(1)` in Playwright
      .locator("button")
      .click({ force: true });

    // Wait for any necessary UI updates (can adjust timing as needed)
    await this.page.waitForTimeout(1000); //Adjust the wait time if necessary

    // Click the third button (confirm reset filter) in the footer section of the dialog
    await this.page
      .locator('[id="WORK_MANAGER"]')
      .locator("bpme-work-items-filter-dialog")
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[size="small"]')
      .nth(2) // `.eq(2)` in Cypress is `.nth(2)` in Playwright
      .click({ force: true });

    // Click the primary button to apply the reset filter
    await this.page
      .locator("bpme-work-items-filter-dialog")
      .locator("twc-dialog")
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]')
      .locator("button")
      .click({ force: true });
  }
  async openWorklist(name: string) {
    await this.page.getByRole("cell", { name: name }).last().hover();
    await this.open.click();
    await this.page.waitForTimeout(1000);
  }

  //New Locators..................................................
  async myWork(): Promise<Locator> {
    return this.page.locator('twc-navmenu-item[tooltipcontent="My Work"]');
  }

  async dataColumnId(): Promise<Locator> {
    return this.page.locator('twc-table-cell[data-column-id="id"]');
  }

  async dataColumnAppInstance(): Promise<Locator> {
    return this.page.locator('twc-table-cell[data-column-id="appInstance"]');
  }

  async dataColumnState(): Promise<Locator> {
    return this.page.locator('twc-table-cell[data-column-id="state"]');
  }

  async dataColumnStartDate(): Promise<Locator> {
    return this.page.locator('twc-table-cell[data-column-id="startDate"]');
  }

  async dataColumnName(): Promise<Locator> {
    return this.page.locator('twc-table-cell[data-column-id="name"]');
  }

  async switchInputAutoRefresh(): Promise<Locator> {
    return this.page
      .locator('div[part="switch-container"]')
      .locator('label[part="base"]')
      .locator("span[part='control']");
  }

  async verifySwitchInputAutoRefresh(): Promise<Locator> {
    return this.page
      .locator('div[part="switch-container"]')
      .locator('input.switch__input[type="checkbox"]');
  }

  async chevronupAutoRefresh(): Promise<Locator> {
    return this.page
      .locator('div[part="timer-control"]')
      .locator("twc-icon[name='chevron-up']");
  }

  async chevrondownAutoRefresh(): Promise<Locator> {
    return this.page
      .locator('div[part="timer-control"]')
      .locator("twc-icon[name='chevron-down']");
  }

  async futuresessionAutoRefresh(): Promise<Locator> {
    return this.page
      .locator('div[part="checkbox-container"]')
      .locator("twc-checkbox")
      .locator('label[part="base"]')
      .locator("span[part='control']");
  }

  async verifycheckboxAutoRefresh(): Promise<Locator> {
    return this.page
      .locator('div[part="checkbox-container"]')
      .locator("twc-checkbox")
      .locator('label[part="base"]')
      .locator("input.checkbox__input");
  }

  async autoRefreshButton(): Promise<Locator> {
    return this.page.locator("twc-icon.refresh-icon");
  }

  async verifyArray001checkbox(): Promise<Locator> {
    return this.page.locator("span.gwt-CheckBox input");
  }

  async verifyArray001text(): Promise<Locator> {
    return this.page.locator("div.list-item span");
  }

  async array001SubmitButton(): Promise<Locator> {
    return this.page.locator(
      'div[tf-comp-type="button primary"] div.tf-container button'
    );
  }

  async textReallocatetoSelf(): Promise<Locator> {
    return this.page.locator(
      "textarea.gwt-TextArea.control-widget.form-control"
    );
  }

  async priorityErrorMsg(): Promise<Locator> {
    return this.page.locator('div[part="error-msg"]');
  }

  async applyButtonAutoRefresh(): Promise<Locator> {
    return this.page
      .locator('twc-dialog[class="dialog autorefresh-dialog"]')
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="primary"]');
  }

  async verifyValueAutoRefresh(): Promise<Locator> {
    return this.page.locator('input[id="inputControl"]');
  }
  async cancelButtonAutoRefresh(): Promise<Locator> {
    return this.page
      .locator('twc-dialog[class="dialog autorefresh-dialog"]')
      .locator('div[part="footer-section"]')
      .locator('twc-button[variant="default"]');
  }

  async getWorkItemState(name: string): Promise<Locator> {
    const rowName = this.getWorkItemName(name);
    return rowName.locator('twc-table-cell[data-column-id="state"]');
  }

  async getWorkItemPriority(name: string): Promise<Locator> {
    const rowName = this.getWorkItemName(name);
    return rowName.locator('twc-table-cell[data-column-id="priority"]');
  }

  async getWorkItemId(name: string): Promise<Locator> {
    const rowName = this.getWorkItemName(name);
    return rowName.locator('twc-table-cell[data-column-id="id"]');
  }

  async getWorkItemIdName(name: string): Promise<Locator> {
    const rowName = this.getWorkItemName(name);
    return rowName.locator('twc-table-cell[data-column-id="name"]');
  }

  async verifyTextArray001Function(gettext: string, expectedtext: string) {
    if (gettext) {
      const trimmedText = gettext.trim();
      expect(trimmedText).toBe(expectedtext);
    } else {
      throw new Error("The list item text is null");
    }
  }

  async fillLocalDataForm(caseState1: string, caseID: string, firstName: string, lastName: string) {
    await this.localData_caseState1.selectOption(caseState1);
    await this.localData_caseID.fill(caseID);
    await this.localData_firstName.fill(firstName);
    await this.localData_lastName.fill(lastName);
  }

  async submitAdhocTask() {
    await this.localData_submitBtn.click();
  }

  async submitLocalDataForm() {
    await this.localData_submitBtn.click();
  }

  async fillDetailsFromUser(customerName: string, customerAddress: string): Promise<string> {
    const randomId = Math.floor(Math.random() * 90000 + 10000).toString();
    await this.localData_caseIdentifier1.fill(randomId);
    await this.localData_caseState1.selectOption('YES');
    await this.localData_customerName.fill(customerName);
    await this.localData_customerAddress.fill(customerAddress);
    return randomId;
  }

  async clickOpenForWorkItem(name: string): Promise<Page> {
    const row = this.page.locator('twc-table-row').filter({
      has: this.page.locator(`twc-table-cell[data-column-id="name"][title="${name}"]`)
    });
    await row.waitFor({ state: 'visible' });
    await row.hover();
    await row.locator('twc-button[part="open-button"]').click();
    await this.page.locator('tibco-form').waitFor({ state: 'visible' });
    return this.page;
  }

  async clickOpenBSPF2WorkItem(name: string): Promise<Page> {
    const row = this.page.locator('twc-table-row').filter({
      has: this.page.locator(`twc-table-cell[data-column-id="name"]`, { hasText: name })
    });
    await row.waitFor({ state: 'visible' });
    await row.hover();
    await row.locator('twc-button[part="open-button"]').click();
    await this.page.locator('tibco-form').waitFor({ state: 'visible' });
    return this.page;
  }

  async sortByStartDateDescending() {
    await this.page.getByRole('img', { name: 'Sort' }).getByRole('img').click();
    await this.page.getByRole('menuitem', { name: 'Start date', exact: true }).getByRole('img').click();
    await this.page.getByRole('menuitem', { name: 'Start date' }).locator('label span').first().click();
    await this.page.getByRole('menuitem', { name: 'Start date ( Ascending )' }).locator('path').first().click();
    await this.page.getByRole('button', { name: 'Save' }).click();
  }
}
