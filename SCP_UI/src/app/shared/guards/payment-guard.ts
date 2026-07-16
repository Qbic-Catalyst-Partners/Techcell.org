// payment-guard.ts
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthUtils } from '../utility/auth-utils';

@Injectable()
export class PaymentGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    // Check if user is authenticated
    const token = AuthUtils.getAuthToken();
    if (!token) {
      this.router.navigate(['/auth']);
      return false;
    }

    // Check payment status
    const userData = AuthUtils.getUserDetails();
    if (userData) {
      const userInfo = JSON.parse(userData);
      const paymentReceived = userInfo?.userDetailResponseDTO?.paymentReceived;

      if (!paymentReceived) {
        // Redirect to payment page or show payment modal
        this.router.navigate(['/auth'], {
          queryParams: { payment: 'required' },
        });
        return false;
      }
    }

    return true;
  }
}
