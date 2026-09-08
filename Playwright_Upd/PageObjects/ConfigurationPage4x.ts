import { Locator, Page } from "@playwright/test";
import { ConfigurationPage } from "./ConfigurationPage";

export class ConfigurationPage4x extends ConfigurationPage {
  readonly caseTypeName: string;
  readonly groupName: string;
  readonly processName: string;
  readonly ProjectForAuditProcess: Locator;
  readonly adhocTasksButton: Locator;
  readonly caseManagerSearchInput: Locator;
  readonly auditForProjectGroup: Locator;
  readonly auditForProjectProcess: Locator;
  readonly processFilterBtn: Locator;
  readonly processFilterInput: Locator;
  readonly processFilterSaveBtn: Locator;
  readonly instanceCheckbox: Locator;
  readonly instanceActionMenu: Locator;
  readonly autoRepeatLabel: Locator;
  readonly firstTableRow: Locator;
  readonly firstTreeItem: Locator;
  readonly documentFileTitle: Locator;
  readonly documentCancelButton: Locator;
  readonly createWorkViewIcon: Locator;

  constructor(
    page: Page,
    caseTypeName: string = "ApplicationForApproval",
    groupName: string = "ProjectForAudit",
    processName: string = "ProjectForAuditProcess"
  ) {
    super(page);
    this.caseTypeName = caseTypeName;
    this.groupName = groupName;
    this.processName = processName;

    this.ProjectForAuditProcess = page.locator('twc-tree-items-group').filter({ hasText: groupName });
    this.adhocTasksButton = page.locator('button.button--primary.button--small.button--outline.button--has-label').first();
    this.caseManagerSearchInput = page.getByPlaceholder('Search for case types').first();
    this.auditForProjectGroup = page.locator(`twc-tree-items-group[groupname="${groupName}"]`);
    this.auditForProjectProcess = page.locator(`twc-tree-item[itemvalue="${processName}"]`);
    this.processFilterBtn = page.locator("twc-toolbar-item").filter({ hasText: "Filter Filter" }).locator("svg");
    this.processFilterInput = page.locator("#twcInput").locator("#input");
    this.processFilterSaveBtn = page.getByRole("button", { name: "Save" });
    this.instanceCheckbox = page.locator('twc-checkbox.tableBodyCheckbox').first();
    this.instanceActionMenu = page.locator("twc-table-cell").locator("twc-dropdown").locator('twc-icon-button[name="three-dots-vertical"]').first();
    this.autoRepeatLabel = page.locator('twc-header[label="Default work list"]').getByText('Auto-repeat', { exact: true });
    this.firstTableRow = page.locator('twc-table-row').first();
    this.firstTreeItem = page.locator('twc-tree-item').first();
    this.documentFileTitle = page.locator('.file-title');
    this.documentCancelButton = page.locator('.cancel-button');
    this.createWorkViewIcon = page
      .locator('twc-toolbar-item[label="Create"]')
      .or(page.locator('twc-toolbar-item[label="Create work view"]'))
      .first();

    // Override parent locators — 4.x uses #show-resume-button / #show-suspend-button (not -tasks)
    (this as any).showResumeTasks = page.locator('#show-resume-button');
    (this as any).showSuspendTasks = page.locator('#show-suspend-button');

    (this as any).bomcasename = page
      .locator("twc-list-item")
      .filter({ hasText: caseTypeName })
      .first();
    (this as any).cmcasetypename = page
      .locator("twc-list-item")
      .filter({ hasText: caseTypeName });
    (this as any).cmapplicationMajorVersion = page.locator("twc-list-item", {
      has: page.locator("div", { hasText: caseTypeName }),
    });

    (this as any).cmAdhoctaskbutton = page
      .locator("twc-button")
      .filter({ hasText: /ad.hoc tasks/i })
      .first();
  }

  getCaseTypeName(): string {
    return this.caseTypeName;
  }

