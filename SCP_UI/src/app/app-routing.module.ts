import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentGuard } from './shared/guards/payment-guard';
import { PageNotFoundComponent } from './shared/component/page-not-found/page-not-found.component';
import { InviteRedirectComponent } from './invite-redirect.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./user-module/user-module.module').then(
        (m) => m.UserModuleModule
      ),
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
    canActivate: [PaymentGuard],
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./user-profile-module/user-profile-module.module').then(
        (m) => m.UserProfileModuleModule
      ),
  },
  {
    path: 'community',
    loadChildren: () =>
      import('./community-module/community.module').then(
        (m) => m.CommunityModule
      ),
    canActivate: [PaymentGuard],
  },
  {
    path: 'home/moderator',
    loadChildren: () =>
      import('./moderator-profile-module/moderator-profile.module').then(
        (m) => m.ModeratorProfileModule
      ),
  },
  {
    path: 'home/faculty',
    loadChildren: () =>
      import('./faculty-profile-module/faculty-profile.module').then(
        (m) => m.FacultyProfileModule
      ),
  },
  {
    path: 'home/student',
    loadChildren: () =>
      import('./student-profile-module/student-profile.module').then(
        (m) => m.StudentProfileModule
      ),
  },
  {
    path: 'careers',
    loadChildren: () =>
      import('./careers-module/careers.module').then((m) => m.CareersModule),
    canActivate: [PaymentGuard],
  },

  {
    path: 'notifications',
    loadChildren: () =>
      import('./notifications-module/notifications.module').then(
        (m) => m.NotificationsModule
      ),
  },
  {
    path: 'invite/project-team/:token',
    component: InviteRedirectComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
