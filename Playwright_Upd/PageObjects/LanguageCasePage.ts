import { expect, Locator, Page } from "@playwright/test";
import * as utility from "../fixtures/utility";

export class LanguageCasePage {
    readonly page: Page;
    //Language main screen
    readonly setting: Locator;
    readonly settingmenu: Locator;
    readonly languageBtn: Locator;
    readonly languageTitle: Locator;
    readonly defaultLanguage: Locator;

    //Case linked cases
    readonly caseLinkedCases: Locator;
    readonly noLinkedCases: Locator;

    //save button
    readonly saveButton: Locator;

    //Case states
    readonly caseStates: Locator;
    readonly moreStatesButton: Locator;

    //Case work items
    readonly caseWorkItems: Locator;
    readonly noCaseWorkItems: Locator;

    //Case documents
    readonly caseDocuments: Locator;
    readonly caseDocumentsUploadButton: Locator;
    readonly caseDocumentsCancelButton: Locator;
    readonly caseDocumentsDeleteButton: Locator;
    readonly caseDocumentsEmptyState: Locator;
    readonly caseDocumentsSearchEmptyState: Locator;
    readonly caseDocumentsDialogHeader: Locator;
    readonly caseDocumentsDeleteConfiguration: Locator;
    readonly caseDocumentsUpdatedBy: Locator;
    readonly caseDocumentsTimePrefix: Locator;
    readonly caseDocumentsDocumentVersion: Locator;
    readonly caseDocumentsDelete: Locator;
    readonly caseDocumentsDeleteDescription: Locator;
    readonly caseDocumentsDownload: Locator;
    readonly caseDocumentsDownloadDescription: Locator;

    //Case types
    readonly caseTypes: Locator;
    readonly caseTypesEmptyState: Locator;
    readonly caseTypesRefresh: Locator;
    readonly caseTypesRefreshDescription: Locator;
    readonly caseTypesName: Locator;
    readonly caseTypesNameDescription: Locator;
    readonly caseTypesApplicationMajorVersion: Locator;
    readonly caseTypesApplicationMajorVersionDescription: Locator;

    //Case document viewer
    readonly caseDocumentViewer: Locator;
    readonly caseDocumentViewerDownloadButton: Locator;
    readonly caseDocumentViewerDocumentDetails: Locator;
    readonly caseDocumentViewerDocumentDescription: Locator;
    readonly caseDocumentViewerLastUpdate: Locator;
    readonly caseDocumentViewerTimePrefix: Locator;
    readonly caseDocumentViewerUpdatedBy: Locator;
    readonly caseDocumentViewerDescriptionContainer: Locator;
    readonly caseDocumentViewerDescriptionContainerDescription: Locator;


