import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryMeetingComponent } from './history-meeting.component';

describe('HistoryMeetingComponent', () => {
  let component: HistoryMeetingComponent;
  let fixture: ComponentFixture<HistoryMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
