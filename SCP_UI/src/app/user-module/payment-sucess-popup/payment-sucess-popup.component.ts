import { Component } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewpaymentComponent } from '../viewpayment/viewpayment.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-sucess-popup',
  templateUrl: './payment-sucess-popup.component.html',
  styleUrl: './payment-sucess-popup.component.scss'
})
export class PaymentSucessPopupComponent {
  constructor(private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private router: Router
  ) { }

  close() {
    this.activeModal.close();
    this.router.navigate(['/']);
  }

  nextPayment(){
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(ViewpaymentComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }
}
