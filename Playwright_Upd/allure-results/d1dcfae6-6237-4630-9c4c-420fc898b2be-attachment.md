# Test info

- Name: Case Manager Regression suite >> Case coloumn test
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\02_CaseManager.spec.ts:164:7

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "OrderState"
Received string:        "Name
Quantity
Product
Text
Date
OrderState"
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\02_CaseManager.spec.ts:176:62
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME Applications
  - complementary
  - button "Local server":
    - text: Local server
    - img
  - dialog:
    - text: Case types
    - separator
    - textbox
    - menu:
      - menuitem "AdditionalOrder com.example.samplebdsproject1 1"
      - menuitem "Order com.example.samplebdsproject1 1"
  - separator "Resize"
  - dialog "Cases column selector":
    - heading "Cases column selector" [level=2]
    - img "Close":
      - img
    - text: Available Columns
    - textbox
    - menu:
      - menuitem "OrderID":
        - checkbox
        - text: OrderID
      - menuitem "Name":
        - checkbox [checked]
        - img
        - text: Name
      - menuitem "Quantity":
        - checkbox [checked]
        - img
        - text: Quantity
      - menuitem "Product":
        - checkbox [checked]
        - img
        - text: Product
      - menuitem "Text":
        - checkbox [checked]
        - img
        - text: Text
      - menuitem "Date":
        - checkbox [checked]
        - img
        - text: Date
      - menuitem "OrderState":
        - checkbox [checked]
        - img
        - text: OrderState
    - text: Selected Columns
    - menu:
      - menuitem "Name"
      - menuitem "Quantity"
      - menuitem "Product"
      - menuitem "Text"
      - menuitem "Date"
      - menuitem "OrderState"
    - button "Settings" [disabled]
    - button "Settings" [disabled]
    - button "Cancel"
    - button "Apply"
  - text: Order Active Cases
  - separator
  - separator
  - table:
    - row "OrderID Name Quantity Product Text Date OrderState":
      - columnheader "OrderID"
      - columnheader "Name"
      - columnheader "Quantity"
      - columnheader "Product"
      - columnheader "Text"
      - columnheader "Date"
      - columnheader "OrderState"
    - row "1 Auto created order 2 Apple ear pods 22 Aug 2024 05:30 AM Packed":
      - cell "1"
      - cell "Auto created order"
      - cell "2"
      - cell "Apple ear pods"
      - cell
      - cell "22 Aug 2024 05:30 AM"
      - cell "Packed"
