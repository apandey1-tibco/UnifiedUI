# Test info

- Name: Buisness Services Regression suite >> Test for buisnes services
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:47:7

# Error details

```
Error: locator.click: Target page, context or browser has been closed
Call log:
  - waiting for locator('twc-list-item').filter({ hasText: '2203_Automation' })

    at CaseManagerPage.selectServerFromGlobalSwitcher (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\CaseManagerPage.ts:1075:24)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\04_BuisnessServices.spec.ts:51:5
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - complementary
  - button "Local sever":
    - text: Local sever
    - img
  - dialog:
    - text: Systems list
    - menu:
      - text: Select a view for all components
      - menuitem "Local sever"
  - dialog "Business Services": Business Services BS_AllTypes
  - separator "Resize"
- iframe
```

# Test source

```ts
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
  1068 |   }
  1069 |   async chooseFileBtn(): Promise<Locator> {
  1070 |     return this.page.locator("#fileInputElement");
  1071 |   }
  1072 |   async selectServerFromGlobalSwitcher(serverName: string) {
  1073 |     await this.globalServerSwitcherIcon.click();
  1074 |     const serverOption = this.page.locator('twc-list-item').filter({ hasText: serverName });
> 1075 |     await serverOption.click();
       |                        ^ Error: locator.click: Target page, context or browser has been closed
  1076 |     await this.page.waitForLoadState('networkidle');
  1077 |   }
  1078 |
  1079 |   async clickOnConfirmServerSelectionBtn() {
  1080 |     await this.page
  1081 |       .locator("twc-button[type='button'][slot='confirm']")
  1082 |       .click();
  1083 |     await this.page.waitForTimeout(1000);
  1084 |   }
  1085 |
  1086 |   async searchCaseById(caseIdentifier1: string): Promise<void> {
  1087 |     await this.clickOnCaseFilterIcon();
  1088 |     await this.addFilterCondition("caseIdentifier1", "EQ", caseIdentifier1);
  1089 |     await this.clickFilterSearch();
  1090 |     await this.page
  1091 |       .locator(`twc-table-row[details*='"caseIdentifier1":"${caseIdentifier1}"']`)
  1092 |       .first()
  1093 |       .click();
  1094 |   }
  1095 |
  1096 |   async clickOnCaseByCaseIdentifier(caseIdentifier1: string): Promise<void> {
  1097 |     await this.page
  1098 |       .locator("twc-table-row")
  1099 |       .filter({ has: this.page.locator(`twc-table-cell[title="${caseIdentifier1}"]`) })
  1100 |       .click();
  1101 |   }
  1102 |
  1103 |   async verifyAdhocTaskRowDetails(rowIndex: number, taskName: string, executeStatus: string, canBeStartedStatus: string): Promise<void> {
  1104 |     const adhocDialog = this.page.locator("twc-dialog").filter({ hasText: "Ad-hoc tasks" });
  1105 |     await expect(adhocDialog).toBeVisible({ timeout: 15000 });
  1106 |
  1107 |     const row = adhocDialog.locator("twc-details").nth(rowIndex);
  1108 |     await expect(row).toBeVisible();
  1109 |     await expect(row).toContainText(taskName);
  1110 |     await expect(row).toContainText(executeStatus);
  1111 |     await expect(row).toContainText(canBeStartedStatus);
  1112 |   }
  1113 |
  1114 |   async closeAdhocTaskDialog(): Promise<void> {
  1115 |     const adhocDialog = this.page.locator('twc-dialog.adhoc-dialog');
  1116 |     const adhocDialogCloseButton = this.page.locator('twc-dialog.adhoc-dialog twc-icon[part="close-button"]');
  1117 |     await adhocDialogCloseButton.waitFor({ state: 'visible' });
  1118 |     await adhocDialogCloseButton.click({ force: true });
  1119 |     await expect(adhocDialog).toBeHidden();
  1120 |   }
  1121 |
  1122 |   async validateAdhocTaskDialogRows(): Promise<void> {
  1123 |     const adhocDialog = this.page.locator("twc-dialog").filter({ hasText: "Ad-hoc tasks" });
  1124 |     await expect(adhocDialog).toBeVisible({ timeout: 15000 });
  1125 |
  1126 |     const rows = adhocDialog.locator("twc-details");
  1127 |     const rowCount = await rows.count();
  1128 |
  1129 |     for (let i = 0; i < rowCount; i++) {
  1130 |       await expect(rows.nth(i)).toBeVisible();
  1131 |     }
  1132 |   }
  1133 |
  1134 |   async verifyNoAdhocTaskRecords(): Promise<void> {
  1135 |     const adhocDialog = this.page.locator("twc-dialog").filter({ hasText: "Ad-hoc tasks" });
  1136 |     await expect(adhocDialog).toBeVisible({ timeout: 15000 });
  1137 |     const rows = adhocDialog.locator("twc-details");
  1138 |     await expect(rows).toHaveCount(0);
  1139 |   }
  1140 |
  1141 |   async startAdhocTask(taskName: string): Promise<void> {
  1142 |     const adhocDialog = this.page.locator("twc-dialog").filter({ hasText: "Ad-hoc tasks" });
  1143 |     await expect(adhocDialog).toBeVisible({ timeout: 15000 });
  1144 |     await adhocDialog
  1145 |       .locator("twc-details")
  1146 |       .filter({ hasText: taskName })
  1147 |       .locator("button")
  1148 |       .click();
  1149 |   }
  1150 | }
  1151 |
```