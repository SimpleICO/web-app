import { TestBed, inject } from '@angular/core/testing';

import { ErrorTrackingService } from './error-tracking.service';

describe('ErrorTrackingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorTrackingService]
    });
  });

  it('should be created', inject([ErrorTrackingService], (service: ErrorTrackingService) => {
    expect(service).toBeTruthy();
  }));
});
