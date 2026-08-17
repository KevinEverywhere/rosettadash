/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '@rosettadash/svelte/*' {
  import type { Component } from 'svelte';
  const component: Component;
  export default component;
}

declare module '@rosettadash/svelte/visual/table' {
  export type { DataTableRow, DataTableProps } from '@rosettadash/svelte';
  import type { Component } from 'svelte';
  const DataTable: Component;
  export default DataTable;
}
