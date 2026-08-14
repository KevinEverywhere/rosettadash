import { render, screen } from '@testing-library/react';
import { NewsLanguageSelect } from './NewsLanguageSelect.js';

describe('NewsLanguageSelect', () => {
  it('renders with taxonomy-aligned BEM root block', () => {
    render(<NewsLanguageSelect />);
    expect(screen.getByTestId('rd-news-language-select')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = { current: null as HTMLElement | null };
    render(<NewsLanguageSelect ref={ref} />);
    expect(ref.current).toBeTruthy();
  });
});
