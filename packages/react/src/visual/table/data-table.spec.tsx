import { render, screen } from '@testing-library/react';
import { DataTable } from './DataTable.js';

describe('DataTable', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<DataTable />);
    expect(screen.getByTestId('rd-table')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<DataTable ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
