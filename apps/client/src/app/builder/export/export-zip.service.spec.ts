import { ExportZipService } from './export-zip.service';

describe('ExportZipService', () => {
  let service: ExportZipService;

  beforeEach(() => {
    service = new ExportZipService();
  });

  it('slugifies composite names for zip filenames', () => {
    expect(service.slugify('Sales Dashboard')).toBe('sales-dashboard');
    expect(service.slugify('  ')).toBe('dashboard');
  });
});
