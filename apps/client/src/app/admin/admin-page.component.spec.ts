import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { AdminPageComponent } from './admin-page.component';
import { ContentLibraryService } from './content-library.service';
import { AdminFeatureFlagsService } from './admin-feature-flags.service';

describe('AdminPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPageComponent],
      providers: [provideRouter([]), ContentLibraryService, AdminFeatureFlagsService],
    }).compileComponents();
  });

  it('creates the admin page', () => {
    const fixture = TestBed.createComponent(AdminPageComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[data-testid="admin-page"]')).toBeTruthy();
  });
});
