import type { IRComponent } from '@rosettadash/core';

/** Component types served by @rosettadash/web-components runtime (package export mode). */
export const RUNTIME_PACKAGE_TYPES = new Set([
  'visual.media.video-source',
  'visual.media.equirect-viewport',
  'visual.wasm.media',
]);

export interface RuntimePackageSpec {
  subpath: '@rosettadash/web-components/media' | '@rosettadash/web-components/wasm';
  tagName: string;
  registerFn: string;
  registerImport: string;
}

const RUNTIME_SPECS: Record<string, RuntimePackageSpec> = {
  'visual.media.video-source': {
    subpath: '@rosettadash/web-components/media',
    tagName: 'rd-video-source',
    registerFn: 'registerRdVideoSource',
    registerImport: 'registerRosettaDashMediaElements',
  },
  'visual.media.equirect-viewport': {
    subpath: '@rosettadash/web-components/media',
    tagName: 'rd-equirect-viewport',
    registerFn: 'registerRdEquirectViewport',
    registerImport: 'registerRosettaDashMediaElements',
  },
  'visual.wasm.media': {
    subpath: '@rosettadash/web-components/wasm',
    tagName: 'rd-wasm-media',
    registerFn: 'registerRdWasmMedia',
    registerImport: 'registerRosettaDashWasmElements',
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
