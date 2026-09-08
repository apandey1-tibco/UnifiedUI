# Test info

- Name: Case Manager Regression suite >> Save Search
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:152:7

# Error details

```
TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
Call log:
  - waiting for locator('twc-table-row').first() to be visible

    at CaseManagerPage.verifyAllRowsCaseState (C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\PageObjects\CaseManagerPage.ts:693:24)
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:176:20
    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\06_UnifiedUICaseManagerReg4x.spec.ts:173:5
```

# Page snapshot

```yaml
- main:
  - img
  - separator
  - text: BPME application
  - complementary
  - button "2201":
    - text: "2201"
    - img
  - dialog:
    - text: Case types
    - separator
    - separator
    - textbox
    - button "Saved Searches" [expanded]
    - region: Test Category
    - menu:
      - menuitem "ApplicationForApproval com.example.caseactionstudy-2 2"
  - separator "Resize"
  - text: ApplicationForApproval Active Cases
  - separator
  - separator
  - separator
  - text: No active cases
- iframe
```

# Test source

```ts
  593 |     return await this.caseFilterHeading.innerText();
  594 |   }
  595 |
  596 |   async addFilterCondition(fieldName: string, operator: string, value: string): Promise<void> {
  597 |     await this.filterConditionFieldSelector.click();
  598 |     const fieldOption = this.page.getByRole("option", { name: fieldName, exact: true });
  599 |     await fieldOption.waitFor({ state: "visible", timeout: 5000 });
  600 |     await fieldOption.click();
  601 |
  602 |     await this.filterConditionOperatorSelector.click();
  603 |     const exactOperator = this.page.getByRole("option", { name: operator, exact: true }).first();
  604 |     const partialOperator = this.page.locator(`[role="option"]`).filter({ hasText: operator }).first();
  605 |     const operatorOption = (await exactOperator.count()) > 0 ? exactOperator : partialOperator;
  606 |     await operatorOption.waitFor({ state: "visible", timeout: 5000 });
  607 |     await operatorOption.click();
  608 |
  609 |     await this.filterConditionValueField.waitFor({ state: "visible", timeout: 5000 });
  610 |     await this.filterConditionValueField.click();
  611 |     await this.filterConditionValueField.pressSequentially(value);
  612 |   }
  613 |
  614 |   async clickFilterSearch(): Promise<void> {
  615 |     await this.filterSearchButton.waitFor({ state: "visible", timeout: 5000 });
  616 |     await this.filterSearchButton.click();
  617 |     await this.page.waitForLoadState("networkidle");
  618 |     await this.page.waitForTimeout(3000);
  619 |   }
  620 |
  621 |   async selectFilterOperator(operator: string): Promise<void> {
  622 |     await this.filterConditionOperatorSelector.click();
  623 |     const exactOption = this.page.getByRole("option", { name: operator, exact: true }).first();
  624 |     const partialOption = this.page.locator(`[role="option"]`).filter({ hasText: operator }).first();
  625 |     const target = (await exactOption.count()) > 0 ? exactOption : partialOption;
  626 |     await target.waitFor({ state: "visible", timeout: 5000 });
  627 |     await target.click();
  628 |   }
  629 |
  630 |   async fillFilterValue(value: string): Promise<void> {
  631 |     await this.filterConditionValueField.waitFor({ state: "visible", timeout: 5000 });
  632 |     await this.filterConditionValueField.click();
  633 |     await this.filterConditionValueField.pressSequentially(value);
  634 |   }
  635 |
  636 |   async selectFilterValue(value: string): Promise<void> {
  637 |     await this.filterConditionValueField.waitFor({ state: "visible", timeout: 5000 });
  638 |     await this.filterConditionValueField.click();
  639 |     const exactOption = this.page.getByRole("option", { name: value, exact: true }).first();
  640 |     const partialOption = this.page.locator(`[role="option"]`).filter({ hasText: value }).first();
  641 |     const option = (await exactOption.count()) > 0 ? exactOption : partialOption;
  642 |     await option.waitFor({ state: "visible", timeout: 5000 });
  643 |     await option.click();
  644 |   }
  645 |
  646 |   async selectUpdatedFilterValue(value: string): Promise<void> {
  647 |     await this.updatedFilterConditionValueField.waitFor({ state: "visible", timeout: 5000 });
  648 |     await this.updatedFilterConditionValueField.click();
  649 |     const exactOption = this.page.getByRole("option", { name: value, exact: true }).first();
  650 |     const partialOption = this.page.locator(`[role="option"]`).filter({ hasText: value }).first();
  651 |     const option = (await exactOption.count()) > 0 ? exactOption : partialOption;
  652 |     await option.waitFor({ state: "visible", timeout: 5000 });
  653 |     await option.click();
  654 |   }
  655 |
  656 |   async getTableRowsApplicationIds(): Promise<number[]> {
  657 |     const rows = this.page.locator("twc-table-row");
  658 |     await rows.first().waitFor({ state: "visible", timeout: 10000 });
  659 |     const rowCount = await rows.count();
  660 |     const appIds: number[] = [];
  661 |     for (let i = 0; i < rowCount; i++) {
  662 |       const detailsAttr = await rows.nth(i).getAttribute("details");
  663 |       if (detailsAttr) {
  664 |         try {
  665 |           const parsed = JSON.parse(detailsAttr);
  666 |           const casedata = parsed.casedata ?? parsed;
  667 |           const id =
  668 |             parsed.caseID ?? parsed.caseId ??
  669 |             parsed.applicationId ?? parsed.applicationID ??
  670 |             parsed.appId ?? parsed.appID ??
  671 |             casedata.caseID ?? casedata.caseId ??
  672 |             casedata.applicationId ?? casedata.applicationID ??
  673 |             casedata.appId ?? casedata.appID;
  674 |           if (id !== undefined) appIds.push(Number(id));
  675 |         } catch {
  676 |           // skip malformed rows
  677 |         }
  678 |       }
  679 |     }
  680 |     return appIds;
  681 |   }
  682 |
  683 |   async verifyAllCaseIDsGreaterThanOrEqual(minId: number): Promise<void> {
  684 |     const ids = await this.getTableRowsApplicationIds();
  685 |     expect(ids.length).toBeGreaterThan(0);
  686 |     for (const id of ids) {
  687 |       expect(id, `Case ID ${id} is not >= ${minId}`).toBeGreaterThanOrEqual(minId);
  688 |     }
  689 |   }
  690 |
  691 |   async verifyAllRowsCaseState(expectedState: string): Promise<void> {
  692 |     const rows = this.page.locator("twc-table-row");
> 693 |     await rows.first().waitFor({ state: "visible", timeout: 10000 });
      |                        ^ TimeoutError: locator.waitFor: Timeout 10000ms exceeded.
  694 |     const rowCount = await rows.count();
  695 |     expect(rowCount).toBeGreaterThan(0);
  696 |     for (let i = 0; i < rowCount; i++) {
  697 |       const detailsAttr = await rows.nth(i).getAttribute("details");
  698 |       if (detailsAttr) {
  699 |         const parsed = JSON.parse(detailsAttr);
  700 |         const casedata = parsed.casedata ?? parsed;
  701 |         const state = casedata.caseState1 ?? casedata.caseState ?? casedata.casestate;
  702 |         expect(state, `Row ${i}: expected caseState "${expectedState}" but got "${state}"`).toBe(expectedState);
  703 |       }
  704 |     }
  705 |   }
  706 |
  707 |   async confirmCloseWarning(): Promise<void> {
  708 |     const yesCloseBtn = this.page.getByRole("button", { name: "Yes, close" });
  709 |     try {
  710 |       await yesCloseBtn.waitFor({ state: "visible", timeout: 3000 });
  711 |       await yesCloseBtn.click();
  712 |     } catch {
  713 |       // dialog did not appear — navigation already completed, continue
  714 |     }
  715 |   }
  716 |
  717 |   async verifyRowCaseIDAndState(expectedCaseId: string | number, expectedState: string): Promise<void> {
  718 |     const rows = this.page.locator("twc-table-row");
  719 |     await rows.first().waitFor({ state: "visible", timeout: 20000 });
  720 |     const rowCount = await rows.count();
  721 |     expect(rowCount, "No rows found in the table").toBeGreaterThan(0);
  722 |
  723 |     for (let i = 0; i < rowCount; i++) {
  724 |       const detailsAttr = await rows.nth(i).getAttribute("details");
  725 |       if (!detailsAttr) continue;
  726 |
  727 |       let parsed: Record<string, unknown>;
  728 |       try {
  729 |         parsed = JSON.parse(detailsAttr);
  730 |       } catch {
  731 |         continue;
  732 |       }
  733 |
  734 |       const casedata = (parsed.casedata as Record<string, unknown>) ?? parsed;
  735 |       const rowCaseId =
  736 |         parsed.caseID ?? parsed.caseId ??
  737 |         casedata.caseID ?? casedata.caseId;
  738 |
  739 |       if (String(rowCaseId) !== String(expectedCaseId)) continue;
  740 |
  741 |       const state =
  742 |         casedata.caseState1 ?? casedata.caseState ?? casedata.casestate;
  743 |
  744 |       expect(
  745 |         state,
  746 |         `Row with caseID "${expectedCaseId}": expected caseState "${expectedState}" but got "${state}"`
  747 |       ).toBe(expectedState);
  748 |       return;
  749 |     }
  750 |
  751 |     throw new Error(`No row found with caseID "${expectedCaseId}"`);
  752 |   }
  753 |
  754 |   async clickonSaveSearch() {
  755 |     await this.saveSearch.click();
  756 |     await this.page.waitForTimeout(2000);
  757 |   }
  758 |
  759 |   async clickonSaveSearches() {
  760 |     await this.saveSearches.click();
  761 |     await this.page.waitForTimeout(2000);
  762 |   }
  763 |
  764 |   async openSavedSearches() {
  765 |     await this.testCategory.click();
  766 |     await this.testSavedSearch.click();
  767 |     await this.page.waitForTimeout(2000);
  768 |   }
  769 |
  770 |   async confirmDeleteSavedSearch() {
  771 |     const dialog = this.page.locator('twc-dialog.dialog-delete-savedSearch');
  772 |     await expect(dialog).toBeVisible();
  773 |     await expect(dialog.locator('text=Delete saved search')).toBeVisible();
  774 |     await expect(dialog.locator('text=Are you sure you want to do this?')).toBeVisible();
  775 |     await dialog.getByRole('button', { name: 'Yes' }).click();
  776 |     await expect(dialog).not.toBeVisible();
  777 |   }
  778 |
  779 |   async clickThreeDotsOnSavedSearch() {
  780 |     await this.testSavedSearch.hover();
  781 |     await this.page.waitForTimeout(500);
  782 |     await this.savedSearchThreeDots.click({ force: true });
  783 |   }
  784 |
  785 |   async clickEditFromContextMenu() {
  786 |     await this.editMenuItem.waitFor({ state: "visible", timeout: 5000 });
  787 |     await this.editMenuItem.click();
  788 |   }
  789 |
  790 |   async clickDeleteFromContextMenu() {
  791 |     await this.deleteMenuItem.waitFor({ state: "visible", timeout: 5000 });
  792 |     await this.deleteMenuItem.click();
  793 |   }
```