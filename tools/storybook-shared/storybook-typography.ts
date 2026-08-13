import { create, themes } from 'storybook/theming/create';

/** Google Fonts: Inter (variable) + JetBrains Mono for Storybook manager + preview iframes. */
export const STORYBOOK_FONT_LINKS = `
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400..700&family=JetBrains+Mono:wght@400;500&display=swap"
  rel="stylesheet"
/>
`;

export const STORYBOOK_FONT_BASE =
  '"Inter", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

export const STORYBOOK_FONT_CODE =
  '"JetBrains Mono", ui-monospace, "SF Mono", SFMono-Regular, Menlo, Monaco, Consolas, monospace';

export function storybookPreviewHead(head: string): string {
  return `${head}${STORYBOOK_FONT_LINKS}`;
}

export function createStorybookManagerTheme(runtimeLabel: string) {
  return create({
    ...themes.light,
    brandTitle: `RosettaDash · ${runtimeLabel}`,
    fontBase: STORYBOOK_FONT_BASE,
    fontCode: STORYBOOK_FONT_CODE,
  });
}

export const storybookManagerTheme = createStorybookManagerTheme('Web components catalog');

export const storybookTypographyParameters = {
  previewHead: storybookPreviewHead,
} as const;
