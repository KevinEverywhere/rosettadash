import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BuilderViewportGateComponent } from './builder-viewport-gate.component';
import { DisplayAvailabilityService } from './display-availability.service';

describe('BuilderViewportGateComponent', () => {
  let fixture: ComponentFixture<BuilderViewportGateComponent>;
  let refresh: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    refresh = vi.fn();

    await TestBed.configureTestingModule({
      imports: [BuilderViewportGateComponent],
      providers: [
        provideRouter([]),
        {
          provide: DisplayAvailabilityService,
          useValue: { refresh },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderViewportGateComponent);
  });

  it('shows the minimum viewport message for phones', () => {
    fixture.componentRef.setInput('availability', {
      width: 430,
      height: 932,
      coarsePointer: true,
      tier: 'phone',
      allowed: false,
      reason: 'minimum-viewport-unmet',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="builder-viewport-gate"]')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Larger display required');
    expect(fixture.nativeElement.textContent).toContain('1024px width in landscape mode');
    expect(fixture.nativeElement.querySelector('[data-testid="viewport-gate-tier"]')?.textContent).toBe(
      'phone',
    );
    expect(fixture.nativeElement.querySelector('[data-testid="viewport-gate-retry"]')).toBeTruthy();
  });

  it('shows rotate guidance for iPad Mini portrait', () => {
    fixture.componentRef.setInput('availability', {
      width: 768,
      height: 1024,
      coarsePointer: true,
      tier: 'portrait',
      allowed: false,
      reason: 'portrait-rotate-required',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Rotate to landscape');
    expect(fixture.nativeElement.textContent).toContain('turned sideways');
    expect(fixture.nativeElement.querySelector('[data-testid="viewport-gate-tier"]')?.textContent).toBe(
      'portrait',
    );
    expect(fixture.nativeElement.querySelector('[data-testid="viewport-gate-retry"]')).toBeTruthy();
  });

  it('shows the minimum viewport message for small tablets', () => {
    fixture.componentRef.setInput('availability', {
      width: 962,
      height: 601,
      coarsePointer: true,
      tier: 'small-tablet',
      allowed: false,
      reason: 'minimum-viewport-unmet',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Larger display required');
    expect(fixture.nativeElement.querySelector('[data-testid="viewport-gate-tier"]')?.textContent).toBe(
      'small-tablet',
    );
  });
});
