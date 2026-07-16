import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityComponent } from './community/community.component';
import { CommunityHomeComponent } from './community-home/community-home.component';
import { FeedComponent } from './feed/feed.component';
import { BlogsComponent } from './blogs/blogs.component';
import { VideosComponent } from './videos/videos.component';
import { AboutComponent } from './about/about.component';
import { ExitComponent } from './exit/exit.component';

const routes: Routes = [
 
  {
    path: '',
    component: CommunityComponent
  }, {
    path: 'home/:communityId',
    component: CommunityHomeComponent,
    children: [
      { path: '', component:FeedComponent },
      { path: 'feed', component:FeedComponent },
      { path: 'blogs', component:BlogsComponent },
      { path: 'videos', component:VideosComponent },
      { path: 'about', component:AboutComponent },
      { path: 'exit', component:ExitComponent },
      
    ],
  },
];

export const communityModuleRoute: ModuleWithProviders<any> =
  RouterModule.forChild(routes);
