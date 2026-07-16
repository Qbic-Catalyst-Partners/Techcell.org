import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationListingModalComponent } from './certification-listing-modal.component';

describe('CertificationListingModalComponent', () => {
  let component: CertificationListingModalComponent;
  let fixture: ComponentFixture<CertificationListingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificationListingModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificationListingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
