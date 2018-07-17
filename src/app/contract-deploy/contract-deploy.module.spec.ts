import { ContractDeployModule } from './contract-deploy.module';

describe('ContractDeployModule', () => {
  let crowdsaleDeployModule: ContractDeployModule;

  beforeEach(() => {
    crowdsaleDeployModule = new ContractDeployModule();
  });

  it('should create an instance', () => {
    expect(crowdsaleDeployModule).toBeTruthy();
  });
});
