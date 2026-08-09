import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TIME_RANGE_PRESET_OPTIONS, TimeRangePreset } from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';

@Component({
  selector: 'app-domain-context-panel',
  imports: [FormsModule],
  templateUrl: './domain-context-panel.component.html',
  styleUrl: './domain-context-panel.component.scss',
})
export class DomainContextPanelComponent {
  protected readonly state = inject(BuilderStateService);
  protected readonly presetOptions = TIME_RANGE_PRESET_OPTIONS;

  protected readonly domain = computed(() => this.state.domainContext());

  protected readonly clientName = computed(() => this.domain()?.client?.name ?? '');
  protected readonly clientId = computed(() => this.domain()?.client?.id ?? '');
  protected readonly projectName = computed(() => this.domain()?.project?.name ?? '');
  protected readonly projectId = computed(() => this.domain()?.project?.id ?? '');
  protected readonly defaultTimeRange = computed(
    () => this.domain()?.defaultTimeRange ?? '',
  );

  protected updateClientName(value: string): void {
    this.state.patchDomainContext({ clientName: value });
  }

  protected updateClientId(value: string): void {
    this.state.patchDomainContext({ clientId: value });
  }

  protected updateProjectName(value: string): void {
    this.state.patchDomainContext({ projectName: value });
  }

  protected updateProjectId(value: string): void {
    this.state.patchDomainContext({ projectId: value });
  }

  protected updateDefaultTimeRange(value: string): void {
    this.state.patchDomainContext({
      defaultTimeRange: (value || '') as TimeRangePreset | '',
    });
  }
}
