import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingTokenComponent } from './existing-token.component';

describe('ExistingTokenComponent', () => {
  let component: ExistingTokenComponent;
  let fixture: ComponentFixture<ExistingTokenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingTokenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
