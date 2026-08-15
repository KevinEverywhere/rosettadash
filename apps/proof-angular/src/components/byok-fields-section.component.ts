import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import type { EnvFieldDefinition } from '@rosettadash/core';
import type { AtlasUserRole } from '../lib/roles';
import { ConsumerSecretsService } from '../services/consumer-secrets.service';
import { DaBoundTextInputComponent } from './proof-form-fields.component';
import { RoleGatePanelComponent } from './role-gate-panel.component';

@Component({
  selector: 'da-byok-fields-section',
  standalone: true,
  imports: [DaBoundTextInputComponent, RoleGatePanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <da-role-gate-panel
      [gateLabel]="gateLabel()"
      [currentRole]="userRole()"
      [allowedRoles]="['admin']"
      [statusText]="gateStatusText()"
      [hiddenStatusText]="gateHiddenStatusText()"
    >
      @if (!secrets.loaded()) {
        <p class="da-note">Loading encrypted key vault…</p>
      }
      <div class="da-byok-fields">
        @for (field of fields(); track field.id) {
          <div class="da-byok-field">
            <da-bound-text-input
              [fieldLabel]="field.label"
              [placeholder]="field.placeholder"
              [inputType]="field.sensitive ? 'password' : 'text'"
              [value]="secrets.getDraftValue(field.envKey)"
              (valueChange)="secrets.setDraftValue(field.envKey, $event)"
            />
            <p class="da-byok-field__desc">{{ field.description }}</p>
            <p class="da-byok-field__meta">
              Env key: <code>{{ field.envKey }}</code>
              @if (field.optional) {
                <span class="da-byok-field__optional">optional</span>
              }
              @if (secrets.hasConfiguredKey(field.envKey)) {
                <span class="da-byok-field__status da-byok-field__status--ok">configured</span>
              } @else if (field.sensitive) {
                <span class="da-byok-field__status">not set</span>
              }
            </p>
          </div>
        }
      </div>
      <label class="da-byok-remember">
        <input
          type="checkbox"
          [checked]="secrets.rememberKeys()"
          (change)="secrets.setRememberKeys($any($event.target).checked)"
        />
        Remember keys in this browser (localStorage + encryption)
      </label>
      <div class="da-byok-actions">
        <button type="button" class="rd-button" [disabled]="!secrets.loaded()" (click)="saveKeys()">
          Save keys
        </button>
        <button type="button" class="rd-button rd-button--ghost" (click)="clearKeys()">Clear keys</button>
      </div>
      @if (secrets.saveMessage()) {
        <p class="da-byok-save-msg">{{ secrets.saveMessage() }}</p>
      }
    </da-role-gate-panel>
  `,
})
export class ByokFieldsSectionComponent {
  readonly userRole = input.required<AtlasUserRole>();
  readonly fields = input.required<EnvFieldDefinition[]>();
  readonly gateLabel = input.required<string>();
  readonly gateStatusText = input.required<string>();
  readonly gateHiddenStatusText = input.required<string>();

  readonly secrets = inject(ConsumerSecretsService);

  saveKeys(): void {
    void this.secrets.save();
  }

  clearKeys(): void {
    void this.secrets.clearAll();
  }
}
