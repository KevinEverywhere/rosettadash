import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import {
  BUILDER_COLLAPSED_PANEL_WIDTH_PX,
  BUILDER_DEFAULT_INSPECTOR_WIDTH_PX,
  BUILDER_DEFAULT_PALETTE_WIDTH_PX,
  BUILDER_PANEL_SPLITTER_WIDTH_PX,
  BuilderWorkspaceLayoutService,
} from './builder-workspace-layout.service';
import { BuilderStateService } from './builder-state.service';
import { DisplayAvailabilityService } from './display-availability.service';

describe('BuilderWorkspaceLayoutService', () => {
  const availability = signal({
    width: 1024,
    height: 768,
    coarsePointer: true,
    tier: 'tablet-landscape' as 'tablet-landscape' | 'desktop',
    allowed: true,
    reason: null,
  });

  beforeEach(() => {
    try {
      localStorage.clear();
    } catch {
      // jsdom may not provide localStorage in all test runs
    }
    TestBed.configureTestingModule({
      providers: [
        BuilderWorkspaceLayoutService,
        {
          provide: DisplayAvailabilityService,
          useValue: { availability },
        },
        {
          provide: BuilderStateService,
          useValue: {
            selectedNodeId: signal<string | null>(null),
          },
        },
      ],
    });
  });

  it('detects compact layout at tablet widths', () => {
    const layout = TestBed.inject(BuilderWorkspaceLayoutService);
    expect(layout.compact()).toBe(true);
  });

  it('toggles palette and closes inspector', () => {
    const layout = TestBed.inject(BuilderWorkspaceLayoutService);

    layout.toggleInspector();
    expect(layout.inspectorOpen()).toBe(true);

    layout.togglePalette();
    expect(layout.paletteOpen()).toBe(true);
    expect(layout.inspectorOpen()).toBe(false);
  });

  it('builds a five-column grid with splitters in full layout', () => {
    availability.set({
      width: 1440,
      height: 900,
      coarsePointer: false,
      tier: 'desktop',
      allowed: true,
      reason: null,
    });
    const layout = TestBed.inject(BuilderWorkspaceLayoutService);
    expect(layout.compact()).toBe(false);
    expect(layout.workspaceGridTemplate()).toBe(
      `${BUILDER_DEFAULT_PALETTE_WIDTH_PX}px ${BUILDER_PANEL_SPLITTER_WIDTH_PX}px 1fr ${BUILDER_PANEL_SPLITTER_WIDTH_PX}px ${BUILDER_DEFAULT_INSPECTOR_WIDTH_PX}px`,
    );
  });

  it('collapses palette width against the left edge', () => {
    availability.set({
      width: 1440,
      height: 900,
      coarsePointer: false,
      tier: 'desktop',
      allowed: true,
      reason: null,
    });
    const layout = TestBed.inject(BuilderWorkspaceLayoutService);
    layout.togglePaletteCollapsed();
    expect(layout.paletteCollapsed()).toBe(true);
    expect(layout.paletteEffectiveWidthPx()).toBe(BUILDER_COLLAPSED_PANEL_WIDTH_PX);
  });

  it('resets stretched palette width to default when expanding from collapsed', () => {
    availability.set({
      width: 1440,
      height: 900,
      coarsePointer: false,
      tier: 'desktop',
      allowed: true,
      reason: null,
    });
    const layout = TestBed.inject(BuilderWorkspaceLayoutService);
    layout.beginPanelResize('palette', 100);
    layout.updatePanelResize(180);
    layout.endPanelResize();
    expect(layout.paletteWidthPx()).toBe(BUILDER_DEFAULT_PALETTE_WIDTH_PX + 80);

    layout.togglePaletteCollapsed();
    expect(layout.paletteCollapsed()).toBe(true);

    layout.togglePaletteCollapsed();
    expect(layout.paletteCollapsed()).toBe(false);
    expect(layout.paletteWidthPx()).toBe(BUILDER_DEFAULT_PALETTE_WIDTH_PX);
    expect(layout.paletteEffectiveWidthPx()).toBe(BUILDER_DEFAULT_PALETTE_WIDTH_PX);
  });

  it('resizes the palette and persists width', () => {
    availability.set({
      width: 1440,
      height: 900,
      coarsePointer: false,
      tier: 'desktop',
      allowed: true,
      reason: null,
    });
    const layout = TestBed.inject(BuilderWorkspaceLayoutService);
    layout.beginPanelResize('palette', 100);
    layout.updatePanelResize(140);
    layout.endPanelResize();
    expect(layout.paletteWidthPx()).toBe(BUILDER_DEFAULT_PALETTE_WIDTH_PX + 40);
    if (typeof localStorage !== 'undefined') {
      expect(localStorage.getItem('rosettadash:builder:palette-width')).toBe(
        String(BUILDER_DEFAULT_PALETTE_WIDTH_PX + 40),
      );
    }
  });
});
