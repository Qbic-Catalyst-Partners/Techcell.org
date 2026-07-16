import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorVideosComponent } from './moderator-videos.component';

describe('ModeratorVideosComponent', () => {
  let component: ModeratorVideosComponent;
  let fixture: ComponentFixture<ModeratorVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeratorVideosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratorVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
