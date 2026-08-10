import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  type DisplayAvailability,
  readViewportMetrics,
  resolveDisplayAvailability,
} from '@dashbuilder/core';

@Injectable({ providedIn: 'root' })
export class DisplayAvailabilityService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly availabilitySignal = signal<DisplayAvailability>(this.readAvailability());

  readonly availability = this.availabilitySignal.asReadonly();

  constructor() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const refresh = (): void => {
      this.availabilitySignal.set(this.readAvailability());
    };

    window.addEventListener('resize', refresh);
    window.addEventListener('orientationchange', refresh);
  }

  blocked(): boolean {
    return !this.availabilitySignal().allowed;
  }

  refresh(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.availabilitySignal.set(this.readAvailability());
  }

  private readAvailability(): DisplayAvailability {
    if (!isPlatformBrowser(this.platformId)) {
      return resolveDisplayAvailability({
        width: 1440,
        height: 900,
        coarsePointer: false,
      });
    }

    return resolveDisplayAvailability(readViewportMetrics(window));
  }
}
