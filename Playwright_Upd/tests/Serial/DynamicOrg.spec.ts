import { test, expect, type Page } from '@playwright/test';
import { CustomCommandsHelper } from '../helpers/CustomCommandsHelper';
import { POManager } from '../../PageObjects/POManager';
import { HomePage } from '../../PageObjects/HomePage';
import TestData from '../../fixtures/TestData.json';

// Global variables for shared state across serial tests
let DeployedCount: number;
let UndeployingAppCount: number;
let ERPPProcessInstance1: string;
let ERPPProcessInstance2: string;
let ERPPProcessInstance3: string;
let RRPPProcessInstance: string;
let DPProcessInstance: string;
let Id1: string;
let Id2: string;
let Id3: string;
let Id4: string;
let Id5: string;
let Id6: string;

// .serial ensures tests run in order and share the same browser context
test.describe.serial('DynamicOrg UI RegressionSuite', () => {
    let page: Page;
    let customCmds: CustomCommandsHelper;

    // Page Objects â typed via POManager to avoid individual class imports
    //let wmp: POManager['workManagerPage'];
    let pm: POManager['processPage'];
    let ap: POManager['adminPage'];
    let dm: POManager['dmPage'];
    let wv: POManager['wvPage'];
    let ob: POManager['obPage'];
    let aud: POManager['adPage'];
    let hm: HomePage;
    let wl: POManager['wlPage']
    let api: POManager['Audit_Process_InstancesPage'];

    test.beforeAll(async ({ browser }) => {
        // Use browser.newPage() so Playwright's managed context persists across serial tests.
        // Clear cookies immediately to remove any pre-loaded storageState auth.
        page = await browser.newPage();
        await page.context().clearCookies();
        customCmds = new CustomCommandsHelper(page);

        // Initialize Page Objects via POManager (same pattern as BusinessServices.spec.ts)
        const poManager = new POManager(page);
       // wmp = poManager.getWorkManagerPage();
        pm  = poManager.getProcessPage();
        ap  = poManager.getAdminPage();
        dm  = poManager.getDMPage();
        wv  = poManager.getWorkViewsPage();
        ob  = poManager.getOrgBrowserPage();
        aud = poManager.getAuditPage();
        hm = poManager.getHomePage();
        wl = poManager.getWorkListPage();
        api = poManager.getAudit_Process_InstancesPage();
    });

    test.afterAll(async () => {
        await page.close();
    });

    test('Login to Administrator and navigate to Deployment Manager', async () => {
        await customCmds.loginAdministrator(TestData.adminUrl, TestData.username1, TestData.password1);
        await page.waitForTimeout(2000);

        await expect(page).toHaveTitle('Administrator', { timeout: 30000 });
        await expect(ap.AdministratorWelcomeTitle).toContainText('Welcome to Administrator');

        await expect(ap.DeploymentManagerCard).toHaveText('Deployment Manager');
        await ap.DeploymentManagerGoButton.click();
        await page.waitForTimeout(3000);

        await expect(ap.ActiveTabTitle).toContainText('Deployment Manager');
    });

    test('Deploy process app dependent on an BDS Project before deploying the BDS project,verify the dependency error details', async () => {
        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(2000);
        const deployBodyText = await dm.DeployBody.textContent();

        // Skip if BPM app is already deployed OR if BDS is already deployed
        // (BDS deployed means the BDS dependency error won't appear for this test)
        if (deployBodyText && (deployBodyText.includes(TestData.DynamicOrgApp) || deployBodyText.includes(TestData.DynamicOrgBDS))) {
            console.log('App already deployed - skipping BDS dependency error test');
        } else {
            console.log('Deploying the test applications');
            await dm.NewDeploymentButton.click();
            await customCmds.selectFileToDeploy(TestData.DynamicOrgApp + "-prod-1.7.rasc");

           // await expect(dm.RascUploadVerficationText).toContainText('rasc');
            await expect(dm.DeployButton).toBeEnabled({ timeout: 10000 });
            await dm.DeployButton.click();

            await expect(dm.DependencyError_Dialogue_title).toContainText(' Error ', { timeout: 120000 });
            await expect(dm.DependencyError_Dialogue_msg).toContainText('Requirement not found [com.example.dynamicorgbdsproject');
            await expect(dm.DependencyError_Dialogue_btn).toBeVisible();
            await expect(dm.DependencyError_Dialogue_closeIcon).toBeVisible();
            await dm.DependencyError_Dialogue_btn.click();
            await expect(dm.DragFileMenu).toContainText('Drag a RASC file', { timeout: 30000 });
        }
    });

    test('Deploy the RASC for BDS Project', async () => {
        const countText = await dm.DeployedAndUnDeployingCount('Deployed').textContent();
        DeployedCount = parseInt(countText || '0');
        console.log(`Current Deployed Count: ${DeployedCount}`);

        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(3000);

        const deployBodyText = await dm.DeployBody.textContent();
        if (deployBodyText && deployBodyText.includes(TestData.DynamicOrgBDS)) {
            console.log('App is already deployed!');
        } else {
            console.log('Deploying the DynamicOrgBDS Project');
            await dm.NewDeploymentButton.click();
            await customCmds.selectFileToDeploy(TestData.DynamicOrgBDS + "-prod-1.1.rasc");

          //  await expect(dm.RascUploadVerficationText).toContainText('rasc');
            await expect(dm.DeployButton).toBeEnabled({ timeout: 10000 });
            await dm.DeployButton.click();

            //await expect(dm.DragFileMenu).toContainText('Drag a RASC file', { timeout: 120000 });
            const txtRasc = await dm.getDragFileMenu();
            expect(await txtRasc.innerText()).toContain("Drag a RASC file");
            await page.waitForTimeout(3000);
        }
    });

    test('Verify that the BDS project is deployed successfully', async () => {
        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(3000);

        await expect(dm.DeployedAppList.locator(`text=${TestData.DynamicOrgBDS}`)).toBeVisible();
        await expect(dm.AppStatus(TestData.DynamicOrgBDS)).toHaveText(' Deployed ');
        await expect(dm.AppType(TestData.DynamicOrgBDS)).toHaveText(' data ');

        const newCountText = await dm.DeployedAndUnDeployingCount('Deployed').textContent();
        const newDeployedApps = parseInt(newCountText || '0');
        DeployedCount++;
        expect(newDeployedApps).toBe(DeployedCount);
    });

    test('Deploy process app dependent on an Org Project before deploying the Org project,verify the dependency error details', async () => {
        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(2000);
        const bpmDeployed5 = await dm.AppStatus(TestData.DynamicOrgApp).isVisible();
        const orgModelDeployed5 = await dm.AppStatus(TestData.DynamicOrgModel).isVisible();
        if (bpmDeployed5 || orgModelDeployed5) {
            console.log('App is already deployed!');
        } else {
            console.log('Deploying the test applications');
            await dm.NewDeploymentButton.click();
            await customCmds.selectFileToDeploy(TestData.DynamicOrgApp + "-prod-1.7.rasc");

            //await expect(dm.RascUploadVerficationText).toContainText('rasc');
            await expect(dm.DeployButton).toBeEnabled({ timeout: 10000 });
            await dm.DeployButton.click();
            await expect(dm.DependencyError_Dialogue_title).toContainText(' Error ', { timeout: 120000 });
            await expect(dm.DependencyError_Dialogue_msg).toHaveText('Requirement not found [com.example.dynamicorg,[1.1.0,2.0.0)]');
            await expect(dm.DependencyError_Dialogue_btn).toBeVisible();
            await expect(dm.DependencyError_Dialogue_closeIcon).toBeVisible();
            await page.waitForTimeout(3000);

            await dm.DependencyError_Dialogue_btn.click();
            await expect(dm.DragFileMenu).toContainText('Drag a RASC file', { timeout: 30000 });
        }
    });

    test('Deploy the RASC for Org Project', async () => {
        const countText = await dm.DeployedAndUnDeployingCount('Deployed').textContent();
        DeployedCount = parseInt(countText || '0');

        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(3000);

        const orgModelDeployed6 = await dm.AppStatus(TestData.DynamicOrgModel).isVisible();
        if (orgModelDeployed6) {
            console.log('App is already deployed!');
        } else {
            console.log('Deploying the DynamicOrg Project');
            await dm.NewDeploymentButton.click();
            await customCmds.selectFileToDeploy(TestData.DynamicOrgModel + "-prod-1.1.rasc");

            //await expect(dm.RascUploadVerficationText).toContainText('rasc');
            await expect(dm.DeployButton).toBeEnabled({ timeout: 10000 });
            await dm.DeployButton.click();

            const txtRasc = await dm.getDragFileMenu();
            expect(await txtRasc.innerText()).toContain("Drag a RASC file");
            await page.waitForTimeout(3000);
        }
    });

    test('Verify that the DynamicOrg project is deployed successfully', async () => {
        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(3000);

        await expect(dm.DeployedAppList.locator(`text="${TestData.DynamicOrgModel}"`)).toBeVisible();
        await expect(dm.AppStatus(TestData.DynamicOrgModel)).toHaveText(' Deployed ');
        await expect(dm.AppType(TestData.DynamicOrgModel)).toHaveText(' organization ');

        const newCountText = await dm.DeployedAndUnDeployingCount('Deployed').textContent();
        const newDeployedApps = parseInt(newCountText || '0');
        DeployedCount++;
        expect(newDeployedApps).toBe(DeployedCount);
    });

    test('Deploy the process project after deploying all dependencies', async () => {
        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(2000);
        const bpmDeployed8 = await dm.AppStatus(TestData.DynamicOrgApp).isVisible();
        if (bpmDeployed8) {
            console.log('App is already deployed!');
        } else {
            console.log('Deploying the test applications');
            await dm.NewDeploymentButton.click();
            await customCmds.selectFileToDeploy(TestData.DynamicOrgApp + "-prod-1.7.rasc");

            await expect(dm.RascUploadVerficationText).toContainText('rasc');
            await expect(dm.DeployButton).toBeEnabled({ timeout: 10000 });
            await dm.DeployButton.click();

            const txtRasc = await dm.getDragFileMenu();
            expect(await txtRasc.innerText()).toContain("Drag a RASC file");
            await page.waitForTimeout(3000);
        }

        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(3000);

        await expect(dm.DeployedAppList.locator(`text="${TestData.DynamicOrgApp}"`)).toBeVisible();
        await expect(dm.AppStatus(TestData.DynamicOrgApp)).toHaveText(' Deployed ');
        await expect(dm.AppType(TestData.DynamicOrgApp)).toHaveText(' process ');
    });

        test('Deploy the OrgBrowserSanity project', async () => {
        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(2000);
        const bpmDeployed8 = await dm.AppStatus(TestData.OrgModelSaniity).isVisible();
        if (bpmDeployed8) {
            console.log('App is already deployed!');
        } else {
            console.log('Deploying the test applications');
            await dm.NewDeploymentButton.click();
            await customCmds.selectFileToDeploy(TestData.OrgModelSaniity + "-dev-1.0.rasc");

            await expect(dm.RascUploadVerficationText).toContainText('rasc');
            await expect(dm.DeployButton).toBeEnabled({ timeout: 10000 });
            await dm.DeployButton.click();

            const txtRasc = await dm.getDragFileMenu();
            expect(await txtRasc.innerText()).toContain("Drag a RASC file");
            await page.waitForTimeout(3000);
        }

        await dm.AllDeploymentsTab.click();
        await page.waitForTimeout(3000);

        await expect(dm.DeployedAppList.locator(`text="${TestData.OrgModelSaniity}"`)).toBeVisible();
        await expect(dm.AppStatus(TestData.OrgModelSaniity)).toHaveText(' Deployed ');
        await expect(dm.AppType(TestData.OrgModelSaniity)).toHaveText(' organization ');
    });

    test('Navigate Organization Browser', async () => {
        await page.goto(TestData.orgbrowserurl);
        await page.waitForTimeout(3000);
        //await expect(ob.OrgBrowserWelcomeTitle).toContainText('Welcome to Org Browser');
        await ob.selectServer(' Local server ');
        //await page.getByText('select server').click();
        //await page.getByRole('option', { name: ' Local server ' }).click();

    });

    //from worklist
    test("Create the new LDAP container", async () => {
      // Visit the URL
      await page.goto(TestData.orgbrowserurl);

      // Wait for the welcome title to appear
      await page.waitForTimeout(2000);

      // Click the Go Button
      await ob.goButton().first().click();

      // Verify the Create Container Page Header
      const createContainerHeader = await ob.createContainer_PageHeader().textContent();
      expect(await createContainerHeader).toContain("Create container");

      // Type in the container name and description
      await ob.containerCreation_Name().fill("DynamicOrg");
      await ob.containerCreation_Description().fill("DynamicOrg_Test");

      // Click Next Button
      await ob.containerCreation_NextButton().first().click();

      // Verify the Choose LDAP Source Page Header
      const chooseLDAPSourceHeader = await ob.chooseLDAPSource_PageHeader().textContent();
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
      const mapResourceHeader = await ob.mapResourceAttribute_PageHeader().textContent();
      expect(await mapResourceHeader).toContain("Map resource attributes");

      // Select the Organization Model Version
      await ob.orgModel_VersionList().click();
      await ob.SelectOrgModel_Version("1").click();

      // Click the Create LDAP Container Button
      await ob.createLDAPContainer_Button().click();

      // Wait for 2 seconds
      await page.waitForTimeout(2000);

      // Verify that the Org Browser Home Icon is visible
      const orgBrowserHomeIconVisible = await ob.OrgBrowserHomeIcon.isVisible();
      expect(orgBrowserHomeIconVisible).toBe(true);

      // Verify the Browse Organization Tab
      const browseOrgTabText = await ob.BrowseOrganization_Tab;
      expect(await browseOrgTabText).toContainText("Browse organization");

      // Verify that the LDAP container is visible
      const ldapNameVisible = await ob.ldapName("DynamicOrg").isVisible();
      expect(await ldapNameVisible).toBe(true);
    });


    test('Add resources to the selected LDAP container', async () => {

        await page.goto(TestData.ldapContainersurl);
        await ob.LDAPName('DynamicOrg').dblclick();
        await page.waitForTimeout(2000);
        //await customCmds.selectResourceWithName('Tony Pulis'); older
        await ob.selectResourceWithName('Tony Pulis'); //from worklist
        // Click the Add selected button
        await ob.addSelected_Button().click();
         // Assert the Add Resource Dialog contains the text "Add resource(s)"
        //const addResourceDialogText = await ob.addResource_Dialog().textContent();
        const addResourceDialogText = await ob.addResource_Dialog().textContent();
        expect(await addResourceDialogText).toContain("Add resource(s)");
       // expect(await addResourceDialogText).toContain("Add resource(s)");
        // Click the Create Resource button
        await ob.createResource_Button().click();
        await page.waitForTimeout(3000);

        await ob.selectResourceWithName('Clint Hill'); //from worklist
        await ob.addSelected_Button().click();
       // const addResourceDialogText2 = await ob.addResource_Dialog().textContent();
       // expect(await addResourceDialogText2).toContain("Add resource(s)");
        await ob.createResource_Button().click();
        await page.waitForTimeout(3000);
        // Click the Add selected button

        await ob.selectResourceWithName('Richard Cresswell'); //from worklist
        await ob.addSelected_Button().click();
        //const addResourceDialogText3 = await ob.addResource_Dialog().textContent();
        //expect(await addResourceDialogText3).toContain("Add resource(s)");
        await ob.createResource_Button().click();
        await page.waitForTimeout(3000);
        await customCmds.changeFilter();
    });

    test('Add Candidate Query', async () => {
        await ob.fetchMoreResources();
        await ob.org_Version_selector().click();
        await ob.org_Version('1').click();
        await customCmds.expandOrganization();
        await customCmds.openTemplates();;
        await page.waitForTimeout(3000);
        await customCmds.addCandidateQuery('Richard Cresswell');
        await page.waitForTimeout(2000);

        console.log('Checking if query added before resetting org');
        //await customCmds.verifyAndCloseTemplates();
    });

    test('Reset Dynamic Org (1)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(20000);
        await page.reload();
    });

    test('Add Extension Points', async () => {
        await page.waitForTimeout(2000);
        await customCmds.expandOrganization();
        await ob.MoreOptions.click()
        await customCmds.addExtensionPoints();
        await page.waitForTimeout(2000);
        await expect(ob.GridItem).toContainText('town');
        await expect(ob.EditButton).toBeVisible();
        await expect(ob.DeleteButton).toBeVisible();
        await page.waitForTimeout(10000);
    });

    test('Reset Dynamic Org (2)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(30000);
        await page.reload();
    });

    test('Reset Dynamic Org (3)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(20000);
        await page.reload();
    });

    test('Check if Richard is added to Branch Manager position', async () => {
        await page.waitForTimeout(5000); // combined timeouts
        await customCmds.changeFilter();
        await customCmds.expandOrganization();
        await customCmds.doCheckOrgUser('London', 'Richard Cresswell');
        await ob.refreshInstances().click();
        await page.waitForTimeout(2000);
    });

    test('Edit Candidate query for Paris', async () => {
        await customCmds.expandOrganization();
        await customCmds.editCandidateQuery('Paris', 'Clint Hill');
        await page.waitForTimeout(10000);
    });

    test('Reset Dynamic Org (4)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(30000);
        await page.reload();
    });

    test('Reset Dynamic Org (5)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(10000);
        await page.reload();
    });

    test('Check if Clint is added to Paris', async () => {
        await page.waitForTimeout(5000);
        await customCmds.changeFilter();
        await customCmds.expandOrganization();
        await customCmds.doCheckOrgUser('Paris', 'Clint Hill');
    });

    test('Edit Candidate Query for London', async () => {
        await ob.refreshInstances().click();
        await page.waitForTimeout(2000);
        await customCmds.expandOrganization();
        await customCmds.editCandidateQuery('London', 'Tony Pulis');
        await page.waitForTimeout(10000);
    });

    test('Reset Dynamic Org (6)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(30000);
        await page.reload();
    });

    test('Reset Dynamic Org (7)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(10000);
        await page.reload();
    });

    test('Check if Tony is added to London', async () => {
        await page.waitForTimeout(5000);
        await customCmds.changeFilter();
        await customCmds.expandOrganization();
        await customCmds.doCheckOrgUser('London', 'Tony Pulis');
    });

    test('Add Candidate Query for DynamicOrgGroup001', async () => {
        await ob.groups_Tab().click();
        await page.waitForTimeout(2000);

        await customCmds.addQueryDynamicGroup();

        await customCmds.addCandidateQuery('Clint Hill');
        await page.waitForTimeout(10000);
    });

    test('Reset Dynamic Org (8)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(40000);
        await page.reload();
    });

    test('Reset Dynamic Org (9)', async () => {
        const response = await customCmds.resetOrg();
        expect(response.status).toBe(200);
        await page.waitForTimeout(30000);
        await page.reload();
    });

    test('Check if Clint is added DynamicOrgGroup001', async () => {
        await ob.groups_Tab().click();
        await page.waitForTimeout(2000);
        await customCmds.doCheckGroupUser('DynamicOrgGroup001', 'Clint Hill');
    });

    test('Org model Sanity', async () => {

    await page.waitForTimeout(3000);
    await ob.selectResourceWithName("Tony Pulis");

    await ob.org_Version_selector().click();

    await ob.org_Version(1).click();
    await ob.Organizations_Tab.click();
    await ob.click_Toggle_Button_In_Front_Of("Organizations");
    await ob.click_Toggle_Button_In_Front_Of("Organization1");
    await ob.click_Toggle_Button_In_Front_Of("OrgUnit1");
    await ob.click_Toggle_Button_In_Front_Of("OrgUnit2");

    await ob.select_Position_With_Name(TestData.PositionName).first().click();

    await ob.map_Selected_Resource_Link().first().click();
    await ob.selectResourceWithName("Tony Pulis"); //deselect
    //await ob.orgBrowserBack_Button().click();
        await ob.hoverResource("Tony Pulis").hover();
        await ob.resourceMoreOptions().click();
        await ob.editResource().click();
        await page.waitForTimeout(2000);
        await ob.selectLocation('Location1').first().check();
        await ob.updateResourceButton().click();

        await ob.hoverResource("Tony Pulis").hover();
        await ob.ViewDetailsButton('Tony Pulis').first().click();
        await ob.detailsTab('Location (1)').click();
        await expect(ob.locationTabDetails()).toContainText('Location1');
        //await ob.selectResourceWithName("Tony Pulis");
        await ob.viewDetailsClose().click();

        await page.waitForTimeout(2000);
        await ob.selectResourceWithName("Tony Pulis");
        /*await ob.click_Toggle_Button_In_Front_Of("Organizations");
        await ob.click_Toggle_Button_In_Front_Of("Organization1");
        await ob.click_Toggle_Button_In_Front_Of("OrgUnit1");
        */
        await ob.select_Position_With_Name(TestData.PositionName).last().click();
        await ob.map_Selected_Resource_Link().click();
        await  expect(ob.dialogContent()).toContainText('The resources you are mapping to \'Position1\' does not have required capabilities');
        await ob.continueButton().click();

        await ob.selectResourceWithName("Tony Pulis"); //deselect
        await ob.hoverResource("Tony Pulis").hover();
        await ob.ViewDetailsButton('Tony Pulis').first().click();
        await ob.detailsTab('Capabilities (0)').click();
        //await expect(ob.noCapabilitiesText()).toHaveText('No capabilities assigned');
        await ob.EditCapaabilityButton.click();
        await ob.selectCapability('Capability3').first().check();
        await ob.selectCapability('Capability4').first().check();
        await ob.SaveButton.click();
        //await ob.detailsTab('Capabilities (2)').click();
        await expect(ob.propertyDetails()).toContainText('Capability3');
        await expect(ob.propertyDetails()).toContainText('Capability4');
        await ob.detailsTab('Privileges (2)').click();
        await expect(ob.propertyDetails()).toContainText('Privilege1');
        await expect(ob.propertyDetails()).toContainText('Privilege2');
        await ob.detailsTab('Attributes').click();
        await ob.EditCapaabilityButton.click();
        await customCmds.editAttributes();
        await ob.viewDetailsClose().click();
        await page.waitForTimeout(2000);

        await ob.groups_Tab().click();
        await page.waitForTimeout(2000);
        await ob.click_Toggle_Button_In_Front_Of('groups');
        await ob.click_Toggle_Button_In_Front_Of('Group1');
        await ob.click_Toggle_Button_In_Front_Of('Group2');
        await ob.click_Toggle_Button_In_Front_Of('Group3');
        await ob.select_Group_With_Name('Group4');
        await ob.selectResourceWithName("Tony Pulis");
        await ob.map_Selected_Resource_Link().click();


        //Edit Resources
        //Add Capabilities
        //Add Privileges
        //Location
        //Edit Attributes
    });
    test('Verify the ERPP Process present under the Process template and start a PI of the same', async () => {
        await page.goto(TestData.webcomponenturl);
       // await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username1,TestData.password1)
        await customCmds.changeServer('Local server');
        await pm.naviagteToProcessTab();
        //await pm.naviagteToProcessTab();
        await pm.startProcess(TestData.dynamicOrgPackageName,TestData.DO_ERPP_ProcessName)
        Id1 = await pm.getProcessInstanceId();
        const state1 = await pm.getStateRow(Id1);
        expect(state1).toBe('ACTIVE');


        });

    test('Launch WM,verify gettownparam Details WI,enter data and submit (1)', async () => {
        await page.goto(TestData.workMangerUrlApp);
        await page.waitForLoadState("domcontentloaded");

        //Navigate to worklists
        await hm.clickMyWork();
        await hm.isWorkItemPresent(TestData.DO_GETTOWNPARAM)
        //User1Task1
        await hm.openWorklist(TestData.DO_GETTOWNPARAM);
        await expect(wv.WorkItemField("Town")).toHaveText('Town');
        await wv.workItemData("Town").fill(TestData.DO_TOWNNAME1);
        await wl.submitBtn.scrollIntoViewIfNeeded();
        await wl.submitBtn.click();
        await customCmds.logout();
        await page.context().clearCookies();
    });

    test('Login WM with Tony Pulis verify and submit WI', async () => {
        await page.waitForTimeout(2000);
       // await customCmds.loginWorkManager(TestData.workmanagerurl, 'Tony Pulis', TestData.password2);
        await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username2,TestData.password2)

        await customCmds.clickComponentIcon(page,'bpmMyWork');
        await customCmds.changeServer('Local server');
        await hm.clickMyWork();
        await hm.isWorkItemPresent(TestData.ERPPProcessUserTask)
        //User1Task1
        await hm.openWorklist(TestData.ERPPProcessUserTask);

        /*await expect(wv.WorkItemWithName(TestData.ERPPProcessUserTask)).toHaveText(TestData.ERPPProcessUserTask);
        await wv.WorkItemWithName(TestData.ERPPProcessUserTask).dblclick();
        */
        await expect(wv.WorkItemField("EmpId")).toHaveText('EmpId');
        await wv.workItemData("EmpId").fill(TestData.DO_WI_ERPP.EmpId);

        await expect(wv.WorkItemField("Name")).toHaveText('Name');
        await wv.workItemData("Name").fill(TestData.DO_WI_ERPP.Name);

        await expect(wv.WorkItemField("DepartmentId")).toHaveText('DepartmentId');
        await wv.workItemData("DepartmentId").fill(TestData.DO_WI_ERPP.DepartmentId);

        await expect(wv.WorkItemField("EmailId")).toHaveText('EmailId');
        await wv.workItemData("EmailId").fill(TestData.DO_WI_ERPP.EmailId);

        await expect(wv.WorkItemField("MobileNo")).toHaveText('MobileNo');
        await wv.workItemData("MobileNo").fill(TestData.DO_WI_ERPP.MobileNo);

        await wl.submitBtn.scrollIntoViewIfNeeded();
        await wl.submitBtn.click();
        await page.waitForTimeout(5000);
        await customCmds.logout();
        await page.context().clearCookies();
    });

    test('Verify the ERPP Process present under the Process template and start a PI of the same (Paris)', async () => {
   // Equivalent to Cypress.session.clearAllSavedSessions()

        await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username1,TestData.password1)
        await customCmds.changeServer('Local server');
        await pm.naviagteToProcessTab();
        await pm.startProcess(TestData.dynamicOrgPackageName,TestData.DO_ERPP_ProcessName)
        Id2 = await pm.getProcessInstanceId();
        const state1 = await pm.getStateRow(Id2);
        expect(state1).toBe('ACTIVE');
    });

    test('Launch WM,verify gettownparam Details WI,enter data and submit (2)', async () => {
        await page.goto(TestData.workMangerUrlApp);
        await page.waitForLoadState("domcontentloaded");

        //Navigate to worklists
        await hm.clickMyWork();
        await hm.isWorkItemPresent(TestData.DO_GETTOWNPARAM)
        //User1Task1
        await hm.openWorklist(TestData.DO_GETTOWNPARAM);
        await expect(wv.WorkItemField("Town")).toHaveText('Town');
        await wv.workItemData("Town").fill(TestData.DO_TOWNNAME3);
        await wl.submitBtn.scrollIntoViewIfNeeded();
        await wl.submitBtn.click();
        await customCmds.logout();
        await page.context().clearCookies();
    });

    test('Login WM with Clint Hill verify and submit WI', async () => {
       await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username3,TestData.password2)

       await customCmds.clickComponentIcon(page,'bpmMyWork');
       await customCmds.changeServer('Local server');
        await hm.clickMyWork();

        await hm.isWorkItemPresent(TestData.ERPPProcessUserTask)
        //User1Task1
        await hm.openWorklist(TestData.ERPPProcessUserTask);

        await expect(wv.WorkItemField("EmpId")).toHaveText('EmpId');
        await wv.workItemData("EmpId").fill(TestData.DO_WI_ERPP.EmpId);

        await expect(wv.WorkItemField("Name")).toHaveText('Name');
        await wv.workItemData("Name").fill(TestData.DO_WI_ERPP.Name);

        await expect(wv.WorkItemField("DepartmentId")).toHaveText('DepartmentId');
        await wv.workItemData("DepartmentId").fill(TestData.DO_WI_ERPP.DepartmentId);

        await expect(wv.WorkItemField("EmailId")).toHaveText('EmailId');
        await wv.workItemData("EmailId").fill(TestData.DO_WI_ERPP.EmailId);

        await expect(wv.WorkItemField("MobileNo")).toHaveText('MobileNo');
        await wv.workItemData("MobileNo").fill(TestData.DO_WI_ERPP.MobileNo);

        await wl.submitBtn.scrollIntoViewIfNeeded();
        await wl.submitBtn.click();
        await customCmds.logout();
        await page.context().clearCookies();
    });

    test('Verify the ERPP Process present under the Process template and start a PI of the same (Swindon)', async () => {

       await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username1,TestData.password1)
       await customCmds.changeServer('Local server');
       await pm.naviagteToProcessTab();
        await pm.startProcess(TestData.dynamicOrgPackageName,TestData.DO_ERPP_ProcessName)
        Id3 = await pm.getProcessInstanceId();
        const state1 = await pm.getStateRow(Id3);
        expect(state1).toBe('ACTIVE');
    });

    test('Launch WM,verify gettownparam Details WI,enter data and submit (3)', async () => {

       await page.goto(TestData.workMangerUrlApp);
        await page.waitForLoadState("domcontentloaded");

        //Navigate to worklists
        await hm.clickMyWork();
        await hm.isWorkItemPresent(TestData.DO_GETTOWNPARAM)
        //User1Task1
        await hm.openWorklist(TestData.DO_GETTOWNPARAM);
        await expect(wv.WorkItemField("Town")).toHaveText('Town');
        await wv.workItemData("Town").fill(TestData.DO_TOWNNAME2);
        await wl.submitBtn.scrollIntoViewIfNeeded();
        await wl.submitBtn.click();
        await customCmds.logout();
        await page.context().clearCookies();
    });

    test('Login WM with Richard Cresswell verify and submit WI', async () => {

       await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username4,TestData.password2)
       await customCmds.clickComponentIcon(page,'bpmMyWork');
        await customCmds.changeServer('Local server');
        //await customCmds.clickComponentIcon(page,'bpmMyWork');
        await hm.clickMyWork();

        await hm.isWorkItemPresent(TestData.ERPPProcessUserTask)
        //User1Task1
        await hm.openWorklist(TestData.ERPPProcessUserTask);
        await expect(wv.WorkItemField("EmpId")).toHaveText('EmpId');
        await wv.workItemData("EmpId").fill(TestData.DO_WI_ERPP.EmpId);

        await expect(wv.WorkItemField("Name")).toHaveText('Name');
        await wv.workItemData("Name").fill(TestData.DO_WI_ERPP.Name);

        await expect(wv.WorkItemField("DepartmentId")).toHaveText('DepartmentId');
        await wv.workItemData("DepartmentId").fill(TestData.DO_WI_ERPP.DepartmentId);

        await expect(wv.WorkItemField("EmailId")).toHaveText('EmailId');
        await wv.workItemData("EmailId").fill(TestData.DO_WI_ERPP.EmailId);

        await expect(wv.WorkItemField("MobileNo")).toHaveText('MobileNo');
        await wv.workItemData("MobileNo").fill(TestData.DO_WI_ERPP.MobileNo);

        await wl.submitBtn.scrollIntoViewIfNeeded();
        await wl.submitBtn.click();
        await customCmds.logout();
        await page.context().clearCookies();
    });

    test('Launch Audit, navigate to Process Audit and verify that ERPPProcess Instances are completed', async () => {
        await customCmds.loginWebComponent(page, TestData.webcomponenturl, TestData.username1, TestData.password1);
        await page.waitForLoadState('domcontentloaded');
        await page.waitForTimeout(3000);
        await customCmds.changeServer('Local server');
        await customCmds.clickComponentIcon(page,'bpmAudit');
        //await wmp.AuditGoBtn.click();
        await aud.clickOnProcessInstance();
        //expect(Id3).toEqual('p:0a2070')
        const cstate3 = await api.getProcessStateByInstanceID(Id3);
        //expect(Id3).toEqual('p:0a2070')
        expect(cstate3).toContain('COMPLETED');
        const cstate2 = await api.getProcessStateByInstanceID(Id2);
        expect(cstate2).toContain('COMPLETED');
        const cstate1 = await api.getProcessStateByInstanceID(Id1);
        expect(cstate1).toContain('COMPLETED');


        await customCmds.logout();
        await page.context().clearCookies();
        await page.waitForTimeout(2000);
    });

    test('Verify the RRPP Process present under the Process template and start a PI of the same', async () => {

       await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username1,TestData.password1)
        await customCmds.changeServer('Local server');
        await pm.naviagteToProcessTab();
        await pm.startProcess(TestData.dynamicOrgPackageName,TestData.DO_RRPP_ProcessName)
        Id4 = await pm.getProcessInstanceId();
        const state1 = await pm.getStateRow(Id4);
        expect(state1).toBe('ACTIVE');
        await customCmds.logout();
        await page.context().clearCookies();
        await page.waitForTimeout(2000);
    });

    test('Login WM with Richard Cresswell verify WI', async () => {
    await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username4,TestData.password2)

        await customCmds.clickComponentIcon(page,'bpmMyWork');
        await customCmds.changeServer('Local server');
        await hm.clickMyWork();
        await hm.isWorkItemPresent(TestData.RRPPProcessUserTask)
        await customCmds.logout();
        await page.waitForTimeout(2000);
    });

    test('Login WM with Tony Pulis verify WI', async () => {
    await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username2,TestData.password2)

        await customCmds.clickComponentIcon(page,'bpmMyWork');
        await customCmds.changeServer('Local server');
        await hm.clickMyWork();
        await hm.isWorkItemPresent(TestData.RRPPProcessUserTask)
        await customCmds.logout();
        await page.context().clearCookies();
        await page.waitForTimeout(2000);
    });

    test('Login WM with Clint Hill verify and submit WI (2)', async () => {
        await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username3,TestData.password2)

        await customCmds.clickComponentIcon(page,'bpmMyWork');
        await customCmds.changeServer('Local server');
        await hm.clickMyWork();
        await hm.isWorkItemPresent(TestData.RRPPProcessUserTask)
        await hm.openWorklist(TestData.RRPPProcessUserTask);
        //await expect(wv.WorkItemWithName(TestData.RRPPProcessUserTask)).toHaveText(TestData.RRPPProcessUserTask);
        //await wv.WorkItemWithName(TestData.RRPPProcessUserTask).dblclick();

        await expect(wv.WorkItemField("EmpId")).toHaveText('EmpId');
        await wv.workItemData("EmpId").fill(TestData.DO_WI_RRPP.EmpId);

        await expect(wv.WorkItemField("Name")).toHaveText('Name');
        await wv.workItemData("Name").fill(TestData.DO_WI_RRPP.Name);

        await expect(wv.WorkItemField("DepartmentId")).toHaveText('DepartmentId');
        await wv.workItemData("DepartmentId").fill(TestData.DO_WI_RRPP.DepartmentId);

        await expect(wv.WorkItemField("EmailId")).toHaveText('EmailId');
        await wv.workItemData("EmailId").fill(TestData.DO_WI_RRPP.EmailId);

        await expect(wv.WorkItemField("MobileNo")).toHaveText('MobileNo');
        await wv.workItemData("MobileNo").fill(TestData.DO_WI_RRPP.MobileNo);
        await wl.submitBtn.scrollIntoViewIfNeeded();
        await wl.submitBtn.click();
        await customCmds.logout();
        await page.context().clearCookies();
        await page.waitForTimeout(2000);
    });

    test('Launch Work Manager, navigate to Process Audit and verify that RRPPProcess Instances are completed', async () => {
        await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username1,TestData.password1)
        await customCmds.clickComponentIcon(page,'bpmAudit');
        //await wmp.AuditGoBtn.click();
        await aud.clickOnProcessInstance();
        const cstate4 = await api.getProcessStateByInstanceID(Id4);
        expect(cstate4).toContain('COMPLETED');

    });

    test('Verify the DPP Process present under the Process template and start a PI of the same', async () => {

        //await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username1,TestData.password1)

        await pm.naviagteToProcessTab();
        await customCmds.changeServer('Local server');
        //await pm.naviagteToProcessTab();
        await pm.startProcess(TestData.dynamicOrgPackageName,TestData.DO_DPP_ProcessName)
        Id6 = await pm.getProcessInstanceId();
        const state1 = await pm.getStateRow(Id6);
        expect(state1).toBe('ACTIVE');
        await customCmds.logout();
        await page.context().clearCookies();
        await page.waitForTimeout(2000);
    });

    test('Login WM with Clint Hill verify and submit WI (3)', async () => {
        await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username3,TestData.password2)
        await customCmds.clickComponentIcon(page,'bpmMyWork');
        await customCmds.changeServer('Local server');
        await hm.clickMyWork();
        await hm.isWorkItemPresent(TestData.DPProcessUserTask)
        await hm.openWorklist(TestData.DPProcessUserTask);
        await wl.submitBtn.scrollIntoViewIfNeeded();
        await wl.submitBtn.click();
        await customCmds.logout();
        await page.context().clearCookies();
        await page.waitForTimeout(2000);
    });

    test('Launch Work Manager, navigate to Process Audit and verify that DPProcess Instances are completed', async () => {
        await customCmds.loginWebComponent(page,TestData.webcomponenturl,TestData.username1,TestData.password1)
        await customCmds.clickComponentIcon(page,'bpmAudit');
        //await wmp.AuditGoBtn.click();
        await aud.clickOnProcessInstance();
        const cstate6 = await api.getProcessStateByInstanceID(Id6);
        expect(cstate6).toContain('COMPLETED');
    });

    test('Purge all Process Instances', async () => {

        await pm.naviagteToProcessTab();
        await customCmds.changeServer('Local server');
        await page.waitForTimeout(3000);
        //await pm.clickOnProcess(TestData.DO_ERPP_ProcessName);
        await pm.clickOnPackage(TestData.DynamicOrgBPM);
        // For ERPProcess
        await pm.PI_hamburger_Icon(TestData.DO_ERPP_ProcessName).click();
        await page.waitForTimeout(1000);
        await pm.PI_Purge_Migrate_Btn('Purge').click();
        await page.waitForTimeout(1000);

        await expect(pm.PI_Cancel_Purge_Dialogue_title).toHaveText('Confirm');
        await expect(pm.PI_Cancel_Purge_Dialogue_Msg).toHaveText(`
         Do you want to purge all the instances of ${TestData.DO_ERPP_ProcessName}?
         This action can't be undone!
       `);
        await expect(pm.PI_Cancel_Purge_Dialogue_Close_Btn).toBeVisible();
        await expect(pm.PI_Cancel_Purge_Dialogue_Btn('No')).toBeVisible();
        await expect(pm.PI_Cancel_Purge_Dialogue_Btn('Yes')).toBeVisible();

        await pm.PI_Cancel_Purge_Dialogue_Btn('Yes').click();
        await page.waitForTimeout(2000);
        await pm.PI_clickProcess(TestData.DO_ERPP_ProcessName).click();
        //await pm.Refresh_Process_Instances_Icon.click();
        await pm.Refresh_Process_Instances_Icon.click();
        await page.waitForTimeout(2000);
       await pm.Refresh_Process_Instances_Icon.click();
        await page.waitForTimeout(2000);
        //await expect(pm.NoPIText).to('No instances to display.');

        // For RRPProcess
        //await pm.clickOnProcess(TestData.DO_RRPP_ProcessName);
        await pm.PI_hamburger_Icon(TestData.DO_RRPP_ProcessName).click();
        await page.waitForTimeout(1000);
        await pm.PI_Purge_Migrate_Btn('Purge').click();
        await page.waitForTimeout(1000);

        await expect(pm.PI_Cancel_Purge_Dialogue_title).toHaveText('Confirm');
        await expect(pm.PI_Cancel_Purge_Dialogue_Msg).toHaveText(`
         Do you want to purge all the instances of ${TestData.DO_RRPP_ProcessName}?
         This action can't be undone!
       `);
        await expect(pm.PI_Cancel_Purge_Dialogue_Close_Btn).toBeVisible();
        await expect(pm.PI_Cancel_Purge_Dialogue_Btn('No')).toBeVisible();
        await expect(pm.PI_Cancel_Purge_Dialogue_Btn('Yes')).toBeVisible();

        await pm.PI_Cancel_Purge_Dialogue_Btn('Yes').click();
        await page.waitForTimeout(2000);
        await pm.PI_clickProcess(TestData.DO_RRPP_ProcessName).click();
        //await pm.Refresh_Process_Instances_Icon.click();
        await pm.Refresh_Process_Instances_Icon.click();
        await page.waitForTimeout(2000);
        await pm.Refresh_Process_Instances_Icon.click();
        await page.waitForTimeout(2000);
       //await expect(pm.NoPIText).toContainText(' No instances to display. ');

        // For DPProcess
        //await pm.clickOnProcess(TestData.DO_DPP_ProcessName);
        await pm.PI_hamburger_Icon(TestData.DO_DPP_ProcessName).click();
        await page.waitForTimeout(1000);
        await pm.PI_Purge_Migrate_Btn('Purge').click();
        await page.waitForTimeout(1000);

        await expect(pm.PI_Cancel_Purge_Dialogue_title).toHaveText('Confirm');
        await expect(pm.PI_Cancel_Purge_Dialogue_Msg).toHaveText(`
         Do you want to purge all the instances of ${TestData.DO_DPP_ProcessName}?
         This action can't be undone!
       `);
        await expect(pm.PI_Cancel_Purge_Dialogue_Close_Btn).toBeVisible();
        await expect(pm.PI_Cancel_Purge_Dialogue_Btn('No')).toBeVisible();
        await expect(pm.PI_Cancel_Purge_Dialogue_Btn('Yes')).toBeVisible();

        await pm.PI_Cancel_Purge_Dialogue_Btn('Yes').click();
        await page.waitForTimeout(2000);
        await pm.PI_clickProcess(TestData.DO_DPP_ProcessName).click();
        await pm.Refresh_Process_Instances_Icon.click();
        await page.waitForTimeout(2000);
        await pm.Refresh_Process_Instances_Icon.click();
        await page.waitForTimeout(2000);
        //await expect(pm.NoPIText).toContainText('No instances to display.');
    });

    test('Navigate to Org Browser and delete Extension Points', async () => {

        await page.goto(TestData.orgbrowserurl);
        await ob.View_Manage_GoBtn('Manage LDAP containers').click();
        await ob.BrowseOrganization_Tab.click();
        await customCmds.expandOrganization();
        await ob.MoreOptions.click()
        await customCmds.deleteExtensionPoints();
        await page.waitForTimeout(2000);
        await expect(ob.LDAP_dialogue_title).toContainText('Confirm');
        await expect(ob.LDAP_dialogue_msg).toContainText('Do you want to delete this extension point ?');
        await expect(ob.LDAP_dialogue_Btns('Cancel')).toBeVisible();
        await expect(ob.LDAP_dialogue_Btns('Confirm')).toBeVisible();
        await ob.LDAP_dialogue_Btns('Confirm').click();
        //await customCmds.DialogConfirm();

    });

    test('Delete Ldap container', async () => {
        await ob.LDAP_BackButton.click();
        await ob.LDAP_hover_LDAPName("DynamicOrg").hover();
        await ob.LDAP_more_Btn("DynamicOrg").click();
        await ob.LDAP_options('Delete').click();

        await expect(ob.LDAP_dialogue_title).toContainText('Confirm');
        await expect(ob.LDAP_dialogue_msg).toContainText('Would you like to delete LDAP Container?');
        await expect(ob.LDAP_dialogue_Btns('Cancel')).toBeVisible();

        await expect(ob.LDAP_dialogue_Btns('Confirm')).toBeVisible();
        await ob.LDAP_dialogue_Btns('Confirm').click();
    });

    test('Undeploy Projects', async () => {
        //await customCmds.loginAdministrator(TestData.adminUrl, TestData.username1, TestData.password1); //remove later
        await customCmds.adminHome(TestData.adminUrl);

        await expect(page).toHaveTitle('Administrator', { timeout: 30000 });
        await expect(ap.AdministratorWelcomeTitle).toContainText('Welcome to Administrator');

        await expect(ap.DeploymentManagerCard).toHaveText('Deployment Manager');
        await ap.DeploymentManagerGoButton.click();
        await page.waitForTimeout(3000);

        await expect(ap.ActiveTabTitle).toContainText('Deployment Manager')

        // Undeploy Process App
        await dm.Action(TestData.DynamicOrgApp.trim()).click();
        await page.waitForTimeout(2000);
        await dm.Undeploy.click();
        await page.waitForTimeout(2000);
        await expect(dm.Undeploy_Dialogue_Conf_Msg).toContainText('Are you sure you want to undeploy this file ?');
        await expect(dm.Undeploy_Dialogue_Warning_Msg).toContainText('This action cannot be undone');
        await expect(dm.Undeploy_Dialogue_button('Cancel')).toBeVisible();
        await expect(dm.Undeploy_Dialogue_button('Yes, undeploy')).toBeVisible();
        await dm.Undeploy_Dialogue_button('Yes, undeploy').click();
        await page.waitForTimeout(3000);
        await expect(dm.DeployedApp(TestData.DynamicOrgApp)).not.toBeVisible();

        // Undeploy BDS project
        await dm.Action(TestData.DynamicOrgBDS.trim()).click();
        await page.waitForTimeout(2000);
        await dm.Undeploy.click();
        await page.waitForTimeout(2000);
        await expect(dm.Undeploy_Dialogue_Conf_Msg).toHaveText('Are you sure you want to undeploy this file ?');
        await expect(dm.Undeploy_Dialogue_Warning_Msg).toHaveText('This action cannot be undone');
        await expect(dm.Undeploy_Dialogue_button('Cancel')).toBeVisible();
        await expect(dm.Undeploy_Dialogue_button('Yes, undeploy')).toBeVisible();
        await dm.Undeploy_Dialogue_button('Yes, undeploy').click();
        await page.waitForTimeout(3000);
        await expect(dm.DeployedApp(TestData.DynamicOrgBDS)).not.toBeVisible();

        // Undeploy Org Model
        await dm.Action(TestData.DynamicOrgModel.trim()).click();
        await page.waitForTimeout(2000);
        await dm.Undeploy.click();
        await page.waitForTimeout(2000);
        await expect(dm.Undeploy_Dialogue_Conf_Msg).toHaveText('Are you sure you want to undeploy this file ?');
        await expect(dm.Undeploy_Dialogue_Warning_Msg).toHaveText('This action cannot be undone');
        await expect(dm.Undeploy_Dialogue_button('Cancel')).toBeVisible();
        await expect(dm.Undeploy_Dialogue_button('Yes, undeploy')).toBeVisible();
        await dm.Undeploy_Dialogue_button('Yes, undeploy').click();
        await page.waitForTimeout(3000);
        await expect(dm.DeployedApp(TestData.DynamicOrgModel)).not.toBeVisible();

        //Undeploy Org Sanity
        // Undeploy Org Model
        await dm.Action(TestData.OrgModelSaniity.trim()).click();
        await page.waitForTimeout(2000);
        await dm.Undeploy.click();
        await page.waitForTimeout(2000);
        await expect(dm.Undeploy_Dialogue_Conf_Msg).toHaveText('Are you sure you want to undeploy this file ?');
        await expect(dm.Undeploy_Dialogue_Warning_Msg).toHaveText('This action cannot be undone');
        await expect(dm.Undeploy_Dialogue_button('Cancel')).toBeVisible();
        await expect(dm.Undeploy_Dialogue_button('Yes, undeploy')).toBeVisible();
        await dm.Undeploy_Dialogue_button('Yes, undeploy').click();
        await page.waitForTimeout(3000);
        await expect(dm.DeployedApp(TestData.OrgModelSaniity)).not.toBeVisible();

        //await customCmds.logout();
    });
});
