import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig, type UserConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const workspaceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../..',
);

function rosettadashAliases(): Record<string, string> {
  const base = JSON.parse(
    fs.readFileSync(path.join(workspaceRoot, 'tsconfig.base.json'), 'utf8'),
  ) as {
    compilerOptions?: { paths?: Record<string, string[]> };
  };
  const paths = base.compilerOptions?.paths ?? {};
  const alias: Record<string, string> = {
    '@rosettadash/web-components/tokens.css': path.join(
      workspaceRoot,
      'packages/web-components/src/styles/tokens.css',
    ),
    '@rosettadash/web-components/styles.css': path.join(
      workspaceRoot,
      'packages/web-components/src/styles/styles.css',
    ),
  };

  for (const [key, targets] of Object.entries(paths)) {
    if (!key.startsWith('@rosettadash/') || !targets?.[0]) {
      continue;
    }
    alias[key] = path.join(workspaceRoot, targets[0]);
  }

  return Object.fromEntries(
    Object.entries(alias).sort(([a], [b]) => b.length - a.length),
  );
}

/** Resolve @rosettadash CSS subpaths and workspace packages for Storybook Vite. */
export async function rosettadashViteFinal(
  config: UserConfig,
): Promise<UserConfig> {
  return mergeConfig(config, {
    plugins: [
      tsconfigPaths({
        root: workspaceRoot,
        projects: [path.join(workspaceRoot, 'tsconfig.base.json')],
      }),
    ],
    resolve: {
      alias: rosettadashAliases(),
    },
  });
}
