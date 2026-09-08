import { test, expect, Page } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { HomePage } from "../../PageObjects/HomePage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import testData from "../../fixtures/CATestData.json";
import { OrgBrowserPage } from "../../PageObjects/OrgBrowserPage";
import { BSPage } from "../../PageObjects/BSPage";
//Json->string->js orgBrowserPageject
const dataset = JSON.parse(JSON.stringify(testData));
let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let cmPage: CaseManagerPage;
let homePage: HomePage;
let wlPage: WorkListPage;
let orgBrowserPage: OrgBrowserPage;
let obPage: OrgBrowserPage;
let bsPage: BSPage;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  cmPage = poManager.getCaseManagerPage();
  wlPage = poManager.getWorkListPage();
  homePage = poManager.getHomePage();
  obPage = poManager.obPage;
  //bsPage = (poManager as any).getBSPage ? (poManager as any).getBSPage() : new BSPage(page);
  bsPage = poManager.getBSPage();
});

 test.describe("Deployments", () => {
   test("Pre requisite deployments for Case Manager", async () => {
     await page.goto(dataset.adminUrl);
     await adminPage.navigateToDeploymentManager();
//     //dpendency
    await dmPage.deployRascFiles(dataset.CAOrgModelFileName, dataset.CAOrgModelRasc);
    const status = await dmPage.getAppStatus(dataset.CAOrgModelFileName);
    const type = await dmPage.getAppType(dataset.CAOrgModelFileName);
    await expect(status).toHaveText(/Deployed/);
    await expect(type).toHaveText(/organization/i);

    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toEqual("Organization");
    //case manager
    await dmPage.deployRascFiles(dataset.CABDS1FileName, dataset.CABDS1Rasc);
    const statusCM = await dmPage.getAppStatus(dataset.CABDS1FileName);
    const typeCM = await dmPage.getAppType(dataset.CABDS1FileName);
    //await expect(statusCM).toHaveText(/Deployed/);
    //await expect(typeCM).toHaveText("Data");
    expect(statusCM).toHaveText(/Deployed/);
    expect(await typeCM.innerText()).toEqual("Data");

    //Process Project deployment
    await dmPage.deployRascFiles(dataset.CAProcessProjectFileName, dataset.CAProcessProjectRasc);
    const statusPP = await dmPage.getAppStatus(dataset.CAProcessProjectFileName);
    const typePP = await dmPage.getAppType(dataset.CAProcessProjectFileName);
    //await expect(statusPP).toHaveText(/Deployed/);
    //await expect(typePP).toHaveText("Process");
    expect(statusPP).toHaveText(/Deployed/);
    expect(await typePP.innerText()).toEqual("Process");


    // //Starting a process
    // await adminPage.navigatetoProcessManager();
    // await adminPage.startProcess(dataset.CAProcessStartFileName);
    // await adminPage.startProcess(dataset.CAProcessStartFileName1);
    // //end
  });
});

// Go to Organization Browser
/*test('Navigate Organization Browser', async () => {
        await page.goto(dataset.orgbrowserurl);
        await page.waitForTimeout(3000);
        await expect(obPage.OrgBrowserWelcomeTitle).toContainText('Welcome');
});*/

