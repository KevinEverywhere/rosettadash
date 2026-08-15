import type { StackProfile } from '../model/types';
import { AI_PROVIDER_MANIFEST } from './provider-manifest';
import type { EnvConfigCategory, EnvFieldDefinition } from './types';

const DATABASE_FIELDS: EnvFieldDefinition[] = [
  {
    id: 'db-postgresql',
    envKey: 'DATABASE_URL',
    label: 'PostgreSQL connection URL',
    description: 'Connection string for PostgreSQL (used by infra.postgresql and exports).',
    category: 'database',
    sensitive: true,
    placeholder: 'postgresql://user:pass@localhost:5432/mydb',
    showWhen: { database: 'postgresql' },
  },
  {
    id: 'db-mongodb',
    envKey: 'MONGODB_URI',
    label: 'MongoDB connection URI',
    description: 'MongoDB connection string for infra.mongodb nodes and server exporters.',
    category: 'database',
    sensitive: true,
    placeholder: 'mongodb://localhost:27017/mydb',
    showWhen: { database: 'mongodb' },
  },
  {
    id: 'db-supabase-url',
    envKey: 'SUPABASE_URL',
    label: 'Supabase project URL',
    description: 'Your Supabase project URL.',
    category: 'database',
    sensitive: false,
    placeholder: 'https://xyzcompany.supabase.co',
    showWhen: { database: 'supabase' },
  },
  {
    id: 'db-supabase-anon',
    envKey: 'SUPABASE_ANON_KEY',
    label: 'Supabase anon key',
    description: 'Public anon key for Supabase client SDK.',
    category: 'database',
    sensitive: true,
    showWhen: { database: 'supabase' },
  },
  {
    id: 'db-mysql',
    envKey: 'MYSQL_URL',
    label: 'MySQL connection URL',
    description: 'MySQL connection string for infra.mysql nodes.',
    category: 'database',
    sensitive: true,
    placeholder: 'mysql://user:pass@localhost:3306/mydb',
    showWhen: { database: 'mysql' },
  },
];

const SERVER_FIELDS: EnvFieldDefinition[] = [
  {
    id: 'server-port',
    envKey: 'PORT',
    label: 'Server port',
    description: 'HTTP port for exported API servers.',
    category: 'server',
    sensitive: false,
    placeholder: '3000',
    showWhen: { server: ['nest', 'express', 'next', 'nuxt'] },
    optional: true,
  },
  {
    id: 'server-api-prefix',
    envKey: 'API_PREFIX',
    label: 'API route prefix',
    description: 'Global prefix for REST routes (matches infra.server.* globalPrefix).',
    category: 'server',
    sensitive: false,
    placeholder: 'api',
    showWhen: { server: ['nest', 'express', 'next', 'nuxt'] },
    optional: true,
  },
  {
    id: 'server-jwt-secret',
    envKey: 'JWT_SECRET',
    label: 'JWT signing secret',
    description: 'Secret for signing auth tokens in exported server stubs.',
    category: 'auth',
    sensitive: true,
    showWhen: { server: ['nest', 'express', 'next', 'nuxt'] },
    optional: true,
  },
  {
    id: 'server-cors-origin',
    envKey: 'CORS_ORIGIN',
    label: 'CORS allowed origin',
    description: 'Allowed browser origin for API requests.',
    category: 'server',
    sensitive: false,
    placeholder: 'http://localhost:4200',
    showWhen: { server: ['nest', 'express', 'next', 'nuxt'] },
    optional: true,
  },
];

const BUILDER_FIELDS: EnvFieldDefinition[] = [
  {
    id: 'builder-api-key',
    envKey: 'ROSETTADASH_API_KEY',
    label: 'Shared builder API key (advanced)',
    description:
      'Only when your local NestJS API has BUILDER_AUTH_ENABLED for shared/deployed installs — not the app lock password.',
    category: 'builder',
    sensitive: true,
    optional: true,
  },
];

