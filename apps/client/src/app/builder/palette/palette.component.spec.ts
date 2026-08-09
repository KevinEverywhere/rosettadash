import { TestBed } from '@angular/core/testing';
import { PaletteComponent } from './palette.component';

describe('PaletteComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaletteComponent],
    }).compileComponents();
  });

  it('renders component groups from the registry', () => {
    const fixture = TestBed.createComponent(PaletteComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelectorAll('.palette__group').length).toBeGreaterThan(0);
    expect(element.textContent).toContain('Data Table');
  });

  it('shows grouping info panel when info affordance is clicked', () => {
    const fixture = TestBed.createComponent(PaletteComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const infoButton = element.querySelector('[data-testid="palette-info-visual.table"]') as HTMLButtonElement;
    expect(infoButton).toBeTruthy();
    infoButton.click();
    fixture.detectChanges();
    expect(element.querySelector('[data-testid="palette-guide-info-visual.table"]')).toBeTruthy();
  });
});
