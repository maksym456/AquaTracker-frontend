import { test, expect } from '@playwright/test';

test.describe('SuperAdminPanel UI Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/');
    });

    test('should render dashboard with default users tab', async ({ page }) => {
        await expect(page.getByText('AquaManager System')).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Użytkownicy' })).toBeVisible();
        await expect(page.getByText('Jan Kowalski')).toBeVisible();
    });

    test('should navigate between tabs correctly', async ({ page }) => {
        await page.getByRole('button', { name: 'Monitoring Akwariów' }).click();
        await expect(page.getByRole('heading', { name: 'Monitoring Parametrów Wody' })).toBeVisible();

        await page.getByRole('button', { name: 'Baza Gatunków' }).click();
        await expect(page.getByRole('heading', { name: 'Katalog' })).toBeVisible();

        await page.getByRole('button', { name: 'Logi Systemowe' }).click();
        await expect(page.locator('.text-purple-400').first()).toBeVisible();
    });

    test('should filter users list based on search input', async ({ page }) => {
        const searchInput = page.getByPlaceholder('Szukaj...');
        await searchInput.fill('Anna');

        await expect(page.getByText('Anna Nowak')).toBeVisible();
        await expect(page.getByText('Jan Kowalski')).not.toBeVisible();
    });

    test('should update user status UI upon blocking', async ({ page }) => {
        const userRow = page.getByRole('row').filter({ hasText: 'Jan Kowalski' });
        await expect(userRow.getByText('Aktywny')).toBeVisible();

        await userRow.getByRole('button').click();

        await expect(userRow.getByText('Zablokowany')).toBeVisible();
        await expect(userRow).toHaveClass(/bg-gray-100/);
    });

    test('should handle asynchronous aquarium restart with feedback', async ({ page }) => {
        await page.getByRole('button', { name: 'Monitoring Akwariów' }).click();
        const aquariumRow = page.getByRole('row').filter({ hasText: 'Morska Rafa' });

        await aquariumRow.getByTitle('Restart').click();

        await expect(aquariumRow.getByText('Restartowanie...')).toBeVisible();
        await expect(aquariumRow.getByText('Aktywne')).toBeVisible({ timeout: 5000 });
    });

    test('should open and close details modal', async ({ page }) => {
        await page.getByRole('button', { name: 'Monitoring Akwariów' }).click();
        await page.getByRole('button', { name: 'Szczegóły' }).first().click();

        const modal = page.locator('.fixed.inset-0');
        await expect(modal).toBeVisible();
        await expect(modal.getByText('Historia Zmian')).toBeVisible();

        await modal.getByRole('button', { name: 'Zamknij' }).click();
        await expect(modal).not.toBeVisible();
    });

    test('should add new item to catalog and clear form', async ({ page }) => {
        await page.getByRole('button', { name: 'Baza Gatunków' }).click();

        await page.getByPlaceholder('Nazwa').fill('Testowy Skalar');
        await page.locator('select').selectOption('Ryba');
        await page.getByPlaceholder('Śr. życie').fill('8');
        await page.getByRole('button', { name: 'Dodaj' }).click();

        await expect(page.getByRole('cell', { name: 'Testowy Skalar' })).toBeVisible();
        await expect(page.getByPlaceholder('Nazwa')).toBeEmpty();
    });

    test('should generate logs after user actions', async ({ page }) => {
        await page.getByRole('button', { name: 'Baza Gatunków' }).click();
        await page.getByPlaceholder('Nazwa').fill('LogMaker Fish');
        await page.getByRole('button', { name: 'Dodaj' }).click();

        await page.getByRole('button', { name: 'Logi Systemowe' }).click();
        await expect(page.getByText('CATALOG_ADD')).toBeVisible();
        await expect(page.getByText('Dodano: LogMaker Fish')).toBeVisible();
    });
});
