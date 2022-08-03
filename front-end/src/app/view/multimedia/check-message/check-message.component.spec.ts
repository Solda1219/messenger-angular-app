import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckMessageComponent } from './check-message.component';

describe('CheckMessageComponent', () => {
  let component: CheckMessageComponent;
  let fixture: ComponentFixture<CheckMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
