import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from "@angular/router";
import { AuthUtils } from "../utility/auth-utils";

@Injectable()
export class AnonGuard implements CanActivate {
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        // Converting token string to Boolean by adding !! to ApiService.getAuthToken()
        return !!AuthUtils.getAuthToken();
    }
}