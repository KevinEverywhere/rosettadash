import {
  AccordionLinkList,
  RdAccordionLinkListElement,
  registerRdAccordionLinkList,
  RD_ACCORDION_LINK_LIST_TAG,
} from './rd-accordion-link-list.js';

describe('@rosettadash/web-components/layout/accordion-link-list', () => {
  beforeAll(() => {
    registerRdAccordionLinkList();
  });

  it('registers the recipe custom element', () => {
    expect(customElements.get(RD_ACCORDION_LINK_LIST_TAG)).toBe(
      RdAccordionLinkListElement,
    );
  });

  it('applies AccordionLinkList prop defaults', () => {
    const model = AccordionLinkList({ title: 'Resources' });
    expect(model.title).toBe('Resources');
    expect(model.defaultOpen).toBe(false);
    expect(model.items).toEqual([]);
    expect(model.dense).toBe(false);
  });

  it('renders accordion chrome with links', async () => {
    const el = document.createElement(
      RD_ACCORDION_LINK_LIST_TAG,
    ) as RdAccordionLinkListElement;
    el.setAttribute('title', 'Resources');
    el.setAttribute(
      'items',
      JSON.stringify([{ label: 'Docs', href: '/docs' }]),
    );
    document.body.appendChild(el);
    await el.whenReady();

    expect(el.open).toBe(false);
    const button = el.shadowRoot?.querySelector('button');
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(el.open).toBe(true);
    expect(el.shadowRoot?.querySelector('a')?.getAttribute('href')).toBe(
      '/docs',
    );

    el.remove();
  });
});
