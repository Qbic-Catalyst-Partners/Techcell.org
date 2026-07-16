import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSucessPopupComponent } from './payment-sucess-popup.component';

describe('PaymentSucessPopupComponent', () => {
  let component: PaymentSucessPopupComponent;
  let fixture: ComponentFixture<PaymentSucessPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentSucessPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentSucessPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
