export interface LinkListItem {
  label: string;
  href: string;
}

export interface LinkListProps {
  items?: LinkListItem[];
  className?: string;
  dense?: boolean;
}