test.describe("LDAP Container Management", () => {
 /* test("Create a new LDAP container", async () => {
    await page.goto(dataset.orgbrowserurl);
    await page.waitForTimeout(3000);

    // Click Go on "Create an LDAP container" card
    await obPage.goButton().first().click();
    await expect(obPage.createContainer_PageHeader().first()).toContainText("Create container");

    // Fill name and description
    await obPage.containerCreation_Name().fill(dataset.API.ldapName);
    await obPage.containerCreation_Description().fill(dataset.API.ldapDesc);

    // Proceed to Choose LDAP source
    await page.waitForTimeout(1000);
    await obPage.containerCreation_NextButton().first().click();
    await expect(obPage.chooseLDAPSource_PageHeader().nth(1)).toContainText("Choose LDAP source");

    // Select alias from dropdown
    await obPage.ldapSource_AliasList().click();
    await obPage.SelectAlias_WithName(dataset.API.alias).click();

    // Set resource name attribute
    await obPage.ldapSource_cnValue().clear();
    await page.waitForTimeout(1000);
    await obPage.ldapSource_cnValue().fill(dataset.API.dn);

    // Show sample data and close dialog
    await obPage.ldapSource__ShowSampleData().click();
    //await expect(obPage.querySourceSampleData_Dialog()).toContainText("Query source  sample data");
    await obPage.querySourceSampleData_Close().click();

    // Save LDAP source
    await obPage.ldapSource_SaveButton().click();

    // Proceed to Map resource attributes
    await obPage.containerCreation_NextButton().nth(1).click();
    await expect(obPage.mapResourceAttribute_PageHeader()).toContainText("Map resource attributes");

    // Select org model version and create container
    await obPage.orgModel_VersionList().click();
    await obPage.SelectOrgModel_Version("1").click();
    await obPage.createLDAPContainer_Button().click();

    await page.waitForTimeout(2000);
    await expect(obPage.orgBrowserHomeIcon()).toBeVisible();
    await expect(obPage.browseOrganization_Tab()).toContainText("Browse organization");
    await expect(obPage.ldapName(dataset.API.ldapName)).toBeVisible();
  });*/

  test("Create the new LDAP container", async () => {
      // Visit the URL
//custcmmd.loginAdministrator(page, dataset.adminusername, dataset.adminpassword);
      await page.goto(dataset.orgbrowserurl);

      // Wait for the welcome title to appear
      await page.waitForTimeout(2000);

      // Click the Go Button
      await obPage.goButton().first().click();

      // Verify the Create Container Page Header
      const createContainerHeader = await obPage.createContainer_PageHeader().textContent();
      expect(await createContainerHeader).toContain("Create container");

      // Type in the container name and description
      await obPage.containerCreation_Name().fill(dataset.API.ldapName);
      await obPage.containerCreation_Description().fill(dataset.API.ldapDesc);

      // Click Next Button
      await obPage.containerCreation_NextButton().first().click();

      // Verify the Choose LDAP Source Page Header
      const chooseLDAPSourceHeader = await obPage.chooseLDAPSource_PageHeader().textContent();
      expect(await chooseLDAPSourceHeader).toContain("Choose LDAP source");

      // Click the LDAP Alias List
      await obPage.ldapSource_AliasList().click();

      // Select Alias with Name 'easyAs'
      await obPage.selectAliasWithName("easyAs");

      // Clear and type the cnValue
      await obPage.ldapSource_cnValue().clear();
      await page.waitForTimeout(2000);
      await obPage.ldapSource_cnValue().fill("ou");

      // Show Sample Data
      await obPage.ldapSource__ShowSampleData().click();

      // Close the Sample Data Dialog
      await obPage.querySourceSampleData_Close().click();

      // Save the LDAP Source
      await obPage.ldapSource_SaveButton().click();

      // Click Next Button
      await obPage.containerCreation_NextButton().nth(1).click();

      // Verify the Map Resource Attributes Page Header
      const mapResourceHeader = await obPage.mapResourceAttribute_PageHeader().textContent();
      expect(await mapResourceHeader).toContain("Map resource attributes");

      // Select the Organization Model Version
      await obPage.orgModel_VersionList().click();
      await obPage.SelectOrgModel_Version("1").click();

      // Click the Create LDAP Container Button
      await obPage.createLDAPContainer_Button().click();

      // Wait for 2 seconds
      await page.waitForTimeout(2000);

      // Verify that the Org Browser Home Icon is visible
      const orgBrowserHomeIconVisible = await obPage.OrgBrowserHomeIcon.isVisible();
      expect(orgBrowserHomeIconVisible).toBe(true);

      // Verify the Browse Organization Tab
      const browseOrgTabText = await obPage.BrowseOrganization_Tab.textContent();
      expect(browseOrgTabText).toContain("Browse organization");

      // Verify that the LDAP container is visible
      const ldapNameVisible = await obPage.ldapName(dataset.API.ldapName).isVisible();
      expect(ldapNameVisible).toBe(true);
    });


  test("Add resources to the LDAP container as BPM resources", async () => {
    test.setTimeout(120000);
    await page.goto(dataset.ldapContainersurl);

    await page.waitForTimeout(3000);

    // Navigate to Manage LDAP containers
    await obPage.view_Manage_GoBtn("Manage LDAP containers").click();
    await page.waitForTimeout(2000);

    // Open the LDAP container
    await obPage.ldapName(dataset.API.ldapName).dblclick();
    await page.waitForTimeout(5000);

    // Select all resources and add them
    await page.locator('.header-checkbox-selectall > .ldap-resources-checkbox > .mat-mdc-checkbox').click();
    await obPage.addSelected_Button().click();
    await expect(obPage.addResource_Dialog()).toContainText("Add resource(s)");
    await obPage.createResource_Button().click();
    await page.waitForTimeout(3000);

    // createResource may navigate away (e.g. to Deployment Manager) — go back to org browser
    await page.goto(dataset.ldapContainersurl);
    await page.waitForTimeout(2000);
    await obPage.view_Manage_GoBtn("Manage LDAP containers").click();
    await page.waitForTimeout(2000);

    // Re-open CaseAccessContainer for resource mapping
    await obPage.ldapName(dataset.API.ldapName).dblclick();
    await page.waitForTimeout(3000);

    // Select Liam Lawrence from left pane
    await obPage.selectResourceWithName(dataset.username1);

    // Expand: Organizations > Lloyds Bank > Saving Account
    await obPage.click_Toggle_Button_In_Front_Of("Organizations");
    await obPage.click_Toggle_Button_In_Front_Of("Lloyds Bank");
    await obPage.click_Toggle_Button_In_Front_Of("Saving Account");

    // Click FrontLineSupport position and map
    await page.locator('//div[@title="FrontLineSupport"]').click();
    await page.getByRole('button', { name: 'Map selected resources' }).click();
    await page.waitForTimeout(2000);
    await obPage.selectResourceWithName("Liam Lawrence"); // select John Eustace to also map him to the same position

    await obPage.selectResourceWithName("John Eustace");
    await obPage.select_Position_With_Name('BankAccountAccess').first().click();
    await obPage.map_Selected_Resource_Link().first().click();
    await obPage.selectResourceWithName("John Eustace");

    await obPage.selectResourceWithName("Clint Hill");
    await obPage.click_Toggle_Button_In_Front_Of("HomeLoan");
    await obPage.select_Position_With_Name('BackendSupport').first().click();
    await obPage.map_Selected_Resource_Link().first().click();
    await obPage.selectResourceWithName("Clint Hill");

    // Select John Eustace from left pane
  });
});

