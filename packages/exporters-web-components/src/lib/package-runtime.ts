import type { IRComponent } from '@dashbuilder/core';

/** Component types served by @dashbuilder/web-components runtime (package export mode). */
export const RUNTIME_PACKAGE_TYPES = new Set([
  'visual.media.video-source',
  'visual.media.equirect-viewport',
  'visual.wasm.media',
]);

export interface RuntimePackageSpec {
  subpath: '@dashbuilder/web-components/media' | '@dashbuilder/web-components/wasm';
  tagName: string;
  registerFn: string;
  registerImport: string;
}

const RUNTIME_SPECS: Record<string, RuntimePackageSpec> = {
  'visual.media.video-source': {
    subpath: '@dashbuilder/web-components/media',
    tagName: 'db-video-source',
    registerFn: 'registerDbVideoSource',
    registerImport: 'registerDashBuilderMediaElements',
  },
  'visual.media.equirect-viewport': {
    subpath: '@dashbuilder/web-components/media',
    tagName: 'db-equirect-viewport',
    registerFn: 'registerDbEquirectViewport',
    registerImport: 'registerDashBuilderMediaElements',
  },
  'visual.wasm.media': {
    subpath: '@dashbuilder/web-components/wasm',
    tagName: 'db-wasm-media',
    registerFn: 'registerDbWasmMedia',
    registerImport: 'registerDashBuilderWasmElements',
  },
};

export function usesRuntimePackage(type: string, component?: IRComponent): boolean {
  if (!RUNTIME_PACKAGE_TYPES.has(type)) {
    return false;
  }

  if (type === 'visual.wasm.media') {
    return component?.properties?.['operation'] === 'equirect-extract';
  }

  return true;
}

export function getRuntimePackageSpec(type: string): RuntimePackageSpec | undefined {
  return RUNTIME_SPECS[type];
}

export function runtimePackageImports(components: IRComponent[]): string[] {
  const imports = new Set<string>();
  for (const component of components) {
    if (!usesRuntimePackage(component.type, component)) {
      continue;
    }
    const spec = getRuntimePackageSpec(component.type);
    if (spec) {
      imports.add(spec.registerImport);
    }
  }
  return [...imports];
}
