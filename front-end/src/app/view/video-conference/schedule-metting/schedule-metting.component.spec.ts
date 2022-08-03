import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMettingComponent } from './schedule-metting.component';

describe('ScheduleMettingComponent', () => {
  let component: ScheduleMettingComponent;
  let fixture: ComponentFixture<ScheduleMettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleMettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleMettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
