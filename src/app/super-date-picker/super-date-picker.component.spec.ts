import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuperDatePickerComponent } from './super-date-picker.component';

describe('SuperDatePickerComponent', () => {
  let component: SuperDatePickerComponent;
  let fixture: ComponentFixture<SuperDatePickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuperDatePickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuperDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
