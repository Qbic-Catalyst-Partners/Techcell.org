import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approve-modal',
  templateUrl: './approve-modal.component.html',
  styleUrl: './approve-modal.component.scss'
})
export class ApproveModalComponent {

  constructor(private activeModal: NgbActiveModal){}

  close(){
    this.activeModal.close();
  }

  approve(){
    this.activeModal.close(true);
  }
}
