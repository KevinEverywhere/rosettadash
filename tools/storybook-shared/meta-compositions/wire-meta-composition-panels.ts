/** Tab switching for meta composition three-panel workspace (diagram, live, XML). */
export function wireMetaCompositionPanels(root: HTMLElement): void {
  const workspace = root.querySelector<HTMLElement>('.rd-meta-composition__workspace');
  if (!workspace) {
    return;
  }

  type PanelView = 'diagram' | 'live' | 'xml';

  const setView = (view: PanelView) => {
    if (view === 'xml') {
      workspace.dataset.activeView = 'xml';
      delete workspace.dataset.visualFocus;
    } else {
      workspace.dataset.activeView = 'visual';
      workspace.dataset.visualFocus = view;
    }

    const activeView = workspace.dataset.activeView;
    const visualFocus = workspace.dataset.visualFocus ?? 'diagram';

    workspace.querySelectorAll<HTMLElement>('[role="tab"][data-view]').forEach((tab) => {
      const tabView = tab.dataset.view as PanelView;
      const selected = activeView === 'xml' ? tabView === 'xml' : tabView === visualFocus;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    });
  };

  workspace.querySelectorAll<HTMLElement>('[role="tab"][data-view]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const view = tab.dataset.view;
      if (view === 'diagram' || view === 'live' || view === 'xml') {
        setView(view);
      }
    });
  });

  setView('diagram');
}
