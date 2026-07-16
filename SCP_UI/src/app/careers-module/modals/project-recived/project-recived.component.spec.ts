import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRecivedComponent } from './project-recived.component';

describe('ProjectRecivedComponent', () => {
  let component: ProjectRecivedComponent;
  let fixture: ComponentFixture<ProjectRecivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProjectRecivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProjectRecivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
