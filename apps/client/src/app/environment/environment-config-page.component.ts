import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  AI_PROVIDER_MANIFEST,
  APP_NAME,
  ENV_CONFIG_CATEGORY_LABELS,
  groupEnvironmentFieldsByCategory,
  resolveEnvironmentFieldsForStack,
  summarizeAiValidation,
  type AiProviderDefinition,
  type AiProviderId,
  type CredentialValidationStatus,
  type EnvConfigCategory,
  type EnvFieldDefinition,
} from '@dashbuilder/core';
import {
  canEnterBuilder,
  readActiveStackProfile,
  readPendingStackProfile,
} from '../welcome/stack-profile-session';
import { AppLockGateComponent } from './app-lock-gate.component';
import { AppLockService } from './app-lock.service';
import { CredentialValidationService } from './credential-validation.service';
import { EnvironmentConfigService } from './environment-config.service';

export type EnvSectionId = 'ai' | 'storage' | 'builder' | 'database' | 'server' | 'auth' | 'custom';

const SECTION_ORDER: EnvSectionId[] = ['ai', 'storage', 'builder', 'database', 'server', 'auth', 'custom'];

const SECTION_LABELS: Record<EnvSectionId, string> = {
  ai: ENV_CONFIG_CATEGORY_LABELS.ai,
  storage: 'Storage preferences',
  builder: ENV_CONFIG_CATEGORY_LABELS.builder,
  database: ENV_CONFIG_CATEGORY_LABELS.database,
  server: ENV_CONFIG_CATEGORY_LABELS.server,
  auth: ENV_CONFIG_CATEGORY_LABELS.auth,
  custom: ENV_CONFIG_CATEGORY_LABELS.custom,
};

@Component({
  selector: 'app-environment-config-page',
  imports: [FormsModule, RouterLink, NgTemplateOutlet, NgClass, AppLockGateComponent],
  templateUrl: './environment-config-page.component.html',
  styleUrl: './environment-config-page.component.scss',
})
export class EnvironmentConfigPageComponent implements OnInit {
  protected readonly appName = APP_NAME;
  protected readonly config = inject(EnvironmentConfigService);
  protected readonly appLock = inject(AppLockService);
  private readonly credentialValidation = inject(CredentialValidationService);
  private readonly route = inject(ActivatedRoute);

  readonly aiProviders = AI_PROVIDER_MANIFEST;
  readonly sections = SECTION_ORDER;
  readonly sectionLabels = SECTION_LABELS;
  readonly openSection = signal<EnvSectionId | null>(null);
  readonly customEnvKey = signal('');
  readonly customEnvValue = signal('');
  readonly customFields = signal<EnvFieldDefinition[]>([]);
  readonly testingProvider = signal<AiProviderId | null>(null);
  readonly validatingField = signal<string | null>(null);
  readonly newLockPassword = signal('');
  readonly confirmLockPassword = signal('');
  readonly lockPasswordHint = signal('');
  readonly disableLockPassword = signal('');
  readonly pendingRecoveryCodes = signal<string[] | null>(null);
  readonly recoveryCodesSaved = signal(false);

  readonly stackProfile = computed(() => readActiveStackProfile() ?? readPendingStackProfile());

  readonly fieldGroups = computed(() => {
    const stack = this.stackProfile();
    const fields = resolveEnvironmentFieldsForStack(stack ?? undefined, { includeAllAi: false });
    return groupEnvironmentFieldsByCategory([...fields, ...this.customFields()]).filter(
      (group) => group.category !== 'ai',
    );
  });

  readonly configuredAiProviders = computed(() =>
    AI_PROVIDER_MANIFEST.filter((provider) => this.credentialValidation.providerHasStoredKey(provider.id)).map(
      (provider) => provider.id,
    ),
  );

  readonly canOpenBuilder = computed(() => canEnterBuilder());

  readonly activeProvider = computed(() =>
    AI_PROVIDER_MANIFEST.find((provider) => provider.id === this.config.settings().byok.activeProvider),
  );

  async ngOnInit(): Promise<void> {
    await this.config.initialize();
    if (this.route.snapshot.queryParamMap.get('from') === 'byok') {
      this.openSection.set('ai');
    }
  }

  isSectionOpen(section: EnvSectionId): boolean {
    return this.openSection() === section;
  }

  toggleSection(section: EnvSectionId): void {
    this.openSection.update((current) => (current === section ? null : section));
  }

  validationTone(status: CredentialValidationStatus): string {
    return `env-page__validation--${status}`;
  }

  validationClassForProvider(providerId: AiProviderId): string {
    return this.validationTone(this.config.getAiProviderValidation(providerId).status);
  }

  validationClassForEnvField(field: EnvFieldDefinition): string {
    return this.validationTone(this.config.getEnvFieldValidation(field.envKey).status);
  }

