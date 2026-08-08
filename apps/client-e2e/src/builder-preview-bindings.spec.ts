import { test, expect } from '@playwright/test';
import { openBuilder, waitForPreviewData } from './test-helpers';

test.describe('Builder preview binding flow', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('filters table and chart from date range bindings in preview', async ({ page }) => {
    await page.getByTestId('palette-add-visual.input.date-range').click();
    await page.getByTestId('palette-add-visual.table').click();
    await page.getByTestId('palette-add-visual.chart.line').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(3);

    const nodes = page.getByTestId('canvas-node');
    const dateRangeNode = nodes.nth(0);
    const tableNode = nodes.nth(1);
    const chartNode = nodes.nth(2);

    await dateRangeNode.getByTestId(/^port-output-.*-range$/).click();
    await tableNode.getByTestId(/^port-input-.*-filter$/).click();

    await dateRangeNode.getByTestId(/^port-output-.*-range$/).click();
    await chartNode.getByTestId(/^port-input-.*-range$/).click();

    await page.getByTestId('mode-preview').click();
    await waitForPreviewData(page);

    await expect(page.getByTestId('preview-table').first()).toBeVisible();
    await expect(page.getByTestId('preview-line-chart')).toBeVisible();
    await expect(page.getByTestId('preview-binding-hint').first()).toContainText(
      'Filtered by date range',
    );
  });
});
