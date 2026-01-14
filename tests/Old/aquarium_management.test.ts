import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Email Address' }).click();
  await page.getByRole('textbox', { name: 'Email Address' }).fill('Test@123.pl');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1234567');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.getByRole('link', { name: '🏠 Aquariums View and manage' }).click();
  await page.getByRole('button', { name: 'Create Aquarium' }).click();
  await page.getByRole('textbox', { name: 'Aquarium Name' }).click();
  await page.getByRole('textbox', { name: 'Aquarium Name' }).fill('Test');
  await page.getByRole('spinbutton', { name: 'Volume (liters)' }).click();
  await page.getByRole('spinbutton', { name: 'Volume (liters)' }).fill('10');
  await page.getByRole('button', { name: 'Create' }).click();
  await page.getByRole('button', { name: '🐠 Test No description 🐟 0 🌿' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add Fish' }).click();
  page.once('dialog', dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    dialog.dismiss().catch(() => {});
  });
  await page.getByRole('button', { name: 'Add Plant' }).click();
});