# Test info

- Name: Verify Bulk Process flow >> BPMX-18862 | Verify bulk suspend action transitions all selected process instances to SUSPENDED state with confirmation dialog and success toast
- Location: C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\07_UnifiedUiProcessManager4xReg.spec.ts:756:9

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)

Locator: locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('div[slot="bodyContent"]')
- Expected string  - 1
+ Received string  + 4

- Are you sure you want to perform the Resume action on all the selected instances?
+
+         Are you sure you want to perform the Suspend action on all the selected instances?
+         This action can't be undone!
+       
Call log:
  - expect.toContainText with timeout 5000ms
  - waiting for locator('bpme-confirm-dialog').filter({ hasText: 'Are you sure you want to perform the' }).locator('div[slot="bodyContent"]')
    9 × locator resolved to <div slot="bodyContent">…</div>
      - unexpected value "
        Are you sure you want to perform the Suspend action on all the selected instances?
        This action can't be undone!
      "

    at C:\Old_VDI_Backup\Old_VDI_Downloads_Backup\Playwright_Upd\Playwright_Upd\tests\Parallel\07_UnifiedUiProcessManager4xReg.spec.ts:785:64
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
    - text: Process Templates
    - button "Start"
    - text: Clear filters Process Name = BPMCreateCaseProcess ApprovalTestProject
  - separator "Resize"
  - dialog "Confirm":
    - heading "Confirm" [level=2]
    - button "Close"
    - text: Are you sure you want to perform the Suspend action on all the selected instances? This action can't be undone!
    - button "No"
    - button "Yes"
  - text: BPMCreateCaseProcess
  - button "Cancel selected instances"
  - button "Resume"
  - button "Suspend"
  - img "Auto Refresh":
    - img
  - img "Sort":
    - img
  - img "Columns":
    - img
  - tablist:
    - tab "Current" [selected]
    - tab "Historic"
  - combobox
  - table:
    - row "Process Instance ID State Start Time Actions":
      - columnheader:
        - checkbox [checked]
        - img
      - columnheader "Process Instance ID"
      - columnheader "State"
      - columnheader "Start Time"
      - columnheader "Actions"
    - row "pvm:0a12i ACTIVE 14 Aug 2026 12:04 PM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a12i"
      - cell "ACTIVE"
      - cell "14 Aug 2026 12:04 PM"
      - cell:
        - button
    - row "pvm:0a12j ACTIVE 14 Aug 2026 12:04 PM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a12j"
      - cell "ACTIVE"
      - cell "14 Aug 2026 12:04 PM"
      - cell:
        - button
    - row "pvm:0a12k ACTIVE 14 Aug 2026 12:04 PM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a12k"
      - cell "ACTIVE"
      - cell "14 Aug 2026 12:04 PM"
      - cell:
        - button
    - row "pvm:0a12l ACTIVE 14 Aug 2026 12:04 PM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a12l"
      - cell "ACTIVE"
      - cell "14 Aug 2026 12:04 PM"
      - cell:
        - button
    - row "pvm:0a12n ACTIVE 17 Aug 2026 10:34 AM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a12n"
      - cell "ACTIVE"
      - cell "17 Aug 2026 10:34 AM"
      - cell:
        - button
    - row "pvm:0a12r ACTIVE 17 Aug 2026 10:38 AM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a12r"
      - cell "ACTIVE"
      - cell "17 Aug 2026 10:38 AM"
      - cell:
        - button
    - row "pvm:0a12v ACTIVE 17 Aug 2026 10:43 AM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a12v"
      - cell "ACTIVE"
      - cell "17 Aug 2026 10:43 AM"
      - cell:
        - button
    - row "pvm:0a1210 ACTIVE 17 Aug 2026 10:43 AM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a1210"
      - cell "ACTIVE"
      - cell "17 Aug 2026 10:43 AM"
      - cell:
        - button
    - row "pvm:0a1211 ACTIVE 17 Aug 2026 10:43 AM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a1211"
      - cell "ACTIVE"
      - cell "17 Aug 2026 10:43 AM"
      - cell:
        - button
    - row "pvm:0a1212 ACTIVE 17 Aug 2026 10:43 AM":
      - cell:
        - checkbox [checked]
        - img
      - cell "pvm:0a1212"
      - cell "ACTIVE"
      - cell "17 Aug 2026 10:43 AM"
      - cell:
        - button
