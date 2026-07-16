import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../shared/services/api.service';
import { CommonService } from '../../shared/services/common.service';
import { Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';
import { NavigationModelComponent } from '../../shared/component/navigation-model/navigation-model.component';
import { STUDENT_ROLE } from '../../common/constants';
import { PaymentSucessPopupComponent } from '../payment-sucess-popup/payment-sucess-popup.component';
import { RazorpayPaymentComponent } from '../razorpayPayment/razorpayPayment.component';
import { SuccessModalComponent } from '../../shared/component/modal/success-modal/success-modal.component';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { AuthUtils } from '../../shared/utility/auth-utils';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss',
})
export class AuthenticationComponent implements OnInit {
  isSubmitted: boolean = false;
  @Input() viewData!: any;
  countDownEmail!: Subscription;
  countDownMobile!: Subscription;
  totalDuration: any = 60;
  emailCounter = 1 * 60;
  mobileCounter = 1 * 60;
  role!: boolean;

  constructor(
    private _fb: FormBuilder,
    private activeModal: NgbActiveModal,
    private apiService: ApiService,
    public commonService: CommonService,
    private router: Router,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (this.viewData) {
      this.patchValue(this.viewData);
    }
    this.startTimerEmail();
    this.startTimerMobile();
    this.role = this.apiService.Role == STUDENT_ROLE;
  }
  public authForm = this._fb.group({
    emailId: ['', [Validators.required]],
    otp: ['', Validators.required],
    mobile: ['', Validators.required],
    Motp: ['', Validators.required],
  });
  get f() {
    return this.authForm.controls;
  }

  openLoginModal() {
    const modalRef = this.modalService.open(LoginModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.authForm.valid) {
      let payload = {
        emailId: this.authForm.controls['emailId'].value,
        emailOTP: this.authForm.controls['otp'].value,
        mobileOTP: this.authForm.controls['Motp'].value,
      };
      if (this.viewData?.isOldEmail) {
        payload.emailId = this.viewData?.OldEmail;
      }

      this.apiService.verifyOtp(payload).subscribe({
        next: (res: any) => {
          console.log(res);
          this.countDownEmail.unsubscribe();
          this.countDownMobile.unsubscribe();
          this.activeModal.close(true);

          // For registration flow
          if (this.viewData?.message) {
            // Show payment modal directly after OTP verification
            if (res.data.userDetailResponseDTO.paymentReceived) {
              this.showRegistrationSuccessModal();
            } else {
              this.openRazorpayPaymentModal();
            }
          } else {
            // Login flow – Refresh user data after OTP verification
            if (this.viewData?.navigate === false) {
              // Caller explicitly asked us NOT to redirect
              return;
            }
            this.refreshUserData();
          }
        },
        error: (error) => {
          console.log(error.message);
          this.commonService.dialog('Error', error.message);
        },
      });
    }
  }

  // Add method to refresh user data
  refreshUserData() {
    const userData = AuthUtils.getUserDetails();
    if (userData) {
      const userInfo = JSON.parse(userData);
      this.apiService
        .getUserProfile(userInfo.userDetailResponseDTO.userId)
        .subscribe({
          next: (res: any) => {
            // Update local storage with fresh user data
            const currentUserData = JSON.parse(userData);
            currentUserData.userDetailResponseDTO =
              res.data.userDetailResponseDTO;
            AuthUtils.setUserDetails(currentUserData);

            // Now navigate to home
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.log(error.message);
            this.commonService.dialog('Error', 'Failed to refresh user data');
          },
        });
    }
  }

  openRazorpayPaymentModal() {
    const modalRef = this.modalService.open(RazorpayPaymentComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });

    // Pass email from registration data
    modalRef.componentInstance.userEmail = this.viewData?.email || '';

    // After payment completion, show success modal
    modalRef.result.then(
      (result) => {
        if (result === 'payment_success') {
          this.showRegistrationSuccessModal();
        } else {
          // Payment canceled or failed
          this.router.navigate(['/auth']);
        }
      },
      () => {
        // Modal dismissed
        this.router.navigate(['/auth']);
      }
    );
  }

  // Add method to show registration success modal
  showRegistrationSuccessModal() {
    const successModalRef = this.modalService.open(SuccessModalComponent, {
      backdrop: 'static',
      keyboard: true,
      centered: true,
    });

    successModalRef.componentInstance.title = 'Registered Successfully';
    successModalRef.componentInstance.message =
      'Your registration is successfully completed.';
    successModalRef.componentInstance.buttonText = 'Login';

    successModalRef.result.then(
      () => {
        this.openLoginModal();
      },
      () => {
        this.openLoginModal();
      }
    );
  }

  patchValue(formData: any) {
    this.authForm.patchValue({
      emailId: formData.email,
      mobile: formData.mobile,
    });
    this.authForm.controls['emailId'].disable();
    this.authForm.controls['mobile'].disable();
  }

  startTimerEmail() {
    this.countDownEmail = timer(0, 1000).subscribe((res) => {
      --this.emailCounter;
      if (this.emailCounter === 0) {
        this.countDownEmail.unsubscribe();
      }
    });
  }

  startTimerMobile() {
    this.countDownMobile = timer(0, 1000).subscribe((res) => {
      --this.mobileCounter;
      if (this.mobileCounter === 0) {
        this.countDownMobile.unsubscribe();
      }
    });
  }

  reSendEmail() {
    // Reset counter and start timer
    this.emailCounter = 60;
    this.startTimerEmail();

    // Call API to resend email OTP
    this.apiService.resendEmailOtp().subscribe({
      next: (res: any) => {
        this.commonService.dialog('Success', 'OTP sent to your email');
      },
      error: (error) => {
        console.log(error.message);
        this.commonService.dialog(
          'Error',
          error.message || 'Failed to send email OTP'
        );
      },
    });
  }

  reSendMobile() {
    // Reset counter and start timer
    this.mobileCounter = 60;
    this.startTimerMobile();

    // Call API to resend mobile OTP
    this.apiService.resendSmsOtp().subscribe({
      next: (res: any) => {
        this.commonService.dialog('Success', 'OTP sent to your mobile');
      },
      error: (error) => {
        console.log(error.message);
        this.commonService.dialog(
          'Error',
          error.message || 'Failed to send mobile OTP'
        );
      },
    });
  }

  close() {
    this.activeModal.close();
    if (this.viewData?.navigate) {
      this.router.navigate(['/']);
    }
  }

  openNavModal() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(NavigationModelComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.message1 =
      'Your Otp has been successfully verified.';
    modalRef.componentInstance.btnName = 'Login';
    modalRef.componentInstance.path = '/';
  }

  paymentScreen() {
    this.modalService.dismissAll();
    const modalRef = this.modalService.open(PaymentSucessPopupComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }
}
