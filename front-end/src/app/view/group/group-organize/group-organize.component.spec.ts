import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupOrganizeComponent } from './group-organize.component';

describe('GroupOrganizeComponent', () => {
  let component: GroupOrganizeComponent;
  let fixture: ComponentFixture<GroupOrganizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupOrganizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupOrganizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
