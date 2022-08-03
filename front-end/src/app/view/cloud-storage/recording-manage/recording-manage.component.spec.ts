import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingManageComponent } from './recording-manage.component';

describe('RecordingManageComponent', () => {
  let component: RecordingManageComponent;
  let fixture: ComponentFixture<RecordingManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
