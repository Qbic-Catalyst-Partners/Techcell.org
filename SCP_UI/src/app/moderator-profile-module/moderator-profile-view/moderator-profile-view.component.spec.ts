import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorProfileViewComponent } from './moderator-profile-view.component';

describe('ModeratorProfileViewComponent', () => {
  let component: ModeratorProfileViewComponent;
  let fixture: ComponentFixture<ModeratorProfileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeratorProfileViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratorProfileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
