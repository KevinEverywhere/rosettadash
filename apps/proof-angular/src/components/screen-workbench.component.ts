import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'da-screen-workbench-mobile-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="da-workbench__mobile-toggle" role="tablist" aria-label="Preview or source">
      <button
        type="button"
        role="tab"
        [attr.aria-selected]="mobileView() === 'preview'"
        [class.is-active]="mobileView() === 'preview'"
        (click)="viewChange.emit('preview')"
      >
        Atlas preview
      </button>
      <button
        type="button"
        role="tab"
        [attr.aria-selected]="mobileView() === 'source'"
        [class.is-active]="mobileView() === 'source'"
        (click)="viewChange.emit('source')"
      >
        Component source
      </button>
    </div>
  `,
})
export class ScreenWorkbenchMobileToggleComponent {
  readonly mobileView = input.required<'preview' | 'source'>();
  readonly viewChange = output<'preview' | 'source'>();
}

@Component({
  selector: 'da-component-source-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <aside
      class="da-workbench__source"
      [class.da-workbench__pane--hidden-mobile]="hidden()"
      aria-label="Component source"
    >
      <header class="da-workbench__source-header">
        <h3>Component source</h3>
        <p>Angular components, inputs, and nested structure for this screen.</p>
      </header>
      <pre class="da-workbench__code"><code>{{ source() }}</code></pre>
    </aside>
  `,
})
export class ComponentSourcePanelComponent {
  readonly source = input('');
  readonly hidden = input(false);
}

@Component({
  selector: 'da-screen-workbench-preview',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="da-workbench__preview"
      [class.da-workbench__pane--hidden-mobile]="mobileView() === 'source'"
    >
      <ng-content />
    </div>
  `,
})
export class ScreenWorkbenchPreviewComponent {
  readonly mobileView = input<'preview' | 'source'>('preview');
}
