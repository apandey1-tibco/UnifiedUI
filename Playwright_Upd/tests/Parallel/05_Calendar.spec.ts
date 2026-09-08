import { test, expect, Page } from "@playwright/test";
import { CalendarPage } from "../../PageObjects/CalendarPage";
import { WorkingHoursPage } from "../../PageObjects/WorkingHoursPage";
import { AdministratorPage } from "../../PageObjects/AdministratorPage";
import { DeploymentManagerPage } from "../../PageObjects/DeploymentManagerPage";
import { CustomCommandsHelper } from "../helpers/CustomCommandsHelper";
import { OrgBrowserPage } from "../../PageObjects/OrgBrowserPage";
import testData from '../../fixtures/TestData.json';


let page: Page;
let calendarPage: CalendarPage;
let workingHoursPage: WorkingHoursPage;
let ap: AdministratorPage;
let dmPage: DeploymentManagerPage;
let customCmds: CustomCommandsHelper;
let DeployedCount: number;
let UndeployingAppCount: number;
let ob: OrgBrowserPage;

test.describe.serial("Calendar UI Regression Suite", () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    calendarPage = new CalendarPage(page);
    workingHoursPage = new WorkingHoursPage(page);
    ap = new AdministratorPage(page);
    dmPage = new DeploymentManagerPage(page);
    customCmds = new CustomCommandsHelper(page, calendarPage);
    ob = new OrgBrowserPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("Login to Calendar", async () => {
    await customCmds.loginWebComponent(page, testData.webcomponenturl, testData.username, testData.password);
    await page.waitForTimeout(2000);
    await page.goto(testData.calendarurl);
    await page.waitForTimeout(2000);
    await expect(calendarPage.calendarWelcomeTitle).toContainText("Calendar");
    await customCmds.serverSelectAngular(" Local Server ");
  });

  test("Create_BaseCalendar", async () => {
    await page.waitForTimeout(5000);
    await customCmds.newBaseCalendar(
      "Test",
      "QA",
      5,
      "(UTC +05:30) India Standard Time",
      "Asia/Calcutta"
    );
    await expect(calendarPage.toastMessage).toContainText("Base calendar successfully created", { timeout: 15000 });
  });

  test("Create_OverlayCalendar", async () => {
    await customCmds.newOverlayCalendar("Overlay1", "QA");
  });

  test("Open_Calendar_From_CalendarList", async () => {
    await calendarPage.calendarList.click({ force: true });
    await customCmds.selectCalendarFromList("Test");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Test");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Open");
  });

  test("Add Working Hours", async () => {
    await calendarPage.openWorkingHours.click();
    await expect(workingHoursPage.confirmTitle).toContainText("Confirm");
    await workingHoursPage.confirmButton.click({ force: true });
    await page.waitForTimeout(2000);
    await expect(workingHoursPage.workingHoursDialogTitle).toContainText("Working hours");

    await customCmds.addWorkingDay("Monday", "09:00 AM", "06:00 PM");
    await customCmds.addWorkingDay("Tuesday", "09:00 AM", "06:00 PM");
    await customCmds.addWorkingDay("Wednesday", "09:00 AM", "06:00 PM");
    await customCmds.addWorkingDay("Thursday", "09:00 AM", "06:00 PM");
    await customCmds.addWorkingDay("Friday", "09:00 AM", "06:00 PM");

    await page.waitForTimeout(1000);
    await calendarPage.addExtraSlotFor("Monday").click();
    await page.waitForTimeout(1000);
    await calendarPage.extraSlotStartSelect("Monday").click();
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("06:30 PM").click();
    await calendarPage.extraSlotEndSelect("Monday").click();
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("10:30 PM").click();
    await page.waitForTimeout(1000);
    await calendarPage.saveButton.click();
    await page.waitForTimeout(2000);
  });

  test("Verify added working day", async () => {
    await expect(calendarPage.workingHoursEvents).toHaveCount(6);
    await expect(calendarPage.firstWorkingHoursEventText).toHaveText("9:00 AM  - 6:00 PM ");
    await expect(calendarPage.secondWorkingHoursEventText).toHaveText("6:30 PM  - 10:30 PM ");

    await calendarPage.firstWorkingHoursEvent.click();
    await page.waitForTimeout(2000);
    await calendarPage.addExtraSlotFor("Monday").click();
    await page.waitForTimeout(1000);
    await calendarPage.saveButton.first().click({ force: true });
    await page.waitForTimeout(2000);
    await expect(calendarPage.workingHoursEvents).toHaveCount(5);
  });

  test("Delete Working Hours", async () => {
    await calendarPage.openWorkingHours.click();
    await calendarPage.firstWorkingHoursEventText.click({ force: true });
    await page.waitForTimeout(2000);

    await calendarPage.weekdayDot("W").click();
    await page.waitForTimeout(1000);
    await calendarPage.weekdayDot("F").click();
    await calendarPage.saveButton.click({ force: true });
    await page.waitForTimeout(1000);
    await expect(calendarPage.workingHoursEvents).toHaveCount(3);

    await calendarPage.firstWorkingHoursEventText.click({ force: true });
    await page.waitForTimeout(1000);
    await calendarPage.weekdayDot("M").click();
    await calendarPage.firstWeekdayDot("T").click();
    await page.waitForTimeout(1000);
    await calendarPage.firstWeekdayDot("T").click();
    await calendarPage.saveButton.click();
    await page.waitForTimeout(1000);
    await calendarPage.cancelButton.click();
    await page.waitForTimeout(1000);
    await expect(calendarPage.workingHoursEvents).toHaveCount(0);
    await calendarPage.openNotAvailable.click();
    await page.waitForTimeout(1000);
  });

  test("Open Not Available", async () => {
    await calendarPage.openNotAvailable.click();
  });

  test("Duplicate Calendar", async () => {
    await customCmds.selectCalendarFromList("Test");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Test");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Duplicate");
    await page.waitForTimeout(2000);
    await expect(calendarPage.duplicateCalendarTitle).toBeVisible();
    await calendarPage.addButton.click({ force: true });
    await page.waitForTimeout(1000);
  });

  test("Delete_Calendar", async () => {
    await customCmds.selectCalendarFromList("Test-copy");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Test-copy");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Delete");
    await expect(calendarPage.confirmDialogTitle).toHaveText("Confirm");
    await expect(calendarPage.confirmDialogMessage).toHaveText("Would you like to delete calendar?");
    await calendarPage.confirmButton.click();
  });

  test("Add Working Day Exclusion for Today", async () => {
    await customCmds.sideNavOption('Calendar list')
    await customCmds.selectCalendarFromList("Test");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Test");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Open");
    await page.waitForTimeout(2000);
    await calendarPage.todayCell.click();
    await customCmds.workingDayExclusion("Meet", "09:00 AM", "11:00 AM");
    await page.waitForTimeout(1000);
  });

  test("Add recurring exclusion for Today", async () => {
    await calendarPage.todayCell.click();
    await page.waitForTimeout(1000);
    await customCmds.recurringExclusion("Rec", "01:00 PM", "03:00 PM", 1);
    //await customCmds.selectRepeats("Daily");
    await calendarPage.repeatButton.click();
    await page.waitForTimeout(1000);
    await calendarPage.neverEndOption.click();
    await calendarPage.addButton.click();
    await page.waitForTimeout(1000);
  });


  test("Verify added exclusion", async () => {
    await page.waitForTimeout(2000);
    await expect(calendarPage.monthTitle("Meet")).toHaveCount(1);
    const recCount = await calendarPage.monthTitle("Rec").count();
    expect(recCount).toBeGreaterThanOrEqual(1);
  });

  test("Navigate to Jan 1 2035 and add Exclusion", async () => {
    await customCmds.goTo("2035", "JAN", "1");
    await customCmds.selectDateForEvent("1");
    await page.waitForTimeout(1000);
    await customCmds.recurringExclusion("Rec1", "01:00 PM", "03:00 PM", 1);
    await calendarPage.repeatButton.click();
    //await customCmds.selectRepeats("Daily");
    await page.waitForTimeout(1000);
    await calendarPage.addButton.click();
    await page.waitForTimeout(1000);
  });

  test("Verify added exclusion - Rec1", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(34);
  });

  test("View Week", async () => {
    await customCmds.selectView("Week");
    await page.waitForTimeout(2000);
    await expect(customCmds.eventTitle("Rec1")).toHaveCount(6);
  });

  test("View Day", async () => {
    await customCmds.selectView("Day");
    await page.waitForTimeout(2000);
    await expect(customCmds.eventTitle("Rec1")).toHaveCount(1);
  });

  test("View Month", async () => {
    await customCmds.selectView("Month");
  });

  test("Update daily to weekly never ending", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.selectRepeats("Weekly");
    await customCmds.repeatsOn("M");
    await customCmds.repeatsOn("W");
    await customCmds.repeatsOn("F");
    await calendarPage.saveButton.first().click();
  });

  test("Verify updated weekly exclusion - never ending", async () => {
    await page.waitForTimeout(2000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(15);
  });

  test("Update weekly to monthly never ending", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.selectRepeats("Monthly");
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(2000);
  });

  test("Verify updated monthly exclusion - never ending", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(2);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2037", "JAN", "1");
    await page.waitForTimeout(1000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2035", "JAN", "1");
  });

  test("Update monthly to yearly never ending", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").last().click({ force: true });
    await customCmds.selectRepeats("Yearly");
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(1000);
  });

  test("Verify updated yearly exclusion - never ending", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2037", "JAN", "1");
    await page.waitForTimeout(1000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2035", "JAN", "1");
  });

  test("Update daily set end date", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.selectRepeats("Daily");
    await customCmds.selectEnds("Set end date");
    await customCmds.endDateField().click({ force: true });
    await page.waitForTimeout(1000);
    await calendarPage.nextMonthNav.click();
    await page.waitForTimeout(1000);
    await calendarPage.previousMonthNav.click();
    await page.waitForTimeout(1000);
    await calendarPage.monthAndYear.click();
    await page.waitForTimeout(1000);
    await calendarPage.next24Years.click();
    await page.waitForTimeout(1000);
    await calendarPage.previous24Years.click();
    await page.waitForTimeout(1000);
    await calendarPage.selectYear("2037").click();
    await page.waitForTimeout(1000);
    await calendarPage.selectMonth("JAN").click();
    await page.waitForTimeout(1000);
    await calendarPage.selectDate("31").click();
    await page.waitForTimeout(1000);
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(3000);
  });

  test("Verify updated daily exclusion - set end date", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(34);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2037", "JAN", "1");
    await page.waitForTimeout(1000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(31);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2035", "JAN", "1");
  });

  test("Update Daily to weekly set end date", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.selectRepeats("Weekly");
    await customCmds.repeatsOn("M");
    await customCmds.repeatsOn("W");
    await customCmds.repeatsOn("F");
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(1000);
  });

  test("Verify updated weekly exclusion - set end date", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(15);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2037", "JAN", "1");
    await page.waitForTimeout(1000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(13);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2035", "JAN", "1");
  });

  test("Update weekly to monthly set end date", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.selectRepeats("Monthly");
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(1000);
  });

  test("Verify updated monthly exclusion - set end date", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(2);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2037", "JAN", "1");
    await page.waitForTimeout(1000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2035", "JAN", "1");
  });

  test("Update monthly to yearly set end date", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.selectRepeats("Yearly");
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(1000);
  });

  test("Verify updated yearly exclusion - set end date", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2037", "JAN", "1");
    await page.waitForTimeout(1000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2035", "JAN", "1");
  });

  test("Update daily occurrences and interval", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.selectRepeats("Daily");
    await customCmds.setInterval(2);
    await customCmds.selectEnds("Set number of occurrences");
    await customCmds.setOccurrence(10);
    await page.waitForTimeout(1000);
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(2000);
  });

  test("Verify updated daily exclusion - occurrences", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(10);
    await page.waitForTimeout(1000);
  });

  test("Update Daily to weekly occurrence and interval", async () => {
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.setInterval(2);
    await customCmds.selectRepeats("Weekly");
    await customCmds.repeatsOn("M");
    await customCmds.repeatsOn("W");
    await customCmds.repeatsOn("F");
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(1000);
  });

  test("Verify updated weekly exclusion - occurrences", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(9);
  });

  test("Update weekly to monthly occurrence and interval", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.setInterval(2);
    await customCmds.selectRepeats("Monthly");
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(1000);
  });

  test("Verify updated monthly exclusion - occurrences", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await calendarPage.nextMonth.click();
    await calendarPage.nextMonth.click();
    await page.waitForTimeout(1000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await calendarPage.previousMonth.click();
    await calendarPage.previousMonth.click();
  });

  test("Update monthly to yearly occurrence and interval", async () => {
    await page.waitForTimeout(3000);
    await calendarPage.monthTitle("Rec1").first().click({ force: true });
    await customCmds.setInterval(2);
    await customCmds.selectRepeats("Yearly");
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(1000);
  });

  test("Verify updated Yearly exclusion - occurrences", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2037", "JAN", "1");
    await page.waitForTimeout(1000);
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(1);
    await page.waitForTimeout(1000);
    await customCmds.goTo("2035", "JAN", "1");
  });

  test("Delete Recurring Exclusion Rec1", async () => {
    await customCmds.deleteExclusion("Rec1");
  });

  test("Update event add starton", async () => {
    await calendarPage.today.click();
    await page.waitForTimeout(1000);
    await calendarPage.monthTitle("Rec").first().click({ force: true });
    await page.waitForTimeout(1000);
    await customCmds.startsOn("2035", "JAN", "5");
    await page.waitForTimeout(1000);
    await customCmds.selectEnds("Set number of occurrences");
    await page.waitForTimeout(1000);
    await customCmds.setOccurrence(10);
    await page.waitForTimeout(1000);
    await calendarPage.saveButton.first().click();
    await page.waitForTimeout(3000);
  });

  test("Verify updated event - starton", async () => {
    await customCmds.goTo("2035", "JAN", "1");
    await expect(calendarPage.monthTitle("Rec")).toHaveCount(10);
    await page.waitForTimeout(1000);
  });

  test("Edit Event reason start and end time", async () => {
    await calendarPage.monthTitle("Rec").first().click();
    await page.waitForTimeout(1000);
    await calendarPage.reasonInput.click();
    await calendarPage.reasonInput.clear();
    await calendarPage.reasonInput.fill("UpdatedRec");
    await calendarPage.startTimeSelect.click();
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("05:00 PM").click();
    await calendarPage.endTimeSelect.click();
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("06:00 PM").click();
    await page.waitForTimeout(1000);
    await calendarPage.recurrenceSaveUpdateBtn.click({ force: true });
  });

  test("Verify the updated event", async () => {
    await calendarPage.monthTitle("UpdatedRec").first().click();
    await page.waitForTimeout(1000);
    await expect(calendarPage.startTimeSelect).toContainText("05:00 PM");
    await expect(calendarPage.endTimeSelect).toContainText("06:00 PM");
    await calendarPage.cancelButton.click();
    await page.waitForTimeout(1000);
  });

  test("Delete exclusion Rec", async () => {
    await customCmds.deleteExclusion("Rec");
    await page.waitForTimeout(1000);
  });

  test("Delete All day exclusion", async () => {
    await calendarPage.today.click();
    await customCmds.deleteExclusion("Meet");
    await page.waitForTimeout(3000);
  });

  test("All day exclusion in overlay calendar", async () => {
    await page.waitForTimeout(3000);
    //await calendarPage.calendarList.click({ force: true });
    await customCmds.selectCalendarFromList("Overlay1");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Overlay1");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Open");
    await page.waitForTimeout(3000);
    await calendarPage.todayCell.click();
    await customCmds.allDayExclusion("Holiday");
  });

  test("Verify all day exclusion in overlay calendar", async () => {
    await page.waitForTimeout(2000);
    await expect(calendarPage.monthTitle("Holiday")).toHaveCount(1);
    //await customCmds.sideNavOption("Calendar list");
    await customCmds.deleteExclusion("Holiday");
  });

  test("Add Working Day Exclusion for Today in Overlay", async () => {
    await calendarPage.todayCell.click();
    await customCmds.workingDayExclusion("Meet", "09:00 AM", "11:00 AM");
    await page.waitForTimeout(1000);
  });

  test("Add recurring exclusion for Today in Overlay", async () => {
    await calendarPage.todayCell.click();
    await page.waitForTimeout(1000);
    await customCmds.recurringExclusion("Rec", "01:00 PM", "03:00 PM", 1);
    //await customCmds.selectRepeats("Daily");
    await calendarPage.repeatButton.click();
    await page.waitForTimeout(1000);
    await calendarPage.neverEndOption.click();
    await calendarPage.addButton.click();
    await page.waitForTimeout(1000);
  });


  test("Verify added exclusion in Overlay", async () => {
    await page.waitForTimeout(2000);
    await expect(calendarPage.monthTitle("Meet")).toHaveCount(1);
    const recCount3 = await calendarPage.monthTitle("Rec").count();
    expect(recCount3).toBeGreaterThanOrEqual(1);
  });

  //System Calendar
  test("Open_System Calendar_From_CalendarList ", async () => {
    await page.waitForTimeout(3000);
    //await calendarPage.calendarList.click({force:true});
    await customCmds.selectCalendarFromList("SYSTEM");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("SYSTEM");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Open");
  });

  test("Add Working Hours in System Calendar", async () => {
    await calendarPage.openWorkingHours.click();
    await expect(workingHoursPage.confirmTitle).toContainText("Confirm");
    await workingHoursPage.confirmButton.click({ force: true });
    await page.waitForTimeout(2000);
    await expect(workingHoursPage.workingHoursDialogTitle).toContainText("Working hours");

    await customCmds.addWorkingDay("Monday", "09:00 AM", "06:00 PM");
    await customCmds.addWorkingDay("Tuesday", "09:00 AM", "06:00 PM");
    await customCmds.addWorkingDay("Wednesday", "09:00 AM", "06:00 PM");
    await customCmds.addWorkingDay("Thursday", "09:00 AM", "06:00 PM");
    await customCmds.addWorkingDay("Friday", "09:00 AM", "06:00 PM");

    await page.waitForTimeout(1000);
    await calendarPage.addExtraSlotFor("Monday").click();
    await page.waitForTimeout(1000);
    await calendarPage.extraSlotStartSelect("Monday").click();
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("06:30 PM").click();
    await calendarPage.extraSlotEndSelect("Monday").click();
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("10:30 PM").click();
    await page.waitForTimeout(1000);
    await calendarPage.saveButton.click();
    await page.waitForTimeout(2000);
  });

  test("Verify added working day in System Calendar", async () => {
    await expect(calendarPage.workingHoursEvents).toHaveCount(6);
    await expect(calendarPage.firstWorkingHoursEventText).toHaveText("9:00 AM  - 6:00 PM ");
    await expect(calendarPage.secondWorkingHoursEventText).toHaveText("6:30 PM  - 10:30 PM ");

    await calendarPage.firstWorkingHoursEvent.click();
    await page.waitForTimeout(2000);
    await calendarPage.addExtraSlotFor("Monday").click();
    await page.waitForTimeout(1000);
    await calendarPage.saveButton.first().click({ force: true });
    await page.waitForTimeout(2000);
    await expect(calendarPage.workingHoursEvents).toHaveCount(5);
  });

  test("Delete Working Hours in System Calendar", async () => {
    await calendarPage.openWorkingHours.click();
    await calendarPage.firstWorkingHoursEventText.click({ force: true });
    await page.waitForTimeout(2000);

    await calendarPage.weekdayDot("W").click();
    await page.waitForTimeout(1000);
    await calendarPage.weekdayDot("F").click();
    await calendarPage.saveButton.click({ force: true });
    await page.waitForTimeout(1000);
    await expect(calendarPage.workingHoursEvents).toHaveCount(3);

    await calendarPage.firstWorkingHoursEventText.click({ force: true });
    await page.waitForTimeout(1000);
    await calendarPage.weekdayDot("M").click();
    await calendarPage.firstWeekdayDot("T").click();
    await page.waitForTimeout(1000);
    await calendarPage.firstWeekdayDot("T").click();
    await calendarPage.saveButton.click();
    await page.waitForTimeout(1000);
    await calendarPage.cancelButton.click();
    await page.waitForTimeout(1000);
    await expect(calendarPage.workingHoursEvents).toHaveCount(0);
    await calendarPage.openNotAvailable.click();
    await page.waitForTimeout(1000);
  });

  test("Open Not Available in System Calendar", async () => {
    await calendarPage.openNotAvailable.click();
  });

  test("Duplicate System Calendar", async () => {
    await customCmds.selectCalendarFromList("SYSTEM");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("SYSTEM");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Duplicate");
    await page.waitForTimeout(2000);
    await expect(calendarPage.duplicateCalendarTitle).toBeVisible();
    await calendarPage.categoryField.fill('QA');
    await calendarPage.addButton.click({ force: true });
    await page.waitForTimeout(1000);
  });

  test("Delete_ System Copy Calendar", async () => {
    await customCmds.selectCalendarFromList("SYSTEM-copy");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("SYSTEM-copy");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Delete");
    await expect(calendarPage.confirmDialogTitle).toHaveText("Confirm");
    await expect(calendarPage.confirmDialogMessage).toHaveText("Would you like to delete calendar?");
    await calendarPage.confirmButton.click();
  });

  test("Add Working Day Exclusion for Today in System Calendar", async () => {
    //await calendarPage.calendarList.click({force:true});
    await customCmds.selectCalendarFromList("SYSTEM");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("SYSTEM");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Open");
    await page.waitForTimeout(2000);
    await calendarPage.todayCell.click();
    await customCmds.workingDayExclusion("Meet", "09:00 AM", "11:00 AM");
    await page.waitForTimeout(1000);
  });

  test("Add recurring exclusion for Today in System Calendar", async () => {
    await calendarPage.todayCell.click();
    await page.waitForTimeout(1000);
    await customCmds.recurringExclusion("Rec", "01:00 PM", "03:00 PM", 1);
    //await customCmds.selectRepeats("Daily");
    await calendarPage.repeatButton.click();
    await page.waitForTimeout(1000);
    await calendarPage.neverEndOption.click();
    await calendarPage.addButton.click();
    await page.waitForTimeout(1000);
  });


  test("Verify added exclusion in System Calendar", async () => {
    await page.waitForTimeout(2000);
    await expect(calendarPage.monthTitle("Meet")).toHaveCount(1);
    const recCount4 = await calendarPage.monthTitle("Rec").count();
    expect(recCount4).toBeGreaterThanOrEqual(1);
  });

  test("Navigate to Jan 1 2035 and add Exclusion in System Calendar", async () => {
    await customCmds.goTo("2035", "JAN", "1");
    await customCmds.selectDateForEvent("1");
    await page.waitForTimeout(1000);
    await customCmds.recurringExclusion("Rec1", "01:00 PM", "03:00 PM", 1);
    await calendarPage.repeatButton.click();
    //await customCmds.selectRepeats("Daily");
    await page.waitForTimeout(1000);
    await calendarPage.addButton.click();
    await page.waitForTimeout(1000);
  });

  test("Verify added exclusion - Rec1 in System Calendar", async () => {
    await expect(calendarPage.monthTitle("Rec1")).toHaveCount(34);
    await calendarPage.today.click();
    await customCmds.deleteExclusion('Meet');
    await customCmds.deleteExclusion('Rec');
    await calendarPage.calendarList.click()
  });


  //Calendar Aliases
  test("Open Calendar Aliases", async () => {
    await page.waitForTimeout(5000);
    await customCmds.sideNavOption(" Calendar aliases ");
    await page.waitForTimeout(1000);
    await expect(calendarPage.pageH1Title).toContainText("Assign alias to calendar");
  });

  test("Select calendar and add alias - Test", async () => {
    await customCmds.selectCalendarForAlias("Test");
    await page.waitForTimeout(3000);
    await customCmds.addAlias("Ref1");
  });

  test("Verify added alias - Test/Ref1", async () => {
    await customCmds.selectCalendarForAlias("Test");
    await customCmds.verifyAddedAlias("Ref1");
  });

  test("Select calendar and add alias - SYSTEM", async () => {
    await customCmds.selectCalendarForAlias("SYSTEM");
    await page.waitForTimeout(3000);
    await customCmds.addAlias("Ref");
  });

  test("Verify added alias - SYSTEM/Ref", async () => {
    await customCmds.selectCalendarForAlias("SYSTEM");
    await customCmds.verifyAddedAlias("Ref");
  });

  test("Select calendar and add alias - Overlay1", async () => {
    await customCmds.selectCalendarForAlias("Overlay1");
    await page.waitForTimeout(3000);
    await customCmds.addAlias("o1");
  });

  test("Verify added alias - Overlay1/o1", async () => {
    await customCmds.selectCalendarForAlias("Overlay1");
    await customCmds.verifyAddedAlias("o1");
  });

  test("Edit Calendar Alias", async () => {
    await customCmds.selectCalendarForAlias("Test");
    await customCmds.selectAlias("Ref1");
    await customCmds.aliasOption("Ref1", "Edit");
    await customCmds.editAlias("Ref123");
  });

  test("Verify edited alias - Ref123", async () => {
    await customCmds.selectCalendarForAlias("Test");
    await customCmds.verifyAddedAlias("Ref123");
  });

  test("ReassignAlias", async () => {
    await customCmds.selectCalendarForAlias("SYSTEM");
    await page.waitForTimeout(1000);
    await customCmds.selectAlias("Ref");
    await customCmds.aliasOption("Ref", "Reassign");
    await customCmds.reassignAliasTo("Test");
  });

  test("ReassignAlias to System Calendar", async () => {
    await customCmds.selectCalendarForAlias("Overlay1");
    await page.waitForTimeout(1000);
    await customCmds.selectAlias("o1");
    await customCmds.aliasOption("o1", "Reassign");
    await customCmds.reassignAliasTo("SYSTEM");
  });

  test("Delete Alias for base calendar", async () => {
    await customCmds.selectCalendarForAlias("Test");
    await page.waitForTimeout(1000);
    await customCmds.selectAlias("Ref123");
    await customCmds.aliasOption("Ref123", "Delete");
  });

  test("Delete Alias for system calendar", async () => {
    await customCmds.selectCalendarForAlias("SYSTEM");
    await page.waitForTimeout(1000);
    await customCmds.selectAlias("o1");
    await customCmds.aliasOption("o1", "Delete");
  });

  test("Verify alias are deleted", async () => {
    await customCmds.selectCalendarForAlias("Test");
    await page.waitForTimeout(1000);
    await expect(calendarPage.aliasListContainer).not.toContainText("Ref123");
    await customCmds.selectCalendarForAlias("SYSTEM");
    await page.waitForTimeout(1000);
    await expect(calendarPage.aliasListContainer).not.toContainText("o1");
    await calendarPage.dialogCloseButton.click();
  });

  test("Visit to Administrator and navigate to deployment manager", async () => {
    await page.goto(testData.adminUrl);
    await page.waitForTimeout(2000);

    await expect(page).toHaveTitle('Administrator', { timeout: 30000 });
    await expect(ap.AdministratorWelcomeTitle).toContainText('Welcome to Administrator');

    await expect(ap.DeploymentManagerCard).toHaveText('Deployment Manager');
    await ap.DeploymentManagerGoButton.click();
    await page.waitForTimeout(3000);

    await expect(ap.ActiveTabTitle).toContainText('Deployment Manager');
  });

  test("Deploy Org Model at Version 2", async () => {
    const listing = dmPage.DeployedAndUnDeployingCount("Deployed");
    DeployedCount = parseInt(await listing.innerText());

    const undeployListing = dmPage.DeployedAndUnDeployingCount("Undeploying");
    UndeployingAppCount = parseInt(await undeployListing.innerText());

    const deployBodyText = await dmPage.DeployBody.textContent();
    if (deployBodyText && deployBodyText.includes(testData.pushDestination)) {
      console.log('App is already deployed!');
    } else {
      console.log('Deploying the PushDestination Project');
      await dmPage.NewDeploymentButton.click();
      await customCmds.selectFileToDeploy(testData.pushDestination + "-dev-2.0.rasc");

      //  await expect(dm.RascUploadVerficationText).toContainText('rasc');
      await expect(dmPage.DeployButton).toBeEnabled({ timeout: 10000 });
      await dmPage.DeployButton.click();

      //await expect(dm.DragFileMenu).toContainText('Drag a RASC file', { timeout: 120000 });
      const txtRasc = await dmPage.getDragFileMenu();
      expect(await txtRasc.innerText()).toContain("Drag a RASC file");
      await page.waitForTimeout(3000);
    }
  });

  test("Verify that the Push Destination project is deployed successfully", async () => {
    await dmPage.AllDeploymentsTab.click();
    await page.waitForTimeout(3000);

    await expect(dmPage.DeployedAppList).toContainText(testData.pushDestination);
    await expect(dmPage.AppStatus(testData.pushDestination)).toHaveText(" Deployed ");
    await expect(dmPage.AppType(testData.pushDestination)).toHaveText(" organization ");

    const deployedApps = parseInt(
      await dmPage.DeployedAndUnDeployingCount("Deployed").innerText()
    );
    expect(deployedApps).toEqual(++DeployedCount);
  });

  test("Deploy Org Model at Version 1", async () => {
    const listing = dmPage.DeployedAndUnDeployingCount("Deployed");
    DeployedCount = parseInt(await listing.innerText());

    const undeployListing = dmPage.DeployedAndUnDeployingCount("Undeploying");
    UndeployingAppCount = parseInt(await undeployListing.innerText());

    const deployBodyText = await dmPage.DeployBody.textContent();
    if (deployBodyText && deployBodyText.includes(testData.simpleOrg)) {
      console.log('App is already deployed!');
    } else {
      console.log('Deploying the SimpleOrg Project');
      await dmPage.NewDeploymentButton.click();
      await customCmds.selectFileToDeploy(testData.simpleOrg + "-dev-1.0.rasc");

      //  await expect(dm.RascUploadVerficationText).toContainText('rasc');
      await expect(dmPage.DeployButton).toBeEnabled({ timeout: 10000 });
      await dmPage.DeployButton.click();

      //await expect(dm.DragFileMenu).toContainText('Drag a RASC file', { timeout: 120000 });
      const txtRasc = await dmPage.getDragFileMenu();
      expect(await txtRasc.innerText()).toContain("Drag a RASC file");
      await page.waitForTimeout(3000);
    }
  });

  test("Verify that the SimpleOrgModel project is deployed successfully", async () => {
    await dmPage.AllDeploymentsTab.click();
    await page.waitForTimeout(3000);

    await expect(dmPage.DeployedAppList).toContainText(testData.simpleOrg);
    await expect(dmPage.AppStatus(testData.simpleOrg)).toHaveText(" Deployed ");
    await expect(dmPage.AppType(testData.simpleOrg)).toHaveText(" organization ");

    const deployedApps = parseInt(
      await dmPage.DeployedAndUnDeployingCount("Deployed").innerText()
    );
    expect(deployedApps).toEqual(++DeployedCount);
  });

  test('Deploy the RASC for Org Project', async () => {
    const countText = await dmPage.DeployedAndUnDeployingCount('Deployed').textContent();
    DeployedCount = parseInt(countText || '0');

    await dmPage.AllDeploymentsTab.click();
    await page.waitForTimeout(3000);

    const orgModelDeployed6 = await dmPage.AppStatus(testData.DynamicOrgModel).isVisible();
    if (orgModelDeployed6) {
      console.log('App is already deployed!');
    } else {
      console.log('Deploying the DynamicOrg Project');
      await dmPage.NewDeploymentButton.click();
      await customCmds.selectFileToDeploy(testData.DynamicOrgModel + "-prod-1.1.rasc");

      //await expect(dm.RascUploadVerficationText).toContainText('rasc');
      await expect(dmPage.DeployButton).toBeEnabled({ timeout: 10000 });
      await dmPage.DeployButton.click();

      const txtRasc = await dmPage.getDragFileMenu();
      expect(await txtRasc.innerText()).toContain("Drag a RASC file");
      await page.waitForTimeout(3000);
    }
  });

  test('Verify that the DynamicOrg project is deployed successfully', async () => {
    await dmPage.AllDeploymentsTab.click();
    await page.waitForTimeout(3000);

    await expect(dmPage.DeployedAppList.locator(`text="${testData.DynamicOrgModel}"`)).toBeVisible();
    await expect(dmPage.AppStatus(testData.DynamicOrgModel)).toHaveText(' Deployed ');
    await expect(dmPage.AppType(testData.DynamicOrgModel)).toHaveText(' organization ');

    const newCountText = await dmPage.DeployedAndUnDeployingCount('Deployed').textContent();
    const newDeployedApps = parseInt(newCountText || '0');
    DeployedCount++;
    expect(newDeployedApps).toBe(DeployedCount);
  });
  test('Navigate Organization Browser', async () => {
    await page.goto(testData.orgbrowserurl);
    await page.waitForTimeout(3000);
    //await expect(ob.OrgBrowserWelcomeTitle).toContainText('Welcome to Org Browser');
    await ob.selectServer(' Local server ');
    //await page.getByText('select server').click();
    //await page.getByRole('option', { name: ' Local server ' }).click();

  });

  test('Add Extension Points', async () => {
    await ob.goButton().last().click();
    await page.waitForTimeout(2000);
    await ob.BrowseOrganization_Tab.click();
    await page.waitForTimeout(2000);
    await ob.org_Version_selector().click();
    await ob.org_Version('1').click();
    await page.waitForTimeout(2000);
    await customCmds.expandOrganization();
    await ob.MoreOptions.click()
    await customCmds.addExtensionPoints();
    await page.waitForTimeout(2000);
    await expect(ob.GridItem).toContainText('town');
    await expect(ob.EditButton).toBeVisible();
    await expect(ob.DeleteButton).toBeVisible();
    await page.waitForTimeout(10000);
  });

  test('Reset Dynamic Org (2)', async () => {
    const response = await customCmds.resetOrg();
    expect(response.status).toBe(200);
    await page.waitForTimeout(30000);
    await page.reload();
  });

  test('Reset Dynamic Org (3)', async () => {
    const response = await customCmds.resetOrg();
    expect(response.status).toBe(200);
    await page.waitForTimeout(20000);
    await page.reload();
  });


  test("Open Map to Org Model and map alias to QA group", async () => {
    await page.goto(testData.calendarurl);
    await page.waitForTimeout(2000);
    await customCmds.sideNavOption(" Map to Org Models ");
    await page.waitForTimeout(1000);
    await customCmds.calendarselectVersion('1');
    await page.waitForTimeout(1000);
    await ob.click_Toggle_Button_In_Front_Of("Engineering");
    await page.waitForTimeout(1000);
    await ob.selectOrgEntity("QA");
    await page.waitForTimeout(1000);
    await customCmds.addAlias("Ref123");
    await page.waitForTimeout(1000);
    await customCmds.verifyAlias("Ref123");
    await page.waitForTimeout(1000);
  });

  test("Use selector, edit and delete alias", async () => {
    await customCmds.showEntityNames();
    await page.waitForTimeout(1000);

    await customCmds.selectAlias("Ref123");
    await page.waitForTimeout(1000);
    await customCmds.aliasOption("Ref123", "Edit");
    await page.waitForTimeout(1000);
    await customCmds.editAlias("Ref321");
    await page.waitForTimeout(1000);
    await customCmds.verifyAlias("Ref321");
    await page.waitForTimeout(1000);
    await customCmds.selectAlias("Ref321");
    await page.waitForTimeout(1000);
    await customCmds.aliasOption("Ref321", "Delete");
    await page.waitForTimeout(1000);
    await expect(calendarPage.selectionsContainer).not.toContainText("Ref321");
    await page.waitForTimeout(1000);
    await calendarPage.doneButton.click();
  });

  test("Open Map to Org Model and map alias to Dynamic group", async () => {
    await page.waitForTimeout(2000);
    await customCmds.sideNavOption("Map to Org Models");
    await page.waitForTimeout(1000);
    await customCmds.calendarselectVersion('1');
    await page.waitForTimeout(1000);
    await customCmds.showEntityNames();
    await ob.click_Toggle_Button_In_Front_Of("DynamicOrg");
    await page.waitForTimeout(1000);
    await ob.click_Toggle_Button_In_Front_Of("Board");
    await page.waitForTimeout(2000);
    await ob.click_Toggle_Button_In_Front_Of("Branches");
    await page.waitForTimeout(1000);
    await ob.selectOrgEntity("London");
    await page.waitForTimeout(1000);
    await customCmds.addAlias("Ref123");
    await page.waitForTimeout(1000);
    await customCmds.verifyAlias("Ref123");
    await page.waitForTimeout(1000);
    await calendarPage.doneButton.click();
  });

  test("Edit and Delete Test Calendar", async () => {
    await calendarPage.calendarList.click();
    await page.waitForTimeout(1000);
    await customCmds.selectCalendarFromList("Test");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Test");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Edit");
    await page.waitForTimeout(2000);

    await calendarPage.weekStartDaySelector("5").click();
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("6").click();
    await page.waitForTimeout(1000);

    await calendarPage.timezoneFirstSelect.click();
    await page.waitForTimeout(1000);
    await calendarPage.timezoneSearchInput.click({ force: true });
    await calendarPage.timezoneSearchInput.fill("Eastern");
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("(UTC -05:00) Eastern Standard Time").click();
    await page.waitForTimeout(2000);

    await calendarPage.timezoneSecondSelect.click();
    await page.waitForTimeout(1000);
    await calendarPage.lastOption("America/Cayman").click();
    await page.waitForTimeout(1000);
    await calendarPage.updateButton.click();
    await page.waitForTimeout(2000);
  });

  test("Delete Calendar having alias", async () => {
    await page.waitForTimeout(1000);
    await customCmds.selectCalendarFromList("Test");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Test");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Delete");
    await expect(calendarPage.confirmDialogTitle).toHaveText("Confirm");
    await expect(calendarPage.confirmDialogMessage).toHaveText("Would you like to delete calendar?");
    await calendarPage.confirmButton.click();
    await page.waitForTimeout(1000);
    await expect(calendarPage.errorMessage).toHaveText(
      "Unable to delete Calendar with associated References. Calendar Name : Test, Category: QA"
    );
    await page.waitForTimeout(1000);
    await calendarPage.dismissButton.click();
    await page.waitForTimeout(1000);
  });

  test("Delete Alias for base calendar before deleting", async () => {
    await customCmds.sideNavOption("Calendar aliases");
    await page.waitForTimeout(2000);
    await customCmds.selectCalendarForAlias("Test");
    await page.waitForTimeout(1000);
    await customCmds.selectAlias("Ref");
    await customCmds.aliasOption("Ref", "Delete");
    await calendarPage.dialogCloseButton.click();
    await page.waitForTimeout(1000);
  });

  test("Delete Base Calendar", async () => {
    await customCmds.selectCalendarFromList("Test");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Test");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Delete");
    await expect(calendarPage.confirmDialogTitle).toHaveText("Confirm");
    await expect(calendarPage.confirmDialogMessage).toHaveText("Would you like to delete calendar?");
    await calendarPage.confirmButton.click();
    await page.waitForTimeout(1000);
  });

  test("Delete Overlay Calendar", async () => {
    await customCmds.selectCalendarFromList("Overlay1");
    await page.waitForTimeout(1000);
    await customCmds.optionButtonFor("Overlay1");
    await page.waitForTimeout(1000);
    await customCmds.selectOption("Delete");
    await expect(calendarPage.confirmDialogTitle).toHaveText("Confirm");
    await expect(calendarPage.confirmDialogMessage).toHaveText("Would you like to delete calendar?");
    await calendarPage.confirmButton.click();
    await page.waitForTimeout(1000);
  });

  test("Verify calendar are deleted", async () => {
    await expect(calendarPage.calendarListContainer).not.toContainText("Test");
    await expect(calendarPage.calendarListContainer).not.toContainText("Overlay1");
  });

  test('Navigate to Org Browser and delete Extension Points', async () => {

    await page.goto(testData.orgbrowserurl);
    await ob.View_Manage_GoBtn('Manage LDAP containers').click();
    await ob.BrowseOrganization_Tab.click();
    await ob.org_Version_selector().click();
    await ob.org_Version('1').click();
    await customCmds.expandOrganization();
    await ob.MoreOptions.click()
    await customCmds.deleteExtensionPoints();
    await page.waitForTimeout(2000);
    await expect(ob.LDAP_dialogue_title).toContainText('Confirm');
    await expect(ob.LDAP_dialogue_msg).toContainText('Do you want to delete this extension point ?');
    await expect(ob.LDAP_dialogue_Btns('Cancel')).toBeVisible();
    await expect(ob.LDAP_dialogue_Btns('Confirm')).toBeVisible();
    await ob.LDAP_dialogue_Btns('Confirm').click();
    //await customCmds.DialogConfirm();

  });

  test("Navigate to admin and undeploy the deployed apps", async () => {
    await customCmds.adminHome(testData.adminUrl);
    await expect(page).toHaveTitle("Administrator");
    await expect(ap.AdministratorWelcomeTitle).toContainText("Welcome to Administrator");
    await expect(ap.DeploymentManagerCard).toHaveText("Deployment Manager");
    await ap.DeploymentManagerGoButton.click();
    await page.waitForTimeout(2000);

    await dmPage.Action(testData.DynamicOrgModel.trim()).click();
    await page.waitForTimeout(2000);
    await dmPage.Undeploy.click();
    await page.waitForTimeout(2000);
    await expect(dmPage.Undeploy_Dialogue_Conf_Msg).toHaveText('Are you sure you want to undeploy this file ?');
    await expect(dmPage.Undeploy_Dialogue_Warning_Msg).toHaveText('This action cannot be undone');
    await expect(dmPage.Undeploy_Dialogue_button('Cancel')).toBeVisible();
    await expect(dmPage.Undeploy_Dialogue_button('Yes, undeploy')).toBeVisible();
    await dmPage.Undeploy_Dialogue_button('Yes, undeploy').click();
    await page.waitForTimeout(3000);
    await expect(dmPage.DeployedApp(testData.DynamicOrgModel)).not.toBeVisible();

    await dmPage.Action(testData.pushDestination.trim()).click();
    await page.waitForTimeout(2000);
    await dmPage.Undeploy.click();
    await page.waitForTimeout(2000);
    await expect(dmPage.Undeploy_Dialogue_Conf_Msg).toHaveText("Are you sure you want to undeploy this file ?");
    await expect(dmPage.Undeploy_Dialogue_Warning_Msg).toHaveText("This action cannot be undone");
    await expect(dmPage.Undeploy_Dialogue_button("Cancel")).toBeVisible();
    await expect(dmPage.Undeploy_Dialogue_button("Yes, undeploy")).toBeVisible();
    await dmPage.Undeploy_Dialogue_button("Yes, undeploy").click();
    await page.waitForTimeout(3000);
    await expect(dmPage.DeployedApp(testData.pushDestination)).not.toBeVisible();

    await dmPage.Action(testData.simpleOrg.trim()).click();
    await page.waitForTimeout(2000);
    await dmPage.Undeploy.click();
    await page.waitForTimeout(2000);
    await expect(dmPage.Undeploy_Dialogue_Conf_Msg).toHaveText("Are you sure you want to undeploy this file ?");
    await expect(dmPage.Undeploy_Dialogue_Warning_Msg).toHaveText("This action cannot be undone");
    await expect(dmPage.Undeploy_Dialogue_button("Cancel")).toBeVisible();
    await expect(dmPage.Undeploy_Dialogue_button("Yes, undeploy")).toBeVisible();
    await dmPage.Undeploy_Dialogue_button("Yes, undeploy").click();
    await page.waitForTimeout(3000);
    await expect(dmPage.DeployedApp(testData.simpleOrg)).not.toBeVisible();
  });
});
