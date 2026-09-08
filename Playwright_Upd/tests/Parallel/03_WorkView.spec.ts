import { test, expect, request, Page, chromium } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { ProcessPage } from "../../PageObjects/ProcessPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { HomePage } from "../../PageObjects/HomePage";
import { OrgBrowserPage } from "../../PageObjects/OrgBrowserPage";
import { WorkViewsPage } from "../../PageObjects/WorkViewsPage";

//Json->string->js object
const TestData = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let cmPage: CaseManagerPage;
let homePage: HomePage;
let wv: WorkViewsPage;
let ob: OrgBrowserPage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  wv = poManager.getWorkViewsPage();
  ob = poManager.getOrgBrowserPage();
  cmPage = poManager.getCaseManagerPage();
  homePage = poManager.getHomePage();
});

test.describe("Pre requisite Deployments", () => {
  test("Pre requisite deployments for Work Views", async () => {
    await page.goto(TestData.adminUrl);
    await adminPage.navigateToDeploymentManager();

    //Deploy Org Model Version 2
    await dmPage.deployRascFiles(TestData.OrgName, TestData.OrgRasc);
    const status = await dmPage.getAppStatus(TestData.OrgName);
    const type = await dmPage.getAppType(TestData.OrgName);
    expect(status).toHaveText(/Deployed/);
    expect(await type.innerText()).toBe("Organization");
  });

  test("Create the new LDAP container", async () => {
    // Visit the URL
    await page.goto(TestData.orgbrowserurl);

    // Wait for the welcome title to appear
    await page.waitForLoadState("domcontentloaded");
    //await page.waitForSelector("text=Welcome to the Org Browser");

    // Click the Go Button
    await ob.goButton().first().click();

    // Verify the Create Container Page Header
    const createContainerHeader = await ob
      .createContainer_PageHeader()
      .first()
      .textContent();
    expect(createContainerHeader).toContain("Create container");

    // Type in the container name and description
    await ob.containerCreation_Name().fill("DynamicOrg");
    await ob.containerCreation_Description().fill("DynamicOrg_Test");

    // Click Next Button
    await ob.containerCreation_NextButton().first().click();

    // Verify the Choose LDAP Source Page Header
    const chooseLDAPSourceHeader = await ob
      .chooseLDAPSource_PageHeader()
      .nth(1)
      .textContent();
    expect(chooseLDAPSourceHeader).toContain("Choose LDAP source");

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
    expect(mapResourceHeader).toContain("Map resource attributes");

    // Select the Organization Model Version
    await ob.orgModel_VersionList().click();
    await ob.selectOrgModel_Version("2").click();

    // Click the Create LDAP Container Button
    await ob.createLDAPContainer_Button().click();

    // Wait for 2 seconds
    await page.waitForTimeout(2000);

    // Verify that the Org Browser Home Icon is visible
    const orgBrowserHomeIconVisible = await ob.orgBrowserHomeIcon().isVisible();
    expect(orgBrowserHomeIconVisible).toBe(true);

    // Verify the Browse Organization Tab
    const browseOrgTabText = await ob.browseOrganization_Tab().textContent();
    expect(browseOrgTabText).toContain("Browse organization");

    // Verify that the LDAP container is visible
    const ldapNameVisible = await ob.ldapName("DynamicOrg").isVisible();
    expect(ldapNameVisible).toBe(true);
  });

  //Add and map Richard Cresswell Resource
  test("Add resource and Map Tony Pulis to the selected LDAP container", async () => {
    // Visit the URL
    await page.goto(TestData.ldapContainersurl);

    // Double-click on the LDAP container named "DynamicOrg"
    await ob.ldapName("DynamicOrg").dblclick();
    await page.waitForTimeout(2000);

    // Select the resource "Richard Cresswell" (assuming this function is defined in OrgBrowserPage)
    await ob.selectResourceWithName("Richard Cresswell");

    // Click the Add selected button
    await ob.addSelected_Button().click();
    await page.waitForTimeout(2000);

    // Click the Create Resource button
    await ob.createResource_Button().click();

    // Wait for 2 seconds
    await page.waitForTimeout(2000);

    await ob.groups_Tab().click();
    await ob.org_Version_selector().click();
    await ob.org_Version(2).click();
    await ob.click_Toggle_Button_In_Front_Of("groups");
    await ob.select_Group_With_Name("QA");
    await ob.map_Selected_Resource_Link().click();
    await ob.orgBrowserBack_Button().click();

    const browseText = await ob.browseOrganization_Tab().innerText();
    expect(browseText).toContain("Browse organization");
    await expect(ob.ldapName("DynamicOrg")).toBeVisible();
  });
});

