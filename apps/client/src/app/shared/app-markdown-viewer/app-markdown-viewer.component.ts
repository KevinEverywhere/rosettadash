import { Component, inject, input, OnInit, signal } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'app-markdown-viewer',
  templateUrl: './app-markdown-viewer.component.html',
  styleUrl: './app-markdown-viewer.component.scss',
})
export class AppMarkdownViewerComponent implements OnInit {
  readonly src = input.required<string>();

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly loading = signal(true);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly html = signal<SafeHtml | null>(null);

  constructor() {
    marked.setOptions({ gfm: true, breaks: false });
  }

  ngOnInit(): void {
    void this.loadMarkdown();
  }

  private async loadMarkdown(): Promise<void> {
    this.loading.set(true);
    this.errorMessage.set(null);

    try {
      const response = await fetch(this.src());
      if (!response.ok) {
        throw new Error(`Failed to load ${this.src()} (${response.status})`);
      }
      const markdown = await response.text();
      const parsed = await marked.parse(markdown);
      this.html.set(this.sanitizer.bypassSecurityTrustHtml(parsed));
    } catch (error) {
      this.errorMessage.set(error instanceof Error ? error.message : 'Unable to load documentation.');
      this.html.set(null);
    } finally {
      this.loading.set(false);
    }
  }
}
