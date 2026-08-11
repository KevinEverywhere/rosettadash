import { Component, effect, inject, input, OnDestroy, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AiAssistService } from './ai-assist.service';
import { SpeechInputService } from './speech-input.service';
import { AdminFeatureFlagsService } from '../../admin/admin-feature-flags.service';

@Component({
  selector: 'app-ai-drawer',
  imports: [FormsModule, RouterLink],
  templateUrl: './ai-drawer.component.html',
  styleUrl: './ai-drawer.component.scss',
})
export class AiDrawerComponent implements OnDestroy {
  readonly open = input(false);
  readonly closed = output<void>();

  protected readonly assist = inject(AiAssistService);
  protected readonly speech = inject(SpeechInputService);
  protected readonly featureFlags = inject(AdminFeatureFlagsService);
  protected readonly prompt = signal('');
  protected readonly applyMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      if (this.open()) {
        this.featureFlags.initialize();
        void this.assist.initialize();
      } else {
        this.stopVoiceCapture(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.stopVoiceCapture(false);
  }

  protected close(): void {
    this.stopVoiceCapture(false);
    this.closed.emit();
  }

  protected toggleVoiceInput(): void {
    if (this.speech.status() === 'listening') {
      this.stopVoiceCapture(true);
      return;
    }
    this.speech.startListening();
  }

  protected voiceButtonLabel(): string {
    if (this.speech.status() === 'listening') {
      return 'Stop listening';
    }
    return this.speech.isSupported() ? 'Speak' : 'Voice unavailable';
  }

  private stopVoiceCapture(appendTranscript: boolean): void {
    const transcript = this.speech.stopListening();
    if (!appendTranscript || !transcript) {
      return;
    }
    const base = this.prompt().trim();
    const next = base ? `${base} ${transcript}` : transcript;
    this.prompt.set(next.trim());
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
