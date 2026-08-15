import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../packages/web-components/src/styles/styles.css';
import '../public/styles.css';
import { App } from './App';
import { ClientRouterProvider } from './lib/client-router';
import { ConsumerSecretsProvider } from './state/consumer-secrets-context';

registerRosettaDashElements();

const root = document.getElementById('app');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ClientRouterProvider>
        <ConsumerSecretsProvider>
          <App />
        </ConsumerSecretsProvider>
      </ClientRouterProvider>
    </StrictMode>,
  );
}
