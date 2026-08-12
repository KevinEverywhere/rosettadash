import { parseAiBuilderResponse } from './parse-response';

describe('parseAiBuilderResponse', () => {
  it('parses bare JSON', () => {
    const parsed = parseAiBuilderResponse(
      JSON.stringify({
        summary: 'Added a table',
        actions: [{ op: 'add_node', type: 'visual.table', ref: 't1' }],
      }),
    );
    expect(parsed.summary).toBe('Added a table');
    expect(parsed.actions).toHaveLength(1);
  });

  it('parses fenced JSON', () => {
    const parsed = parseAiBuilderResponse(
      'Here you go:\n```json\n{"summary":"ok","actions":[]}\n```',
    );
    expect(parsed.summary).toBe('ok');
  });
});
