import { JsonPipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  Binding,
  DefaultSuggestion,
  PropertySchema,
  defaultComponentRegistry,
  parseRoleGateAllowedRoles,
  resolveRoleOptions,
} from '@dashbuilder/core';
import { BuilderStateService } from '../builder-state.service';
import { DomainContextPanelComponent } from './domain-context-panel.component';

@Component({
  selector: 'app-inspector',
  imports: [JsonPipe, FormsModule, DomainContextPanelComponent],
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
  protected readonly nodeBindings = computed(() => this.state.bindingsForSelectedNode());
  protected readonly nodeSuggestions = computed(() => {
    const node = this.state.selectedNode();
    if (!node) {
      return [] as DefaultSuggestion[];
    }
    return this.state.suggestionsForNode(node.id);
  });
  protected readonly hasSelection = computed(
    () => this.definition() !== null,
  );
  protected readonly hasComposite = computed(() => this.state.composite() !== null);
  protected readonly isEditingNode = computed(() => this.node() !== null);
  protected readonly isRoleGateNode = computed(() => this.node()?.type === 'domain.role-gate');
  protected readonly roleGateOptions = computed(() =>
    resolveRoleOptions(this.state.domainContext()?.roles),
  );
  protected readonly roleGateAllowedRoles = computed(() => {
    const node = this.node();
    if (!node) {
      return [] as string[];
    }
    return parseRoleGateAllowedRoles(node.properties['roles']);
  });

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

  protected describeBinding(binding: Binding): string {
    const source = this.state.nodes().find((node) => node.id === binding.sourceNodeId);
    const target = this.state.nodes().find((node) => node.id === binding.targetNodeId);
    if (!source || !target) {
      return 'Unknown binding';
    }
    const sourcePort = defaultComponentRegistry.findPort(
      source,
      binding.sourcePortId,
      'output',
    );
    const targetPort = defaultComponentRegistry.findPort(
      target,
      binding.targetPortId,
      'input',
    );
    return `${source.label}.${sourcePort?.name ?? binding.sourcePortId} → ${target.label}.${targetPort?.name ?? binding.targetPortId}`;
  }

  protected removeBinding(bindingId: string): void {
    this.state.removeBinding(bindingId);
  }

  protected applySuggestion(suggestionId: string): void {
    this.state.applySuggestion(suggestionId);
  }

  protected dismissSuggestion(suggestionId: string): void {
    this.state.dismissSuggestion(suggestionId);
  }

  protected isRoleAllowed(roleId: string): boolean {
    return this.roleGateAllowedRoles().includes(roleId);
  }

  protected toggleRoleGateRole(roleId: string, enabled: boolean): void {
    this.state.toggleRoleGateRole(roleId, enabled);
  }
}
