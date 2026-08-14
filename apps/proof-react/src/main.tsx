import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../../packages/web-components/src/styles/styles.css';
import { App } from './App';

const root = document.getElementById('app');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
