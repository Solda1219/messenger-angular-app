import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressBookUserContentComponent } from './address-book-user-content.component';

describe('AddressBookUserContentComponent', () => {
  let component: AddressBookUserContentComponent;
  let fixture: ComponentFixture<AddressBookUserContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressBookUserContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressBookUserContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
