import { forwardRef, type CSSProperties, type ReactNode } from 'react';

export interface TabsLayoutTab {
  id: string;
  label: string;
}

export interface TabsLayoutProps {
  title?: string;
  tabs?: TabsLayoutTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

/** @rosettadash/react/layout/tabs — layout.tabs */
export const TabsLayout = forwardRef<HTMLElement, TabsLayoutProps>(function TabsLayout(
  props,
  ref,
) {
  const { className, style, children } = props;
  const rootClass = ['rd-tabs', className].filter(Boolean).join(' ');

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className={rootClass} style={style} data-testid="rd-tabs">
      {props.title ? <span className="rd-tabs__title">{props.title}</span> : null}
      <div className="rd-tabs__tabs" role="tablist">
        {(props.tabs ?? []).map((tab) => (
          <button key={tab.id} type="button" role="tab" className={['rd-tabs__tab', props.activeTabId === tab.id ? 'rd-tabs__tab--active' : ''].filter(Boolean).join(' ')} onClick={() => props.onTabChange?.(tab.id)}>{tab.label}</button>
        ))}
      </div>
      <div className="rd-tabs__panel">{children}</div>
    </section>
  );
});