function buildAiFields(): EnvFieldDefinition[] {
  const fields: EnvFieldDefinition[] = [];

  for (const provider of AI_PROVIDER_MANIFEST) {
    if (provider.requiresApiKey) {
      fields.push({
        id: `ai-${provider.id}-key`,
        envKey: provider.apiKeyEnvKey,
        label: `${provider.label} API key`,
        description: provider.description,
        category: 'ai',
        sensitive: true,
        aiProviderId: provider.id,
      });
    }

    if (provider.supportsCustomBaseUrl) {
      fields.push({
        id: `ai-${provider.id}-base-url`,
        envKey: `${provider.id.toUpperCase().replace(/-/g, '_')}_BASE_URL`,
        label: `${provider.label} base URL`,
        description: 'Override for proxies, Azure, or local Ollama.',
        category: 'ai',
        sensitive: false,
        placeholder: provider.defaultBaseUrl,
        aiProviderId: provider.id,
        optional: true,
      });
    }
  }

  fields.push({
    id: 'ai-azure-resource',
    envKey: 'AZURE_OPENAI_RESOURCE_NAME',
    label: 'Azure OpenAI resource name',
    description: 'Azure resource name for deployment URL construction.',
    category: 'ai',
    sensitive: false,
    aiProviderId: 'azure-openai',
    optional: true,
  });

  fields.push({
    id: 'ai-azure-deployment',
    envKey: 'AZURE_OPENAI_DEPLOYMENT_ID',
    label: 'Azure OpenAI deployment ID',
    description: 'Deployment id for chat completions.',
    category: 'ai',
    sensitive: false,
    aiProviderId: 'azure-openai',
    optional: true,
  });

  return fields;
}

export const ENVIRONMENT_FIELD_CATALOG: EnvFieldDefinition[] = [
  ...BUILDER_FIELDS,
  ...DATABASE_FIELDS,
  ...SERVER_FIELDS,
  ...buildAiFields(),
];

export const ENV_CONFIG_CATEGORY_LABELS: Record<EnvConfigCategory, string> = {
  builder: 'RosettaDash access',
  database: 'Database',
  server: 'Server',
  ai: 'AI providers (BYOK)',
  auth: 'Authentication & authorization',
  integration: 'App integrations (BYOK)',
  custom: 'Custom variables',
};

function matchesStackChoice<T extends string>(
  choice: T | undefined,
  allowed: T | T[] | undefined,
): boolean {
  if (!allowed) {
    return true;
  }
  if (!choice || choice === 'none') {
    return false;
  }
  const list = Array.isArray(allowed) ? allowed : [allowed];
  return list.includes(choice);
}

export function resolveEnvironmentFieldsForStack(
  stack: Pick<StackProfile, 'server' | 'database'> | undefined,
  options?: { includeAllAi?: boolean; activeAiProvider?: string },
): EnvFieldDefinition[] {
  const server = stack?.server;
  const database = stack?.database;
  const includeAllAi = options?.includeAllAi ?? true;
  const activeAiProvider = options?.activeAiProvider;

  return ENVIRONMENT_FIELD_CATALOG.filter((field) => {
    if (field.category === 'ai') {
      if (!includeAllAi && field.aiProviderId && field.aiProviderId !== activeAiProvider) {
        return field.id.endsWith('-key') ? false : field.aiProviderId === activeAiProvider;
      }
      return true;
    }

    if (field.showWhen?.database && !matchesStackChoice(database, field.showWhen.database)) {
      return false;
    }

    if (field.showWhen?.server && !matchesStackChoice(server, field.showWhen.server)) {
      return false;
    }

    return true;
  });
}

export function groupEnvironmentFieldsByCategory(
  fields: EnvFieldDefinition[],
): Array<{ category: EnvConfigCategory; label: string; fields: EnvFieldDefinition[] }> {
  const order: EnvConfigCategory[] = ['builder', 'database', 'server', 'auth', 'ai', 'integration', 'custom'];
  const grouped = new Map<EnvConfigCategory, EnvFieldDefinition[]>();

  for (const field of fields) {
    const list = grouped.get(field.category) ?? [];
    list.push(field);
    grouped.set(field.category, list);
  }

  return order
    .filter((category) => grouped.has(category))
    .map((category) => ({
      category,
      label: ENV_CONFIG_CATEGORY_LABELS[category],
      fields: grouped.get(category) ?? [],
    }));
}
