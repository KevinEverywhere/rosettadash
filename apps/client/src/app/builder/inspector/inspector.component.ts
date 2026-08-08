import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { defaultComponentRegistry } from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';

@Component({
  selector: 'app-inspector',
  imports: [JsonPipe],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
})
export class InspectorComponent {
  private readonly state = inject(BuilderStateService);

  protected readonly definition = computed(() => {
    const selected = this.state.selectedDefinition();
    if (selected) {
      return selected;
    }
    const node = this.state.selectedNode();
    return node ? defaultComponentRegistry.get(node.type) ?? null : null;
  });

  protected readonly node = computed(() => this.state.selectedNode());
  protected readonly hasSelection = computed(
    () => this.definition() !== null || this.node() !== null,
  );
}
