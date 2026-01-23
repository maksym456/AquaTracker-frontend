import { test, expect } from '@playwright/test';

test('Przeglądanie bazy roślin i interakcje', async ({ page }) => {
        await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=Bze7eZy2q4TM5BdR0LWzNjWmDK5NDwpgrn3IqjNVE2o');
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('doteleh994@cameltok.com');
        await page.getByRole('button', { name: 'Next' }).click();
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('ASFDQA12414512df#');
        await page.getByRole('checkbox', { name: 'Show password' }).check();
        await page.getByRole('checkbox', { name: 'Show password' }).uncheck();
        await page.getByRole('button', { name: 'Continue' }).click();

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