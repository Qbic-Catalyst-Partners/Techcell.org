import { Component, OnInit } from '@angular/core';
import { VideoMeta } from './videoMeta';
import { VideoService } from '../../../home/videos/service/video.service';
import { DatePipe } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoPreviewComponent } from '../../../home/videos/modals/video-preview/video-preview.component';
import { AuthUtils } from '../../../shared/utility/auth-utils';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-moderator-videos',
  templateUrl: './moderator-videos.component.html',
  styleUrl: './moderator-videos.component.scss'
})
export class ModeratorVideosComponent implements OnInit{
  videoHeader:any = [];
  videoData:any = [];
  page:number = 0;
  userInfo:any;
  constructor(
    private videoService : VideoService,
    public modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router
  ){}
  ngOnInit(): void {
    this.videoHeader = VideoMeta;
    this.page = 0;
    
    // Check if we're in the user's own content section or viewing someone else's profile
    const currentUrl = this.router.url;
    const isUserProfile = currentUrl.includes('/user-profile/content-published');
    
    if (isUserProfile) {
      // For user's own content section, use logged in user's details
      let data:any = AuthUtils.getUserDetails();
      this.userInfo = JSON.parse(data);
    } else {
      // For viewing other profiles, use the profile being viewed
      let data:any = AuthUtils.getProfile();
      this.userInfo = JSON.parse(data);
    }
    
    console.log(this.userInfo)
    this.getVideoList();
  }

  navigate(item:any){
      const modalRef = this.modalService.open(VideoPreviewComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        centered: true,
      });
      modalRef.componentInstance.viewData = item;
      modalRef.result.then((response) => {
        if (response) {
          this.modalService.dismissAll();
        }
      });
  }

  getVideoList(){
    this.videoService.getMyVideos(this.page,this.userInfo.userId).subscribe({
      next:(res:any)=>{
        this.videoData = this.videoData.concat(
          res.data.map((val: any, index: number) => {
            val.seq = index + 1;
            // Format date using DatePipe
            val.createdDate = new DatePipe('en-US').transform(
              val.createdDate,
              'dd/MM/yyyy'
            );
            // Favourite count
            // Use favouriteCount returned from backend; fallback to 0 if undefined
            val.Fav = val.favouriteCount ?? 0;

            // Prepare base64 thumbnail if present
            if (val?.video?.thumbnail) {
              val.thumbnail = `data:image/jpeg;charset=utf-8;base64,${val.video.thumbnail}`;
            }

            // Shorten title for display if needed
            val.shortTitle = val.title?.slice(0, 50);

            return val;
          })
        );
      },
        error:(err:any)=>{

        }
    })
  }

  apiCalled(event:any){
    this.page++;
    this.getVideoList();
  }
}