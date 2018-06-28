import { TestBed, inject } from '@angular/core/testing';

import { CrowdsaleDeploymentFactory } from './crowdsale-deployment.factory';

describe('CrowdsaleDeploymentFactory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CrowdsaleDeploymentFactory]
    });
  });

  it('should be created', inject([CrowdsaleDeploymentFactory], (service: CrowdsaleDeploymentFactory) => {
    expect(service).toBeTruthy();
  }));
});
