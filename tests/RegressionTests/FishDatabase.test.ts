import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=https://tired-mignonne-collegiumwitelona-89561698.koyeb.app/api/auth/callback/cognito&response_type=code&scope=openid&state=i6Sxbh3QbCW2ERl5YCJjTWRcpaSTpKNx9D5g7SR5qlg');
    await page.getByRole('textbox', { name: 'Username' }).fill('rybkitest2');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Enter your password' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Password' }).fill('S');
    await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Password' }).fill('Start123!');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('navigation', { name: 'Główna nawigacja' })).toBeVisible();

    await page.getByRole('link', { name: '🐠 Fish Database Browse fish' }).click();
    await expect(page.getByRole('button', { name: 'Goldfish Freshwater • Calm' })).toBeVisible();

    await page.getByRole('button', { name: 'Następna ryba' }).click();
    await page.getByRole('button', { name: 'Poprzednia ryba' }).click();
    await page.getByRole('button', { name: 'Add to Aquarium' }).click();
    await page.getByRole('button', { name: 'Open' }).click();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

    await page.getByRole('button', { name: 'Guppy Freshwater • Calm' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('button', { name: 'Open' })).toBeVisible();

    await page.getByRole('button', { name: 'Przełącz na polski' }).click();
    await expect(page.getByRole('button', { name: 'Welonka Słodkowodna • Spokojne' })).toBeVisible();

    await page.getByRole('link', { name: 'Powrót' }).click();
});