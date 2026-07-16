import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationListViewComponent } from './certification-list-view.component';

describe('CertificationListViewComponent', () => {
  let component: CertificationListViewComponent;
  let fixture: ComponentFixture<CertificationListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificationListViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificationListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