    constructor(page: Page) {

        this.page = page;
        //Language main screen
        this.setting = page.locator('twc-icon[name="settings"]');
        this.settingmenu = page.locator('twc-menu[role$="menu"]');
        this.languageBtn = page.locator('twc-menu-item[value$="languages"]');
        this.languageTitle = page.locator('div[title = "Languages"]');
        this.defaultLanguage = page.locator('twc-list-item[value="en"]');

        //save button
        this.saveButton = page.locator("bpme-language-keys").locator(".language-keys-container").locator(".keys-toolbar").locator("twc-button").first().locator("button");

        //Case linked cases
        this.caseLinkedCases = page.locator('twc-list-item[value="caseLinkedCases"]');
        this.noLinkedCases = page.locator(".input-container").locator(".key-input-label").getByText("Empty state");

        //Case states
        this.caseStates = page.locator('twc-list-item[value="caseStates"]');
        this.moreStatesButton = page.locator(".input-container").locator(".key-input-label").getByText("More States button");

        //Case work items
        this.caseWorkItems = page.locator('twc-list-item[value="caseWorkItems"]');
        this.noCaseWorkItems = page.locator(".input-container").locator(".key-input-label").getByText("Empty state");

        //Case documents
        this.caseDocuments = page.locator('twc-list-item[value="caseDocuments"]');
        this.caseDocumentsUploadButton = page.locator(".input-container").locator(".key-input-label").getByText('Upload button', { exact: true });
        this.caseDocumentsCancelButton = page.locator(".input-container").locator(".key-input-label").getByText('Cancel button', { exact: true });
        this.caseDocumentsDeleteButton = page.locator(".input-container").locator(".key-input-label").getByText('Delete button', { exact: true });
        this.caseDocumentsEmptyState = page.locator(".input-container").locator(".key-input-label").getByText('Empty state', { exact: true });
        this.caseDocumentsSearchEmptyState = page.locator(".input-container").locator(".key-input-label").getByText('Search empty state', { exact: true });
        this.caseDocumentsDialogHeader = page.locator(".input-container").locator(".key-input-label").getByText('Dialog header', { exact: true });
        this.caseDocumentsDeleteConfiguration = page.locator(".input-container").locator(".key-input-label").getByText('Delete configuration', { exact: true });
        this.caseDocumentsUpdatedBy = page.locator(".input-container").locator(".key-input-label").getByText('Updated by', { exact: true });
        this.caseDocumentsTimePrefix = page.locator(".input-container").locator(".key-input-label").getByText('Time prefix', { exact: true });
        this.caseDocumentsDocumentVersion = page.locator(".input-container").locator(".key-input-label").getByText('Document version', { exact: true });
        this.caseDocumentsDelete = page.locator(".input-container").locator(".key-input-label").getByText('Delete', { exact: true });
        this.caseDocumentsDeleteDescription = page.locator(".input-container").locator(".key-input-label").getByText('Delete description', { exact: true });
        this.caseDocumentsDownload = page.locator(".input-container").locator(".key-input-label").getByText('Download', { exact: true });
        this.caseDocumentsDownloadDescription = page.locator(".input-container").locator(".key-input-label").getByText('Download description', { exact: true });  
        
        //Case types
        this.caseTypes = page.locator('twc-list-item[value="caseType"]');
        this.caseTypesEmptyState = page.locator(".input-container").locator(".key-input-label").getByText('Empty state', { exact: true });
        this.caseTypesRefresh = this.caseTypesEmptyState = page.locator(".input-container").locator(".key-input-label").getByText('Refresh', { exact: true });
        this.caseTypesRefreshDescription = this.caseTypesEmptyState = page.locator(".input-container").locator(".key-input-label").getByText('Refresh description', { exact: true });
        this.caseTypesName = page.locator(".input-container").locator(".key-input-label").getByText('Name', { exact: true });
        this.caseTypesNameDescription = page.locator(".input-container").locator(".key-input-label").getByText('Name description', { exact: true });
        this.caseTypesApplicationMajorVersion = page.locator(".input-container").locator(".key-input-label").getByText('Application major version', { exact: true });
        this.caseTypesApplicationMajorVersionDescription = page.locator(".input-container").locator(".key-input-label").getByText('Application major version description', { exact: true });

        //Case document viewer
        this.caseDocumentViewer = page.locator('twc-list-item[value="caseDocumentsViewer"]');
        this.caseDocumentViewerDownloadButton = page.locator(".input-container").locator(".key-input-label").getByText('Download button', { exact: true });
        this.caseDocumentViewerDocumentDetails = page.locator(".input-container").locator(".key-input-label").getByText('Document details', { exact: true });
        this.caseDocumentViewerDocumentDescription = page.locator(".input-container").locator(".key-input-label").getByText('Document description', { exact: true });
        this.caseDocumentViewerLastUpdate = page.locator(".input-container").locator(".key-input-label").getByText('Last update', { exact: true });
        this.caseDocumentViewerTimePrefix = page.locator(".input-container").locator(".key-input-label").getByText('Time prefix', { exact: true });
        this.caseDocumentViewerUpdatedBy = page.locator(".input-container").locator(".key-input-label").getByText('Updated by', { exact: true });
        this.caseDocumentViewerDescriptionContainer = page.locator(".input-container").locator(".key-input-label").getByText('Description container', { exact: true });
        this.caseDocumentViewerDescriptionContainerDescription = page.locator(".input-container").locator(".key-input-label").getByText('Description container description', { exact: true });
            
    }

    //Setting screen Navigation
    async clickOnSetting() {
        await this.page.waitForTimeout(1000);
        await this.setting.click();
    }
    async clickOnsettingMenu() {
        await this.page.waitForTimeout(1000);
        await this.settingmenu.click();
    }
    async clickOnLanguage() {
        await this.languageBtn.click();
    }
    async clickOnCaseLinkedCasesComponent() {
        await this.page.waitForTimeout(1000);
        await this.caseLinkedCases.click();
    }
    async clickOnCaseStatesComponent() {
        await this.page.waitForTimeout(1000);
        await this.caseStates.click();
    }
    async clickOnCaseWorkItemsComponent() {
        await this.page.waitForTimeout(1000);
        await this.caseWorkItems.click();
    }
    async clickOnCaseDocumentsComponent() {
        await this.page.waitForTimeout(1000);
        await this.caseDocuments.click();
    }
    async clickOnCaseTypesComponent() {
        await this.page.waitForTimeout(2000);
        await this.caseTypes.click();
    }
    async clickOnCaseDocumentViewerComponent() {
        await this.page.waitForTimeout(2000);
        await this.caseDocumentViewer.click();
    }

    getInputByLabel(labelText: string): Locator {
        return this.page.locator(`text="${labelText}"`).locator('..').locator('twc-input').locator('input');
    }

    async updateField(label: string, value: string) {
        const input = this.getInputByLabel(label);
        await input.scrollIntoViewIfNeeded();
        await expect(input).toBeVisible();
        await input.fill("");
        await input.pressSequentially(value);
    }

    async clickOnSaveButton() {
        await this.page.waitForTimeout(4000);
        await this.saveButton.click();
        await this.page.waitForTimeout(3000);
    }
}