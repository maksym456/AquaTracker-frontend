import { test, expect } from '@playwright/test';

test('interfejs dostosowuje się do szerokości ekranu', async ({ page, isMobile }) => {
    await page.goto('');

    if (isMobile) {
        await page.getByRole('button', { name: /menu/i }).click();
        await expect(page.getByTestId('mobile-fish-selector')).toBeVisible();
    } else {
        await expect(page.getByTestId('desktop-sidebar')).toBeVisible();
    }
});