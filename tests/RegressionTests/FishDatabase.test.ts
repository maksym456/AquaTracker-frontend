import { test, expect } from '@playwright/test';

test('Test: Przeglądanie bazy ryb (Fish Database)', async ({ page }) => {

    // 1. LOGOWANIE
    await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=Bze7eZy2q4TM5BdR0LWzNjWmDK5NDwpgrn3IqjNVE2o');

    await page.getByRole('textbox', { name: 'Username' }).fill('rybkitest2');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('Start123!');
    await page.getByRole('button', { name: 'Continue' }).click();

    // Czekamy na powrót do aplikacji (zamiast szukać nawigacji)
    await expect(page).toHaveURL(/localhost:3000/, { timeout: 30000 });

    // 2. PRZEJŚCIE DO BAZY RYB
    // Szukamy linku "Fish Database" (ignorujemy wielkość liter)
    const fishDbLink = page.getByRole('link', { name: /Fish Database/i });
    await expect(fishDbLink).toBeVisible();
    await fishDbLink.click();

    // 3. WERYFIKACJA ZAWARTOŚCI
    // Sprawdzamy czy załadowała się lista ryb (np. Welonka)
    await expect(page.getByRole('button', { name: /Welonka/i }).first()).toBeVisible({ timeout: 15000 });
});