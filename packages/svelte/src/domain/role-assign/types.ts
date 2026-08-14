export interface RoleAssignProps {
  summary?: string;
  roleOptions?: { value: string; label: string }[];
  onConfirm?: (role: string) => void;
  className?: string;
}
