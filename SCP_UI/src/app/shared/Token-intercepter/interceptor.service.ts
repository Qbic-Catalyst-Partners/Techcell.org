import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { LoaderService } from './loader.service';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthUtils } from '../utility/auth-utils';
@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private injector: Injector,
    private loaderService: LoaderService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true);

    if (AuthUtils.getAuthToken()) {
      let authRequest: any = req.clone({
        setHeaders: {
          Authorization: `${AuthUtils.getAuthToken()}`,
        },
      });
      return next.handle(authRequest).pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      );
    } else {
      return next.handle(req).pipe(
        finalize(() => {
          this.loaderService.isLoading.next(false);
        })
      );
    }
  }
}
