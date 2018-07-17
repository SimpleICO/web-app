import { TestBed, inject } from '@angular/core/testing';

import { ContractDeploymentFactory } from './contract-deployment.factory';

describe('ContractDeploymentFactory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContractDeploymentFactory]
    });
  });

  it('should be created', inject([ContractDeploymentFactory], (service: ContractDeploymentFactory) => {
    expect(service).toBeTruthy();
  }));
});
