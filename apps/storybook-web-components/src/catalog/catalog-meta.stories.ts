import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { registerRosettaDashCatalogElements } from '@rosettadash/web-components/catalog';

registerRosettaDashCatalogElements();

const meta: Meta = {
  title: 'Catalog/Meta elements',
  parameters: {
    docs: {
      description: {
        component:
          'Document components with **element wrappings only**: `rd-component-name` → `rd-attribute` + `rd-subcomponent-name`. Set `required` (black) or `optional` (grey) on each attribute or subcomponent.',
      },
    },
  },
};

export default meta;

type Story = StoryObj;

export const ElementWrappings: Story = {
  name: 'Element wrappings (author markup)',
  render: () => {
    const root = document.createElement('div');
    root.innerHTML = `
<rd-component-name
  tag="data-table"
  label="Data Table"
  description="Sortable, filterable table — bind row-select to a detail panel.">
  <rd-attribute name="data" value="rowset" required></rd-attribute>
  <rd-attribute name="filter" value="date-range" optional></rd-attribute>
  <rd-attribute name="page-size" value="25" optional></rd-attribute>
  <rd-subcomponent-name tag="detail-panel" optional>
    <rd-attribute name="row" value="row" required></rd-attribute>
  </rd-subcomponent-name>
</rd-component-name>`;
    return root.firstElementChild as HTMLElement;
  },
};

export const AccessOnboarding: Story = {
  name: 'Access & Onboarding example',
  render: () => {
    const root = document.createElement('div');
    root.innerHTML = `
<rd-component-name
  tag="role-gate"
  label="Role Gate"
  description="Show children only for allowed roles.">
  <rd-attribute name="roles" value='["admin","editor"]' required></rd-attribute>
  <rd-subcomponent-name tag="admin-panel" required></rd-subcomponent-name>
  <rd-subcomponent-name tag="person-invite" optional></rd-subcomponent-name>
  <rd-subcomponent-name tag="role-assign" optional></rd-subcomponent-name>
</rd-component-name>`;
    return root.firstElementChild as HTMLElement;
  },
};

export const SelfClosingSubcomponent: Story = {
  name: 'Self-closing subcomponent',
  render: () => {
    const root = document.createElement('div');
    root.innerHTML = `
<rd-component-name tag="date-range" label="Date Range">
  <rd-attribute name="preset" value="last-7-days" optional></rd-attribute>
  <rd-attribute name="range" value="date-range" required output></rd-attribute>
  <rd-subcomponent-name tag="line-chart" optional rd-bind="range"></rd-subcomponent-name>
</rd-component-name>`;
    return root.firstElementChild as HTMLElement;
  },
};
