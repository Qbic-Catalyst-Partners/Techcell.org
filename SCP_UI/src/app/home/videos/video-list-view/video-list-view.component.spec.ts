import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoListViewComponent } from './video-list-view.component';

describe('VideoListViewComponent', () => {
  let component: VideoListViewComponent;
  let fixture: ComponentFixture<VideoListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VideoListViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
