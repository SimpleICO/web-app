import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MVT20Component } from './mvt20.component';

describe('MVT20Component', () => {
  let component: MVT20Component;
  let fixture: ComponentFixture<MVT20Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MVT20Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MVT20Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
