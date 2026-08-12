import { Injectable } from '@angular/core';
import JSZip from 'jszip';
import type { GeneratedFile } from './export-api.service';

@Injectable({ providedIn: 'root' })
export class ExportZipService {
  async download(files: GeneratedFile[], filename: string): Promise<void> {
    const zip = new JSZip();

    for (const file of files) {
      zip.file(file.path, file.content);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'dashboard';
  }
}
