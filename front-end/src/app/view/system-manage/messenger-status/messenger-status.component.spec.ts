import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessengerStatusComponent } from './messenger-status.component';

describe('MessengerStatusComponent', () => {
  let component: MessengerStatusComponent;
  let fixture: ComponentFixture<MessengerStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessengerStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessengerStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
