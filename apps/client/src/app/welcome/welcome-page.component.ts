import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  APP_NAME,
  DATABASE_STACK_OPTIONS,
  formatStylingProfileSummary,
  getCompatibleStackDefaults,
  getCompatibleStylingAuthoring,
  getCompatibleStylingComponentLibraries,
  getCompatibleStylingFoundations,
  getDefaultStylingProfile,
  normalizeStackProfile,
  normalizeStackStyling,
  SERVER_STACK_ECOSYSTEM_NOTE,
  SERVER_STACK_OPTIONS,
  type StackDatabaseChoice,
  type StackServerChoice,
  type StackProfile,
  type StackStylingProfile,
  type StylingAuthoring,
  type StylingComponentLibrary,
  type StylingFoundation,
  type UiFrameworkChoice,
  UI_FRAMEWORK_OPTIONS,
} from '@dashbuilder/core';
import {
  clearBuilderSession,
  hasBuilderSession,
  readPendingStackProfile,
  writePendingStackProfile,
} from './stack-profile-session';

type WelcomeSection = 'ui' | 'server' | 'database' | 'styling';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent implements OnInit {
  private readonly router = inject(Router);

  protected readonly appName = APP_NAME;
  protected readonly uiOptions = UI_FRAMEWORK_OPTIONS;
  protected readonly serverOptions = SERVER_STACK_OPTIONS;
  protected readonly databaseOptions = DATABASE_STACK_OPTIONS;
  protected readonly serverEcosystemNote = SERVER_STACK_ECOSYSTEM_NOTE;

  protected readonly uiChoice = signal<UiFrameworkChoice>('react');
  protected readonly serverChoice = signal<StackServerChoice>('next');
  protected readonly databaseChoice = signal<StackDatabaseChoice>('postgresql');
  protected readonly stylingProfile = signal<StackStylingProfile>(getDefaultStylingProfile('react'));
  protected readonly openSections = signal<ReadonlySet<WelcomeSection>>(new Set(['ui']));

  protected readonly foundationOptions = computed(() =>
    getCompatibleStylingFoundations(this.uiChoice()),
  );
  protected readonly componentLibraryOptions = computed(() =>
    getCompatibleStylingComponentLibraries(this.uiChoice()),
  );
  protected readonly authoringOptions = computed(() =>
    getCompatibleStylingAuthoring(this.uiChoice()),
  );

  protected readonly selectedUiLabel = computed(
    () => this.uiOptions.find((option) => option.id === this.uiChoice())?.label ?? 'your stack',
  );

  protected readonly stylingSummary = computed(() => formatStylingProfileSummary(this.stylingProfile()));

  protected readonly serverSummary = computed(
    () => this.serverOptions.find((option) => option.id === this.serverChoice())?.label ?? '',
  );

  protected readonly databaseSummary = computed(
    () => this.databaseOptions.find((option) => option.id === this.databaseChoice())?.label ?? '',
  );

  protected hasExistingSession(): boolean {
    return hasBuilderSession();
  }

  ngOnInit(): void {
    const pending = readPendingStackProfile();
    if (pending) {
      this.hydrateFromProfile(pending);
      return;
    }

    this.applyUiDefaults('react');
  }

  protected isSectionOpen(section: WelcomeSection): boolean {
    return this.openSections().has(section);
  }

  protected toggleSection(section: WelcomeSection): void {
    const next = new Set(this.openSections());
    if (next.has(section)) {
      next.delete(section);
    } else {
      next.add(section);
    }
    this.openSections.set(next);
  }

  protected selectUi(ui: UiFrameworkChoice): void {
    this.uiChoice.set(ui);
    this.applyUiDefaults(ui);
  }

  protected selectServer(server: StackServerChoice): void {
    this.serverChoice.set(server);
  }

  protected selectDatabase(database: StackDatabaseChoice): void {
    this.databaseChoice.set(database);
  }

  protected isFoundationSelected(foundation: StylingFoundation): boolean {
    return this.stylingProfile().foundation.includes(foundation);
  }

  protected toggleFoundation(foundation: StylingFoundation): void {
    const current = this.stylingProfile();
    const next = current.foundation.includes(foundation)
      ? current.foundation.filter((item) => item !== foundation)
      : [...current.foundation, foundation];
    this.stylingProfile.set(
      normalizeStackStyling(this.uiChoice(), { ...current, foundation: next }),
    );
  }

  protected isComponentLibrarySelected(library: StylingComponentLibrary): boolean {
    return this.stylingProfile().componentLibrary === library;
  }

  protected selectComponentLibrary(library: StylingComponentLibrary): void {
    const current = this.stylingProfile();
    this.stylingProfile.set(
      normalizeStackStyling(this.uiChoice(), {
        ...current,
        componentLibrary: current.componentLibrary === library ? undefined : library,
      }),
    );
  }

  protected isAuthoringSelected(authoring: StylingAuthoring): boolean {
    return this.stylingProfile().authoring.includes(authoring);
  }

  protected toggleAuthoring(authoring: StylingAuthoring): void {
    const current = this.stylingProfile();
    const next = current.authoring.includes(authoring)
      ? current.authoring.filter((item) => item !== authoring)
      : [...current.authoring, authoring];
    this.stylingProfile.set(
      normalizeStackStyling(this.uiChoice(), { ...current, authoring: next }),
    );
  }

  protected setInlineStyles(enabled: boolean): void {
    this.stylingProfile.set(
      normalizeStackStyling(this.uiChoice(), {
        ...this.stylingProfile(),
        inlineStyles: enabled,
      }),
    );
  }

  protected isScratchPad(): boolean {
    return this.uiChoice() === 'any';
  }

  protected continueToBuilder(options?: { fresh?: boolean }): void {
    const fresh = options?.fresh ?? false;

    if (fresh) {
      clearBuilderSession();
    }

    if (fresh || !hasBuilderSession()) {
      const profile = normalizeStackProfile(this.buildProfile()) ?? { ui: 'any' };
      writePendingStackProfile(profile);
    }

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
    this.stylingProfile.set(
      normalizeStackStyling(ui, defaults.styling ?? getDefaultStylingProfile(ui)),
    );
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
      styling: this.stylingProfile(),
    };
  }

  private hydrateFromProfile(profile: StackProfile): void {
    this.uiChoice.set(profile.ui);
    if (profile.server !== undefined) {
      this.serverChoice.set(profile.server);
    }
    if (profile.database !== undefined) {
      this.databaseChoice.set(profile.database);
    }
    this.stylingProfile.set(normalizeStackStyling(profile.ui, profile.styling));
  }
}
