import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyProfileViewComponent } from './faculty-profile-view.component';

describe('FacultyProfileViewComponent', () => {
  let component: FacultyProfileViewComponent;
  let fixture: ComponentFixture<FacultyProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacultyProfileViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacultyProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
