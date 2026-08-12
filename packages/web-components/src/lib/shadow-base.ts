import { loadTextResource, type ShadowMountOptions } from './shadow-resources.js';

/** Co-located shadow asset directories relative to `packages/web-components/src/`. */
export const SHADOW_ELEMENT_DIRS: Record<string, string> = {
  'rd-accordion': 'layout/accordion',
  'rd-accordion-link-list': 'layout/accordion-link-list',
  'rd-link-list': 'visual/link-list',
  'rd-video-source': 'visual/media/video-source',
  'rd-equirect-viewport': 'visual/media/equirect-viewport',
  'rd-wasm-media': 'wasm/wasm-media',
  'rd-component-name': 'catalog/component-name',
};

const tagToBaseUrl = new Map<string, string>();
let packageSrcRoot: string | null = null;

/** Ensure a module/file URL resolves to a directory URL (trailing `/`). */
export function normalizeDirectoryUrl(urlString: string): string {
  const url = new URL(urlString);
  const lastSegment = url.pathname.split('/').pop() ?? '';
  if (/\.[a-z0-9]+$/i.test(lastSegment)) {
    url.pathname = url.pathname.replace(/\/[^/]+$/, '/');
  } else if (!url.pathname.endsWith('/')) {
    url.pathname = `${url.pathname}/`;
  }
  return url.href.endsWith('/') ? url.href : `${url.href}/`;
}

/** Register co-located asset directory for a custom element tag. */
export function registerShadowBase(tag: string, baseUrl: string): void {
  tagToBaseUrl.set(tag, normalizeDirectoryUrl(baseUrl));
}

/** Set package `src/` root (`file:` or `https:` URL ending in `/`). */
export function setShadowPackageSrcRoot(rootUrl: string): void {
  packageSrcRoot = normalizeDirectoryUrl(rootUrl);
}

/** Resolve `packages/web-components/src/` from a module URL (Vite-safe). */
export function resolvePackageSrcRootFromModule(moduleUrl: string): string {
  const marker = new URL('./register-shadow-bases.browser.js', moduleUrl);
  return normalizeDirectoryUrl(new URL('./', marker).href);
}

/** Register all known shadow bases from {@link setShadowPackageSrcRoot}. */
export function registerAllShadowBases(): void {
  if (!packageSrcRoot) {
    throw new Error('setShadowPackageSrcRoot must be called before registerAllShadowBases');
  }
  for (const [tag, dir] of Object.entries(SHADOW_ELEMENT_DIRS)) {
    registerShadowBase(tag, new URL(`./${dir}/`, packageSrcRoot).href);
  }
}

/** Register one shadow base when package root is configured (browser entry or Jest setup). */
export function ensureShadowBase(tag: string): void {
  if (tagToBaseUrl.has(tag)) {
    return;
  }
  if (!packageSrcRoot) {
    throw new Error(
      `Shadow base not registered for ${tag}. Import '@rosettadash/web-components' once in app code, or add the web-components Jest setup in test config.`,
    );
  }
  const dir = SHADOW_ELEMENT_DIRS[tag];
  if (!dir) {
    throw new Error(`Unknown shadow element tag: ${tag}`);
  }
  registerShadowBase(tag, new URL(`./${dir}/`, packageSrcRoot).href);
}

/** Resolve registered base URL for shadow asset loading. */
export function getShadowBase(tag: string): string {
  const base = tagToBaseUrl.get(tag);
  if (!base) {
    throw new Error(`Shadow base not registered for ${tag}`);
  }
  return base;
}

/** Load paired `.html` + `.css` for a registered element tag. */
export async function loadShadowPairForTag(
  tag: string,
  htmlFile: string,
  cssFile: string,
): Promise<ShadowMountOptions> {
  ensureShadowBase(tag);
  const base = getShadowBase(tag);
  const [html, css] = await Promise.all([
    loadTextResource(htmlFile, base),
    loadTextResource(cssFile, base),
  ]);
  return { html, css };
}

export { applyShadowMount } from './shadow-resources.js';
