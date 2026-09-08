import { type Locator, type Page, expect } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class BS5xPage {
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

  // BSPF2 form field locators
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

  // BSPF1 form field locators
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

  constructor(page: Page) {
    this.page = page;

    // Main page locators (navigation panel, header)
    this.inputOrderID = page.getByLabel("label_f1_widget_control_OrderlocalData_orderID");
    this.BSheader = page.locator(".header__title").nth(1);

    // The Business Service form renders its HTML rooted at #f1_TibcoForms.
    // Scoping all locators to this root works whether the form is in light DOM
    // or inside a shadow root (Playwright auto-pierces one shadow level).
    const form = page.locator('#f1_TibcoForms');

    this.bsFormHeader = form.getByText("User Task");
    this.cancelBtn    = form.locator('#f1_widget_control_cancel');
    this.submitBtn    = form.locator('#f1_widget_control_submit');
    this.textField    = form.locator('#f1_widget_control_myText');
    this.intField     = form.locator('#f1_widget_control_myInt');
    this.booleanFIeld = form.locator('#f1_widget_control_myBoolean input[type="checkbox"]');
    this.decimalField = form.locator('#f1_widget_control_myDecimal');
    this.dateField    = form.locator('#f1_widget_control_myDate input.selected-value');
    this.timeField    = form.locator('#f1_widget_control_myTime').getByRole('button');
    this.dateTimeField = form.locator('.advanced-TextButtonPanel.control-widget.tf-widget-datetime').getByRole('button');
    this.dateTimeInput = form.locator('#f1_widget_control_myDateTime input.selected-value');
    this.dateInput    = form.locator('#f1_widget_control_myDate input.selected-value');
    this.timeInput    = form.locator('#f1_widget_control_myTime input.selected-value');

    // BSPF2 DFInOutClass form fields
    this.bspf2TextAtt      = form.locator('#f1_widget_control_DFInOutClass_textAtt');
    this.bspf2IntegerAtt   = form.locator('#f1_widget_control_DFInOutClass_integerAtt');
    this.bspf2DecimalAtt   = form.locator('#f1_widget_control_DFInOutClass_decimalAtt');
    this.bspf2DateAtt      = form.locator('#f1_widget_control_DFInOutClass_dateAtt input.selected-value');
    this.bspf2TimeAtt      = form.locator('#f1_widget_control_DFInOutClass_timeAtt input.selected-value');
    this.bspf2BooleanAtt   = form.locator("#f1_widget_control_DFInOutClass_booleanAtt input[type='checkbox']");
    this.bspf2DurationDays = form.locator('#container_days_duration_panel_f1_widget_control_DFInOutClass_durationAtt input');
    this.bspf2DurationHours = form.locator('#container_hours_duration_panel_f1_widget_control_DFInOutClass_durationAtt input');
    this.bspf2IDAtt        = form.locator('#f1_widget_control_DFInOutClass_IDAtt');
    this.bspf2URIAtt       = form.locator('#f1_widget_control_DFInOutClass_URIAtt');

    this.navigationWarningDialog     = page.locator('div[role="dialog"][aria-modal="true"][aria-hidden="false"].dialog__panel');
    this.navigationWarningDialogText = page.locator('#businessServicesComp twc-alert-dialog').filter({ hasText: 'Do you want to close this form?' });
    this.navigationWarningYesCloseBtn = page.getByRole('button', { name: 'Yes, close' });
    this.navigationErrorDialogText   = page.locator('twc-alert-dialog').filter({ hasText: 'Error occurred while processing the request, please check logs for more information.' });
    this.navigationErrorDismissBtn   = page.getByRole('button', { name: 'Dismiss' });

    // BSPF1 PInOutClass form fields
    this.bspf1TextAtt      = form.locator('#f1_widget_control_PInOutClass_textAtt');
    this.bspf1IntegerAtt   = form.locator('#f1_widget_control_PInOutClass_integerAtt');
    this.bspf1DecimalAtt   = form.locator('#f1_widget_control_PInOutClass_decimalAtt');
    this.bspf1DateAtt      = form.locator('#f1_widget_control_PInOutClass_dateAtt input.selected-value');
    this.bspf1TimeAtt      = form.locator('#f1_widget_control_PInOutClass_timeAtt input.selected-value');
    this.bspf1BooleanAtt   = form.locator("#f1_widget_control_PInOutClass_booleanAtt input[type='checkbox']");
    this.bspf1DurationDays = form.locator('#container_days_duration_panel_f1_widget_control_PInOutClass_durationAtt input');
    this.bspf1DurationHours = form.locator('#container_hours_duration_panel_f1_widget_control_PInOutClass_durationAtt input');
    this.bspf1IDAtt        = form.locator('#f1_widget_control_PInOutClass_IDAtt');
    this.bspf1URIAtt       = form.locator('#f1_widget_control_PInOutClass_URIAtt');

    this.dbInsertCustId   = form.locator('#f1_widget_control_custId');
    this.dbInsertCustName = form.locator('#f1_widget_control_custName');
  }

  async clickOnBS() {
    await this.page.getByText('BS_AllTypes', { exact: true }).click();
    await this.page.getByText('BS_AllTypes-Start Event').click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService() {
    await this.page.getByText('BPMSimpleCaseActionProject').first().click();
    await this.page.locator('#item_BPMSimpleCaseActionProject').getByText('BPMSimpleCaseActionProject').click();
    await this.page.getByText('BPMCreateCaseProcessStartEvent').click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService_BSPF2() {
    await this.page.getByText('BSPF2').first().click();
    await this.page.locator('#item_BSPF2').getByText('BSPF2', { exact: true }).click();
    await this.page.getByText('BSPF2BSPF2Operation').click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService_BSAllTypes() {
    await this.page.getByText('BS_AllTypes').first().click();
    await this.page.getByText('BS_AllTypesStartEvent').click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService_BSPF1() {
    await this.page.getByText('BSPF1').first().click();
    await this.page.locator('#item_BSPF1').getByText('BSPF1', { exact: true }).click();
    await this.page.getByText('BSPF1BSPF1Operation').click();
    await this.page.waitForTimeout(500);
  }

  async clickOnBusinessService_DbInsert() {
    await this.page.getByText('BSCat').first().click();
    await this.page.locator('#item_DBInset').getByText('DBInset', { exact: true }).click();
    await this.page.getByText('DBInsertStartEvent').click();
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
    expect(await this.dateTimeInput.inputValue()).toContain(utility.getCurrentDateNumeric());
    expect(await this.dateInput.inputValue()).toBe(expectedDate);
    expect(await this.timeInput.inputValue()).toMatch(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
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
    await expect(this.navigationWarningDialogText).toContainText('Do you want to close this form?');
    await this.navigationWarningYesCloseBtn.click();
  }

  async enterAllDetails(text: string, num: string, date: string, time: string) {
    await this.textField.waitFor({ state: 'visible', timeout: 15000 });
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
    await this.page.getByRole('button', { name: 'OK' }).click();
    await this.dateTimeField.click();
    await this.page.getByRole('button', { name: 'OK' }).click();
    await this.decimalField.fill('4.5');
    await this.submitBtn.click();
    await this.page.waitForTimeout(500);
  }

  async enterDetailsInDbInsertForm(custId: string, custName: string) {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);
    await this.dbInsertCustId.fill(custId);
    await this.dbInsertCustName.fill(custName);
    await this.submitBtn.click();
  }

  async verifyErrorMessageDialog() {
    await expect(this.navigationWarningDialog).toBeVisible();
    await expect(this.navigationErrorDialogText).toContainText('Error occurred while processing the request, please check logs for more information.');
    await this.navigationErrorDismissBtn.click();
    await this.page.waitForTimeout(3000);
  }
}
