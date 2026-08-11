import type { DomainContext, TimeRangePreset } from './domain-context';

export interface QueryScope {
  clientId?: string;
  projectId?: string;
  rangeStart?: string;
  rangeEnd?: string;
}

export const DEFAULT_SCOPE_COLUMNS = {
  clientId: 'client_id',
  projectId: 'project_id',
  createdAt: 'created_at',
} as const;

export const QUERY_SCOPE_ENV_KEYS = {
  clientId: 'ROSETTADASH_CLIENT_ID',
  projectId: 'ROSETTADASH_PROJECT_ID',
  rangeStart: 'ROSETTADASH_RANGE_START',
  rangeEnd: 'ROSETTADASH_RANGE_END',
} as const;

const PRESET_DAY_COUNT: Record<TimeRangePreset, number> = {
  'last-7-days': 7,
  'last-30-days': 30,
  qtd: 90,
};

export function formatScopeDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function resolveQueryScope(
  domain?: DomainContext,
  referenceDate: Date = new Date(),
): QueryScope | undefined {
  if (!domain) {
    return undefined;
  }

  const scope: QueryScope = {};

  if (domain.client?.id?.trim()) {
    scope.clientId = domain.client.id.trim();
  }

  if (domain.project?.id?.trim()) {
    scope.projectId = domain.project.id.trim();
  }

  if (domain.defaultTimeRange) {
    const end = new Date(referenceDate);
    const start = new Date(referenceDate);
    const dayCount = PRESET_DAY_COUNT[domain.defaultTimeRange] ?? PRESET_DAY_COUNT['last-7-days'];
    start.setDate(end.getDate() - dayCount);
    scope.rangeStart = formatScopeDate(start);
    scope.rangeEnd = formatScopeDate(end);
  }

  return hasQueryScope(scope) ? scope : undefined;
}

export function hasQueryScope(scope?: QueryScope): boolean {
  if (!scope) {
    return false;
  }

  return Boolean(scope.clientId || scope.projectId || scope.rangeStart || scope.rangeEnd);
}

export interface PostgresScopeClause {
  sql: string;
  params: string[];
}

export function buildPostgresScopeClause(
  scope: QueryScope,
  paramStartIndex = 2,
): PostgresScopeClause {
  const parts: string[] = [];
  const params: string[] = [];
  let index = paramStartIndex;

  if (scope.clientId) {
    parts.push(`${DEFAULT_SCOPE_COLUMNS.clientId} = $${index}`);
    params.push(scope.clientId);
    index += 1;
  }

  if (scope.projectId) {
    parts.push(`${DEFAULT_SCOPE_COLUMNS.projectId} = $${index}`);
    params.push(scope.projectId);
    index += 1;
  }

  if (scope.rangeStart) {
    parts.push(`${DEFAULT_SCOPE_COLUMNS.createdAt} >= $${index}`);
    params.push(scope.rangeStart);
    index += 1;
  }

  if (scope.rangeEnd) {
    parts.push(`${DEFAULT_SCOPE_COLUMNS.createdAt} <= $${index}`);
    params.push(scope.rangeEnd);
  }

  return {
    sql: parts.length > 0 ? ` AND ${parts.join(' AND ')}` : '',
    params,
  };
}

export function buildMongoScopeFilter(scope: QueryScope): Record<string, unknown> {
  const filter: Record<string, unknown> = {};

  if (scope.clientId) {
    filter[DEFAULT_SCOPE_COLUMNS.clientId] = scope.clientId;
  }

  if (scope.projectId) {
    filter[DEFAULT_SCOPE_COLUMNS.projectId] = scope.projectId;
  }

  if (scope.rangeStart || scope.rangeEnd) {
    const createdAt: Record<string, string> = {};
    if (scope.rangeStart) {
      createdAt['$gte'] = scope.rangeStart;
    }
    if (scope.rangeEnd) {
      createdAt['$lte'] = scope.rangeEnd;
    }
    filter[DEFAULT_SCOPE_COLUMNS.createdAt] = createdAt;
  }

  return filter;
}

