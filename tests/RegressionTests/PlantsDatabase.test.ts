import { test, expect } from '@playwright/test';

test('Przeglądanie bazy roślin i interakcje', async ({ page }) => {
    await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=9eHCOOc9YwpOKOzlJmUceltROJUiTKJg1BsdDieyjKE');
    await expect(page.getByRole('form', { name: 'primary-form' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Username' }).fill('rybkitest2');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Enter your password' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Password' }).fill('Start123!');
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page).toHaveURL(/localhost:3000/, { timeout: 20000 });

    await expect(page.getByRole('navigation', { name: 'Główna nawigacja' })).toBeVisible();
    const plantsDbLink = page.getByRole('link', { name: /Plants Database/i });
    await expect(plantsDbLink).toBeVisible();
    await plantsDbLink.click();
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