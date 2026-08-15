import { useState, type ReactNode } from 'react';

interface SourcePanelProps {
  source: string;
  className?: string;
  hidden?: boolean;
}

export function ComponentSourcePanel({ source, className, hidden }: SourcePanelProps) {
  return (
    <aside
      className={['da-workbench__source', hidden ? 'da-workbench__pane--hidden-mobile' : '', className]
        .filter(Boolean)
        .join(' ')}
      aria-label="Component source"
    >
      <header className="da-workbench__source-header">
        <h3>Component source</h3>
        <p>React components, props, and nested structure for this screen.</p>
      </header>
      <pre className="da-workbench__code">
        <code>{source}</code>
      </pre>
    </aside>
  );
}

interface Props {
  source: string;
  children: ReactNode;
  mobileView: 'preview' | 'source';
}

export function ScreenWorkbenchPreview({ children, mobileView }: Omit<Props, 'source'>) {
  return (
    <div
      className={[
        'da-workbench__preview',
        mobileView === 'source' ? 'da-workbench__pane--hidden-mobile' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}

export function ScreenWorkbenchMobileToggle({
  mobileView,
  onChange,
}: {
  mobileView: 'preview' | 'source';
  onChange: (view: 'preview' | 'source') => void;
}) {
  return (
    <div className="da-workbench__mobile-toggle" role="tablist" aria-label="Preview or source">
      <button
        type="button"
        role="tab"
        aria-selected={mobileView === 'preview'}
        className={mobileView === 'preview' ? 'is-active' : undefined}
        onClick={() => onChange('preview')}
      >
        Atlas preview
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mobileView === 'source'}
        className={mobileView === 'source' ? 'is-active' : undefined}
        onClick={() => onChange('source')}
      >
        Component source
      </button>
    </div>
  );
}

export function ScreenWorkbench({ source, children }: Omit<Props, 'mobileView'>) {
  const [mobileView, setMobileView] = useState<'preview' | 'source'>('preview');

  return (
    <>
      <ScreenWorkbenchMobileToggle mobileView={mobileView} onChange={setMobileView} />
      <ScreenWorkbenchPreview mobileView={mobileView}>{children}</ScreenWorkbenchPreview>
      <ComponentSourcePanel source={source} hidden={mobileView === 'preview'} />
    </>
  );
}
