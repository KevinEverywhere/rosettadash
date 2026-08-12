import { defaultComponentRegistry } from '@rosettadash/core';
import {
  createComponentNameElement,
  RD_COMPONENT_NAME_TAG,
  registerRdComponentName,
} from './component-name/index.js';
import { registerRdAttribute } from './component-attribute/index.js';
import { RD_PALETTE_CATALOG_TAG, registerRdPaletteCatalog } from './palette-catalog/index.js';
import { registerRdPaletteGroup } from './palette-group/index.js';
import { registerRdSubcomponentName } from './subcomponent-name/index.js';

describe('@rosettadash/web-components/catalog', () => {
  beforeAll(() => {
    registerRdAttribute();
    registerRdSubcomponentName();
    registerRdComponentName();
    registerRdPaletteGroup();
    registerRdPaletteCatalog();
  });

  it('registers markup documentation elements', () => {
    expect(customElements.get(RD_COMPONENT_NAME_TAG)).toBeDefined();
    expect(customElements.get('rd-attribute')).toBeDefined();
    expect(customElements.get('rd-subcomponent-name')).toBeDefined();
    expect(customElements.get(RD_PALETTE_CATALOG_TAG)).toBeDefined();
  });

  it('renders required black and optional grey in markup tree', async () => {
    const root = document.createElement('div');
    root.innerHTML = `
<rd-component-name tag="demo-table" label="Demo">
  <rd-attribute name="data" value="rowset" required></rd-attribute>
  <rd-attribute name="filter" value="date-range" optional></rd-attribute>
</rd-component-name>`;
    const el = root.firstElementChild as HTMLElement & { whenReady?: () => Promise<void> };
    document.body.appendChild(el);
    await el.whenReady?.();

    const tree = el.shadowRoot?.querySelector('.rd-markup-tree');
    expect(tree?.innerHTML).toContain('rd-markup-tree__attr--required');
    expect(tree?.innerHTML).toContain('rd-markup-tree__attr--optional');
    expect(tree?.textContent).toContain('required');
    expect(tree?.textContent).toContain('optional');

    el.remove();
  });

  it('builds markup tree from registry definition', async () => {
    const definition = defaultComponentRegistry.getOrThrow('visual.table');
    const el = createComponentNameElement(definition, {});
    document.body.appendChild(el);
    await el.whenReady();

    expect(el.shadowRoot?.textContent).toContain('rd-table');
    expect(el.shadowRoot?.textContent).toContain('data');

    el.remove();
  });
});
