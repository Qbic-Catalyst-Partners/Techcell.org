import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternshipModalComponent } from './internship-modal.component';

describe('InternshipModalComponent', () => {
  let component: InternshipModalComponent;
  let fixture: ComponentFixture<InternshipModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternshipModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InternshipModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
