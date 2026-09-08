import { LoginPage } from "./LoginPage";
import { HomePage } from "./HomePage";
import { BSPage } from "./BSPage";
import { BS5xPage } from "./BS5xPage";
import { DetailsPage } from "./DetailsPage";
import { Page } from "@playwright/test";
import { AdministratorPage } from "./AdministratorPage";
import { DeploymentManagerPage } from "./DeploymentManagerPage";
import { WorkListPage } from "./WorkListPage";
import { WorkViewsPage } from "./WorkViewsPage";
import { CaseManagerPage } from "./CaseManagerPage";
import { AuditPage } from "./AuditPage";
import { AuditWorkItemPage } from "./AuditWorkItemPage";
import { ProcessInstancesPage } from "./ProcessInstancesPage";
import { UserResourcesPage } from "./UserResourcesPage";
import { AuditProcessTemplatesPage } from "./AuditProcessTemplatesPage";
import { AuditApplicationsPage } from "./AuditApplicationsPage";
import { AuditSystemPage } from "./AuditSystemPage";
import { OrgBrowserPage } from "./OrgBrowserPage";
import { ProcessPage } from "./ProcessPage";
import { ConfigurationPage } from "./ConfigurationPage";
import { UserProfilePage } from "./UserProfile";
import { get } from "http";
import { LanguagePage } from "./LanguagePage";
import { LanguageAuditPage } from "./Language_AuditPage";
import { LanguageCasePage } from "./LanguageCasePage";
import { UnifiedViewsPage } from "./UnifiedViewsPage";
import { ApplicationPage } from "./ApplicationPage";
import { Audit_ProcessInstancePage_4x } from "./AuditProcessInstancePage";


export class POManager {
  loginPage: LoginPage;
  homePage: HomePage;
  bsPage: BSPage;
  bs5xPage: BS5xPage;
  detailsPage: DetailsPage;
  adminPage: AdministratorPage;
  dmPage: DeploymentManagerPage;
  wlPage: WorkListPage;
  wvPage: WorkViewsPage;
  upPage: UserProfilePage;
  obPage: OrgBrowserPage;
  cmPage: CaseManagerPage;
  adPage: AuditPage;
  adworkitempage: AuditWorkItemPage;
  adPrcoessInstacesPage: ProcessInstancesPage;
  userResourcePage: UserResourcesPage;
  adprocesstemplatespage: AuditProcessTemplatesPage;
  adapplicationspage: AuditApplicationsPage;
  adsystempage: AuditSystemPage;
  processPage: ProcessPage;
  configpage: ConfigurationPage;
  page: Page;
  langpage: LanguagePage;
  langauditpage: LanguageAuditPage;
  langcasepage: LanguageCasePage;
  unifiedViewspage: UnifiedViewsPage;
  appPage: ApplicationPage;
  Audit_Process_InstancesPage: Audit_ProcessInstancePage_4x;

  constructor(page: Page) {
    this.page = page;
    this.loginPage = new LoginPage(this.page);
    this.bsPage = new BSPage(this.page);
    this.bs5xPage = new BS5xPage(this.page);
    this.homePage = new HomePage(this.page);
    this.detailsPage = new DetailsPage(this.page);
    this.adminPage = new AdministratorPage(this.page);
    this.dmPage = new DeploymentManagerPage(this.page);
    this.processPage = new ProcessPage(this.page);
    this.wlPage = new WorkListPage(this.page);
    this.upPage = new UserProfilePage(this.page);
    this.wvPage = new WorkViewsPage(this.page);
    this.obPage = new OrgBrowserPage(this.page);
    this.cmPage = new CaseManagerPage(this.page);
    this.adPage = new AuditPage(this.page);
    this.adworkitempage = new AuditWorkItemPage(this.page);
    this.adPrcoessInstacesPage = new ProcessInstancesPage(this.page);
    this.userResourcePage = new UserResourcesPage(this.page);
    this.adprocesstemplatespage = new AuditProcessTemplatesPage(this.page);
    this.adapplicationspage = new AuditApplicationsPage(this.page);
    this.adsystempage = new AuditSystemPage(this.page);
    this.configpage = new ConfigurationPage(this.page);
    this.langpage = new LanguagePage(this.page);
    this.langauditpage = new LanguageAuditPage(this.page);
    this.langcasepage = new LanguageCasePage(this.page);
    this.unifiedViewspage = new UnifiedViewsPage(this.page);
    this.appPage = new ApplicationPage(this.page);
    this.Audit_Process_InstancesPage = new Audit_ProcessInstancePage_4x(this.page);
  }
  getWorkListPage(): WorkListPage {
    return this.wlPage;
  }
  getUserProfilePage(): UserProfilePage {
    return this.upPage;
  }
  getWorkViewsPage(): WorkViewsPage {
    return this.wvPage;
  }
  getProcessPage(): ProcessPage {
    return this.processPage;
  }
  getOrgBrowserPage(): OrgBrowserPage {
    return this.obPage;
  }
  getUserResourcesPage(): UserResourcesPage {
    return this.userResourcePage;
  }
  getCaseManagerPage(): CaseManagerPage {
    return this.cmPage;
  }
  getLoginPage(): LoginPage {
    return this.loginPage;
  }
  getAdminPage(): AdministratorPage {
    return this.adminPage;
  }
  getDMPage(): DeploymentManagerPage {
    return this.dmPage;
  }
  getHomePage(): HomePage {
    return this.homePage;
  }

  getBSPage(): BSPage {
    return this.bsPage;
  }

  getBS5xPage(): BS5xPage {
    return this.bs5xPage;
  }
  getDetailsPage(): DetailsPage {
    return this.detailsPage;
  }
  getAuditPage(): AuditPage {
    return this.adPage;
  }
  getAuditWorkItemPage(): AuditWorkItemPage {
    return this.adworkitempage;
  }
  getAuditPrcoessInstancesPage(): ProcessInstancesPage {
    return this.adPrcoessInstacesPage;
  }
  getAuditProcessTemplatesPage(): AuditProcessTemplatesPage {
    return this.adprocesstemplatespage;
  }
  getApplicationsPage(): AuditApplicationsPage {
    return this.adapplicationspage;
  }
  getSystemPage(): AuditSystemPage {
    return this.adsystempage;
  }
  getConfigurationPage() {
    return this.configpage;
  }
  getUnifiedViewsPage() {
    return this.unifiedViewspage;
  }
  getLanguagePage() {
    return this.langpage;
  }
  getLanguageAuditPage() {
    return this.langauditpage;
  }
  getLanguageCasePage() {
    return this.langcasepage;
  }
  getApplicationPage() {
    return this.appPage;
  }
  getAudit_Process_InstancesPage() {
    return this.Audit_Process_InstancesPage;
  }
}
module.exports = { POManager };
