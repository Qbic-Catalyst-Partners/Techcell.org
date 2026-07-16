import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoblistingModalComponent } from './joblisting-modal.component';

describe('JoblistingModalComponent', () => {
  let component: JoblistingModalComponent;
  let fixture: ComponentFixture<JoblistingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoblistingModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JoblistingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
