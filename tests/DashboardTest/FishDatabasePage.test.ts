import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: '🐠 Fish Database Browse fish' }).click();
    await page.getByRole('button', { name: 'Następna ryba' }).click();
    await page.getByRole('button', { name: 'Następna ryba' }).click();
    await page.getByRole('button', { name: 'Przełącz na polski' }).click();
    await page.getByRole('button', { name: 'Dodaj do akwarium' }).click();
    await page.getByRole('link', { name: 'Powrót' }).click();
});