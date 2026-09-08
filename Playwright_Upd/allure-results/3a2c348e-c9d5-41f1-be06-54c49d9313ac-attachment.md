# Test info

- Name: Cases e2e suite >> To verify document upload for PDF format
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:395:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('twc-navmenu-item[label=\'Documents\']')

    at CaseManagerPage.clickOnDocuments (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\CaseManagerPage.ts:967:68)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\05_UnifiedUIe2e4x.spec.ts:399:18
```

# Test source

```ts
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
   908 |     await this.page.getByText("Work items").first().click();
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
>  967 |     await this.page.locator("twc-navmenu-item[label='Documents']").click();
       |                                                                    ^ Error: locator.click: Target page, context or browser has been closed
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
  1009 |     return await this.page
  1010 |       .locator(".upload-dialog-wrapper")
  1011 |       .locator("#title")
  1012 |       .innerText();
  1013 |   }
  1014 |
  1015 |   async getUploadedDocLocator(fileName: string): Promise<Locator> {
  1016 |     const locator = this.page.locator('twc-list-item', { hasText: fileName });
  1017 |     await locator.waitFor({ state: 'visible' }); // ensure element is visible
  1018 |     return locator;
  1019 |   }
  1020 |   //Delete document
  1021 |   async searchDocument(docName: string) {
  1022 |     await this.page
  1023 |       .locator("bpme-case-documents")
  1024 |       .getByRole("textbox")
  1025 |       .fill(docName);
  1026 |     await this.page
  1027 |       .locator("bpme-case-documents")
  1028 |       .getByRole("textbox")
  1029 |       .press("Enter");
  1030 |   }
  1031 |   async clickOnDeleteIcon(docName: string) {
  1032 |     const docItem = this.page
  1033 |       .locator("twc-list-item")
  1034 |       .filter({ hasText: docName });
  1035 |     await docItem.hover();
  1036 |     await docItem.locator('twc-icon[name="trash3"]').click();
  1037 |   }
  1038 |   async documentDeleteHeader() {
  1039 |     return await this.page
  1040 |       .locator(".delete-dialog.bpm-designer-scrollbar")
  1041 |       .locator("div[slot='labelText']")
  1042 |       .innerText();
  1043 |   }
  1044 |   async delDocumentConfirmationTxt() {
  1045 |     return await this.page
  1046 |       .locator(".delete-dialog.bpm-designer-scrollbar")
  1047 |       .locator("div[slot='bodyHeader']")
  1048 |       .innerText();
  1049 |   }
  1050 |   async clickOnCancelBtn() {
  1051 |     await this.page
  1052 |       .locator("twc-button[type='button'][slot='cancel'] .button__label")
  1053 |       .click();
  1054 |   }
  1055 |   async clickOnYesDelete() {
  1056 |     await this.page
  1057 |       .locator("twc-button[type='button'][slot='confirm']")
  1058 |       .click();
  1059 |     await this.page.waitForTimeout(1000);
  1060 |   }
  1061 |   async documentConatiner() {
  1062 |     return await this.page
  1063 |       .locator(".documents-container .empty-label")
  1064 |       .innerText();
  1065 |   }
  1066 |   async cancelButton(): Promise<Locator> {
  1067 |     return this.page.locator(".cancel-button");
```