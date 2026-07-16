import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../shared/services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { CommonService } from '../../shared/services/common.service';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { RazorpayPaymentComponent } from '../razorpayPayment/razorpayPayment.component';
import { AuthUtils } from '../../shared/utility/auth-utils';

@Component({
  selector: 'app-login-with-otp',
  templateUrl: './login-with-otp.component.html',
  styleUrl: './login-with-otp.component.scss',
})
export class LoginWithOtpComponent implements OnInit, OnDestroy {
  isSubmitted: boolean = false;
  countDown!: Subscription;
  totalDuration: any = 60;
  counter = 1 * 60;
  @Input() viewData!: any;
  loginResponse: any;

  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    private modalService: NgbModal,
    public commonService: CommonService,
    public router: Router,
    private matDialogRef: MatDialogRef<LoginWithOtpComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    private matDialog: MatDialog
  ) {
    if (dialogData) {
      this.viewData = dialogData;
    }
  }

  ngOnInit(): void {
    if (this.viewData) {
      this.loginForm.patchValue({
        emailId: this.viewData.email,
      });
      this.loginForm.controls['emailId'].disable();
    }
    this.startTimer();
  }

  public loginForm = this._fb.group({
    emailId: ['', [Validators.required]],
    otp: ['', [Validators.required, Validators.maxLength(6)]],
  });

  startTimer() {
    this.countDown = timer(0, 1000).subscribe((res) => {
      --this.counter;
      if (this.counter === 0) {
        this.countDown.unsubscribe();
      }
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    let payload = {
      password: this.loginForm.controls['otp'].value,
      emailId: this.viewData.email,
    };

    if (this.loginForm.valid) {
      this.apiService.siginInUsingOtp(payload).subscribe({
        next: (res) => {
          this.loginResponse = res;
          this.countDown.unsubscribe();
          this.matDialog.closeAll();

          // Check payment status similar to login-modal
          if (!res?.paymentReceived) {
            // Open payment modal
            this.openRazorpayPaymentModal();
          } else {
            // Navigate normally
            this.navigateAfterLogin();
          }
        },
        error: (error) => {
          this.commonService.dialog({
            type: 'newErrorModal',
            message1: error.message || 'Invalid Email OTP or OTP is expired',
            btnName: 'OK',
            header: 'Error'
          });
        },
      });
    }
  }

  // Add navigation method
  navigateAfterLogin() {
    let routeData: any = localStorage.getItem('routeName');
    let loadFromLink: any =
      localStorage.getItem('routeName') == 'undefined'
        ? null
        : JSON.parse(routeData);
    if (!!loadFromLink) {
      this.router.navigate([loadFromLink]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  openRazorpayPaymentModal() {
    const modalRef = this.modalService.open(RazorpayPaymentComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });

    modalRef.componentInstance.userEmail =
      this.loginResponse?.userDetailResponseDTO?.emailId || this.viewData.email;

    // Handle modal close to redirect properly
    modalRef.result.then(
      (result) => {
        if (result === 'payment_success') {
          this.navigateAfterLogin();
        } else {
          // Payment canceled or failed
          this.logoutUser();
        }
      },
      () => {
        // Modal dismissed (e.g., clicked outside or pressed ESC)
        this.logoutUser();
      }
    );
  }

  // Add this new method for logging out the user
  logoutUser() {
    this.apiService.logOut().subscribe({
      next: () => {
        AuthUtils.clearSessionStorage(); // Clear all data including the token
        this.router.navigate(['/auth']); // Redirect to login page
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Still clear storage and redirect even if API fails
        AuthUtils.clearSessionStorage();
        this.router.navigate(['/auth']);
      },
    });
  }

  reSend() {
    this.counter = 60;
    this.startTimer();
    this.loginWithOtp();
  }

  close() {
    this.matDialogRef.close();
  }

  public loginWithOtp() {
    this.apiService.generateSiginOtp(this.viewData.email).subscribe({
      next: (res: any) => {},
      error: (error) => {
        this.commonService.dialog({
          type: 'newErrorModal',
          message1: error.message,
          btnName: 'OK',
          header: 'Error'
        });
      },
    });
  }

  ngOnDestroy(): void {
    if (this.countDown) {
      this.countDown.unsubscribe();
    }
  }
}
