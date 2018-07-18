import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedSupplyComponent } from './fixed-supply.component';

describe('FixedSupplyComponent', () => {
  let component: FixedSupplyComponent;
  let fixture: ComponentFixture<FixedSupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedSupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
