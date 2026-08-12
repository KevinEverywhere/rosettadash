import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppCollapsibleComponent } from './app-collapsible.component';

describe('AppCollapsibleComponent', () => {
  let fixture: ComponentFixture<AppCollapsibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppCollapsibleComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppCollapsibleComponent);
    fixture.componentRef.setInput('toggleTestId', 'demo-toggle');
    fixture.componentRef.setInput('panelTestId', 'demo-panel');
    fixture.detectChanges();
  });

  it('renders collapsed by default', () => {
    expect(fixture.nativeElement.querySelector('[data-testid="demo-panel"]')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.app-collapsible__toggle')?.getAttribute('aria-expanded')).toBe(
      'false',
    );
  });

  it('shows the panel when expanded', () => {
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="demo-panel"]')).toBeTruthy();
  });

  it('emits toggle when the header is clicked', () => {
    const toggleSpy = vi.fn();
    fixture.componentInstance.toggled.subscribe(toggleSpy);

    fixture.nativeElement.querySelector('.app-collapsible__toggle').click();

    expect(toggleSpy).toHaveBeenCalled();
  });
});
