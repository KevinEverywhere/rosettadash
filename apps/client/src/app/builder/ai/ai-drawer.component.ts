import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiAssistService } from './ai-assist.service';

@Component({
  selector: 'app-ai-drawer',
  imports: [FormsModule, RouterLink],
  templateUrl: './ai-drawer.component.html',
  styleUrl: './ai-drawer.component.scss',
})
export class AiDrawerComponent {
  readonly open = input(false);
  readonly closed = output<void>();

  protected readonly assist = inject(AiAssistService);
  protected readonly prompt = signal('');
  protected readonly applyMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.open()) {
        void this.assist.initialize();
      }
    });
  }

  protected close(): void {
    this.closed.emit();
  }

  protected async refreshSetup(): Promise<void> {
    await this.assist.refreshReadiness();
  }

  protected async submit(): Promise<void> {
    const value = this.prompt().trim();
    if (!value) {
      return;
    }
    this.applyMessage.set(null);
    await this.assist.sendPrompt(value);
    this.prompt.set('');
  }

  protected applyLatest(): void {
    const result = this.assist.applyLatestResponse();
    this.applyMessage.set(result.ok ? 'Applied AI changes to the canvas.' : result.error);
  }

  protected hasApplicableResponse(): boolean {
    return this.assist.messages().some((message) => message.response);
  }
}
