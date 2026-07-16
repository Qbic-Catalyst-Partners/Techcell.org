import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../shared/services/api.service';
import { CommonService } from '../../shared/services/common.service';
import { Router } from '@angular/router';
import { PaymentIframeComponent } from '../payment-iframe/payment-iframe.component';
import { RazorpayPaymentComponent } from '../razorpayPayment/razorpayPayment.component';

@Component({
  selector: 'app-viewpayment',
  templateUrl: './viewpayment.component.html',
  styleUrl: './viewpayment.component.scss',
})
export class ViewpaymentComponent {
  constructor(
    private activeModal: NgbActiveModal,
    private apiService: ApiService,
    public commonService: CommonService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  close() {
    this.activeModal.close();
    this.router.navigate(['/']);
  }

  pay() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(RazorpayPaymentComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }
}
