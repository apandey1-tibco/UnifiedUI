# Test info

- Name: Cases e2e suite >> To verify Work items under Case Details
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:312:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for getByText('Work items').first()

    at CaseManagerPage.clickOnWorkItems (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\CaseManagerPage.ts:908:53)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:314:18
```

# Test source

```ts
   808 |
   809 |   async clickSaveChanges() {
   810 |     await this.saveChangesBtn.waitFor({ state: "visible", timeout: 5000 });
   811 |     await this.saveChangesBtn.click();
   812 |     await this.page.waitForTimeout(2000);
   813 |   }
   814 |
   815 |   async fillSaveSearchForm(name: string, description: string, category: string) {
   816 |     await this.saveSearchNameInput.fill(name);
   817 |     await this.saveSearchDescriptionInput.fill(description);
   818 |     await this.saveSearchCategoryInput.fill(category);
   819 |     await this.page.waitForTimeout(2000);
   820 |   }
   821 |
   822 |   async clickOnCaseFilterIcon() {
   823 |     await this.filterIcon.click();
   824 |     await this.page.waitForTimeout(2000);
   825 |   }
   826 |
   827 |   async clickOnSaveSearches() {
   828 |     await this.saveSearches.click();
   829 |     await this.page.waitForTimeout(2000);
   830 |   }
   831 |
   832 |   async clickOnCreateAdvanceCaseSearch() {
   833 |     await this.createAdvancedCaseSearch.click();
   834 |     await this.page.waitForTimeout(2000);
   835 |   }
   836 |
   837 |   async clickOnNextBtn() {
   838 |     await this.next.click();
   839 |     await this.page.waitForTimeout(2000);
   840 |   }
   841 |
   842 |   async clickOnFinishBtn() {
   843 |     await this.finish.click();
   844 |     await this.page.waitForTimeout(2000);
   845 |   }
   846 |
   847 |   //Case Details
   848 |   //Linked Cases
   849 |   async clickOnLinkedCases() {
   850 |     await this.page.getByText("Linked cases").first().click();
   851 |   }
   852 |   async linkedCaseHeader() {
   853 |     return await this.page
   854 |       .locator("twc-header[label='Linked cases']")
   855 |       .locator(".header__title")
   856 |       .innerText();
   857 |   }
   858 |   async linkedCase(): Promise<Locator> {
   859 |     return this.page.locator("bpme-case-linked-cases").locator("twc-list-item");
   860 |   }
   861 |
   862 |   async linkedCaseEmptyState(): Promise<Locator> {
   863 |     return this.page.locator('bpme-case-linked-cases div[part="empty-label"]');
   864 |   }
   865 |   async workItemsEmptyState(): Promise<Locator> {
   866 |     return this.page.locator("bpme-case-work-items >> div.empty-label");
   867 |   }
   868 |   async documentsEmptyState(): Promise<Locator> {
   869 |     return this.page.locator("bpme-case-documents >> div.empty-label");
   870 |   }
   871 |   async caseTypesEmptyState(): Promise<Locator> {
   872 |     return this.page.locator("bpme-empty-data-message >> div.empty-message");
   873 |   }
   874 |   async getCaseDocumentsVersion(): Promise<Locator> {
   875 |     return this.page.locator('div[slot="subText"]').locator('div').nth(2);
   876 |   }
   877 |   async getDisplayInlineParts(): Promise<string> {
   878 |     // get the 2nd display-inline (index 1 because nth is 0-based)
   879 |     const fullText = await this.page.locator('div.display-inline').nth(1).innerText();
   880 |     return fullText;
   881 |   }
   882 |
   883 |   async getLastUpdatedByText(): Promise<string> {
   884 |     // get the 2nd display-inline (index 1 because nth is 0-based)
   885 |     const fullText = await this.docViewerLastUpdateBy.innerText();
   886 |     return fullText;
   887 |   }
   888 |   async caseDocsCancelButtonText() {
   889 |     return await await this.page
   890 |       .locator("twc-button[type='button'][slot='cancel']")
   891 |       .innerText();
   892 |   }
   893 |   async caseDocsDeleteConfirmationButtonText() {
   894 |     return await await this.page
   895 |       .locator("twc-button[type='button'][slot='confirm']")
   896 |       .innerText();
   897 |   }
   898 |
   899 |   async linkedCaseState() {
   900 |     return await this.page
   901 |       .locator(
   902 |         ".component.control.control_AdditionalOrder_caseState1.control-label.control-non-list-mode.read-only"
   903 |       )
   904 |       .innerText();
   905 |   }
   906 |   //Case Details-- Work items
   907 |   async clickOnWorkItems() {
>  908 |     await this.page.getByText("Work items").first().click();
       |                                                     ^ Error: locator.click: Target page, context or browser has been closed
   909 |     await this.page.waitForTimeout(1000);
   910 |   }
   911 |   async workItemsHeader() {
   912 |     return await this.page
   913 |       .locator("twc-header[label='Work items']")
   914 |       .locator(".header__title")
   915 |       .innerText();
   916 |   }
   917 |   async workItem(): Promise<Locator> {
   918 |     //return this.page.locator('//twc-sidebar[@label="Work items"]//twc-list-item[@role="menuitem"]');
   919 |     return this.page.locator('twc-list-item[role="menuitem"]').filter({ hasText: 'ViewLinkedCaseData' });
   920 |   }
   921 |
   922 |   async linkedWorkItem(linkedWorkItem: string): Promise<Locator> {
   923 |     //return this.page.locator('//twc-sidebar[@label="Work items"]//twc-list-item[@role="menuitem"]');
   924 |     return this.page.locator('twc-list-item[role="menuitem"]').filter({ hasText: linkedWorkItem });
   925 |   }
   926 |
   927 |   async clickOnWorkItemCancelBtn() {
   928 |     await this.workItemCancelBtn.click();
   929 |   }
   930 |
   931 |   async closeWorkItem() {
   932 |     await this.page.getByRole("button", { name: "Close" }).click();
   933 |     await this.closeBtn.click();
   934 |   }
   935 |   async closeRightSidePane() {
   936 |     await this.page.getByRole("button", { name: "Close" }).click();
   937 |     await this.page.waitForTimeout(1000);
   938 |   }
   939 |   //Case Details Audit
   940 |   async clickOnAudit() {
   941 |     await this.page.locator("[name='case-audit']").click();
   942 |   }
   943 |   async auditHeader() {
   944 |     return await this.page
   945 |       .locator("twc-header[label='Audit']")
   946 |       .locator(".header__title")
   947 |       .innerText();
   948 |   }
   949 |
   950 |   async auditTextContent() {
   951 |     return await this.page.locator(".audit-template").innerText();
   952 |   }
   953 |   async clickOnDownArrow() {
   954 |     await this.page.locator("twc-icon[name='chevron-down'][slot='trailing-close']").first().click();
   955 |   }
   956 |   async verifyAuditExpandedSection(caseState1: string, firstName: string, lastName: string) {
   957 |     const tibcoForm = this.page.locator('tibco-form[json2formdata]').first();
   958 |     await tibcoForm.waitFor({ state: 'attached', timeout: 15000 });
   959 |     const formDataStr = await tibcoForm.getAttribute('json2formdata');
   960 |     const formData = JSON.parse(formDataStr || '{}');
   961 |     expect(formData.caseState1).toBe(caseState1);
   962 |     expect(formData.firstName).toBe(firstName);
   963 |     expect(formData.lastName).toBe(lastName);
   964 |   }
   965 |   //Case Documents
   966 |   async clickOnDocuments() {
   967 |     await this.page.locator("twc-navmenu-item[label='Documents']").click();
   968 |   }
   969 |   async docHeader() {
   970 |     return await this.page
   971 |       .locator("twc-header[label='Documents']")
   972 |       .locator(".header__title")
   973 |       .innerText();
   974 |   }
   975 |   async uploadBtn(): Promise<Locator> {
   976 |     return this.page.locator('twc-button.upload-button');
   977 |   }
   978 |   async docUploadSuccessMsg(docName: string): Promise<Locator> {
   979 |     return this.page.locator(
   980 |       '//div[contains(text(),"Document ' +
   981 |       docName +
   982 |       ' uploaded to the case. You can ")]'
   983 |     );
   984 |   }
   985 |
   986 |   async alertMsg() {
   987 |     return await this.page.locator("twc-alert").textContent();
   988 |   }
   989 |
   990 |   async caseDocumentUpload(desc: string, fileName: string) {
   991 |     (await this.uploadBtn()).click();
   992 |     await this.page.waitForTimeout(500);
   993 |     await this.page.locator("#document-description #input").fill(desc);
   994 |     //uploading doc
   995 |     await this.page.setInputFiles(
   996 |       'input[type="file"]',
   997 |       `./fixtures/${fileName}`
   998 |     );
   999 |     //Upload btn
  1000 |     await this.page.locator(".action-buttons twc-button").last().click();
  1001 |     await this.page.waitForTimeout(1000);
  1002 |     //Done btn
  1003 |     await this.page.locator(".cancel-button").click();
  1004 |   }
  1005 |   async docLists() {
  1006 |     return await this.documentList.innerText();
  1007 |   }
  1008 |   async uploadDocConatinerText() {
```