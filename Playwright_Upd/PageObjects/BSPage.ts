import { type Locator, type Page, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class BSPage {
  readonly page: Page;
  readonly inputOrderID: Locator;
  readonly cancelBtn: Locator;
  readonly submitBtn: Locator;
  readonly bs: Locator;
  readonly open: Locator;
  readonly BSheader: Locator;
  readonly bsFormHeader: Locator;
  readonly textField: Locator;
  readonly intField: Locator;
  readonly booleanFIeld: Locator;
  readonly dateField: Locator;
  readonly dateTimeField: Locator;
  readonly decimalField: Locator;
  readonly timeField: Locator;
  readonly dateTimeInput: Locator;
  readonly dateInput: Locator;
  readonly timeInput: Locator;

  // BSPF2 form field locators (DFInOutClass pane, inside formsclient iframe)
  readonly bspf2TextAtt: Locator;
  readonly bspf2IntegerAtt: Locator;
  readonly bspf2DecimalAtt: Locator;
  readonly bspf2DateAtt: Locator;
  readonly bspf2TimeAtt: Locator;
  readonly bspf2BooleanAtt: Locator;
  readonly bspf2DurationDays: Locator;
  readonly bspf2DurationHours: Locator;
  readonly bspf2IDAtt: Locator;
  readonly bspf2URIAtt: Locator;
  readonly navigationWarningDialog: Locator;
  readonly navigationWarningDialogText: Locator;
  readonly navigationWarningYesCloseBtn: Locator;
  readonly navigationErrorDialogText: Locator;
  readonly navigationErrorDismissBtn: Locator;

  // BSPF1 form field locators (DFInOutClass pane, inside formsclient iframe)
  readonly bspf1TextAtt: Locator;
  readonly bspf1IntegerAtt: Locator;
  readonly bspf1DecimalAtt: Locator;
  readonly bspf1DateAtt: Locator;
  readonly bspf1TimeAtt: Locator;
  readonly bspf1BooleanAtt: Locator;
  readonly bspf1DurationDays: Locator;
  readonly bspf1DurationHours: Locator;
  readonly bspf1IDAtt: Locator;
  readonly bspf1URIAtt: Locator;

  readonly dbInsertCustId: Locator;
  readonly dbInsertCustName: Locator;

  // Fill Customer Data form fields
  readonly customerNameField: Locator;
  readonly accountNumberField: Locator;
  readonly accountTypeField: Locator;
  readonly accountStateDropdown: Locator;
  readonly debitCardStateDropdown: Locator;

  constructor(page: Page) {
    this.page = page;

    // Main page locators (navigation panel, header, toolbar)
    this.inputOrderID = page.getByLabel(
      "label_f1_widget_control_OrderlocalData_orderID"
    );
    this.BSheader = page.locator(".header__title").nth(1);

    // Forms render in two ways depending on the server type:
    //   BPM 4x  → inside an iframe whose src contains "formsclient"
    //   BPME    → as a <tibco-form> web component directly on the page
    // Each locator uses .or() so it resolves in whichever context is active.
    const ff = page.frameLocator('iframe[src*="formsclient"]');
    const fi = (sel: string) => ff.locator(sel).or(page.locator(sel));

    this.bsFormHeader = ff.getByText("User Task").or(page.getByText("User Task"));
    this.cancelBtn = fi('#f1_widget_control_cancel');
    this.submitBtn = fi('#f1_widget_control_submit');
    this.textField = fi('#f1_widget_control_myText');
    this.intField = fi('#f1_widget_control_myInt');
    this.booleanFIeld = fi('#f1_widget_control_myBoolean input[type="checkbox"]');
    this.decimalField = fi('#f1_widget_control_myDecimal');
    this.dateField = fi('#f1_widget_control_myDate input.selected-value');
    this.timeField = fi("#f1_widget_control_myTime").getByRole("button");
    this.dateTimeField = fi(".advanced-TextButtonPanel.control-widget.tf-widget-datetime").getByRole("button");
    this.dateTimeInput = fi("#f1_widget_control_myDateTime input.selected-value");
    this.dateInput = fi("#f1_widget_control_myDate input.selected-value");
    this.timeInput = fi("#f1_widget_control_myTime input.selected-value");

    // BSPF2 DFInOutClass form fields
    this.bspf2TextAtt = fi("#f1_widget_control_DFInOutClass_textAtt");
    this.bspf2IntegerAtt = fi("#f1_widget_control_DFInOutClass_integerAtt");
    this.bspf2DecimalAtt = fi("#f1_widget_control_DFInOutClass_decimalAtt");
    this.bspf2DateAtt = fi("#f1_widget_control_DFInOutClass_dateAtt input.selected-value");
    this.bspf2TimeAtt = fi("#f1_widget_control_DFInOutClass_timeAtt input.selected-value");
    this.bspf2BooleanAtt = fi("#f1_widget_control_DFInOutClass_booleanAtt input[type='checkbox']");
    this.bspf2DurationDays = fi("#container_days_duration_panel_f1_widget_control_DFInOutClass_durationAtt input");
    this.bspf2DurationHours = fi("#container_hours_duration_panel_f1_widget_control_DFInOutClass_durationAtt input");
    this.bspf2IDAtt = fi("#f1_widget_control_DFInOutClass_IDAtt");
    this.bspf2URIAtt = fi("#f1_widget_control_DFInOutClass_URIAtt");
    this.navigationWarningDialog = page.locator('div[role="dialog"][aria-modal="true"][aria-hidden="false"].dialog__panel');
    this.navigationWarningDialogText = page.locator('#businessServicesComp twc-alert-dialog').filter({ hasText: "Do you want to close this form?" });
    this.navigationWarningYesCloseBtn = page.getByRole("button", { name: "Yes, close" });
    this.navigationErrorDialogText = page.locator('twc-alert-dialog').filter({ hasText: "Error occurred while processing the request, please check logs for more information." });
    this.navigationErrorDismissBtn = page.getByRole("button", { name: "Dismiss" });

    //BSPF1 PInOutClass form fields
    this.bspf1TextAtt = fi("#f1_widget_control_PInOutClass_textAtt");
    this.bspf1IntegerAtt = fi("#f1_widget_control_PInOutClass_integerAtt");
    this.bspf1DecimalAtt = fi("#f1_widget_control_PInOutClass_decimalAtt");
    this.bspf1DateAtt = fi("#f1_widget_control_PInOutClass_dateAtt input.selected-value");
    this.bspf1TimeAtt = fi("#f1_widget_control_PInOutClass_timeAtt input.selected-value");
    this.bspf1BooleanAtt = fi("#f1_widget_control_PInOutClass_booleanAtt input[type='checkbox']");
    this.bspf1DurationDays = fi("#container_days_duration_panel_f1_widget_control_PInOutClass_durationAtt input");
    this.bspf1DurationHours = fi("#container_hours_duration_panel_f1_widget_control_PInOutClass_durationAtt input");
    this.bspf1IDAtt = fi("#f1_widget_control_PInOutClass_IDAtt");
    this.bspf1URIAtt = fi("#f1_widget_control_PInOutClass_URIAtt");

    this.dbInsertCustId = fi("#f1_widget_control_custId");
    this.dbInsertCustName = fi("#f1_widget_control_custName");

    // Fill Customer Data form fields
    // Form selects: nth(0)=State(SavingData), nth(1)=Type(accountAdditionalInfo), last=debitCardState(DebitCardData)
    this.accountStateDropdown = page.locator("select").first();
    this.accountTypeField = page.locator("select").nth(1);
    this.debitCardStateDropdown = page.locator("select").last();
    // Text inputs: 0=AccountNumber(readonly), 1=SavingInterestRate, 2=ServiceRequest, 3=BranchAddress, 4=CustomerName, 5=Mobile
    this.accountNumberField = page.locator("input").nth(0);
    this.customerNameField = page.locator("input").nth(4);
  }

  async clickOnBS() {
    await this.page.getByText("BS_AllTypes", { exact: true }).click();
    await this.page.getByText("BS_AllTypes-Start Event").click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService() {
    await this.page.getByText('BPMSimpleCaseActionProject').first().click();
    await this.page.locator('#item_BPMSimpleCaseActionProject').getByText('BPMSimpleCaseActionProject').click();
    await this.page.getByText("BPMCreateCaseProcessStartEvent").click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService_BSPF2() {
    await this.page.getByText('BSPF2').first().click();
    await this.page.locator('#item_BSPF2').getByText('BSPF2', { exact: true }).click();
    await this.page.getByText("BSPF2BSPF2Operation").click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService_BSAllTypes() {
    await this.page.getByText('BS_AllTypes').first().click();
    await this.page.getByText("BS_AllTypesStartEvent").click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService_BSPF1() {
    await this.page.getByText('BSPF1').first().click();
    await this.page.locator('#item_BSPF1').getByText('BSPF1', { exact: true }).click();
    await this.page.getByText("BSPF1BSPF1Operation").click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService_DbInsert() {
    await this.page.getByText('BSCat').first().click();
    await this.page.locator('#item_DBInset').getByText('DBInset', { exact: true }).click();
    await this.page.getByText("DBInsertStartEvent").click();
    await this.page.waitForTimeout(500);
  }

  async verifyBSheader() {
    return this.BSheader.innerText();
  }

  async refreshIcon(): Promise<Locator> {
    return this.page.locator("[tooltipcontent='Refresh']");
  }

  async verifyAllDetails(
    expectedDecimal: string,
    expectedInt: string,
    expectedText: string,
    expectedDate: string
  ) {

    // myDateTime field format is "MM/DD/YYYY HH:mm:ss+timezone" — check only the date portion
    expect(await this.dateTimeInput.inputValue()).toContain(utility.getCurrentDateNumeric());
    // myDate field format is "Apr 08, 2026"
    expect(await this.dateInput.inputValue()).toBe(expectedDate);
    // myTime field format is "HH:mm:ss AM/PM" — verify format only (seconds may differ)
    expect(await this.timeInput.inputValue()).toMatch(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);

    // Static script-populated values — exact match
    expect(await this.decimalField.inputValue()).toBe(expectedDecimal);
    expect(await this.intField.inputValue()).toBe(expectedInt);
    expect(await this.textField.inputValue()).toBe(expectedText);
    await expect(this.booleanFIeld).toBeChecked();
  }

  async verifyBSPF2Form(data: {
    textAtt: string;
    integerAtt: string;
    decimalAtt: string;
    dateAtt: string;
    timeAtt: string;
    booleanAtt: boolean;
    durationDays: string;
    durationHours: string;
    idAtt: string;
    uriAtt: string;
  }) {
    await expect(this.bspf2TextAtt).toHaveValue(data.textAtt);
    await expect(this.bspf2IntegerAtt).toHaveValue(data.integerAtt);
    await expect(this.bspf2DecimalAtt).toHaveValue(data.decimalAtt);
    await expect(this.bspf2DateAtt).toHaveValue(data.dateAtt);
    await expect(this.bspf2TimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
    if (data.booleanAtt) {
      await expect(this.bspf2BooleanAtt).toBeChecked();
    } else {
      await expect(this.bspf2BooleanAtt).not.toBeChecked();
    }
    await expect(this.bspf2DurationDays).toHaveValue(data.durationDays);
    await expect(this.bspf2DurationHours).toHaveValue(data.durationHours);
    await expect(this.bspf2IDAtt).toHaveValue(data.idAtt);
    await expect(this.bspf2URIAtt).toHaveValue(data.uriAtt);
  }

  async verifyBSPF1_SecondForm(data: {
    textAtt: string;
    integerAtt: string;
    decimalAtt: string;
    dateAtt: string;
    timeAtt: string;
    booleanAtt: boolean;
    durationDays: string;
    durationHours: string;
    idAtt: string;
    uriAtt: string;
  }) {
    await expect(this.bspf1TextAtt).toHaveValue(data.textAtt);
    await expect(this.bspf1IntegerAtt).toHaveValue(data.integerAtt);
    await expect(this.bspf1DecimalAtt).toHaveValue(data.decimalAtt);
    await expect(this.bspf1DateAtt).toHaveValue(data.dateAtt);
    await expect(this.bspf1TimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
    if (data.booleanAtt) {
      await expect(this.bspf1BooleanAtt).toBeChecked();
    } else {
      await expect(this.bspf1BooleanAtt).not.toBeChecked();
    }
    await expect(this.bspf1DurationDays).toHaveValue(data.durationDays);
    await expect(this.bspf1DurationHours).toHaveValue(data.durationHours);
    await expect(this.bspf1IDAtt).toHaveValue(data.idAtt);
    await expect(this.bspf1URIAtt).toHaveValue(data.uriAtt);
  }

  async verifyNavigationWarningAndClose() {
    await expect(this.navigationWarningDialog).toBeVisible();
    await expect(this.navigationWarningDialogText).toContainText("Do you want to close this form?");
    await this.navigationWarningYesCloseBtn.click();
  }

  async enterAllDetails(text: string, num: string, date: string, time: string) {
    await this.textField.waitFor({ state: "visible", timeout: 15000 });
    await this.page.waitForTimeout(500);
    await this.textField.clear();
    await this.textField.pressSequentially(text, { delay: 100 });
    await this.intField.clear();
    await this.intField.fill(num);
    await this.booleanFIeld.check();
    await this.page.waitForTimeout(1000);
    await this.dateField.click();
    await this.dateField.clear();
    await this.dateField.pressSequentially(date, { delay: 150 });
    await this.timeField.click();
    await this.page.getByRole("button", { name: "OK" }).click();
    //await this.timeField.pressSequentially(time, { delay: 100 });
    //Date time field
    await this.dateTimeField.click();
    await this.page.getByRole("button", { name: "OK" }).click();
    await this.decimalField.fill("4.5");
    await this.submitBtn.click();
    await this.page.waitForTimeout(500);
  }

  async enterDetailsInDbInsertForm(custId: string, custName: string) {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);
    await this.dbInsertCustId.fill(custId);
    await this.dbInsertCustName.fill(custName);
    await this.submitBtn.click();
  }

  async verifyErrorMessageDialog() {
    await expect(this.navigationWarningDialog).toBeVisible();
    await expect(this.navigationErrorDialogText).toContainText("Error occurred while processing the request, please check logs for more information.");
    await this.navigationErrorDismissBtn.click();
    await this.page.waitForTimeout(3000);
  }

  async clickOnFillFormBS() {
    const outerBS = this.page.getByText('BankSolution', { exact: true }).first();
    await outerBS.waitFor({ state: 'visible', timeout: 30000 });
    await outerBS.click();
    await this.page.waitForTimeout(1000);

    const innerBS = this.page.getByText('BankSolution', { exact: true }).nth(1);
    await innerBS.waitFor({ state: 'visible', timeout: 10000 });
    await innerBS.click();
    await this.page.waitForTimeout(1000);

    await this.page.getByText('Fill Customer Data', { exact: true }).click();
    await this.page.waitForTimeout(2000);
  }

  async fillCustomerDataForm(customerName: string, _accountType: string, accountState: string, stateIndex: number) {
    await this.page.waitForLoadState("networkidle");
    await this.page.waitForTimeout(1000);

    const evenIdx = (stateIndex % 2) + 1;
    const oddIdx  = ((stateIndex + 1) % 2) + 1;

    // === SavingData section ===
    const stateOpts = await this.accountStateDropdown.locator('option').allTextContents();
    const stateMatch = stateOpts.find(o => o.trim() === accountState);
    if (stateMatch) {
      await this.accountStateDropdown.selectOption({ label: accountState });
    } else {
      await this.accountStateDropdown.selectOption({ index: evenIdx });
    }
    await this.page.waitForTimeout(500);
    await this.accountTypeField.selectOption({ index: evenIdx });
    await this.page.waitForTimeout(500);

    // === accountAdditionalInfo section ===
    const interestRate = stateIndex % 2 === 0 ? "5.5" : "6.75";
    const serviceReq   = `SR-2024-00${stateIndex + 1}`;
    await this.page.locator("input").nth(1).fill(interestRate);
    await this.page.locator("input").nth(2).fill(serviceReq);
    await this.page.locator("input").nth(3).fill("London Main Branch");
    await this.page.locator("input").nth(4).clear();
    await this.page.locator("input").nth(5).fill(customerName);
    await this.page.locator("input").nth(6).fill("07700900000");

    // === LoanAccountData section — selects ===
    await this.page.locator("select").nth(2).scrollIntoViewIfNeeded();
    await this.page.locator("select").nth(2).selectOption({ index: evenIdx });
    await this.page.waitForTimeout(500);
    await this.page.locator("select").nth(3).selectOption({ index: oddIdx });
    await this.page.waitForTimeout(500);

    // === LoanAccountData section — text fields ===
    const safeFill = async (id: string, value: string) => {
      const el = this.page.locator(id);
      if ((await el.count()) > 0) {
        await el.scrollIntoViewIfNeeded();
        await el.fill(value);
      }
    };
    const loanAmount  = stateIndex % 2 === 0 ? "50000" : "75000";
    const cibilScore  = stateIndex % 2 === 0 ? "750"   : "680";
    const loanRate    = stateIndex % 2 === 0 ? "8.5"   : "10.25";
    await safeFill("#f1_widget_control_LoanAccountData_customerName", customerName);
    await safeFill("#f1_widget_control_LoanAccountData_customerContact", "07700900001");
    await safeFill("#f1_widget_control_LoanAccountData_customerCIBILScore", cibilScore);
    await safeFill("#f1_widget_control_LoanAccountData_loanInterestRate", loanRate);
    if ((await this.page.locator("#f1_widget_control_LoanAccountData_loanTenureInYrs").count()) > 0) {
      await this.page.locator("#f1_widget_control_LoanAccountData_loanTenureInYrs").scrollIntoViewIfNeeded();
      await this.page.locator("#f1_widget_control_LoanAccountData_loanTenureInYrs").fill(stateIndex % 2 === 0 ? "10" : "15");
    } else {
      await safeFill("#f1_widget_control_LoanAccountData_loanTenureinYrs", stateIndex % 2 === 0 ? "10" : "15");
    }
    await safeFill("#f1_widget_control_LoanAccountData_disbursedAmount", loanAmount);
    await safeFill("#f1_widget_control_LoanAccountData_loanBranch", "London Main Branch");

    // === DebitCardData section ===
    await this.debitCardStateDropdown.scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.debitCardStateDropdown.selectOption({ index: oddIdx });
    await this.page.waitForTimeout(500);

    await safeFill("#f1_widget_control_DebitCardData_cardHolderName", customerName);
    await safeFill("#f1_widget_control_DebitCardData_cvv", stateIndex % 2 === 0 ? "123" : "456");

    await this.submitBtn.scrollIntoViewIfNeeded();
    await this.submitBtn.click();
    await this.page.waitForTimeout(2000);
  }

  async clickOnStartEvent(): Promise<Locator> {
    return this.page.locator("//*[@id='cdk-accordion-child-0']/div/bpm-business-tree-nested/cdk-virtual-scroll-viewport/div[1]/mat-tree/mat-nested-tree-node/li/ul/mat-nested-tree-node/li/ul/mat-tree-node/li/button");
  }
}
