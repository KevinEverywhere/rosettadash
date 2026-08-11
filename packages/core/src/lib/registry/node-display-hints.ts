/** Read human-facing subtitle copy stored on node properties (builder + preview). */
export function readNodeDisplaySubtitle(
  properties: Record<string, unknown> | undefined,
): string | undefined {
  const value = properties?.['subtitle'] ?? properties?.['hint'];
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/** Data source label shown when live/API data is not wired yet. */
export function readNodeDisplayDataSource(
  properties: Record<string, unknown> | undefined,
): string | undefined {
  const value = properties?.['dataSource'] ?? properties?.['dataSourceLabel'];
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
