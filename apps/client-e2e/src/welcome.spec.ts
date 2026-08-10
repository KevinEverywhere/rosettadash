import { test, expect } from '@playwright/test';
import { openBuilderViaWelcome } from './test-helpers';

test.describe('Welcome page entry', () => {
  test('shows welcome hero and stack choices, then continues to builder', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();

    await expect(page.getByTestId('welcome-page')).toBeVisible();
    await expect(page.getByText('Welcome to DashBuilder')).toBeVisible();
    await expect(page.getByTestId('stack-ui-react')).toBeVisible();
    await expect(page.getByTestId('stack-ui-any')).toBeVisible();

    await page.getByTestId('stack-ui-vue').click();
    await expect(page.getByTestId('stack-server-nuxt')).toBeVisible();

    await page.getByTestId('welcome-continue').click();
    await expect(page.getByTestId('builder-shell')).toBeVisible({ timeout: 120_000 });
  });

  test('redirects fresh /builder visits to the welcome page', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => sessionStorage.clear());
    await page.goto('/builder');

    await expect(page.getByTestId('welcome-page')).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId('builder-shell')).toHaveCount(0);
  });

  test('skips welcome when a builder session exists', async ({ page }) => {
    await openBuilderViaWelcome(page);

    await page.goto('/');
    await page.waitForURL('**/builder');
    await expect(page.getByTestId('builder-shell')).toBeVisible({ timeout: 120_000 });
    await expect(page.getByTestId('welcome-page')).toHaveCount(0);
  });
});
