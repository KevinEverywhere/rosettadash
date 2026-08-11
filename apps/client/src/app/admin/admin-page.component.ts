import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  APP_NAME,
  defaultComponentRegistry,
  getAiProvider,
  getGroupingGuide,
  resolvePaletteGroups,
  type ComponentGroupingGuide,
} from '@dashbuilder/core';
import { ActivatedRoute } from '@angular/router';
import { AppNavComponent } from '../shared/app-nav/app-nav.component';
import { AppCollapsibleComponent } from '../shared/app-collapsible/app-collapsible.component';
import { BuilderGuideCardComponent } from '../builder/grouping/builder-guide-card.component';
import { AiAssistService } from '../builder/ai/ai-assist.service';
import { BuilderStateService } from '../builder/builder-state.service';
import { SpeechInputService } from '../builder/ai/speech-input.service';
import { AppLockService } from '../environment/app-lock.service';
import { EnvironmentConfigService } from '../environment/environment-config.service';
import {
  canEnterBuilder,
  readActiveStackProfile,
  writeLibraryRestore,
} from '../welcome/stack-profile-session';
import { AdminFeatureFlagsService } from './admin-feature-flags.service';
import { ContentLibraryService } from './content-library.service';

export type AdminSectionId = 'content' | 'integrations' | 'guides' | 'catalog';

const SECTION_ORDER: AdminSectionId[] = ['content', 'integrations', 'guides', 'catalog'];

const SECTION_LABELS: Record<AdminSectionId, string> = {
  content: 'Saved content',
  integrations: 'AI, voice & environment',
  guides: 'Builder guides',
  catalog: 'Component catalog',
};

@Component({
  selector: 'app-admin-page',
  imports: [FormsModule, NgClass, DatePipe, AppNavComponent, AppCollapsibleComponent, BuilderGuideCardComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent implements OnInit {
  protected readonly appName = APP_NAME;
  protected readonly sections = SECTION_ORDER;
  protected readonly sectionLabels = SECTION_LABELS;

  protected readonly library = inject(ContentLibraryService);
  protected readonly flags = inject(AdminFeatureFlagsService);
  protected readonly environment = inject(EnvironmentConfigService);
  protected readonly appLock = inject(AppLockService);
  protected readonly aiAssist = inject(AiAssistService);
  protected readonly speech = inject(SpeechInputService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly builderState = inject(BuilderStateService);

  readonly openSection = signal<AdminSectionId | null>('content');
  readonly openGuideType = signal<string | null>(null);
  readonly saveLabel = signal('');
  readonly loaded = signal(false);

  readonly canOpenBuilder = computed(() => canEnterBuilder());
  readonly hasActiveWorkspace = computed(
    () => !!this.builderState.project() && !!this.builderState.composite(),
  );

  readonly paletteGroups = computed(() => resolvePaletteGroups(defaultComponentRegistry));
  readonly componentCount = computed(() => defaultComponentRegistry.list().length);

  readonly builderGuides = computed(() =>
    defaultComponentRegistry
      .list()
      .map((definition) => ({
        type: definition.type,
        label: definition.label,
        guide: getGroupingGuide(definition.type),
      }))
      .filter((entry): entry is { type: string; label: string; guide: ComponentGroupingGuide } => !!entry.guide),
  );

  readonly aiProviderLabel = computed(() => {
    const provider = getAiProvider(this.environment.settings().byok.activeProvider);
    return provider.label;
  });

  async ngOnInit(): Promise<void> {
    this.library.initialize();
    this.flags.initialize();
    this.appLock.initialize();
    await this.environment.initialize();
    await this.aiAssist.refreshReadiness();
    const section = this.route.snapshot.queryParamMap.get('section');
    if (
      section === 'guides' ||
      section === 'content' ||
      section === 'integrations' ||
      section === 'catalog' ||
      section === 'features'
    ) {
      this.openSection.set(section === 'features' ? 'integrations' : section);
    }
    this.loaded.set(true);
  }

  isGuideOpen(type: string): boolean {
    return this.openGuideType() === type;
  }

  toggleGuide(type: string): void {
    this.openGuideType.update((current) => (current === type ? null : type));
  }

  isSectionOpen(section: AdminSectionId): boolean {
    return this.openSection() === section;
  }

  toggleSection(section: AdminSectionId): void {
    this.openSection.update((current) => (current === section ? null : section));
  }

  sectionSummary(section: AdminSectionId): string | null {
    switch (section) {
      case 'content':
        return this.library.entries().length
          ? `${this.library.entries().length} saved`
          : 'Empty';
      case 'integrations': {
        const current = this.flags.flags();
        const readiness = this.aiAssist.readiness()?.ready ? 'AI ready' : 'Setup needed';
        return `${readiness} · AI ${current.aiDrawerEnabled ? 'on' : 'off'} · Voice ${current.voiceInputEnabled ? 'on' : 'off'}`;
      }
      case 'guides':
        return `${this.builderGuides().length} components`;
      case 'catalog':
        return `${this.componentCount()} types`;
      default:
        return null;
    }
  }

  saveCurrentWorkspace(): void {
    if (!this.hasActiveWorkspace()) {
      this.library.message.set('Open the builder first so DashBuilder can capture the current canvas.');
      return;
    }

    this.library.saveComposite({
      label: this.saveLabel(),
      composite: this.builderState.buildCompositePayload(),
      stackProfile: readActiveStackProfile(),
    });
    this.saveLabel.set('');
  }

  openInBuilder(entryId: string): void {
    const entry = this.library.getEntry(entryId);
    if (!entry) {
      return;
    }

    writeLibraryRestore({
      entryId: entry.id,
      composite: entry.composite,
      stackProfile: entry.stackProfile,
    });
    void this.router.navigate(['/builder']);
  }

  removeEntry(entryId: string): void {
    this.library.removeEntry(entryId);
  }

  onFeatureFlagChange(key: 'aiDrawerEnabled' | 'voiceInputEnabled', checked: boolean): void {
    this.flags.update({ [key]: checked });
  }
}
