import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInternshipModalComponent } from './add-internship-modal.component';

describe('AddInternshipModalComponent', () => {
  let component: AddInternshipModalComponent;
  let fixture: ComponentFixture<AddInternshipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddInternshipModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddInternshipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
