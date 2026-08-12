export type { CatalogVariant } from './_shared/catalog-variant.js';
export { CATALOG_VARIANTS, readCatalogVariant, applyCatalogVariant } from './_shared/catalog-variant.js';

export type { ComponentAttributeProps } from './component-attribute/index.js';
export {
  RD_ATTRIBUTE_TAG,
  RdAttributeElement,
  registerRdAttribute,
} from './component-attribute/index.js';

export type { BuildComponentMarkupOptions } from './component-name/index.js';
export {
  RD_COMPONENT_NAME_TAG,
  RdComponentNameElement,
  registerRdComponentName,
  createComponentNameElement,
} from './component-name/index.js';

export {
  RD_SUBCOMPONENT_NAME_TAG,
  RdSubcomponentNameElement,
  registerRdSubcomponentName,
} from './subcomponent-name/index.js';

export { taxonomyToRdTag } from './_shared/markup-shared.js';
export {
  RD_COMPONENT_PORT_TAG,
  RdComponentPortElement,
  registerRdComponentPort,
} from './component-port/index.js';

export type { ComponentRequirementKind, ComponentRequirementProps } from './component-requirement/index.js';
export {
  RD_COMPONENT_REQUIREMENT_TAG,
  RdComponentRequirementElement,
  registerRdComponentRequirement,
} from './component-requirement/index.js';

export type { ComponentOptionProps } from './component-option/index.js';
export {
  RD_COMPONENT_OPTION_TAG,
  RdComponentOptionElement,
  registerRdComponentOption,
} from './component-option/index.js';

export type { ComponentSpecProps } from './component-spec/index.js';
export {
  RD_COMPONENT_SPEC_TAG,
  RdComponentSpecElement,
  registerRdComponentSpec,
  createComponentSpecElement,
} from './component-spec/index.js';

export type { PaletteGroupFit, PaletteGroupProps } from './palette-group/index.js';
export {
  RD_PALETTE_GROUP_TAG,
  RdPaletteGroupElement,
  registerRdPaletteGroup,
  createPaletteGroupElement,
} from './palette-group/index.js';

export type { PaletteCatalogProps } from './palette-catalog/index.js';
export {
  RD_PALETTE_CATALOG_TAG,
  RdPaletteCatalogElement,
  registerRdPaletteCatalog,
  createPaletteCatalogElement,
} from './palette-catalog/index.js';

import { registerRdAttribute } from './component-attribute/index.js';
import { registerRdComponentName } from './component-name/index.js';
import { registerRdComponentOption } from './component-option/index.js';
import { registerRdComponentPort } from './component-port/index.js';
import { registerRdComponentRequirement } from './component-requirement/index.js';
import { registerRdComponentSpec } from './component-spec/index.js';
import { registerRdPaletteCatalog } from './palette-catalog/index.js';
import { registerRdPaletteGroup } from './palette-group/index.js';
import { registerRdSubcomponentName } from './subcomponent-name/index.js';

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
