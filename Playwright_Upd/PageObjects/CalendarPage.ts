import { type Locator, type Page } from "@playwright/test";

export class CalendarPage {
  readonly page: Page;

  // ── Navbar ───────────────────────────────────────────────────────
  readonly calendarWelcomeTitle: Locator;

  // ── Notifications ────────────────────────────────────────────────
  readonly toastMessage: Locator;

  // ── Side nav: calendar creation ──────────────────────────────────
  readonly createNewCalendar: Locator;
  readonly createBaseCalendar: Locator;
  readonly createOverlayCalendar: Locator;
  readonly calendarList: Locator;
  readonly calendarListContainer: Locator;

  // ── Header: view toggles ─────────────────────────────────────────
  readonly openNotAvailable: Locator;
  readonly openWorkingHours: Locator;

  // ── Header: navigation ───────────────────────────────────────────
  readonly today: Locator;
  readonly todayCell: Locator;
  readonly calendarOption: Locator;
  readonly nextMonth: Locator;
  readonly previousMonth: Locator;

  // ── Header: date picker (popup) ──────────────────────────────────
  readonly dateYearDropdown: Locator;
  readonly sideNav: Locator;
  readonly monthAndYear: Locator;
  readonly next24Years: Locator;
  readonly previous24Years: Locator;
  readonly nextMonthNav: Locator;
  readonly previousMonthNav: Locator;
  readonly startsOn: Locator;

  // ── Working hours events ─────────────────────────────────────────
  readonly workingHoursEvents: Locator;
  readonly firstWorkingHoursEvent: Locator;
  readonly firstWorkingHoursEventText: Locator;
  readonly secondWorkingHoursEventText: Locator;

  // ── Common buttons ───────────────────────────────────────────────
  readonly saveButton: Locator;
  readonly recurrenceSaveUpdateBtn: Locator;
  readonly cancelButton: Locator;
  readonly addButton: Locator;
  readonly confirmButton: Locator;
  readonly dismissButton: Locator;
  readonly updateButton: Locator;
  readonly dialogCloseButton: Locator;
  readonly doneButton: Locator;
  readonly categoryField: Locator;

  // ── Exclusion / recurrence dialog ───────────────────────────────
  readonly neverEndOption: Locator;
  readonly reasonInput: Locator;
  readonly startTimeSelect: Locator;
  readonly endTimeSelect: Locator;
  readonly repeatButton: Locator;

  // ── Confirm / error dialogs ──────────────────────────────────────
  readonly confirmDialogTitle: Locator;
  readonly confirmDialogMessage: Locator;
  readonly errorMessage: Locator;

  // ── Duplicate calendar dialog ────────────────────────────────────
  readonly duplicateCalendarTitle: Locator;

  // ── Aliases / org model page ─────────────────────────────────────
  readonly pageH1Title: Locator;
  readonly aliasListContainer: Locator;
  readonly selectionsContainer: Locator;
  readonly dynamicBranch: Locator;
  readonly toggleBranches: Locator;

  // ── Edit calendar: timezone ──────────────────────────────────────
  readonly timezoneFirstSelect: Locator;
  readonly timezoneSearchInput: Locator;
  readonly timezoneSecondSelect: Locator;

