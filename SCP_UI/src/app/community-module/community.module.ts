import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { communityModuleRoute } from './community-routing.module';
import { CommunityComponent } from './community/community.component';
import { CommunityListingComponent } from './community-listing/community-listing.component';
import { NewestComponent } from './community-types/newest/newest.component';
import { PopularComponent } from './community-types/popular/popular.component';
import { SuggestedComponent } from './community-types/suggested/suggested.component';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRippleModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DpDatePickerModule } from 'ng2-date-picker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddCommunityComponent } from './modals/add-community/add-community.component';
import { CommunityHomeComponent } from './community-home/community-home.component';
import { BlogsComponent } from './blogs/blogs.component';
import { VideosComponent } from './videos/videos.component';
import { AboutComponent } from './about/about.component';
import { ExitComponent } from './exit/exit.component';
import { FeedComponent } from './feed/feed.component';
import { ExitCommunityComponent } from './modals/exit-community/exit-community.component';
import { JoinComponent } from './modals/join/join.component';
import { AssignModeratorComponent } from './modals/assign-moderator/assign-moderator.component';

@NgModule({
  declarations: [
    CommunityComponent,
    NewestComponent,
    PopularComponent,
    SuggestedComponent,
    CommunityListingComponent,
    AddCommunityComponent,
    CommunityHomeComponent,
    FeedComponent,
    BlogsComponent,
    VideosComponent,
    AboutComponent,
    ExitComponent,
    ExitCommunityComponent,
    JoinComponent,
    AssignModeratorComponent
  ],
  imports: [
    CommonModule,
    communityModuleRoute,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRippleModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  exports:[
    JoinComponent
  ]
})
export class CommunityModule { }
