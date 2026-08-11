import { Injectable, signal } from '@angular/core';

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
}

export type SpeechInputStatus = 'idle' | 'listening' | 'unsupported' | 'error';

@Injectable({ providedIn: 'root' })
export class SpeechInputService {
  readonly status = signal<SpeechInputStatus>('idle');
  readonly interimTranscript = signal('');
  readonly errorMessage = signal<string | null>(null);

  private recognition: SpeechRecognitionInstance | null = null;
  private finalBuffer = '';

  isSupported(): boolean {
    return !!this.getRecognitionCtor();
  }

  startListening(lang = 'en-US'): void {
    if (!this.isSupported()) {
      this.status.set('unsupported');
      this.errorMessage.set(this.unsupportedMessage());
      return;
    }

    this.stopListening();
    this.finalBuffer = '';
    this.interimTranscript.set('');
    this.errorMessage.set(null);

    const Recognition = this.getRecognitionCtor();
    if (!Recognition) {
      return;
    }

    this.recognition = new Recognition();
    this.recognition.continuous = !this.isSafari();
    this.recognition.interimResults = true;
    this.recognition.lang = lang;

    this.recognition.onresult = (event) => {
      let interim = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index];
        const transcript = result[0]?.transcript ?? '';
        if (result.isFinal) {
          this.finalBuffer = `${this.finalBuffer} ${transcript}`.trim();
        } else {
          interim = `${interim} ${transcript}`.trim();
        }
      }
      this.interimTranscript.set(interim);
    };

    this.recognition.onerror = (event) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        return;
      }
      this.status.set('error');
      this.errorMessage.set(this.describeError(event.error));
    };

    this.recognition.onend = () => {
      if (this.status() === 'listening') {
        this.status.set('idle');
      }
      this.interimTranscript.set('');
    };

    try {
      this.recognition.start();
      this.status.set('listening');
    } catch {
      this.status.set('error');
      this.errorMessage.set('Could not start speech recognition.');
    }
  }

  stopListening(): string {
    const transcript = this.consumeTranscript();
    if (this.recognition) {
      this.recognition.onresult = null;
      this.recognition.onerror = null;
      this.recognition.onend = null;
      try {
        this.recognition.stop();
      } catch {
        try {
          this.recognition.abort();
        } catch {
          // ignore cleanup errors
        }
      }
      this.recognition = null;
    }
    if (this.status() === 'listening') {
      this.status.set('idle');
    }
    this.interimTranscript.set('');
    return transcript;
  }

  consumeTranscript(): string {
    const combined = `${this.finalBuffer} ${this.interimTranscript()}`.trim();
    this.finalBuffer = '';
    this.interimTranscript.set('');
    return combined;
  }

  livePreview(): string {
    return `${this.finalBuffer} ${this.interimTranscript()}`.trim();
  }

  isSafari(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    return /Safari/i.test(navigator.userAgent) && !/Chrome|Chromium|Edg|OPR/i.test(navigator.userAgent);
  }

  safariHint(): string | null {
    if (!this.isSafari() || !this.isSupported()) {
      return null;
    }
    return 'Safari: enable Dictation in System Settings → Keyboard → Dictation, and allow microphone access for this site.';
  }

  private unsupportedMessage(): string {
    if (this.isSafari()) {
      return 'Speech input requires Safari 14.1+ with Dictation enabled in System Settings.';
    }
    return 'Speech input is not supported in this browser. Use Chrome, Edge, or Safari on macOS/iOS.';
  }

  private describeError(error?: string): string {
    if (error === 'not-allowed') {
      return 'Microphone permission was denied.';
    }
    if (error === 'service-not-allowed' && this.isSafari()) {
      return 'Safari blocked speech recognition. Enable Dictation in System Settings → Keyboard → Dictation, then reload.';
    }
    if (error === 'service-not-allowed') {
      return 'Speech recognition is not allowed in this browser context.';
    }
    return `Speech input error: ${error ?? 'unknown'}.`;
  }

  private getRecognitionCtor(): SpeechRecognitionCtor | null {
    if (typeof globalThis === 'undefined') {
      return null;
    }
    const scope = globalThis as typeof globalThis & {
      SpeechRecognition?: SpeechRecognitionCtor;
      webkitSpeechRecognition?: SpeechRecognitionCtor;
    };
    return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
  }
}
