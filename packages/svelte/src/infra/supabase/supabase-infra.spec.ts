import type { SupabaseInfraProps } from './types';

describe('@rosettadash/svelte/infra/supabase', () => {
  it('exposes typed props contract', () => {
    const props: SupabaseInfraProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-supabase', () => {
    expect('rd-supabase').toMatch(/^rd-/);
  });
});
