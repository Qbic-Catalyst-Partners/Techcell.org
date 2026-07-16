import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthUtils } from '../../utility/auth-utils';
import { ApiService } from '../../services/api.service';
import { LoginModalComponent } from '../../../user-module/login-modal/login-modal.component';

export interface ModalSetting {
  type: string;
  message1: string;
  message2: string;
  btnName: string;
  header: string;
  session: boolean;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css',
})
export class ModalComponent implements OnInit {
  @Input() public modalConfig: ModalSetting | undefined;

  constructor(
    private activeModal: NgbActiveModal,
    private router: Router,
    private apiService: ApiService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  public logout(): void {
    this.apiService.logOut().subscribe({
      next: () => {
        AuthUtils.clearSessionStorage();
        this.activeModal.close();
        this.router.navigate(['/']);
      },
      error: () => {
        this.activeModal.close();
      },
    });
  }

  close(result?: any) {
    if (this.modalConfig?.type === 'careerApplyModal') {
      this.activeModal.close(result);
    } else if (this.modalConfig?.type === 'newErrorModal' && this.modalConfig?.message1?.includes('session is expired')) {
      this.activeModal.close();
      this.router.navigate(['/']);
    } else if (this.modalConfig?.btnName === 'Login') {
      this.activeModal.close();
      this.modalService.open(LoginModalComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'md',
        centered: true,
        windowClass: 'modal-top',
      });
    } else {
      this.activeModal.close();
    }
  }
}
