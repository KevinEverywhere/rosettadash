import { test, expect } from '@playwright/test';
import { openBuilderViaStackSetup } from './test-helpers';

test.describe('Stack setup entry', () => {
  test('shows stack choices and continues to builder', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    await expect(page.getByTestId('stack-setup')).toBeVisible();
    await expect(page.getByTestId('stack-ui-react')).toBeVisible();
    await expect(page.getByTestId('stack-ui-any')).toBeVisible();

    await page.getByTestId('stack-ui-vue').click();
    await expect(page.getByTestId('stack-server-nuxt')).toBeVisible();

    await page.getByTestId('stack-setup-continue').click();
    await expect(page.getByTestId('builder-shell')).toBeVisible({ timeout: 120_000 });
  });

  test('skips stack setup when a builder session exists', async ({ page }) => {
    await openBuilderViaStackSetup(page);

    await page.goto('/');
    await page.waitForURL('**/builder');
    await expect(page.getByTestId('builder-shell')).toBeVisible({ timeout: 120_000 });
    await expect(page.getByTestId('stack-setup')).toHaveCount(0);
  });
});
