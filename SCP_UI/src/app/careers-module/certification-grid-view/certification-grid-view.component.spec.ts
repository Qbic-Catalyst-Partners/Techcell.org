import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationGridViewComponent } from './certification-grid-view.component';

describe('CertificationGridViewComponent', () => {
  let component: CertificationGridViewComponent;
  let fixture: ComponentFixture<CertificationGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificationGridViewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificationGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
