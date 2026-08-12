export type { CatalogVariant } from './catalog-variant.js';
export { CATALOG_VARIANTS, readCatalogVariant, applyCatalogVariant } from './catalog-variant.js';

export type { ComponentAttributeProps } from './component-attribute.js';
export {
  RD_ATTRIBUTE_TAG,
  RdAttributeElement,
  registerRdAttribute,
} from './component-attribute.js';

export type { BuildComponentMarkupOptions } from './component-name.js';
export {
  RD_COMPONENT_NAME_TAG,
  RdComponentNameElement,
  registerRdComponentName,
  createComponentNameElement,
} from './component-name.js';

export {
  RD_SUBCOMPONENT_NAME_TAG,
  RdSubcomponentNameElement,
  registerRdSubcomponentName,
} from './subcomponent-name.js';

export { taxonomyToRdTag } from './markup-shared.js';
export {
  RD_COMPONENT_PORT_TAG,
  RdComponentPortElement,
  registerRdComponentPort,
} from './component-port.js';

export type { ComponentRequirementKind, ComponentRequirementProps } from './component-requirement.js';
export {
  RD_COMPONENT_REQUIREMENT_TAG,
  RdComponentRequirementElement,
  registerRdComponentRequirement,
} from './component-requirement.js';

export type { ComponentOptionProps } from './component-option.js';
export {
  RD_COMPONENT_OPTION_TAG,
  RdComponentOptionElement,
  registerRdComponentOption,
} from './component-option.js';

export type { ComponentSpecProps } from './component-spec.js';
export {
  RD_COMPONENT_SPEC_TAG,
  RdComponentSpecElement,
  registerRdComponentSpec,
  createComponentSpecElement,
} from './component-spec.js';

export type { PaletteGroupFit, PaletteGroupProps } from './palette-group.js';
export {
  RD_PALETTE_GROUP_TAG,
  RdPaletteGroupElement,
  registerRdPaletteGroup,
  createPaletteGroupElement,
} from './palette-group.js';

export type { PaletteCatalogProps } from './palette-catalog.js';
export {
  RD_PALETTE_CATALOG_TAG,
  RdPaletteCatalogElement,
  registerRdPaletteCatalog,
  createPaletteCatalogElement,
} from './palette-catalog.js';

import { registerRdAttribute } from './component-attribute.js';
import { registerRdComponentName } from './component-name.js';
import { registerRdComponentOption } from './component-option.js';
import { registerRdComponentPort } from './component-port.js';
import { registerRdComponentRequirement } from './component-requirement.js';
import { registerRdComponentSpec } from './component-spec.js';
import { registerRdPaletteCatalog } from './palette-catalog.js';
import { registerRdPaletteGroup } from './palette-group.js';
import { registerRdSubcomponentName } from './subcomponent-name.js';

/** Register all catalog meta custom elements (`rd-palette-*`, `rd-component-*`). */
export function registerRosettaDashCatalogElements(): void {
  registerRdAttribute();
  registerRdSubcomponentName();
  registerRdComponentName();
  registerRdComponentPort();
  registerRdComponentRequirement();
  registerRdComponentOption();
  registerRdComponentSpec();
  registerRdPaletteGroup();
  registerRdPaletteCatalog();
}

/** Convenience alias matching import path `catalog/palette-catalog`. */
export function registerCatalogPaletteCatalog(): void {
  registerRosettaDashCatalogElements();
}
