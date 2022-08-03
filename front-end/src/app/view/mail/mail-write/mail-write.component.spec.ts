import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MailWriteComponent } from './mail-write.component';

describe('MailWriteComponent', () => {
  let component: MailWriteComponent;
  let fixture: ComponentFixture<MailWriteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MailWriteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MailWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
