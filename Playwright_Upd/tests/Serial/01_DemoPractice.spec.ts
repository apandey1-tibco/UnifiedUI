import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://gasdbpmc2ebld01.dev.tibco.com/apps/bpmeapp/#/login');
  await page.locator('input[type="text"]').click();
  await page.locator('input[type="text"]').fill('tibco-admin');
  await page.locator('input[type="password"]').click();
  await page.locator('input[type="password"]').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.locator('#bpmMyWork svg').click();
  await page.getByRole('img', { name: 'Sort' }).locator('#Vector').click();
  await page.getByRole('img', { name: 'Sort' }).getByRole('img').click();
  await page.getByRole('menuitem', { name: 'Start date', exact: true }).getByRole('img').click();
  await page.getByRole('menuitem', { name: 'Start date' }).locator('label span').first().click();
  await page.getByRole('menuitem', { name: 'Start date ( Ascending )' }).locator('path').first().click();
  await page.getByRole('button', { name: 'Save' }).click();
});