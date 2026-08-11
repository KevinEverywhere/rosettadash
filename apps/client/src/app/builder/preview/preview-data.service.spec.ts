import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PreviewDataService } from './preview-data.service';

describe('PreviewDataService', () => {
  let service: PreviewDataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PreviewDataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('loads preview fixtures from the API', async () => {
    const loadPromise = service.load({
      projectName: 'Ops',
      compositeName: 'Main',
    });

    const request = httpMock.expectOne('/api/preview/data');
    expect(request.request.method).toBe('POST');
    request.flush({
      tableRows: [{ id: '1', name: 'Ops Systems', status: 'Active', amount: 1000, date: '2026-08-01' }],
      newsRows: [],
      chartPoints: [{ label: 'Mon', value: 10 }],
      selectOptions: [{ label: 'Ops KPI', value: 'ops' }],
      kpiValue: 5000,
      kpiDelta: 3.2,
      dateRangeLabel: 'Last 7 days',
      nodes: {},
    });

    await loadPromise;
    expect(service.source()).toBe('api');
    expect(service.bundle().kpiValue).toBe(5000);
  });

  it('falls back to defaults when the API fails', async () => {
    const loadPromise = service.load({ projectName: 'Broken' });
    httpMock.expectOne('/api/preview/data').flush(null, {
      status: 500,
      statusText: 'Server Error',
    });

    await loadPromise;
    expect(service.source()).toBe('default');
    expect(service.bundle().tableRows.length).toBeGreaterThan(0);
  });
});
