import { Component, input } from '@angular/core';
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

  protected readString(key: string, fallback = ''): string {
    const value = this.node().properties[key];
    return typeof value === 'string' ? value : fallback;
  }

  protected readNumber(key: string, fallback = 0): number {
    const value = this.node().properties[key];
    return typeof value === 'number' ? value : fallback;
  }
}
