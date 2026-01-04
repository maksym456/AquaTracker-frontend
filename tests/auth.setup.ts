import { Page } from '@playwright/test';


export async function mockAuthenticatedUser(page: Page) {
    await page.route('http://localhost:3000/', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                user: {
                    name: "Admin User",
                    email: "admin@example.com",
                },
                expires: "2099-01-01T00:00:00.000Z",
            }),
        });
    });
}


export async function mockUnauthenticatedUser(page: Page) {
    await page.route('http://localhost:3000/', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({}), // Pusty obiekt = brak sesji w NextAuth
        });
    });
}