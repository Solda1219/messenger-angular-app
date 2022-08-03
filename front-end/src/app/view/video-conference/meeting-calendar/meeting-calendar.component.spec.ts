import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingCalendarComponent } from './meeting-calendar.component';

describe('MeetingCalendarComponent', () => {
  let component: MeetingCalendarComponent;
  let fixture: ComponentFixture<MeetingCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
