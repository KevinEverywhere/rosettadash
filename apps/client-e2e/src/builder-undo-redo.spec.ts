import { test, expect } from '@playwright/test';
import { addFromPalette, openBuilder } from './test-helpers';

test.describe('Builder undo/redo', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('undoes and redoes adding a component from the palette', async ({ page }) => {
    await expect(page.getByTestId('undo-button')).toBeDisabled();
    await addFromPalette(page, 'visual.input.text');
    await expect(page.getByTestId('canvas-node')).toHaveCount(1);
    await expect(page.getByTestId('undo-button')).toBeEnabled();

    await page.getByTestId('undo-button').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(0);
    await expect(page.getByTestId('redo-button')).toBeEnabled();

    await page.getByTestId('redo-button').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(1);
  });
});
