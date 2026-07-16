import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './component/modal/modal.component';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from './services/http.service';
import { ApiService } from './services/api.service';
import { BannerComponent } from './component/banner/banner.component';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from './component/pipe/safe-html.pipe';
import { ScrollDirective } from './component/directives/scroll.directive';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { FoucsDirective } from './component/directives/foucs.directive';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LogoutModalComponent } from './component/logout-modal/logout-modal.component';
import { SwipperDirective } from './component/directives/swipper.directive';
import { PageNotFoundComponent } from './component/page-not-found/page-not-found.component';
import { AuthGuard } from './guards/auth-guard';
import { AccessDeniedComponent } from './component/access-denied/access-denied.component';
import { DataTableComponent } from './component/data-table/data-table.component';
import { TagInputModule } from 'ngx-chips';
import { SearchFilterPipe } from './component/pipe/search-filter.pipe';
import { ShareComponent } from './component/share/share.component';
import { CustomDateFormateDirective } from './component/directives/custom-date-formate.directive';
import { HeaderFilterComponent } from './component/header-filter/header-filter.component';
import { FormsModule } from '@angular/forms';
import { SpecialChracterDirective } from './component/directives/special-chracter.directive';
import { NavigationModelComponent } from './component/navigation-model/navigation-model.component';
import { TncComponent } from './component/tnc/tnc.component';
import { PrivacyPolicyComponent } from './component/privacy-policy/privacy-policy.component';
import { SocialIconComponent } from './component/social-icon/social-icon.component';
import { IdFieldDirective } from './component/directives/id-field.directive';
import { NumberOnlyDirective } from './component/directives/number-only.directive';
import { FilterSearchComponent } from './component/filter-search/filter-search.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommentComponent } from './component/comment/comment.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ViewResumeComponent } from './component/view-resume/view-resume.component';
import { PdfViewerModalComponent } from './component/pdf-viewer-modal/pdf-viewer-modal.component';
import { CookiePolicyComponent } from './component/cookie-policy/cookie-policy.component';
import { PaymentGuard } from './guards/payment-guard';
import { RelativeTimePipe } from './component/pipe/relative-time.pipe';
import { ImageCropperModule } from 'ngx-image-cropper';
import { ImageCropperModalComponent } from './component/image-cropper-modal/image-cropper-modal.component';
import { PasswordVerificationComponent } from './component/password-verification/password-verification.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    ModalComponent,
    BannerComponent,
    SafeHtmlPipe,
    ScrollDirective,
    FoucsDirective,
    LogoutModalComponent,
    SwipperDirective,
    PageNotFoundComponent,
    AccessDeniedComponent,
    DataTableComponent,
    SearchFilterPipe,
    ShareComponent,
    CustomDateFormateDirective,
    HeaderFilterComponent,
    SpecialChracterDirective,
    NavigationModelComponent,
    TncComponent,
    PrivacyPolicyComponent,
    SocialIconComponent,
    IdFieldDirective,
    NumberOnlyDirective,
    FilterSearchComponent,
    CommentComponent,
    ViewResumeComponent,
    CookiePolicyComponent,
    RelativeTimePipe,
    ImageCropperModalComponent,
    PasswordVerificationComponent,
    PdfViewerModalComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    YouTubePlayerModule,
    AngularEditorModule,
    FontAwesomeModule,
    NgbTooltipModule,
    TagInputModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ImageCropperModule,
    MatDialogModule,
  ],
  exports: [
    ModalComponent,
    BannerComponent,
    SafeHtmlPipe,
    ScrollDirective,
    YouTubePlayerModule,
    FoucsDirective,
    AngularEditorModule,
    FontAwesomeModule,
    LogoutModalComponent,
    SwipperDirective,
    PageNotFoundComponent,
    AccessDeniedComponent,
    DataTableComponent,
    NgbTooltipModule,
    TagInputModule,
    SearchFilterPipe,
    ShareComponent,
    CustomDateFormateDirective,
    FormsModule,
    HeaderFilterComponent,
    SpecialChracterDirective,
    NavigationModelComponent,
    SocialIconComponent,
    IdFieldDirective,
    NumberOnlyDirective,
    FilterSearchComponent,
    CommentComponent,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    ViewResumeComponent,
    CookiePolicyComponent,
    RelativeTimePipe,
    ImageCropperModalComponent,
    PasswordVerificationComponent,
    PdfViewerModalComponent,
  ],
  providers: [NgbActiveModal, HttpService, ApiService, AuthGuard, PaymentGuard],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
