# Test info

- Name: Buisness Services Regression suite >> Test for buisnes services
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:47:7

# Error details

```
Error: locator.clear: Target page, context or browser has been closed
Call log:
  - waiting for locator('iframe[src*="formsclient"]').contentFrame().locator('#f1_widget_control_myText')

    at BSPage.enterAllDetails (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\BSPage.ts:255:26)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:66:5
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
  - text: User Task  myText
  - textbox "myText": Bob
  - text:  myInt 
  - textbox "myInt": "11"
  - text:  myBoolean 
  - checkbox "myBoolean" [checked]
  - text:  myDate
  - table:
    - rowgroup:
      - row "Aug 06, 2026 ":
        - cell "Aug 06, 2026":
          - textbox: Aug 06, 2026
        - cell "":
          - button ""
  - text:  myTime
  - table:
    - rowgroup:
      - row "07:33:32 AM ":
        - cell "07:33:32 AM":
          - textbox: 07:33:32 AM
        - cell "":
          - button ""
  - text:  myDateTime
  - table:
    - rowgroup:
      - row "Aug 06, 2026 01:03:32 PM ":
        - cell "Aug 06, 2026 01:03:32 PM":
          - textbox: Aug 06, 2026 01:03:32 PM
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
  155 |     await this.page.getByText('BSCat').first().click();
  156 |     await this.page.locator('#item_DBInset').getByText('DBInset', { exact: true }).click();
  157 |     await this.page.getByText("DBInsertStartEvent").click();
  158 |     await this.page.waitForTimeout(500);
  159 |   }
  160 |
  161 |   async verifyBSheader() {
  162 |     return this.BSheader.innerText();
  163 |   }
  164 |
  165 |   async refreshIcon(): Promise<Locator> {
  166 |     return this.page.locator("[tooltipcontent='Refresh']");
  167 |   }
  168 |
  169 |   async verifyAllDetails(
  170 |     expectedDecimal: string,
  171 |     expectedInt: string,
  172 |     expectedText: string,
  173 |     expectedDate: string
  174 |   ) {
  175 |
  176 |     // myDateTime field format is "MM/DD/YYYY HH:mm:ss+timezone" — check only the date portion
  177 |     expect(await this.dateTimeInput.inputValue()).toContain(utility.getCurrentDateNumeric());
  178 |     // myDate field format is "Apr 08, 2026"
  179 |     expect(await this.dateInput.inputValue()).toBe(expectedDate);
  180 |     // myTime field format is "HH:mm:ss AM/PM" — verify format only (seconds may differ)
  181 |     expect(await this.timeInput.inputValue()).toMatch(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  182 |
  183 |     // Static script-populated values — exact match
  184 |     expect(await this.decimalField.inputValue()).toBe(expectedDecimal);
  185 |     expect(await this.intField.inputValue()).toBe(expectedInt);
  186 |     expect(await this.textField.inputValue()).toBe(expectedText);
  187 |     await expect(this.booleanFIeld).toBeChecked();
  188 |   }
  189 |
  190 |   async verifyBSPF2Form(data: {
  191 |     textAtt: string;
  192 |     integerAtt: string;
  193 |     decimalAtt: string;
  194 |     dateAtt: string;
  195 |     timeAtt: string;
  196 |     booleanAtt: boolean;
  197 |     durationDays: string;
  198 |     durationHours: string;
  199 |     idAtt: string;
  200 |     uriAtt: string;
  201 |   }) {
  202 |     await expect(this.bspf2TextAtt).toHaveValue(data.textAtt);
  203 |     await expect(this.bspf2IntegerAtt).toHaveValue(data.integerAtt);
  204 |     await expect(this.bspf2DecimalAtt).toHaveValue(data.decimalAtt);
  205 |     await expect(this.bspf2DateAtt).toHaveValue(data.dateAtt);
  206 |     await expect(this.bspf2TimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  207 |     if (data.booleanAtt) {
  208 |       await expect(this.bspf2BooleanAtt).toBeChecked();
  209 |     } else {
  210 |       await expect(this.bspf2BooleanAtt).not.toBeChecked();
  211 |     }
  212 |     await expect(this.bspf2DurationDays).toHaveValue(data.durationDays);
  213 |     await expect(this.bspf2DurationHours).toHaveValue(data.durationHours);
  214 |     await expect(this.bspf2IDAtt).toHaveValue(data.idAtt);
  215 |     await expect(this.bspf2URIAtt).toHaveValue(data.uriAtt);
  216 |   }
  217 |
  218 |   async verifyBSPF1_SecondForm(data: {
  219 |     textAtt: string;
  220 |     integerAtt: string;
  221 |     decimalAtt: string;
  222 |     dateAtt: string;
  223 |     timeAtt: string;
  224 |     booleanAtt: boolean;
  225 |     durationDays: string;
  226 |     durationHours: string;
  227 |     idAtt: string;
  228 |     uriAtt: string;
  229 |   }) {
  230 |     await expect(this.bspf1TextAtt).toHaveValue(data.textAtt);
  231 |     await expect(this.bspf1IntegerAtt).toHaveValue(data.integerAtt);
  232 |     await expect(this.bspf1DecimalAtt).toHaveValue(data.decimalAtt);
  233 |     await expect(this.bspf1DateAtt).toHaveValue(data.dateAtt);
  234 |     await expect(this.bspf1TimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  235 |     if (data.booleanAtt) {
  236 |       await expect(this.bspf1BooleanAtt).toBeChecked();
  237 |     } else {
  238 |       await expect(this.bspf1BooleanAtt).not.toBeChecked();
  239 |     }
  240 |     await expect(this.bspf1DurationDays).toHaveValue(data.durationDays);
  241 |     await expect(this.bspf1DurationHours).toHaveValue(data.durationHours);
  242 |     await expect(this.bspf1IDAtt).toHaveValue(data.idAtt);
  243 |     await expect(this.bspf1URIAtt).toHaveValue(data.uriAtt);
  244 |   }
  245 |
  246 |   async verifyNavigationWarningAndClose() {
  247 |     await expect(this.navigationWarningDialog).toBeVisible();
  248 |     await expect(this.navigationWarningDialogText).toContainText("Do you want to close this form?");
  249 |     await this.navigationWarningYesCloseBtn.click();
  250 |   }
  251 |
  252 |   async enterAllDetails(text: string, num: string, date: string, time: string) {
  253 |     await this.page.waitForLoadState("domcontentloaded");
  254 |     await this.page.waitForTimeout(1000);
> 255 |     await this.textField.clear();
      |                          ^ Error: locator.clear: Target page, context or browser has been closed
  256 |     await this.textField.pressSequentially(text, { delay: 100 });
  257 |     await this.intField.clear();
  258 |     await this.intField.fill(num);
  259 |     await this.booleanFIeld.check();
  260 |     await this.page.waitForTimeout(1000);
  261 |     await this.dateField.click();
  262 |     await this.dateField.clear();
  263 |     await this.dateField.pressSequentially(date, { delay: 150 });
  264 |     await this.timeField.click();
  265 |     await this.page.getByRole("button", { name: "OK" }).click();
  266 |     //await this.timeField.pressSequentially(time, { delay: 100 });
  267 |     //Date time field
  268 |     await this.dateTimeField.click();
  269 |     await this.page.getByRole("button", { name: "OK" }).click();
  270 |     await this.decimalField.fill("4.5");
  271 |     await this.submitBtn.click();
  272 |     await this.page.waitForTimeout(500);
  273 |   }
  274 |
  275 |   async enterDetailsInDbInsertForm(custId: string, custName: string) {
  276 |     await this.page.waitForLoadState("networkidle");
  277 |     await this.page.waitForTimeout(1000);
  278 |     await this.dbInsertCustId.fill(custId);
  279 |     await this.dbInsertCustName.fill(custName);
  280 |     await this.submitBtn.click();
  281 |   }
  282 |
  283 |   async verifyErrorMessageDialog() {
  284 |     await expect(this.navigationWarningDialog).toBeVisible();
  285 |     await expect(this.navigationErrorDialogText).toContainText("Error occurred while processing the request, please check logs for more information.");
  286 |     await this.navigationErrorDismissBtn.click();
  287 |     await this.page.waitForTimeout(3000);
  288 |   }
  289 | }
  290 |
```