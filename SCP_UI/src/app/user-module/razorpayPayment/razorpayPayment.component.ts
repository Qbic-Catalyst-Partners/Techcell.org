import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../shared/services/common.service';
import { Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { PaymentSucessPopupComponent } from '../payment-sucess-popup/payment-sucess-popup.component';

declare global {
  interface Window {
    Razorpay: any;
  }
}

@Component({
  selector: 'app-razorpay-payment',
  templateUrl: './razorpayPayment.component.html',
  styleUrl: './razorpayPayment.component.scss',
})
export class RazorpayPaymentComponent implements OnInit {
  @Input() userEmail: string = '';
  paymentAmount: number = 1000; // Amount in INR (not paise)
  paymentInProgress: boolean = false;

  constructor(
    private activeModal: NgbActiveModal,
    public commonService: CommonService,
    private router: Router,
    public modalService: NgbModal,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Try to get email from local storage only if not provided directly
    if (!this.userEmail) {
      const userData = AuthUtils.getUserDetails();
      if (userData) {
        const userInfo = JSON.parse(userData);
        if (userInfo?.userDetailResponseDTO?.emailId) {
          this.userEmail = userInfo.userDetailResponseDTO.emailId;
        }
      }
    }

    // Load Razorpay script
    this.loadRazorpayScript();
  }

  loadRazorpayScript() {
    // Check if script is already loaded
    if (
      document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      )
    ) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  close() {
    this.activeModal.close('payment_canceled');
  }

  proceedToPayment() {
    if (this.paymentInProgress) return;

    this.paymentInProgress = true;

    // Create payment request payload
    const payload = {
      amount: this.paymentAmount,
      purpose: 'Registration',
      emailId: this.userEmail || 'student@example.com',
    };

    // Call the API to create an order
    this.apiService.razorpayPayment(payload).subscribe({
      next: (response) => {
        if (response && response.data) {
          this.openRazorpayCheckout(response.data);
        } else {
          this.commonService.dialog('Error', 'Failed to initialize payment');
          this.paymentInProgress = false;
        }
      },
      error: (error) => {
        console.error(error);
        this.commonService.dialog(
          'Error',
          error.message || 'Payment initialization failed'
        );
        this.paymentInProgress = false;
      },
    });
  }

  openRazorpayCheckout(orderData: any) {
    const options = {
      key: orderData.id, // razorpay key id
      amount: orderData.amount * 100, // amount should be in paise
      currency: 'INR',
      name: 'TechCell',
      description: 'Student Registration Fee',
      order_id: orderData.orderId,
      prefill: {
        email: this.userEmail,
      },
      handler: (response: any) => {
        this.handlePaymentSuccess(response);
      },
      modal: {
        ondismiss: () => {
          this.paymentInProgress = false;
          this.activeModal.close('payment_canceled');
        },
      },
      theme: {
        color: '#3399cc',
      },
    };

    try {
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      this.commonService.dialog('Error', 'Failed to open payment gateway');
      this.paymentInProgress = false;
    }
  }

  handlePaymentSuccess(response: any) {
    // Verify payment on backend
    const verificationPayload = {
      orderId: response.razorpay_order_id,
      paymentId: response.razorpay_payment_id,
      signature: response.razorpay_signature,
    };

    this.apiService.verifyRazorpayPayment(verificationPayload).subscribe({
      next: (verificationResponse) => {
        this.paymentInProgress = false;

        // Refresh user data after successful payment
        this.refreshUserData().then(() => {
          // Close with success status
          this.activeModal.close('payment_success');
        });
      },
      error: (error) => {
        console.error('Payment verification error:', error);
        this.commonService.dialog('Error', 'Payment verification failed');
        this.paymentInProgress = false;
        // Close with failure status
        this.activeModal.close('payment_failed');
      },
    });
  }

  // Add method to refresh user data
  // In RazorpayPaymentComponent
  refreshUserData(): Promise<void> {
    return new Promise((resolve, reject) => {
      const userData = AuthUtils.getUserDetails();
      if (userData) {
        const userInfo = JSON.parse(userData);
        this.apiService
          .getUserProfile(userInfo.userDetailResponseDTO.userId)
          .subscribe({
            next: (res: any) => {
              console.log('User profile from server:', res.data);
              // Check if payment status is included
              console.log(
                'Payment received status:',
                res.data.userDetailResponseDTO.paymentReceived
              );

              // Update local storage with fresh user data
              const currentUserData = JSON.parse(userData);
              currentUserData.userDetailResponseDTO =
                res.data.userDetailResponseDTO;
              AuthUtils.setUserDetails(currentUserData);
              resolve();
            },
            error: (error) => {
              console.log(error.message);
              reject(error);
            },
          });
      } else {
        resolve(); // No user data to refresh (registration flow)
      }
    });
  }
}
