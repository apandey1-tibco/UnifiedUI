# Test info

- Name: Unified Views Configuration >> Navigate to Unified Views screen under settings and Register New System
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:85:7

# Error details

```
Error: Timed out 15000ms waiting for expect(locator).toBeVisible()

Locator: locator('[role="menuitem"], li, a, [role="listitem"], span').filter({ hasText: 'Test System Name' }).first()
Expected: visible
Received: <element(s) not found>
Call log:
  - expect.toBeVisible with timeout 15000ms
  - waiting for locator('[role="menuitem"], li, a, [role="listitem"], span').filter({ hasText: 'Test System Name' }).first()

    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:125:74
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - complementary
  - button "Unified views":
    - text: Unified views
    - img
  - dialog "Register your server":
    - heading "Register your server" [level=2]
    - img "Close":
      - img
    - text: Server name Give a unique name to the server (Should not be empty, max length 50)
    - textbox: Test System Name
    - text: Server type Select your server type
    - button "BPM 4.x (AMXBPM)":
      - text: BPM 4.x (AMXBPM)
      - img
    - text: "(Supported for version 4.3.5-HF03 and higher) URL Set your server domain (eg: http://example-domain.com)"
    - textbox: http://gasdbpmwin19l02.dev.tibco.com:8080
    - button "Cancel"
    - button "Save" [disabled]
  - dialog:
    - text: Servers for unified views Available servers
    - menu:
      - menuitem "2204"
      - menuitem "2201"
    - button "Register new server"
  - img
  - text: Register new AMX BPM/BPMe server that you want to connect.
  - button "Register new server"
- iframe
```

# Test source

