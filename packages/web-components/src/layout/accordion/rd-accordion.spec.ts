import { RdAccordionElement, registerRdAccordion, RD_ACCORDION_TAG } from './rd-accordion.js';

describe('@rosettadash/web-components/layout/accordion', () => {
  beforeAll(() => {
    registerRdAccordion();
  });

  it('registers the custom element tag', () => {
    expect(customElements.get(RD_ACCORDION_TAG)).toBe(RdAccordionElement);
  });

  it('defaults closed and toggles open', async () => {
    const el = document.createElement(RD_ACCORDION_TAG) as RdAccordionElement;
    el.setAttribute('heading', 'Resources');
    document.body.appendChild(el);
    await el.whenReady();

    expect(el.open).toBe(false);
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-expanded')).toBe('false');

    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await el.whenReady();
    expect(el.open).toBe(true);
    expect(el.shadowRoot?.querySelector('.rd-accordion--open')).not.toBeNull();

    el.remove();
  });

  it('honors default-open', async () => {
    const el = document.createElement(RD_ACCORDION_TAG) as RdAccordionElement;
    el.setAttribute('heading', 'Open');
    el.setAttribute('default-open', '');
    document.body.appendChild(el);
    await el.whenReady();

    expect(el.open).toBe(true);
    el.remove();
  });
});
