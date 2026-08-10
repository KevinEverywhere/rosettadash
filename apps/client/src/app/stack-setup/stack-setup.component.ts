import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  DATABASE_TARGET_OPTIONS,
  getCompatibleStackDefaults,
  normalizeStackProfile,
  SERVER_TARGET_OPTIONS,
  type DatabaseTargetChoice,
  type ServerTargetChoice,
  type StackProfile,
  type UiFrameworkChoice,
  UI_FRAMEWORK_OPTIONS,
} from '@dashbuilder/core';
import {
  hasBuilderSession,
  writePendingStackProfile,
} from './stack-profile-session';

@Component({
  selector: 'app-stack-setup',
  templateUrl: './stack-setup.component.html',
  styleUrl: './stack-setup.component.scss',
})
export class StackSetupComponent implements OnInit {
  private readonly router = inject(Router);

  protected readonly uiOptions = UI_FRAMEWORK_OPTIONS;
  protected readonly serverOptions = SERVER_TARGET_OPTIONS;
  protected readonly databaseOptions = DATABASE_TARGET_OPTIONS;

  protected readonly uiChoice = signal<UiFrameworkChoice>('react');
  protected readonly serverChoice = signal<ServerTargetChoice>('next');
  protected readonly databaseChoice = signal<DatabaseTargetChoice>('postgresql');

  ngOnInit(): void {
    if (hasBuilderSession()) {
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
  }

  private buildProfile(): StackProfile {
    if (this.uiChoice() === 'any') {
      return { ui: 'any' };
    }

    return {
      ui: this.uiChoice(),
      server: this.serverChoice(),
      database: this.databaseChoice(),
    };
  }
}
