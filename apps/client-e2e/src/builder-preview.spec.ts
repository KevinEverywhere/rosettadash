import { test, expect } from '@playwright/test';
import { openBuilder, waitForPreviewData } from './test-helpers';

test.describe('Builder preview', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('renders visual components in preview mode and reflects property edits', async ({
    page,
  }) => {
    await page.getByTestId('palette-add-visual.input.text').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(1);

    await page.getByTestId('canvas-node').click();
    await page.getByTestId('inspector-prop-placeholder').fill('Customer name');

    await page.getByTestId('mode-preview').click();
    await expect(page.getByTestId('preview-workspace')).toBeVisible();
    await expect(page.getByTestId('preview-panel')).toBeVisible();
    await waitForPreviewData(page);
    await expect(page.getByTestId('preview-data-source')).toContainText('API');
    await expect(page.getByTestId('preview-text-input')).toHaveAttribute(
      'placeholder',
      'Customer name',
    );

    await page.getByTestId('mode-design').click();
    await expect(page.getByTestId('design-workspace')).toBeVisible();
    await expect(page.getByTestId('canvas-node')).toHaveCount(1);
  });

  test('shows table and chart previews for P0 visual components', async ({ page }) => {
    await page.getByTestId('palette-add-visual.table').click();
    await page.getByTestId('palette-add-visual.chart.line').click();

    await page.getByTestId('mode-preview').click();
    await waitForPreviewData(page);
    await expect(page.getByTestId('preview-table')).toBeVisible();
    await expect(page.getByTestId('preview-line-chart')).toBeVisible();
  });

  test('shows P1 form input previews', async ({ page }) => {
    await page.getByTestId('palette-add-visual.input.number').click();
    await page.getByTestId('palette-add-visual.input.checkbox').click();
    await page.getByTestId('palette-add-visual.input.textarea').click();

    await page.getByTestId('mode-preview').click();
    await waitForPreviewData(page);
    await expect(page.getByTestId('preview-number-input')).toBeVisible();
    await expect(page.getByTestId('preview-checkbox')).toBeVisible();
    await expect(page.getByTestId('preview-textarea')).toBeVisible();
  });
});
