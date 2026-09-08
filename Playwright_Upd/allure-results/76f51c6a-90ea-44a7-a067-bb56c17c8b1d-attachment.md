# Test info

- Name: Buisness Services Regression suite >> Test for buisnes services
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:46:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('#businessServicesComp iframe').contentFrame().locator('#f1_widget_control_myText') to be visible

    at BS5xPage.enterAllDetails (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\BS5xPage.ts:242:26)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:65:18
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
  - dialog "Business Services": Business Services BS_AllTypes BS_simple EmailArray
  - separator "Resize"
  - text: User Task  myText
  - textbox "myText": Bob
  - text:  myInt 
  - textbox "myInt": "11"
  - text:  myBoolean 
  - checkbox "myBoolean" [checked]
  - text:  myDate
  - table:
    - rowgroup:
      - row "Aug 18, 2026 ":
        - cell "Aug 18, 2026":
          - textbox: Aug 18, 2026
        - cell "":
          - button ""
  - text:  myTime
  - table:
    - rowgroup:
      - row "08:27:00 AM ":
        - cell "08:27:00 AM":
          - textbox: 08:27:00 AM
        - cell "":
          - button ""
  - text:  myDateTime
  - table:
    - rowgroup:
      - row "Aug 18, 2026 01:57:00 PM ":
        - cell "Aug 18, 2026 01:57:00 PM":
          - textbox: Aug 18, 2026 01:57:00 PM
        - cell "":
          - button ""
  - text:  myDecimal 
  - textbox "myDecimal": "12.20"
  - button "Label": Cancel
  - button "Label": Submit
- iframe
```

# Test source

```ts
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
  218 |   }) {
  219 |     await expect(this.bspf1TextAtt).toHaveValue(data.textAtt);
  220 |     await expect(this.bspf1IntegerAtt).toHaveValue(data.integerAtt);
  221 |     await expect(this.bspf1DecimalAtt).toHaveValue(data.decimalAtt);
  222 |     await expect(this.bspf1DateAtt).toHaveValue(data.dateAtt);
  223 |     await expect(this.bspf1TimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  224 |     if (data.booleanAtt) {
  225 |       await expect(this.bspf1BooleanAtt).toBeChecked();
  226 |     } else {
  227 |       await expect(this.bspf1BooleanAtt).not.toBeChecked();
  228 |     }
  229 |     await expect(this.bspf1DurationDays).toHaveValue(data.durationDays);
  230 |     await expect(this.bspf1DurationHours).toHaveValue(data.durationHours);
  231 |     await expect(this.bspf1IDAtt).toHaveValue(data.idAtt);
  232 |     await expect(this.bspf1URIAtt).toHaveValue(data.uriAtt);
  233 |   }
  234 |
  235 |   async verifyNavigationWarningAndClose() {
  236 |     await expect(this.navigationWarningDialog).toBeVisible();
  237 |     await expect(this.navigationWarningDialogText).toContainText('Do you want to close this form?');
  238 |     await this.navigationWarningYesCloseBtn.click();
  239 |   }
  240 |
  241 |   async enterAllDetails(text: string, num: string, date: string, time: string) {
> 242 |     await this.textField.waitFor({ state: 'visible', timeout: 15000 });
      |                          ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  243 |     await this.page.waitForTimeout(500);
  244 |     await this.textField.clear();
  245 |     await this.textField.pressSequentially(text, { delay: 100 });
  246 |     await this.intField.clear();
  247 |     await this.intField.fill(num);
  248 |     await this.booleanFIeld.check();
  249 |     await this.page.waitForTimeout(1000);
  250 |     await this.dateField.click();
  251 |     await this.dateField.clear();
  252 |     await this.dateField.pressSequentially(date, { delay: 150 });
  253 |     await this.timeField.click();
  254 |     await this.page.getByRole('button', { name: 'OK' }).click();
  255 |     await this.dateTimeField.click();
  256 |     await this.page.getByRole('button', { name: 'OK' }).click();
  257 |     await this.decimalField.fill('4.5');
  258 |     await this.submitBtn.click();
  259 |     await this.page.waitForTimeout(500);
  260 |   }
  261 |
  262 |   async enterDetailsInDbInsertForm(custId: string, custName: string) {
  263 |     await this.page.waitForLoadState('networkidle');
  264 |     await this.page.waitForTimeout(1000);
  265 |     await this.dbInsertCustId.fill(custId);
  266 |     await this.dbInsertCustName.fill(custName);
  267 |     await this.submitBtn.click();
  268 |   }
  269 |
  270 |   async verifyErrorMessageDialog() {
  271 |     await expect(this.navigationWarningDialog).toBeVisible();
  272 |     await expect(this.navigationErrorDialogText).toContainText('Error occurred while processing the request, please check logs for more information.');
  273 |     await this.navigationErrorDismissBtn.click();
  274 |     await this.page.waitForTimeout(3000);
  275 |   }
  276 | }
  277 |
```