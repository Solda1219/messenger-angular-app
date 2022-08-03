import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomingMeetingComponent } from './incoming-meeting.component';

describe('IncomingMeetingComponent', () => {
  let component: IncomingMeetingComponent;
  let fixture: ComponentFixture<IncomingMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomingMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncomingMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
