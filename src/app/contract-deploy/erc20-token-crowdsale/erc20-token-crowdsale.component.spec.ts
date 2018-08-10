import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20TokenCrowdsaleComponent } from './erc20-token-crowdsale.component';

describe('Erc20TokenCrowdsaleComponent', () => {
  let component: Erc20TokenCrowdsaleComponent;
  let fixture: ComponentFixture<Erc20TokenCrowdsaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Erc20TokenCrowdsaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Erc20TokenCrowdsaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
