export interface VideoFileDetail {
  file: File;
  metadata: Record<string, string | number | boolean | null | undefined>;
}

export interface VideoSourceProps {
  label?: string;
  accept?: string;
  sourceWidth?: number;
  sourceHeight?: number;
  className?: string;
  onVideoFile?: (detail: VideoFileDetail) => void;
  onMetadata?: (
    detail: Record<string, string | number | boolean | null | undefined>,
  ) => void;
}
