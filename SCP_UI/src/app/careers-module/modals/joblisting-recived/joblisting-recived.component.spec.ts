import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoblistingRecivedComponent } from './joblisting-recived.component';

describe('JoblistingRecivedComponent', () => {
  let component: JoblistingRecivedComponent;
  let fixture: ComponentFixture<JoblistingRecivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoblistingRecivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoblistingRecivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
