# Test info

- Name: Verify Bulk Process flow >> BPMX-18864 | Verify bulk cancel action cancels all selected process instances with confirmation dialog and success toast
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\07_UnifiedUiProcessManager4xReg.spec.ts:832:9

# Error details

```
Error: locator.waitFor: Target page, context or browser has been closed
Call log:
  - waiting for locator('#bpmProcess svg') to be visible

    at ProcessPage.naviagteToProcessTab (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\ProcessPage.ts:339:48)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\07_UnifiedUiProcessManager4xReg.spec.ts:835:9
```

# Test source

```ts
  239 |     this.processInfoPopup = page.locator('[slot="bodyContent"].popup-content');
  240 |     this.dismissButton = page.locator('twc-button[slot="cancel"]', { hasText: 'Dismiss' });
  241 |     this.historicTab = page.locator('twc-tab[panel="historic"]');
  242 |     this.currentTab = page.locator('twc-tab[panel="current"]');
  243 |
  244 |     // Find Instances dialog
  245 |     const findInstancesDialog = page.locator('bpme-process-instance-find-dialog');
  246 |     this.processInstanceIdRadio = page.locator('twc-radio[part="process-instance-item"]').filter({ hasText: 'Process Instance ID' });
  247 |     this.processInstanceIdInput = findInstancesDialog.locator('twc-input[size="small"][type="text"]').locator('#input');
  248 |     this.selectAllCheckbox = page.locator('twc-table-head-cell.checkBox twc-checkbox');
  249 |     this.cancelSelectedInstancesButton = page.locator('twc-button').filter({ hasText: 'Cancel selected instances' });
  250 |     this.cancelSelectedConfirmDialog = page.locator('bpme-proces-instance-cancel-tasks-dialog div[slot="bodyContent"]');
  251 |     this.cancelSelectedYesButton = page.locator('bpme-proces-instance-cancel-tasks-dialog twc-button[slot="confirm"]');
  252 |     this.suspendSelectedConfirmDialog = page.locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('div[slot="bodyContent"]');
  253 |     this.suspendSelectedYesButton = page.locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('twc-button[slot="confirm"]');
  254 |     this.resumeSelectedConfirmDialog = page.locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('div[slot="bodyContent"]');
  255 |     this.resumeSelectedYesButton = page.locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('twc-button[slot="confirm"]');
  256 |     this.packageNameOperator = findInstancesDialog.locator('twc-select').nth(0);
  257 |     this.packageNameInput = findInstancesDialog.locator('twc-input[type="text"]').nth(0).locator('#input');
  258 |     this.processNameOperator = findInstancesDialog.locator('twc-select').nth(1);
  259 |     this.processNameInput = findInstancesDialog.locator('twc-input[type="text"]').nth(1).locator('#input');
  260 |     this.versionOperator = findInstancesDialog.locator('twc-select').nth(2);
  261 |     this.versionInput = findInstancesDialog.locator('twc-input[type="text"]').nth(2).locator('#input');
  262 |     this.instanceStartedOperator = findInstancesDialog.locator('twc-select').nth(3);
  263 |     this.instanceStartedInput = findInstancesDialog.locator('twc-input[type="datetime-local"]').locator('#input');
  264 |     this.priorityOperator = findInstancesDialog.locator('twc-select').nth(4);
  265 |     this.priorityInput = findInstancesDialog.locator('twc-input[type="number"]').locator('#input');
  266 |     this.filterDialogClose = page.locator('twc-icon[name="x"][library="system"]');
  267 |     this.filterDialogResetAll = findInstancesDialog.getByRole('button', { name: 'Reset all fields' });
  268 |     this.filterDialogSearch = findInstancesDialog.getByRole('button', { name: 'Search' });
  269 |     this.searchResultClose = page.locator('bpme-process-instance-table-filter twc-icon.close-icon[name="x-lg"]');
  270 |     this.searchResultSubtitle = page.locator('bpme-process-instance-table-filter [part="header__subtitle"]');
  271 |     this.processTemplateTagsWrapper = page.locator('div[part="tags-wrapper"]');
  272 |     this.clearFiltersIcon = page.locator('twc-toolbar-item[label="Clear filters"] twc-icon[name="x"]');
  273 |     const templateFilterDialog = page.locator('bpme-process-template-filter-dialog');
  274 |     this.templateFilterPackageNameInput = templateFilterDialog.locator('.package-name-filter-container twc-input').locator('#input');
  275 |     this.templateFilterProcessNameInput = templateFilterDialog.locator('.process-name-filter-container twc-input').locator('#input');
  276 |     this.templateFilterVersionInput = templateFilterDialog.locator('.version-name-filter-container twc-input').locator('#input');
  277 |     this.templateFilterPackageNameSelect = templateFilterDialog.locator('.package-name-filter-container twc-option[value="="]');
  278 |     this.templateFilterProcessNameSelect = templateFilterDialog.locator('.process-name-filter-container twc-option[value="="]');
  279 |     this.templateFilterVersionSelect = templateFilterDialog.locator('.version-name-filter-container twc-option[value="="]');
  280 |     this.processHeaderTitle = page.locator('#bpme-process-instance-table-filter div[part="header__title"]');
  281 |     this.filterTagRemoveButton = page.locator('twc-tag [part="remove-button"]');
  282 |
  283 |     // --- Attached-only additions ---
  284 |     this.PMAppTitle = page.locator('span', { hasText: 'Process Manager' });
  285 |     this.ProcessManagerCard = page.locator('div:nth-child(3) > div.card-title');
  286 |     this.ProcessManagerGo = page.locator('div:nth-child(3) > div:nth-child(4) > button > span > span');
  287 |     this.ActiveAppTabTitle = page.locator('.mdc-tab.mat-mdc-tab-link.mat-mdc-focus-indicator.ace-adoption-mdc-mat-tab-link.ng-star-inserted.mdc-tab--active.mdc-tab-indicator--active');
  288 |     this.ProcessTemplateName = page.locator('div', { hasText: TestData.processTemplateName });
  289 |     this.Refresh_Process_Templates_Icon = page.locator("mat-icon[mattooltip='Refresh process templates']");
  290 |     this.Filter_Process_Templates_Icon = page.locator("mat-icon[mattooltip='Filter process templates']");
  291 |     this.Number_Of_Process_Templates = page.locator('div.templatesList.ng-star-inserted div.process-title');
  292 |     this.Number_Of_Process_Templates_Filters = page.locator('span.mdc-evolution-chip__text-label');
  293 |     this.ProcessTemplates_tab_switch = page.locator("//div[@class='process-tab-cell1']");
  294 |     this.ProcessTemplates_tab_title = page.locator("//div[@class='process-tab-cell']");
  295 |     this.No_Templates_Msg = page.locator("//p[normalize-space()='No templates to display.']");
  296 |     this.ProcessInstanceListTitle = page.locator('.instance-title');
  297 |     this.NumberOfProcessInstances = page.locator('.mat-row');
  298 |     this.Find_Instance_Filter_Menu = page.locator("button[mattooltip='Use queries to find instances']");
  299 |     this.Refresh_Process_Instances_Icon = page.locator('twc-toolbar-item').filter({ hasText: 'Refresh Instances Refresh' }).locator('svg');
  300 |     this.PI_FilterByState = page.locator("//span[normalize-space()='Filter by state']");
  301 |     this.Number_Of_ProcessInstances = page.locator('div.table-container tr.mat-mdc-row');
  302 |     this.Process_Instances_List = page.locator('table.mat-table.cdk-table.mat-sort.mat-elevation-z8.ng-star-inserted');
  303 |     this.Process_Instance_ID = page.locator('tr.mat-mdc-row td.mat-mdc-cell.mdc-data-table__cell.cdk-cell.def-column.cdk-column-instanceId.mat-column-instanceId.ng-star-inserted').first();
  304 |     this.Process_Instance_State = page.locator('tr.mat-mdc-row td.mat-mdc-cell.cdk-cell.def-column.cdk-column-State.mat-column-State').first();
  305 |     this.Process_Instance_IDs = page.locator('td.mat-mdc-cell.cdk-cell.def-column.cdk-column-instanceId.mat-column-instanceId');
  306 |     this.PI_SelectAll_Instances_chkbox = page.locator("//div[contains(@class,'mat-sort-header-content ng-tns')][text()='Process Instance ID']//preceding::input[1]");
  307 |     this.NoPIText = page.locator(".empty-message");
  308 |     this.PI_Summary_title = page.locator("//h3[normalize-space()='Instance Summary']");
  309 |     this.Click_Anywhere = page.locator("//div[@class='mat-drawer-backdrop ng-star-inserted mat-drawer-shown']");
  310 |     this.Dialogue_msg = page.locator("//span[@class='dialog-title']");
  311 |     this.Filter_Dialogue_Close_Btn = page.locator("//mat-icon[@svgicon='clear']//*[local-name()='svg']");
  312 |     this.Retry_Dialogue_Close_Btn = page.locator("//button[@class='btn-secondary']");
  313 |     this.PI_Cancel_Purge_Dialogue_title = page.locator('bpme-process-template').getByText('Confirm').nth(2);
  314 |     this.PI_Cancel_Purge_Dialogue_Msg = page.getByText('Do you want to purge all the');
  315 |     this.PI_Cancel_Purge_Dialogue_Warning_Msg = page.locator("//div[normalize-space()=\"This action can't be undone!\"]");
  316 |     this.PI_Cancel_Purge_Dialogue_Close_Btn = page.getByRole('button', { name: 'Close' });
  317 |     this.PI_migrate_msg = page.locator("//p[@class='ng-star-inserted']");
  318 |     this.PI_Fix_ProcessRetry_Heading = page.locator("//h3[text()='Retry Status']");
  319 |     this.PI_FixProcess_tabheader = page.locator("//h3[@class='halt-tab-header ng-star-inserted']");
  320 |     this.PI_FixProcess_CancelInstance_Btn = page.locator("//mat-icon[@svgicon='cancel_process']");
  321 |     this.PI_FixProcess_InspectData = page.locator("//mat-icon[@svgicon='inspect_process']");
  322 |     this.PI_FixProcess_Retry_Btn = page.locator("//mat-icon[@svgicon='retry_process']");
  323 |     this.PI_InspectData_back_btn = page.locator("//button[@class='back-error-button']");
  324 |     this.PI_Retry_Status_Msg = page.locator("//p[normalize-space()='Retry request has been submitted successfully.']");
  325 |     this.PI_Migration_msg = page.locator("//p[normalize-space()='Process Migration Successful']");
  326 |     this.Filter_Calendar_Icon = page.locator("//button[@class='calendar-trigger']");
  327 |     this.Filter_Calendar_CurrentDate = page.locator("//span[@class='owl-dt-calendar-cell-content owl-dt-calendar-cell-today']");
  328 |     this.Filter_Calendar_Time_field = page.locator("//owl-date-time-timer-box[1]//label[1]//input[1]");
  329 |   }
  330 |
  331 |   // ==========================================
  332 |   // --- Action Methods (Disk) ---
  333 |   // ==========================================
  334 |
  335 |   async naviagteToProcessTab() {
  336 |     await this.page.waitForTimeout(1000);
  337 |     await this.page.waitForLoadState("domcontentloaded");
  338 |     await this.page.waitForTimeout(3000);
> 339 |     await this.page.locator("#bpmProcess svg").waitFor();
      |                                                ^ Error: locator.waitFor: Target page, context or browser has been closed
  340 |     await this.page.locator("#bpmProcess svg").click();
  341 |   }
  342 |
  343 |   async getFirstRowProcessInstanceId(): Promise<string> {
  344 |     const id = await this.page.locator('twc-table-row').first()
  345 |       .locator('twc-table-cell[tooltipvalue]').first()
  346 |       .getAttribute('tooltipvalue');
  347 |     return id ?? '';
  348 |   }
  349 |
  350 |   async verifyProcessInfo(moduleName: string, processName: string) {
  351 |     await expect(
  352 |       this.processInfoPopup.locator('div').filter({ hasText: /^Module Name/ })
  353 |     ).toContainText(moduleName);
  354 |     await expect(
  355 |       this.processInfoPopup.locator('div').filter({ hasText: /^Process Name/ })
  356 |     ).toContainText(processName);
  357 |   }
  358 |
  359 |   async clickOnProcess(processName: string) {
  360 |     await this.processTemplatesFilter.click();
  361 |     await this.processName.fill(processName);
  362 |     await this.saveBtn.click();
  363 |   }
  364 |
  365 |   async selectACETestFacadeAttributesProcess(processName: string) {
  366 |     await this.processTemplatesFilter.click();
  367 |     await this.processName.fill(processName);
  368 |     await this.saveBtn.click();
  369 |     await this.page.waitForTimeout(1500);
  370 |     await this.ACE_TestFacadeAttributes.click();
  371 |     await this.ACE_TestFacadeAttributesProcess.click();
  372 |     await this.checkbox.click();
  373 |     await this.actionThreeDotsVertical.click();
  374 |   }
  375 |
  376 |   async waitForToastMessage(message: string, timeout = 15000) {
  377 |     await this.page.waitForFunction(
  378 |       (msg) => {
  379 |         function hasText(root: Document | ShadowRoot): boolean {
  380 |           if (!root) return false;
  381 |           if (root.textContent && root.textContent.includes(msg)) return true;
  382 |           const elements = Array.from(root.querySelectorAll('*'));
  383 |           for (const el of elements) {
  384 |             const sr = (el as Element).shadowRoot;
  385 |             if (sr && hasText(sr)) return true;
  386 |           }
  387 |           return false;
  388 |         }
  389 |         return hasText(document);
  390 |       },
  391 |       message,
  392 |       { timeout }
  393 |     );
  394 |   }
  395 |
  396 |   async clickOnProcesses(groupValue: string, processItemValue: string) {
  397 |     await this.page.locator(`twc-tree-items-group[groupvalue="${groupValue}"] div[slot="trigger"]`).click();
  398 |     await this.page.locator(`twc-tree-item[itemvalue="${processItemValue}"]`).click();
  399 |   }
  400 |
  401 |   async verifyFirstRowState(expectedState: string) {
  402 |     const firstRowStateCell = this.page.locator('twc-table-row').first()
  403 |       .locator(`twc-table-cell[tooltipvalue="${expectedState}"]`);
  404 |     await expect(firstRowStateCell).toBeVisible();
  405 |   }
  406 |
  407 |   async getEmptyMsg() {
  408 |     return await this.page.locator(".empty-message").last().innerText();
  409 |   }
  410 |
  411 |   procesInstanceId(): Locator {
  412 |     return this.page.locator('twc-list-item', { hasText: 'Process Instance ID' })
  413 |       .filter({ has: this.page.locator('twc-checkbox') })
  414 |       .last();
  415 |   }
  416 |
  417 |   actionMenuForFirstRowByState(state: string): Locator {
  418 |     return this.page.locator('twc-table-row')
  419 |       .filter({ has: this.page.locator(`twc-table-cell[tooltipvalue="${state.toUpperCase()}"]`) })
  420 |       .first()
  421 |       .locator('twc-icon-button[name="three-dots-vertical"]');
  422 |   }
  423 |
  424 |   async sortByStartDateDescending() {
  425 |     await this.page.locator('twc-toolbar-item[label="Sort"]').click();
  426 |     await this.page.locator('twc-list-item', { hasText: 'Start Time' })
  427 |       .filter({ has: this.page.locator('twc-checkbox') })
  428 |       .click();
  429 |     await this.page.locator('twc-list-item', { hasText: 'Start Time ( Ascending )' }).click();
  430 |     await this.page.getByRole('button', { name: 'Save' }).click();
  431 |   }
  432 |
  433 |   async filterByState(state: string) {
  434 |     await this.page.getByRole("combobox").first().click();
  435 |     await this.page.waitForTimeout(500);
  436 |     await this.page.locator(`twc-option[value="${state.toUpperCase()}"]`).click({ force: true });
  437 |   }
  438 |
  439 |   async templateFilter(packageName: string) {
```