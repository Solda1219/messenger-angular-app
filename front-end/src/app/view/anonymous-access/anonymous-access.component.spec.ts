import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymousAccessComponent } from './anonymous-access.component';

describe('AnonymousAccessComponent', () => {
  let component: AnonymousAccessComponent;
  let fixture: ComponentFixture<AnonymousAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnonymousAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymousAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
