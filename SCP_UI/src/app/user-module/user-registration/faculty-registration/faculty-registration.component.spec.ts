import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyRegistrationComponent } from './faculty-registration.component';

describe('FacultyRegistrationComponent', () => {
  let component: FacultyRegistrationComponent;
  let fixture: ComponentFixture<FacultyRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacultyRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacultyRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
