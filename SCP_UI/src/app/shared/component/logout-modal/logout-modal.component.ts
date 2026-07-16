import { Component } from '@angular/core';
import { AuthUtils } from '../../utility/auth-utils';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-logout-modal',
  templateUrl: './logout-modal.component.html',
  styleUrl: './logout-modal.component.scss',
})
export class LogoutModalComponent {
  constructor(public modalService: NgbModal,
     private router: Router,
     private activeModal: NgbActiveModal,
    private apiService :ApiService) {}

  public logout(): void {
    this.apiService.logOut().subscribe({
      next:()=>{
        this.activeModal.close()
        AuthUtils.clearSessionStorage();
        this.router.navigate(['/']);
      },
      error:()=>{
        this.activeModal.close();
      }
    });
  }

  close() {
    this.activeModal.close()
  }
}
