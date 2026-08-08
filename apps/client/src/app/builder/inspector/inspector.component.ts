import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  PropertySchema,
  defaultComponentRegistry,
} from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';

@Component({
  selector: 'app-inspector',
  imports: [JsonPipe, FormsModule],
  templateUrl: './inspector.component.html',
  styleUrl: './inspector.component.scss',
})
export class InspectorComponent {
  protected readonly state = inject(BuilderStateService);

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
    () => this.definition() !== null,
  );
  protected readonly isEditingNode = computed(() => this.node() !== null);

  protected addToCanvas(): void {
    const definition = this.state.selectedDefinition();
    if (definition) {
      this.state.addNodeFromDefinition(definition);
    }
  }

  protected removeNode(): void {
    this.state.removeSelectedNode();
  }

  protected updateProperty(schema: PropertySchema, value: string | number | boolean): void {
    const node = this.node();
    if (!node) {
      return;
    }
    this.state.updateNodeProperty(node.id, schema.key, value);
  }

  protected readProperty(key: string): unknown {
    const node = this.node();
    return node?.properties[key];
  }
}