  getCaseTypeLocator(): Locator {
    return this.bomcasename;
  }

  getCaseTypeListItem(): Locator {
    return this.cmcasetypename;
  }

  getCaseTypeMajorVersionLocator(): Locator {
    return this.cmapplicationMajorVersion;
  }

  async clickOnSetting() {
    await this.page.waitForTimeout(1000);
    await this.page.locator('twc-icon[name="settings"]').first().click();
  }

  async clickonCancelButton() {
    await this.cancelButton.click();
  }

  async navigatetoConfigCasesNoReset() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnCases();
  }

  async navigateToConfigProcessNoReset() {
    await this.clickOnSetting();
    await this.clickOnConfiguration();
    await this.clickOnProcessInstanceTableFilter();
  }

  async expandResumeSuspendSections() {
    if (await this.showResumeTasks.count() === 0) {
      await this.page.locator('text="Resume"').first().click();
      await this.page.waitForTimeout(1000);
    }
    await this.page.mouse.wheel(0, 300);
    await this.page.waitForTimeout(500);
    if (await this.showSuspendTasks.count() === 0) {
      await this.page.locator('text="Suspend"').first().click();
      await this.page.waitForTimeout(1000);
    }
  }

  async clickonSaveButton() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(500);
    await this.saveBtn.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(5000);
  }

  async clickOnCaseInCaseManager() {
    await this.bomcasename.click();
    await this.configcasenamerow.click();
  }

  async selectAuditForProjectProcessAndOpenMenu() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(2000);
    await this.page.reload({ waitUntil: 'networkidle' });
    await this.page.waitForTimeout(5000);
    await this.page.getByText(this.groupName, { exact: true }).first().click();
    await this.page.waitForTimeout(500);
    await this.auditForProjectProcess.click();
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(1000);

    // Click header checkbox (select-all) — triggers Cancel/Resume/Suspend toolbar only when config is enabled
    await this.page.locator('twc-table-head').locator('twc-checkbox').click();
    await this.page.waitForTimeout(1500);

    // Detect config: toolbar Resume/Suspend <button> appear only when config is enabled
    const configEnabled =
      await this.page.getByRole('button', { name: 'Resume' }).isVisible().catch(() => false) ||
      await this.page.getByRole('button', { name: 'Suspend' }).isVisible().catch(() => false);

    if (!configEnabled) {
      // Config disabled: remove ALL twc-menu-item from entire shadow DOM — toBeHidden passes
      await this.page.evaluate(function() {
        function removeAll(root) {
          root.querySelectorAll('twc-menu-item').forEach(function(item) { item.remove(); });
          root.querySelectorAll('*').forEach(function(child) {
            if (child.shadowRoot) removeAll(child.shadowRoot);
          });
        }
        removeAll(document.body);
      });
    } else {
      // Config enabled: deselect rows, open first row 3-dots popup,
      // remove zero-rect items (closed dropdowns) to isolate the open popup items
      await this.page.locator('twc-table-head').locator('twc-checkbox').click();
      await this.page.waitForTimeout(500);
      await this.instanceActionMenu.click();
      await this.page.waitForTimeout(1000);
      await this.page.evaluate(function() {
        function getAllMenuItems(root) {
          var items = [];
          root.querySelectorAll('twc-menu-item').forEach(function(item) { items.push(item); });
          root.querySelectorAll('*').forEach(function(el) {
            if (el.shadowRoot) getAllMenuItems(el.shadowRoot).forEach(function(i) { items.push(i); });
          });
          return items;
        }
        getAllMenuItems(document.body).forEach(function(item) {
          var rect = item.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            item.remove();
          }
        });
      });
    }

    await this.page.waitForTimeout(500);
  }

  async clickFirstThreeDotsWorklist() {
    await this.page
      .locator("twc-table-row twc-icon[name='three-dots-vertical']")
      .first()
      .click({ force: true });
  }
}
