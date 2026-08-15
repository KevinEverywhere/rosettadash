import {
  canonicalConsumerSecretKey,
  consumerSecretAliases,
  GOOGLE_MAPS_API_KEY,
} from './integration-catalog';

export interface ConsumerSecretSource {
  getValue(envKey: string): string;
}

export interface ResolveConsumerSecretOptions {
  /** Build-time / runtime env map (e.g. import.meta.env in Vite). Keys without prefix. */
  buildEnv?: Record<string, string | undefined>;
}

/**
 * Resolve a consumer integration secret: BYOK vault first, then known aliases / VITE_* build env.
 */
export function resolveConsumerSecret(
  envKey: string,
  source: ConsumerSecretSource,
  options: ResolveConsumerSecretOptions = {},
): string {
  const canonical = canonicalConsumerSecretKey(envKey);
  const fromVault = source.getValue(canonical);
  if (fromVault) {
    return fromVault;
  }

  const buildEnv = options.buildEnv ?? {};
  const candidates = [canonical, ...consumerSecretAliases(canonical)];

  for (const candidate of candidates) {
    const direct = buildEnv[candidate];
    if (direct) {
      return direct;
    }
    const vite = buildEnv[`VITE_${candidate}`];
    if (vite) {
      return vite;
    }
  }

  return '';
}

export function resolveGoogleMapsApiKey(
  source: ConsumerSecretSource,
  options: ResolveConsumerSecretOptions = {},
): string {
  return resolveConsumerSecret(GOOGLE_MAPS_API_KEY, source, options);
}
