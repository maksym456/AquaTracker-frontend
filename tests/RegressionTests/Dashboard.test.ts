import { test, expect } from '@playwright/test';

test('Regresja: Nawigacja i Ustawienia', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    await expect(page.getByRole('button', { name: 'Przełącz na polski' })).toBeVisible();
    await page.getByRole('button', { name: 'Przełącz na polski' }).click();

    await page.getByText('⚙️').click();

    await page.getByRole('menuitem', { name: 'Ustawienia' }).click().catch(async () => {
        await page.getByText('Ustawienia').last().click();
    });

    const switchToggle = page.getByRole('switch').first();
    await expect(switchToggle).toBeVisible();
    await switchToggle.check();
    await expect(switchToggle).toBeChecked();
    await switchToggle.uncheck();

    await page.getByText('Długość sesji').click();
    await expect(page.getByRole('button', { name: 'Zamknij' })).toBeVisible();
    await page.getByRole('button', { name: 'Zamknij' }).click();

    await page.getByText('Źródło danych').click();
    await page.getByRole('combobox').click().catch(() => page.getByText('▼').click());

    await page.getByRole('button', { name: '✕' }).or(page.getByLabel('close')).click();

    const sections = [
        { linkRole: '🏠 Moje Akwaria Przeglądaj i' },
        { linkRole: '🐠 Baza Ryb Przeglądaj' },
        { linkRole: '👥 Kontakty Zarządzaj' },
        { linkRole: '🌿 Baza Roślin Odkryj rośliny' }
    ];

    for (const section of sections) {
        await page.getByRole('link', { name: section.linkRole }).click();
        await expect(page.getByRole('link', { name: 'Powrót' })).toBeVisible();
        await page.getByRole('link', { name: 'Powrót' }).click();
        await expect(page.getByRole('link', { name: section.linkRole })).toBeVisible();
    }
});