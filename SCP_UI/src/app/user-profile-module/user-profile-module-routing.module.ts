import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyAccountComponent } from './my-account/my-account.component';
import { PaymentInfoComponent } from './payment-info/payment-info.component';
import { HelpAssistanceComponent } from './help-assistance/help-assistance.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ContentPublishedComponent } from './content-published/content-published.component';
import { ApprovalsComponent } from './my-account/approvals/approvals.component';
import { TermsAndConditionsComponent } from './help-assistance/terms-and-conditions/terms-and-conditions.component';
import { ContactUsComponent } from './help-assistance/contact-us/contact-us.component';
import { UserManualComponent } from './help-assistance/user-manual/user-manual.component';
import { PrivacyPolicyComponent } from './help-assistance/privacy-policy/privacy-policy.component';
import { PurchaseHistoryComponent } from './payment-info/purchase-history/purchase-history.component';
import { PaymentHistoryComponent } from './payment-info/payment-history/payment-history.component';
import { ModeratorBlogsComponent } from './content-published/moderator-blogs/moderator-blogs.component';
import { ModeratorVideosComponent } from './content-published/moderator-videos/moderator-videos.component';
import { ModeratorCommunitiesComponent } from './content-published/moderator-communities/moderator-communities.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { ResumeDetailsComponent } from './resume-details/resume-details.component';
import { InternshipListComponent } from '../careers-module/internship-list/internship-list.component';
import { ProjectListComponent } from '../careers-module/project-list/project-list.component';
import { JobListComponent } from '../careers-module/job-list/job-list.component';
import { CertificationListViewComponent } from '../careers-module/certification-list-view/certification-list-view.component';
import { CorpManagementComponent } from './corp-management/corp-management.component';

const routes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    children: [
      { path: '', component: MyAccountComponent },
      { path: 'my-account', component: MyAccountComponent },
      {
        path: 'paymentInfo',
        component: PaymentInfoComponent,
        children: [
          { path: 'purchase-history', component: PurchaseHistoryComponent },
          { path: 'payment-history', component: PaymentHistoryComponent },
        ],
      },
      {
        path: 'help-assistance',
        component: HelpAssistanceComponent,
        children: [
          { path: 'contactus', component: ContactUsComponent },
          { path: 'tnc', component: TermsAndConditionsComponent },
          { path: 'usermanual', component: UserManualComponent },
          { path: 'privacypolicy', component: PrivacyPolicyComponent },
        ],
      },
      {
        path: 'content-published',
        component: ContentPublishedComponent,
        children: [
          { path: 'blog', component: ModeratorBlogsComponent },
          { path: 'video', component: ModeratorVideosComponent },
          { path: 'community', component: ModeratorCommunitiesComponent },
        ],
      },
      {
        path: 'approval',
        component: ApprovalsComponent,
      },
      {
        path: 'management',
        component: UserManagementComponent,
      },
      {
        path: 'corp-management',
        component: CorpManagementComponent,
      },
      {
        path: 'resume',
        component: ResumeDetailsComponent,
      },
      {
        path: 'careers',
        children: [
          { path: 'internships', component: InternshipListComponent },
          { path: 'projects', component: ProjectListComponent },
          { path: 'jobs', component: JobListComponent },
          { path: 'certifications', component: CertificationListViewComponent },
        ],
      },
    ],
  },
];

export const userProfileModuleRoute: ModuleWithProviders<any> =
  RouterModule.forChild(routes);
