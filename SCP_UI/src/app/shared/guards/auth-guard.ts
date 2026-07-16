import { Injectable, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthUtils } from '../utility/auth-utils';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    // Converting token string to Boolean by adding !! to ApiService.getAuthToken()

    if (!AuthUtils.getAuthToken()) {
      this.router.navigate(['/auth']); // go to login if not authenticated

      return false;
    }

    return true;
  }
}