- iframe
```

# Test source

```ts
  685 |         await expect(processPage.failedAlertMessage).toContainText('Source and destination version cannot be the same.', { timeout: 10000 });
  686 |
  687 |     });
  688 |
  689 |     // Test 5: Add migration rules, edit a specific rule and save, delete the edited rule, verify it is removed, then cancel the dialog
  690 |     test("BPMX-18861 | Verify a migration rule can be edited and subsequently deleted before the migration is executed", async () => {
  691 |         // Navigate to the Process Manager tab
  692 |         await processPage.naviagteToProcessTab();
  693 |
  694 |         // Open the three-dots menu for the specific version from TestData and click Migrate
  695 |         await processPage.OpenProcessMenuByVersion(
  696 |             dataset.process.migration.packageName,
  697 |             dataset.process.migration.processName,
  698 |             dataset.process.migration.version
  699 |         );
  700 |         await processPage.migrateMenuItem.click();
  701 |         await page.waitForTimeout(1500);
  702 |
  703 |         // Select the source version from TestData
  704 |         await processPage.selectMigrateSourceVersion(dataset.process.migration.sourceVersion);
  705 |
  706 |         // Select the destination version from TestData
  707 |         await processPage.selectMigrateDestinationVersion(dataset.process.migration.destinationVersion);
  708 |
  709 |         // Select all items in the "Migrate from" list
  710 |         await processPage.clickMigrateFromSelectAll();
  711 |
  712 |         // Click the Add rule button
  713 |         await processPage.migrateAddRuleButton.click();
  714 |         await page.waitForTimeout(1000);
  715 |
  716 |         // Click the Edit icon for the EndEvent migration rule
  717 |         await processPage.clickMigrationRuleEditIcon(
  718 |             dataset.process.migration.sourceVersion,
  719 |             dataset.process.migration.destinationVersion,
  720 |             dataset.process.migration.editRulePoint
  721 |         );
  722 |
  723 |         // Update the rule text in the input field
  724 |         await processPage.updateMigrationRuleInput(dataset.process.migration.updatedRuleText);
  725 |
  726 |         // Click the Save icon to persist the updated rule
  727 |         await processPage.clickMigrationRuleSaveIcon();
  728 |
  729 |         // Click the Delete icon for the EndEventUpdated migration rule
  730 |         await processPage.clickMigrationRuleDeleteIcon(
  731 |             dataset.process.migration.sourceVersion,
  732 |             dataset.process.migration.destinationVersion,
  733 |             dataset.process.migration.deleteRulePoint
  734 |         );
  735 |
  736 |         // Verify the deleted rule is no longer present in the rules list
  737 |         await processPage.verifyMigrationRuleNotPresent(
  738 |             dataset.process.migration.sourceVersion,
  739 |             dataset.process.migration.destinationVersion,
  740 |             dataset.process.migration.deleteRulePoint
  741 |         );
  742 |         await page.waitForTimeout(1000);
  743 |     });
  744 | });
  745 |
  746 | // ─────────────────────────────────────────────────────────────────────────────
  747 | // Suite 6: Bulk Process action flows
  748 | // Covers bulk Suspend (all selected instances transition to SUSPENDED),
  749 | // bulk Resume (SUSPENDED instances return to ACTIVE),
  750 | // and bulk Cancel (all selected instances are cancelled with confirmation dialog)
  751 | // ─────────────────────────────────────────────────────────────────────────────
  752 | test.describe("Verify Bulk Process flow", () => {
  753 |
  754 |     // Test 1: Start multiple ACTIVE instances, select all via header checkbox, suspend all via bulk Suspend button,
  755 |     // verify confirmation dialog text, confirm and verify success toast and SUSPENDED state on first row
  756 |     test("BPMX-18862 | Verify bulk suspend action transitions all selected process instances to SUSPENDED state with confirmation dialog and success toast", async () => {
  757 |         // Navigate to the Work Manager and select the target BPM server
  758 |         await page.goto(dataset.workMangerUrl);
  759 |         await page.waitForLoadState("domcontentloaded");
  760 |         await homePage.clickOnBuisnessService();
  761 |         await cmPage.selectServerFromGlobalSwitcher(dataset.ServerName2201);
  762 |         await cmPage.clickOnConfirmServerSelectionBtn();
  763 |
  764 |         // Navigate to the Process Manager tab
  765 |         await processPage.naviagteToProcessTab();
  766 |
  767 |         // Open BPMCreateCaseProcess and start 4 instances to ensure enough ACTIVE records exist for bulk action
  768 |         await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");
  769 |         await processPage.startButton.click();
  770 |         await processPage.startButton.click();
  771 |         await processPage.startButton.click();
  772 |         await processPage.startButton.click();
  773 |
  774 |         // Refresh the instance list to load the newly started process instances
  775 |         await page.waitForTimeout(1000);
  776 |         await processPage.refreshInstances.click();
  777 |
  778 |         // Select all instances using the header checkbox to enable bulk action buttons
  779 |         await processPage.selectAllCheckbox.click();
  780 |
  781 |         // Click the Suspend button in the toolbar to trigger the bulk suspend action
  782 |         await processPage.suspendSelectedInstancesButton.click();
  783 |
  784 |         // Verify the suspend confirmation dialog appears with the expected body text from TestData
> 785 |         await expect(processPage.suspendSelectedConfirmDialog).toContainText(dataset.process.bulkProcess.suspendConfirmationBodyText);
      |                                                                ^ Error: Timed out 5000ms waiting for expect(locator).toContainText(expected)
  786 |
  787 |         // Confirm the suspend action by clicking Yes in the dialog
  788 |         await processPage.suspendSelectedYesButton.click();
  789 |         await page.waitForTimeout(500);
  790 |
  791 |         // Verify success toast confirms the suspend request was submitted for all selected instances
  792 |         await expect(processPage.alertMessage).toContainText('Suspend request submitted successfully.', { timeout: 10000 });
  793 |         await page.waitForTimeout(1000);
  794 |
  795 |         // Verify the first row state cell changes to SUSPENDED after the bulk suspend action is processed
  796 |         await expect(processPage.suspendedStateCell).toBeVisible({ timeout: 10000 });
  797 |     });
  798 |
  799 |     // Test 2: Select all SUSPENDED instances via header checkbox, resume all via bulk Resume button,
  800 |     // verify confirmation dialog text, confirm and verify success toast and ACTIVE state on first row
  801 |     test("BPMX-18863 | Verify bulk resume action transitions all selected SUSPENDED instances back to ACTIVE state with confirmation dialog and success toast", async () => {
  802 |
  803 |         // Navigate to the Process Manager tab
  804 |         await processPage.naviagteToProcessTab();
  805 |
  806 |         // Open BPMCreateCaseProcess — instances from the previous Suspend test are expected to be in SUSPENDED state
  807 |         await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");
  808 |
  809 |         // Select all instances using the header checkbox to enable bulk action buttons
  810 |         await processPage.selectAllCheckbox.click();
  811 |
  812 |         // Click the Resume button in the toolbar to trigger the bulk resume action
  813 |         await processPage.resumeSelectedInstancesButton.click();
  814 |
  815 |         // Verify the resume confirmation dialog appears with the expected body text from TestData
  816 |         await expect(processPage.resumeSelectedConfirmDialog).toContainText(dataset.process.bulkProcess.resumeConfirmationBodyText);
  817 |
  818 |         // Confirm the resume action by clicking Yes in the dialog
  819 |         await processPage.resumeSelectedYesButton.click();
  820 |         await page.waitForTimeout(500);
  821 |
  822 |         // Verify success toast confirms the resume request was submitted for all selected instances
  823 |         await expect(processPage.alertMessage).toContainText('Resume request submitted successfully.', { timeout: 10000 });
  824 |         await page.waitForTimeout(1000);
  825 |
  826 |         // Verify the first row state cell returns to ACTIVE after the bulk resume action is processed
  827 |         await expect(processPage.activeStateCell).toBeVisible({ timeout: 10000 });
  828 |     });
  829 |
  830 |     // Test 3: Select all ACTIVE instances via header checkbox, cancel all via bulk Cancel button,
  831 |     // verify confirmation dialog text, confirm and verify success toast
  832 |     test("BPMX-18864 | Verify bulk cancel action cancels all selected process instances with confirmation dialog and success toast", async () => {
  833 |
  834 |         // Navigate to the Process Manager tab
  835 |         await processPage.naviagteToProcessTab();
  836 |
  837 |         // Open BPMCreateCaseProcess — instances from the previous Resume test are expected to be back in ACTIVE state
  838 |         await processPage.OpenProcess("ApprovalTestProject", "BPMCreateCaseProcess");
  839 |
  840 |         // Select all instances using the header checkbox to enable bulk action buttons
  841 |         await processPage.selectAllCheckbox.click();
  842 |
  843 |         // Click the Cancel Selected Instances button in the toolbar to trigger the bulk cancel action
  844 |         await processPage.cancelSelectedInstancesButton.click();
  845 |
  846 |         // Verify the cancel confirmation dialog appears with the expected body text
  847 |         // Uses bpme-proces-instance-cancel-tasks-dialog (different element from bpme-confirm-dialog used by Suspend/Resume)
  848 |         await expect(processPage.cancelSelectedConfirmDialog).toContainText('Are you sure you want to cancel');
  849 |
  850 |         // Confirm the cancel action by clicking Yes in the dialog
  851 |         await processPage.cancelSelectedYesButton.click();
  852 |         await page.waitForTimeout(500);
  853 |
  854 |         // Verify success toast confirms the cancel request was submitted for all selected instances
  855 |         await expect(processPage.alertMessage).toContainText('Cancel request submitted successfully.', { timeout: 10000 });
  856 |         await page.waitForTimeout(1000);
  857 |     });
  858 |
  859 | });
  860 |
```