import { Component, computed, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { paletteGroupColor } from '@rosettadash/core';
import { CreationWizardService } from './creation-wizard.service';

@Component({
  selector: 'app-creation-wizard',
  imports: [RouterLink],
  templateUrl: './creation-wizard.component.html',
  styleUrl: './creation-wizard.component.scss',
})
export class CreationWizardComponent {
  protected readonly wizard = inject(CreationWizardService);

  readonly aiAssistRequested = output<string>();

  protected readonly stepColor = computed(() => {
    const groupId = this.wizard.highlightGroupId();
    return groupId ? paletteGroupColor(groupId) : null;
  });

  protected close(): void {
    this.wizard.closeWizard();
  }

  protected dismiss(): void {
    this.wizard.closeWizard(true);
  }

  protected enableAi(): void {
    this.wizard.chooseAiAssist(true);
    this.aiAssistRequested.emit(this.wizard.aiPromptForGoal());
  }
}
