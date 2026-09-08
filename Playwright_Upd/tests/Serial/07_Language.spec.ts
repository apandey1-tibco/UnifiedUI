import { test, expect, Page, Locator, Browser } from "@playwright/test";
import { POManager } from "../../PageObjects/POManager";
import * as utility from "../../fixtures/utility";
import { LanguagePage } from "../../PageObjects/LanguagePage";
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
let langpage: LanguagePage;

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
  langpage = poManager.getLanguagePage();
});

test.afterEach(async () => {
  await page.close();
});

test.describe("Language Screen Basic Test", () => {
  test("Navigate to Language Screen and validate all fields", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langpage.clickOnSetting();
    await langpage.clickOnLanguage();
    await page.waitForTimeout(1000);
    await expect(langpage.languageTitle).toHaveText("Languages");
    await page.waitForTimeout(1000);

    const visibilityElements = [
          langpage.adhocActivites,
          langpage.applicationsSwitcher,
          langpage.auditDetailsManagedObjects,
          langpage.auditListManagedObjects,
          langpage.businessService,
          langpage.caseAudit,
          langpage.caseDetails,
          langpage.caseDocuments,
          langpage.caseDocumentsViewer,
          langpage.caseLinkedCases,
        ];
    
        for (const element of visibilityElements) {
          await expect(element).toBeVisible();
        }
  });

  test("verify Englist is default language", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langpage.clickOnSetting();
    await langpage.clickOnLanguage();
    await page.waitForTimeout(1000);
    expect(langpage.defaultLanguage).toContainText("English");
    expect(langpage.defaultLanguage).toContainText("Default");
  });
});

test.describe("Ad-hoc Activties- Language Screen Test", () => {
  test.only("Navigate to Language Screen and validate all fields", async () => {
    await page.goto(dataset.workMangerUrl);
    await page.waitForLoadState("domcontentloaded");
    await langpage.clickOnSetting();
    await langpage.clickOnLanguage();
    await page.waitForTimeout(1000);
    expect(langpage.adhocActivites).toHaveAttribute("aria-selected", "true");
    expect(langpage.searchInputPlaceholder).toBeVisible();
  });
});
