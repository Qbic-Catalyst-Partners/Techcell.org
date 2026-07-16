import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignModeratorComponent } from './assign-moderator.component';

describe('AssignModeratorComponent', () => {
  let component: AssignModeratorComponent;
  let fixture: ComponentFixture<AssignModeratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignModeratorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AssignModeratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
