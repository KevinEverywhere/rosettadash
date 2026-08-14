import { render, screen } from '@testing-library/react';
import { MysqlInfra } from './MysqlInfra.js';

describe('MysqlInfra', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<MysqlInfra />);
    expect(screen.getByTestId('rd-mysql')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<MysqlInfra ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
