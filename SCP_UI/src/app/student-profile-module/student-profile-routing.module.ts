import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentHomeComponent } from './student-home/student-home.component';
import { StudentProfileViewComponent } from './student-profile-view/student-profile-view.component';
import { ModeratorBlogsComponent } from '../user-profile-module/content-published/moderator-blogs/moderator-blogs.component';
import { ModeratorVideosComponent } from '../user-profile-module/content-published/moderator-videos/moderator-videos.component';

const routes: Routes = [
 
  {
    path: '',
    component: StudentHomeComponent,
    children: [
      { path: '', component:StudentProfileViewComponent },
      { path: 'profile', component:StudentProfileViewComponent },
      { path: 'view-blogs', component:ModeratorBlogsComponent },
      { path: 'view-videos', component:ModeratorVideosComponent }
      
    ],
  }
];

export const studentProfileModuleRoute: ModuleWithProviders<any> =
  RouterModule.forChild(routes);
