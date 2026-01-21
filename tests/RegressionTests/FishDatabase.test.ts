import { test, expect } from '@playwright/test';

test('Przeglądanie bazy ryb i interakcje', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: '🐠 Baza Ryb Przeglądaj' }).click();
    await expect(page.getByRole('button', { name: 'Następna ryba' })).toBeVisible();
    await page.getByRole('button', { name: 'Następna ryba' }).click();
    await expect(page.getByRole('button', { name: 'Poprzednia ryba' })).toBeVisible();
    await page.getByRole('button', { name: 'Poprzednia ryba' }).click();
    await expect(page.getByRole('button', { name: 'Switch to English' })).toBeVisible();
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await expect(page.getByRole('button', { name: 'Przełącz na polski' })).toBeVisible();
    await page.getByRole('button', { name: 'Przełącz na polski' }).click();
    await page.getByRole('button', { name: 'Dodaj do akwarium' }).click();
    await expect(page.getByRole('main')).toContainText('Welonka');
    await expect(page.getByRole('link', { name: 'Powrót' })).toBeVisible();
    await page.getByRole('link', { name: 'Powrót' }).click();
});