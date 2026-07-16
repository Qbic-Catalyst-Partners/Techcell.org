import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../service/community.service';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoPreviewComponent } from '../../home/videos/modals/video-preview/video-preview.component';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss'
})
export class VideosComponent implements OnInit{
  communityDetails:any;
  videoList:any = [];
  playerConfig = {
    controls: 1,
    mute: 1,
    autoplay: 0,
    rel: 0,
  };
  constructor(private communityService :CommunityService,
    public router: Router,
    public modalService: NgbModal,
    private activateRoute : ActivatedRoute,
    private apiService: ApiService){}

  ngOnInit(): void {
    const parentParamMap = this.activateRoute?.parent?.snapshot?.paramMap;
    const id = parentParamMap ? parentParamMap.get('communityId') : null;
    this.getPostingUserDetails(id)
  }

  getVideo(){
    this.communityService.getCommunityVideo(0,this.communityDetails?.postingTags[0]?.hashTag?.id).subscribe({
      next:(res)=>{
        // console.log(res)
        this.videoList = res.data;
      }
    });
  }

  getPostingUserDetails(id:any){
    this.apiService.getPostingUserDetails(id).subscribe({
      next:(res)=>{
        this.communityDetails = res.data;
        this.getVideo();
      }
    });
  }

  getVideoId(url: any) {
    let rx = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    let res = url && url.match(rx);
    // if (url) {
    //   let path = url.split('=');
    //   if (path[1]) {
    //     return path[1];
    //   } else {
    //     let path = url.split('/');
    //     return path[path.length - 1];
    //   }
    // }
    return res && res.length ? res[1] : null;
  }
  goTo(item:any){
    this.router.navigate([`/home/videos/${item.postingId}`]);
  }

  playerStateChange(event:any,item:any){
    event.target.pauseVideo();
    switch (event.data) {
      case 0: {
        this.openVideo(item);
      }
      break;
      case 1: {
        this.openVideo(item);
      }
      break;
      case 2: {
        this.openVideo(item);
      }
      break;
    }
  }

  openVideo(item:any){
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
}
