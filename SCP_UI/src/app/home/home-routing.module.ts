import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { VideosComponent } from './videos/videos.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { AuthGuard } from '../shared/guards/auth-guard';
import { SoftwaresComponent } from './softwares/softwares.component';
import { PaymentGuard } from '../shared/guards/payment-guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard, PaymentGuard],
  },
  {
    path: 'videos',
    component: VideosComponent,
    canActivate: [AuthGuard, PaymentGuard],
  },
  {
    path: 'videos/:id',
    component: VideosComponent,
    canActivate: [AuthGuard, PaymentGuard],
  },
  {
    path: 'blog',
    component: BlogComponent,
    canActivate: [AuthGuard, PaymentGuard],
  },
  {
    path: 'blog-details/:id',
    component: BlogDetailComponent,
    canActivate: [AuthGuard, PaymentGuard],
  },
  {
    path: 'software',
    component: SoftwaresComponent,
    canActivate: [AuthGuard, PaymentGuard],
  },
  // {
  //   path: 'community',
  //   component: CommunityComponent,
  //   canActivate: [AuthGuard, PaymentGuard],
  // },
];

export const HomeModuleRoute: ModuleWithProviders<any> =
  RouterModule.forChild(routes);
