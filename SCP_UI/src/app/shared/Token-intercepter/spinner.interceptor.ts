import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpHandler,
} from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ProgressBarService } from '../services/progress-bar.service';
import { AuthUtils } from '../utility/auth-utils';
import { CommonService } from '../services/common.service';

@Injectable()
export class spinnerInterceptor implements HttpInterceptor {
  count: number = 1;
  constructor(
    private spinner: NgxSpinnerService,
    private progressBarService: ProgressBarService,
    private commonService: CommonService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    Promise.resolve(null).then(() => this.progressBarService.increase());
    return next.handle(request).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            this.progressBarService.decrease();
          }
          // return event;
        },
        error: (error) => {
          this.progressBarService.decrease();
          if (error.status === 401) {
            // alert('Unauthorized access!')
          } else if (error.status === 404) {
            // alert('Page Not Found!')
          } else if (
            error.status === 417 &&
            this.count == 1 &&
            error.error.errorCode == 'business.error.TokenExpired'
          ) {
            this.count++;
            AuthUtils.clearSessionStorage();
            this.commonService.dialog(
              'newErrorModal',
              'Your session is expired,Please Re-login.',
              '',
              'OK',
              'Error'
            );
          }
        },
      })
    );
  }
}
