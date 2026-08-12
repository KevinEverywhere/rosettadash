import { defineRosettaElement, readString } from '../../lib/element-utils.js';
import { RD_ATTRIBUTE_TAG, type RdAttributeElement } from '../component-attribute/rd-attribute.js';

export const RD_SUBCOMPONENT_NAME_TAG = 'rd-subcomponent-name';

export class RdSubcomponentNameElement extends HTMLElement {
  static readonly tagName = RD_SUBCOMPONENT_NAME_TAG;

  static get observedAttributes(): string[] {
    return ['tag', 'bind'];
  }

  get subTag(): string {
    const raw = readString(this.getAttribute('tag'), 'rd-child');
    return raw.startsWith('rd-') ? raw : `rd-${raw}`;
  }

  get bindHint(): string {
    return readString(this.getAttribute('bind'), '');
  }

  get isRequired(): boolean {
    return this.hasAttribute('required');
  }

  get requirementClass(): 'required' | 'optional' {
    return this.isRequired ? 'required' : 'optional';
  }

  get attributeElements(): RdAttributeElement[] {
    return [...this.querySelectorAll(`:scope > ${RD_ATTRIBUTE_TAG}`)] as RdAttributeElement[];
  }
}

export function registerRdSubcomponentName(): void {
  defineRosettaElement(RD_SUBCOMPONENT_NAME_TAG, RdSubcomponentNameElement);
}
