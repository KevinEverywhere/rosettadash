const { readFileSync } = require('node:fs');
const { fileURLToPath } = require('node:url');

/** Jest/jsdom: resolve file:// fetches for co-located shadow assets. */
globalThis.fetch = async (input) => {
  const href =
    typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.href
        : input.url;

  if (href.startsWith('file:')) {
    try {
      const body = readFileSync(fileURLToPath(href), 'utf8');
      return {
        ok: true,
        status: 200,
        text: async () => body,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        ok: false,
        status: 404,
        text: async () => message,
      };
    }
  }

  throw new Error(`Unexpected fetch in web-components tests: ${href}`);
};
