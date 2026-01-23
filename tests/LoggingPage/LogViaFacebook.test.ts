import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=UDxeOLULN7rpFEwl1PP38c9YS6E9AQeJRLKx_wEqJvU');
  await page.getByRole('link', { name: 'Continue with Facebook' }).click();
  await page.getByRole('button', { name: /(Allow|Zezwól|Akceptuj)/i }).first().click();
  await page.locator('input[name="email"]').click({ force: true });
  await page.locator('input[name="email"]').fill('doteleh994@cameltok.com');
  await page.locator('input[name="pass"]').fill('2k81w1zYWkMKxdw6');
  await page.locator('input[name="pass"]').press('Enter');
  await page.locator('button[name="login"]').click();
});