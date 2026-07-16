import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-refund-policy',
  templateUrl: './refund-policy.component.html',
  styleUrl: './refund-policy.component.scss',
})
export class RefundPolicyComponent {
  constructor(private activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }
}
