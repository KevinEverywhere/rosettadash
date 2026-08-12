import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Accordion } from '../accordion/accordion';
import { LinkList, type LinkListItem } from '../../visual/link-list/link-list';

/** Public props for the accordion + link-list recipe. */
export interface AccordionLinkListProps {
  title: string;
  open?: boolean;
  defaultOpen?: boolean;
  className?: string;
  items?: LinkListItem[];
  dense?: boolean;
}

@Component({
  selector: 'rd-accordion-link-list',
  standalone: true,
  imports: [Accordion, LinkList],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <rd-accordion
      [title]="title()"
      [open]="open()"
      [defaultOpen]="defaultOpen()"
      [className]="recipeClass()"
      (openChange)="openChange.emit($event)"
      (toggleChange)="toggleChange.emit($event)"
    >
      <rd-link-list [items]="items()" [dense]="dense()" />
    </rd-accordion>
  `,
})
export class AccordionLinkList {
  readonly title = input.required<string>();
  readonly open = input<boolean | undefined>(undefined);
  readonly defaultOpen = input(false);
  readonly className = input<string | undefined>(undefined);
  readonly items = input<LinkListItem[]>([]);
  readonly dense = input(false);

  readonly openChange = output<boolean>();
  readonly toggleChange = output<boolean>();

  readonly recipeClass = computed(() =>
    ['rd-accordion-link-list', this.className()].filter(Boolean).join(' '),
  );
}
