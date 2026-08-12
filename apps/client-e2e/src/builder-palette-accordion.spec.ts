import { test, expect } from '@playwright/test';
import { addFromPalette, expandPaletteGroup, openBuilder } from './test-helpers';

test.describe('Builder palette accordion', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('groups default collapsed and expand independently', async ({ page }) => {
    await expect(page.getByTestId('palette-group-panel-form-inputs')).toBeHidden();
    await expect(page.getByTestId('palette-group-panel-data-display')).toBeHidden();

    await expandPaletteGroup(page, 'form-inputs');
    await expect(page.getByTestId('palette-group-panel-form-inputs')).toBeVisible();
    await expect(page.getByTestId('palette-group-panel-data-display')).toBeHidden();

    await expandPaletteGroup(page, 'data-display');
    await expect(page.getByTestId('palette-group-panel-form-inputs')).toBeVisible();
    await expect(page.getByTestId('palette-group-panel-data-display')).toBeVisible();
  });

  test('adds a component after expanding its group', async ({ page }) => {
    await addFromPalette(page, 'visual.input.text');
    await expect(page.getByTestId('canvas-node')).toHaveCount(1);
  });
});
