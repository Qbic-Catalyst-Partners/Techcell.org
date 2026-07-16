import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthUtils } from '../utility/auth-utils';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  // private baseURL = 'https://13.233.8.194:8081';
  // private baseURL = 'https://98.70.38.38:8081';
  // private baseURL = 'http://20.244.14.20:8081';
  private baseURL = 'http://localhost:8081';
  // private baseURL = 'http://192.168.0.126:8081';
  // private baseURL = 'https://www.techcell.org:8081';

  constructor(
    private httpClient: HttpClient,
    // private notificationService: NotificationService,
    private router: Router,
  ) {}

  get(url: string, options?: any): Observable<any> {
    // Merge the options with default headers
    const requestOptions = {
      headers: this.getAuthHeaders(),
      ...(options || {}),
    };

    return this.httpClient
      .get(this.baseURL + url, requestOptions)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  /**
   * Generic POST wrapper. Pass optional HttpClient options as the third arg
   * so callers can supply e.g. `{ responseType: 'text' }` when the backend
   * returns plain-text instead of JSON.
   */
  post(url: string, body: any, options?: any): Observable<any> {
    const opts = {
      headers: this.getAuthHeaders(),
      ...(options || {}),
    };

    return (
      this.httpClient
        // If caller explicitly sets responseType, honour the generic type
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        .post<any>(this.baseURL + url, body, opts as any)
        .pipe(catchError(this.errorHandler.bind(this)))
    );
  }

  patch(url: string, body: any): Observable<any> {
    return this.httpClient
      .patch<any>(this.baseURL + url, body, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  put(url: string, body: any): Observable<any> {
    return this.httpClient
      .put<any>(this.baseURL + url, body, { headers: this.getAuthHeaders() })
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  delete(url: string, param?: any): Observable<any> {
    const paramData = { params: param, headers: this.getAuthHeaders() };
    return this.httpClient
      .delete(this.baseURL + url, paramData)
      .pipe(catchError(this.errorHandler.bind(this)));
  }

  private getAuthHeaders() {
    return {
      Authorization: `${AuthUtils.getAuthToken()}`,
    };
  }
  private errorHandler(res: any) {
    const error = res.error;
    const keys = Object.keys(error);
    const key = keys[0];
    let message = error[key];
    const status = res.status;

    if (status === 401) {
      //need to logout user , bcz section expire; and redirect to login
      // this.notificationService.showNotification("error", 'Session Expired !!');
      // this.router.navigate(['user']);
    }
    if (error[key] instanceof Array) {
      message = error[key][0];
    }
    if (key === 'isTrusted') {
      // this.notificationService.showNotification("error", 'Please check you internet connection..!!');
      // alert("There is no internet connection");
    } else {
      // this.notificationService.showNotification("error", message);
    }
    return throwError({ message: message, error: error });
  }
}
