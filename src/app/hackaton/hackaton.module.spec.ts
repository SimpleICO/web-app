import { HackatonModule } from './hackaton.module';

describe('HackatonModule', () => {
  let hackatonModule: HackatonModule;

  beforeEach(() => {
    hackatonModule = new HackatonModule();
  });

  it('should create an instance', () => {
    expect(hackatonModule).toBeTruthy();
  });
});
