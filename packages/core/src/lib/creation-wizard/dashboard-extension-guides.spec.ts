import {
  getDashboardExtensionTopic,
  listDashboardExtensionTopics,
} from './dashboard-extension-guides';

describe('dashboard-extension-guides', () => {
  it('lists extend-dashboard topics for common add-on scenarios', () => {
    const topics = listDashboardExtensionTopics();
    expect(topics.length).toBeGreaterThanOrEqual(3);
    expect(topics.some((topic) => topic.id === 'add-table')).toBe(true);
    expect(topics.some((topic) => topic.id === 'cross-ref-sales')).toBe(true);
  });

  it('returns personnel table guidance with palette groups', () => {
    const topic = getDashboardExtensionTopic('add-table');
    expect(topic?.title).toMatch(/personnel/i);
    expect(topic?.paletteGroups).toContain('data-display');
    expect(topic?.steps.length).toBeGreaterThan(0);
  });
});
