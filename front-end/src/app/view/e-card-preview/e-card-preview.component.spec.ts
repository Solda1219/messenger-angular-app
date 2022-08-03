import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECardPreviewComponent } from './e-card-preview.component';

describe('ECardPreviewComponent', () => {
  let component: ECardPreviewComponent;
  let fixture: ComponentFixture<ECardPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ECardPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ECardPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
