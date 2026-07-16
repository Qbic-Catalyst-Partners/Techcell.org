import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityListingComponent } from './community-listing.component';

describe('CommunityListingComponent', () => {
  let component: CommunityListingComponent;
  let fixture: ComponentFixture<CommunityListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunityListingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommunityListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
