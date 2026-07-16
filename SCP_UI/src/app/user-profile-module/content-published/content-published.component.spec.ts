import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentPublishedComponent } from './content-published.component';

describe('ContentPublishedComponent', () => {
  let component: ContentPublishedComponent;
  let fixture: ComponentFixture<ContentPublishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentPublishedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContentPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
