import { defineRosettaElement, readString } from '../../lib/element-utils.js';

export const RD_ATTRIBUTE_TAG = 'rd-attribute';

/** One documented attribute on a component or subcomponent (`required` = black, `optional` = grey). */
export interface ComponentAttributeProps {
  name: string;
  value?: string;
  required?: boolean;
  optional?: boolean;
  /** When set, renders as output binding rather than rd-* property. */
  output?: boolean;
}

export class RdAttributeElement extends HTMLElement {
  static readonly tagName = RD_ATTRIBUTE_TAG;

  static get observedAttributes(): string[] {
    return ['name', 'value', 'output'];
  }

  get attrName(): string {
    return readString(this.getAttribute('name'), '');
  }

  get attrValue(): string {
    return readString(this.getAttribute('value'), '');
  }

  get isOutput(): boolean {
    return this.hasAttribute('output');
  }

  get isRequired(): boolean {
    return this.hasAttribute('required');
  }

  get requirementClass(): 'required' | 'optional' {
    return this.hasAttribute('required') ? 'required' : 'optional';
  }
}

export function registerRdAttribute(): void {
  defineRosettaElement(RD_ATTRIBUTE_TAG, RdAttributeElement);
}
