import { ComponentFixture, TestBed } from '@angular/core/testing';
import { getGroupingGuide } from '@dashbuilder/core';
import { BuilderGuideCardComponent } from './builder-guide-card.component';

describe('BuilderGuideCardComponent', () => {
  let fixture: ComponentFixture<BuilderGuideCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuilderGuideCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BuilderGuideCardComponent);
    fixture.componentRef.setInput('label', 'Data Table');
    fixture.componentRef.setInput('type', 'visual.table');
    const tableGuide = getGroupingGuide('visual.table');
    if (!tableGuide) {
      throw new Error('Expected visual.table grouping guide');
    }
    fixture.componentRef.setInput('guide', tableGuide);
    fixture.detectChanges();
  });

  it('shows the component label and type in the collapsible header', () => {
    const toggle = fixture.nativeElement.querySelector('.app-collapsible__toggle');
    expect(toggle.textContent).toContain('Data Table');
    expect(toggle.textContent).toContain('visual.table');
  });

  it('expands to show guide summary and steps', () => {
    fixture.componentRef.setInput('expanded', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.app-builder-guide-card__summary')?.textContent).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.grouping-instruction__steps')).toBeTruthy();
  });

  it('emits toggle when the header button is clicked', () => {
    const toggleSpy = vi.fn();
    fixture.componentInstance.toggled.subscribe(toggleSpy);

    fixture.nativeElement.querySelector('.app-collapsible__toggle').click();

    expect(toggleSpy).toHaveBeenCalled();
  });
});
