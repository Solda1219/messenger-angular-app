import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordingContentComponent } from './recording-content.component';

describe('RecordingContentComponent', () => {
  let component: RecordingContentComponent;
  let fixture: ComponentFixture<RecordingContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecordingContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordingContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
