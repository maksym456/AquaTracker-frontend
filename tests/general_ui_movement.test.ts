import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('test@12.plk');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('123455667789');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: '🏠 Aquariums View and manage' }).click();
  await page.getByText('📋History').click();
  await page.getByRole('link', { name: 'Return' }).click();
  await page.getByRole('link', { name: '🐠 Fish Database Browse fish' }).click();
  await page.getByRole('link', { name: 'Return' }).click();
  await page.getByRole('link', { name: '👥 Contacts Manage your' }).click();
  await page.getByRole('link', { name: 'Return' }).click();
  await page.getByRole('link', { name: '🌿 Plants Database Discover' }).click();
  await page.getByRole('link', { name: 'Return' }).click();
});