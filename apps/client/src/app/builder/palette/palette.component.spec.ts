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
});
