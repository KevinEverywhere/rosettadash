import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { BuilderStateService } from './builder-state.service';
import { BuilderWorkspaceLayoutService } from './builder-workspace-layout.service';
import { DisplayAvailabilityService } from './display-availability.service';

describe('BuilderWorkspaceLayoutService', () => {
  const availability = signal({
    width: 1024,
    height: 768,
    coarsePointer: true,
    tier: 'tablet-landscape' as const,
    allowed: true,
    reason: null,
  });

  beforeEach(() => {
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
});
