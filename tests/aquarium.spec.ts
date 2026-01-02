import { test, expect, Page } from '@playwright/test';

// Adres Twojej aplikacji (zmień jeśli uruchamiasz na innym porcie)
const BASE_URL = 'http://localhost:3001';

test.describe('AquaManager System - UI Tests (TS)', () => {

    // Hook uruchamiany przed każdym testem
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto(BASE_URL);
    });

    // --- 1. TESTY PODSTAWOWE ---

    test('Główny dashboard powinien się załadować z poprawnymi nagłówkami', async ({ page }) => {
        // Weryfikacja tytułu aplikacji
        await expect(page.getByText('AquaManager System')).toBeVisible();
        await expect(page.getByText('Super Admin')).toBeVisible();

        // Sprawdzenie czy domyślna zakładka (Użytkownicy) jest aktywna
        await expect(page.getByRole('heading', { name: 'Użytkownicy' })).toBeVisible();
    });

    test('Nawigacja między zakładkami powinna zmieniać widoki', async ({ page }) => {
        // Przejście do Monitoring Akwariów
        await page.getByRole('button', { name: 'Monitoring Akwariów' }).click();
        await expect(page.getByRole('heading', { name: 'Monitoring Parametrów Wody' })).toBeVisible();

        // Przejście do Baza Gatunków
        await page.getByRole('button', { name: 'Baza Gatunków' }).click();
        await expect(page.getByRole('heading', { name: 'Katalog' })).toBeVisible();
    });

    // --- 2. TESTY MODALA STATYSTYK (NOWA FUNKCJONALNOŚĆ) ---

    test('Powinien otworzyć modal ze szczegółami konkretnego akwarium', async ({ page }) => {
        // 1. Przejdź do zakładki
        await page.getByRole('button', { name: 'Monitoring Akwariów' }).click();

        // 2. Znajdź wiersz z "Morska Rafa" i kliknij w nim przycisk "Szczegóły"
        const row = page.getByRole('row').filter({ hasText: 'Morska Rafa' });
        await row.getByRole('button', { name: 'Szczegóły' }).click();

        // 3. Weryfikacja widoczności modala
        const modal = page.locator('.fixed.inset-0'); // Selektor kontenera modala
        await expect(modal).toBeVisible();

        // 4. Sprawdzenie czy dane w modalu dotyczą tego konkretnego akwarium
        await expect(modal.getByRole('heading', { name: 'Morska Rafa' })).toBeVisible();
        await expect(modal.getByText('ID: #101')).toBeVisible(); // ID z mocka
    });

    test('Modal powinien wyświetlać poprawne KPI oraz Historię', async ({ page }) => {
        // Otwarcie modala
        await page.getByRole('button', { name: 'Monitoring Akwariów' }).click();
        await page.getByRole('row').filter({ hasText: 'Morska Rafa' }).getByRole('button', { name: 'Szczegóły' }).click();

        const modal = page.locator('.fixed.inset-0');

        // Sprawdzenie sekcji "Obecna Obsada" (czy zawiera Neon Innesa z mocka)
        const speciesRow = modal.getByRole('row').filter({ hasText: 'Neon Innesa' });
        await expect(speciesRow).toBeVisible();
        await expect(speciesRow).toContainText('Ryba');

        // Sprawdzenie sekcji "Historia Zmian"
        await expect(modal.getByText('Historia Zmian')).toBeVisible();
        // Szukamy wpisu w historii (z mocka)
        await expect(modal.getByText('Dodano gatunek').first()).toBeVisible();

        // Sprawdzenie czy wyliczono średnią długość życia (KPI)
        // Szukamy elementu zawierającego tekst "lat" w sekcji statystyk
        await expect(modal.locator('.text-purple-600').filter({ hasText: 'lat' }).first()).toBeVisible();
    });

    test('Przycisk "Zamknij" powinien zamykać modal', async ({ page }) => {
        // Otwarcie
        await page.getByRole('button', { name: 'Monitoring Akwariów' }).click();
        await page.getByRole('button', { name: 'Szczegóły' }).first().click();

        // Zamknięcie
        await page.getByRole('button', { name: 'Zamknij' }).click();

        // Asercja: modal znika
        await expect(page.locator('.fixed.inset-0')).not.toBeVisible();
    });

    // --- 3. TESTY INTERAKCJI FORMULARZY I TABEL ---

    test('Dodawanie nowego gatunku do katalogu (CRUD)', async ({ page }) => {
        await page.getByRole('button', { name: 'Baza Gatunków' }).click();

        // Wypełnianie formularza
        await page.getByPlaceholder('Nazwa').fill('Krab Tęczowy');
        await page.getByPlaceholder('Śr. życie (lat)').fill('4');

        // Submit
        await page.getByRole('button', { name: 'Dodaj' }).click();

        // 1. Sprawdź powiadomienie (Toast)
        await expect(page.getByText('Dodano: Krab Tęczowy')).toBeVisible();

        // 2. Sprawdź czy element pojawił się w tabeli
        const newRow = page.getByRole('row').filter({ hasText: 'Krab Tęczowy' });
        await expect(newRow).toBeVisible();
        await expect(newRow).toContainText('4 lat');
    });

    test('Wyszukiwarka użytkowników powinna filtrować wyniki', async ({ page }) => {
        // Jesteśmy domyślnie na tabie Użytkownicy
        const searchInput = page.getByPlaceholder('Szukaj...');

        // Wpisujemy "Anna"
        await searchInput.fill('Anna');

        // "Jan Kowalski" powinien zniknąć
        await expect(page.getByText('Jan Kowalski')).not.toBeVisible();

        // "Anna Nowak" powinna zostać
        await expect(page.getByText('Anna Nowak')).toBeVisible();
    });

    test('Zablokowanie użytkownika zmienia jego status w tabeli', async ({ page }) => {
        // Znajdź wiersz z Janem (jest aktywny)
        const janRow = page.getByRole('row').filter({ hasText: 'Jan Kowalski' });

        // Kliknij ikonę kłódki (przycisk w ostatniej kolumnie)
        await janRow.getByRole('button').click();

        // Sprawdź czy status zmienił się na "Zablokowany"
        await expect(janRow.getByText('Zablokowany')).toBeVisible();

        // Sprawdź Toast
        await expect(page.getByText('Zmiana blokady użytkownika')).toBeVisible();
    });

});