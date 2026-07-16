import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserModuleRoute } from './user-module-routing.module';
import { UserRegistrationComponent } from './user-registration/user-registration.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { LoginWithOtpComponent } from './login-with-otp/login-with-otp.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { StudentRegistrationComponent } from './user-registration/student-registration/student-registration.component';

import { FacultyRegistrationComponent } from './user-registration/faculty-registration/faculty-registration.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { NgbTooltipModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ViewpaymentComponent } from './viewpayment/viewpayment.component';
import { PaymentSucessPopupComponent } from './payment-sucess-popup/payment-sucess-popup.component';
import { PaymentIframeComponent } from './payment-iframe/payment-iframe.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { UserModeratorRegistrationComponent } from './user-moderate-registration/user-moderate-registration';
import { ModeratorRegistrationComponent } from './user-moderate-registration/moderator-registration/moderator-registration.component';
import { CorporateRegistrationComponent } from './user-corporate-registration/corporate-registration/corporate-registration.component';
import { UserCorporateRegistrationComponent } from './user-corporate-registration/user-corporate-registration';

@NgModule({
  declarations: [
    LoginComponent,
    UserRegistrationComponent,
    LoginWithOtpComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    AuthenticationComponent,
    StudentRegistrationComponent,
    FacultyRegistrationComponent,
    LoginModalComponent,
    ViewpaymentComponent,
    PaymentSucessPopupComponent,
    PaymentIframeComponent,
    UserModeratorRegistrationComponent,
    ModeratorRegistrationComponent,
    CorporateRegistrationComponent,
    UserCorporateRegistrationComponent
  ],
  imports: [
    CommonModule,
    UserModuleRoute,
    SharedModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    CarouselModule,
    NgbTooltipModule,
    NgbTypeaheadModule,
    MatDatepickerModule
  ],
  exports:[
    AuthenticationComponent
  ]
})
export class UserModuleModule {}
