import { TestBed } from '@angular/core/testing';
import { PaletteComponent } from './palette.component';

describe('PaletteComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteComponent],
    }).compileComponents();
  });

  it('renders functional accordion groups from core taxonomy', () => {
    const fixture = TestBed.createComponent(PaletteComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.palette__group').length).toBe(11);
    expect(element.querySelector('[data-testid="palette-group-news-discovery"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="palette-group-data-display"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="palette-group-logic-motion"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="palette-group-plugin-extensions"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="palette-group-vr-visuals"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="palette-group-panel-data-display"]')).toBeFalsy();
  });

  it('expands a group and shows component rows', () => {
    const fixture = TestBed.createComponent(PaletteComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector(
      '[data-testid="palette-group-toggle-data-display"]',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="palette-group-panel-data-display"]')).toBeTruthy();
    expect(element.textContent).toContain('Data Table');
  });

  it('shows grouping info panel when info affordance is clicked', () => {
    const fixture = TestBed.createComponent(PaletteComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const toggle = element.querySelector(
      '[data-testid="palette-group-toggle-data-display"]',
    ) as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    const infoButton = element.querySelector('[data-testid="palette-info-visual.table"]') as HTMLButtonElement;
    expect(infoButton).toBeTruthy();
    infoButton.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="palette-guide-info-visual.table"]')).toBeTruthy();
    expect(element.querySelector('[data-testid="palette-instruction-step-visual.table-1"]')).toBeTruthy();
    expect(element.textContent).toContain('5 steps');
    expect(element.textContent).toContain('Add a table');
  });
});
