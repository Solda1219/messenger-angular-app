import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeptManageComponent } from './dept-manage.component';

describe('DeptManageComponent', () => {
  let component: DeptManageComponent;
  let fixture: ComponentFixture<DeptManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeptManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeptManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
