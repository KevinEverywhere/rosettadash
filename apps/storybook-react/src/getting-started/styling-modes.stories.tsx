import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion } from '@rosettadash/react/layout/accordion';

const items = [
  { label: 'Introduction', href: '#intro' },
  { label: 'API', href: '#api' },
];

const meta: Meta = {
  title: 'Getting Started/Styling modes',
  parameters: {
    docs: {
      description: {
        component:
          'Compare **minimal** (structure only), **tokens** (`--rd-*` variables), and **themed** (full `styles.css`, loaded globally in this Storybook). See docs/41-stack-styling-guides.md.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

function SampleAccordion({ label }: { label: string }) {
  return (
    <Accordion title={label} defaultOpen>
      <ul className="rd-link-list">
        {items.map((item) => (
          <li className="rd-link-list__item" key={item.href}>
            <a className="rd-link-list__link" href={item.href}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </Accordion>
  );
}

export const ThemedDefault: Story = {
  name: 'Themed (Storybook default)',
  render: () => (
    <div className="rd-story-stack">
      <p style={{ margin: 0, fontSize: '0.875rem' }}>
        Global preview imports <code>tokens.css</code> + <code>styles.css</code> — matches
        custom-element chrome.
      </p>
      <SampleAccordion label="Resources" />
    </div>
  ),
};

export const MinimalStructure: Story = {
  name: 'Minimal (no extra CSS)',
  render: () => (
    <div className="rd-story-stack" data-styling-mode="minimal">
      <p style={{ margin: 0, fontSize: '0.875rem' }}>
        Unstyled structure: <code>rd-*</code> classnames only. Host app supplies all rules.
      </p>
      <div
        style={{
          all: 'initial',
          fontFamily: 'system-ui, sans-serif',
          display: 'block',
        }}
      >
        <SampleAccordion label="Resources (minimal)" />
      </div>
    </div>
  ),
};

export const TokensOnly: Story = {
  name: 'Tokens only',
  render: () => (
    <div className="rd-story-stack">
      <p style={{ margin: 0, fontSize: '0.875rem' }}>
        Import <code>@rosettadash/web-components/tokens.css</code> in your app entry, then style
        <code> rd-*</code> blocks yourself.
      </p>
      <div
        style={
          {
            '--rd-color-accent': '#0b6e4f',
            '--rd-color-border': '#cbd5e1',
            '--rd-radius-md': '0.375rem',
          } as React.CSSProperties
        }
      >
        <SampleAccordion label="Resources (tokens)" />
      </div>
    </div>
  ),
};
