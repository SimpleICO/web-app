import { CrowdsaleDeployModule } from './crowdsale-deploy.module';

describe('CrowdsaleDeployModule', () => {
  let crowdsaleDeployModule: CrowdsaleDeployModule;

  beforeEach(() => {
    crowdsaleDeployModule = new CrowdsaleDeployModule();
  });

  it('should create an instance', () => {
    expect(crowdsaleDeployModule).toBeTruthy();
  });
});