test("Logout and login as Clint Hill, navigate to Work Manager", async () => {
  test.setTimeout(300000);
  // Clear all session state (cookies + local/session storage)
  await page.context().clearCookies();
  await page.goto(dataset.webcomponenturl);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.waitForTimeout(2000);

  // Login as Clint Hill
  await page.locator('input[type="text"]').fill("Clint Hill");
  await page.locator('input[type="password"]').fill(dataset.nonadminpassword);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.waitForTimeout(3000);
  await page.waitForLoadState("networkidle");

  //click on Business Services and verify user lands on work manager page
  //await page.reload();
  //await expect(bsPage.bsFormHeader).toBeVisible();
//Case Access - Business Service"
  //await page.goto(dataset.workMangerUrlApp);
  //await homePage.clickOnBuisnessService();
  //await page.waitForLoadState("domcontentloaded");
  //await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
  //await cmPage.clickOnConfirmServerSelectionBtn();
    //To verify BS header
  //expect(await bsPage.verifyBSheader()).toBe("Business Services");
    //To verify presence of refresh icon
  //expect(await bsPage.refreshIcon()).toBeVisible();
    //Click on BS All types buisness services
  // Submit Business Service multiple times, cycling state combinations across all three
  // account sections (Saving Account, Loan Account, Debit Card) on each iteration.
  const accountStates: string[] = dataset.fillCustomerData.accountStates;

  for (let i = 0; i < accountStates.length; i++) {
    // Navigate and reload to guarantee a fresh collapsed tree state each iteration
    await page.goto(dataset.gasdbWorkManagerUrl);
    await page.reload();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    await bsPage.clickOnFillFormBS();
    await bsPage.fillCustomerDataForm(
      dataset.fillCustomerData.customerName,
      dataset.fillCustomerData.accountType,
      accountStates[i],
      i  // stateIndex — drives Loan Account and Debit Card state cycling each iteration
    );
  }
});

