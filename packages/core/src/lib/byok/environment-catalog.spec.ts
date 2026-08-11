import {
  ENVIRONMENT_FIELD_CATALOG,
  getAiProvider,
  groupEnvironmentFieldsByCategory,
  resolveEnvironmentFieldsForStack,
} from './index';

describe('environment-catalog', () => {
  it('includes builder and AI provider fields', () => {
    expect(ENVIRONMENT_FIELD_CATALOG.some((field) => field.envKey === 'ROSETTADASH_API_KEY')).toBe(
      true,
    );
    expect(ENVIRONMENT_FIELD_CATALOG.some((field) => field.envKey === 'OPENAI_API_KEY')).toBe(true);
  });

  it('filters database fields by stack', () => {
    const pgFields = resolveEnvironmentFieldsForStack({ server: 'nest', database: 'postgresql' });
    expect(pgFields.some((field) => field.envKey === 'DATABASE_URL')).toBe(true);
    expect(pgFields.some((field) => field.envKey === 'MONGODB_URI')).toBe(false);
  });

  it('groups fields by category in stable order', () => {
    const fields = resolveEnvironmentFieldsForStack({ server: 'nest', database: 'postgresql' });
    const groups = groupEnvironmentFieldsByCategory(fields);
    expect(groups[0]?.category).toBe('builder');
    expect(groups.some((group) => group.category === 'database')).toBe(true);
  });

  it('exposes provider manifest entries', () => {
    const openai = getAiProvider('openai');
    expect(openai.apiKeyEnvKey).toBe('OPENAI_API_KEY');
    expect(openai.models.length).toBeGreaterThan(0);
  });
});
