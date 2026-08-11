import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { resolveWorkspaceLayout } from '@rosettadash/core';
import { BuilderStateService } from './builder-state.service';
import { DisplayAvailabilityService } from './display-availability.service';

@Injectable({ providedIn: 'root' })
export class BuilderWorkspaceLayoutService {
  private readonly viewport = inject(DisplayAvailabilityService);
  private readonly state = inject(BuilderStateService);

  private readonly paletteOpenSignal = signal(false);
  private readonly inspectorOpenSignal = signal(false);

  readonly paletteOpen = this.paletteOpenSignal.asReadonly();
  readonly inspectorOpen = this.inspectorOpenSignal.asReadonly();

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
}
