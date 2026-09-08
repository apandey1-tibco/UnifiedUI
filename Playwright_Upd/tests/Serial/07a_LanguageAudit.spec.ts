import { test, expect, Page, Locator, Browser } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import * as utility from "../../fixtures/utility";
import { LanguageAuditPage } from "../../PageObjects/Language_AuditPage";
import { ConfigurationPage } from "../../PageObjects/ConfigurationPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { ProcessPage } from "../../PageObjects/ProcessPage";
import { HomePage } from "../../PageObjects/HomePage";
import { WorkListPage } from "../../PageObjects/WorkListPage";
import { CaseManagerPage } from "../../PageObjects/CaseManagerPage";
import { AuditPage } from "../../PageObjects/AuditPage";
import { ProcessInstancesPage } from "../../PageObjects/ProcessInstancesPage";
import { WorkViewsPage } from "../../PageObjects/WorkViewsPage";
import { UserProfilePage } from "../../PageObjects/UserProfile";
import { log } from "console";
import { LoginPage } from "../../PageObjects/LoginPage";
import exp from "constants";


const dataset = JSON.parse(
  JSON.stringify(require("../../fixtures/TestData.json"))
);

let page: Page;
let poManager: POManager;
let adminPage: AdministratorPage;
let dmPage: DeploymentManagerPage;
let processPage: ProcessPage;
let configPage: ConfigurationPage;
let cmPage: CaseManagerPage;
let adPage: AuditPage;
let adPrcoessInstacesPage: ProcessInstancesPage;
let wv: WorkViewsPage;
let wlPage: WorkListPage;
let upPage: UserProfilePage;
let homePage: HomePage;
let caseManager: CaseManagerPage;
let loginPage: LoginPage;
let langauditpage: LanguageAuditPage;

test.beforeEach(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  adPage = poManager.getAuditPage();
  loginPage = poManager.getLoginPage();
  dmPage = poManager.getDMPage();
  adminPage = poManager.getAdminPage();
  processPage = poManager.getProcessPage();
  configPage = poManager.getConfigurationPage();
  cmPage = poManager.getCaseManagerPage();
  adPrcoessInstacesPage = poManager.getAuditPrcoessInstancesPage();
  wv = poManager.getWorkViewsPage();
  wlPage = poManager.getWorkListPage();
  upPage = poManager.getUserProfilePage();
  homePage = poManager.getHomePage();
  caseManager = poManager.getCaseManagerPage();
  langauditpage = poManager.getLanguageAuditPage();
  await page.goto(dataset.workMangerUrl);
  await page.waitForLoadState("domcontentloaded");
  await langauditpage.clickOnSetting();
  await langauditpage.clickOnLanguage();
  await page.waitForTimeout(1000);
});

test.afterEach(async () => {
  await page.close();
});

test.describe("Audit list - Language Screen Test", () => {
  test.only("Navigate to Language -> Audit list Screen and validate all fields", async () => {

    //Check and click on Audit List component
    expect(langauditpage.auditList).toBeVisible();
    await langauditpage.clickOnAuditListComponent();

    //Validate all Fields are present
    expect(langauditpage.auditText).toBeVisible();
  });

  test.only("Verify that the updated field changes in the Audit List component are reflected correctly on the Audit screen", async () => {
  
    expect(langauditpage.auditList).toBeVisible();
    await langauditpage.clickOnAuditListComponent();
    expect(langauditpage.auditText).toBeVisible();
    expect(langauditpage.auditTextField).toBeVisible();

    //Update and save the fields
    await langauditpage.updatingTheFields_AuditList();
    await langauditpage.clickOnSaveButton();

    //Verify the updated fields
    await langauditpage.clickOnAudit();
    const text = await langauditpage.verifyTheUpdatedFields_AuditList();
    expect(text).toContain('updated');
  });

  test.only("Revert the updated field changes in the Audit List component", async () => {
    
    expect(langauditpage.auditList).toBeVisible();
    await langauditpage.clickOnAuditListComponent();
    expect(langauditpage.auditText).toBeVisible();
    expect(langauditpage.auditTextField).toBeVisible();

    //Revert the changes and save
    await langauditpage.revertTheUpdatedFields_AuditList();
    await langauditpage.clickOnSaveButton();
  });
});