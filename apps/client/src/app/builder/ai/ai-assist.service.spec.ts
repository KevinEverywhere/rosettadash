import { TestBed } from '@angular/core/testing';
import { MockAiCompletionClient } from './ai-completion-client';
import { AiAssistService } from './ai-assist.service';
import { ByokTestConnectionService } from '../../environment/byok-test-connection.service';
import { EnvironmentConfigService } from '../../environment/environment-config.service';
import { BuilderStateService } from '../builder-state.service';

describe('AiAssistService', () => {
  it('parses mock provider responses', async () => {
    await TestBed.configureTestingModule({
      providers: [
        AiAssistService,
        EnvironmentConfigService,
        BuilderStateService,
        {
          provide: ByokTestConnectionService,
          useValue: {
            testProvider: async () => ({ status: 'success' as const }),
          },
        },
      ],
    }).compileComponents();

    const assist = TestBed.inject(AiAssistService);
    assist.setClient(
      new MockAiCompletionClient(
        JSON.stringify({
          summary: 'Added a table',
          actions: [{ op: 'add_node', type: 'visual.table', ref: 'table1' }],
        }),
      ),
    );

    await assist.sendPrompt('Add a table');
    const latest = assist.messages().at(-1);
    expect(latest?.response?.summary).toBe('Added a table');
  });
});
