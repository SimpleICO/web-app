import { TestBed, inject } from '@angular/core/testing';

import { EthereumService } from './ethereum.service';

describe('EthereumService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EthereumService]
    });
  });

  it('should be created', inject([EthereumService], (service: EthereumService) => {
    expect(service).toBeTruthy();
  }));
});
