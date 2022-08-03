import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantMeetingComponent } from './instant-meeting.component';

describe('InstantMeetingComponent', () => {
  let component: InstantMeetingComponent;
  let fixture: ComponentFixture<InstantMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