  constructor(page: Page) {
    this.page = page;

    // Navbar
    this.calendarWelcomeTitle = page.locator(".title");

    // Notifications
    this.toastMessage = page.locator('app-toast div div span');

    // Side nav: calendar creation
    this.createNewCalendar = page.locator("button.create-new-calender-btn");
    this.createBaseCalendar = page.locator(".mat-mdc-menu-content button:first-child");
    this.createOverlayCalendar = page.locator(".mat-mdc-menu-content button:nth-child(2)");
    //this.calendarList = page.locator('//mat-expansion-panel-header[@id="mat-expansion-panel-header-0"]');
    this.calendarList = page.getByRole('button', {name: ' Calendar list'})
    this.calendarListContainer = page.locator(".calendar-list");

    // Header: view toggles
    this.openNotAvailable = page.locator('//span[normalize-space()="Not available"]');
    this.openWorkingHours = page.locator('//span[normalize-space()="Working hours"]');

    // Header: navigation
    this.today = page.locator(".today-btn button");
    this.todayCell = page.locator(".cal-today > .cal-cell-top");
    this.calendarOption = page.locator("button.icon-more");
    this.nextMonth = page.locator("[mwlcalendarnextview] button");
    this.previousMonth = page.locator("[mwlcalendarpreviousview] button");

    // Header: date picker (popup)
    this.dateYearDropdown = page.locator('button[aria-label="Open calendar"]');
    this.sideNav = page.locator('div[class="cal-slider"]');
    this.monthAndYear = page.locator('//button[@aria-label= "Choose month and year"]');
    this.next24Years = page.locator('//button[@aria-label = "Next 24 years"]');
    this.previous24Years = page.locator('//button[@aria-label = "Previous 24 years"]');
    this.nextMonthNav = page.locator('//button[@aria-label = "Next month"]');
    this.previousMonthNav = page.locator('//button[@aria-label = "Previous month"]');
    this.startsOn = page.locator('(//input[@placeholder = "Starts on"])[2]');

    // Working hours events
    this.workingHoursEvents = page.locator('//div[@class = "cal-event"]');
    this.firstWorkingHoursEvent = page.locator('(//div[@class = "cal-event"])[1]');
    this.firstWorkingHoursEventText = page.locator('(//div[@class = "cal-event"])[1]//span');
    this.secondWorkingHoursEventText = page.locator('(//div[@class = "cal-event"])[2]//span');

    // Common buttons
    this.saveButton = page.locator(".save-btn-enabled");
    this.recurrenceSaveUpdateBtn = page.locator(".rec-save-update-btn");
    this.cancelButton = page.locator('//button/span[normalize-space() ="Cancel"]');
    this.addButton = page.getByRole('button', {name: `Add`});
    //this.confirmButton = page.locator('//button/span[@class = "mdc-button__label" and contains(text(),"Confirm")]');
    this.confirmButton = page.getByRole('button', {name: `Confirm`})
    this.dismissButton = page.getByRole('button', {name: `Dismiss`});
    this.updateButton = page.getByRole('button', {name: `Update`});
    this.dialogCloseButton = page.locator('//mat-dialog-actions/button');
    this.doneButton = page.getByRole('button', {name: `Done`});
    this.categoryField = page.locator('input[placeholder="Category"]');

    // Exclusion / recurrence dialog
    this.neverEndOption = page.locator("//div[@class = 'end-details-container']/div[normalize-space()='Never']");
    this.reasonInput = page.locator('//mat-form-field/div//input[@placeholder = "Reason"]');
    this.startTimeSelect = page.locator('//mat-select[@placeholder="Start time"]');
    this.endTimeSelect = page.locator('//mat-select[@placeholder="End time"]');
    this.repeatButton = page.getByRole('checkbox', {name: 'Repeat'})

    // Confirm / error dialogs
    this.confirmDialogTitle = page.locator('//div[@class="title"]');
    this.confirmDialogMessage = page.locator('//div[@class="msg-text"]');
    this.errorMessage = page.locator('//div[@class = "message"]');

    // Duplicate calendar dialog
    this.duplicateCalendarTitle = page.locator('//h1[normalize-space() = "Duplicate Calendar"]');

    // Aliases / org model page
    this.pageH1Title = page.locator('//h1');
    this.aliasListContainer = page.locator(".alias-list-container");
    this.selectionsContainer = page.locator(".selections-container");
    this.dynamicBranch = page.locator("//div[@title='London']")
    this.toggleBranches = page.getByLabel('toggle Branches').getByText('chevron_right');

    // Edit calendar: timezone
    this.timezoneFirstSelect = page.locator('//app-calendar-time-zones//mat-select[@role="combobox"]').first();
    this.timezoneSearchInput = page.locator('input[placeholder="Search for timezone"]');
    this.timezoneSecondSelect = page.locator('//app-calendar-time-zones//mat-form-field[2]//mat-select[@role="combobox"]');
  }

  // ── Parameterized: date picker year / month / date ───────────────
  selectYear(year: string): Locator {
    return this.page.locator(`//button[@aria-label = "${year}"]`);
  }

  selectMonth(month: string): Locator {
    return this.page.locator(
      `//span[@class = "mat-calendar-body-cell-content mat-focus-indicator" and contains(text(),"${month}")]`);
  }

  selectDate(date: string): Locator {
    return this.page.locator(
      `//td[@role = "gridcell"]//span[normalize-space() = "${date}"]`);
  }

  // ── Parameterized: working hours day row controls ─────────────────
  addExtraSlotFor(day: string): Locator {
    return this.page.locator(`(//div[@class = "day-name-label" and contains(text(),"${day}")]/following::div[@class="add-remove-icons-container"]/mat-icon)[1]`);
  }

  extraSlotStartSelect(day: string): Locator {
    return this.page.locator(
      `(//div[@class = "day-name-label" and contains(text(),"${day}")]/following::div[@class = "working-hours-div"][2]/div/mat-select)[1]`
    );
  }

  extraSlotEndSelect(day: string): Locator {
    return this.page.locator(
      `(//div[@class = "day-name-label" and contains(text(),"${day}")]/following::div[@class = "working-hours-div"][2]/div/mat-select)[2]`
    );
  }

  // ── Parameterized: weekday dot toggles ───────────────────────────
  weekdayDot(letter: string): Locator {
    return this.page.locator(
      `//div[@class = "weekday-dot weekday-dot-selected"]/div[contains(text(),"${letter}")]`
    );
  }

  firstWeekdayDot(letter: string): Locator {
    return this.page.locator(
      `(//div[@class = "weekday-dot weekday-dot-selected"]/div[contains(text(),"${letter}")])[1]`
    );
  }

  // ── Generic: last span matching text ─────────────────────────────
  // Used for time dropdowns, day-number options, and timezone name options.
  lastOption(text: string): Locator {
    return this.page.locator(`(//span[normalize-space()="${text}"])[last()]`);
  }

  // ── Edit calendar: week start day selector ───────────────────────
  weekStartDaySelector(num: string): Locator {
    return this.page.locator(
      `//span[contains(text(),"${num}")]/parent::span/parent::div`
    ).first();
  }

  monthTitle(name: string): Locator {
    return this.page.locator(`//span[@class = "month-event-title" and contains(text(),"${name}")]`);
    //return this.page.locator('span.month-event-title').getByText(`${name}`, { exact: true })
  }
}
