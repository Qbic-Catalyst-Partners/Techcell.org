// src/app/shared/component/success-modal/success-modal.component.ts
import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-success-modal',
  template: `
    <div class="modal-body">
      <div class="d-flex align-items-center gap-4">
        <div>
          <img
            src="../assets/lucide-icons/success-modal-icon.svg"
            alt="success check"
          />
        </div>
        <div>
          <h4 class="h4 fw-bold">{{ title }}</h4>
          <p>{{ message }}</p>
        </div>
      </div>
    </div>
    <div class="modal-footer border-0 justify-content-center">
      <button
        type="button"
        class="btn btn-primary"
        (click)="activeModal.close('Close click')"
      >
        {{ buttonText }}
      </button>
    </div>
  `,
  styles: [
    `
      .modal-header {
        background-color: #f8f9fa;
      }
    `,
  ],
})
export class SuccessModalComponent {
  @Input() title: string = 'Success';
  @Input() message: string = 'Operation completed successfully';
  @Input() buttonText: string = 'OK';

  constructor(public activeModal: NgbActiveModal) {}
}
