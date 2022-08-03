import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnRecordComponent } from './learn-record.component';

describe('LearnRecordComponent', () => {
  let component: LearnRecordComponent;
  let fixture: ComponentFixture<LearnRecordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnRecordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
