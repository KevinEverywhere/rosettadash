import { render, screen } from '@testing-library/react';
import { MongodbInfra } from './MongodbInfra.js';

describe('MongodbInfra', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<MongodbInfra />);
    expect(screen.getByTestId('rd-mongodb')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<MongodbInfra ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
