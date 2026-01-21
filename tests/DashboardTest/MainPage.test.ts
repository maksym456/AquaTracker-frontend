import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await page.getByRole('button', { name: 'Przełącz na polski' }).click();
    await page.getByText('⚙️Ustawienia').click();
    await page.getByRole('switch').check();
    await page.getByRole('switch').uncheck();
    await page.getByText('⏱️Długość sesji→').click();
    await page.getByRole('button', { name: 'Zamknij' }).click();
    await page.getByText('💾Źródło danych→').click();
    await page.getByRole('button', { name: '✕' }).click();
    await page.getByRole('link', { name: '🛡️ ADMIN' }).click();
});