import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=Bze7eZy2q4TM5BdR0LWzNjWmDK5NDwpgrn3IqjNVE2o');
    await page.getByRole('textbox', { name: 'Username' }).click();
    await expect(page.getByRole('textbox', { name: 'Username' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('doteleh994@cameltok.com');
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
    await page.getByRole('button', { name: 'Next' }).click();
    await expect(page.getByRole('textbox', { name: 'Password' })).toBeVisible();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('ASFDQA12414512df#');
    await expect(page.getByRole('checkbox', { name: 'Show password' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Forgot your password?' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue' })).toBeVisible();
    await page.getByRole('button', { name: 'Continue' }).click();
    //await page.goto('http://localhost:3000/?callbackUrl=http%3A%2F%2Flocalhost%3A3000%2F&error=OAuthCallback');
});