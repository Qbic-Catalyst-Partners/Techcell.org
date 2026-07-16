import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModeratorBlogsComponent } from './moderator-blogs.component';

describe('ModeratorBlogsComponent', () => {
  let component: ModeratorBlogsComponent;
  let fixture: ComponentFixture<ModeratorBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModeratorBlogsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModeratorBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
