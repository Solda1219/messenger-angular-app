import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebofficeSettingComponent } from './weboffice-setting.component';

describe('WebofficeSettingComponent', () => {
  let component: WebofficeSettingComponent;
  let fixture: ComponentFixture<WebofficeSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebofficeSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebofficeSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
