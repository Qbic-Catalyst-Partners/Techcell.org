import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { userProfileModuleRoute } from './user-profile-module-routing.module';
import { MyAccountComponent } from './my-account/my-account.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { HelpAssistanceComponent } from './help-assistance/help-assistance.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DpDatePickerModule } from 'ng2-date-picker';
import { StudentAccountComponent } from './my-account/student-account/student-account.component';
import { FacultyAccountComponent } from './my-account/faculty-account/faculty-account.component';
import { ModeratorAccountComponent } from './my-account/moderator-account/moderator-account.component';
import { SharedModule } from '../shared/shared.module';
import { ModeratorBlogsComponent } from './content-published/moderator-blogs/moderator-blogs.component';
import { ModeratorVideosComponent } from './content-published/moderator-videos/moderator-videos.component';
import { ModeratorCommunitiesComponent } from './content-published/moderator-communities/moderator-communities.component';
import { ApprovalsComponent } from './my-account/approvals/approvals.component';
import { ContentPublishedComponent } from './content-published/content-published.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TermsAndConditionsComponent } from './help-assistance/terms-and-conditions/terms-and-conditions.component';
import { UserManualComponent } from './help-assistance/user-manual/user-manual.component';
import { ContactUsComponent } from './help-assistance/contact-us/contact-us.component';
import { PrivacyPolicyComponent } from './help-assistance/privacy-policy/privacy-policy.component';
import { ApproveModalComponent } from './my-account/approvals/modal/approve-modal/approve-modal.component';
import { RejectModalComponent } from './my-account/approvals/modal/reject-modal/reject-modal.component';
import { PaymentHistoryComponent } from './payment-info/payment-history/payment-history.component';
import { PurchaseHistoryComponent } from './payment-info/purchase-history/purchase-history.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CorpManagementComponent } from './corp-management/corp-management.component';
import { ResumeDetailsComponent } from './resume-details/resume-details.component';
import { AddEditEducationComponent } from './resume-details/modals/add-edit-education/add-edit-education.component';
import { AddEditCertificationComponent } from './resume-details/modals/add-edit-certification/add-edit-certification.component';
import { AddEditProjectComponent } from './resume-details/modals/add-edit-project/add-edit-project.component';
import { AddEditAchievementComponent } from './resume-details/modals/add-edit-achievement/add-edit-achievement.component';
import { AddEditExperinceComponent } from './resume-details/modals/add-edit-experince/add-edit-experince.component';
import { ContactInfoComponent } from './resume-details/modals/contact-info/contact-info.component';

@NgModule({
  declarations: [
    MyAccountComponent,
    PaymentInfoComponent,
    HelpAssistanceComponent,
    UserProfileComponent,
    StudentAccountComponent,
    FacultyAccountComponent,
    ModeratorAccountComponent,
    ModeratorBlogsComponent,
    ModeratorVideosComponent,
    ModeratorCommunitiesComponent,
    ApprovalsComponent,
    ContentPublishedComponent,
    TermsAndConditionsComponent,
    UserManualComponent,
    ContactUsComponent,
    PrivacyPolicyComponent,
    ApproveModalComponent,
    RejectModalComponent,
    PaymentHistoryComponent,
    PurchaseHistoryComponent,
    UserManagementComponent,
    CorpManagementComponent,
    ResumeDetailsComponent,
    AddEditEducationComponent,
    AddEditCertificationComponent,
    AddEditProjectComponent,
    AddEditAchievementComponent,
    AddEditExperinceComponent,
    ContactInfoComponent,
  ],
  imports: [
    CommonModule,
    userProfileModuleRoute,
    ReactiveFormsModule,
    DpDatePickerModule,
    SharedModule,
    FormsModule,
    DpDatePickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  exports: [
    ModeratorBlogsComponent,
    ModeratorVideosComponent,
    ModeratorCommunitiesComponent,
    ContentPublishedComponent,
  ]
})
export class UserProfileModuleModule {}
