# Test info

- Name: Pre requisite LDAP - to test Case Manager  >> Add resources to the Local server LDAP container
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:408:7

# Error details

```
Error: locator.dblclick: Target page, context or browser has been closed
Call log:
  - waiting for locator('//div[@class=\'ldap-list-header\'][normalize-space()="LocalServerContainer"]')

    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:417:47
```

# Page snapshot

```yaml
- text: select server
- combobox "select server": Local server
- img
- text: Organization Browser
- button
- button
- button
- text: "All LDAP Containers System Admin Source Name: system Description: Default System Admin Query: (objectClass=person) OM Source Name: easyAs Description: Query: (objectClass=person) Members of System Admin"
- button "Create new LDAP container"
- button "Browse organization"
- tablist:
  - tab "Resources" [selected]
  - tab "Deleted Resources"
- tabpanel "Resources":
  - textbox "Search in 1 resources"
  - button "Clear"
  - text: tibco-admin
- iframe
```

# Test source

```ts
  317 |     await page.goto(dataset.workMangerUrlApp);
  318 |     await page.waitForLoadState("domcontentloaded");
  319 |     await homePage.clickOnBuisnessService();
  320 |     await customCmds.changeServer(dataset.ServerName);
  321 |     await homePage.clickMyWork();
  322 |     await homePage.openWorklist("DisplayDetails");
  323 |     await wlPage.submitAdhocTask();
  324 |     await cmPage.navigateToCaseManager();
  325 |     await cmPage.clickOnAdhocCase();
  326 |     await cmPage.clickOnCaseByCaseIdentifier(caseIdentifierId);
  327 |     await cmPage.showAdhocTask.click();
  328 |     await cmPage.verifyNoAdhocTaskRecords();
  329 |   });
  330 | });
  331 |
  332 | test.describe("Pre requisite LDAP - to test Case Manager ", () => {
  333 |
  334 |   test("Create LDAP container for Local server", async () => {
  335 |     // Navigate to Org Browser home page
  336 |     await page.goto(TestData.orgbrowserurl);
  337 |     await page.waitForTimeout(2000);
  338 |
  339 |     // Select Local server
  340 |     await ob.selectServer(" Local server ");
  341 |
  342 |     // Click the Go Button
  343 |     await ob.goButton().first().click();
  344 |
  345 |     // Verify the Create Container Page Header
  346 |     const createContainerHeader = await ob.createContainer_PageHeader().textContent();
  347 |     expect(createContainerHeader).toContain("Create container");
  348 |
  349 |     // Fill container name and description
  350 |     await ob.containerCreation_Name().fill("LocalServerContainer");
  351 |     await ob.containerCreation_Description().fill("LocalServer_Test");
  352 |
  353 |     // Click Next Button
  354 |     await ob.containerCreation_NextButton().first().click();
  355 |
  356 |     // Verify the Choose LDAP Source Page Header
  357 |     const chooseLDAPSourceHeader = await ob.chooseLDAPSource_PageHeader().textContent();
  358 |     expect(chooseLDAPSourceHeader).toContain("Choose LDAP source");
  359 |
  360 |     // Click the LDAP Alias List
  361 |     await ob.ldapSource_AliasList().click();
  362 |
  363 |     // Select Alias with Name 'easyAs'
  364 |     await ob.selectAliasWithName("easyAs");
  365 |
  366 |     // Clear and type the cnValue
  367 |     await ob.ldapSource_cnValue().clear();
  368 |     await page.waitForTimeout(2000);
  369 |     await ob.ldapSource_cnValue().fill("ou");
  370 |
  371 |     // Show Sample Data
  372 |     await ob.ldapSource__ShowSampleData().click();
  373 |
  374 |     // Close the Sample Data Dialog
  375 |     await ob.querySourceSampleData_Close().click();
  376 |
  377 |     // Save the LDAP Source
  378 |     await ob.ldapSource_SaveButton().click();
  379 |
  380 |     // Click Next Button
  381 |     await ob.containerCreation_NextButton().nth(1).click();
  382 |
  383 |     // Verify the Map Resource Attributes Page Header
  384 |     const mapResourceHeader = await ob.mapResourceAttribute_PageHeader().textContent();
  385 |     expect(mapResourceHeader).toContain("Map resource attributes");
  386 |
  387 |     // Select the Organization Model Version
  388 |     await ob.orgModel_VersionList().click();
  389 |     await ob.SelectOrgModel_Version("1").click();
  390 |
  391 |     // Click the Create LDAP Container Button
  392 |     await ob.createLDAPContainer_Button().click();
  393 |     await page.waitForTimeout(2000);
  394 |
  395 |     // Verify that the Org Browser Home Icon is visible
  396 |     const orgBrowserHomeIconVisible = await ob.OrgBrowserHomeIcon.isVisible();
  397 |     expect(orgBrowserHomeIconVisible).toBe(true);
  398 |
  399 |     // Verify the Browse Organization Tab
  400 |     const browseOrgTabText = await ob.BrowseOrganization_Tab;
  401 |     expect(await browseOrgTabText).toContainText("Browse organization");
  402 |
  403 |     // Verify that the LDAP container is visible in the list
  404 |     const localLdapNameVisible = await ob.ldapName("LocalServerContainer").isVisible();
  405 |     expect(localLdapNameVisible).toBe(true);
  406 |   });
  407 |
  408 |   test("Add resources to the Local server LDAP container", async () => {
  409 |     await page.goto(TestData.ldapContainersurl);
  410 |     await page.waitForTimeout(2000);
  411 |
  412 |     // Select server and navigate to manage containers (required before container list is shown)
  413 |     await ob.selectServer(" Local server ");
  414 |     await ob.clickonManageLdapContainerCard();
  415 |
  416 |     // Open the Local server container
> 417 |     await ob.LDAPName("LocalServerContainer").dblclick();
      |                                               ^ Error: locator.dblclick: Target page, context or browser has been closed
  418 |     await page.waitForTimeout(2000);
  419 |     // Add resource: Richard Cresswell
  420 |     await ob.selectResourceWithName("Jon Parkin");
  421 |     await ob.addSelected_Button().click();
  422 |     await ob.createResource_Button().click();
  423 |     await page.waitForTimeout(3000);
  424 |
  425 |     await customCmds.changeFilter();
  426 |   });
  427 |
  428 |   test("Create the new LDAP container for Server 2203_Automation", async () => {
  429 |     // Visit the URL
  430 |     await page.goto(TestData.orgbrowserurl);
  431 |
  432 |     // Wait for the welcome title to appear
  433 |     await page.waitForTimeout(2000);
  434 |
  435 |     // Select the server
  436 |     await ob.selectServer("2203_Automation");
  437 |
  438 |     // Click the Go Button
  439 |     await ob.goButton().first().click();
  440 |
  441 |     // Verify the Create Container Page Header
  442 |     const createContainerHeader = await ob.createContainer_PageHeader().textContent();
  443 |     expect(await createContainerHeader).toContain("Create container");
  444 |
  445 |     // Type in the container name and description
  446 |     await ob.containerCreation_Name().fill("DynamicOrg");
  447 |     await ob.containerCreation_Description().fill("DynamicOrg_Test");
  448 |
  449 |     // Click Next Button
  450 |     await ob.containerCreation_NextButton().first().click();
  451 |
  452 |     // Verify the Choose LDAP Source Page Header
  453 |     const chooseLDAPSourceHeader = await ob.chooseLDAPSource_PageHeader().textContent();
  454 |     expect(await chooseLDAPSourceHeader).toContain("Choose LDAP source");
  455 |
  456 |     // Click the LDAP Alias List
  457 |     await ob.ldapSource_AliasList().click();
  458 |
  459 |     // Select Alias with Name 'easyAs'
  460 |     await ob.selectAliasWithName("easyAs");
  461 |
  462 |     // Clear and type the cnValue
  463 |     await ob.ldapSource_cnValue().clear();
  464 |     await page.waitForTimeout(2000);
  465 |     await ob.ldapSource_cnValue().fill("ou");
  466 |
  467 |     // Show Sample Data
  468 |     await ob.ldapSource__ShowSampleData().click();
  469 |
  470 |     // Close the Sample Data Dialog
  471 |     await ob.querySourceSampleData_Close().click();
  472 |
  473 |     // Save the LDAP Source
  474 |     await ob.ldapSource_SaveButton().click();
  475 |
  476 |     // Click Next Button
  477 |     await ob.containerCreation_NextButton().nth(1).click();
  478 |
  479 |     // Verify the Map Resource Attributes Page Header
  480 |     const mapResourceHeader = await ob.mapResourceAttribute_PageHeader().textContent();
  481 |     expect(await mapResourceHeader).toContain("Map resource attributes");
  482 |
  483 |     // Select the Organization Model Version
  484 |     await ob.orgModel_VersionList().click();
  485 |     await ob.SelectOrgModel_Version("1").click();
  486 |
  487 |     // Click the Create LDAP Container Button
  488 |     await ob.createLDAPContainer_Button().click();
  489 |
  490 |     // Wait for 2 seconds
  491 |     await page.waitForTimeout(2000);
  492 |
  493 |     // Verify that the Org Browser Home Icon is visible
  494 |     const orgBrowserHomeIconVisible = await ob.OrgBrowserHomeIcon.isVisible();
  495 |     expect(orgBrowserHomeIconVisible).toBe(true);
  496 |
  497 |     // Verify the Browse Organization Tab
  498 |     const browseOrgTabText = await ob.BrowseOrganization_Tab;
  499 |     expect(await browseOrgTabText).toContainText("Browse organization");
  500 |
  501 |     // Verify that the LDAP container is visible
  502 |     const ldapNameVisible = await ob.ldapName("DynamicOrg").isVisible();
  503 |     expect(await ldapNameVisible).toBe(true);
  504 |   });
  505 |
  506 |   test('Add resources to the 2203_Automation LDAP container', async () => {
  507 |
  508 |     await page.goto(TestData.ldapContainersurl);
  509 |     // Select the server
  510 |     await ob.selectServer("2203_Automation");
  511 |     await ob.clickonManageLdapContainerCard();
  512 |
  513 |     await ob.LDAPName('DynamicOrg').dblclick();
  514 |     await page.waitForTimeout(2000);
  515 |
  516 |     await ob.selectResourceWithName('Jon Parkin'); //from worklist
  517 |     await ob.addSelected_Button().click();
```