import { render, screen } from '@testing-library/react';
import { PostgresqlInfra } from './PostgresqlInfra.js';

describe('PostgresqlInfra', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<PostgresqlInfra />);
    expect(screen.getByTestId('rd-postgresql')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<PostgresqlInfra ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
