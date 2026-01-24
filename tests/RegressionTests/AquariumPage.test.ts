import { test, expect } from '@playwright/test';

test.describe('E2E: Pełny Przegląd Funkcjonalności (Dashboard, Akwarium, Zawartość)', () => {

    test.setTimeout(180000); // 3 minuty na całość

    const uniqueID = Math.floor(Math.random() * 100000);
    const nazwaAkwarium = `Testowe Akwarium ${uniqueID}`;
    const nazwaEdytowana = `${nazwaAkwarium} (Edycja)`;

    test('Pełny scenariusz użytkownika', async ({ page }) => {

        // --- KROK 1: LOGOWANIE ---
        await test.step('1. Logowanie', async () => {
            await page.goto('https://eu-north-1kzpudw0vg.auth.eu-north-1.amazoncognito.com/login?client_id=7cvtmkucocn97om3mdrr876igm&redirect_uri=http://localhost:3000/api/auth/callback/cognito&response_type=code&scope=openid&state=rmo0aBT-e_kAbp2VubqTIUgsk0PVNn4P9uORFbPHMrA');

            await page.getByRole('textbox', { name: 'Username' }).fill('rybkitest2');
            await page.getByRole('button', { name: 'Next' }).click();
            await page.getByRole('textbox', { name: 'Password' }).fill('Start123!');
            await page.getByRole('button', { name: 'Continue' }).click();

            await expect(page.getByRole('link', { name: /Aquariums|Moje Akwaria/i })).toBeVisible({ timeout: 30000 });
        });

        // --- KROK 2: FUNKCJE DASHBOARDU ---
        await test.step('2. Sprawdzenie okien Dashboardu (Statystyki, Historia)', async () => {
            const statsIcon = page.getByText('📊');
            if (await statsIcon.isVisible()) {
                await statsIcon.click();
                await expect(page.getByRole('heading', { name: /Statistics/i })).toBeVisible();
                await page.getByRole('button', { name: /Close|Zamknij|✕/i }).first().click();
            }

            const historyIcon = page.getByText('📋');
            if (await historyIcon.isVisible()) {
                await historyIcon.click();
                await expect(page.getByRole('heading', { name: /Activity History|Historia Aktywności/i })).toBeVisible();
                await page.getByRole('button', { name: /Close|Zamknij|✕/i }).first().click();
            }
        });

        // --- KROK 3: ZMIANA JĘZYKA ---
        await test.step('3. Test zmiany języka', async () => {
            const plBtn = page.getByRole('button', { name: /Przełącz na polski|Polski|PL/i });
            if (await plBtn.isVisible()) {
                await plBtn.click();
                await expect(page.getByRole('link', { name: /Powrót/i }).or(page.getByRole('link', { name: 'Moje Akwaria' }))).toBeVisible();
            }

            await page.getByRole('button', { name: /Switch to English|English/i }).click();
            await expect(page.getByRole('link', { name: /Return|Aquariums/i })).toBeVisible();
        });

        // --- KROK 4: TWORZENIE AKWARIUM ---
        await test.step('4. Tworzenie nowego akwarium', async () => {
            await page.getByRole('link', { name: /Aquariums/i }).click();
            await page.getByRole('button', { name: /Create Aquarium/i }).click();

            await page.getByRole('textbox', { name: 'Aquarium Name' }).fill(nazwaAkwarium);
            await page.getByRole('textbox', { name: 'Aquarium Description' }).fill('Test automatyczny');


            const tempInput = page.getByRole('spinbutton', { name: /Temperature/i });
            await tempInput.click({ force: true });
            await tempInput.fill('24');

            await page.getByRole('button', { name: /Create/i }).click();
            await expect(page.getByRole('heading', { name: nazwaAkwarium })).toBeVisible({ timeout: 15000 });
        });

        // --- KROK 5: ZARZĄDZANIE ZAWARTOŚCIĄ (RYBY I ROŚLINY) ---
        await test.step('5. Dodawanie i usuwanie Ryb oraz Roślin', async () => {
            // Wchodzimy do akwarium
            await page.locator('div').filter({ hasText: nazwaAkwarium }).last().click();

            // 1. Dodaj Rybę
            const addFishBtn = page.getByRole('button', { name: /Add Fish/i });
            await expect(addFishBtn).toBeVisible();
            await addFishBtn.click({ force: true });

            const quantityInput = page.getByRole('spinbutton', { name: /Quantity/i });
            await expect(quantityInput).toBeVisible();
            await page.getByRole('combobox').click();
            await page.getByRole('option').first().click();
            await quantityInput.fill('3');
            await page.getByRole('button', { name: /ADD|Dodaj/i }).last().click();
            await expect(quantityInput).not.toBeVisible();

            // 2. Dodaj Roślinę
            const addPlantBtn = page.getByRole('button', { name: /Add Plant/i });
            await addPlantBtn.click({ force: true });
            await expect(quantityInput).toBeVisible();
            await page.getByRole('combobox').click();
            await page.getByRole('option').first().click();
            await quantityInput.fill('2');
            await page.getByRole('button', { name: /ADD|Dodaj/i }).last().click();
            await expect(quantityInput).not.toBeVisible();

            // Definiujemy przycisk zamykania (X) tak jak chciałaś
            const closeSettingsBtn = page.getByRole('button', { name: /✕|Close/i }).or(page.getByLabel('close'));

            // --- USUWANIE RYBY ---
            await page.getByRole('button', { name: '🐟' }).click();

            page.once('dialog', async dialog => {
                console.log(`Dialog message (Fish): ${dialog.message()}`);
                await dialog.accept();
            });

            await page.getByRole('listitem').first().getByLabel('delete').click();

            // Zamykamy listę ryb używając Twojej zmiennej
            await closeSettingsBtn.first().click();

            // --- USUWANIE ROŚLINY ---
            await page.getByRole('button', { name: '🌿' }).click();

            page.once('dialog', async dialog => {
                console.log(`Dialog message (Plant): ${dialog.message()}`);
                await dialog.accept();
            });

            await page.getByRole('listitem').first().getByLabel('delete').click();

            // Zamykamy listę roślin używając Twojej zmiennej
            await closeSettingsBtn.first().click();

            // --- POWRÓT I OCZEKIWANIE ---
            // Klikamy Return (jako link, bo to nawigacja)
            await page.getByRole('link', { name: /Return|Wróć/i }).click();

            // KLUCZOWE: Czekamy, aż załaduje się strona główna (przycisk Create Aquarium),
            // zanim robot przejdzie do Kroku 6. To naprawi błąd "Target closed".
            await expect(page.getByRole('button', { name: /Create Aquarium/i })).toBeVisible({ timeout: 15000 });
        });

        // --- KROK 6: EDYCJA AKWARIUM ---
        await test.step('6. Edycja nazwy akwarium', async () => {
            // Teraz mamy pewność, że jesteśmy na liście
            const card = page.locator('div').filter({ hasText: nazwaAkwarium }).last();
            await card.getByRole('button').first().click(); // Edycja (pierwsza ikona)

            const nameInput = page.getByRole('textbox').first();
            await expect(nameInput).toBeVisible();
            await nameInput.fill(nazwaEdytowana);
            await page.getByRole('button', { name: /Save/i }).click();

            await expect(page.getByRole('heading', { name: nazwaEdytowana })).toBeVisible();
        });

        // --- KROK 7: UDOSTĘPNIANIE ---
        await test.step('7. Sprawdzenie okna udostępniania', async () => {
            const card = page.locator('div').filter({ hasText: nazwaEdytowana }).last();
            await card.getByRole('button').nth(1).click(); // Udostępnij (druga ikona)

            await expect(page.getByRole('heading', { name: /Share|Udostępnij/i })).toBeVisible();

            // Zamykamy X-em (zdefiniowanym wcześniej)
            const closeSettingsBtn = page.getByRole('button', { name: /✕|Close/i }).or(page.getByLabel('close'));
            await closeSettingsBtn.first().click();
        });

        // --- KROK 8: USUWANIE ---
        await test.step('8. Usuwanie akwarium', async () => {
            const cardToDelete = page.locator('div').filter({ hasText: nazwaEdytowana }).last();
            await cardToDelete.getByRole('button').nth(2).click(); // Usuń (trzecia ikona)

            await expect(page.getByRole('heading', { name: /Potwierdź|Confirm/i })).toBeVisible();
            await page.getByRole('button', { name: /Usuń|Delete/i }).click();

            await expect(page.getByRole('heading', { name: nazwaEdytowana })).not.toBeVisible();
        });

        await page.getByRole('link', { name: /Return/i }).click();
    });
});