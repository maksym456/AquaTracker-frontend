import { test, expect } from '@playwright/test';

test('E2E: Nawigacja, Zmiana Języka, Ustawienia i Admin', async ({ page }) => {

    // ZWIĘKSZONY CZAS NA TEST
    test.setTimeout(120000);

    await test.step('1. Logowanie', async () => {
        await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=Bze7eZy2q4TM5BdR0LWzNjWmDK5NDwpgrn3IqjNVE2o');

        await page.getByRole('textbox', { name: 'Username' }).fill('rybkitest2');
        await page.getByRole('button', { name: 'Next' }).click();

        await expect(page.getByRole('heading', { name: 'Enter your password' })).toBeVisible();
        await page.getByRole('textbox', { name: 'Password' }).fill('Start123!');
        await page.getByRole('button', { name: 'Continue' }).click();

        // Czekamy na ikonkę ustawień - dowód, że jesteśmy w środku
        await expect(page.getByText('⚙️')).toBeVisible({ timeout: 30000 });
        console.log('Logowanie udane - widzę Dashboard.');
    });

    await test.step('2. Zmiana języka PL/EN', async () => {
        const langPlBtn = page.getByRole('button', { name: /Przełącz na polski|Polski|PL/i });

        if (await langPlBtn.isVisible()) {
            await langPlBtn.click();
            await expect(page.getByRole('link', { name: /Moje Akwaria/i })).toBeVisible();
        } else {
            // Już jest po polsku
            await expect(page.getByRole('link', { name: /Moje Akwaria/i })).toBeVisible();
        }

        // Przełączamy na Angielski (wymagane do dalszej części testu)
        await page.getByRole('button', { name: /Switch to English|English/i }).click();
        await expect(page.getByRole('link', { name: /Aquariums/i })).toBeVisible();
    });

    await test.step('3. Obsługa Ustawień', async () => {
        await page.getByText('⚙️').click();
        await expect(page.getByRole('heading', { name: /Settings|Ustawienia/i })).toBeVisible();

        const toggle = page.getByRole('switch').first();
        await toggle.check();
        await expect(toggle).toBeChecked();
        await toggle.uncheck();

        // Otwarcie modala sesji
        await page.getByText(/Session Duration|Długość sesji/i).click();
        await expect(page.getByRole('heading', { name: /Session Information|Informacje o sesji/i })).toBeVisible();

        // --- POPRAWKA TUTAJ ---
        // 1. Zamykamy modal "Informacje o sesji"
        // Używamy .first(), żeby uniknąć pomyłki z innymi przyciskami
        await page.getByRole('button', { name: /Close|Zamknij/i }).first().click();

        // 2. Zamykamy główne menu Ustawień (X)
        // Usunąłem "x" z listy, zostawiłem tylko "✕" (symbol) i "Close"
        // Dodatkowo szukamy też po prostu przycisku, który wygląda jak zamknięcie
        const closeSettingsBtn = page.getByRole('button', { name: /✕|Close/i }).or(page.getByLabel('close'));
        await closeSettingsBtn.first().click();

        // Weryfikacja: czy widzimy linki Dashboardu
        await expect(page.getByRole('link', { name: /Aquariums/i })).toBeVisible();
    });

    await test.step('4. Przeklikiwanie sekcji Dashboardu', async () => {
        // 1. Akwaria
        await page.getByRole('link', { name: /Aquariums/i }).click();
        await expect(page.getByRole('heading', { name: /Aquariums|Akwaria/i }).first()).toBeVisible();
        await page.getByRole('link', { name: /Return/i }).click();

        // 2. Baza Ryb
        await page.getByRole('link', { name: /Fish Database/i }).click();
        await expect(page.getByText(/Freshwater|Saltwater|Słodkowodne/i).first()).toBeVisible({timeout: 10000});
        await page.getByRole('link', { name: /Return/i }).click();

        // 3. Kontakty
        await page.getByRole('link', { name: /Contacts/i }).click();
        await expect(page.getByRole('heading', { name: /Contacts|Kontakty/i }).first()).toBeVisible();
        await page.getByRole('link', { name: /Return/i }).click();

        // 4. Baza Roślin
        await page.getByRole('link', { name: /Plants Database/i }).click();
        await expect(page.getByText(/Growth Rate|Tempo wzrostu/i).first()).toBeVisible({timeout: 10000});
        await page.getByRole('link', { name: /Return/i }).click();
    });

    await test.step('6. Wylogowanie', async () => {
        // Otwieramy ustawienia ponownie, żeby się wylogować
        await page.getByText('⚙️').click();

        await page.getByRole('button', { name: /Logout|Wyloguj/i }).click();
        await expect(page).toHaveURL(/amazoncognito\.com/);
    });
});