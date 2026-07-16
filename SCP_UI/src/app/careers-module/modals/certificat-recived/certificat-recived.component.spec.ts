import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificatRecivedComponent } from './certificat-recived.component';

describe('CertificatRecivedComponent', () => {
  let component: CertificatRecivedComponent;
  let fixture: ComponentFixture<CertificatRecivedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CertificatRecivedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificatRecivedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
