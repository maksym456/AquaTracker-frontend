import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=https://tired-mignonne-collegiumwitelona-89561698.koyeb.app/api/auth/callback/cognito&response_type=code&scope=openid&state=COseZnM00hxbUuyzvRwY4VuYye-F4hx_J8PNB1AvJ0U');
    await page.getByRole('textbox', { name: 'Username' }).fill('rybkitest2');
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('heading', { name: 'Enter your password' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Password' }).fill('S');
    await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
    await page.getByRole('textbox', { name: 'Password' }).fill('Start123!');
    await page.getByRole('button', { name: 'Continue' }).click();
    await expect(page.getByRole('navigation', { name: 'Główna nawigacja' })).toBeVisible();

    await page.getByRole('link', { name: '🌿 Plants Database Discover' }).click();
    await expect(page.getByRole('button', { name: 'Moczarka Szybko rosnąca roś' })).toBeVisible();

    await page.getByRole('button', { name: 'Następna roślina' }).click();
    await page.getByRole('button', { name: 'Poprzednia roślina' }).click();
    await page.getByRole('button', { name: 'Add to Aquarium' }).click();
    await page.getByRole('button', { name: 'Open' }).click();
    await expect(page.getByRole('button', { name: 'Close' })).toBeVisible();

    await page.getByRole('button', { name: 'Anubias Wolno rosnąca roślina' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await expect(page.getByRole('button', { name: 'Open' })).toBeVisible();

    await page.getByRole('button', { name: 'Przełącz na polski' }).click();
    await page.getByRole('link', { name: 'Powrót' }).click();
});