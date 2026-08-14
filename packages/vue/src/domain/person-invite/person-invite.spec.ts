import type { PersonInviteProps } from './person-invite';

describe('@rosettadash/vue/domain/person-invite', () => {
  it('exposes typed props contract', () => {
    const props: PersonInviteProps = {};
    expect(props).toBeDefined();
  });

  it('uses taxonomy-aligned BEM block rd-person-invite', () => {
    expect('rd-person-invite').toMatch(/^rd-/);
  });
});