```ts
   25 |
   26 | // Load test data: read TestData.json and parse it into a JS object
   27 | const dataset = JSON.parse(
   28 |   JSON.stringify(require("../../fixtures/TestData.json"))
   29 | );
   30 |
   31 | // Declare shared page instance used across all tests in this file
   32 | let page: Page;
   33 | // Declare Page Object Manager instance to initialize all page objects
   34 | let poManager: POManager;
   35 | // Declare Home page object instance
   36 | let homePage: HomePage;
   37 | // Declare Case Manager page object instance
   38 | let cmPage: CaseManagerPage;
   39 | // Declare Business Services page object instance
   40 | let bsPage: BSPage;
   41 | // Declare Configuration page object instance
   42 | let configPage: ConfigurationPage;
   43 | // Declare Unified Views page object instance
   44 | let unifiedViewsPage: UnifiedViewsPage;
   45 | // Declare Work List page object instance
   46 | let wlPage: WorkListPage;
   47 | // Declare variable to store the randomly generated case number shared across tests
   48 | let randomCaseNumber: string;
   49 | // Declare Application page object instance for Data Admin interactions
   50 | let appPage: ApplicationPage;
   51 | // Declare Audit page object instance
   52 | let adPage: AuditPage;
   53 | // Declare Audit Work Item page object instance
   54 | let adworkitempage: AuditWorkItemPage;
   55 |
   56 | // beforeAll hook: runs once before all tests — creates a new browser page and initializes all page objects
   57 | test.beforeAll(async ({ browser }) => {
   58 |   // Open a new browser page
   59 |   page = await browser.newPage();
   60 |   // Initialize the Page Object Manager with the shared page
   61 |   poManager = new POManager(page);
   62 |   // Get Home page object from the manager
   63 |   homePage = poManager.getHomePage();
   64 |   // Get Case Manager page object from the manager
   65 |   cmPage = poManager.getCaseManagerPage();
   66 |   // Get Business Services page object from the manager
   67 |   bsPage = poManager.getBSPage();
   68 |   // Get Configuration page object from the manager
   69 |   configPage = poManager.getConfigurationPage();
   70 |   // Get Unified Views page object from the manager
   71 |   unifiedViewsPage = poManager.getUnifiedViewsPage();
   72 |   // Get Work List page object from the manager
   73 |   wlPage = poManager.getWorkListPage();
   74 |   // Get Application page object from the manager
   75 |   appPage = poManager.getApplicationPage();
   76 |   // Get Audit page object from the manager
   77 |   adPage = poManager.getAuditPage();
   78 |   // Get Audit Work Item page object from the manager
   79 |   adworkitempage = poManager.getAuditWorkItemPage();
   80 | });
   81 |
   82 | test.describe("Unified Views Configuration", () => {
   83 |   // Set a longer timeout of 120 seconds for this test suite due to UI load times
   84 |   test.setTimeout(120000);
   85 |   test("Navigate to Unified Views screen under settings and Register New System", async () => {
   86 |     // Navigate to the Work Manager URL for Unified Views configuration
   87 |     await page.goto(dataset.gasdbWorkManagerUrl);
   88 |     // Wait for the page DOM to fully load before interacting
   89 |     await page.waitForLoadState("domcontentloaded");
   90 |     // Click on the Business Service link to enter the application
   91 |     await homePage.clickOnBuisnessService();
   92 |     // Navigate to Configuration > Unified Views via the Settings menu
   93 |     await configPage.clickOnSetting();
   94 |     // Click on the Unified Views option under Configuration
   95 |     await configPage.clickOnUnifiedViews();
   96 |
   97 |     // Verify the Unified Views screen is loaded by checking for the heading
   98 |     await expect(page.locator("text=Unified views").first()).toBeVisible();
   99 |
  100 |     // Check if "Test System Name" already exists in the list (to avoid duplicate registration on re-runs)
  101 |     const alreadyExists = await unifiedViewsPage.getSystemFromList("Test System Name").isVisible({ timeout: 5000 }).catch(() => false);
  102 |
  103 |     // Only register the new system if it does not already exist
  104 |     if (!alreadyExists) {
  105 |       // Click on Register New System button to open the registration dialog
  106 |       await unifiedViewsPage.clickOnRegisterNewSystem();
  107 |
  108 |       // Verify the registration dialog is displayed
  109 |       await expect(page.getByRole('dialog', { name: /Register/i })).toBeVisible();
  110 |
  111 |       // Fill in the system name field in the registration form
  112 |       await unifiedViewsPage.enterSystemName("Test System Name");
  113 |
  114 |       // Select the system type from the dropdown
  115 |       await unifiedViewsPage.selectSystemType("BPM 4.x (AMXBPM)");
  116 |
  117 |       // Enter the system URL in the URL input field
  118 |       await unifiedViewsPage.enterSystemURL("http://gasdbpmwin19l02.dev.tibco.com:8081");
  119 |
  120 |       // Click Save to submit the registration form
  121 |       await unifiedViewsPage.clickOnSaveButton();
  122 |     }
  123 |
  124 |     // Verify the newly registered system appears in the "Servers for unified views" list
> 125 |     await expect(unifiedViewsPage.getSystemFromList("Test System Name")).toBeVisible({ timeout: 15000 });
      |                                                                          ^ Error: Timed out 15000ms waiting for expect(locator).toBeVisible()
  126 |
  127 |   });
  128 | });
  129 |
  130 | test.describe("Buisness Services e2e suite", () => {
  131 |   test("Test for buisnes services", async () => {
  132 |     // Navigate to the Work Manager application URL
  133 |     await page.goto(dataset.workMangerUrlApp);
  134 |     // Wait for the DOM to fully load before interacting with elements
  135 |     await page.waitForLoadState("domcontentloaded");
  136 |     // Click on Business Service to enter the application
  137 |     await homePage.clickOnBuisnessService();
  138 |     // Select the target server from the global server switcher
  139 |     await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
  140 |     // Confirm the server selection by clicking the confirm button
  141 |     await cmPage.clickOnConfirmServerSelectionBtn();
  142 |
  143 |     // Verify the Business Services header text is correct
  144 |     expect(await bsPage.verifyBSheader()).toBe("Business Services");
  145 |
  146 |     // Verify the refresh icon is visible on the Business Services screen
  147 |     expect(await bsPage.refreshIcon()).toBeVisible();
  148 |
  149 |     // Click on the specific business service to open its form
  150 |     await bsPage.clickOnBusinessService();
  151 |
  152 |     // Verify both Cancel and Submit buttons are visible on the form
  153 |     await Promise.all([
  154 |       expect(bsPage.cancelBtn).toBeVisible(),
  155 |       expect(bsPage.submitBtn).toBeVisible(),
  156 |     ]);
  157 |
  158 |     // Verify all pre-filled form details match expected values from test data
  159 |     await bsPage.verifyAllDetails(
  160 |       dataset.buisnessService.expectedDecimal,
  161 |       dataset.buisnessService.expectedInt,
  162 |       dataset.buisnessService.expectedText,
  163 |       getCurrentDate()
  164 |     );
  165 |
  166 |     // Update the myText field with the new value and submit the first User Task form
  167 |     await bsPage.textField.fill(dataset.buisnessService.updatedText);
  168 |     // Click Submit to proceed to the next User Task
  169 |     await bsPage.submitBtn.click();
  170 |     // Wait for the next form to load
  171 |     await page.waitForTimeout(2000);
  172 |     // Verify the updated text value is reflected in the next User Task form
  173 |     expect(await bsPage.textField.inputValue()).toBe(
  174 |       dataset.buisnessService.updatedText
  175 |     );
  176 |
  177 |     // Submit the 2nd User Task form to complete the business service flow
  178 |     await bsPage.submitBtn.click();
  179 |     // Wait for the page to process and load after submission
  180 |     await page.waitForTimeout(2000);
  181 |   });
  182 | });
  183 |
  184 | test.describe("Work Item e2e suite", () => {
  185 |   test("Submit Work Item", async () => {
  186 |     // Navigate to the Work Manager application URL
  187 |     await page.goto(dataset.workMangerUrlApp);
  188 |     // Wait for the page DOM to fully load
  189 |     await page.waitForLoadState("domcontentloaded");
  190 |     // Click on Business Service to enter the application
  191 |     await homePage.clickOnBuisnessService();
  192 |     // Select the target server from the global server switcher
  193 |     await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
  194 |     // Confirm the server selection
  195 |     await cmPage.clickOnConfirmServerSelectionBtn();
  196 |     // Click on "My Work" to navigate to the work items list
  197 |     await homePage.clickMyWork();
  198 |     // Click "Open" for the "GetDetailsForApproval" work item to open it in a new page/tab
  199 |     const workItemPage = await wlPage.clickOpenForWorkItem("GetDetailsForApproval");
  200 |     // Wait for the work item form to fully load
  201 |     await workItemPage.waitForTimeout(4000);
  202 |     // Generate a random 6-digit case number to use as unique identifier in the form
  203 |     randomCaseNumber = getRandomSixDigitNumber();
  204 |     // Fill the local data form fields with test data and the generated case number
  205 |     await wlPage.fillLocalDataForm(
  206 |       dataset.getDetailsForApproval.caseState1,
  207 |       randomCaseNumber,
  208 |       dataset.getDetailsForApproval.firstName,
  209 |       dataset.getDetailsForApproval.lastName
  210 |     );
  211 |     // Submit the local data form to create the work item/case
  212 |     await wlPage.submitLocalDataForm();
  213 |   });
  214 | });
  215 |
  216 | test.describe("Audit e2e suite", () => {
  217 |   test("Verify Audit functionality", async () => {
  218 |     // Step 1: Navigate to Work Manager URL and wait for page to load
  219 |     await page.goto(dataset.workMangerUrlApp);
  220 |     await page.waitForLoadState("domcontentloaded");
  221 |
  222 |     // Step 2: Click on Business Service to enter the application
  223 |     await homePage.clickOnBuisnessService();
  224 |
  225 |     // Step 3: Select the target server from the global switcher and confirm selection
```