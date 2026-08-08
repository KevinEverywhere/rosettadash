import { test, expect } from '@playwright/test';
import { openBuilder } from './test-helpers';

test.describe('Builder export wizard', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('shows validation errors for an empty composite', async ({ page }) => {
    await page.getByTestId('export-button').click();
    await expect(page.getByTestId('export-wizard')).toBeVisible();
    await expect(page.getByTestId('export-wizard-loading')).toBeHidden({ timeout: 30_000 });
    await expect(page.getByTestId('export-wizard-error')).toBeVisible();
    await expect(page.getByTestId('export-wizard-download')).toBeDisabled();
  });

  test('previews files and enables download for an export-ready composite', async ({ page }) => {
    await page.getByTestId('palette-add-infra.postgresql').click();
    await page.getByTestId('palette-add-infra.server.nest').click();
    await page.getByTestId('palette-add-visual.table').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(3);

    const postgresNode = page.getByTestId('canvas-node').nth(0);
    const tableNode = page.getByTestId('canvas-node').nth(2);

    await postgresNode.getByTestId(/^port-output-.*-rowset$/).click();
    await tableNode.getByTestId(/^port-input-.*-data$/).click();

    await page.getByTestId('export-button').click();
    await expect(page.getByTestId('export-wizard')).toBeVisible();
    await expect(page.getByTestId('export-wizard-loading')).toBeHidden({ timeout: 30_000 });
    await expect(page.getByTestId('export-wizard-files')).toBeVisible();
    await expect(page.getByTestId('export-wizard-files')).toContainText('src/Dashboard.tsx');
    await expect(page.getByTestId('export-wizard-files')).toContainText('server/src/main.ts');
    await expect(page.getByTestId('export-wizard-download')).toBeEnabled();

    const downloadPromise = page.waitForEvent('download');
    await page.getByTestId('export-wizard-download').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/-export\.zip$/);
  });
});
