import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { resolveWorkspaceLayout } from '@rosettadash/core';
import { BuilderStateService } from './builder-state.service';
import { DisplayAvailabilityService } from './display-availability.service';

export const BUILDER_DEFAULT_PALETTE_WIDTH_PX = 256;
export const BUILDER_DEFAULT_INSPECTOR_WIDTH_PX = 352;
export const BUILDER_MIN_PANEL_WIDTH_PX = 192;
export const BUILDER_MAX_PANEL_WIDTH_PX = 512;
export const BUILDER_COLLAPSED_PANEL_WIDTH_PX = 40;
export const BUILDER_PANEL_SPLITTER_WIDTH_PX = 4;

const PALETTE_WIDTH_KEY = 'rosettadash:builder:palette-width';
const INSPECTOR_WIDTH_KEY = 'rosettadash:builder:inspector-width';
const PALETTE_COLLAPSED_KEY = 'rosettadash:builder:palette-collapsed';
const INSPECTOR_COLLAPSED_KEY = 'rosettadash:builder:inspector-collapsed';

function readStoredWidth(key: string, fallback: number): number {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    const parsed = Number.parseInt(raw, 10);
    return Number.isFinite(parsed) ? clampPanelWidth(parsed) : fallback;
  } catch {
    return fallback;
  }
}

