import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentIframeComponent } from './payment-iframe.component';

describe('PaymentIframeComponent', () => {
  let component: PaymentIframeComponent;
  let fixture: ComponentFixture<PaymentIframeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentIframeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentIframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
