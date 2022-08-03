import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingStatusComponent } from './meeting-status.component';

describe('MeetingStatusComponent', () => {
  let component: MeetingStatusComponent;
  let fixture: ComponentFixture<MeetingStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MeetingStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