  sectionSummaryValidationClass(section: EnvSectionId): string {
    const status = this.sectionValidationStatus(section);
    return status ? this.validationTone(status) : 'env-page__validation--unknown';
  }

  sectionSummary(section: EnvSectionId): string | null {
    switch (section) {
      case 'ai': {
        const active = this.activeProvider()?.label;
        const summary = summarizeAiValidation(this.config.validation(), this.configuredAiProviders());
        if (summary && active) {
          return `${active} · ${summary}`;
        }
        return summary ?? active ?? null;
      }
      case 'storage':
        if (this.appLock.isEnabled()) {
          const recovery = this.appLock.remainingRecoveryCodes();
          const recoveryLabel = recovery ? ` · ${recovery} recovery code(s)` : '';
          return this.appLock.isUnlocked()
            ? `Locked · unlocked${recoveryLabel}`
            : `Locked${recoveryLabel}`;
        }
        return this.config.settings().rememberKeys ? 'Remembered' : 'Session only';
      case 'builder':
        return this.config.hasSecretValue('DASHBUILDER_API_KEY') ? 'Key stored' : null;
      case 'database':
      case 'server':
      case 'auth':
        return this.configuredCountForCategory(section) || null;
      case 'custom':
        return this.customFields().length ? `${this.customFields().length} variable(s)` : null;
      default:
        return null;
    }
  }

  providerStatusLabel(provider: AiProviderDefinition): string {
    const record = this.config.getAiProviderValidation(provider.id);
    if (record.status === 'valid') {
      return 'Validated';
    }
    if (record.status === 'invalid') {
      return record.message ?? 'Failed';
    }
    if (this.credentialValidation.providerHasStoredKey(provider.id)) {
      return 'Not validated';
    }
    return 'No key';
  }

  fieldStatusLabel(field: EnvFieldDefinition): string {
    const record = this.config.getEnvFieldValidation(field.envKey);
    if (record.status === 'valid') {
      return record.message ?? 'Validated';
    }
    if (record.status === 'invalid') {
      return record.message ?? 'Failed';
    }
    if (this.getFieldValue(field).trim()) {
      return 'Not validated';
    }
    return '';
  }

  fieldsForSection(section: EnvSectionId): EnvFieldDefinition[] {
    if (section === 'custom') {
      return this.customFields();
    }
    const group = this.fieldGroups().find((entry) => entry.category === section);
    return group?.fields ?? [];
  }

  trackField(_index: number, field: EnvFieldDefinition): string {
    return field.id;
  }

  getFieldValue(field: EnvFieldDefinition): string {
    return this.config.getValue(field.envKey);
  }

  getProviderKeyValue(provider: AiProviderDefinition): string {
    return this.config.getValue(provider.apiKeyEnvKey);
  }

  providerBaseUrlEnvKey(provider: AiProviderDefinition): string {
    return `${provider.id.toUpperCase().replace(/-/g, '_')}_BASE_URL`;
  }

  getProviderBaseUrl(provider: AiProviderDefinition): string {
    return this.config.getValue(this.providerBaseUrlEnvKey(provider));
  }

  onProviderBaseUrlChange(provider: AiProviderDefinition, value: string): void {
    this.config.setPlainValue(this.providerBaseUrlEnvKey(provider), value);
    this.config.resetAiProviderValidation(provider.id);
  }

  onProviderKeyChange(provider: AiProviderDefinition, value: string): void {
    this.config.setSecretValue(provider.apiKeyEnvKey, value);
    this.config.resetAiProviderValidation(provider.id);
  }

  onPlainChange(field: EnvFieldDefinition, value: string): void {
    this.config.setPlainValue(field.envKey, value);
  }

  onSecretChange(field: EnvFieldDefinition, value: string): void {
    this.config.setSecretValue(field.envKey, value);
  }

  onRememberKeysChange(checked: boolean): void {
    this.config.setRememberKeys(checked);
  }

  onProviderChange(providerId: AiProviderId): void {
    const current = this.config.settings().byok;
    const providerModels = {
      ...current.providerModels,
      [current.activeProvider]: current.activeModel,
    };
    const provider = AI_PROVIDER_MANIFEST.find((entry) => entry.id === providerId);
    this.config.updateByokSettings({
      activeProvider: providerId,
      activeModel: providerModels[providerId] ?? provider?.models[0]?.id ?? '',
      providerModels,
    });
  }

  onModelChange(modelId: string): void {
    const current = this.config.settings().byok;
    this.config.updateByokSettings({
      activeModel: modelId,
      providerModels: { ...current.providerModels, [current.activeProvider]: modelId },
    });
  }

  onByokSettingChange(key: 'customBaseUrl' | 'azureResourceName' | 'azureDeploymentId', value: string): void {
    this.config.updateByokSettings({ [key]: value });
    this.config.resetAiProviderValidation('azure-openai');
  }

