import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailedErc20Component } from './detailed-erc20.component';

describe('DetailedErc20Component', () => {
  let component: DetailedErc20Component;
  let fixture: ComponentFixture<DetailedErc20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailedErc20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailedErc20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
