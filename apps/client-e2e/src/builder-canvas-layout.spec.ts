import { test, expect } from '@playwright/test';
import { openBuilder } from './test-helpers';

test.describe('Builder canvas layout', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('supports shift+click multi-select and shows resize handle', async ({ page }) => {
    await page.getByTestId('palette-add-visual.kpi').click();
    await page.getByTestId('palette-add-visual.input.text').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(2);

    const nodes = page.getByTestId('canvas-node');
    await nodes.nth(0).click();
    await expect(nodes.nth(0)).toHaveAttribute('data-selected', 'true');
    await expect(nodes.nth(1)).toHaveAttribute('data-selected', 'false');
    await expect(page.getByTestId('canvas-resize-handle')).toHaveCount(1);

    await nodes.nth(1).click({ modifiers: ['Shift'] });
    await expect(nodes.nth(0)).toHaveAttribute('data-selected', 'true');
    await expect(nodes.nth(1)).toHaveAttribute('data-selected', 'true');
    await expect(page.getByTestId('canvas-multi-select-hint')).toBeVisible();
    await expect(page.getByTestId('canvas-resize-handle')).toHaveCount(2);
  });
});
