import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

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

/** @rosettadash/angular/layout/tabs — layout.tabs */
@Component({
  selector: 'rd-tabs',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section [attr.data-testid]="'rd-tabs'" [ngClass]="rootClass()">
      @if (title()) { <span class="rd-tabs__title">{{ title() }}</span> }
      <div class="rd-tabs__tabs" role="tablist">
        @for (tab of tabs() ?? []; track tab.id) {
          <button type="button" role="tab" [class]="tabClass(tab.id)">{{ tab.label }}</button>
        }
      </div>
      <div class="rd-tabs__panel"><ng-content /></div>
    </section>
  `,
})
export class TabsLayout {
  readonly className = input<string | undefined>(undefined);
  readonly title = input<string | undefined>(undefined);
  readonly tabs = input<TabsLayoutTab[] | undefined>(undefined);
  readonly activeTabId = input<string | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-tabs', this.className()].filter(Boolean).join(' '),
  );
  tabClass(id: string): string {
    return ['rd-tabs__tab', this.activeTabId() === id ? 'rd-tabs__tab--active' : ''].filter(Boolean).join(' ');
  }
}
