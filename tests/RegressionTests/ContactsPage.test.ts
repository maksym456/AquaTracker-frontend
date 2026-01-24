import { test, expect } from '@playwright/test';

test('REGRESJA – Invite Friend flow', async ({ page }) => {

    await page.goto(
        'https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login' +
        '?client_id=7cvtmkucocn97om3mdrr876igm' +
        '&redirect_uri=http://localhost:3000/api/auth/callback/cognito' +
        '&response_type=code&scope=openid'
    );

    // LOGIN – USERNAME
    await page.getByRole('textbox', { name: 'Username' }).fill('rybkitest2');
    await page.getByRole('button', { name: 'Next' }).click();

    await expect(
        page.getByRole('heading', { name: 'Enter your password' })
    ).toBeVisible({ timeout: 20000 });

    // LOGIN – PASSWORD
    await page.getByRole('textbox', { name: 'Password' }).fill('Start123!');
    await page.getByRole('button', { name: 'Continue' }).click();

    // CZEKAJ NA GOTOWĄ APLIKACJĘ
    await expect(
        page.getByRole('navigation', { name: 'Główna nawigacja' })
    ).toBeVisible({ timeout: 30000 });

    // CONTACTS – CZEKAMY NA WIDOK
    await Promise.all([
        page.waitForURL(/contacts/i),
        page.getByRole('link', { name: /Contacts/i }).click()
    ]);

    // EMAIL – losowy
    const randomID = Math.floor(Math.random() * 100000);
    const randomEmail = `testuser${randomID}@example.com`;
    await page.getByRole('textbox', { name: 'Email Address' }).fill(randomEmail);

    // DIALOG
    page.once('dialog', dialog => {
        console.log(`Dialog message: ${dialog.message()}`);
        dialog.dismiss().catch(() => {});
    });
    await page.getByRole('button', { name: /Send Invite/i }).click();

});