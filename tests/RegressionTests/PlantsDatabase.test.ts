import { test, expect } from '@playwright/test';

test('Przeglądanie bazy roślin i interakcje', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('link', { name: '🌿 Plants Database Discover' }).click();
    await expect(page.getByRole('button', { name: 'Następna roślina' })).toBeVisible();
    await page.getByRole('button', { name: 'Następna roślina' }).click();
    await expect(page.getByRole('button', { name: 'Poprzednia roślina' })).toBeVisible();
    await page.getByRole('button', { name: 'Poprzednia roślina' }).click();
    await expect(page.getByRole('button', { name: 'Add to Aquarium' })).toBeVisible();
    await page.getByRole('button', { name: 'Add to Aquarium' }).click();
    await expect(page.getByRole('button', { name: 'Switch to English' })).toBeVisible();
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await expect(page.getByRole('button', { name: 'Przełącz na polski' })).toBeVisible();
    await page.getByRole('button', { name: 'Przełącz na polski' }).click();
    await expect(page.getByRole('link', { name: 'Powrót' })).toBeVisible();
    await page.getByRole('link', { name: 'Powrót' }).click();
});