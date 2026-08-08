import { expect, Page } from '@playwright/test';

export async function openBuilder(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await expect(page.getByTestId('builder-loading')).toBeHidden({ timeout: 120_000 });
  await expect(page.getByTestId('builder-shell')).toBeVisible();
}

export async function waitForPreviewData(page: Page): Promise<void> {
  await expect(page.getByTestId('preview-loading')).toBeHidden({ timeout: 30_000 });
  await expect(page.getByTestId('preview-data-source')).toBeVisible();
}
