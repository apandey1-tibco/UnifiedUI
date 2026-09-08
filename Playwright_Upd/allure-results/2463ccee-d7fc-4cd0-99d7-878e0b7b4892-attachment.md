# Test info

- Name: Buisness Services Regression suite >> Test for buisnes services
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:47:7

# Error details

```
Error: locator.click: Error: strict mode violation: getByText('BS_AllTypes', { exact: true }) resolved to 2 elements:
    1) <div slot="trigger">…</div> aka getByText('BS_AllTypes', { exact: true }).first()
    2) <div slot="trigger">…</div> aka locator('#item_BS_AllTypes').getByText('BS_AllTypes', { exact: true })

Call log:
  - waiting for getByText('BS_AllTypes', { exact: true })

    at BSPage.clickOnBS (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\BSPage.ts:120:63)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:58:18
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
  - dialog "Business Services": Business Services BS_AllTypes BS_AllTypes_Text Category Exits PMT Request Types UserIDIndependentBS deepCopyBusinessService
  - separator "Resize"
- iframe
```

# Test source

```ts
   20 |   readonly dateTimeInput: Locator;
   21 |   readonly dateInput: Locator;
   22 |   readonly timeInput: Locator;
   23 |
   24 |   // BSPF2 form field locators (DFInOutClass pane, inside formsclient iframe)
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
   41 |   // BSPF1 form field locators (DFInOutClass pane, inside formsclient iframe)
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
   59 |     // Main page locators (navigation panel, header, toolbar)
   60 |     this.inputOrderID = page.getByLabel(
   61 |       "label_f1_widget_control_OrderlocalData_orderID"
   62 |     );
   63 |     this.BSheader = page.locator(".header__title").nth(1);
   64 |
   65 |     // Forms render in two ways depending on the server type:
   66 |     //   BPM 4x  → inside an iframe whose src contains "formsclient"
   67 |     //   BPME    → as a <tibco-form> web component directly on the page
   68 |     // Each locator uses .or() so it resolves in whichever context is active.
   69 |     const ff = page.frameLocator('iframe[src*="formsclient"]');
   70 |     const fi = (sel: string) => ff.locator(sel).or(page.locator(sel));
   71 |
   72 |     this.bsFormHeader = ff.getByText("User Task").or(page.getByText("User Task"));
   73 |     this.cancelBtn = fi('#f1_widget_control_cancel');
   74 |     this.submitBtn = fi('#f1_widget_control_submit');
   75 |     this.textField = fi('#f1_widget_control_myText');
   76 |     this.intField = fi('#f1_widget_control_myInt');
   77 |     this.booleanFIeld = fi('#f1_widget_control_myBoolean input[type="checkbox"]');
   78 |     this.decimalField = fi('#f1_widget_control_myDecimal');
   79 |     this.dateField = fi('#f1_widget_control_myDate input.selected-value');
   80 |     this.timeField = fi("#f1_widget_control_myTime").getByRole("button");
   81 |     this.dateTimeField = fi(".advanced-TextButtonPanel.control-widget.tf-widget-datetime").getByRole("button");
   82 |     this.dateTimeInput = fi("#f1_widget_control_myDateTime input.selected-value");
   83 |     this.dateInput = fi("#f1_widget_control_myDate input.selected-value");
   84 |     this.timeInput = fi("#f1_widget_control_myTime input.selected-value");
   85 |
   86 |     // BSPF2 DFInOutClass form fields
   87 |     this.bspf2TextAtt = fi("#f1_widget_control_DFInOutClass_textAtt");
   88 |     this.bspf2IntegerAtt = fi("#f1_widget_control_DFInOutClass_integerAtt");
   89 |     this.bspf2DecimalAtt = fi("#f1_widget_control_DFInOutClass_decimalAtt");
   90 |     this.bspf2DateAtt = fi("#f1_widget_control_DFInOutClass_dateAtt input.selected-value");
   91 |     this.bspf2TimeAtt = fi("#f1_widget_control_DFInOutClass_timeAtt input.selected-value");
   92 |     this.bspf2BooleanAtt = fi("#f1_widget_control_DFInOutClass_booleanAtt input[type='checkbox']");
   93 |     this.bspf2DurationDays = fi("#container_days_duration_panel_f1_widget_control_DFInOutClass_durationAtt input");
   94 |     this.bspf2DurationHours = fi("#container_hours_duration_panel_f1_widget_control_DFInOutClass_durationAtt input");
   95 |     this.bspf2IDAtt = fi("#f1_widget_control_DFInOutClass_IDAtt");
   96 |     this.bspf2URIAtt = fi("#f1_widget_control_DFInOutClass_URIAtt");
   97 |     this.navigationWarningDialog = page.locator('div[role="dialog"][aria-modal="true"][aria-hidden="false"].dialog__panel');
   98 |     this.navigationWarningDialogText = page.locator('#businessServicesComp twc-alert-dialog').filter({ hasText: "Do you want to close this form?" });
   99 |     this.navigationWarningYesCloseBtn = page.getByRole("button", { name: "Yes, close" });
  100 |     this.navigationErrorDialogText = page.locator('twc-alert-dialog').filter({ hasText: "Error occurred while processing the request, please check logs for more information." });
  101 |     this.navigationErrorDismissBtn = page.getByRole("button", { name: "Dismiss" });
  102 |
  103 |     //BSPF1 PInOutClass form fields
  104 |     this.bspf1TextAtt = fi("#f1_widget_control_PInOutClass_textAtt");
  105 |     this.bspf1IntegerAtt = fi("#f1_widget_control_PInOutClass_integerAtt");
  106 |     this.bspf1DecimalAtt = fi("#f1_widget_control_PInOutClass_decimalAtt");
  107 |     this.bspf1DateAtt = fi("#f1_widget_control_PInOutClass_dateAtt input.selected-value");
  108 |     this.bspf1TimeAtt = fi("#f1_widget_control_PInOutClass_timeAtt input.selected-value");
  109 |     this.bspf1BooleanAtt = fi("#f1_widget_control_PInOutClass_booleanAtt input[type='checkbox']");
  110 |     this.bspf1DurationDays = fi("#container_days_duration_panel_f1_widget_control_PInOutClass_durationAtt input");
  111 |     this.bspf1DurationHours = fi("#container_hours_duration_panel_f1_widget_control_PInOutClass_durationAtt input");
  112 |     this.bspf1IDAtt = fi("#f1_widget_control_PInOutClass_IDAtt");
  113 |     this.bspf1URIAtt = fi("#f1_widget_control_PInOutClass_URIAtt");
  114 |
  115 |     this.dbInsertCustId = fi("#f1_widget_control_custId");
  116 |     this.dbInsertCustName = fi("#f1_widget_control_custName");
  117 |   }
  118 |
  119 |   async clickOnBS() {
> 120 |     await this.page.getByText("BS_AllTypes", { exact: true }).click();
      |                                                               ^ Error: locator.click: Error: strict mode violation: getByText('BS_AllTypes', { exact: true }) resolved to 2 elements:
  121 |     await this.page.getByText("BS_AllTypes-Start Event").click();
  122 |     await this.page.waitForTimeout(500);
  123 |   }
  124 |
  125 |   async clickOnBusinessService() {
  126 |     await this.page.getByText('BPMSimpleCaseActionProject').first().click();
  127 |     await this.page.locator('#item_BPMSimpleCaseActionProject').getByText('BPMSimpleCaseActionProject').click();
  128 |     await this.page.getByText("BPMCreateCaseProcessStartEvent").click();
  129 |     await this.page.waitForTimeout(500);
  130 |   }
  131 |
  132 |   async clickOnBusinessService_BSPF2() {
  133 |     await this.page.getByText('BSPF2').first().click();
  134 |     await this.page.locator('#item_BSPF2').getByText('BSPF2', { exact: true }).click();
  135 |     await this.page.getByText("BSPF2BSPF2Operation").click();
  136 |     await this.page.waitForTimeout(500);
  137 |   }
  138 |
  139 |   async clickOnBusinessService_BSAllTypes() {
  140 |     await this.page.getByText('BS_AllTypes').first().click();
  141 |     await this.page.getByText("BS_AllTypesStartEvent").click();
  142 |     await this.page.waitForTimeout(500);
  143 |   }
  144 |
  145 |   async clickOnBusinessService_BSPF1() {
  146 |     await this.page.getByText('BSPF1').first().click();
  147 |     await this.page.locator('#item_BSPF1').getByText('BSPF1', { exact: true }).click();
  148 |     await this.page.getByText("BSPF1BSPF1Operation").click();
  149 |     await this.page.waitForTimeout(500);
  150 |   }
  151 |
  152 |   async clickOnBusinessService_DbInsert() {
  153 |     await this.page.getByText('BSCat').first().click();
  154 |     await this.page.locator('#item_DBInset').getByText('DBInset', { exact: true }).click();
  155 |     await this.page.getByText("DBInsertStartEvent").click();
  156 |     await this.page.waitForTimeout(500);
  157 |   }
  158 |
  159 |   async verifyBSheader() {
  160 |     return this.BSheader.innerText();
  161 |   }
  162 |
  163 |   async refreshIcon(): Promise<Locator> {
  164 |     return this.page.locator("[tooltipcontent='Refresh']");
  165 |   }
  166 |
  167 |   async verifyAllDetails(
  168 |     expectedDecimal: string,
  169 |     expectedInt: string,
  170 |     expectedText: string,
  171 |     expectedDate: string
  172 |   ) {
  173 |
  174 |     // myDateTime field format is "MM/DD/YYYY HH:mm:ss+timezone" — check only the date portion
  175 |     expect(await this.dateTimeInput.inputValue()).toContain(utility.getCurrentDateNumeric());
  176 |     // myDate field format is "Apr 08, 2026"
  177 |     expect(await this.dateInput.inputValue()).toBe(expectedDate);
  178 |     // myTime field format is "HH:mm:ss AM/PM" — verify format only (seconds may differ)
  179 |     expect(await this.timeInput.inputValue()).toMatch(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  180 |
  181 |     // Static script-populated values — exact match
  182 |     expect(await this.decimalField.inputValue()).toBe(expectedDecimal);
  183 |     expect(await this.intField.inputValue()).toBe(expectedInt);
  184 |     expect(await this.textField.inputValue()).toBe(expectedText);
  185 |     await expect(this.booleanFIeld).toBeChecked();
  186 |   }
  187 |
  188 |   async verifyBSPF2Form(data: {
  189 |     textAtt: string;
  190 |     integerAtt: string;
  191 |     decimalAtt: string;
  192 |     dateAtt: string;
  193 |     timeAtt: string;
  194 |     booleanAtt: boolean;
  195 |     durationDays: string;
  196 |     durationHours: string;
  197 |     idAtt: string;
  198 |     uriAtt: string;
  199 |   }) {
  200 |     await expect(this.bspf2TextAtt).toHaveValue(data.textAtt);
  201 |     await expect(this.bspf2IntegerAtt).toHaveValue(data.integerAtt);
  202 |     await expect(this.bspf2DecimalAtt).toHaveValue(data.decimalAtt);
  203 |     await expect(this.bspf2DateAtt).toHaveValue(data.dateAtt);
  204 |     await expect(this.bspf2TimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  205 |     if (data.booleanAtt) {
  206 |       await expect(this.bspf2BooleanAtt).toBeChecked();
  207 |     } else {
  208 |       await expect(this.bspf2BooleanAtt).not.toBeChecked();
  209 |     }
  210 |     await expect(this.bspf2DurationDays).toHaveValue(data.durationDays);
  211 |     await expect(this.bspf2DurationHours).toHaveValue(data.durationHours);
  212 |     await expect(this.bspf2IDAtt).toHaveValue(data.idAtt);
  213 |     await expect(this.bspf2URIAtt).toHaveValue(data.uriAtt);
  214 |   }
  215 |
  216 |   async verifyBSPF1_SecondForm(data: {
  217 |     textAtt: string;
  218 |     integerAtt: string;
  219 |     decimalAtt: string;
  220 |     dateAtt: string;
```