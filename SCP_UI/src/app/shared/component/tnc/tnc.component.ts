import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tnc',
  templateUrl: './tnc.component.html',
  styleUrl: './tnc.component.scss',
})
export class TncComponent {
  items = [
    {
      version: '1.0',
      date: '15/May/24',
      docEditor: 'Director',
      comment: 'Initial Version',
    },
    {
      version: '',
      date: '',
      docEditor: '',
      comment: '',
    },
    {
      version: '',
      date: '',
      docEditor: '',
      comment: '',
    },
  ];
  constructor(
    private activeModal: NgbActiveModal
  ) {}

  close() {
    this.activeModal.close();
  }
}
