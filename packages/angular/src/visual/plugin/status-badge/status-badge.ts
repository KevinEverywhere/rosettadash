import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface StatusBadgeProps {
  statusText?: string;
  tone?: 'success' | 'warning' | 'error' | 'neutral';
  className?: string;
}

/** @rosettadash/angular/visual/plugin/status-badge — visual.plugin.status-badge */
@Component({
  selector: 'rd-plugin-status-badge',
  standalone: true,
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [attr.data-testid]="'rd-plugin-status-badge'" [ngClass]="badgeClass()">{{ statusText() ?? 'Active' }}</span>
  `,
})
export class StatusBadge {
  readonly className = input<string | undefined>(undefined);
  readonly statusText = input<string | undefined>(undefined);
  readonly tone = input<'success' | 'warning' | 'error' | 'neutral' | undefined>(undefined);

  readonly rootClass = computed(() =>
    ['rd-plugin-status-badge', this.className()].filter(Boolean).join(' '),
  );
  badgeClass(): string {
    return ['rd-plugin-status-badge', 'rd-plugin-status-badge--' + (this.tone() ?? 'success'), this.className()].filter(Boolean).join(' ');
  }
}
