import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  APP_NAME,
  DISPLAY_AVAILABILITY_COPY,
  type DisplayAvailability,
} from '@dashbuilder/core';
import { DisplayAvailabilityService } from './display-availability.service';

@Component({
  selector: 'app-builder-viewport-gate',
  imports: [RouterLink],
  templateUrl: './builder-viewport-gate.component.html',
  styleUrl: './builder-viewport-gate.component.scss',
})
export class BuilderViewportGateComponent {
  private readonly displayAvailability = inject(DisplayAvailabilityService);

  readonly availability = input.required<DisplayAvailability>();
  protected readonly appName = APP_NAME;

  protected copy() {
    const reason = this.availability().reason;
    return reason ? DISPLAY_AVAILABILITY_COPY[reason] : null;
  }

  protected retry(): void {
    this.displayAvailability.refresh();
  }
}
