import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { InterceptorService } from './shared/Token-intercepter/interceptor.service';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { spinnerInterceptor } from './shared/Token-intercepter/spinner.interceptor';
import { NgxSpinnerModule } from 'ngx-spinner';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SuccessModalComponent } from './shared/component/modal/success-modal/success-modal.component';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { RazorpayPaymentComponent } from './user-module/razorpayPayment/razorpayPayment.component';
import { WebSocketService } from './shared/services/websocket.service';
import { InviteRedirectComponent } from './invite-redirect.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'YYYY-MM-DD',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@NgModule({
  declarations: [AppComponent, SuccessModalComponent, RazorpayPaymentComponent, InviteRedirectComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    NgxSpinnerModule.forRoot({ type: 'ball-clip-rotate-multiple' }),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: spinnerInterceptor,
      multi: true,
    },
    WebSocketService,
    provideNativeDateAdapter(),
    provideMomentDateAdapter(MY_FORMATS),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
