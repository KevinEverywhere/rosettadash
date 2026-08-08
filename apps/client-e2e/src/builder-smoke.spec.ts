import { test, expect } from '@playwright/test';

test.describe('Builder smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    await expect(page.getByTestId('builder-loading')).toBeHidden({ timeout: 60_000 });
    await expect(page.getByTestId('builder-shell')).toBeVisible();
  });

  test('adds a component, edits a property, saves, and restores after reload', async ({
    page,
  }) => {
    await page.getByTestId('palette-add-visual.input.text').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(1);

    await page.getByTestId('canvas-node').click();
    await page.getByTestId('inspector-prop-placeholder').fill('Email address');

    await expect(page.getByTestId('save-status')).toContainText('Unsaved');
    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('save-status')).toContainText('Saved');

    await page.reload();
    await expect(page.getByTestId('builder-loading')).toBeHidden({ timeout: 60_000 });
    await expect(page.getByTestId('canvas-node')).toHaveCount(1);

    await page.getByTestId('canvas-node').click();
    await expect(page.getByTestId('inspector-prop-placeholder')).toHaveValue('Email address');
  });
});
