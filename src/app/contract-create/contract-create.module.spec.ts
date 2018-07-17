import { ContractCreateModule } from './contract-create.module';

describe('ContractCreateModule', () => {
  let crowdsaleCreateModule: ContractCreateModule;

  beforeEach(() => {
    crowdsaleCreateModule = new ContractCreateModule();
  });

  it('should create an instance', () => {
    expect(crowdsaleCreateModule).toBeTruthy();
  });
});
