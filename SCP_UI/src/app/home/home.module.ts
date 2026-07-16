import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { FeedsComponent } from './feeds/feeds.component';
import { AdsComponent } from './ads/ads.component';
import { HomeComponent } from './home.component';
import { HomeModuleRoute } from './home-routing.module';
import { VideosComponent } from './videos/videos.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddVideoComponent } from './videos/modals/add-video/add-video.component';
import { VideoPreviewComponent } from './videos/modals/video-preview/video-preview.component';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { BlogModalComponent } from './blog/modals/blog-modal/blog-modal.component';
import { SoftwaresComponent } from './softwares/softwares.component';
import { SoftwareListviewComponent } from './softwares/software-listview/software-listview.component';
import { SoftwareGridviewComponent } from './softwares/software-gridview/software-gridview.component';
import { AddSoftwareComponent } from './softwares/modals/add-software/add-software.component';
import { DpDatePickerModule } from 'ng2-date-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { EditorModule } from '@tinymce/tinymce-angular';
import { BlogListViewComponent } from './blog/blog-list-view/blog-list-view.component';
import { VideoListViewComponent } from './videos/video-list-view/video-list-view.component';
import { SoftwareDownloadComponent } from './softwares/modals/software-download/software-download.component';

@NgModule({
  declarations: [
    ProfileComponent,
    FeedsComponent,
    AdsComponent,
    HomeComponent,
    VideosComponent,
    AddVideoComponent,
    VideoPreviewComponent,
    BlogComponent,
    BlogDetailComponent,
    BlogModalComponent,
    SoftwaresComponent,
    SoftwareListviewComponent,
    SoftwareGridviewComponent,
    AddSoftwareComponent,
    BlogListViewComponent,
    VideoListViewComponent,
    SoftwareDownloadComponent,
  ],
  imports: [
    CommonModule,
    HomeModuleRoute,
    CarouselModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DpDatePickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    EditorModule,
  ],
})
export class HomeModule {
  ngOnInit(): void {}
}
