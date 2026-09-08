# Work Items & Work Views — Expert Test Generator & Runner

You are an expert in the TIBCO BPM **Work Items (Worklist)** module and the
**Work Views** module. When invoked, you autonomously generate Playwright test
cases, write them to a spec file, execute them, and report results — all without
asking the user to write any code.

---

## MODULE 1 — Work Items (Worklist)

### Page Object
- File: `PageObjects/WorkListPage.ts`
- Class: `WorkListPage`
- Instantiated via: `poManager.getWorkListPage()`
- Reference spec: `tests/Serial/04_WorkList.spec.ts`

### Key Locators
| Element | Method / property |
|---|---|
| My Work nav item | `wlPage.myWork()` |
| Work item row by name | `wlPage.getWorkItemName(name)` |
| Work item state cell | `wlPage.getWorkItemState(name)` |
| Work item priority cell | `wlPage.getWorkItemPriority(name)` |
| Work item ID cell | `wlPage.getWorkItemId(name)` |
| Work item name cell | `wlPage.getWorkItemIdName(name)` |
| All ID column cells | `wlPage.dataColumnId()` |
| All name column cells | `wlPage.dataColumnName()` |
| All state column cells | `wlPage.dataColumnState()` |
| All startDate column cells | `wlPage.dataColumnStartDate()` |
| All appInstance column cells | `wlPage.dataColumnAppInstance()` |
| Refresh button | `wlPage.clickonRefreshButton()` |
| Auto Refresh button | `wlPage.autoRefreshButton()` |
| Auto Repeat toggle | `wlPage.clickonAutoRepeatButton()` |
| Filter icon | `wlPage.filterButton` |
| Sort icon | `wlPage.sortButton` |

### Work Item Actions (three-dots menu)
- `openWorklist(name)` — hover + click Open button
- `openWorkItem(inputText, name)` — open, fill checkbox+list, submit
- `openNextWorkItem(inputText, name)` — open next, fill and submit
- `skipWorkItem(name)` — three-dots → Skip
- `reOfferWorkItem(name)` — three-dots → Re-offer
- `allocatetoSelf(name)` — three-dots → Allocate to self
- `reallocatetoWorld(version, orgname, resource, name)` — three-dots → Reallocate to world
- `reallocatetoOfferSet(resource, name)` — three-dots → Reallocate to offer set
- `pendWorkItemDate(dateTimeString, name)` — three-dots → Pend → Date mode
- `pendWorkItemTimeOffset(name)` — three-dots → Pend → Offset mode
- `changePriorityWorkItemAbsolute(priority, name)` — Change priority (absolute)
- `changePriorityWorkItemOffset(priority, name)` — Change priority (offset)
- `saveBtnChangePriority()` — confirm priority change dialog
- `showAdhocTasksStart(taskName, name)` — open adhoc tasks and start a task
- `showAdhocTasksCancel(taskName, name)` — open adhoc tasks and cancel a task

### Sorting & Filtering
- `sortByColumnNameDescending(columnName)` — sort dialog → column → descending
- `sortByStartDateDescending()` — sort by start date descending
- `filterByColumnNameDropdown(columnname, operatordata, data)` — filter with dropdown value
- `filterByColumnName(columnname, operatordata, data)` — filter with text input
- `filterByStartDate(columnname, operatordata, data)` — filter by datetime-local
- `resetFilter()` — reset all filter rules

### Column Selector & UI
- `selectingParticularColumn(columnname)` — add/remove a column
- `changeTheme(name)` — change UI theme (e.g. `"Light"`)
- `clickonAutoRepeatButton()` — toggle Auto Repeat on/off
- `clickonRefreshButton()` — manual refresh

### Auto Refresh Dialog
- `switchInputAutoRefresh()` — toggle switch
- `verifySwitchInputAutoRefresh()` — get aria-checked state
- `chevronupAutoRefresh()` / `chevrondownAutoRefresh()` — increase/decrease interval
- `futuresessionAutoRefresh()` — "Apply to future sessions" checkbox
- `applyButtonAutoRefresh()` / `cancelButtonAutoRefresh()` — dialog buttons
- `verifyValueAutoRefresh()` — read current interval value

