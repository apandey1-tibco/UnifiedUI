import { test, expect, request, Page, chromium } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { OrgBrowserPage } from "../../PageObjects/OrgBrowserPage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import { ProcessInstancesPage } from "../../PageObjects/ProcessInstancesPage";
import { LoginPage } from "../../PageObjects/LoginPage";
import { AuditPage } from "../../PageObjects/AuditPage";
import { HomePage } from "../../PageObjects/HomePage";

//Json->string->js object
const TestData = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let instanceID1: any = "";
let instanceID2: any = "";
let instanceID3: any = "";

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let ob: OrgBrowserPage;
let wlPage: WorkListPage;
let adPrcoessInstacesPage: ProcessInstancesPage;
let loginPage: LoginPage;
let adPage: AuditPage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  ob = poManager.getOrgBrowserPage();
  wlPage = poManager.getWorkListPage();
  adPrcoessInstacesPage = poManager.getAuditPrcoessInstancesPage();
  loginPage = poManager.getLoginPage();
  adPage = poManager.getAuditPage();
});

test.describe("Deployments", () => {
  test("Pre requisite deployments for Work Views", async () => {
    await page.goto(TestData.adminUrl);
    await adminPage.navigateToDeploymentManager();

    //array001
    await dmPage.deployRascFiles(
      TestData.array001fileName,
      TestData.array001Rasc
    );
    const status = await dmPage.getAppStatus(TestData.array001fileName);
    const type = await dmPage.getAppType(TestData.array001fileName);
    expect(await status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Process");

    //Org Model Version 2
    await dmPage.deployRascFiles(TestData.orgNewfileName, TestData.orgNewRasc);
    const statusON = await dmPage.getAppStatus(TestData.orgNewfileName);
    const typeON = await dmPage.getAppType(TestData.orgNewfileName);
    expect(await statusON).toHaveText(/Deployed/);
    expect(await typeON.innerText()).toBe("Organization");

    //Simple BDS Org Model
    await dmPage.deployRascFiles(
      TestData.simpleBDSfileName,
      TestData.simpleBDSRasc
    );
    const statusBDS = await dmPage.getAppStatus(TestData.simpleBDSfileName);
    const typeBDS = await dmPage.getAppType(TestData.simpleBDSfileName);
    expect(await statusBDS).toHaveText(/Deployed/);
    expect(await typeBDS.innerText()).toBe("Data");

    //Org Model Part 1 Ace
    await dmPage.deployRascFiles(
      TestData.orgModelPart1ACEfileName,
      TestData.orgModelPart1ACERasc
    );
    const statusOM = await dmPage.getAppStatus(
      TestData.orgModelPart1ACEfileName
    );
    const typeOM = await dmPage.getAppType(TestData.orgModelPart1ACEfileName);
    expect(await statusOM).toHaveText(/Deployed/);
    expect(await typeOM.innerText()).toBe("Organization");

    //Simple Org Model
    await dmPage.deployRascFiles(
      TestData.simpleOrgModelfileName,
      TestData.simpleOrgModelRasc
    );
    const statusSOM = await dmPage.getAppStatus(
      TestData.simpleOrgModelfileName
    );
    const typeSOM = await dmPage.getAppType(TestData.simpleOrgModelfileName);
    expect(await statusSOM).toHaveText(/Deployed/);
    expect(await typeSOM.innerText()).toBe("Organization");

    //Offer Set
    await dmPage.deployRascFiles(
      TestData.offerSetfileName,
      TestData.offerSetRasc
    );
    const statusOS = await dmPage.getAppStatus(TestData.offerSetfileName);
    const typeOS = await dmPage.getAppType(TestData.offerSetfileName);
    expect(await statusOS).toHaveText(/Deployed/);
    expect(await typeOS.innerText()).toBe("Process");

    //Manual Adhoc Project
    await dmPage.deployRascFiles(
      TestData.manualAdhocfileName,
      TestData.manualAdhocRasc
    );
    const statusMA = await dmPage.getAppStatus(TestData.manualAdhocfileName);
    const typeMA = await dmPage.getAppType(TestData.manualAdhocfileName);
    expect(await statusMA).toHaveText(/Deployed/);
    expect(await typeMA.innerText()).toBe("Process");
  });
});

test("Create the new LDAP container", async () => {
  // Visit the URL
  await page.goto(TestData.orgbrowserurl);

  // Wait for the welcome title to appear
  await page.waitForTimeout(2000);

  // Click the Go Button
  await ob.goButton().first().click();

  // Verify the Create Container Page Header
  const createContainerHeader = await ob
    .createContainer_PageHeader()
    .textContent();
  expect(await createContainerHeader).toContain("Create container");

  // Type in the container name and description
  await ob.containerCreation_Name().fill("DynamicOrg");
  await ob.containerCreation_Description().fill("DynamicOrg_Test");

  // Click Next Button
  await ob.containerCreation_NextButton().first().click();

  // Verify the Choose LDAP Source Page Header
  const chooseLDAPSourceHeader = await ob
    .chooseLDAPSource_PageHeader()
    .textContent();
  expect(await chooseLDAPSourceHeader).toContain("Choose LDAP source");

  // Click the LDAP Alias List
  await ob.ldapSource_AliasList().click();

  // Select Alias with Name 'easyAs'
  await ob.selectAliasWithName("easyAs");

  // Clear and type the cnValue
  await ob.ldapSource_cnValue().clear();
  await page.waitForTimeout(2000);
  await ob.ldapSource_cnValue().fill("ou");

  // Show Sample Data
  await ob.ldapSource__ShowSampleData().click();

  // Close the Sample Data Dialog
  await ob.querySourceSampleData_Close().click();

  // Save the LDAP Source
  await ob.ldapSource_SaveButton().click();

  // Click Next Button
  await ob.containerCreation_NextButton().nth(1).click();

  // Verify the Map Resource Attributes Page Header
  const mapResourceHeader = await ob
    .mapResourceAttribute_PageHeader()
    .textContent();
  expect(await mapResourceHeader).toContain("Map resource attributes");

  // Select the Organization Model Version
  await ob.orgModel_VersionList().click();
  await ob.selectOrgModel_Version("2").click();

  // Click the Create LDAP Container Button
  await ob.createLDAPContainer_Button().click();

  // Wait for 2 seconds
  await page.waitForTimeout(2000);

  // Verify that the Org Browser Home Icon is visible
  const orgBrowserHomeIconVisible = await ob.orgBrowserHomeIcon().isVisible();
  expect(await orgBrowserHomeIconVisible).toBe(true);

  // Verify the Browse Organization Tab
  const browseOrgTabText = await ob.browseOrganization_Tab().textContent();
  expect(await browseOrgTabText).toContain("Browse organization");

  // Verify that the LDAP container is visible
  const ldapNameVisible = await ob.ldapName("DynamicOrg").isVisible();
  expect(await ldapNameVisible).toBe(true);
});

//Add and map Tony Pulis Resource
test("Add resource and Map Tony Pulis to the selected LDAP container", async () => {
  // Visit the URL
  await page.goto(TestData.ldapContainersurl);

  // Double-click on the LDAP container named "DynamicOrg"
  await ob.ldapName("DynamicOrg").dblclick();
  await page.waitForTimeout(2000);

  // Select the resource "Tony Pulis" (assuming this function is defined in OrgBrowserPage)
  await ob.selectResourceWithName("Tony Pulis");

  // Click the Add selected button
  await ob.addSelected_Button().click();

  // Assert the Add Resource Dialog contains the text "Add resource(s)"
  const addResourceDialogText = await ob.addResource_Dialog().textContent();
  expect(await addResourceDialogText).toContain("Add resource(s)");

  // Click the Create Resource button
  await ob.createResource_Button().click();

  // Wait for 2 seconds
  await page.waitForTimeout(2000);

  await ob.groups_Tab().click();

  await ob.org_Version_selector().click();

  await ob.org_Version(2).click();

  await ob.click_Toggle_Button_In_Front_Of("groups");

  await ob.select_Group_With_Name(TestData.TestGrpNameQA);

  await ob.map_Selected_Resource_Link().click();

  await ob.orgBrowserBack_Button().click();

  const browseText = await ob.browseOrganization_Tab().innerText();
  expect(await browseText).toContain("Browse organization");

  await expect(await ob.ldapName("DynamicOrg")).toBeVisible();
});

//Add and map tibco-admin Resource
test("Add resource and Map tibco-admin to the selected LDAP container", async () => {
  // Visit the URL
  await page.goto(TestData.ldapContainersurl);

  // Double-click on the LDAP container named "DynamicOrg"
  await ob.ldapName("System Admin").dblclick();
  await page.waitForTimeout(2000);

  await ob.selectResourceWithName("tibco-admin");

  await ob.org_Version_selector().click();

  await ob.org_Version(1).click();

  await ob.groups_Tab().click();

  await ob.click_Toggle_Button_In_Front_Of("groups");

  await ob.select_Group_With_Name(TestData.GrpNameTestMainGrp001);

  await ob.map_Selected_Resource_Link().click();

  await ob.orgBrowserBack_Button().click();

  const browseText = await ob.browseOrganization_Tab().innerText();
  expect(await browseText).toContain("Browse organization");

  await expect(await ob.ldapName("DynamicOrg")).toBeVisible();
});

//Add and map Clint Hill Resource
test("Add resource and Map Clint Hill to the selected LDAP container", async () => {
  // Visit the URL
  await page.goto(TestData.ldapContainersurl);

  // Double-click on the LDAP container named "DynamicOrg"
  await ob.ldapName("DynamicOrg").dblclick();
  await page.waitForTimeout(2000);

  // Select the resource "Tony Pulis" (assuming this function is defined in OrgBrowserPage)
  await ob.selectResourceWithName("Clint Hill");

  // Click the Add selected button
  await ob.addSelected_Button().click();

  // Assert the Add Resource Dialog contains the text "Add resource(s)"
  const addResourceDialogText = await ob.addResource_Dialog().textContent();
  expect(await addResourceDialogText).toContain("Add resource(s)");

  // Click the Create Resource button
  await ob.createResource_Button().click();

  // Wait for 2 seconds
  await page.waitForTimeout(2000);

  await ob.org_Version_selector().click();

  await ob.org_Version(1).click();

  await ob.groups_Tab().click();

  await ob.click_Toggle_Button_In_Front_Of("groups");

  await ob.select_Group_With_Name(TestData.GrpNameTestMainGrp001);

  await ob.map_Selected_Resource_Link().click();

  await ob.orgBrowserBack_Button().click();

  const browseText = await ob.browseOrganization_Tab().innerText();
  expect(await browseText).toContain("Browse organization");

  await expect(await ob.ldapName("DynamicOrg")).toBeVisible();
});

//Start Array001, Offer Set and Manual Adhoc Process in Process Manager
test("Start Array001, Offer Set and Manual Adhoc Process in Process Manager", async () => {
  // Navigate to the Process Manager page
  await page.goto(TestData.adminUrl);
  await adminPage.navigateToDeploymentManager();

  //Starting all the processes
  await adminPage.navigatetoProcessManager();
  await adminPage.startProcess(TestData.arrayPackageName);
  await adminPage.startProcess(TestData.offerSetfileName);
  await adminPage.startProcess(TestData.manualAdhocfileName);
  //end
});

test.describe("Worklist tests", () => {
  test("Login to Web Components and Verify UI elements of Worklist", async () => {
    await page.goto(TestData.workMangerUrl);
    await page.waitForLoadState("networkidle");
    // await page.reload({ waitUntil: "networkidle" });
    await (await wlPage.myWork()).click();
    //Check Refresh Button
    await wlPage.clickonRefreshButton();

    // Checking sort feature
    const lastNumberText = await (await wlPage.dataColumnId())
      .last()
      .textContent();
    const lastNumber = lastNumberText
      ? parseFloat(lastNumberText.trim())
      : null;

    // Sort by column name descending
    await wlPage.sortByColumnNameDescending("Id");
    await page.waitForTimeout(3000);

    const firstNumberText = await (await wlPage.dataColumnId())
      .first()
      .textContent();
    const firstNumber = firstNumberText
      ? parseFloat(firstNumberText.trim())
      : null;

    expect(lastNumber).toBe(firstNumber);

    // Selecting a particular column
    await wlPage.selectingParticularColumn("Process Instance Id");

    const appInstanceLocator = (await wlPage.dataColumnAppInstance()).first();
    await expect(appInstanceLocator).toBeVisible();

    // Filter by column name
    await wlPage.filterByColumnNameDropdown("state", "equal", "OFFERED");
    await page.waitForTimeout(3000);

    const stateCells = await wlPage.dataColumnState();
    const stateTexts = await stateCells.allTextContents();
    stateTexts.forEach((state) => {
      expect(state).toBe("Offered");
    });

    // Reset filter
    await wlPage.resetFilter();

    //Start Date Filter..................
    //Get current date and time
    let fieldValue: any = new Date();

    fieldValue =
      fieldValue.getFullYear().toString().padStart(4, "0") +
      "-" +
      (fieldValue.getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      fieldValue.getDate().toString().padStart(2, "0") +
      "T" +
      fieldValue.getHours().toString().padStart(2, "0") +
      ":" +
      (fieldValue.getMinutes() + 2).toString().padStart(2, "0");

    //Filter by start date
    await wlPage.filterByStartDate("startDate", "equal", fieldValue);
    await page.waitForTimeout(3000);

    // Verify that the table cell with 'id' does not exist
    expect(await wlPage.dataColumnId()).not.toBeVisible();

    await page.waitForTimeout(1000);

    // Reset filter
    await wlPage.resetFilter();

    //click Refresh Button
    await wlPage.clickonRefreshButton();

    //Change Theme Dark, Light or Test light:
    await wlPage.changeTheme("Light");
  });
});

test("Verify AutoRefresh of Worklist", async () => {
  await page.goto(TestData.workMangerUrl);
  await page.waitForLoadState("networkidle");
  await (await wlPage.myWork()).click();
  await page.waitForTimeout(1000);

  await (await wlPage.autoRefreshButton()).click();
  await page.waitForTimeout(1000);

  //Validate switchInput is "false"
  await (await wlPage.switchInputAutoRefresh()).click();
  await page.waitForTimeout(1000);

  const ariaChecked = await (
    await wlPage.verifySwitchInputAutoRefresh()
  ).getAttribute("aria-checked");
  expect(ariaChecked).toBe("true");

  await page.waitForTimeout(1000);

  // Validate switchInput is "true"
  // await (await wlPage.switchInputAutoRefresh()).click();

  // await page.waitForTimeout(1000);
  // const ariaChecked2 = await (
  //   await wlPage.verifySwitchInputAutoRefresh()
  // ).getAttribute("aria-checked");
  // expect(ariaChecked2).toBe("false");

  //Verify Refresh Interval Increases
  await (await wlPage.chevronupAutoRefresh()).click();
  await page.waitForTimeout(1000);
  const interval1 = await (await wlPage.verifyValueAutoRefresh()).inputValue();
  expect(interval1).toBe("31");

  await (await wlPage.chevrondownAutoRefresh()).click();
  await page.waitForTimeout(1000);
  const interval2 = await (await wlPage.verifyValueAutoRefresh()).inputValue();
  expect(interval2).toBe("30");

  await (await wlPage.futuresessionAutoRefresh()).click();

  await page.waitForTimeout(1000);
  // Validate aria-checked is "true"
  const ariaChecked3 = await (
    await wlPage.verifycheckboxAutoRefresh()
  ).getAttribute("aria-checked");
  expect(ariaChecked3).toBe("true");

  //Click on Apply Button
  await (await wlPage.applyButtonAutoRefresh()).click();

  await page.waitForTimeout(1000);

  //Again click on Auto-Refresh Button
  await (await wlPage.autoRefreshButton()).click();

  await page.waitForTimeout(1000);

  //Click on cancel Button
  await (await wlPage.cancelButtonAutoRefresh()).click();
});

test("Purge all Array001, Offer Set and Manual Adhoc Process Instances", async () => {
  await page.goto(TestData.adminUrl);
  await adminPage.navigateToDeploymentManager();

  //Purge oder sample order process
  await dmPage.purgeProcess(TestData.array001fileName);
  await dmPage.purgeProcess(TestData.offerSetfileName);
  await dmPage.purgeProcesswithProcessName(
    TestData.manualAdhocfileName,
    TestData.manualAdhocProcessName
  );
});

//AutoRepeat Code...................................................................
//Start New Array001 Process in Process Manager
test("Start New Array001 Process in Process Manager for AutoRepeat", async () => {
  // Navigate to the Process Manager page
  await page.goto(TestData.adminUrl);
  await page.waitForLoadState("networkidle");
  await adminPage.navigateToDeploymentManager();

  //Start aray001 process
  await adminPage.navigatetoProcessManager();
  await adminPage.startProcess(TestData.arrayPackageName);
  await adminPage.startProcess(TestData.offerSetfileName);
});

test("Functional Test AutoRepeat Work Item", async () => {
  // Visit the web component URL
  await page.goto(TestData.webcomponenturl);
  await page.waitForLoadState("networkidle");
  // Click on 'My Work' menu item
  await (await wlPage.myWork()).click();
  await page.waitForLoadState("networkidle");
  await page.locator("twc-table-row").first().waitFor();

  //Click on AutoRepeat Button to make it on
  await wlPage.clickonAutoRepeatButton();

  await page.waitForTimeout(2000);

  // Verify the first work item name
  const firstName = await (
    await wlPage.getWorkItemIdName("User1Step1")
  ).textContent();
  expect(await firstName).toBe("User1Step1");

  // Open Work Item
  await wlPage.openWorkItem(" abc", "User1Step1");

  await page.waitForTimeout(1000);

  //Verify User1Step1 Work Item opens
  await wlPage.verifyAutoRepeatWorkItem("ABC");

  //await wlPage.openWorkItem(" abc", "User1Step1");

  await page.waitForTimeout(1000);
  //Verify User1Step2 Work Item opens
  // Check the checkbox input value
  const checkboxValue = await (
    await wlPage.verifyArray001checkbox()
  ).inputValue();
  expect(await checkboxValue).toBe("on");

  // Check the text in the list item
  let listItemText = await (await wlPage.verifyArray001text()).textContent();

  if (listItemText)
    await wlPage.verifyTextArray001Function(listItemText, "abc");

  // Click the primary button
  await (await wlPage.array001SubmitButton()).click({ force: true });

  await page.waitForTimeout(1000);

  //Verify User1Step2 Work Item opens again
  // Check the checkbox input value
  const textareaValue = await (
    await wlPage.textReallocatetoSelf()
  ).inputValue();
  expect(await textareaValue).toBe("ABC");

  // Submit the form again
  await (await wlPage.array001SubmitButton()).click({ force: true });

  await page.waitForTimeout(1000);

  //Verify User6Step1 Work Item opens
  // Check the checkbox value again
  const checkboxValue3 = await (
    await wlPage.verifyArray001checkbox()
  ).inputValue();
  expect(await checkboxValue3).toBe("on");

  // Click on the primary button again
  await (await wlPage.array001SubmitButton()).click({ force: true });

  await page.waitForTimeout(1000);

  await wlPage.clickonRefreshButton();
  await page.waitForTimeout(1000);
  //Click on AutoRepeat Button to make it off
  await wlPage.clickonAutoRepeatButton();
  await page.waitForTimeout(2000);

  // Verify that the table cell with 'id' does not exist
  // expect(await wlPage.dataColumnId()).not.toBeVisible();
  await expect(await wlPage.getWorkItemIdName("User1Step1")).not.toBeVisible();
});

//.....................................................................................................

//Start New Array001 Process in Process Manager
test("Start New Array001 Process in Process Manager1", async () => {
  // Navigate to the Process Manager page
  await page.goto(TestData.adminUrl);
  await adminPage.navigateToDeploymentManager();

  //Start aray001 process
  await adminPage.navigatetoProcessManager();
  await adminPage.startProcess(TestData.arrayPackageName);
  //end
  const processInstanceIDLocator = adPrcoessInstacesPage.process_Instance_ID();
  const processInstanceIDText = await processInstanceIDLocator.textContent(); // Replace with actual selector

  // Trim the text and store id
  instanceID1 = processInstanceIDText?.trim();
});

test("Functional Test Change Priority Absolute", async () => {
  // Navigate to the web component URL
  await page.goto(TestData.workMangerUrl);

  // Click the "My Work" navigation menu item
  await (await wlPage.myWork()).click();
  await page.waitForLoadState("networkidle");

  // Positive Scenario for Absolute Priority
  const stateCell = await wlPage.getWorkItemState("User1Step1");
  const stateText = await stateCell.textContent();
  expect(["Allocated", "Offered"]).toContain(stateText?.trim());
  await page.waitForTimeout(1000);
  // Change priority to an absolute value
  await wlPage.changePriorityWorkItemAbsolute(40, "User1Step1");
  await wlPage.saveBtnChangePriority();

  // Assert the priority change
  const priorityCell = (await wlPage.getWorkItemPriority("User1Step1")).first();
  await expect(await priorityCell).toHaveText("40");

  // Negative Scenario for Absolute Priority
  const stateTextNegative = await stateCell.textContent();
  expect(["Allocated", "Pended", "Offered"]).toContain(
    stateTextNegative?.trim()
  );

  // Attempt to change priority with an invalid value
  await wlPage.changePriorityWorkItemAbsolute(110, "User1Step1");

  // Assert that the save button is disabled
  expect(await wlPage.saveButton()).toBeDisabled();

  // Assert the error message
  const errorMsgLocator = await wlPage.priorityErrorMsg();
  const errorMsgText = await errorMsgLocator.textContent();
  expect(errorMsgText?.trim()).toBe(
    "Valid priority value is between 0 to 100."
  );
});

test("Functional Test Change Priority Offset", async () => {
  // Navigate to the web component URL
  await page.goto(TestData.webcomponenturl);

  // Click the "My Work" navigation menu item
  await (await wlPage.myWork()).click();

  // Assert the page title
  await expect(page).toHaveTitle("TIBCO BPM");

  // Positive Scenario for Offset Priority
  const stateCell = await wlPage.getWorkItemState("User1Step1");
  const stateText = await stateCell.textContent();
  expect(["Allocated", "Pended", "Offered"]).toContain(stateText?.trim());

  let offsetvalue: number = 10;
  let UIpriorityvalue: string, id: string, finalPriorityvalue: number;

  const tableCell1 = await wlPage.getWorkItemPriority("User1Step1");
  const text1 = await tableCell1.first().textContent();
  UIpriorityvalue = text1 ? text1.trim() : ""; // Handle null or undefined text content
  finalPriorityvalue = offsetvalue + parseInt(UIpriorityvalue);

  const tableCell = await wlPage.getWorkItemId("User1Step1");
  const text = await tableCell.first().textContent();
  id = text ? text.trim() : "";

  // Change priority to an offset value
  await wlPage.changePriorityWorkItemOffset(offsetvalue, "User1Step1");
  await wlPage.saveBtnChangePriority();

  // Assert the priority change
  const tableCells = await wlPage.getWorkItemId("User1Step1");
  const priorityCells = await wlPage.getWorkItemPriority("User1Step1");

  await page.waitForTimeout(2000);

  const count = await tableCells.count();
  for (let index = 0; index < count; index++) {
    // Get the UI ID from the 'id' column
    const uiID = await tableCells.nth(index).textContent();
    if (uiID && uiID.trim().includes(id)) {
      // Get the corresponding 'priority' column for the same index
      const uiPriorityText = await priorityCells.nth(index).textContent();
      const uiPriority = uiPriorityText ? parseInt(uiPriorityText) : NaN;

      // Assertion: Check if the priority matches the finalPriorityvalue
      expect(uiPriority).toBe(finalPriorityvalue);
    }
  }

  // Negative Scenario for Absolute Priority
  const stateTextNegative = await stateCell.textContent();
  expect(["Allocated", "Pended", "Offered"]).toContain(
    stateTextNegative?.trim()
  );

  // Attempt to change priority with an invalid value
  await wlPage.changePriorityWorkItemOffset(110, "User1Step1");

  // Assert that the save button is disabled
  expect(await wlPage.saveButton()).toBeDisabled();

  // Assert the error message
  const errorMsgLocator = await wlPage.priorityErrorMsg();
  const errorMsgText = await errorMsgLocator.textContent();
  expect(errorMsgText?.trim()).toBe(
    "Valid priority value is between 0 to 100."
  );
});

test("Functional Test Pend Work Item Date", async () => {
  test.setTimeout(300000);
  await page.goto(TestData.webcomponenturl);

  // Navigate to "My Work" in the navigation menu
  await (await wlPage.myWork()).click();

  // Verify the page title
  const title = await page.title();
  expect(title).toBe("TIBCO BPM");

  // Check the text of the first 'state' column
  const stateCell = await wlPage.getWorkItemState("User1Step1");
  const stateText = await stateCell.textContent();
  expect(stateText?.trim()).toBe("Allocated");

  // Get the ID from the first row of the 'id' column
  const id1 = await (await wlPage.getWorkItemId("User1Step1")).textContent();

  // Calculate the date
  const currentDate = new Date();
  currentDate.setHours(currentDate.getHours() + 5);
  currentDate.setMinutes(currentDate.getMinutes() + 32);
  const formattedDate = currentDate.toISOString().slice(0, 16);

  // Call your custom function to set the Pend Work Item Date
  await wlPage.pendWorkItemDate(formattedDate, "User1Step1");

  // // Wait for the required amount of time
  await page.waitForTimeout(150000); // Equivalent to cy.wait(150000)

  // Simulate clicking the refresh button
  await wlPage.clickonRefreshButton();

  await page.waitForTimeout(2000); // Equivalent to cy.wait(2000)

  await wlPage.clickonRefreshButton();

  // Get the new ID after refreshing
  const id2 = await (await wlPage.getWorkItemId("User1Step1")).textContent();

  // Assert that the first ID is the same after the refresh
  // console.log(id1)
  // console.log(id2)
  expect(await id1).toBe(await id2);
});

test("Functional Test Pend Work Item Time Offset", async () => {
  test.setTimeout(300000);

  // Visit the web component URL
  await page.goto(TestData.webcomponenturl);

  // Click on 'My Work' menu item
  await (await wlPage.myWork()).click();

  // Verify the page title
  const title = await page.title();
  expect(title).toBe("TIBCO BPM");

  const rowName = wlPage.getWorkItemName("User1Step1");

  // Get the ID of the first row and store it as 'id1'
  const id1 = (await wlPage.getWorkItemId("User1Step1")).textContent();

  // Call the pendWorkItemTimeOffset function
  await wlPage.pendWorkItemTimeOffset("User1Step1");

  // Wait for 1.5 minutes
  await page.waitForTimeout(150000);

  // Click the refresh button
  await wlPage.clickonRefreshButton();

  // Wait for the page to refresh
  await page.waitForTimeout(2000);

  await wlPage.clickonRefreshButton();
  // Get the ID of the first row again and store it as 'id2'
  const id2 = (await wlPage.getWorkItemId("User1Step1")).textContent();

  // Assert that the ID hasn't changed
  expect(await id1).toBe(await id2);
});

test("Functional Test Open Work Item", async () => {
  // Visit the web component URL
  await page.goto(TestData.webcomponenturl);

  // Click on 'My Work' menu item
  await (await wlPage.myWork()).click();

  // Verify the first work item name
  const firstName = await (
    await wlPage.getWorkItemIdName("User1Step1")
  ).textContent();
  expect(await firstName).toBe("User1Step1");

  // Open Work Item
  await wlPage.openWorkItem(" abc", "User1Step1");

  // Click on Refresh Button (Assumed to be a custom method)
  await wlPage.clickonRefreshButton();

  // Verify the name after refresh
  const updatedFirstName = (
    await wlPage.getWorkItemIdName("User1Step2")
  ).textContent();
  expect(await updatedFirstName).toBe("User1Step2");

  // Click on the first Open button
  await wlPage.openWorklist("User1Step2");
  //(await wlPage.openButton()).first().click({ force: true });

  // Check the checkbox input value
  const checkboxValue = (await wlPage.verifyArray001checkbox()).inputValue();
  expect(await checkboxValue).toBe("on");

  // Check the text in the list item
  const listItemText = await (await wlPage.verifyArray001text()).textContent();

  if (listItemText)
    await wlPage.verifyTextArray001Function(listItemText, "abc");

  // Click the primary button
  await (await wlPage.array001SubmitButton()).click({ force: true });

  // Click on the Refresh button again
  await wlPage.clickonRefreshButton();

  // Verify the new name after refresh
  const finalFirstName = await (await wlPage.dataColumnName())
    .first()
    .textContent();
  expect(await finalFirstName).toBe("User6Step1");

  // Click the Open button again
  await wlPage.openWorklist("User6Step1");

  // Check the checkbox value again
  const checkboxValue2 = (await wlPage.verifyArray001checkbox()).inputValue();
  expect(await checkboxValue2).toBe("on");

  // Click on the primary button again
  await (await wlPage.array001SubmitButton()).click({ force: true });

  // Click on the Refresh button again
  await wlPage.clickonRefreshButton();

  // Verify that the table cell with 'id' does not exist
  expect(await wlPage.dataColumnId()).not.toBeVisible();
});

//Start New Array001 Process in Process Manager
test("Start New Array001 Process in Process Manager2", async () => {
  // Navigate to the Process Manager page
  await page.goto(TestData.adminUrl);
  await page.waitForLoadState("networkidle");
  await adminPage.navigateToDeploymentManager();

  //Start aray001 process
  await adminPage.navigatetoProcessManager();
  await adminPage.startProcess(TestData.arrayPackageName);
  //end

  const processInstanceIDLocator = adPrcoessInstacesPage.process_Instance_ID();
  const processInstanceIDText = await processInstanceIDLocator.textContent(); // Replace with actual selector

  // Trim the text and store id
  instanceID2 = processInstanceIDText?.trim();
});

test("Functional Test Reallocate to World", async () => {
  test.setTimeout(85000);
  await page.goto(TestData.webcomponenturl);
  await page.waitForLoadState("networkidle");

  // Navigate to "My Work"
  await page.click('twc-navmenu-item[tooltipcontent="My Work"]');
  await page.waitForTimeout(1000);

  // Check the first "state" cell is "Allocated"
  const stateCell = await wlPage.getWorkItemState("User1Step1");
  const stateText = await stateCell.textContent();
  expect.soft(stateText?.trim()).toBe("Allocated");

  // Check the first "name" cell is "User1Step1"
  const nameText = await (
    await wlPage.getWorkItemIdName("User1Step1")
  ).textContent();
  expect.soft(nameText).toBe("User1Step1");

  // Call ReallocatetoWorld function
  await wlPage.reallocatetoWorld(2, "QA", "Tony Pulis", "User1Step1");

  // Click on the Refresh button
  await wlPage.clickonRefreshButton();
  await page.waitForTimeout(1000);
  expect.soft(await wlPage.dataColumnId()).not.toBeVisible(); // Ensure element no longer exists

  // Sign out
  await wlPage.signOutButton();

  // Login with new credentials
  await loginPage.login(TestData.username2, TestData.password2);
  await page.waitForLoadState("networkidle");
  // Navigate to "My Work"
  await (await wlPage.myWork()).click();

  // Check first "name" cell is "User1Step1"
  const nameText2 = await (
    await wlPage.getWorkItemIdName("User1Step1")
  ).textContent();
  expect.soft(nameText2).toBe("User1Step1");

  // Open Work Item
  await wlPage.openWorkItem(" abc", "User1Step1");

  // Click on the Refresh button
  await wlPage.clickonRefreshButton();
  await page.waitForTimeout(1000);
  expect.soft(await wlPage.dataColumnId()).not.toBeVisible(); // Ensure element no longer exists
  await page.reload({ waitUntil: "networkidle" });
  // Sign out
  await wlPage.signOutButton();

  // Login with tibco credentials again
  await loginPage.login(TestData.username1, TestData.password1);
  await page.waitForLoadState("networkidle");
  // Navigate to "My Work"
  await (await wlPage.myWork()).click();
  await page.waitForTimeout(1000);
  // Check first "name" cell is "User1Step2"
  const nameText3 = await (
    await wlPage.getWorkItemIdName("User1Step2")
  ).textContent();
  expect(nameText3).toBe("User1Step2");

  // Click the Open button again
  await wlPage.openWorklist("User1Step2");
  //(await wlPage.openButton()).first().click({ force: true });

  // Verify checkbox is checked
  const checkbox = await wlPage.verifyArray001checkbox();
  expect(await checkbox.getAttribute("value")).toBe("on");

  // Verify list item text is "abc"
  const listItemText = await (await wlPage.verifyArray001text()).textContent();

  if (listItemText)
    await wlPage.verifyTextArray001Function(listItemText, "abc");
  await page.waitForTimeout(1000);
  // Click primary button to continue
  await (await wlPage.array001SubmitButton()).click({ force: true });

  // Click on the Refresh button
  await wlPage.clickonRefreshButton(); // Adjust this selector if needed

  // Check first "name" cell is "User1Step1"
  const nameText4 = await (
    await wlPage.getWorkItemIdName("User6Step1")
  ).textContent();
  expect(nameText4).toBe("User6Step1");

  // Open the next work item
  await wlPage.openWorklist("User6Step1");
  //(await wlPage.openButton()).first().click({ force: true });

  // Verify checkbox is checked again
  const checkbox2 = await wlPage.verifyArray001checkbox();
  expect(await checkbox2.getAttribute("value")).toBe("on");

  // Click primary button to continue
  await (await wlPage.array001SubmitButton()).click({ force: true });

  // Click on the Refresh button
  await wlPage.clickonRefreshButton();
  await expect(await wlPage.dataColumnId()).not.toBeVisible(); // Ensure element no longer exists
});

//Start New Array001 Process in Process Manager
test("Start New Array001 Process in Process Manager3", async () => {
  // Login with tibco credentials again
  await page.goto(TestData.adminUrl);
  await page.waitForLoadState("networkidle");
  await adminPage.navigateToDeploymentManager();

  //Start aray001 process
  await adminPage.navigatetoProcessManager();
  await adminPage.startProcess(TestData.arrayPackageName);
  //end
});

test("Functional Test ReOffer Work Item", async () => {
  // Visit the web component URL
  await page.goto(TestData.webcomponenturl);
  await page.waitForLoadState("networkidle");
  // Click on the My Work menu item
  await (await wlPage.myWork()).click();

  // Wait for the page title to be correct
  const title = await page.title();
  expect(title).toBe("TIBCO BPM");

  // Verify the first row's state value is either "Allocated" or "Pended"
  const stateCell = await wlPage.getWorkItemState("User1Step1");
  const stateText = await stateCell.textContent();
  expect(["Allocated", "Pended"]).toContain(stateText?.trim());

  // Call the function to ReOffer the Work Item
  await wlPage.reOfferWorkItem("User1Step1");

  // Wait for some time to let elements load
  await page.waitForTimeout(3000);

  // Verify that the first row's state text has changed to "Offered"
  const newStateText = await (
    await wlPage.getWorkItemState("User1Step1")
  ).textContent();
  expect(newStateText).toBe("Offered");
});

test("Functional Test Open Next Work Item", async () => {
  // Visit the web component URL
  await page.goto(TestData.webcomponenturl);
  await page.waitForLoadState("networkidle");
  // Click on 'My Work' menu item
  await (await wlPage.myWork()).click();

  // Wait for page title and verify it
  const title = await page.title();
  expect(title).toBe("TIBCO BPM");

  // Verify the first work item name
  const firstName = await (
    await wlPage.getWorkItemIdName("User1Step1")
  ).textContent();
  expect(firstName).toBe("User1Step1");

  // Open Next Work Item
  await wlPage.openNextWorkItem(" abc", "User1Step1");
  await page.waitForTimeout(1000);
  // Click on Refresh Button (Assumed to be a custom method)
  await wlPage.clickonRefreshButton();

  // Verify the name after refresh
  const updatedFirstName = (
    await wlPage.getWorkItemIdName("User1Step2")
  ).textContent();
  expect(await updatedFirstName).toBe("User1Step2");
});

test("Functional Test Skip Work Item", async () => {
  // Visit the web component URL
  await page.goto(TestData.webcomponenturl);
  await page.waitForLoadState("networkidle");
  // Click on the "My Work" menu item
  await (await wlPage.myWork()).click();

  // Wait for the page to load and for title to be correct
  const title = await page.title();
  expect(title).toBe("TIBCO BPM");

  // Check if the state of the first item is "Allocated"
  const statecell = await wlPage.getWorkItemState("User1Step2");
  const stateText = await statecell.textContent();
  await page.waitForTimeout(1000);
  expect.soft(stateText).toBe("Allocated");

  // Get the ID of the first work item
  const id = await (await wlPage.getWorkItemId("User1Step2")).textContent();

  // Call the function to skip the work item
  await wlPage.skipWorkItem("User1Step2");

  // Wait for some time to let elements load
  await page.waitForTimeout(3000);

  // Verify that the first item name has changed to "User6Step1"
  const newNameText = (
    await wlPage.getWorkItemIdName("User6Step1")
  ).textContent();
  expect(await newNameText).toBe("User6Step1");
});

//Here verify array 001 processes are completed
test("Launch Work Manager, navigate to Process Audit and verify that Array001 Instances are completed", async () => {
  await page.goto(TestData.workMangerUrl);
  await page.waitForLoadState("networkidle");
  await adPage.navigateToAudit();
  await adPage.clickOnProcessInstance();
  // Verify that Process Instance 1 and 2 states are "COMPLETED"

  await page.waitForTimeout(3000);
  const processInstanceState1Locator =
    adPrcoessInstacesPage.processInstanceState(instanceID1);
  await expect(processInstanceState1Locator).toHaveText("COMPLETED");

  const processInstanceState2Locator =
    adPrcoessInstacesPage.processInstanceState(instanceID2);
  await expect(processInstanceState2Locator).toHaveText("COMPLETED");
});

test("Purge all Array001 Process Instances", async () => {
  await page.goto(TestData.adminUrl);
  await page.waitForLoadState("networkidle");
  await adminPage.navigateToDeploymentManager();

  //Purge all array001 process
  await dmPage.purgeProcess(TestData.array001fileName);
});

//Start Offer Set Process in Process Manager
test("Start Offer Set Process in Process Manager", async () => {
  // Navigate to the Process Manager page
  await page.goto(TestData.adminUrl);
  await adminPage.navigateToDeploymentManager();

  //Start aray001 process
  await adminPage.navigatetoProcessManager();
  await adminPage.startProcess(TestData.offerSetfileName);
  //end
  const processInstanceIDLocator = adPrcoessInstacesPage.process_Instance_ID();
  const processInstanceIDText = await processInstanceIDLocator.textContent(); // Replace with actual selector

  // Trim the text and store id
  instanceID3 = processInstanceIDText?.trim();
});

test("Functional Test Allocate to Self", async () => {
  // Visit the web component URL
  await page.goto(TestData.webcomponenturl);

  // Click on the "My Work" menu item
  (await wlPage.myWork()).click();

  // Wait for the page to load and for title to be correct
  const title = await page.title();
  expect(title).toBe("TIBCO BPM");

  // Check if the state of the first item is "Offered"
  const stateCell = await wlPage.getWorkItemState("ReallocateOfferSetUT1");
  const stateText = await stateCell.textContent();
  expect(stateText?.trim()).toBe("Offered");

  // Call the function to Allocate the work item
  await wlPage.allocatetoSelf("ReallocateOfferSetUT1");

  // Wait for some time to let elements load
  await page.waitForTimeout(2000);

  // Verify that the first item name has changed to "Allocated"
  const stateText2 = (
    await wlPage.getWorkItemState("ReallocateOfferSetUT1")
  ).textContent();
  expect(await stateText2).toBe("Allocated");
});

test("Functional Test Reallocate to OfferSet", async () => {
  // Visit the web component URL
  await page.goto(TestData.webcomponenturl);

  // Click on the "My Work" menu item
  (await wlPage.myWork()).click();

  // Wait for the page to load and for title to be correct
  const title = await page.title();
  expect(title).toBe("TIBCO BPM");

  // Verify the state of the first work item is "Allocated"
  const stateCell = await wlPage.getWorkItemState("ReallocateOfferSetUT1");
  const stateText = await stateCell.textContent();
  expect(stateText?.trim()).toBe("Allocated");

  // Verify the name of the first work item
  const nameText = (
    await wlPage.getWorkItemIdName("ReallocateOfferSetUT1")
  ).textContent();
  expect(await nameText).toBe("ReallocateOfferSetUT1");

  // Call the Reallocate to OfferSet function (implement the actual function as per your app's logic)
  await wlPage.reallocatetoOfferSet("Clint Hill", "ReallocateOfferSetUT1");

  //Click on refresh button
  await wlPage.clickonRefreshButton();
  await page.waitForTimeout(1000);
  // Ensure that the work item with the old ID is no longer present
  await expect(await wlPage.dataColumnId()).not.toBeVisible();
  await page.reload({ waitUntil: "networkidle" });
  // Sign out by clicking the user profile and then the sign-out link
  await wlPage.signOutButton();

  // Log in again using different credentials
  await loginPage.login(TestData.username3, TestData.password2);

  // Reload the page
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForTimeout(1000);
  // Click on the "My Work" menu item again after reloading
  await (await wlPage.myWork()).click();

  // Verify the name of the first work item again
  const newNameText = (await wlPage.getWorkItemIdName("ReallocateOfferSetUT1"))
    .first()
    .textContent();
  expect(await newNameText).toBe("ReallocateOfferSetUT1");

  // Open the work item and add text to the textarea
  await wlPage.openWorklist("ReallocateOfferSetUT1");
  //(await wlPage.openButton()).first().click({ force: true });

  await (await wlPage.textReallocatetoSelf()).fill("ABC", { force: true });

  // Submit the form
  await (await wlPage.array001SubmitButton()).click({ force: true });

  // Click refresh button
  await wlPage.clickonRefreshButton();

  // Verify that the name has changed to "ReallocateOfferSetUT2"
  const updatedNameText = await (
    await wlPage.getWorkItemIdName("ReallocateOfferSetUT2")
  ).textContent();
  expect(await updatedNameText).toBe("ReallocateOfferSetUT2");

  // Open the work item again and verify that the textarea contains the value "ABC"
  await wlPage.openWorklist("ReallocateOfferSetUT2");
  //(await wlPage.openButton()).first().click({ force: true });

  const textareaValue = await (
    await wlPage.textReallocatetoSelf()
  ).inputValue();
  expect(await textareaValue).toBe("ABC");

  // Submit the form again
  await (await wlPage.array001SubmitButton()).click({ force: true });

  // Click refresh button again
  await wlPage.clickonRefreshButton(); // Placeholder for the refresh button locator
  await page.waitForTimeout(1000);
  // Ensure that the work item with the ID no longer exists
  await expect(await wlPage.dataColumnId()).not.toBeVisible();
  await page.reload({ waitUntil: "networkidle" });
  // Sign out
  await wlPage.signOutButton();
  await page.waitForTimeout(3000);

  // Login with tibco credentials again
  await loginPage.login(TestData.username1, TestData.password1);
});

//Verify Offer Set processes are completed here
test("Launch Work Manager, navigate to Process Audit and verify that OfferSet Instances are completed", async () => {
  await page.goto(TestData.workMangerUrl);
  await adPage.navigateToAudit();
  await adPage.clickOnProcessInstance();
  // Verify that Process Instance 1 and 2 states are "COMPLETED"
  const processInstanceState1Locator =
    adPrcoessInstacesPage.processInstanceState(instanceID3);
  //await expect(processInstanceState1Locator).toHaveText('COMPLETED');
});

//Start Manual Adhoc Process in Process Manager
test("Start Manual Adhoc Process in Process Manager", async () => {
  // Navigate to the Process Manager page
  await page.goto(TestData.adminUrl);
  await adminPage.navigateToDeploymentManager();

  //Start aray001 process
  await adminPage.navigatetoProcessManager();
  await adminPage.startProcess(TestData.manualAdhocfileName);
  //end
});

test("Functional Test Show Ad-hoc Tasks", async () => {
  // Navigate to the web component URL
  await page.goto(TestData.webcomponenturl);

  // Click on "My Work" from the navigation menu
  (await wlPage.myWork()).click();

  // Check the page title
  await expect(page).toHaveTitle("TIBCO BPM");
  await page.waitForTimeout(2000);

  // Verify the state of the first item
  const stateCell = await wlPage.getWorkItemState("AdhocTasksEnabled");
  const stateText = await stateCell.textContent();
  expect(["Offered", "Opened"]).toContain(stateText?.trim());

  // Verify the name of the first item
  const name = (
    await wlPage.getWorkItemIdName("AdhocTasksEnabled")
  ).textContent();
  expect(await name).toBe("AdhocTasksEnabled");

  // Start the ad-hoc task
  await wlPage.showAdhocTasksStart(
    "ManualAdhocNonRepeatable",
    "AdhocTasksEnabled"
  );

  // Click on the refresh button
  await wlPage.clickonRefreshButton();

  // Verify that the task "ManualAdhocNonRepeatable" appears
  await page.waitForTimeout(2000);
  const updatedTaskName = (await wlPage.dataColumnName()).allTextContents();
  expect(await updatedTaskName).toContain("ManualAdhocNonRepeatable");

  // Cancel the ad-hoc task
  await wlPage.showAdhocTasksCancel(
    "ManualAdhocNonRepeatable",
    "AdhocTasksEnabled"
  );

  // Click on the refresh button
  await wlPage.clickonRefreshButton();

  // Verify that the task "ManualAdhocNonRepeatable" no longer exists
  const updatedTaskNames = (await wlPage.dataColumnName()).allTextContents();
  expect(await updatedTaskNames).not.toContain("ManualAdhocNonRepeatable");
});

//Purge all Manual Adhoc Process Instances
test("Purge all Manual Adhoc Process Instances", async () => {
  await page.goto(TestData.adminUrl);
  await adminPage.navigateToDeploymentManager();

  //Purge all array001 process
  await dmPage.purgeProcesswithProcessName(
    TestData.manualAdhocfileName,
    TestData.manualAdhocProcessName
  );
});

test("Delete Ldap container", async () => {
  // Assuming `ob` functions are adapted for Playwright.

  await page.goto(TestData.orgbrowserurl);

  ob.view_Manage_GoBtn("Manage LDAP containers").click();

  (await ob.ldap_more_Btn("DynamicOrg")).click();

  await ob.ldap_options("Delete").click();

  // Verify dialogue title
  const dialogueTitle = ob.ldap_dialogue_title();
  await expect(dialogueTitle).toContainText("confirm");

  // Verify dialogue message
  const dialogueMsg = ob.ldap_dialogue_msg();
  await expect(dialogueMsg).toContainText(
    "Would you like to delete LDAP Container?"
  );

  // Verify visibility of "Cancel" and "Confirm" buttons
  const cancelButton = ob.ldap_dialogue_Btns("Cancel");
  const confirmButton = ob.ldap_dialogue_Btns("Confirm");

  await expect(cancelButton).toBeVisible();
  await expect(confirmButton).toBeVisible();

  // Click "Confirm" button to proceed with deletion
  await confirmButton.click();
});

test("Undeploy all Projects", async () => {
  await page.goto(TestData.adminUrl);
  await adminPage.navigateToDeploymentManager();

  //Undeploying projects
  await dmPage.undeployFiles(TestData.array001fileName);
  await dmPage.undeployFiles(TestData.offerSetfileName);
  await dmPage.undeployFiles(TestData.manualAdhocfileName);
  await dmPage.undeployFiles(TestData.orgNewfileName);
  await dmPage.undeployFiles(TestData.orgModelPart1ACEfileName);
  await dmPage.undeployFiles(TestData.simpleOrgModelfileName);
  await dmPage.undeployFiles(TestData.simpleBDSfileName);
});
