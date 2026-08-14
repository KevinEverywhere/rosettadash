import { render, screen } from '@testing-library/react';
import { SupabaseInfra } from './SupabaseInfra.js';

describe('SupabaseInfra', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<SupabaseInfra />);
    expect(screen.getByTestId('rd-supabase')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<SupabaseInfra ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
