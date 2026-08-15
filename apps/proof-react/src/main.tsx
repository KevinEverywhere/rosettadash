import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerRosettaDashElements } from '@rosettadash/web-components';
import '../../../packages/web-components/src/styles/styles.css';
import '../public/styles.css';
import { App } from './App';
import { ClientRouterProvider } from './lib/client-router';

registerRosettaDashElements();

const root = document.getElementById('app');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <ClientRouterProvider>
        <App />
      </ClientRouterProvider>
    </StrictMode>,
  );
}
