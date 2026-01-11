import { test, expect } from '@playwright/test';

test('Użytkownik może dodać rybkę i wejść w interakcję', async ({ page }) => {
    await page.goto('http://localhost:3000/');

    const aquarium = page.getByTestId('aquarium-main-view');
    const initialFishCount = await aquarium.getByTestId('fish-instance').count();

    await page.getByRole('button', { name: /dodaj/i }).click();
    await page.getByTestId('option-neon').click();

    await expect(aquarium.getByTestId('fish-instance')).toHaveCount(initialFishCount + 1);

    const newFish = aquarium.getByTestId('fish-instance').last();
    await newFish.click({ force: true });

    const actionsMenu = page.getByTestId('fish-actions-menu');
    await expect(actionsMenu).toBeVisible();
    await expect(actionsMenu).toContainText('Nakarm');
    await expect(actionsMenu).toContainText('Usuń');
});
