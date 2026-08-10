import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  APP_NAME,
  DATABASE_TARGET_OPTIONS,
  getCompatibleStackDefaults,
  getCompatibleStylingOptions,
  getDefaultStyling,
  normalizeStackProfile,
  SERVER_TARGET_OPTIONS,
  type DatabaseTargetChoice,
  type ServerTargetChoice,
  type StackProfile,
  type StylingFrameworkChoice,
  type UiFrameworkChoice,
  UI_FRAMEWORK_OPTIONS,
} from '@dashbuilder/core';
import {
  canEnterBuilder,
  writePendingStackProfile,
} from './stack-profile-session';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent implements OnInit {
  private readonly router = inject(Router);

  protected readonly appName = APP_NAME;
  protected readonly uiOptions = UI_FRAMEWORK_OPTIONS;
  protected readonly serverOptions = SERVER_TARGET_OPTIONS;
  protected readonly databaseOptions = DATABASE_TARGET_OPTIONS;

  protected readonly uiChoice = signal<UiFrameworkChoice>('react');
  protected readonly serverChoice = signal<ServerTargetChoice>('next');
  protected readonly databaseChoice = signal<DatabaseTargetChoice>('postgresql');
  protected readonly stylingChoice = signal<StylingFrameworkChoice>('tailwind');

  protected readonly stylingOptions = computed(() =>
    getCompatibleStylingOptions(this.uiChoice()),
  );

  protected readonly selectedUiLabel = computed(
    () => this.uiOptions.find((option) => option.id === this.uiChoice())?.label ?? 'your stack',
  );

  ngOnInit(): void {
    if (canEnterBuilder()) {
      void this.router.navigate(['/builder']);
      return;
    }

    this.applyUiDefaults('react');
  }

  protected selectUi(ui: UiFrameworkChoice): void {
    this.uiChoice.set(ui);
    this.applyUiDefaults(ui);
  }

  protected selectServer(server: ServerTargetChoice): void {
    this.serverChoice.set(server);
  }

  protected selectDatabase(database: DatabaseTargetChoice): void {
    this.databaseChoice.set(database);
  }

  protected selectStyling(styling: StylingFrameworkChoice): void {
    this.stylingChoice.set(styling);
  }

  protected isScratchPad(): boolean {
    return this.uiChoice() === 'any';
  }

  protected continueToBuilder(): void {
    const profile = normalizeStackProfile(this.buildProfile()) ?? { ui: 'any' };
    writePendingStackProfile(profile);
    void this.router.navigate(['/builder']);
  }

  private applyUiDefaults(ui: UiFrameworkChoice): void {
    const defaults = getCompatibleStackDefaults(ui);
    if (defaults.server) {
      this.serverChoice.set(defaults.server);
    }
    if (defaults.database) {
      this.databaseChoice.set(defaults.database);
    }
    this.stylingChoice.set(defaults.styling ?? getDefaultStyling(ui));
  }

  private buildProfile(): StackProfile {
    return {
      ui: this.uiChoice(),
      ...(this.uiChoice() === 'any'
        ? {}
        : {
            server: this.serverChoice(),
            database: this.databaseChoice(),
          }),
      styling: this.stylingChoice(),
    };
  }
}
