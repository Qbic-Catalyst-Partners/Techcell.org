import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reject-modal',
  templateUrl: './reject-modal.component.html',
  styleUrl: './reject-modal.component.scss'
})
export class RejectModalComponent {
  reason: string = '';

  constructor(private activeModal: NgbActiveModal) {}

  close() {
    this.activeModal.close();
  }

  reject() {
    this.reason = (document.getElementById('Reason') as HTMLTextAreaElement).value;
    this.activeModal.close(this.reason);
  }
}
