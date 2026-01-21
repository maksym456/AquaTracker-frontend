import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=UDxeOLULN7rpFEwl1PP38c9YS6E9AQeJRLKx_wEqJvU');
  await page.getByRole('link', { name: 'Continue with Facebook' }).click();
  await page.getByText('Zezwól na wszystkie pliki cookieOdrzuć opcjonalne pliki cookie').nth(1).click();
  await page.getByRole('textbox', { name: 'Adres e-mail lub numer' }).click();
  await page.getByRole('textbox', { name: 'Adres e-mail lub numer' }).fill('doteleh994@cameltok.com');
  await page.getByRole('textbox', { name: 'Hasło' }).click();
  await page.getByRole('textbox', { name: 'Hasło' }).press('ControlOrMeta+z');
  await page.locator('div').filter({ hasText: /^Zaloguj się$/ }).click();
  await page.getByRole('link', { name: 'Nie teraz' }).click();
  await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=3Ujra-SZyvP_CHgIQaN6hksxjd4V-_N5dwLmSgMLE_c');
});