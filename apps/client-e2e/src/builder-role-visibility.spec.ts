import { test, expect } from '@playwright/test';
import { addFromPalette, openBuilder } from './test-helpers';

test.describe('Builder role visibility', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('shows and hides role gates based on preview role', async ({ page }) => {
    await page.getByTestId('domain-role-preset').selectOption('admin');
    await page.getByTestId('domain-role-preset').selectOption('viewer');

    await addFromPalette(page, 'domain.role-gate');

    await page.getByTestId('mode-preview').click();
    await page.getByTestId('preview-role-select').selectOption('viewer');
    await expect(page.getByTestId('preview-role-gate-hidden')).toBeVisible();

    await page.getByTestId('preview-role-select').selectOption('admin');
    await expect(page.getByTestId('preview-role-gate-visible')).toBeVisible();
  });
});
