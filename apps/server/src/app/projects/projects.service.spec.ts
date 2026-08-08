import { ProjectsService } from './projects.service';
import { defaultComponentRegistry } from '@dashbuilder/core';

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(() => {
    service = new ProjectsService();
  });

  it('creates and lists projects', () => {
    const project = service.createProject({ name: 'My Dashboard' });
    expect(project.id).toBeTruthy();
    expect(service.listProjects()).toHaveLength(1);
  });

  it('creates a valid composite', () => {
    const project = service.createProject({ name: 'Test' });
    const node = defaultComponentRegistry.createNode('visual.input.text', { id: 'n1' });
    const composite = service.createComposite(project.id, {
      name: 'Page 1',
      nodes: [node],
      bindings: [],
    });

    expect(composite.version).toBe(1);
    expect(service.listComposites(project.id)).toHaveLength(1);
  });

  it('allows draft composites with unbound required ports', () => {
    const project = service.createProject({ name: 'Test' });
    const table = defaultComponentRegistry.createNode('visual.table', { id: 't1' });

    const composite = service.createComposite(project.id, {
      name: 'Draft page',
      nodes: [table],
      bindings: [],
    });

    expect(composite.nodes).toHaveLength(1);
  });

  it('increments composite version on update', () => {
    const project = service.createProject({ name: 'Test' });
    const node = defaultComponentRegistry.createNode('visual.input.text', { id: 'n1' });
    const created = service.createComposite(project.id, {
      name: 'Page 1',
      nodes: [node],
      bindings: [],
    });

    const updated = service.updateComposite(project.id, created.id, {
      ...created,
      name: 'Page 1 updated',
    });

    expect(updated.version).toBe(2);
    expect(updated.name).toBe('Page 1 updated');
  });

  it('rejects unknown component types', () => {
    const project = service.createProject({ name: 'Test' });

    expect(() =>
      service.createComposite(project.id, {
        name: 'Bad',
        nodes: [
          {
            id: 'x1',
            type: 'unknown.type',
            label: 'Bad',
            properties: {},
            ports: { inputs: [], outputs: [] },
          },
        ],
        bindings: [],
      }),
    ).toThrow();
  });

  it('deletes projects and composites', () => {
    const project = service.createProject({ name: 'Test' });
    const node = defaultComponentRegistry.createNode('visual.input.text', { id: 'n1' });
    const composite = service.createComposite(project.id, {
      name: 'Page 1',
      nodes: [node],
      bindings: [],
    });

    service.deleteComposite(project.id, composite.id);
    expect(service.listComposites(project.id)).toHaveLength(0);

    service.deleteProject(project.id);
    expect(service.listProjects()).toHaveLength(0);
  });
});
