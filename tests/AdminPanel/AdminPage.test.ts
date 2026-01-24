import { test, expect } from '@playwright/test';

test.setTimeout(60000);

test('Pełny test: Admin Panel i Kafelki', async ({ page }) => {
    await page.goto('https://tired-mignonne-collegiumwitelona-89561698.koyeb.app/');

    if (await page.getByRole('button', { name: /Login|Zaloguj/i }).isVisible()) {
        await page.getByRole('button', { name: /Login|Zaloguj/i }).click();
    }

    await page.getByRole('textbox', { name: 'Username' }).fill('rybkitest2');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Enter your password' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Password' }).fill('Start123!');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('navigation', { name: 'Główna nawigacja' })).toBeVisible({ timeout: 20000 });

    await page.getByText(/⚙️.*Settings/i).click();
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();

    await page.getByRole('link', { name: /Panel Admina/i }).click();
    await expect(page.getByRole('navigation', { name: 'pagination navigation' }).or(page.getByRole('heading'))).toBeVisible();

    await page.getByRole('tab', { name: 'Użytkownicy' }).click();
    await expect(page.getByRole('row', { name: /Email|Nazwa użytkownika/i })).toBeVisible();

    await page.getByRole('tab', { name: 'Dane Systemowe' }).click();
    await expect(page.getByRole('heading', { name: /Dane systemowe/i })).toBeVisible();

    const zamknijOkno = async () => {
        const guzikX = page.locator('button.MuiIconButton-sizeMedium').filter({ hasText: /^$/ }).last();
        await expect(guzikX).toBeVisible();
        await guzikX.click();
    };

    // --- KAFELEK 1: AKWARIA ---
    await page.getByText(/🐠.*Akwaria/i).click();
    // Dodano .first(), żeby sprawdzić tylko nagłówek tabeli
    const akwariaRow = page.getByRole('row', { name: /Nazwa|Właściciel/i }).first();
    await expect(akwariaRow).toBeVisible();
    await zamknijOkno();
    await expect(akwariaRow).not.toBeVisible();

    // --- KAFELEK 2: RYBY ---
    await page.getByText(/🐟.*Ryby/i).click();
    // Dodano .first() - to naprawia błąd "strict mode violation"
    const rybyRow = page.getByRole('row', { name: /Gatunek|Akwarium/i }).first();
    await expect(rybyRow).toBeVisible();
    await zamknijOkno();
    await expect(rybyRow).not.toBeVisible();

    // --- KAFELEK 3: ROŚLINY ---
    await page.getByText(/🌿.*Rośliny/i).click();
    // Dodano .first() profilaktycznie
    const roslinyRow = page.getByRole('row', { name: /Nazwa rośliny|Akwarium/i }).first();
    await expect(roslinyRow).toBeVisible();
    await zamknijOkno();
    await expect(roslinyRow).not.toBeVisible();

});