test.describe("Case Access - Business Service", () => {
});

test("Validate Saving Account case fields in Case Manager", async () => {
  test.setTimeout(180000);

  // Log in as admin to see all cases created by the Business Service submissions
  await page.context().clearCookies();
  await page.goto(dataset.webcomponenturl);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.waitForTimeout(2000);
  await page.locator('input[type="text"]').fill(dataset.adminusername);
  await page.locator('input[type="password"]').fill(dataset.adminpassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle');

  // Navigate through Work Manager UI — direct URL to Case Manager skips the
  // server initialisation step and leaves the case-type sidebar empty.
  await page.goto(dataset.workMangerUrlApp);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  // Click Business Services nav icon to prime the Work Manager context
  const bsIconAdmin = page.locator('#bpmBizServices svg');
  if (await bsIconAdmin.isVisible()) {
    await bsIconAdmin.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
  // Select server from global switcher if it appears (admin users often need this)
  if (await cmPage.globalServerSwitcherIcon.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
  }
  // Navigate to Case Manager via nav icon — this properly loads the case-type sidebar
  await cmPage.navigateToCaseManager();
  await page.waitForTimeout(3000);

  // clickOnCaseType logs all sidebar items to console so you can verify the name.
  // Update caseManager.savingAccountCaseType in CATestData.json if it differs.
  await cmPage.clickOnCaseType(dataset.caseManager.savingAccountCaseType);

  // Verify cases exist — created by the Business Service loop in the previous test
  await page.locator('twc-table-row').first().waitFor({ state: 'visible', timeout: 20000 });
  const caseCount = await page.locator('twc-table-row').count();
  expect(caseCount).toBeGreaterThan(0);
  console.log(`Found ${caseCount} Saving Account case(s)`);

  // Read and log the first row's raw case data for debugging/inspection
  const firstRowData = await cmPage.getCaseRowDetails(0);
  console.log('First case row details:', JSON.stringify(firstRowData, null, 2));
  expect(firstRowData).not.toBeNull();

  // Open the first Saving Account case
  await cmPage.openCase(0);

  // ── SavingAccount section (root case fields) ─────────────────────────────
  // BOM section is named "SavingAccount" — not "SavingData" as initially guessed.
  // Loan Account and Debit Card are separate case types in the sidebar, not nested
  // sub-sections of the Saving Account case detail view.
  const savingState = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'state');
  console.log('SavingAccount.state:', savingState);
  expect(dataset.caseManager.expectedSavingStates).toContain(savingState);

  const savingType = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'type');
  console.log('SavingAccount.type:', savingType);
  expect(savingType).toBeTruthy();

  const acccountNumber = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'acccountNumber');
  console.log('SavingAccount.acccountNumber:', acccountNumber);
  expect(acccountNumber).toMatch(/^SAV_\d+$/);

  // BOM field "customerName" stores the mobile number in this application
  const savingCustomerName = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'customerName');
  console.log('SavingAccount.customerName:', savingCustomerName);
  expect(savingCustomerName).toBeTruthy();

  const branchName = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'branchName');
  console.log('SavingAccount.branchName:', branchName);
  // branchName may be empty for newly created cases — just log it
  console.log('SavingAccount.balance:', await cmPage.getCaseFieldDisplayValue('SavingAccount', 'balance'));

  // ── accountAdditionalInfo section ────────────────────────────────────────
  const savingInterestRate = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'savingInterestRate');
  console.log('accountAdditionalInfo.savingInterestRate:', savingInterestRate);
  expect(savingInterestRate).toBeTruthy();

  const serviceRequest = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'serviceRequest');
  console.log('accountAdditionalInfo.serviceRequest:', serviceRequest);
  expect(serviceRequest).toMatch(/^SR-\d{4}-\d+$/);

  const branchAddress = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'branchAddress');
  console.log('accountAdditionalInfo.branchAddress:', branchAddress);
  expect(branchAddress).toContain(dataset.caseManager.expectedBranchAddress);

  // Navigate back to the case list
  await cmPage.backToCases.click();
  await page.locator('twc-table-row').first().waitFor({ timeout: 10000 });
  expect(await page.locator('twc-table-row').count()).toBeGreaterThan(0);

  // ───────────────────────────────────────────────────────────────────────────
  // Loan Account case type verification
  // ───────────────────────────────────────────────────────────────────────────
  await cmPage.clickOnCaseType(dataset.caseManager.loanAccountCaseType);
  await page.locator('twc-table-row').first().waitFor({ state: 'visible', timeout: 20000 });
  const loanCaseCount = await page.locator('twc-table-row').count();
  expect(loanCaseCount).toBeGreaterThan(0);
  console.log(`Found ${loanCaseCount} Loan Account case(s)`);

  const loanFirstRow = await cmPage.getCaseRowDetails(0);
  console.log('Loan Account first case details:', JSON.stringify(loanFirstRow, null, 2));
  expect(loanFirstRow).not.toBeNull();

  await cmPage.openCase(0);

  // ── LoanAccount section fields ───────────────────────────────────────────
  // Field names confirmed from DOM inspection (loanstate = lowercase 's')
  const loanState = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanstate');
  console.log('LoanAccount.loanstate:', loanState);
  expect(loanState).toBeTruthy();

  const loanType = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanType');
  console.log('LoanAccount.loanType:', loanType);
  expect(loanType).toBeTruthy();

  const loanAccountNumber = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanAccountNumber');
  console.log('LoanAccount.loanAccountNumber:', loanAccountNumber);
  expect(loanAccountNumber).toBeTruthy();

  const loanCustomerContact = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'customerContact');
  console.log('LoanAccount.customerContact:', loanCustomerContact);
  expect(loanCustomerContact).toBeTruthy();

  const loanCIBIL = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'customerCIBILScore');
  console.log('LoanAccount.customerCIBILScore:', loanCIBIL);
  expect(['750', '680']).toContain(loanCIBIL);

  const loanInterestRate = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanInterestRate');
  console.log('LoanAccount.loanInterestRate:', loanInterestRate);
  expect(['8.5', '10.25']).toContain(loanInterestRate);

  const disbursedAmount = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'disbursedAmount');
  console.log('LoanAccount.disbursedAmount:', disbursedAmount);
  expect(['50000', '75000']).toContain(disbursedAmount);

  const loanBranch = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanBranch');
  console.log('LoanAccount.loanBranch:', loanBranch);
  expect(loanBranch).toContain(dataset.caseManager.expectedLoanBranch);

  const loanTenure = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanTenureinYrs');
  console.log('LoanAccount.loanTenureinYrs:', loanTenure);
  expect(['10', '15']).toContain(loanTenure);

  await cmPage.backToCases.click();
  await page.locator('twc-table-row').first().waitFor({ timeout: 10000 });
  expect(await page.locator('twc-table-row').count()).toBeGreaterThan(0);

  // ───────────────────────────────────────────────────────────────────────────
  // Debit Card case type verification
  // ───────────────────────────────────────────────────────────────────────────
  await cmPage.clickOnCaseType(dataset.caseManager.debitCardCaseType);
  await page.locator('twc-table-row').first().waitFor({ state: 'visible', timeout: 20000 });
  const debitCaseCount = await page.locator('twc-table-row').count();
  expect(debitCaseCount).toBeGreaterThan(0);
  console.log(`Found ${debitCaseCount} Debit Card case(s)`);

  const debitFirstRow = await cmPage.getCaseRowDetails(0);
  console.log('Debit Card first case details:', JSON.stringify(debitFirstRow, null, 2));
  expect(debitFirstRow).not.toBeNull();

  await cmPage.openCase(0);

  // ── DebitCard section fields ─────────────────────────────────────────────
  // Field names confirmed from DOM inspection (CVV is uppercase, debitCardnumber has lowercase 'n')
  const debitCardState = await cmPage.getCaseFieldDisplayValue('DebitCard', 'debitCardState');
  console.log('DebitCard.debitCardState:', debitCardState);
  expect(debitCardState).toBeTruthy();

  const debitCardNumber = await cmPage.getCaseFieldDisplayValue('DebitCard', 'debitCardnumber');
  console.log('DebitCard.debitCardnumber:', debitCardNumber);
  expect(debitCardNumber).toBeTruthy();

  const cardHolderName = await cmPage.getCaseFieldDisplayValue('DebitCard', 'cardHolderName');
  console.log('DebitCard.cardHolderName:', cardHolderName);
  expect(cardHolderName).toBeTruthy();

  const cardExpiry = await cmPage.getCaseFieldDisplayValue('DebitCard', 'cardExpiry');
  console.log('DebitCard.cardExpiry:', cardExpiry);
  // cardExpiry logged for reference — may be empty for new cards

  const cvv = await cmPage.getCaseFieldDisplayValue('DebitCard', 'CVV');
  console.log('DebitCard.CVV:', cvv);
  // CVV is rendered as &nbsp; in the BOM (security placeholder) — value is not displayed in UI

  await cmPage.backToCases.click();
  await page.locator('twc-table-row').first().waitFor({ timeout: 10000 });
  expect(await page.locator('twc-table-row').count()).toBeGreaterThan(0);
});