export function generateScopeModuleSource(scope: QueryScope): string {
  const lines = [
    `export interface QueryScope {`,
    `  clientId?: string;`,
    `  projectId?: string;`,
    `  rangeStart?: string;`,
    `  rangeEnd?: string;`,
    `}`,
    ``,
    `export const DEFAULT_QUERY_SCOPE: QueryScope = {`,
  ];

  if (scope.clientId) {
    lines.push(`  clientId: '${scope.clientId.replace(/'/g, "\\'")}',`);
  }
  if (scope.projectId) {
    lines.push(`  projectId: '${scope.projectId.replace(/'/g, "\\'")}',`);
  }
  if (scope.rangeStart) {
    lines.push(`  rangeStart: '${scope.rangeStart}',`);
  }
  if (scope.rangeEnd) {
    lines.push(`  rangeEnd: '${scope.rangeEnd}',`);
  }

  lines.push(
    `};`,
    ``,
    `export function resolveRuntimeScope(): QueryScope {`,
    `  return {`,
    `    clientId: process.env['${QUERY_SCOPE_ENV_KEYS.clientId}'] ?? DEFAULT_QUERY_SCOPE.clientId,`,
    `    projectId: process.env['${QUERY_SCOPE_ENV_KEYS.projectId}'] ?? DEFAULT_QUERY_SCOPE.projectId,`,
    `    rangeStart: process.env['${QUERY_SCOPE_ENV_KEYS.rangeStart}'] ?? DEFAULT_QUERY_SCOPE.rangeStart,`,
    `    rangeEnd: process.env['${QUERY_SCOPE_ENV_KEYS.rangeEnd}'] ?? DEFAULT_QUERY_SCOPE.rangeEnd,`,
    `  };`,
    `}`,
    ``,
    `export function hasScopeFilters(scope: QueryScope): boolean {`,
    `  return Boolean(scope.clientId || scope.projectId || scope.rangeStart || scope.rangeEnd);`,
    `}`,
    ``,
  );

  return lines.join('\n');
}

export function scopeEnvExampleLines(): string[] {
  return [
    `# Optional domain scope overrides (from RosettaDash export)`,
    `${QUERY_SCOPE_ENV_KEYS.clientId}=`,
    `${QUERY_SCOPE_ENV_KEYS.projectId}=`,
    `${QUERY_SCOPE_ENV_KEYS.rangeStart}=`,
    `${QUERY_SCOPE_ENV_KEYS.rangeEnd}=`,
  ];
}

export function resolveExportQueryScope(
  domain: DomainContext | undefined,
  generatedAt: string,
): QueryScope | undefined {
  return resolveQueryScope(domain, new Date(generatedAt));
}

export function scopedPostgresListRowsLines(options: {
  queryReceiver: string;
  quoteIdentifierRef?: string;
  indent?: string;
}): string[] {
  const indent = options.indent ?? '  ';
  const i2 = `${indent}  `;
  const quoteRef = options.quoteIdentifierRef ?? 'quoteIdentifier';
  return [
    `${indent}const scope = resolveRuntimeScope();`,
    `${indent}const params: unknown[] = [limit];`,
    `${indent}let where = '';`,
    `${indent}if (scope.clientId) {`,
    `${i2}params.push(scope.clientId);`,
    `${i2}where += \` AND ${DEFAULT_SCOPE_COLUMNS.clientId} = $\${params.length}\`;`,
    `${indent}}`,
    `${indent}if (scope.projectId) {`,
    `${i2}params.push(scope.projectId);`,
    `${i2}where += \` AND ${DEFAULT_SCOPE_COLUMNS.projectId} = $\${params.length}\`;`,
    `${indent}}`,
    `${indent}if (scope.rangeStart) {`,
    `${i2}params.push(scope.rangeStart);`,
    `${i2}where += \` AND ${DEFAULT_SCOPE_COLUMNS.createdAt} >= $\${params.length}\`;`,
    `${indent}}`,
    `${indent}if (scope.rangeEnd) {`,
    `${i2}params.push(scope.rangeEnd);`,
    `${i2}where += \` AND ${DEFAULT_SCOPE_COLUMNS.createdAt} <= $\${params.length}\`;`,
    `${indent}}`,
    `${indent}const result = await ${options.queryReceiver}.query(`,
    `${i2}\`SELECT * FROM \${${quoteRef}(tableName)} WHERE 1=1\${where} ORDER BY 1 LIMIT $1\`,`,
    `${i2}params,`,
    `${indent});`,
    `${indent}return result.rows;`,
  ];
}

