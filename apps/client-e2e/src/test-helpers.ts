import { expect, Page } from '@playwright/test';
import { findPaletteGroupIdForType } from '../../../packages/core/src/lib/palette/palette-groups';

export async function expandPaletteGroup(page: Page, groupId: string): Promise<void> {
  const panel = page.getByTestId(`palette-group-panel-${groupId}`);
  if (await panel.isVisible().catch(() => false)) {
    return;
  }
  await page.getByTestId(`palette-group-toggle-${groupId}`).click();
  await expect(panel).toBeVisible();
}

export async function expandPaletteGroupForType(page: Page, type: string): Promise<void> {
  const groupId = findPaletteGroupIdForType(type);
  if (!groupId) {
    throw new Error(`No palette group registered for type: ${type}`);
  }
  await expandPaletteGroup(page, groupId);
}

export async function addFromPalette(page: Page, type: string): Promise<void> {
  await expandPaletteGroupForType(page, type);
  await page.getByTestId(`palette-add-${type}`).click();
}

export async function openPaletteInfo(page: Page, type: string): Promise<void> {
  await expandPaletteGroupForType(page, type);
  await page.getByTestId(`palette-info-${type}`).click();
}

export async function openPaletteLink(page: Page, type: string): Promise<void> {
  await expandPaletteGroupForType(page, type);
  await page.getByTestId(`palette-link-${type}`).click();
}

export async function dismissPlacementPromptIfVisible(page: Page): Promise<void> {
  const prompt = page.getByTestId('canvas-placement-prompt');
  const dismiss = page.getByTestId('canvas-placement-dismiss');
  if (!(await prompt.isVisible().catch(() => false))) {
    return;
  }
  await dismiss.click({ timeout: 3000 }).catch(() => undefined);
  await expect(prompt).toBeHidden({ timeout: 3000 }).catch(() => undefined);
}

export async function selectCanvasNode(
  page: Page,
  node: ReturnType<Page['getByTestId']>,
  options?: { shiftKey?: boolean },
): Promise<void> {
  await selectCanvasNodeHeader(page, node, options);
}

export async function selectCanvasNodeHeader(
  page: Page,
  node: ReturnType<Page['getByTestId']>,
  options?: { shiftKey?: boolean },
): Promise<void> {
  const header = node.locator('.canvas__node-header');
  if (options?.shiftKey) {
    await page.keyboard.down('Shift');
    try {
      await header.click();
    } finally {
      await page.keyboard.up('Shift');
    }
    return;
  }
  await header.click();
}

export async function openBuilder(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
  await page.goto('/builder');
  await expect(page.getByTestId('builder-loading')).toBeHidden({ timeout: 120_000 });
  await expect(page.getByTestId('builder-shell')).toBeVisible();
  await expect(page.getByTestId('palette')).toBeVisible({ timeout: 30_000 });
}

export async function openBuilderViaStackSetup(page: Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(() => sessionStorage.clear());
  await page.reload();
  await expect(page.getByTestId('stack-setup')).toBeVisible();
  await page.getByTestId('stack-setup-continue').click();
  await expect(page.getByTestId('builder-loading')).toBeHidden({ timeout: 120_000 });
  await expect(page.getByTestId('builder-shell')).toBeVisible();
  await expect(page.getByTestId('palette')).toBeVisible({ timeout: 30_000 });
}

export async function waitForPreviewData(page: Page): Promise<void> {
  await expect(page.getByTestId('preview-loading')).toBeHidden({ timeout: 30_000 });
  await expect(page.getByTestId('preview-data-source')).toBeVisible();
}
