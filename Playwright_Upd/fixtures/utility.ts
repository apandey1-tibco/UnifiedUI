import { Page, Locator } from "@playwright/test";
export function convertStringToArray(text: string) {
  const arrayTxt = text.toString().replace(/\t|\n/g, " ").split(" ");
  return arrayTxt;
}

export function formatDate() {
  const date = new Date();
  const day = date.getDate(); // Get day
  const month = date.toLocaleString("en-GB", { month: "short" }); // Get short month name
  const year = date.getFullYear(); // Get year
  const formattedDate = `${day} ${month} ${year}`;
  return formattedDate;
}

// Returns current date as "Apr 08, 2026"
export function getCurrentDate(): string {
  const date = new Date();
  const month = date.toLocaleString("en-US", { month: "short" });
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

// Returns current time as "04:44:51 AM"
export function getCurrentTime(): string {
  const date = new Date();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`;
}

// Returns current date-time as "Apr 08, 2026 04:44:51 AM"
export function getCurrentDateTime(): string {
  return `${getCurrentDate()} ${getCurrentTime()}`;
}

// Returns current date-time as "2026-04-08T04:44" (YYYY-MM-DDTHH:MM 24h) — required by datetime-local input type
export function getCurrentDateTimeLocal(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Returns today's date at midnight as "2026-04-08T00:00" — used for Instance Started filter to capture all instances from today
export function getTodayDateTimeLocal(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T00:00`;
}

// Returns current date and time as "04/08/2026 04:44 PM" (MM/DD/YYYY HH:MM AM/PM) — used for Instance Started filter field
export function getCurrentDateTimeForFilter(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${month}/${day}/${year} ${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
}

// Returns current date as "04/08/2026" (MM/DD/YYYY) — used for myDateTime field format
export function getCurrentDateNumeric(): string {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

export function getRandomSixDigitNumber(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function tableHeader(page: Page) {
  const col = page.locator("twc-table-head-cell");
  let headerArray: string[] = [];
  for (let i = 0; i < (await col.count()); i++) {
    const a = await col.nth(i).innerText();
    headerArray.push(a);
  }
  return headerArray;
}
export async function getTableRowContents(page: Page, name: string) {
  const row = page.locator("twc-table-row");
  let rowArray: string[] = [];

  const rowText = row.filter({
    has: page.locator("twc-table-cell"),
    hasText: `${name}`,
  });
  const txt = await rowText.innerText();
  return txt.toString().split(/[\t\n]/g);
}
export async function getFirstRowContents(page: Page) {
  const txt = await page.locator("twc-table-row").first().innerText();
  return txt.toString().split(/[\t\n]/g);
}