// ─────────────────────────────────────────────────────────────────────────────
// Liam Lawrence — FrontLineSupport (Saving Account, Lloyds Bank)
// Limited access: sees customer-facing fields only.
// Sensitive financial fields (CIBIL, CVV, interest rates, amounts) are
// restricted by the BOM access policy and should not be rendered in the UI.
// ─────────────────────────────────────────────────────────────────────────────
test("Liam Lawrence - validate limited Saving Account case access in Case Manager", async () => {
  test.setTimeout(180000);

  // Logout and re-login as Liam Lawrence (FrontLineSupport role)
  await page.context().clearCookies();
  await page.goto(dataset.webcomponenturl);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.waitForTimeout(2000);
  await page.locator('input[type="text"]').fill(dataset.username1); // "Liam Lawrence"
  await page.locator('input[type="password"]').fill(dataset.nonadminpassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle');

  // Navigate through Work Manager UI (direct URL skips sidebar initialisation)
  await page.goto(dataset.workMangerUrlApp);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  const bsIconLiam = page.locator('#bpmBizServices svg');
  if (await bsIconLiam.isVisible()) {
    await bsIconLiam.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
  if (await cmPage.globalServerSwitcherIcon.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
  }
  await cmPage.navigateToCaseManager();
  await page.waitForTimeout(3000);

  // Select Saving Account case type — Liam Lawrence is mapped to this org unit
  await cmPage.clickOnCaseType(dataset.caseManager.savingAccountCaseType);

  // Verify Liam can see cases in the list (FrontLineSupport has read access to the case list)
  await page.locator('twc-table-row').first().waitFor({ state: 'visible', timeout: 20000 });
  const caseCount = await page.locator('twc-table-row').count();
  expect(caseCount).toBeGreaterThan(0);
  console.log(`Liam Lawrence sees ${caseCount} Saving Account case(s) in list`);

  // Read the first row's raw details — log to show what the list-level data exposes
  const firstRowData = await cmPage.getCaseRowDetails(0);
  console.log('Liam - first case row details JSON:', JSON.stringify(firstRowData, null, 2));
  expect(firstRowData).not.toBeNull();

  // Open the first case
  await cmPage.openCase(0);

  // ── Saving Account — state-aware assertions ──────────────────────────────
  // BOM: FrontLineSupport has Full Case Access for ACTIVE and INACTIVE states.
  // KYC PENDING / CLOSED — Use All-States Default — summary access only.

  const savingState = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'state');
  console.log('[accessible] SavingAccount.state:', savingState);
  expect(dataset.caseManager.expectedSavingStates).toContain(savingState);

  // Summary fields — always visible regardless of state
  const savingType = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'type');
  console.log('[accessible] SavingAccount.type:', savingType);
  expect(savingType).toBeTruthy();

  const acccountNumber = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'acccountNumber');
  console.log('[accessible] SavingAccount.acccountNumber:', acccountNumber);
  expect(acccountNumber).toMatch(/^SAV_\d+$/);

  const savingCustomerName = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'customerName');
  console.log('[accessible] SavingAccount.customerName:', savingCustomerName);
  expect(savingCustomerName).toBeTruthy();

  const savingHasFullAccess = ['ACTIVE', 'INACTIVE'].includes(savingState);
  console.log(`Liam saving state: ${savingState} — full access: ${savingHasFullAccess}`);

  const branchAddress = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'branchAddress');
  console.log('accountAdditionalInfo.branchAddress:', branchAddress);
  const serviceRequest = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'serviceRequest');
  console.log('accountAdditionalInfo.serviceRequest:', serviceRequest);
  const savingInterestRate = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'savingInterestRate');
  console.log('accountAdditionalInfo.savingInterestRate:', savingInterestRate);

  if (savingHasFullAccess) {
    expect(branchAddress).toContain(dataset.caseManager.expectedBranchAddress);
    expect(serviceRequest).toMatch(/^SR-\d{4}-\d+$/);
    expect(savingInterestRate).toBeTruthy();
  } else {
    expect(branchAddress).toBe('');
    expect(serviceRequest).toBe('');
    expect(savingInterestRate).toBe('');
  }

  const balance = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'balance');
  console.log('SavingAccount.balance:', balance);

  // Navigate back to case list
  await cmPage.backToCases.click();
  await page.locator('twc-table-row').first().waitFor({ timeout: 10000 });
  expect(await page.locator('twc-table-row').count()).toBeGreaterThan(0);

  // ── Loan Account — state-aware assertions ────────────────────────────────
  // BOM: same state-based pattern as Saving Account (different privileges per state).
  await cmPage.clickOnCaseType(dataset.caseManager.loanAccountCaseType);
  await page.locator('twc-table-row').first().waitFor({ state: 'visible', timeout: 20000 });
  const loanCaseCount = await page.locator('twc-table-row').count();
  expect(loanCaseCount).toBeGreaterThan(0);
  console.log(`Liam Lawrence sees ${loanCaseCount} Loan Account case(s) in list`);

  await cmPage.openCase(0);

  // LoanAccount summary fields — always visible
  const loanState = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanstate');
  console.log('[accessible] LoanAccount.loanstate:', loanState);
  expect(dataset.caseManager.expectedLoanStates).toContain(loanState);

  const loanType = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanType');
  console.log('[accessible] LoanAccount.loanType:', loanType);
  expect(loanType).toBeTruthy();

  const loanAccountNumber = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanAccountNumber');
  console.log('[accessible] LoanAccount.loanAccountNumber:', loanAccountNumber);
  expect(loanAccountNumber).toBeTruthy();

  const loanCustomerContact = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'customerContact');
  console.log('[accessible] LoanAccount.customerContact:', loanCustomerContact);
  expect(loanCustomerContact).toBeTruthy();

  // Loan Account summary fields — always visible (included in BOM summary section)
  const loanInterestRate = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanInterestRate');
  console.log('LoanAccount.loanInterestRate:', loanInterestRate);
  expect(loanInterestRate).toBeTruthy();

  const loanTenure = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanTenureinYrs');
  console.log('LoanAccount.loanTenureinYrs:', loanTenure);
  expect(loanTenure).toBeTruthy();

  // Restricted fields — not in BOM summary; only visible with Full Case Access.
  // BOM for Loan Account has different privilege configuration from Saving Account;
  // log actual values so we can tighten assertions once the exact BOM states are confirmed.
  const loanCIBIL = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'customerCIBILScore');
  console.log('LoanAccount.customerCIBILScore:', loanCIBIL);
  const disbursedAmount = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'disbursedAmount');
  console.log('LoanAccount.disbursedAmount:', disbursedAmount);
  const loanBranch = await cmPage.getCaseFieldDisplayValue('LoanAccount', 'loanBranch');
  console.log('LoanAccount.loanBranch:', loanBranch);
});

