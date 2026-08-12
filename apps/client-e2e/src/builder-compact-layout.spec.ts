import { test, expect } from '@playwright/test';
import { openBuilder } from './test-helpers';

test.describe('Builder compact layout', () => {
  test.use({ viewport: { width: 1024, height: 768 } });

  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('shows panel toggles and drawer workflow on tablet landscape width', async ({ page }) => {
    await expect(page.getByTestId('toggle-palette')).toBeVisible();
    await expect(page.getByTestId('toggle-inspector')).toBeVisible();
    await expect(page.getByTestId('palette')).not.toBeVisible();

    await page.getByTestId('toggle-palette').click();
    await expect(page.getByTestId('palette')).toBeVisible();

    await page.getByTestId('builder-panel-backdrop').click();
    await expect(page.getByTestId('palette')).not.toBeVisible();
  });
});
