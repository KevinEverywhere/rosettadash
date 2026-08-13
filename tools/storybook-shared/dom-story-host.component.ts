import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { attachDomStory, clearDomStoryHost } from './dom-story-mount.js';

@Component({
  selector: 'rd-dom-story-host',
  standalone: true,
  template: '<div #host class="rd-dom-story-host"></div>',
})
export class DomStoryHostComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) mount!: () => HTMLElement;
  @ViewChild('host', { static: true }) hostRef!: ElementRef<HTMLDivElement>;

  ngAfterViewInit(): void {
    this.renderMount();
  }

  ngOnChanges(): void {
    if (this.hostRef) {
      this.renderMount();
    }
  }

  ngOnDestroy(): void {
    clearDomStoryHost(this.hostRef.nativeElement);
  }

  private renderMount(): void {
    attachDomStory(this.hostRef.nativeElement, this.mount);
  }
}
