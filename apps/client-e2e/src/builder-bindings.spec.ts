import { test, expect } from '@playwright/test';
import { openBuilder } from './test-helpers';

test.describe('Builder bindings', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('connects compatible ports, saves, and restores after reload', async ({ page }) => {
    await page.getByTestId('palette-add-visual.input.date-range').click();
    await page.getByTestId('palette-add-visual.chart.line').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(2);

    const nodes = page.getByTestId('canvas-node');
    const dateRangeNode = nodes.nth(0);
    const chartNode = nodes.nth(1);

    await dateRangeNode.getByTestId(/^port-output-.*-range$/).click();
    await expect(page.getByTestId('binding-hint')).toBeVisible();
    await chartNode.getByTestId(/^port-input-.*-range$/).click();
    await expect(page.getByTestId('binding-hint')).toBeHidden();

    await chartNode.click();
    await expect(page.getByTestId('inspector-bindings')).toBeVisible();
    await expect(page.getByTestId('inspector-bindings')).toContainText('Date Range.range');

    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('save-status')).toContainText('Saved');

    await page.reload();
    await expect(page.getByTestId('builder-loading')).toBeHidden({ timeout: 120_000 });
    await expect(page.getByTestId('canvas-node')).toHaveCount(2);

    await page.getByTestId('canvas-node').nth(1).click();
    await expect(page.getByTestId('inspector-bindings')).toBeVisible();
    await expect(page.getByTestId('inspector-bindings')).toContainText('Date Range.range');
  });

  test('shows an error for incompatible port types', async ({ page }) => {
    await page.getByTestId('palette-add-visual.input.text').click();
    await page.getByTestId('palette-add-visual.chart.line').click();

    const textNode = page.getByTestId('canvas-node').nth(0);
    const chartNode = page.getByTestId('canvas-node').nth(1);

    await textNode.getByTestId(/^port-output-.*-value$/).click();
    await chartNode.getByTestId(/^port-input-.*-data$/).click();

    await expect(page.getByTestId('binding-error')).toContainText('Incompatible types');
    await expect(page.getByTestId('inspector-bindings')).toHaveCount(0);
  });
});
