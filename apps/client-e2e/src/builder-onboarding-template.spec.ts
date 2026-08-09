import { test, expect } from '@playwright/test';
import { openBuilder, waitForPreviewData } from './test-helpers';

test.describe('Builder onboarding template', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('applies onboarding template and persists after save and reload', async ({ page }) => {
    await page.getByTestId('apply-onboarding-template').click();

    await expect(page.getByText('5 component(s)')).toBeVisible();
    await expect(page.getByTestId('canvas-node').filter({ hasText: 'Invite person' })).toBeVisible();
    await expect(page.getByTestId('canvas-node').filter({ hasText: 'Assign role' })).toBeVisible();

    await expect(page.getByTestId('save-status')).toContainText('Unsaved');
    await page.getByTestId('save-button').click();
    await expect(page.getByTestId('save-status')).toContainText('Saved');

    await page.reload();
    await expect(page.getByTestId('builder-loading')).toBeHidden({ timeout: 120_000 });
    await expect(page.getByText('5 component(s)')).toBeVisible();
    await expect(page.getByTestId('canvas-node').filter({ hasText: 'Invite person' })).toBeVisible();
  });

  test('shows onboarding preview steps', async ({ page }) => {
    await page.getByTestId('apply-onboarding-template').click();
    await page.getByTestId('mode-preview').click();
    await waitForPreviewData(page);

    await expect(page.getByTestId('preview-person-invite')).toBeVisible();
    await expect(page.getByTestId('preview-role-assign')).toBeVisible();
    await expect(page.getByTestId('preview-person-invite-submit')).toContainText('Send invite');
    await expect(page.getByTestId('preview-role-assign-confirm')).toContainText('Confirm access');
  });
});
