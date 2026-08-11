import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { ComponentNode } from '@dashbuilder/core';
import type { ComponentPreviewTemplateId } from './component-preview-adapter.registry';
import { PreviewThreeVisualComponent } from './preview-three-visual.component';

@Component({
  selector: 'app-preview-plugin',
  imports: [PreviewThreeVisualComponent],
  templateUrl: './preview-plugin.component.html',
  styleUrl: './preview-plugin.component.scss',
})
export class PreviewPluginComponent {
  readonly node = input.required<ComponentNode>();
  readonly templateId = input.required<ComponentPreviewTemplateId>();

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly svgInlineMarkup = computed(() => {
    const mode = this.readString('sourceMode', 'inline');
    if (mode === 'url') {
      const url = this.readString('url');
      if (url) {
        return this.sanitizer.bypassSecurityTrustHtml(
          `<img src="${escapeAttribute(url)}" alt="${escapeAttribute(this.readString('ariaLabel', 'SVG graphic'))}" />`,
        );
      }
      return this.sanitizer.bypassSecurityTrustHtml(
        '<p class="preview-svg__placeholder">Set an SVG URL</p>',
      );
    }
    if (mode === 'path') {
      const path = this.readString('assetPath');
      if (path) {
        return this.sanitizer.bypassSecurityTrustHtml(
          `<p class="preview-svg__placeholder">Asset: ${escapeHtml(path)}</p>`,
        );
      }
      return this.sanitizer.bypassSecurityTrustHtml(
        '<p class="preview-svg__placeholder">Set a content-library asset path</p>',
      );
    }
    return this.sanitizer.bypassSecurityTrustHtml(this.readString('markup'));
  });

  protected readonly svgIconMarkup = computed(() =>
    this.sanitizer.bypassSecurityTrustHtml(this.readString('markup')),
  );

  protected readString(key: string, fallback = ''): string {
    const value = this.node().properties[key];
    return typeof value === 'string' ? value : fallback;
  }

  protected readNumber(key: string, fallback = 0): number {
    const value = this.node().properties[key];
    return typeof value === 'number' ? value : fallback;
  }

  protected readBoolean(key: string, fallback = false): boolean {
    const value = this.node().properties[key];
    return typeof value === 'boolean' ? value : fallback;
  }
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
