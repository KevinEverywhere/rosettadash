import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'da-form-section-grid',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rd-form-section-grid" data-testid="rd-form-section-grid">
      <ng-content />
    </div>
  `,
})
export class FormSectionGridComponent {}

@Component({
  selector: 'da-form-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      class="rd-form-section"
      [class.rd-form-section--full]="fullWidth()"
      data-testid="rd-form-section"
    >
      <h3 class="rd-form-section__title">{{ sectionTitle() }}</h3>
      <div
        class="rd-form-section__body"
        [class.rd-form-section__body--2col]="columns() === 2"
      >
        <ng-content />
      </div>
    </section>
  `,
})
export class FormSectionComponent {
  readonly sectionTitle = input.required<string>({ alias: 'title' });
  readonly fullWidth = input(false);
  readonly columns = input<1 | 2>(1);
}
