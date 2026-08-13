import './wasm-compute-lab-sandbox.css';
import { transform } from '@babel/standalone';
import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ADD_WASM_BYTES } from './wasm-module-bytes.js';

const DEFAULT_REACT_SOURCE = `function App({ title, summary }) {
  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '1.25rem', color: '#0f172a' }}>
      <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>{title}</h1>
      <p style={{ margin: 0, color: '#475569' }}>{summary}</p>
    </main>
  );
}

render(
  <App
    title="WASM compute lab"
    summary="React preview rendered from the Node authoring host (props stand in for palette inputs)."
  />
);`;

function compileReactSource(source: string): React.ReactNode {
  if (/^\s*import\s/m.test(source) || /^\s*export\s/m.test(source)) {
    throw new Error(
      'Preview sandbox does not support import/export. React is already in scope — write JSX and call render(...).',
    );
  }

  const rendered: React.ReactNode[] = [];
  const render = (node: React.ReactNode) => {
    rendered.push(node);
  };

  const prelude = `const { useState, useEffect, useMemo, useCallback, Fragment } = React;`;
  const transformed = transform(`${prelude}\n${source}`, {
    presets: [['react', { runtime: 'classic' }]],
    sourceType: 'script',
  }).code;

  if (!transformed) {
    throw new Error('Could not compile JSX preview.');
  }

  const executable = transformed
    .split('\n')
    .filter((line) => !/^\s*import[\s{]/.test(line) && !/^\s*export[\s{]/.test(line))
    .join('\n');

  new Function('React', 'render', executable)(React, render);
  return rendered.at(-1) ?? null;
}

async function runRustWasm(output: HTMLElement): Promise<void> {
  output.textContent = 'Instantiating .wasm export add…';
  try {
    const { instance } = await WebAssembly.instantiate(ADD_WASM_BYTES, {});
    const add = instance.exports.add as (a: number, b: number) => number;
    const result = add(19, 23);
    output.innerHTML = `<span class="rd-wasm-lab__ok">add(19, 23) = ${result}</span>
<span class="rd-wasm-lab__muted">exports: ${Object.keys(instance.exports).join(', ')}</span>`;
  } catch (error) {
    output.textContent = `WASM error: ${String(error)}`;
  }
}

function showPreviewError(container: HTMLElement, message: string): void {
  container.innerHTML = `<pre class="rd-wasm-lab__preview-error">${message.replace(/</g, '&lt;')}</pre>`;
}

/** Three-host live sandbox for the WASM compute lab meta composition only. */
export function mountWasmComputeLabSandbox(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'rd-wasm-lab';
  section.setAttribute('aria-label', 'WASM compute lab live sandbox');

  const intro = document.createElement('header');
  intro.className = 'rd-wasm-lab__intro';
  intro.innerHTML = `<h3 class="rd-wasm-lab__title">Live sandbox</h3>
    <p class="rd-wasm-lab__summary">Rust WASM module, Node-style React authoring, and the rendered preview — three isolated hosts.</p>`;
  section.appendChild(intro);

  const triptych = document.createElement('div');
  triptych.className = 'rd-wasm-lab__triptych';

  const rustHost = document.createElement('article');
  rustHost.className = 'rd-wasm-lab__host';
  rustHost.innerHTML = `<header class="rd-wasm-lab__host-head">
      <span class="rd-wasm-lab__host-label">WASM module host</span>
      <code class="rd-wasm-lab__host-type">visual.wasm.module</code>
    </header>
    <p class="rd-wasm-lab__host-desc">Small Rust-compiled module — <code>add</code> export via <code>infra.wasm.asset</code>.</p>`;
  const rustOut = document.createElement('div');
  rustOut.className = 'rd-wasm-lab__rust-out';
  rustOut.setAttribute('aria-live', 'polite');
  rustOut.textContent = 'Click run to instantiate WASM.';
  const rustRun = document.createElement('button');
  rustRun.type = 'button';
  rustRun.className = 'rd-wasm-lab__run';
  rustRun.textContent = 'Run add(19, 23)';
  rustHost.append(rustOut, rustRun);

  const nodeHost = document.createElement('article');
  nodeHost.className = 'rd-wasm-lab__host';
  nodeHost.innerHTML = `<header class="rd-wasm-lab__host-head">
      <span class="rd-wasm-lab__host-label">Node authoring server</span>
      <code class="rd-wasm-lab__host-type">visual.wasm.worker-host</code>
    </header>
    <pre class="rd-wasm-lab__terminal" aria-hidden="true">$ node server.mjs
RosettaDash dev shell (Storybook stub)
$ npm run dev
  ready — edit App.jsx below</pre>`;
  const editorLabel = document.createElement('label');
  editorLabel.className = 'rd-wasm-lab__editor-label';
  editorLabel.innerHTML = '<span>App.jsx</span>';
  const editor = document.createElement('textarea');
  editor.className = 'rd-wasm-lab__editor';
  editor.spellcheck = false;
  editor.value = DEFAULT_REACT_SOURCE;
  editorLabel.appendChild(editor);
  const reactRun = document.createElement('button');
  reactRun.type = 'button';
  reactRun.className = 'rd-wasm-lab__run';
  reactRun.textContent = 'Apply → preview frame';
  nodeHost.append(editorLabel, reactRun);

  const previewHost = document.createElement('article');
  previewHost.className = 'rd-wasm-lab__host rd-wasm-lab__host--stage';
  previewHost.innerHTML = `<header class="rd-wasm-lab__host-head">
      <span class="rd-wasm-lab__host-label">Render frame</span>
      <code class="rd-wasm-lab__host-type">preview surface</code>
    </header>`;
  const previewMount = document.createElement('div');
  previewMount.className = 'rd-wasm-lab__preview';
  previewMount.setAttribute('role', 'region');
  previewMount.setAttribute('aria-label', 'React preview output');
  previewHost.appendChild(previewMount);

  triptych.append(rustHost, nodeHost, previewHost);
  section.appendChild(triptych);

  const footnote = document.createElement('p');
  footnote.className = 'rd-wasm-lab__footnote';
  footnote.textContent =
    'Storybook-only demos — preview uses in-scope React (no imports). Future palette wiring will bind inputs/outputs between hosts.';
  section.appendChild(footnote);

  let previewRoot: Root | null = null;

  const renderReactPreview = (source: string) => {
    try {
      const element = compileReactSource(source);
      previewMount.innerHTML = '';
      previewRoot ??= createRoot(previewMount);
      previewRoot.render(element);
    } catch (error) {
      previewRoot?.unmount();
      previewRoot = null;
      showPreviewError(
        previewMount,
        error instanceof Error ? error.message : String(error),
      );
    }
  };

  rustRun.addEventListener('click', () => {
    void runRustWasm(rustOut);
  });

  reactRun.addEventListener('click', () => {
    renderReactPreview(editor.value);
  });

  renderReactPreview(DEFAULT_REACT_SOURCE);

  return section;
}
