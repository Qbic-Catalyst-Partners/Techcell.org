import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FacultyHomeComponent } from './faculty-home/faculty-home.component';
import { FacultyProfileViewComponent } from './faculty-profile-view/faculty-profile-view.component';
import { ModeratorBlogsComponent } from '../user-profile-module/content-published/moderator-blogs/moderator-blogs.component';
import { ModeratorVideosComponent } from '../user-profile-module/content-published/moderator-videos/moderator-videos.component';

const routes: Routes = [
 
  {
    path: '',
    component: FacultyHomeComponent,
    children: [
      { path: '', component:FacultyProfileViewComponent },
      { path: 'profile', component:FacultyProfileViewComponent },
      { path: 'view-blogs', component:ModeratorBlogsComponent },
      { path: 'view-videos', component:ModeratorVideosComponent }
    ],
  },
];

export const facultyProfileModuleRoute: ModuleWithProviders<any> =
  RouterModule.forChild(routes);
