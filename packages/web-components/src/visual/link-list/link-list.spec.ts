import {
  RdLinkListElement,
  registerRdLinkList,
  RD_LINK_LIST_TAG,
} from './link-list.js';

describe('@rosettadash/web-components/visual/link-list', () => {
  beforeAll(() => {
    registerRdLinkList();
  });

  it('registers the custom element tag', () => {
    expect(customElements.get(RD_LINK_LIST_TAG)).toBe(RdLinkListElement);
  });

  it('renders items from the items attribute', () => {
    const el = document.createElement(RD_LINK_LIST_TAG) as RdLinkListElement;
    el.setAttribute(
      'items',
      JSON.stringify([
        { label: 'Docs', href: '/docs' },
        { label: 'API', href: '/api' },
      ]),
    );
    document.body.appendChild(el);

    const links = el.shadowRoot?.querySelectorAll('a');
    expect(links?.length).toBe(2);
    expect(links?.[0]?.textContent).toBe('Docs');
    expect(links?.[0]?.getAttribute('href')).toBe('/docs');

    el.remove();
  });

  it('defaults to an empty list', () => {
    const el = document.createElement(RD_LINK_LIST_TAG) as RdLinkListElement;
    document.body.appendChild(el);
    expect(el.items).toEqual([]);
    expect(el.shadowRoot?.querySelectorAll('a').length).toBe(0);
    el.remove();
  });
});
