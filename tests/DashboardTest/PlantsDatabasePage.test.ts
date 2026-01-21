import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: '🌿 Baza Roślin Odkryj rośliny' }).click();
    await page.getByRole('button', { name: 'Następna roślina' }).click();
    await page.getByRole('button', { name: 'Następna roślina' }).click();
    await page.getByRole('button', { name: 'Poprzednia roślina' }).click();
    await page.getByRole('button', { name: 'Dodaj do akwarium' }).click();
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await page.getByRole('button', { name: 'Następna roślina' }).click();
    await page.getByRole('link', { name: 'Return' }).click();
});