  addCustomField(): void {
    const key = this.customEnvKey().trim().toUpperCase().replace(/\s+/g, '_');
    if (!key) {
      return;
    }
    if (this.customFields().some((field) => field.envKey === key)) {
      return;
    }
    const field: EnvFieldDefinition = {
      id: `custom-${key}`,
      envKey: key,
      label: key,
      description: 'Custom environment variable you added.',
      category: 'custom',
      sensitive: true,
    };
    this.customFields.update((current) => [...current, field]);
    this.config.setSecretValue(key, this.customEnvValue());
    this.customEnvKey.set('');
    this.customEnvValue.set('');
    this.openSection.set('custom');
  }

  removeCustomField(field: EnvFieldDefinition): void {
    this.customFields.update((current) => current.filter((entry) => entry.id !== field.id));
    this.config.setSecretValue(field.envKey, '');
  }

  async save(): Promise<void> {
    await this.config.save();
  }

  async enableAppLock(): Promise<void> {
    const password = this.newLockPassword().trim();
    const confirm = this.confirmLockPassword().trim();
    if (!password || password !== confirm) {
      this.config.saveMessage.set('Passwords must match and cannot be empty.');
      return;
    }

    const result = await this.appLock.enableLock(password, {
      passwordHint: this.lockPasswordHint(),
    });
    await this.config.save();
    this.pendingRecoveryCodes.set(result.recoveryCodes);
    this.recoveryCodesSaved.set(false);
    this.newLockPassword.set('');
    this.confirmLockPassword.set('');
    this.lockPasswordHint.set('');
    this.config.saveMessage.set('App lock enabled. Save your recovery codes before continuing.');
  }

  confirmRecoveryCodesSaved(): void {
    if (!this.recoveryCodesSaved()) {
      this.config.saveMessage.set('Confirm that you saved your recovery codes.');
      return;
    }
    this.pendingRecoveryCodes.set(null);
    this.config.saveMessage.set('App lock is ready. Recovery codes will not be shown again.');
  }

  copyRecoveryCodes(): void {
    const codes = this.pendingRecoveryCodes();
    if (!codes?.length || typeof navigator === 'undefined' || !navigator.clipboard) {
      return;
    }
    void navigator.clipboard.writeText(codes.join('\n'));
    this.config.saveMessage.set('Recovery codes copied to clipboard.');
  }

  async disableAppLock(): Promise<void> {
    const ok = await this.appLock.disableLock(this.disableLockPassword());
    if (!ok) {
      return;
    }
    this.disableLockPassword.set('');
    await this.config.reloadSecrets();
    this.config.saveMessage.set('App lock removed.');
  }

  lockVault(): void {
    this.appLock.lock();
  }

  clearAll(): void {
    this.config.clearAll();
    this.customFields.set([]);
    this.testingProvider.set(null);
  }

  isProviderTesting(providerId: AiProviderId): boolean {
    return this.testingProvider() === providerId;
  }

  isFieldValidating(envKey: string): boolean {
    return this.validatingField() === envKey;
  }

  async runProviderTest(providerId: AiProviderId): Promise<void> {
    this.testingProvider.set(providerId);
    try {
      await this.credentialValidation.validateAiProvider(providerId);
    } finally {
      this.testingProvider.set(null);
    }
  }

  async validateField(field: EnvFieldDefinition): Promise<void> {
    this.validatingField.set(field.envKey);
    try {
      if (field.envKey === 'DASHBUILDER_API_KEY') {
        await this.credentialValidation.validateBuilderAccess();
        return;
      }
      this.credentialValidation.validateEnvField(field);
    } finally {
      this.validatingField.set(null);
    }
  }

  private sectionValidationStatus(section: EnvSectionId): CredentialValidationStatus | null {
    if (section === 'ai') {
      const configured = this.configuredAiProviders();
      if (!configured.length) {
        return null;
      }
      const statuses = configured.map((id) => this.config.getAiProviderValidation(id).status);
      if (statuses.some((status) => status === 'invalid')) {
        return 'invalid';
      }
      if (statuses.every((status) => status === 'valid')) {
        return 'valid';
      }
      return 'unknown';
    }

    const fields = this.fieldsForSection(section).filter((field) => !!this.getFieldValue(field).trim());
    if (!fields.length) {
      return null;
    }
    const statuses = fields.map((field) => this.config.getEnvFieldValidation(field.envKey).status);
    if (statuses.some((status) => status === 'invalid')) {
      return 'invalid';
    }
    if (statuses.every((status) => status === 'valid')) {
      return 'valid';
    }
    return 'unknown';
  }

  private configuredCountForCategory(category: EnvConfigCategory): string | null {
    const fields = this.fieldsForSection(category as EnvSectionId);
    const count = fields.filter((field) => !!this.getFieldValue(field).trim()).length;
    return count ? `${count} set` : null;
  }
}
