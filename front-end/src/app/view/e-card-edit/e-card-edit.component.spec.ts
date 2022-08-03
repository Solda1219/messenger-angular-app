import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ECardEditComponent } from './e-card-edit.component';

describe('ECardEditComponent', () => {
  let component: ECardEditComponent;
  let fixture: ComponentFixture<ECardEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ECardEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ECardEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
