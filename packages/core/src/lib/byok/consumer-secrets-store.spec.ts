import { GOOGLE_MAPS_API_KEY } from './integration-catalog';
import { ConsumerSecretsStore } from './consumer-secrets-store';

function createMemoryStorage(): Storage {
  const data = new Map<string, string>();
  return {
    get length() {
      return data.size;
    },
    clear() {
      data.clear();
    },
    getItem(key: string) {
      return data.has(key) ? data.get(key)! : null;
    },
    key(index: number) {
      return [...data.keys()][index] ?? null;
    },
    removeItem(key: string) {
      data.delete(key);
    },
    setItem(key: string, value: string) {
      data.set(key, value);
    },
  };
}

describe('ConsumerSecretsStore', () => {
  let store: ConsumerSecretsStore;
  let session: Storage;
  let local: Storage;

  beforeEach(async () => {
    session = createMemoryStorage();
    local = createMemoryStorage();
    Object.defineProperty(globalThis, 'sessionStorage', { value: session, configurable: true });
    Object.defineProperty(globalThis, 'localStorage', { value: local, configurable: true });
    store = new ConsumerSecretsStore();
    await store.initialize();
  });

  it('stores and reloads encrypted secrets when rememberKeys is enabled', async () => {
    store.setSecretValue(GOOGLE_MAPS_API_KEY, 'sk-test-maps');
    store.setRememberKeys(true);
    await store.save();

    const reloaded = new ConsumerSecretsStore();
    await reloaded.initialize();

    expect(reloaded.getValue(GOOGLE_MAPS_API_KEY)).toBe('sk-test-maps');
    expect(reloaded.hasSecretValue(GOOGLE_MAPS_API_KEY)).toBe(true);
  });

  it('clears secrets from both storages', async () => {
    store.setSecretValue(GOOGLE_MAPS_API_KEY, 'temporary');
    store.setRememberKeys(true);
    await store.save();
    store.clearAll();

    const reloaded = new ConsumerSecretsStore();
    await reloaded.initialize();
    expect(reloaded.getValue(GOOGLE_MAPS_API_KEY)).toBe('');
  });
});
