import type { ExportIR, IRComponent } from '../ir/types';
import type { RoleDefinition } from './domain-context';

export const DEFAULT_ROLE_PRESETS: RoleDefinition[] = [
  { id: 'viewer', name: 'Viewer' },
  { id: 'editor', name: 'Editor' },
  { id: 'admin', name: 'Admin' },
  { id: 'owner', name: 'Owner' },
];

export function parseRoleGateAllowedRoles(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter(Boolean);
}

export function roleGateAllowsRole(allowedRoles: string[], roleId: string): boolean {
  const normalizedRole = roleId.trim();
  if (!normalizedRole) {
    return false;
  }
  return allowedRoles.some((allowed) => allowed === normalizedRole);
}

export function resolveRoleOptions(domainRoles?: RoleDefinition[]): RoleDefinition[] {
  return domainRoles?.length ? domainRoles : DEFAULT_ROLE_PRESETS;
}

export function irHasRoleGates(ir: ExportIR): boolean {
  return ir.components.some((component) => component.type === 'domain.role-gate');
}

export function collectExportRoleIds(ir: ExportIR): string[] {
  const ids = new Set<string>();

  for (const role of ir.domain?.roles ?? []) {
    ids.add(role.id);
  }

  for (const component of ir.components) {
    if (component.type !== 'domain.role-gate') {
      continue;
    }
    for (const roleId of parseRoleGateAllowedRoles(component.properties['roles'])) {
      ids.add(roleId);
    }
  }

  return [...ids];
}

export function visibilityRolesForComponent(component: IRComponent): string[] | undefined {
  if (component.type !== 'domain.role-gate') {
    return undefined;
  }

  const roles = parseRoleGateAllowedRoles(component.properties['roles']);
  return roles.length > 0 ? roles : undefined;
}
