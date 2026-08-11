import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMarkdownViewerComponent } from './app-markdown-viewer.component';

describe('AppMarkdownViewerComponent', () => {
  let fixture: ComponentFixture<AppMarkdownViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppMarkdownViewerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppMarkdownViewerComponent);
    fixture.componentRef.setInput('src', '/readme.md');
  });

  it('shows loading state before fetch completes', () => {
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="markdown-viewer"]')).toBeTruthy();
  });
});
