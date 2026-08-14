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
}
