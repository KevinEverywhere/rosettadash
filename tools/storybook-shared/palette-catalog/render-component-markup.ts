import type { ComponentDefinition } from '@rosettadash/core';
import { taxonomyToRdTag } from '@rosettadash/web-components/catalog';
import {
  getComponentCatalogAssumptions,
  getComponentCatalogExtras,
  type ComponentCatalogSubcomponent,
} from './component-catalog-spec.js';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function toRdTag(tag: string): string {
  return tag.startsWith('rd-') ? tag : `rd-${tag}`;
}

function formatAttribute(name: string, value: string | undefined, isOutput: boolean): string {
  const key = isOutput ? name : `rd-${name}`;
  if (value !== undefined && value !== '') {
    return `${key}="${escapeXml(value)}"`;
  }
  return key;
}

function renderSubcomponentMarkup(sub: ComponentCatalogSubcomponent, indent: string): string {
  const tag = toRdTag(sub.tag);
  const attrs = (sub.attributes ?? []).map((attr) =>
    formatAttribute(attr.name, attr.value, false),
  );
  if (sub.bind) {
    attrs.unshift(`rd-bind="${escapeXml(sub.bind)}"`);
  }

  if (attrs.length === 0) {
    return `${indent}<${tag} />`;
  }

  if (attrs.length === 1) {
    return `${indent}<${tag}\n${indent}  ${attrs[0]}\n${indent}/>`;
  }

  const attrLines = attrs.map((line) => `${indent}  ${line}`).join('\n');
  return `${indent}<${tag}\n${attrLines}\n${indent}/>`;
}

/** Plain component markup for meta composition XML panel (matches rd-component-name tree, without annotations). */
export function renderPlainComponentMarkup(definition: ComponentDefinition): string {
  const extras = getComponentCatalogExtras(definition.type);
  const tag = taxonomyToRdTag(definition.type);
  const attrs: string[] = [];

  for (const port of definition.inputs) {
    attrs.push(formatAttribute(port.name, port.dataType, false));
  }

  for (const port of definition.outputs) {
    attrs.push(formatAttribute(port.name, port.dataType, true));
  }

  for (const property of definition.properties) {
    const value =
      property.default !== undefined
        ? String(property.default)
        : property.type !== undefined
          ? String(property.type)
          : undefined;
    attrs.push(formatAttribute(property.key, value, false));
  }

  for (const dependency of extras.dependencies ?? []) {
    attrs.push(`rd-depends-on="${escapeXml(dependency)}"`);
  }

  for (const assumption of getComponentCatalogAssumptions(definition.type, definition)) {
    attrs.push(`rd-assume="${escapeXml(assumption)}"`);
  }

  const subs = extras.subcomponents ?? [];

  if (subs.length === 0) {
    if (attrs.length === 0) {
      return `<${tag} />`;
    }
    return `<${tag}\n  ${attrs.join('\n  ')}\n/>`;
  }

  const openTag = `<${tag}\n  ${attrs.join('\n  ')}\n>`;
  const subLines = subs.map((sub) => renderSubcomponentMarkup(sub, '  ')).join('\n');
  return `${openTag}\n${subLines}\n</${tag}>`;
}
