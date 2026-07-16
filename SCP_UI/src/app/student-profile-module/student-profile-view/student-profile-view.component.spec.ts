import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentProfileViewComponent } from './student-profile-view.component';

describe('StudentProfileViewComponent', () => {
  let component: StudentProfileViewComponent;
  let fixture: ComponentFixture<StudentProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentProfileViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