test.describe("Work views Regression Suite", () => {
  test.beforeEach(async () => {
    // Navigate to the WebComponent URL
    await page.goto(TestData.workMangerUrlApp);
    await page.waitForLoadState("networkidle");
    await homePage.clickOnBuisnessService();
    await cmPage.selectServerFromGlobalSwitcher(TestData.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
    // Navigate to Work Views
    await wv.navigateToWorkViews();
  });

  test("Create Work View", async () => {
    // Create Work View
    await wv.clickCreateWorkView();

    // Enter Work View details
    await wv.workViewDetails(TestData.workView.name, TestData.workView.desc);
    await wv.workViewMakePublic();

    // Proceed to the next step
    await wv.workViewNextButton();

    // Version selection and User selection
    await page.waitForTimeout(1000);
    await wv.selectVersionForTarget("2");
    await wv.selectedUserInTarget(TestData.workView.targetUser);
    await wv.workViewNextButton();

    // Add column and continue
    await wv.addColumn("Application name");
    await wv.workViewNextButton();

    // Add rule and continue
    await wv.addFilterRule(TestData.workView.filterId);
    await wv.workViewNextButton();

    // Sort columns and continue
    await wv.addColumnSortTab("Application name");
    await wv.workViewNextButton();

    // Select User in Users Tab
    await wv.selectUserInUsersTab("0");
    await wv.workViewNextButton();

    // Select User in Authors Tab
    await wv.selectUserInAuthorsTab("0");
    await wv.workViewNextButton();

    // Summary Step
    await wv.verifyNameAndDescOnSummary(
      TestData.workView.name,
      TestData.workView.desc
    );
    await wv.verifyMakeThisPublic(TestData.workView.makeViewPublic);
    await wv.verifyTargetOnSummary(TestData.workView.targetUser);
    await wv.verifyTypeOfWorkItemOnSummary("Offered");
    await wv.verifyFilterOnSummary("id equal " + TestData.workView.filterId);
    await wv.verifySortOnSummary("appNameasc");
    // await wv.verifyColumnsOnSummary(TestData.workView.columns);
    await wv.verifyUsersOnSummary(TestData.workView.users);
    await wv.verifyAuthorsOnSummary(TestData.workView.authors);

    // Final step: Create the WorkView
    await wv.clickOnCreateButton();
    await page.waitForTimeout(1000);
    await expect
      .soft(wv.verifyCreatedWorkVIew(TestData.workView.name))
      .toBeVisible();
  });

  test("Test Work view sort and filter", async () => {
    // Work view sort
    await wv.wvSortIcon.click();
    expect(await wv.wvSortHeaderVerification()).toBe("Work view sort");

    await wv.verifyWorkViewSort("creation");
    expect(await wv.getWorkViewName()).toBe(TestData.workView.name);

    // Work view filter
    await wv.wvFilterIcon.click();
    expect(await wv.wvFilterHeaderVerification()).toBe("Work view filter");
    await wv.workViewFilter(TestData.workView.name);
    expect.soft(await wv.getWorkViewName()).toBe(TestData.workView.name);
  });

  test("Work view dropdown test", async () => {
    // Select the type of work view dropdown: Editable, Public, My work
    await wv.clickOnWorkViewDropdown("Public");
    // Verify public work view exists
    await expect
      .soft(wv.verifyCreatedWorkVIew(TestData.workView.name))
      .toBeVisible();
  });

  test("Delete Work view functionality", async () => {
    // Select the type of work view dropdown: Editable, Public, My work
    await wv.clickOnWorkViewDropdown("Editable");

    // Click on delete work view functionality
    await wv.clickOnDelete(TestData.workView.name);
    await wv.verifyDeleteHeader();
    await wv.clickOnYesButton();
    await expect
      .soft(wv.verifyCreatedWorkVIew(TestData.workView.name))
      .not.toBeVisible();
  });
});

test.describe("Work view Tear down", () => {
  test("Delete Ldap container", async () => {
    await page.goto(TestData.ldapContainersurl);
    //await ob.View_Manage_GoBtn("Manage LDAP containers").click();

    (await ob.ldap_more_Btn("DynamicOrg")).click();

    await ob.ldap_options("Delete").click();

    // Verify dialogue title
    const dialogueTitle = ob.ldap_dialogue_title();
    await expect(dialogueTitle).toContainText("Confirm");

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
    await dmPage.undeployFiles(TestData.OrgName);
  });
});

test.afterAll(async () => {
  await page.close();
});
