export interface ModalLayoutProps {
  title?: string;
  body?: string;
  confirmLabel?: string;
  open?: boolean;
  onConfirm?: () => void;
  className?: string;
}
