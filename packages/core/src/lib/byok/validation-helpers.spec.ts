import { validationKeyForAiProvider } from './types';
import { summarizeAiValidation } from './validation-helpers';

describe('validation-helpers', () => {
  it('summarizes unchecked providers', () => {
    expect(summarizeAiValidation({}, ['openai', 'anthropic'])).toBe('2 unchecked');
  });

  it('summarizes validated providers', () => {
    const validation = {
      [validationKeyForAiProvider('openai')]: { status: 'valid' },
      [validationKeyForAiProvider('anthropic')]: { status: 'valid' },
    };
    expect(summarizeAiValidation(validation, ['openai', 'anthropic'])).toBe('2 validated');
  });

  it('summarizes failures', () => {
    const validation = {
      [validationKeyForAiProvider('openai')]: { status: 'invalid' },
    };
    expect(summarizeAiValidation(validation, ['openai'])).toBe('1 failed');
  });
});
