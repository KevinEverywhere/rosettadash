import { TestBed } from '@angular/core/testing';
import { ContentLibraryService } from './content-library.service';

describe('ContentLibraryService', () => {
  it('saves and lists composite entries', () => {
    TestBed.configureTestingModule({
      providers: [ContentLibraryService],
    });
    const service = TestBed.inject(ContentLibraryService);
    service.initialize();
    service.saveComposite({
      label: 'Test dashboard',
      composite: {
        id: 'c1',
        name: 'Test',
        version: 1,
        nodes: [],
        bindings: [],
      },
    });
    expect(service.entries()).toHaveLength(1);
    expect(service.entries()[0]?.label).toBe('Test dashboard');
  });
});
