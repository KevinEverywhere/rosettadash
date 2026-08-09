import { test, expect } from '@playwright/test';
import { openBuilder } from './test-helpers';

test.describe('Builder defaults engine', () => {
  test.beforeEach(async ({ page }) => {
    await openBuilder(page);
  });

  test('shows postgres table suggestion and applies it from the inspector', async ({ page }) => {
    await page.getByTestId('palette-add-infra.postgresql').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(1);

    await expect(page.getByTestId('inspector-suggestions')).toBeVisible();
    const postgresSuggestion = page.locator('[data-testid^="inspector-suggestion-postgres-table:"]');
    await expect(postgresSuggestion).toBeVisible();

    await page.locator('[data-testid^="apply-suggestion-postgres-table:"]').click();

    await expect(page.getByTestId('inspector-prop-table')).toHaveValue('records');
    await expect(postgresSuggestion).toBeHidden();
  });

  test('shows a date-range hint after binding rowset data to a table', async ({ page }) => {
    await page.getByTestId('palette-add-infra.postgresql').click();
    await page.getByTestId('palette-add-visual.table').click();
    await expect(page.getByTestId('canvas-node')).toHaveCount(2);

    const postgresNode = page.getByTestId('canvas-node').nth(0);
    const tableNode = page.getByTestId('canvas-node').nth(1);

    await postgresNode.getByTestId(/^port-output-.*-rowset$/).click();
    await tableNode.getByTestId(/^port-input-.*-data$/).click();

    await tableNode.click();
    await expect(page.getByTestId('inspector-suggestions')).toBeVisible();
    await expect(page.locator('[data-testid^="inspector-suggestion-add-date-range:"]')).toBeVisible();
  });
});
