import { test, expect } from '@playwright/test';

const generateFishName = () => `TestowaRybka_${Date.now()}`;

test.describe('Zarządzanie akwarium - Scenariusz Real-Time', () => {
    let fishId: string;
    const fishName = generateFishName();

    test.beforeAll(async ({ request }) => {
        const response = await request.post('/api/fishes', {
            data: {
                name: fishName,
                type: 'Neon',
                is_test: true
            }
        });

        expect(response.ok(), 'Nie udało się utworzyć ryby testowej API').toBeTruthy();

        const body = await response.json();
        fishId = body.id;
    });

    test('Właściciel karmi rybę, a Znajomy widzi zmianę statusu', async ({ browser }) => {
        test.skip(!fishId, 'Pominięto test z powodu błędu w setupie API');

        const adminCtx = await browser.newContext({ storageState: 'playwright/.auth/admin.json' });
        const adminPage = await adminCtx.newPage();

        const friendCtx = await browser.newContext({ storageState: 'playwright/.auth/friend.json' });
        const friendPage = await friendCtx.newPage();

        await Promise.all([
            adminPage.goto('http://localhost:3000/'),
            friendPage.goto('http://localhost:3000/'),
        ]);

        const adminFishRow = adminPage.locator(`[data-id="${fishId}"]`);
        await expect(adminFishRow).toBeVisible();
        await expect(adminFishRow).toContainText(fishName);

        await adminFishRow.click();

        const feedButton = adminPage.getByRole('button', { name: /nakarm/i });
        await expect(feedButton).toBeVisible();
        await feedButton.click();

        await expect(adminPage.getByText('Rybka została nakarmiona')).toBeVisible();

        const friendFishRow = friendPage.locator(`[data-id="${fishId}"]`);
        await expect(friendFishRow).toContainText('Najedzona', { timeout: 10000 });

        await adminCtx.close();
        await friendCtx.close();
    });

    test.afterAll(async ({ request }) => {
        if (fishId) {
            const response = await request.delete(`/api/fishes/${fishId}`);
            if (!response.ok()) {
                console.warn(`Nie udało się usunąć ryby o ID: ${fishId}`);
            }
        }
    });
});