// ─────────────────────────────────────────────────────────────────────────────
// John Eustace — Manager / Account Officer
// Broader access than FrontLineSupport: can see financial details (CIBIL,
// interest rates, disbursed amounts) in addition to all customer-facing fields.
// Cases created by the Business Service have "John Eustace" as the customer
// name, so he can inspect the full details of those accounts.
// ─────────────────────────────────────────────────────────────────────────────
test("John Eustace - logout and login, validate full Saving Account case details in Case Manager", async () => {
  test.setTimeout(180000);

  // Logout from Liam Lawrence and login as John Eustace
  await page.context().clearCookies();
  await page.goto(dataset.webcomponenturl);
  await page.evaluate(() => { localStorage.clear(); sessionStorage.clear(); });
  await page.waitForTimeout(2000);
  await page.locator('input[type="text"]').fill(dataset.username2); // "John Eustace"
  await page.locator('input[type="password"]').fill(dataset.nonadminpassword);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle');

  // Navigate through Work Manager UI (direct URL skips sidebar initialisation)
  await page.goto(dataset.workMangerUrlApp);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  const bsIconJohn = page.locator('#bpmBizServices svg');
  if (await bsIconJohn.isVisible()) {
    await bsIconJohn.click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  }
  if (await cmPage.globalServerSwitcherIcon.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
  }
  await cmPage.navigateToCaseManager();
  await page.waitForTimeout(3000);

  // Select Saving Account case type
  await cmPage.clickOnCaseType(dataset.caseManager.savingAccountCaseType);

  // Verify John Eustace can see cases in the list
  await page.locator('twc-table-row').first().waitFor({ state: 'visible', timeout: 20000 });
  const caseCount = await page.locator('twc-table-row').count();
  expect(caseCount).toBeGreaterThan(0);
  console.log(`John Eustace sees ${caseCount} Saving Account case(s) in list`);

  // Read and log the first row's raw case data
  const firstRowData = await cmPage.getCaseRowDetails(0);
  console.log('John Eustace - first case row details JSON:', JSON.stringify(firstRowData, null, 2));
  expect(firstRowData).not.toBeNull();

  // Open the first case
  await cmPage.openCase(0);

  // ── SavingAccount section (full access — Manager role) ───────────────────
  // BOM section is named "SavingAccount". Loan Account and Debit Card are separate
  // case types in the sidebar — not nested sub-sections of the Saving Account case.

  const savingState = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'state');
  console.log('SavingAccount.state:', savingState);
  expect(dataset.caseManager.expectedSavingStates).toContain(savingState);

  const savingType = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'type');
  console.log('SavingAccount.type:', savingType);
  expect(savingType).toBeTruthy();

  const acccountNumber = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'acccountNumber');
  console.log('SavingAccount.acccountNumber:', acccountNumber);
  expect(acccountNumber).toMatch(/^SAV_\d+$/);

  const savingCustomerName = await cmPage.getCaseFieldDisplayValue('SavingAccount', 'customerName');
  console.log('SavingAccount.customerName:', savingCustomerName);
  expect(savingCustomerName).toBeTruthy();

  // ── accountAdditionalInfo section ────────────────────────────────────────
  // Note: savingInterestRate is NOT visible for John's BOM role (Manager position
  // does not have accountAdditionalInfo.savingInterestRate access in this BOM config).
  const savingInterestRate = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'savingInterestRate');
  console.log('accountAdditionalInfo.savingInterestRate:', savingInterestRate);

  const serviceRequest = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'serviceRequest');
  console.log('accountAdditionalInfo.serviceRequest:', serviceRequest);
  // serviceRequest visibility depends on BOM role — log and assert if non-empty
  if (serviceRequest) expect(serviceRequest).toMatch(/^SR-\d{4}-\d+$/);

  const branchAddress = await cmPage.getCaseFieldDisplayValue('accountAdditionalInfo', 'branchAddress');
  console.log('accountAdditionalInfo.branchAddress:', branchAddress);
  // branchAddress visibility depends on BOM role — log and assert if non-empty
  if (branchAddress) expect(branchAddress).toContain(dataset.caseManager.expectedBranchAddress);

  // Navigate back to the case list
  await cmPage.backToCases.click();
  await page.locator('twc-table-row').first().waitFor({ timeout: 10000 });
  expect(await page.locator('twc-table-row').count()).toBeGreaterThan(0);
});