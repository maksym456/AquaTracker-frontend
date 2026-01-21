import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=Bze7eZy2q4TM5BdR0LWzNjWmDK5NDwpgrn3IqjNVE2o');
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('doteleh994@cameltok.com');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('ASFDQA12414512df#');
    await page.getByRole('checkbox', { name: 'Show password' }).check();
    await page.getByRole('checkbox', { name: 'Show password' }).uncheck();
    await page.getByRole('button', { name: 'Continue' }).click();
});