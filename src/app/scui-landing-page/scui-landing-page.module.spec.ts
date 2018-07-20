import { ScuiLandingPageModule } from './scui-landing-page.module';

describe('ScuiLandingPageModule', () => {
  let scuiLandingPageModule: ScuiLandingPageModule;

  beforeEach(() => {
    scuiLandingPageModule = new ScuiLandingPageModule();
  });

  it('should create an instance', () => {
    expect(scuiLandingPageModule).toBeTruthy();
  });
});
