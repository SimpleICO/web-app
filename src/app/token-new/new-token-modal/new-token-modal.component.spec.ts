import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTokenModalComponent } from './new-token-modal.component';

describe('NewTokenModalComponent', () => {
  let component: NewTokenModalComponent;
  let fixture: ComponentFixture<NewTokenModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewTokenModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTokenModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
