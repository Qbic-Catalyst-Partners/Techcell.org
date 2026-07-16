import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorCommunitiesComponent } from './moderator-communities.component';

describe('ModeratorCommunitiesComponent', () => {
  let component: ModeratorCommunitiesComponent;
  let fixture: ComponentFixture<ModeratorCommunitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeratorCommunitiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratorCommunitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
