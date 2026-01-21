import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.getByRole('link', { name: 'Create an account' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('Test');
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill('rybkitest@onet.pl');
    await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('3t27Mg4sXk[8ygN}');
    await page.getByRole('textbox', { name: 'Confirm password' }).click();
    await page.getByRole('textbox', { name: 'Confirm password' }).fill('3t27Mg4sXk[8ygN}');
    await page.getByRole('checkbox', { name: 'Show password' }).check();
    await page.getByRole('checkbox', { name: 'Show password' }).dblclick();
    await page.getByRole('checkbox', { name: 'Show password' }).uncheck();
    await page.getByRole('button', { name: 'Sign up' }).click();
    await page.getByRole('textbox', { name: 'Code' }).click();
    await page.getByRole('textbox', { name: 'Code' }).fill('080159');
    await page.getByRole('button', { name: 'Confirm account' }).click();
});