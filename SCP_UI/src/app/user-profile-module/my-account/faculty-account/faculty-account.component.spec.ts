import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacultyAccountComponent } from './faculty-account.component';

describe('FacultyAccountComponent', () => {
  let component: FacultyAccountComponent;
  let fixture: ComponentFixture<FacultyAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacultyAccountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FacultyAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
