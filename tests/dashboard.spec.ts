import { test, expect } from '@playwright/test';
import { mockAuthenticatedUser, mockUnauthenticatedUser } from './auth.setup';

test.describe('Dashboard Auth Gate', () => {

    test('shows loading spinner initially', async ({ page }) => {
        // Celowo opóźniamy odpowiedź sesji, aby uchwycić stan ładowania
        await page.route('http://localhost:3000/', async (route) => {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Czekaj 1s
            await route.fulfill({ status: 200, body: '{}' });
        });

        await page.goto('http://localhost:3000/');

        // Sprawdź czy loader jest widoczny i ma odpowiednie atrybuty dostępności
        const loader = page.locator('div[role="status"]');
        await expect(loader).toBeVisible();
        await expect(page.getByText('Weryfikacja uprawnień administratora...')).toBeVisible();
    });

    test('redirects unauthenticated user to Cognito login', async ({ page }) => {
        // 1. Symulujemy brak sesji
        await mockUnauthenticatedUser(page);

        // 2. Wchodzimy na stronę
        await page.goto('/');

        // 3. Twój kod wywołuje signIn(), co w NextAuth powoduje przekierowanie.
        // Sprawdzamy, czy URL się zmienił (oczekujemy przekierowania do endpointu logowania)
        // Uwaga: W środowisku testowym może to być /api/auth/signin lub URL Cognito
        await expect(page).toHaveURL(/api\/auth\/signin|cognito/);
    });

    test('renders Dashboard for authenticated user', async ({ page }) => {
        // 1. Symulujemy zalogowanego użytkownika
        await mockAuthenticatedUser(page);

        // 2. Wchodzimy na stronę
        await page.goto('http://localhost:3000/');

        // 3. Oczekujemy, że loader zniknie
        await expect(page.locator('div[role="status"]')).toBeHidden();

    });

});