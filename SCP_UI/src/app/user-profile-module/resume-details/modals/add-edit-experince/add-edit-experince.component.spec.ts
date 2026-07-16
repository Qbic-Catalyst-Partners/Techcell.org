import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditExperinceComponent } from './add-edit-experince.component';

describe('AddEditExperinceComponent', () => {
  let component: AddEditExperinceComponent;
  let fixture: ComponentFixture<AddEditExperinceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditExperinceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditExperinceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