- iframe
```

# Test source

```ts
   76 |       .getByLabel("caseState1")
   77 |       .selectOption(dataset.orderDetails.orderState.picked);
   78 |     await wlPage.submitBtn.scrollIntoViewIfNeeded();
   79 |     await wlPage.submitBtn.click();
   80 |     await page.waitForTimeout(2000);
   81 |
   82 |     await homePage.openWorklist(dataset.orderDetails.wlName);
   83 |
   84 |     //Entering all the details
   85 |     await wlPage.enterWorklistDetaisl(
   86 |       dataset.orderDetails.orderID,
   87 |       dataset.orderDetails.orderState.packed,
   88 |       dataset.orderDetails.name,
   89 |       dataset.orderDetails.quantity,
   90 |       dataset.orderDetails.product,
   91 |       dataset.orderDetails.time,
   92 |       dataset.orderDetails.date
   93 |     );
   94 |     //To click on ok and selecting date and time
   95 |     await wlPage.submitBtn.click();
   96 |     // await page.waitForTimeout(2000);
   97 |   });
   98 |
   99 |   test("Verify the different UI component present in Case Manager view", async () => {
  100 |     expect(await cmPage.caseHeader()).toBe("Case types");
  101 |     expect(await cmPage.activeCasestxt()).toBeVisible();
  102 |     expect(await cmPage.getCaseTypeHeaderName("Order")).toBe("Order");
  103 |     await page.waitForSelector('twc-icon[name="arrow-clockwise"]');
  104 |     expect(await cmPage.caseSearchIcon()).toBeVisible();
  105 |     expect(await cmPage.caseFilterIcon()).toBeVisible();
  106 |     expect(await cmPage.caseColoumnIcon()).toBeVisible();
  107 |     expect(await cmPage.casesRefreshIcon()).toBeVisible();
  108 |     expect(await cmPage.caseTypesRefreshIcon()).toBeVisible();
  109 |   });
  110 |
  111 |   test("Verify the data for Order Cases", async () => {
  112 |     const data = await cmPage.getActiveCaseDetails(dataset.orderDetails.name);
  113 |     if (!data) return;
  114 |     //data?
  115 |
  116 |     //Validating case data coming from WM
  117 |     expect(data.casedata.orderState).toBe(
  118 |       dataset.orderDetails.orderState.packed
  119 |     );
  120 |     expect(data.casedata.name).toBe(dataset.orderDetails.name);
  121 |     expect(data.casedata.product).toBe(dataset.orderDetails.product);
  122 |     expect(data.casedata.quantity).toBe(2);
  123 |     expect(data.casedata.orderID).toBe(dataset.orderDetails.orderID);
  124 |   });
  125 |
  126 |   test("Verify Case search functionality for different data types", async () => {
  127 |     await cmPage.clickOnSearchCases();
  128 |     //To search by number-- order id
  129 |     await cmPage.verifySearch(dataset.orderDetails.orderID);
  130 |     expect(await (await cmPage.firstRow()).innerText()).toContain(
  131 |       dataset.orderDetails.orderID
  132 |     );
  133 |     //To search by name
  134 |     await cmPage.verifySearch(dataset.orderDetails.name);
  135 |     expect(await (await cmPage.firstRow()).innerText()).toContain(
  136 |       dataset.orderDetails.name
  137 |     );
  138 |     //To search by time
  139 |     await cmPage.verifySearch("20:30:00");
  140 |     expect(await cmPage.tableRow()).toHaveCount(1);
  141 |     //To search by date
  142 |     await cmPage.verifySearch("2024-08-22");
  143 |     expect(await cmPage.tableRow()).toHaveCount(1);
  144 |   });
  145 |
  146 |   test("Verify Case Filter functionality", async () => {
  147 |     //Filters
  148 |     await cmPage.clickOnCaseFilterIcon();
  149 |     expect(await cmPage.getcaseFilterheading()).toBe("Filter Cases");
  150 |     //Packed Picked
  151 |     await cmPage.selectFilter("Packed");
  152 |     //first row conatins packed
  153 |     expect(await (await cmPage.firstRow()).innerText()).toContain("Packed");
  154 |     //chip text content
  155 |     expect(await (await cmPage.filterChip()).innerText()).toContain("PACKED");
  156 |     //Clear all filter should be present
  157 |     await expect(cmPage.clearAllFilters).toBeVisible();
  158 |     await cmPage.clearAllFilters.click();
  159 |     //Filer chip and clear all filter should not be visible after click
  160 |     await expect(cmPage.clearAllFilters).not.toBeVisible();
  161 |     await expect(await cmPage.filterChip()).not.toBeVisible();
  162 |   });
  163 |
  164 |   test("Case coloumn test", async () => {
  165 |     const tableHeaders = await cmPage.getTableHeader();
  166 |     await (await cmPage.caseColoumnIcon()).click();
  167 |     expect(await cmPage.caseColoumHeader()).toBeVisible();
  168 |     expect(await cmPage.availableColoumnHeader()).toBeVisible();
  169 |     expect(await cmPage.selectedColoumnHeader()).toBeVisible();
  170 |     expect(await cmPage.getAvailableColoumnTextContents()).toEqual(
  171 |       await cmPage.getSelectedColoumnTextContent()
  172 |     );
  173 |
  174 |     //To verify coloumn search functionality
  175 |     await cmPage.verifySelectColoumnFromSearch("OrderState");
> 176 |     expect(await cmPage.getSelectedColoumnTextContent()).not.toContain(
      |                                                              ^ Error: expect(received).not.toContain(expected) // indexOf
  177 |       "OrderState"
  178 |     );
  179 |     //To reorder coloumns by moving Name to first
  180 |     await cmPage.selectNameColoumn();
  181 |     await cmPage.clickUpArrow();
  182 |     await (await cmPage.getApplyBtn()).click();
  183 |     await page.waitForTimeout(1000);
  184 |     const newHeader = await cmPage.getTableHeader();
  185 |     expect(newHeader[0]).not.toBe(tableHeaders[0]);
  186 |     //To verify first heading should be Name
  187 |     expect(newHeader[0]).toBe("Name");
  188 |     //To verify order state should not be present under heading
  189 |     expect(newHeader).not.toContain("OrderState");
  190 |
  191 |     /* To  remove first coloumn i.e; Name from selected coloumns 
  192 |     by clicking x icon on selected columns tab */
  193 |     await (await cmPage.caseColoumnIcon()).click();
  194 |     await (await cmPage.searchColoumn()).clear();
  195 |     await cmPage.clickkOnclocseIcon();
  196 |     //To verify Name is removed from Selected Coloumns tab
  197 |     expect(await cmPage.getSelectedColoumnTextContent()).not.toContain("Name");
  198 |     //To verify Name is unchecked from Available Coloumns tab
  199 |     expect(await cmPage.nameCheckBox()).toHaveAttribute(
  200 |       "aria-checked",
  201 |       "false"
  202 |     );
  203 |     //Apply changes
  204 |     await (await cmPage.getApplyBtn()).click();
  205 |     await page.waitForTimeout(1000);
  206 |     //To verify Name is not present under table headers
  207 |     expect(await cmPage.getTableHeader()).not.toContain("Name");
  208 |   });
  209 |
  210 |   test("Verify view case", async () => {
  211 |     await (await cmPage.caseName(dataset.orderDetails.name)).click();
  212 |
  213 |     //view case
  214 |     await cmPage.clickOnviewCase();
  215 |     expect(await wlPage.orderID.inputValue()).toBe(
  216 |       dataset.orderDetails.orderID
  217 |     );
  218 |     expect(await wlPage.orderState.inputValue()).toBe(
  219 |       dataset.orderDetails.orderState.packed
  220 |     );
  221 |     expect(await wlPage.name.inputValue()).toBe(dataset.orderDetails.name);
  222 |     expect(await wlPage.quantity.inputValue()).toBe(
  223 |       dataset.orderDetails.quantity
  224 |     );
  225 |     expect(await wlPage.product.inputValue()).toBe(
  226 |       dataset.orderDetails.product
  227 |     );
  228 |     await cmPage.clickOnSubmitBtn();
  229 |   });
  230 |
  231 |   test("Verify Create case functionality by creating new case from existing case ", async () => {
  232 |     //To create a new case
  233 |     await (await cmPage.caseName(dataset.orderDetails.name)).click();
  234 |     await cmPage.createNewCase(
  235 |       dataset.newCase.orderID,
  236 |       dataset.orderDetails.orderState.packed,
  237 |       dataset.newCase.name
  238 |     );
  239 |     (await cmPage.getBackToCases()).click();
  240 |     await page.locator("twc-table-row").first().waitFor();
  241 |     await expect(await cmPage.caseName(dataset.newCase.name)).toBeVisible();
  242 |   });
  243 |
  244 |   test("Verify click on more and delete the updated case", async () => {
  245 |     await (await cmPage.caseName(dataset.newCase.name)).click();
  246 |
  247 |     //delete case
  248 |     await cmPage.deleteCase(dataset.newCase.name);
  249 |     await (await cmPage.getBackToCases()).click();
  250 |     await page.locator("twc-table-row").first().waitFor();
  251 |     await expect(await cmPage.caseName(dataset.newCase.name)).not.toBeVisible();
  252 |   });
  253 |
  254 |   //Case Details
  255 |   test("Verify tha data for Additional Order cases", async () => {
  256 |     await page.waitForTimeout(1000);
  257 |     await cmPage.clickOnAdditionalOrder();
  258 |     expect(await cmPage.caseHeader()).toBe("Case types");
  259 |     expect(await cmPage.activeCasestxt()).toBeVisible();
  260 |     expect(await cmPage.getCaseTypeHeaderName("AdditionalOrder")).toBe(
  261 |       "AdditionalOrder"
  262 |     );
  263 |     expect(await cmPage.getTableHeader()).toStrictEqual([
  264 |       "AdditionalOrderID",
  265 |       "caseState1",
  266 |     ]);
  267 |   });
  268 |
  269 |   test("To verify Work items under Case Details", async () => {
  270 |     await (await cmPage.caseName(dataset.orderDetails.name)).click();
  271 |     await cmPage.clickOnWorkItems();
  272 |     //To verify Work items header
  273 |     expect(await cmPage.workItemsHeader()).toBe("Work items");
  274 |     //To verify work item name
  275 |     const workItem = await cmPage.workItem();
  276 |
```