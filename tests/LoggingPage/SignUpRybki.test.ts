import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    const timestamp = Date.now();
    const uniqueEmail = `rybkitest${timestamp}@wp.pl`;
    const uniqueUsername = `TestUser${timestamp}`;

    await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=Bze7eZy2q4TM5BdR0LWzNjWmDK5NDwpgrn3IqjNVE2o');
    await page.getByRole('link', { name: 'Create an account' }).click();
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill(uniqueUsername);
    await page.getByRole('textbox', { name: 'Email address' }).click();
    await page.getByRole('textbox', { name: 'Email address' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: 'Password', exact: true }).click();
    await page.getByRole('textbox', { name: 'Password', exact: true }).fill('3t27Mg4sXk[8ygN}');
    await page.getByRole('textbox', { name: 'Confirm password' }).click();
    await page.getByRole('textbox', { name: 'Confirm password' }).fill('3t27Mg4sXk[8ygN}');
    await page.getByRole('checkbox', { name: 'Show password' }).check();
    await page.getByRole('checkbox', { name: 'Show password' }).dblclick();
    await page.getByRole('checkbox', { name: 'Show password' }).uncheck();
    await page.getByRole('button', { name: 'Sign up' }).click();
    const codeInput = page.getByRole('textbox', { name: 'Code' });
    await expect(codeInput).toBeVisible({ timeout: 90000 });
    await page.getByRole('button', { name: 'Confirm account' }).click();
});