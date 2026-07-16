import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditAchievementComponent } from './add-edit-achievement.component';

describe('AddEditAchievementComponent', () => {
  let component: AddEditAchievementComponent;
  let fixture: ComponentFixture<AddEditAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditAchievementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
