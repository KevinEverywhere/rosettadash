import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { mergeConfig, type UserConfig } from 'vite';
import { rosettadashViteFinal } from './vite-final.ts';

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

/** Storybook Svelte: ensure @sveltejs/vite-plugin-svelte processes .svelte files. */
export async function rosettadashSvelteViteFinal(
  config: UserConfig,
): Promise<UserConfig> {
  const withPaths = await rosettadashViteFinal(config);
  const hasSveltePlugin = (withPaths.plugins ?? []).some(
    (plugin) =>
      plugin &&
      typeof plugin === 'object' &&
      'name' in plugin &&
      String(plugin.name).includes('vite-plugin-svelte'),
  );

  if (hasSveltePlugin) {
    return withPaths;
  }

  return mergeConfig(withPaths, {
    plugins: [
      svelte({
        configFile: path.join(
          workspaceRoot,
          'apps/storybook-svelte/svelte.config.js',
        ),
      }),
    ],
  });
}
