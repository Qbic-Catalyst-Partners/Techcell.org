import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCertificationModalComponent } from './add-certification-modal.component';

describe('AddCertificationModalComponent', () => {
  let component: AddCertificationModalComponent;
  let fixture: ComponentFixture<AddCertificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddCertificationModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCertificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
