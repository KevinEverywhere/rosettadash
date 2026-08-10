import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
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
  type StackProfile,
  type StackServerChoice,
  type StackStylingProfile,
  type StylingAuthoring,
  type StylingComponentLibrary,
  type StylingFoundation,
  type UiFrameworkChoice,
  UI_FRAMEWORK_OPTIONS,
} from '@dashbuilder/core';
import { ProjectsApiService } from '../builder/projects-api.service';
import {
  clearBuilderSession,
  hasBuilderSession,
  readActiveStackProfile,
  readBuilderSession,
  readPendingStackProfile,
  writeActiveStackProfile,
  writePendingStackProfile,
} from './stack-profile-session';

type WelcomeSection = 'ui' | 'server' | 'database' | 'styling';
type WelcomeConfirmKind = 'stack-change-target' | 'start-fresh-unchanged';
type StackChangeTarget = 'current' | 'fresh';

@Component({
  selector: 'app-welcome-page',
  imports: [RouterLink],
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly projectsApi = inject(ProjectsApiService);

  protected readonly appName = APP_NAME;
  protected readonly uiOptions = UI_FRAMEWORK_OPTIONS;
  protected readonly serverOptions = SERVER_STACK_OPTIONS;
  protected readonly databaseOptions = DATABASE_STACK_OPTIONS;
  protected readonly serverEcosystemNote = SERVER_STACK_ECOSYSTEM_NOTE;

  protected readonly uiChoice = signal<UiFrameworkChoice | null>(null);
  protected readonly serverChoice = signal<StackServerChoice | null>(null);
  protected readonly databaseChoice = signal<StackDatabaseChoice | null>(null);
  protected readonly stylingProfile = signal<StackStylingProfile | null>(null);
  protected readonly openSections = signal<ReadonlySet<WelcomeSection>>(new Set());
  protected readonly confirmDialog = signal<WelcomeConfirmKind | null>(null);

  private readonly isReturningUser = signal(false);
  private baselineProfile: StackProfile | null = null;
  private stackChangeTarget: StackChangeTarget | null = null;
  private pendingStackMutation: (() => void) | null = null;

  protected readonly foundationOptions = computed(() => {
    const ui = this.uiChoice();
    return ui ? getCompatibleStylingFoundations(ui) : [];
  });
  protected readonly componentLibraryOptions = computed(() => {
    const ui = this.uiChoice();
    return ui ? getCompatibleStylingComponentLibraries(ui) : [];
  });
  protected readonly authoringOptions = computed(() => {
    const ui = this.uiChoice();
    return ui ? getCompatibleStylingAuthoring(ui) : [];
  });

  protected readonly selectedUiLabel = computed(() => {
    const ui = this.uiChoice();
    if (!ui) {
      return '';
    }
    return this.uiOptions.find((option) => option.id === ui)?.label ?? '';
  });

  protected readonly stylingSummary = computed(() => {
    const profile = this.stylingProfile();
    return profile ? formatStylingProfileSummary(profile) : '';
  });

  protected readonly serverSummary = computed(() => {
    const server = this.serverChoice();
    if (!server) {
      return '';
    }
    return this.serverOptions.find((option) => option.id === server)?.label ?? '';
  });

  protected readonly databaseSummary = computed(() => {
    const database = this.databaseChoice();
    if (!database) {
      return '';
    }
    return this.databaseOptions.find((option) => option.id === database)?.label ?? '';
  });

  protected readonly showFrameworkPrompt = computed(() => this.uiChoice() === null);

  protected stylingSectionTitle(): string {
    const ui = this.uiChoice();
    return ui ? `Styling for ${this.selectedUiLabel()}` : 'Styling';
  }

  ngOnInit(): void {
    const pending = readPendingStackProfile();
    if (pending) {
      this.hydrateFromProfile(pending);
      return;
    }

    if (hasBuilderSession()) {
      this.isReturningUser.set(true);
      const active = readActiveStackProfile();
      if (active) {
        this.hydrateFromProfile(active);
        this.captureBaseline();
      }
    }
  }

  protected hasExistingSession(): boolean {
    return hasBuilderSession();
  }

  protected hasUiChoice(): boolean {
    return this.uiChoice() !== null;
  }

  protected canContinue(): boolean {
    return this.hasUiChoice();
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
    this.requestStackMutation(() => {
      this.uiChoice.set(ui);
      this.applyUiDefaults(ui);
    });
  }

  protected selectServer(server: StackServerChoice): void {
    this.requestStackMutation(() => this.serverChoice.set(server));
  }

  protected selectDatabase(database: StackDatabaseChoice): void {
    this.requestStackMutation(() => this.databaseChoice.set(database));
  }

  protected isFoundationSelected(foundation: StylingFoundation): boolean {
    return this.stylingProfile()?.foundation.includes(foundation) ?? false;
  }

  protected toggleFoundation(foundation: StylingFoundation): void {
    this.requestStackMutation(() => {
      const ui = this.uiChoice();
      const current = this.stylingProfile();
      if (!ui || !current) {
        return;
      }
      const next = current.foundation.includes(foundation)
        ? current.foundation.filter((item) => item !== foundation)
        : [...current.foundation, foundation];
      this.stylingProfile.set(normalizeStackStyling(ui, { ...current, foundation: next }));
    });
  }

  protected isComponentLibrarySelected(library: StylingComponentLibrary): boolean {
    return this.stylingProfile()?.componentLibrary === library;
  }

  protected selectComponentLibrary(library: StylingComponentLibrary): void {
    this.requestStackMutation(() => {
      const ui = this.uiChoice();
      const current = this.stylingProfile();
      if (!ui || !current) {
        return;
      }
      this.stylingProfile.set(
        normalizeStackStyling(ui, {
          ...current,
          componentLibrary: current.componentLibrary === library ? undefined : library,
        }),
      );
    });
  }

  protected isAuthoringSelected(authoring: StylingAuthoring): boolean {
    return this.stylingProfile()?.authoring.includes(authoring) ?? false;
  }

  protected toggleAuthoring(authoring: StylingAuthoring): void {
    this.requestStackMutation(() => {
      const ui = this.uiChoice();
      const current = this.stylingProfile();
      if (!ui || !current) {
        return;
      }
      const next = current.authoring.includes(authoring)
        ? current.authoring.filter((item) => item !== authoring)
        : [...current.authoring, authoring];
      this.stylingProfile.set(normalizeStackStyling(ui, { ...current, authoring: next }));
    });
  }

  protected setInlineStyles(enabled: boolean): void {
    this.requestStackMutation(() => {
      const ui = this.uiChoice();
      const current = this.stylingProfile();
      if (!ui || !current) {
        return;
      }
      this.stylingProfile.set(
        normalizeStackStyling(ui, {
          ...current,
          inlineStyles: enabled,
        }),
      );
    });
  }

  protected isScratchPad(): boolean {
    return this.uiChoice() === 'any';
  }

  protected requestContinue(): void {
    void this.continueToBuilder();
  }

  protected requestStartFresh(): void {
    if (this.isReturningUser() && !this.isStackDirty()) {
      this.confirmDialog.set('start-fresh-unchanged');
      return;
    }
    void this.continueToBuilder({ fresh: true });
  }

  protected confirmStackChangeTarget(target: StackChangeTarget): void {
    this.stackChangeTarget = target;
    this.pendingStackMutation?.();
    this.pendingStackMutation = null;
    this.confirmDialog.set(null);
    if (target === 'current') {
      this.captureBaseline();
      void this.persistStackToCurrentProject();
    }
  }

  protected cancelConfirmDialog(): void {
    this.pendingStackMutation = null;
    this.confirmDialog.set(null);
  }

  protected startFreshWithExistingStack(): void {
    this.confirmDialog.set(null);
    void this.continueToBuilder({ fresh: true, useBaselineStack: true });
  }

  protected dismissStartFreshDialog(): void {
    this.confirmDialog.set(null);
  }

  protected async continueToBuilder(options?: {
    fresh?: boolean;
    useBaselineStack?: boolean;
  }): Promise<void> {
    const fresh = options?.fresh ?? false;
    const useBaselineStack = options?.useBaselineStack ?? false;

    if (!this.hasUiChoice() && !useBaselineStack) {
      return;
    }

    if (fresh) {
      clearBuilderSession();
      const profile =
        normalizeStackProfile(
          useBaselineStack && this.baselineProfile
            ? this.baselineProfile
            : this.buildProfile(),
        ) ?? { ui: 'any' };
      writePendingStackProfile(profile);
      void this.router.navigate(['/builder']);
      return;
    }

    if (hasBuilderSession()) {
      void this.router.navigate(['/builder']);
      return;
    }

    const profile = normalizeStackProfile(this.buildProfile()) ?? { ui: 'any' };
    writePendingStackProfile(profile);
    void this.router.navigate(['/builder']);
  }

  private requestStackMutation(mutate: () => void): void {
    if (!this.isReturningUser() || !this.baselineProfile) {
      mutate();
      return;
    }

    if (this.stackChangeTarget === 'fresh') {
      mutate();
      return;
    }

    const snapshot = this.buildProfile();
    mutate();
    if (
      JSON.stringify(this.buildProfile()) === JSON.stringify(this.baselineProfile) ||
      JSON.stringify(this.buildProfile()) === JSON.stringify(snapshot)
    ) {
      return;
    }

    this.hydrateFromProfile(snapshot);
    this.pendingStackMutation = mutate;
    this.confirmDialog.set('stack-change-target');
  }

  private async persistStackToCurrentProject(): Promise<void> {
    const session = readBuilderSession();
    const profile = normalizeStackProfile(this.buildProfile());
    if (!session || !profile) {
      return;
    }

    try {
      await firstValueFrom(
        this.projectsApi.updateProject(session.projectId, { stackProfile: profile }),
      );
      writeActiveStackProfile(profile);
    } catch {
      // Keep local edits; builder resume still works with prior project stack.
    }
  }

  private isStackDirty(): boolean {
    if (!this.baselineProfile || !this.hasUiChoice()) {
      return false;
    }
    return JSON.stringify(this.buildProfile()) !== JSON.stringify(this.baselineProfile);
  }

  private captureBaseline(): void {
    if (!this.hasUiChoice()) {
      this.baselineProfile = null;
      return;
    }
    this.baselineProfile = this.buildProfile();
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
    const ui = this.uiChoice() ?? 'any';
    return {
      ui,
      ...(ui === 'any'
        ? {}
        : {
            server: this.serverChoice() ?? 'none',
            database: this.databaseChoice() ?? 'none',
          }),
      styling: this.stylingProfile() ?? getDefaultStylingProfile(ui),
    };
  }

  private hydrateFromProfile(profile: StackProfile): void {
    this.uiChoice.set(profile.ui);
    if (profile.ui === 'any') {
      this.serverChoice.set(null);
      this.databaseChoice.set(null);
    } else {
      const defaults = getCompatibleStackDefaults(profile.ui);
      this.serverChoice.set(profile.server ?? defaults.server ?? 'none');
      this.databaseChoice.set(profile.database ?? defaults.database ?? 'none');
    }
    this.stylingProfile.set(
      normalizeStackStyling(profile.ui, profile.styling ?? getDefaultStylingProfile(profile.ui)),
    );
  }
}
