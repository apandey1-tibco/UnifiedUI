# Test info

- Name: Buisness Services Regression suite >> Test for buisnes services
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:47:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for locator('iframe[src*="formsclient"]').contentFrame().locator('#f1_widget_control_myText').or(locator('#f1_widget_control_myText')) to be visible

    at BSPage.enterAllDetails (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\BSPage.ts:251:26)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:66:18
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
      - row "Aug 18, 2026 ":
        - cell "Aug 18, 2026":
          - textbox: Aug 18, 2026
        - cell "":
          - button ""
  - text:  myTime
  - table:
    - rowgroup:
      - row "06:31:33 AM ":
        - cell "06:31:33 AM":
          - textbox: 06:31:33 AM
        - cell "":
          - button ""
  - text:  myDateTime
  - table:
    - rowgroup:
      - row "Aug 18, 2026 12:01:33 PM ":
        - cell "Aug 18, 2026 12:01:33 PM":
          - textbox: Aug 18, 2026 12:01:33 PM
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
  221 |     timeAtt: string;
  222 |     booleanAtt: boolean;
  223 |     durationDays: string;
  224 |     durationHours: string;
  225 |     idAtt: string;
  226 |     uriAtt: string;
  227 |   }) {
  228 |     await expect(this.bspf1TextAtt).toHaveValue(data.textAtt);
  229 |     await expect(this.bspf1IntegerAtt).toHaveValue(data.integerAtt);
  230 |     await expect(this.bspf1DecimalAtt).toHaveValue(data.decimalAtt);
  231 |     await expect(this.bspf1DateAtt).toHaveValue(data.dateAtt);
  232 |     await expect(this.bspf1TimeAtt).toHaveValue(/^\d{2}:\d{2}:\d{2} (AM|PM)$/);
  233 |     if (data.booleanAtt) {
  234 |       await expect(this.bspf1BooleanAtt).toBeChecked();
  235 |     } else {
  236 |       await expect(this.bspf1BooleanAtt).not.toBeChecked();
  237 |     }
  238 |     await expect(this.bspf1DurationDays).toHaveValue(data.durationDays);
  239 |     await expect(this.bspf1DurationHours).toHaveValue(data.durationHours);
  240 |     await expect(this.bspf1IDAtt).toHaveValue(data.idAtt);
  241 |     await expect(this.bspf1URIAtt).toHaveValue(data.uriAtt);
  242 |   }
  243 |
  244 |   async verifyNavigationWarningAndClose() {
  245 |     await expect(this.navigationWarningDialog).toBeVisible();
  246 |     await expect(this.navigationWarningDialogText).toContainText("Do you want to close this form?");
  247 |     await this.navigationWarningYesCloseBtn.click();
  248 |   }
  249 |
  250 |   async enterAllDetails(text: string, num: string, date: string, time: string) {
> 251 |     await this.textField.waitFor({ state: "visible", timeout: 15000 });
      |                          ^ TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
  252 |     await this.page.waitForTimeout(500);
  253 |     await this.textField.clear();
  254 |     await this.textField.pressSequentially(text, { delay: 100 });
  255 |     await this.intField.clear();
  256 |     await this.intField.fill(num);
  257 |     await this.booleanFIeld.check();
  258 |     await this.page.waitForTimeout(1000);
  259 |     await this.dateField.click();
  260 |     await this.dateField.clear();
  261 |     await this.dateField.pressSequentially(date, { delay: 150 });
  262 |     await this.timeField.click();
  263 |     await this.page.getByRole("button", { name: "OK" }).click();
  264 |     //await this.timeField.pressSequentially(time, { delay: 100 });
  265 |     //Date time field
  266 |     await this.dateTimeField.click();
  267 |     await this.page.getByRole("button", { name: "OK" }).click();
  268 |     await this.decimalField.fill("4.5");
  269 |     await this.submitBtn.click();
  270 |     await this.page.waitForTimeout(500);
  271 |   }
  272 |
  273 |   async enterDetailsInDbInsertForm(custId: string, custName: string) {
  274 |     await this.page.waitForLoadState("networkidle");
  275 |     await this.page.waitForTimeout(1000);
  276 |     await this.dbInsertCustId.fill(custId);
  277 |     await this.dbInsertCustName.fill(custName);
  278 |     await this.submitBtn.click();
  279 |   }
  280 |
  281 |   async verifyErrorMessageDialog() {
  282 |     await expect(this.navigationWarningDialog).toBeVisible();
  283 |     await expect(this.navigationErrorDialogText).toContainText("Error occurred while processing the request, please check logs for more information.");
  284 |     await this.navigationErrorDismissBtn.click();
  285 |     await this.page.waitForTimeout(3000);
  286 |   }
  287 | }
  288 |
```