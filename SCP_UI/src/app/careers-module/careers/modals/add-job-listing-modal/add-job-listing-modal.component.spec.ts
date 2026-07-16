import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddJobListingModalComponent } from './add-job-listing-modal.component';

describe('AddJobListingModalComponent', () => {
  let component: AddJobListingModalComponent;
  let fixture: ComponentFixture<AddJobListingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddJobListingModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddJobListingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