export function scopedMongoListDocumentsLines(options: { indent?: string }): string[] {
  const indent = options.indent ?? '  ';
  const i2 = `${indent}  `;
  return [
    `${indent}const scope = resolveRuntimeScope();`,
    `${indent}const filter: Record<string, unknown> = {};`,
    `${indent}if (scope.clientId) {`,
    `${i2}filter['${DEFAULT_SCOPE_COLUMNS.clientId}'] = scope.clientId;`,
    `${indent}}`,
    `${indent}if (scope.projectId) {`,
    `${i2}filter['${DEFAULT_SCOPE_COLUMNS.projectId}'] = scope.projectId;`,
    `${indent}}`,
    `${indent}if (scope.rangeStart || scope.rangeEnd) {`,
    `${i2}const createdAt: Record<string, string> = {};`,
    `${i2}if (scope.rangeStart) {`,
    `${i2}  createdAt['$gte'] = scope.rangeStart;`,
    `${i2}}`,
    `${i2}if (scope.rangeEnd) {`,
    `${i2}  createdAt['$lte'] = scope.rangeEnd;`,
    `${i2}}`,
    `${i2}filter['${DEFAULT_SCOPE_COLUMNS.createdAt}'] = createdAt;`,
    `${indent}}`,
    `${indent}const db = client.db();`,
    `${indent}const cursor = db.collection(collectionName).find(filter).limit(limit);`,
    `${indent}return cursor.toArray();`,
  ];
}

export function scopedSupabaseListRowsLines(options: { indent?: string }): string[] {
  const indent = options.indent ?? '  ';
  const i2 = `${indent}  `;
  return [
    `${indent}const scope = resolveRuntimeScope();`,
    `${indent}let query = client.from(tableName).select('*');`,
    `${indent}if (scope.clientId) {`,
    `${i2}query = query.eq('${DEFAULT_SCOPE_COLUMNS.clientId}', scope.clientId);`,
    `${indent}}`,
    `${indent}if (scope.projectId) {`,
    `${i2}query = query.eq('${DEFAULT_SCOPE_COLUMNS.projectId}', scope.projectId);`,
    `${indent}}`,
    `${indent}if (scope.rangeStart) {`,
    `${i2}query = query.gte('${DEFAULT_SCOPE_COLUMNS.createdAt}', scope.rangeStart);`,
    `${indent}}`,
    `${indent}if (scope.rangeEnd) {`,
    `${i2}query = query.lte('${DEFAULT_SCOPE_COLUMNS.createdAt}', scope.rangeEnd);`,
    `${indent}}`,
    `${indent}const { data, error } = await query.limit(limit);`,
    `${indent}if (error) {`,
    `${i2}throw error;`,
    `${indent}}`,
    `${indent}return (data ?? []) as Record<string, unknown>[];`,
  ];
}

export function scopedMysqlListRowsLines(options: { indent?: string }): string[] {
  const indent = options.indent ?? '  ';
  const i2 = `${indent}  `;
  return [
    `${indent}const scope = resolveRuntimeScope();`,
    `${indent}const params: unknown[] = [];`,
    `${indent}const parts: string[] = [];`,
    `${indent}if (scope.clientId) {`,
    `${i2}parts.push('${DEFAULT_SCOPE_COLUMNS.clientId} = ?');`,
    `${i2}params.push(scope.clientId);`,
    `${indent}}`,
    `${indent}if (scope.projectId) {`,
    `${i2}parts.push('${DEFAULT_SCOPE_COLUMNS.projectId} = ?');`,
    `${i2}params.push(scope.projectId);`,
    `${indent}}`,
    `${indent}if (scope.rangeStart) {`,
    `${i2}parts.push('${DEFAULT_SCOPE_COLUMNS.createdAt} >= ?');`,
    `${i2}params.push(scope.rangeStart);`,
    `${indent}}`,
    `${indent}if (scope.rangeEnd) {`,
    `${i2}parts.push('${DEFAULT_SCOPE_COLUMNS.createdAt} <= ?');`,
    `${i2}params.push(scope.rangeEnd);`,
    `${indent}}`,
    `${indent}const where = parts.length > 0 ? \` WHERE \${parts.join(' AND ')}\` : '';`,
    `${indent}params.push(limit);`,
    `${indent}const [rows] = await pool.query(`,
    `${i2}\`SELECT * FROM \\\`\${tableName}\\\`\${where} LIMIT ?\`,`,
    `${i2}params,`,
    `${indent});`,
    `${indent}return rows as Record<string, unknown>[];`,
  ];
}

export function appendScopeEnvLines(lines: string[], scope?: QueryScope): string[] {
  if (!hasQueryScope(scope)) {
    return lines;
  }
  return [...lines, '', ...scopeEnvExampleLines()];
}
