import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCertificationComponent } from './add-edit-certification.component';

describe('AddEditCertificationComponent', () => {
  let component: AddEditCertificationComponent;
  let fixture: ComponentFixture<AddEditCertificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditCertificationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
