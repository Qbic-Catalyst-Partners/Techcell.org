import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewResumeComponent } from './view-resume.component';

describe('ViewResumeComponent', () => {
  let component: ViewResumeComponent;
  let fixture: ComponentFixture<ViewResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewResumeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
