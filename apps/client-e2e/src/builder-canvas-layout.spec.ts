import { test, expect } from '@playwright/test';
import {
  addFromPalette,
  dismissPlacementPromptIfVisible,
  openBuilder,
  selectCanvasNodeHeader,
} from './test-helpers';

test.describe('Builder canvas layout', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('supports shift+click multi-select and shows resize handle', async ({ page }) => {
    await addFromPalette(page, 'visual.kpi');
    await dismissPlacementPromptIfVisible(page);
    await addFromPalette(page, 'visual.input.text');
    await dismissPlacementPromptIfVisible(page);
    await expect(page.getByTestId('canvas-node')).toHaveCount(2);

    const nodes = page.getByTestId('canvas-node');
    await selectCanvasNodeHeader(page, nodes.nth(0));
    await expect(nodes.nth(0)).toHaveAttribute('data-selected', 'true');
    await expect(nodes.nth(1)).toHaveAttribute('data-selected', 'false');
    await expect(page.getByTestId('canvas-resize-handle')).toHaveCount(1);

    await selectCanvasNodeHeader(page, nodes.nth(1), { shiftKey: true });
    await expect(nodes.nth(0)).toHaveAttribute('data-selected', 'true');
    await expect(nodes.nth(1)).toHaveAttribute('data-selected', 'true');
    await expect(page.getByTestId('canvas-multi-select-hint')).toBeVisible();
    await expect(page.getByTestId('canvas-resize-handle')).toHaveCount(2);
  });
});
