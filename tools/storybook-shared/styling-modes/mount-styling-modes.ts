import type { StorybookRuntimeId } from '../storybook-runtime-catalogs.js';
import { stylingModesCopy } from './styling-modes-content.js';

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const NAV_ITEMS = [
  { label: 'Introduction', href: '#intro' },
  { label: 'API reference', href: '#api' },
  { label: 'Examples', href: '#examples' },
] as const;

function renderDemoAccordion(): string {
  const links = NAV_ITEMS.map(
    (item) =>
      `<li class="rd-link-list__item"><a class="rd-link-list__link" href="${esc(item.href)}">${esc(item.label)}</a></li>`,
  ).join('');

  return `<section class="rd-accordion rd-accordion--open">
    <button type="button" class="rd-accordion__header" aria-expanded="true">
      Resources
      <span class="rd-accordion__chevron" aria-hidden="true">›</span>
    </button>
    <div class="rd-accordion__panel">
      <ul class="rd-link-list">${links}</ul>
    </div>
  </section>`;
}

function renderModeColumn(options: {
  badge: string;
  title: string;
  description: string;
  importSnippet: string;
  demoClassName?: string;
  featured?: boolean;
  footer?: string;
}): string {
  const { badge, title, description, importSnippet, demoClassName, featured, footer } = options;
  const demoClasses = ['rd-styling-modes__demo', demoClassName].filter(Boolean).join(' ');

  return `<article class="rd-styling-modes__column${featured ? ' rd-styling-modes__column--featured' : ''}">
    <span class="rd-styling-modes__badge">${esc(badge)}</span>
    <h2 class="rd-styling-modes__column-title">${esc(title)}</h2>
    <p class="rd-styling-modes__column-desc">${esc(description)}</p>
    <pre class="rd-styling-modes__import">${esc(importSnippet)}</pre>
    <div class="${demoClasses}">
      <p class="rd-styling-modes__demo-label">Live preview</p>
      ${renderDemoAccordion()}
      ${footer ?? ''}
    </div>
  </article>`;
}

function wireDemoAccordions(root: HTMLElement): void {
  root.querySelectorAll<HTMLButtonElement>('.rd-styling-modes__demo .rd-accordion__header').forEach(
    (header) => {
      header.addEventListener('click', () => {
        const section = header.closest('.rd-accordion');
        if (!section) {
          return;
        }
        const open = section.classList.toggle('rd-accordion--open');
        header.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    },
  );
}

/** Side-by-side styling modes page — shared across all Storybook runtimes. */
export function mountStylingModesPage(runtimeId: StorybookRuntimeId = 'web-components'): HTMLElement {
  const copy = stylingModesCopy(runtimeId);
  const root = document.createElement('article');
  root.className = 'rd-styling-modes';

  const stackCards = copy.stacks
    .map(
      (stack) =>
        `<article class="rd-styling-modes__stack-card">
          <h3>${esc(stack.title)}</h3>
          <p>${esc(stack.body)}</p>
        </article>`,
    )
    .join('');

  const checklist = [
    'Pick <strong>minimal</strong>, <strong>tokens</strong>, or <strong>themed</strong> — you can migrate later without changing component APIs.',
    'If you skip <code>styles.css</code>, add panel visibility rules for accordion (<code>.rd-accordion__panel</code> display toggle).',
    copy.checklistHostLine,
    'Keep <code>rd-*</code> classnames stable — style them, don&apos;t rename them in forks.',
  ]
    .map((item) => `<li>${item}</li>`)
    .join('');

  root.innerHTML = `
    <header class="rd-styling-modes__hero">
      <p class="rd-styling-modes__eyebrow">${esc(copy.eyebrow)}</p>
      <h1 class="rd-styling-modes__title">Choose how RosettaDash looks in your app</h1>
      <p class="rd-styling-modes__lede">
        Components ship with stable <code>rd-*</code> classnames — the same contract as custom
        elements and builder exports. Start with the themed stylesheet, switch to tokens when you
        want full control, or bring CSS you already use.
      </p>
    </header>

    <section class="rd-styling-modes__compare" aria-label="Styling mode comparison">
      ${renderModeColumn({
        badge: 'Structure only',
        title: 'Minimal',
        description:
          'Markup and behavior only. You supply every visual rule — or map classes in your existing stack.',
        importSnippet: copy.minimalImport,
        demoClassName: 'rd-styling-modes__demo--minimal',
        footer: `<ul class="rd-styling-modes__class-pills" aria-label="Stable classnames">
          <li>.rd-accordion</li>
          <li>.rd-link-list__link</li>
        </ul>`,
      })}
      ${renderModeColumn({
        badge: 'Design tokens',
        title: 'Tokens',
        description:
          'Import CSS variables once, then style rd-* blocks to match your brand. Ideal when you already have a design system.',
        importSnippet: copy.tokensImport,
        demoClassName: 'rd-styling-modes__demo--tokens',
      })}
      ${renderModeColumn({
        badge: 'Recommended to start',
        title: 'Themed default',
        description:
          'Drop-in look that matches Storybook and web components. Override a few --rd-* tokens to rebrand.',
        importSnippet: copy.themedImport,
        featured: true,
      })}
    </section>

    <section class="rd-styling-modes__section">
      <h2 class="rd-styling-modes__section-title">Works with stacks you already use</h2>
      <p class="rd-styling-modes__lede">${esc(copy.stacksIntro)}</p>
      <div class="rd-styling-modes__stacks">${stackCards}</div>
      <p class="rd-styling-modes__footnote">
        Full recipes: <code>docs/41-stack-styling-guides.md</code> in the repo.
        Host attribute for layout: <code>${esc(copy.hostProp)}</code>.
      </p>
    </section>

    <section class="rd-styling-modes__section">
      <h2 class="rd-styling-modes__section-title">Quick integration checklist</h2>
      <ol class="rd-styling-modes__checklist">${checklist}</ol>
    </section>
  `;

  wireDemoAccordions(root);
  return root;
}
