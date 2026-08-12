export function defineRosettaElement(
  tagName: string,
  ctor: CustomElementConstructor,
): void {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, ctor);
  }
}

export type DashRow = Record<string, string | number | boolean | null | undefined>;

export function readNumber(value: unknown, fallback: number): number {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

export function readString(value: unknown, fallback: string): string {
  return typeof value === 'string' ? value : fallback;
}

export const BASE_STYLES = `
:host {
  display: block;
  font-family: var(--rd-font-family, system-ui, sans-serif);
  color: var(--rd-color-text, #1f2937);
}
.panel {
  border: 1px solid var(--rd-color-border, #d9dee7);
  border-radius: var(--rd-radius-md, 0.5rem);
  padding: 0.75rem;
}
.panel__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}
.panel__header h3 {
  margin: 0;
  font-size: 0.9375rem;
}
.panel__meta {
  font-size: 0.75rem;
  color: var(--rd-color-muted, #6b7280);
}
`;
