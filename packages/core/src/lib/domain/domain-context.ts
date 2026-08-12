export type TimeRangePreset = 'last-7-days' | 'last-30-days' | 'qtd';

export interface DomainEntityRef {
  id: string;
  name: string;
}

export interface RoleDefinition {
  id: string;
  name: string;
}

export interface DomainContext {
  client?: DomainEntityRef;
  project?: DomainEntityRef;
  defaultTimeRange?: TimeRangePreset;
  roles?: RoleDefinition[];
}

export const TIME_RANGE_PRESET_OPTIONS: Array<{ label: string; value: TimeRangePreset }> = [
  { label: 'Last 7 days', value: 'last-7-days' },
  { label: 'Last 30 days', value: 'last-30-days' },
  { label: 'Quarter to date', value: 'qtd' },
];

export function slugifyDomainId(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export function normalizeDomainContext(context?: DomainContext): DomainContext | undefined {
  if (!context) {
    return undefined;
  }

  const normalized: DomainContext = {};

  if (context.client?.name?.trim()) {
    normalized.client = {
      id: context.client.id?.trim() || slugifyDomainId(context.client.name) || 'client',
      name: context.client.name.trim(),
    };
  }

  if (context.project?.name?.trim()) {
    normalized.project = {
      id: context.project.id?.trim() || slugifyDomainId(context.project.name) || 'project',
      name: context.project.name.trim(),
    };
  }

  if (context.defaultTimeRange) {
    normalized.defaultTimeRange = context.defaultTimeRange;
  }

  if (context.roles?.length) {
    normalized.roles = context.roles
      .filter((role) => role.name.trim())
      .map((role) => ({
        id: role.id?.trim() || slugifyDomainId(role.name) || 'role',
        name: role.name.trim(),
      }));
  }

  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

export function mergeDomainContext(
  current: DomainContext | undefined,
  updates: DomainContext,
): DomainContext | undefined {
  return normalizeDomainContext({
    ...current,
    ...updates,
    client: updates.client ?? current?.client,
    project: updates.project ?? current?.project,
    roles: updates.roles ?? current?.roles,
  });
}
