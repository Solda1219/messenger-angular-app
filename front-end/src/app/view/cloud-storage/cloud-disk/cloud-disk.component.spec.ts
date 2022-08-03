import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudDiskComponent } from './cloud-disk.component';

describe('CloudDiskComponent', () => {
  let component: CloudDiskComponent;
  let fixture: ComponentFixture<CloudDiskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloudDiskComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudDiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
