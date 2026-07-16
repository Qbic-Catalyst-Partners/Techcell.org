import { Component } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginWithOtpComponent } from '../login-with-otp/login-with-otp.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { UserprofileService } from '../../user-profile-module/service/userprofile.service';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { RazorpayPaymentComponent } from '../razorpayPayment/razorpayPayment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.scss',
})
export class LoginModalComponent {
  public isSubmitted: boolean = false;
  public otpSetting: any;
  public forgetSetting: any;
  public resetSetting: any;
  loginResponse: any;

  email_pattern: string = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$';
  isPwd: boolean = false;
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 500000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };
  slidesStore: any = [1, 2, 3, 4];
  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    public modalService: NgbModal,
    public router: Router,
    private commonService: CommonService,
    private userProfileService: UserprofileService,
    private activeModal: NgbActiveModal,
    private matDialog: MatDialog
  ) {}

  public loginForm = this._fb.group({
    emailId: [
      '',
      [Validators.required, Validators.pattern(this.email_pattern)],
    ],
    password: ['', Validators.required],
  });

  get fieldName() {
    return this.loginForm['controls'];
  }

  public submitForm(): void {
    this.isSubmitted = true;
    if (this.loginForm.invalid) return;

    if (this.loginForm.valid) {
      this.apiService.loginAndSetToken(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.loginResponse = res;
          this.activeModal.close();

          if (res.otpVerified) {
            // Check payment status
            if (!res?.paymentReceived) {
              // Open payment modal
              this.openRazorpayPaymentModal();
            } else {
              // Navigate normally
              this.navigateAfterLogin();
            }
          } else {
            this.userProfileService.generateOtp().subscribe({
              next: () => {
                this.openAuthModal();
              },
              error: (error) => {
                this.commonService.dialog(
                  'newErrorModal',
                  error.message,
                  '',
                  'OK',
                  'Error'
                );
              },
            });
          }
        },
        error: (error) => {
          if (error.message === true) {
            this.commonService.dialog(
              'newErrorModal',
              'Internal server error',
              '',
              'OK',
              'Error'
            );
          } else {
            this.commonService.dialog(
              'newErrorModal',
              error.message,
              '',
              'OK',
              'Error'
            );
          }
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

  public loginWithOtp() {
    if (!this.isEmail) return; // safety check

    this.apiService
      .generateSiginOtp(this.loginForm.controls.emailId.value || '')
      .subscribe({
        next: () => {
          // Close the current login modal before opening OTP dialog
          this.activeModal.close();

          const dialogRef = this.matDialog.open(LoginWithOtpComponent, {
            width: '360px',
            disableClose: true,
            panelClass: ['login-with-otp-dialog', 'login-with-otp-width'],
            data: { email: this.loginForm.controls.emailId.value },
          });

          // backward-compatibility for component expecting viewData
          dialogRef.componentInstance.viewData = {
            email: this.loginForm.controls.emailId.value,
          };
        },
        error: (error) => {
          this.commonService.dialog(
            'newErrorModal',
            error.message,
            '',
            'OK',
            'Error'
          );
        },
      });
  }

  public forgetPassword() {
    if (!this.isEmail) return; // safety check
    this.activeModal.close(); // close login modal first

    const dialogRef = this.matDialog.open(ForgetPasswordComponent, {
      disableClose: true,
      panelClass: ['forgot-password-dialog', 'forgot-password-width'],
      data: { email: this.loginForm.controls.emailId.value }
    });

    // also assign through component instance to keep backward compatibility
    dialogRef.componentInstance.viewData = { email: this.loginForm.controls.emailId.value };
  }

  get isEmail() {
    return this.loginForm.get('emailId')?.valid;
  }

  togglePwd() {
    this.isPwd = !this.isPwd;
  }

  openAuthModal() {
    const modalRef = this.modalService.open(AuthenticationComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    const data = {
      email: this.loginForm.controls.emailId.value,
    };
    modalRef.componentInstance.viewData = data;
  }

  openRazorpayPaymentModal() {
    const modalRef = this.modalService.open(RazorpayPaymentComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.userEmail = this.loginResponse?.userDetailResponseDTO?.emailId;
  }

  close() {
    this.activeModal.close();
  }

  navigateTo() {
    this.activeModal.close();
    this.router.navigate(['/auth/register']);
  }
}
