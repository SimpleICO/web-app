import { TestBed, inject } from '@angular/core/testing';

import { DeploymentStateService } from './deployment-state.service';

describe('DeploymentStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeploymentStateService]
    });
  });

  it('should be created', inject([DeploymentStateService], (service: DeploymentStateService) => {
    expect(service).toBeTruthy();
  }));
});
