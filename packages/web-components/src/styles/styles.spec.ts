import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const stylesDir = join(__dirname);

describe('@rosettadash/web-components styles', () => {
  it('ships --rd-* tokens without --db-* in the public contract', () => {
    const tokens = readFileSync(join(stylesDir, 'tokens.css'), 'utf8');
    expect(tokens).toContain('--rd-color-text');
    expect(tokens).toContain('--rd-color-accent');
    expect(tokens).not.toContain('--db-');
  });

  it('opt-in styles.css imports tokens and styles rd-accordion / rd-link-list', () => {
    const styles = readFileSync(join(stylesDir, 'styles.css'), 'utf8');
    expect(styles).toContain("@import './tokens.css'");
    expect(styles).toContain('.rd-accordion');
    expect(styles).toContain('.rd-link-list');
    expect(styles).not.toContain('body {');
    expect(styles).not.toContain('--db-');
  });
});
