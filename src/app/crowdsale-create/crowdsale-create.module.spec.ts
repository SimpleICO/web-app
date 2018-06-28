import { CrowdsaleCreateModule } from './crowdsale-create.module';

describe('CrowdsaleCreateModule', () => {
  let crowdsaleCreateModule: CrowdsaleCreateModule;

  beforeEach(() => {
    crowdsaleCreateModule = new CrowdsaleCreateModule();
  });

  it('should create an instance', () => {
    expect(crowdsaleCreateModule).toBeTruthy();
  });
});