function readStoredCollapsed(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

function clampPanelWidth(width: number): number {
  return Math.min(BUILDER_MAX_PANEL_WIDTH_PX, Math.max(BUILDER_MIN_PANEL_WIDTH_PX, width));
}

@Injectable({ providedIn: 'root' })
export class BuilderWorkspaceLayoutService {
  private readonly viewport = inject(DisplayAvailabilityService);
  private readonly state = inject(BuilderStateService);

  private readonly paletteOpenSignal = signal(false);
  private readonly inspectorOpenSignal = signal(false);
  private readonly paletteWidthSignal = signal(
    readStoredWidth(PALETTE_WIDTH_KEY, BUILDER_DEFAULT_PALETTE_WIDTH_PX),
  );
  private readonly inspectorWidthSignal = signal(
    readStoredWidth(INSPECTOR_WIDTH_KEY, BUILDER_DEFAULT_INSPECTOR_WIDTH_PX),
  );
  private readonly paletteCollapsedSignal = signal(readStoredCollapsed(PALETTE_COLLAPSED_KEY));
  private readonly inspectorCollapsedSignal = signal(readStoredCollapsed(INSPECTOR_COLLAPSED_KEY));
  private readonly resizingSignal = signal(false);

  private resizeSession: {
    side: 'palette' | 'inspector';
    startX: number;
    startWidth: number;
  } | null = null;

  readonly paletteOpen = this.paletteOpenSignal.asReadonly();
  readonly inspectorOpen = this.inspectorOpenSignal.asReadonly();
  readonly paletteWidthPx = this.paletteWidthSignal.asReadonly();
  readonly inspectorWidthPx = this.inspectorWidthSignal.asReadonly();
  readonly paletteCollapsed = this.paletteCollapsedSignal.asReadonly();
  readonly inspectorCollapsed = this.inspectorCollapsedSignal.asReadonly();
  readonly resizing = this.resizingSignal.asReadonly();

  readonly compact = computed(() => {
    const availability = this.viewport.availability();
    return (
      resolveWorkspaceLayout(
        {
          width: availability.width,
          height: availability.height,
          coarsePointer: availability.coarsePointer,
        },
        availability,
      ) === 'compact'
    );
  });

  readonly paletteEffectiveWidthPx = computed(() =>
    this.compact() || !this.paletteCollapsed()
      ? this.paletteWidthSignal()
      : BUILDER_COLLAPSED_PANEL_WIDTH_PX,
  );

  readonly inspectorEffectiveWidthPx = computed(() =>
    this.compact() || !this.inspectorCollapsed()
      ? this.inspectorWidthSignal()
      : BUILDER_COLLAPSED_PANEL_WIDTH_PX,
  );

  readonly workspaceGridTemplate = computed(() => {
    if (this.compact()) {
      return '1fr';
    }
    const palette = this.paletteEffectiveWidthPx();
    const inspector = this.inspectorEffectiveWidthPx();
    const splitter = BUILDER_PANEL_SPLITTER_WIDTH_PX;
    return `${palette}px ${splitter}px 1fr ${splitter}px ${inspector}px`;
  });

  constructor() {
    effect(() => {
      if (!this.compact()) {
        this.paletteOpenSignal.set(false);
        this.inspectorOpenSignal.set(false);
      }
    });

    effect(() => {
      if (!this.compact()) {
        return;
      }

      const selectedNodeId = this.state.selectedNodeId();
      if (selectedNodeId) {
        this.inspectorOpenSignal.set(true);
        this.paletteOpenSignal.set(false);
      }
    });
  }

  togglePalette(): void {
    this.paletteOpenSignal.update((open) => !open);
    if (this.paletteOpenSignal()) {
      this.inspectorOpenSignal.set(false);
    }
  }

  toggleInspector(): void {
    this.inspectorOpenSignal.update((open) => !open);
    if (this.inspectorOpenSignal()) {
      this.paletteOpenSignal.set(false);
    }
  }

  closePanels(): void {
    this.paletteOpenSignal.set(false);
    this.inspectorOpenSignal.set(false);
  }

  togglePaletteCollapsed(): void {
    if (this.compact()) {
      return;
    }
    if (this.paletteCollapsedSignal()) {
      this.paletteCollapsedSignal.set(false);
      this.resetPaletteWidth();
    } else {
      this.paletteCollapsedSignal.set(true);
    }
    this.persistCollapsed(PALETTE_COLLAPSED_KEY, this.paletteCollapsedSignal());
  }

  toggleInspectorCollapsed(): void {
    if (this.compact()) {
      return;
    }
    if (this.inspectorCollapsedSignal()) {
      this.inspectorCollapsedSignal.set(false);
      this.resetInspectorWidth();
    } else {
      this.inspectorCollapsedSignal.set(true);
    }
    this.persistCollapsed(INSPECTOR_COLLAPSED_KEY, this.inspectorCollapsedSignal());
  }

  beginPanelResize(side: 'palette' | 'inspector', clientX: number): void {
    if (this.compact()) {
      return;
    }
    if (side === 'palette' && this.paletteCollapsed()) {
      this.paletteCollapsedSignal.set(false);
      this.persistCollapsed(PALETTE_COLLAPSED_KEY, false);
    }
    if (side === 'inspector' && this.inspectorCollapsed()) {
      this.inspectorCollapsedSignal.set(false);
      this.persistCollapsed(INSPECTOR_COLLAPSED_KEY, false);
    }
    this.resizeSession = {
      side,
      startX: clientX,
      startWidth:
        side === 'palette' ? this.paletteWidthSignal() : this.inspectorWidthSignal(),
    };
    this.resizingSignal.set(true);
  }

  updatePanelResize(clientX: number): void {
    if (!this.resizeSession) {
      return;
    }
    const delta = clientX - this.resizeSession.startX;
    if (this.resizeSession.side === 'palette') {
      this.setPaletteWidth(this.resizeSession.startWidth + delta);
      return;
    }
    this.setInspectorWidth(this.resizeSession.startWidth - delta);
  }

  endPanelResize(): void {
    this.resizeSession = null;
    this.resizingSignal.set(false);
  }

  private setPaletteWidth(width: number): void {
    const clamped = clampPanelWidth(width);
    this.paletteWidthSignal.set(clamped);
    this.persistWidth(PALETTE_WIDTH_KEY, clamped);
  }

  private setInspectorWidth(width: number): void {
    const clamped = clampPanelWidth(width);
    this.inspectorWidthSignal.set(clamped);
    this.persistWidth(INSPECTOR_WIDTH_KEY, clamped);
  }

  private resetPaletteWidth(): void {
    this.setPaletteWidth(BUILDER_DEFAULT_PALETTE_WIDTH_PX);
  }

  private resetInspectorWidth(): void {
    this.setInspectorWidth(BUILDER_DEFAULT_INSPECTOR_WIDTH_PX);
  }

  private persistWidth(key: string, width: number): void {
    try {
      localStorage.setItem(key, String(width));
    } catch {
      // ignore storage failures in tests or private browsing
    }
  }

  private persistCollapsed(key: string, collapsed: boolean): void {
    try {
      localStorage.setItem(key, collapsed ? '1' : '0');
    } catch {
      // ignore storage failures in tests or private browsing
    }
  }
}
