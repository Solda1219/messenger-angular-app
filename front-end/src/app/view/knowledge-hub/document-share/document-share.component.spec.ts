import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentShareComponent } from './document-share.component';

describe('DocumentShareComponent', () => {
  let component: DocumentShareComponent;
  let fixture: ComponentFixture<DocumentShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentShareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
