import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
    // Logowanie
    await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=Bze7eZy2q4TM5BdR0LWzNjWmDK5NDwpgrn3IqjNVE2o');
    await page.getByRole('textbox', { name: 'Username' }).click();
    await page.getByRole('textbox', { name: 'Username' }).fill('doteleh994@cameltok.com');
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByRole('textbox', { name: 'Password' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill('ASFDQA12414512df#');
    await page.getByRole('checkbox', { name: 'Show password' }).check();
    await page.getByRole('checkbox', { name: 'Show password' }).uncheck();
    await page.getByRole('button', { name: 'Continue' }).click();

    await expect(page.getByRole('link', { name: '🛡️ ADMIN' })).toBeVisible();

    await page.getByRole('link', { name: '🏠 Moje Akwaria Przeglądaj i' }).click();
    await expect(page.getByRole('link', { name: 'Powrót' })).toBeVisible();

    await page.getByText('Statystyki').click();
    await expect(page.getByRole('heading', { name: 'Statystyki - Wszystkie akwaria' })).toBeVisible();

    await page.getByRole('button', { name: 'Zamknij' }).click();
    await expect(page.getByRole('navigation', { name: 'Główna nawigacja' })).toBeVisible();

    await page.getByText('📋').click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Wszystkie akcje').click();
    await expect(page.getByRole('option', { name: 'Wszystkie akcje' })).toBeVisible();

    await page.getByRole('option', { name: 'Utworzono' }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Utworzono').click();
    await expect(page.getByRole('option', { name: 'Wszystkie akcje' })).toBeVisible();

    await page.getByRole('option', { name: 'Edytowano' }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Edytowano').click();
    await expect(page.getByRole('option', { name: 'Wszystkie akcje' })).toBeVisible();

    await page.getByRole('option', { name: 'Usunięto', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Usunięto').click();
    await expect(page.getByRole('option', { name: 'Wszystkie akcje' })).toBeVisible();

    await page.getByRole('option', { name: 'Usunięto', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Usunięto').click();
    await expect(page.getByRole('option', { name: 'Wszystkie akcje' })).toBeVisible();

    await page.getByRole('option', { name: 'Usunięto rybę' }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Usunięto rybę').click();
    await expect(page.getByRole('option', { name: 'Wszystkie akcje' })).toBeVisible();

    await page.getByRole('option', { name: 'Dodano roślinę' }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Dodano roślinę').click();
    await expect(page.getByRole('option', { name: 'Wszystkie akcje' })).toBeVisible();

    await page.getByRole('option', { name: 'Usunięto roślinę' }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Usunięto roślinę').click();
    await expect(page.getByRole('option', { name: 'Wszystkie akcje' })).toBeVisible();

    await page.getByRole('option', { name: 'Zmieniono parametr' }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Wszystkie akwaria').click();
    await page.getByRole('option', { name: 'Wszystkie akwaria' }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByText('Najnowsze najpierw').click();
    await expect(page.getByRole('option', { name: 'Najnowsze najpierw' })).toBeVisible();

    await page.getByRole('option', { name: 'Najstarsze najpierw' }).click();
    await expect(page.getByRole('heading', { name: 'Historia aktywności' })).toBeVisible();

    await page.getByRole('button', { name: 'Zamknij' }).click();
    await expect(page.getByRole('navigation', { name: 'Główna nawigacja' })).toBeVisible();

    await page.getByRole('button', { name: 'Switch to English' }).click();
    await expect(page.getByRole('link', { name: 'Return' })).toBeVisible();

    await page.getByRole('button', { name: 'Przełącz na polski' }).click();
    await expect(page.getByRole('link', { name: 'Powrót' })).toBeVisible();

    await page.getByRole('button', { name: 'Zaproś przyjaciela' }).click();
    await expect(page.getByRole('heading', { name: 'Zaproś do współpracy' })).toBeVisible();

    await page.getByRole('link', { name: 'Powrót' }).click();
    await expect(page.getByRole('navigation', { name: 'Główna nawigacja' })).toBeVisible();

    await page.getByRole('link', { name: '🏠 Moje Akwaria Przeglądaj i' }).click();
    await expect(page.getByRole('link', { name: 'Powrót' })).toBeVisible();

    await page.getByRole('button', { name: 'Utwórz akwarium' }).click();
    await expect(page.getByRole('spinbutton', { name: 'Temperatura wody (°C)' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Nazwa akwarium' }).click();
    await page.getByRole('textbox', { name: 'Nazwa akwarium' }).fill('testowe');
    await page.getByText('Słodkowodne').click();
    await expect(page.getByRole('option', { name: 'Słodkowodne' })).toBeVisible();

    await page.getByRole('option', { name: 'Słonowodne' }).click();
    await expect(page.getByRole('textbox', { name: 'Nazwa akwarium' })).toBeVisible();

    await page.getByRole('spinbutton', { name: 'Temperatura wody (°C)' }).click();
    await page.getByRole('spinbutton', { name: 'Temperatura wody (°C)' }).fill('28');
    await page.getByText('Ameryka Południowa').click();
    await expect(page.getByRole('option', { name: 'Ameryka Południowa' })).toBeVisible();

    await page.getByRole('option', { name: 'Afryka' }).click();
    await expect(page.getByRole('textbox', { name: 'Nazwa akwarium' })).toBeVisible();

    await page.getByText('Afryka').click();
    await expect(page.getByRole('option', { name: 'Ameryka Południowa' })).toBeVisible();

    await page.getByRole('option', { name: 'Ameryka Północna' }).click();
    await expect(page.getByRole('textbox', { name: 'Nazwa akwarium' })).toBeVisible();

    await page.getByRole('spinbutton', { name: 'pH' }).click();
    await page.getByRole('spinbutton', { name: 'pH' }).fill('7.8');
    await page.getByRole('spinbutton', { name: 'Twardość wody (dGH)' }).click();
    await page.getByRole('spinbutton', { name: 'Twardość wody (dGH)' }).fill('7');
    await page.getByRole('textbox', { name: 'Opis akwarium' }).click();
    await page.getByRole('textbox', { name: 'Opis akwarium' }).fill('test');
    await page.getByRole('button', { name: 'Utwórz' }).click();
    await page.getByRole('button', { name: 'Close' }).click();
    await page.getByRole('button', { name: 'Anuluj' }).click();
    await expect(page.getByRole('navigation', { name: 'Główna nawigacja' })).toBeVisible();

    await page.getByRole('link', { name: 'Powrót' }).click();

}); // <-- To jest JEDYNE poprawne zamknięcie testu (na samym końcu pliku)