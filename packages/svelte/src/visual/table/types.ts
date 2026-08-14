export interface DataTableRow {
  id: string;
  name?: string;
  status?: string;
  amount?: number;
  date?: string;
  [key: string]: string | number | undefined;
}

export interface DataTableProps {
  title?: string;
  rows?: DataTableRow[];
  className?: string;
}