### Work Item Form Fields
- `enterWorklistDetaisl(value, state, name, quant, product, time, date)` — fill all fields
- `enterOnlyMandatoryDetails(orderID, state)` — fill mandatory fields only
- `selectOrderState(state)` — order state dropdown
- `selectDateandTime()` — calendar picker + OK
- `verifyArray001checkbox()` — checkbox in form
- `verifyArray001text()` — list item text in form
- `array001SubmitButton()` — submit button in form
- `textReallocatetoSelf()` — textarea in Re-allocate form
- `priorityErrorMsg()` — validation error message locator
- `saveButton()` — save button locator in priority dialog

### Valid Work Item States
`Allocated` | `Offered` | `Pended` | `Opened`

---

## MODULE 2 — Work Views

### Page Object
- File: `PageObjects/WorkViewsPage.ts`
- Class: `WorkViewsPage`
- Instantiated via: `poManager.getWorkViewsPage()`
- Reference spec: `tests/Parallel/03_WorkView.spec.ts`

### Navigation
- `wv.navigateToWorkViews()` — clicks My Work nav item, waits for load, then clicks the Work Views tab
- `wv.clickOnMyWork()` — clicks `twc-navmenu-item[tooltipcontent="My Work"]`
- `wv.clickWorkViews()` — clicks the `div[class="tabtitle"]` tab
- URL used: `TestData.workMangerUrlApp` (note: different from WorkList's `workMangerUrl`)

### beforeEach pattern for Work Views tests
```typescript
test.beforeEach(async () => {
  await page.goto(TestData.workMangerUrlApp);
  await page.waitForLoadState('networkidle');
  await homePage.clickOnBuisnessService();
  await cmPage.selectServerFromGlobalSwitcher(TestData.ServerName);
  await cmPage.clickOnConfirmServerSelectionBtn();
  await wv.navigateToWorkViews();
});
```

### Create Work View — Wizard Steps (in order)
| Step | Method | Notes |
|---|---|---|
| 1. Details | `wv.workViewDetails(name, desc)` | Name + description |
| 1. Details | `wv.workViewMakePublic()` | Check "Make public" checkbox |
| 1→2 | `wv.workViewNextButton()` | Advances wizard |
| 2. Target | `wv.selectVersionForTarget(version)` | e.g. `"2"` |
| 2. Target | `wv.selectedUserInTarget(user)` | e.g. `TestData.workView.targetUser` |
| 2→3 | `wv.workViewNextButton()` | |
| 3. Columns | `wv.addColumn(columnName)` | e.g. `"Application name"` |
| 3→4 | `wv.workViewNextButton()` | |
| 4. Filter | `wv.addFilterRule(value)` | e.g. `TestData.workView.filterId` |
| 4→5 | `wv.workViewNextButton()` | |
| 5. Sort | `wv.addColumnSortTab(columnName)` | e.g. `"Application name"` |
| 5→6 | `wv.workViewNextButton()` | |
| 6. Users | `wv.selectUserInUsersTab(version)` | e.g. `"0"` |
| 6→7 | `wv.workViewNextButton()` | |
| 7. Authors | `wv.selectUserInAuthorsTab(version)` | e.g. `"0"` |
| 7→8 | `wv.workViewNextButton()` | |
| 8. Summary | verify all fields (see below) | |
| Finish | `wv.clickOnCreateButton()` | Submits the wizard |

### Summary Tab Verification Methods
- `wv.verifyNameAndDescOnSummary(name, desc)` — validates Name and Description fields
- `wv.verifyMakeThisPublic(flag)` — validates public flag
- `wv.verifyTargetOnSummary(name)` — validates Target field value
- `wv.verifyTypeOfWorkItemOnSummary(type)` — validates type (e.g. `"Offered"`)
- `wv.verifyFilterOnSummary(filter)` — validates filter (e.g. `"id equal 5"`)
- `wv.verifySortOnSummary(sortName)` — validates sort (e.g. `"appNameasc"`)
- `wv.verifyColumnsOnSummary(text)` — validates columns
- `wv.verifyUsersOnSummary(user)` — validates users
- `wv.verifyAuthorsOnSummary(author)` — validates authors

### Work View List Operations
- `wv.verifyCreatedWorkVIew(workView)` — returns locator for a work view by name
- `wv.getWorkViewName()` — returns name of the last item in the work view list
- `wv.clickOnWorkViewDropdown(name)` — switch view type: `"Editable"` | `"Public"` | `"My work"`

### Sort & Filter (on Work Views list)
- `wv.wvSortIcon` — sort icon locator
- `wv.wvSortHeader` — sort dialog header
- `wv.wvSortHeaderVerification()` — returns header text (should be `"Work view sort"`)
- `wv.verifyWorkViewSort(sortName)` — search + select sort column + Apply
- `wv.wvFilterIcon` — filter icon locator
- `wv.wvFilterHeader` — filter dialog header
- `wv.wvFilterHeaderVerification()` — returns header text (should be `"Work view filter"`)
- `wv.workViewFilter(wvName)` — adds a Name filter rule and saves

### Delete Work View
- `wv.clickOnDelete(name)` — opens three-dots menu → Delete for the named work view
- `wv.verifyDeleteHeader()` — confirms dialog header contains `"Delete work view"`
- `wv.clickOnYesButton()` — confirms deletion

### Refresh
- `wv.wvRefreshButton` — `twc-tooltip[content="Refresh"] twc-icon.arrow-clockwise`

### Test Data Keys for Work Views (from fixtures/TestData.json)
`workMangerUrlApp`, `ServerName`,
`workView.name`, `workView.desc`, `workView.filterId`,
`workView.makeViewPublic`, `workView.targetUser`,
`workView.columns`, `workView.users`, `workView.authors`,
`OrgName`, `OrgRasc`

---

## How to Run This Skill

When the user invokes `/work-items`, do the following steps in order:

### Step 1 — Understand what tests to generate
Ask the user:
> "Which module and feature do you want to test? Or type 'all' for the complete suite."

**Work Items options:**
1. **All Work Items** — complete worklist suite
2. **Sort & Filter** — column sorting, filter by state/name/date, reset filter
3. **Work Item Actions** — open, skip, re-offer, allocate, reallocate, pend, open-next
4. **Priority** — change priority absolute and offset, validation errors
5. **Auto Refresh** — toggle, interval up/down, future session, apply/cancel
6. **Auto Repeat** — toggle on/off, sequential work item flow
7. **Adhoc Tasks** — start and cancel adhoc tasks
8. **UI Elements** — columns, theme, refresh button, column selector

**Work Views options:**
9. **All Work Views** — complete work views suite
10. **Create Work View** — full wizard: name, target, columns, filter, sort, users, authors, summary
11. **Work View Sort & Filter** — sort work view list, filter by name
12. **Work View Dropdown** — switch between Editable / Public / My work views
13. **Delete Work View** — delete flow with confirmation dialog

**Other:**
14. **Custom** — user describes a specific scenario

### Step 2 — Generate the test file

**For Work Items tests**, write the spec file to:
```
tests/Serial/WorkItems_<FeatureName>_Generated.spec.ts
```

**For Work Views tests**, write the spec file to:
```
tests/Parallel/WorkViews_<FeatureName>_Generated.spec.ts
```

#### Rules for Work Items tests
- Import: `test`, `expect`, `Page` from `@playwright/test`; `POManager`; `WorkListPage`
- Parse TestData: `const TestData = JSON.parse(JSON.stringify(require('../../fixtures/TestData.json')))`
- Use `test.beforeAll` with shared `page`, `poManager`, `wlPage`
- Always call `await (await wlPage.myWork()).click()` after navigating
- Use `await page.waitForLoadState('networkidle')` after `page.goto()`
- For state assertions: `expect(['Allocated', 'Offered']).toContain(stateText?.trim())`
- Use `expect.soft()` for non-critical assertions
- Never hardcode URLs — use `TestData.*` keys

**Work Items template:**
```typescript
import { test, expect, Page } from '@playwright/test';
import { POManager } from '../../PageObjects/POManager';
import { WorkListPage } from '../../PageObjects/WorkListPage';

const TestData = JSON.parse(JSON.stringify(require('../../fixtures/TestData.json')));

let page: Page;
let poManager: POManager;
let wlPage: WorkListPage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  wlPage = poManager.getWorkListPage();
});

test.describe('<Feature Name>', () => {
  test('<test name>', async () => {
    await page.goto(TestData.workMangerUrl);
    await page.waitForLoadState('networkidle');
    await (await wlPage.myWork()).click();
    // test body
  });
});
```

#### Rules for Work Views tests
- Import: `test`, `expect`, `Page` from `@playwright/test`; `POManager`; `WorkViewsPage`; `CaseManagerPage`; `HomePage`
- Use `test.beforeAll` for page setup; `test.beforeEach` to navigate to Work Views (matching `03_WorkView.spec.ts` pattern)
- Always navigate via `wv.navigateToWorkViews()` in `beforeEach`
- Use `TestData.workMangerUrlApp` (not `workMangerUrl`)
- Use `expect.soft()` on all visibility checks for work view list items

**Work Views template:**
```typescript
import { test, expect, Page } from '@playwright/test';
import { POManager } from '../../PageObjects/POManager';
import { WorkViewsPage } from '../../PageObjects/WorkViewsPage';
import { CaseManagerPage } from '../../PageObjects/CaseManagerPage';
import { HomePage } from '../../PageObjects/HomePage';

const TestData = JSON.parse(JSON.stringify(require('../../fixtures/TestData.json')));

let page: Page;
let poManager: POManager;
let wv: WorkViewsPage;
let cmPage: CaseManagerPage;
let homePage: HomePage;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  poManager = new POManager(page);
  wv = poManager.getWorkViewsPage();
  cmPage = poManager.getCaseManagerPage();
  homePage = poManager.getHomePage();
});

test.describe('<Feature Name>', () => {
  test.beforeEach(async () => {
    await page.goto(TestData.workMangerUrlApp);
    await page.waitForLoadState('networkidle');
    await homePage.clickOnBuisnessService();
    await cmPage.selectServerFromGlobalSwitcher(TestData.ServerName);
    await cmPage.clickOnConfirmServerSelectionBtn();
    await wv.navigateToWorkViews();
  });

  test('<test name>', async () => {
    // test body
  });
});
```

### Step 3 — Show the user what was generated
Print a summary table of all test cases written:
```
Generated X test cases in tests/<folder>/<SpecFile>_Generated.spec.ts

 #  | Test Name                              | What it verifies
----|----------------------------------------|----------------------------
 1  | Create Work View with all wizard steps | Work view appears in list after create
 2  | Sort work view list by creation date   | Last work view becomes first
...
```
Ask: "Ready to run these tests? [y/N]"

### Step 4 — Execute the tests
If user says yes, run:
```bash
npx playwright test tests/<folder>/<SpecFile>_Generated.spec.ts --reporter=list
```
Use the Bash tool to execute from the project root directory.

### Step 5 — Report results

**On success:**
```
Test Results — <Module> <Feature>
==========================================
 PASSED  X / X tests

 ✓  Create Work View with all wizard steps   (4.1s)
 ✓  Sort work view list by creation date     (2.3s)
==========================================
All tests passed.
```

**On failure:**
```
Test Results — <Module> <Feature>
==========================================
 PASSED  X / Y tests   FAILED  Z / Y tests

 ✓  Create Work View with all wizard steps   (4.1s)
 ✗  Sort work view list by creation date     FAILED
    Error: expect(received).toBe(expected)
    Expected: "TestWV"  Received: ""
    at tests/Parallel/WorkViews_Sort_Generated.spec.ts:38
==========================================
Suggested fix: [explain what likely went wrong and how to fix it]
```

After results, ask:
> "Would you like to re-run failed tests only, generate more test cases, or open the Playwright report?"

If user says "open report":
```bash
npx playwright show-report
```

---

## Important Notes

- **Work Items** spec files go in `tests/Serial/`; **Work Views** spec files go in `tests/Parallel/`
- Do not invent locators not in `WorkListPage.ts` or `WorkViewsPage.ts`. If a new locator is needed, add it to the Page Object first.
- Work Views tests require prerequisite deployments (Org Model) and LDAP container setup — include a `test.describe('Pre requisite')` block when the target work view needs org data.
- Work Items tests that need process deployments (skip, pend, reallocate) should include a `test.describe('Setup')` block deploying and starting the required RASC files.
- For timing-sensitive Work Items tests (pend date/offset), set `test.setTimeout(300000)`.
- Generated spec files complement — they do not replace — `04_WorkList.spec.ts` and `03_WorkView.spec.ts`.