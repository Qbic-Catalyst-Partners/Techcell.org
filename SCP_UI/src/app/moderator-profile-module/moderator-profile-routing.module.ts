import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ModeratorHomeComponent } from './moderator-home/moderator-home.component';
import { ModeratorProfileViewComponent } from './moderator-profile-view/moderator-profile-view.component';
import { ModeratorBlogsComponent } from '../user-profile-module/content-published/moderator-blogs/moderator-blogs.component';
import { ModeratorVideosComponent } from '../user-profile-module/content-published/moderator-videos/moderator-videos.component';
import { ModeratorCommunitiesComponent } from '../user-profile-module/content-published/moderator-communities/moderator-communities.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: ModeratorHomeComponent,
  // },
  {
    path: '',
    component: ModeratorHomeComponent,
    children: [
      { path: '', component: ModeratorProfileViewComponent },
      { path: 'profile', component: ModeratorProfileViewComponent },
      { path: 'view-blogs', component:ModeratorBlogsComponent },
      { path: 'view-videos', component:ModeratorVideosComponent },
      { path: 'view-communities', component: ModeratorCommunitiesComponent },
    ],
  },
];

export const moderatorProfileModuleRoute: ModuleWithProviders<any> =
  RouterModule.forChild(routes);
