import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogListViewComponent } from './blog-list-view.component';

describe('BlogListViewComponent', () => {
  let component: BlogListViewComponent;
  let fixture: ComponentFixture<BlogListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BlogListViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BlogListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
