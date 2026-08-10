import {
  collectExportRoleIds,
  parseRoleGateAllowedRoles,
  roleGateAllowsRole,
  visibilityRolesForComponent,
} from './role-visibility';

describe('role visibility helpers', () => {
  it('parses allowed roles from node properties', () => {
    expect(parseRoleGateAllowedRoles(['admin', ' editor ', 42])).toEqual(['admin', 'editor']);
  });

  it('checks whether a role is allowed through a gate', () => {
    expect(roleGateAllowsRole(['admin', 'editor'], 'admin')).toBe(true);
    expect(roleGateAllowsRole(['admin', 'editor'], 'viewer')).toBe(false);
  });

  it('collects export role ids from domain context and role gates', () => {
    expect(
      collectExportRoleIds({
        meta: {
          compositeId: 'c1',
          compositeName: 'Dashboard',
          version: 1,
          generatedAt: '2026-08-08T00:00:00.000Z',
        },
        targets: { ui: 'react', server: 'nest', database: 'postgresql' },
        envVars: [],
        components: [
          {
            id: 'rg1',
            type: 'domain.role-gate',
            label: 'Admin panel',
            category: 'domain',
            properties: { roles: ['admin'] },
            inputs: [],
            outputs: [],
          },
        ],
        layouts: [],
        dataSources: [],
        routes: [],
        events: [],
        styles: { framework: 'neutral' },
        domain: {
          roles: [
            { id: 'viewer', name: 'Viewer' },
            { id: 'admin', name: 'Admin' },
          ],
        },
      }),
    ).toEqual(['viewer', 'admin']);
  });

  it('maps role gate components to visibilityRoles', () => {
    expect(
      visibilityRolesForComponent({
        id: 'rg1',
        type: 'domain.role-gate',
        label: 'Admin panel',
        category: 'domain',
        properties: { roles: ['admin', 'owner'] },
        inputs: [],
        outputs: [],
      }),
    ).toEqual(['admin', 'owner']);
  });
});
