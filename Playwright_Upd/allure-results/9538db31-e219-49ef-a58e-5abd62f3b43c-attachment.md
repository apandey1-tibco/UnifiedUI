# Test info

- Name: Buisness Services Regression suite >> Test for buisnes services
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:46:7

# Error details

```
Error: locator.click: Error: strict mode violation: getByText('BS_AllTypes', { exact: true }) resolved to 2 elements:
    1) <div slot="trigger">…</div> aka getByText('BS_AllTypes').first()
    2) <div slot="trigger">…</div> aka locator('#item_BS_AllTypes').getByText('BS_AllTypes', { exact: true })

Call log:
  - waiting for getByText('BS_AllTypes', { exact: true })

    at BS5xPage.clickOnBS (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\BS5xPage.ts:117:63)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:57:18
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - complementary
  - button "Local server":
    - text: Local server
    - img
  - dialog "Business Services": Business Services BS_AllTypes
  - separator "Resize"
- iframe
```

# Test source

```ts
   17 |   readonly dateTimeField: Locator;
   18 |   readonly decimalField: Locator;
   19 |   readonly timeField: Locator;
   20 |   readonly dateTimeInput: Locator;
   21 |   readonly dateInput: Locator;
   22 |   readonly timeInput: Locator;
   23 |
   24 |   // BSPF2 form field locators
   25 |   readonly bspf2TextAtt: Locator;
   26 |   readonly bspf2IntegerAtt: Locator;
   27 |   readonly bspf2DecimalAtt: Locator;
   28 |   readonly bspf2DateAtt: Locator;
   29 |   readonly bspf2TimeAtt: Locator;
   30 |   readonly bspf2BooleanAtt: Locator;
   31 |   readonly bspf2DurationDays: Locator;
   32 |   readonly bspf2DurationHours: Locator;
   33 |   readonly bspf2IDAtt: Locator;
   34 |   readonly bspf2URIAtt: Locator;
   35 |   readonly navigationWarningDialog: Locator;
   36 |   readonly navigationWarningDialogText: Locator;
   37 |   readonly navigationWarningYesCloseBtn: Locator;
   38 |   readonly navigationErrorDialogText: Locator;
   39 |   readonly navigationErrorDismissBtn: Locator;
   40 |
   41 |   // BSPF1 form field locators
   42 |   readonly bspf1TextAtt: Locator;
   43 |   readonly bspf1IntegerAtt: Locator;
   44 |   readonly bspf1DecimalAtt: Locator;
   45 |   readonly bspf1DateAtt: Locator;
   46 |   readonly bspf1TimeAtt: Locator;
   47 |   readonly bspf1BooleanAtt: Locator;
   48 |   readonly bspf1DurationDays: Locator;
   49 |   readonly bspf1DurationHours: Locator;
   50 |   readonly bspf1IDAtt: Locator;
   51 |   readonly bspf1URIAtt: Locator;
   52 |
   53 |   readonly dbInsertCustId: Locator;
   54 |   readonly dbInsertCustName: Locator;
   55 |
   56 |   constructor(page: Page) {
   57 |     this.page = page;
   58 |
   59 |     // Main page locators (navigation panel, header)
   60 |     this.inputOrderID = page.getByLabel("label_f1_widget_control_OrderlocalData_orderID");
   61 |     this.BSheader = page.locator(".header__title").nth(1);
   62 |
   63 |     // The Business Service form for 4x BPM server renders inside an iframe scoped
   64 |     // to the #businessServicesComp panel. Using the component scope avoids relying
   65 |     // on the iframe src attribute which differs by server configuration.
   66 |     const ff = page.frameLocator('#businessServicesComp iframe');
   67 |
   68 |     this.bsFormHeader = ff.getByText("User Task");
   69 |     this.cancelBtn    = ff.locator('#f1_widget_control_cancel');
   70 |     this.submitBtn    = ff.locator('#f1_widget_control_submit');
   71 |     this.textField    = ff.locator('#f1_widget_control_myText');
   72 |     this.intField     = ff.locator('#f1_widget_control_myInt');
   73 |     this.booleanFIeld = ff.locator('#f1_widget_control_myBoolean input[type="checkbox"]');
   74 |     this.decimalField = ff.locator('#f1_widget_control_myDecimal');
   75 |     this.dateField    = ff.locator('#f1_widget_control_myDate input.selected-value');
   76 |     this.timeField    = ff.locator('#f1_widget_control_myTime').getByRole('button');
   77 |     this.dateTimeField = ff.locator('.advanced-TextButtonPanel.control-widget.tf-widget-datetime').getByRole('button');
   78 |     this.dateTimeInput = ff.locator('#f1_widget_control_myDateTime input.selected-value');
   79 |     this.dateInput    = ff.locator('#f1_widget_control_myDate input.selected-value');
   80 |     this.timeInput    = ff.locator('#f1_widget_control_myTime input.selected-value');
   81 |
   82 |     // BSPF2 DFInOutClass form fields
   83 |     this.bspf2TextAtt      = ff.locator('#f1_widget_control_DFInOutClass_textAtt');
   84 |     this.bspf2IntegerAtt   = ff.locator('#f1_widget_control_DFInOutClass_integerAtt');
   85 |     this.bspf2DecimalAtt   = ff.locator('#f1_widget_control_DFInOutClass_decimalAtt');
   86 |     this.bspf2DateAtt      = ff.locator('#f1_widget_control_DFInOutClass_dateAtt input.selected-value');
   87 |     this.bspf2TimeAtt      = ff.locator('#f1_widget_control_DFInOutClass_timeAtt input.selected-value');
   88 |     this.bspf2BooleanAtt   = ff.locator("#f1_widget_control_DFInOutClass_booleanAtt input[type='checkbox']");
   89 |     this.bspf2DurationDays = ff.locator('#container_days_duration_panel_f1_widget_control_DFInOutClass_durationAtt input');
   90 |     this.bspf2DurationHours = ff.locator('#container_hours_duration_panel_f1_widget_control_DFInOutClass_durationAtt input');
   91 |     this.bspf2IDAtt        = ff.locator('#f1_widget_control_DFInOutClass_IDAtt');
   92 |     this.bspf2URIAtt       = ff.locator('#f1_widget_control_DFInOutClass_URIAtt');
   93 |
   94 |     this.navigationWarningDialog     = page.locator('div[role="dialog"][aria-modal="true"][aria-hidden="false"].dialog__panel');
   95 |     this.navigationWarningDialogText = page.locator('#businessServicesComp twc-alert-dialog').filter({ hasText: 'Do you want to close this form?' });
   96 |     this.navigationWarningYesCloseBtn = page.getByRole('button', { name: 'Yes, close' });
   97 |     this.navigationErrorDialogText   = page.locator('twc-alert-dialog').filter({ hasText: 'Error occurred while processing the request, please check logs for more information.' });
   98 |     this.navigationErrorDismissBtn   = page.getByRole('button', { name: 'Dismiss' });
   99 |
  100 |     // BSPF1 PInOutClass form fields
  101 |     this.bspf1TextAtt      = ff.locator('#f1_widget_control_PInOutClass_textAtt');
  102 |     this.bspf1IntegerAtt   = ff.locator('#f1_widget_control_PInOutClass_integerAtt');
  103 |     this.bspf1DecimalAtt   = ff.locator('#f1_widget_control_PInOutClass_decimalAtt');
  104 |     this.bspf1DateAtt      = ff.locator('#f1_widget_control_PInOutClass_dateAtt input.selected-value');
  105 |     this.bspf1TimeAtt      = ff.locator('#f1_widget_control_PInOutClass_timeAtt input.selected-value');
  106 |     this.bspf1BooleanAtt   = ff.locator("#f1_widget_control_PInOutClass_booleanAtt input[type='checkbox']");
  107 |     this.bspf1DurationDays = ff.locator('#container_days_duration_panel_f1_widget_control_PInOutClass_durationAtt input');
  108 |     this.bspf1DurationHours = ff.locator('#container_hours_duration_panel_f1_widget_control_PInOutClass_durationAtt input');
  109 |     this.bspf1IDAtt        = ff.locator('#f1_widget_control_PInOutClass_IDAtt');
  110 |     this.bspf1URIAtt       = ff.locator('#f1_widget_control_PInOutClass_URIAtt');
  111 |
  112 |     this.dbInsertCustId   = ff.locator('#f1_widget_control_custId');
  113 |     this.dbInsertCustName = ff.locator('#f1_widget_control_custName');
  114 |   }
  115 |
  116 |   async clickOnBS() {
> 117 |     await this.page.getByText('BS_AllTypes', { exact: true }).click();
      |                                                               ^ Error: locator.click: Error: strict mode violation: getByText('BS_AllTypes', { exact: true }) resolved to 2 elements:
  118 |     await this.page.getByText('BS_AllTypes-Start Event').click();
  119 |     await this.page.waitForTimeout(500);
  120 |   }
  121 |
  122 |   async clickOnBusinessService() {
  123 |     await this.page.getByText('BPMSimpleCaseActionProject').first().click();
  124 |     await this.page.locator('#item_BPMSimpleCaseActionProject').getByText('BPMSimpleCaseActionProject').click();
  125 |     await this.page.getByText('BPMCreateCaseProcessStartEvent').click();
  126 |     await this.page.waitForTimeout(500);
  127 |   }
  128 |
  129 |   async clickOnBusinessService_BSPF2() {
  130 |     await this.page.getByText('BSPF2').first().click();
  131 |     await this.page.locator('#item_BSPF2').getByText('BSPF2', { exact: true }).click();
  132 |     await this.page.getByText('BSPF2BSPF2Operation').click();
  133 |     await this.page.waitForTimeout(500);
  134 |   }
  135 |
  136 |   async clickOnBusinessService_BSAllTypes() {
  137 |     await this.page.getByText('BS_AllTypes').first().click();
  138 |     await this.page.getByText('BS_AllTypesStartEvent').click();
  139 |     await this.page.waitForTimeout(500);
  140 |   }
  141 |
  142 |   async clickOnBusinessService_BSPF1() {
  143 |     await this.page.getByText('BSPF1').first().click();
  144 |     await this.page.locator('#item_BSPF1').getByText('BSPF1', { exact: true }).click();
  145 |     await this.page.getByText('BSPF1BSPF1Operation').click();
  146 |     await this.page.waitForTimeout(500);
  147 |   }
  148 |
  149 |   async clickOnBusinessService_DbInsert() {
  150 |     await this.page.getByText('BSCat').first().click();
  151 |     await this.page.locator('#item_DBInset').getByText('DBInset', { exact: true }).click();
  152 |     await this.page.getByText('DBInsertStartEvent').click();
  153 |     await this.page.waitForTimeout(500);
  154 |   }
  155 |
  156 |   async verifyBSheader() {
  157 |     return this.BSheader.innerText();
  158 |   }
  159 |
  160 |   async refreshIcon(): Promise<Locator> {
  161 |     return this.page.locator("[tooltipcontent='Refresh']");
  162 |   }
  163 |
  164 |   async verifyAllDetails(
  165 |     expectedDecimal: string,
  166 |     expectedInt: string,
  167 |     expectedText: string,
  168 |     expectedDate: string
  169 |   ) {
  170 |     expect(await this.dateTimeInput.inputValue()).toContain(utility.getCurrentDateNumeric());
  171 |     expect(await this.dateInput.inputValue()).toBe(expectedDate);
  172 |     expect(await this.timeInput.inputValue()).toMatch(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  173 |     expect(await this.decimalField.inputValue()).toBe(expectedDecimal);
  174 |     expect(await this.intField.inputValue()).toBe(expectedInt);
  175 |     expect(await this.textField.inputValue()).toBe(expectedText);
  176 |     await expect(this.booleanFIeld).toBeChecked();
  177 |   }
  178 |
  179 |   async verifyBSPF2Form(data: {
  180 |     textAtt: string;
  181 |     integerAtt: string;
  182 |     decimalAtt: string;
  183 |     dateAtt: string;
  184 |     timeAtt: string;
  185 |     booleanAtt: boolean;
  186 |     durationDays: string;
  187 |     durationHours: string;
  188 |     idAtt: string;
  189 |     uriAtt: string;
  190 |   }) {
  191 |     await expect(this.bspf2TextAtt).toHaveValue(data.textAtt);
  192 |     await expect(this.bspf2IntegerAtt).toHaveValue(data.integerAtt);
  193 |     await expect(this.bspf2DecimalAtt).toHaveValue(data.decimalAtt);
  194 |     await expect(this.bspf2DateAtt).toHaveValue(data.dateAtt);
  195 |     await expect(this.bspf2TimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  196 |     if (data.booleanAtt) {
  197 |       await expect(this.bspf2BooleanAtt).toBeChecked();
  198 |     } else {
  199 |       await expect(this.bspf2BooleanAtt).not.toBeChecked();
  200 |     }
  201 |     await expect(this.bspf2DurationDays).toHaveValue(data.durationDays);
  202 |     await expect(this.bspf2DurationHours).toHaveValue(data.durationHours);
  203 |     await expect(this.bspf2IDAtt).toHaveValue(data.idAtt);
  204 |     await expect(this.bspf2URIAtt).toHaveValue(data.uriAtt);
  205 |   }
  206 |
  207 |   async verifyBSPF1_SecondForm(data: {
  208 |     textAtt: string;
  209 |     integerAtt: string;
  210 |     decimalAtt: string;
  211 |     dateAtt: string;
  212 |     timeAtt: string;
  213 |     booleanAtt: boolean;
  214 |     durationDays: string;
  215 |     durationHours: string;
  216 |     idAtt: string;
  217 |     uriAtt: string;
```