import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  AfterViewInit,
} from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { Router } from '@angular/router';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { VideoService } from '../videos/service/video.service';
import { CommonService } from '../../shared/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JoinComponent } from '../../community-module/modals/join/join.component';
import { ShareComponent } from '../../shared/component/share/share.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Define YouTube player types
interface YT {
  PlayerState: {
    PLAYING: number;
    PAUSED: number;
    ENDED: number;
  };
  OnStateChangeEvent: {
    data: number;
  };
}

declare global {
  interface Window {
    YT: YT;
  }
}

@Component({
  selector: 'app-feeds',
  templateUrl: './feeds.component.html',
  styleUrl: './feeds.component.scss',
})
export class FeedsComponent implements OnChanges {
  @ViewChildren('video') video!: any;
  @ViewChild('inputComment') inputComment!: ElementRef;
  @Output() isFav = new EventEmitter<boolean>();
  @Input() data: any;
  @Input() api1: any;
  @Input() api2: any;
  postingList: any[] = [];
  page: number = 0;
  page1: number = 0;
  size: number = 10;
  isFavEmpty: boolean = false;
  activeCommentId: number | null = null;
  playerConfig = {
    controls: 1,
    mute: 0,
    autoplay: 0,
    rel: 0,
    start: 0,
    modestbranding: 1,
    showinfo: 0,
    fs: 1,
    playsinline: 1,
    enablejsapi: 1,
    origin: window.location.origin,
    iv_load_policy: 3
  };
  public toolTipMsg: string = 'Copy to clipboard';
  currentItem: any;

  constructor(
    private apiService: ApiService,
    public router: Router,
    private videoService: VideoService,
    public commonService: CommonService,
    public modalService: NgbModal,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    window.scroll(0, 0);
    this.postingList = [...this.data];
    if (this.api1) {
      this.page1 = 1;
    }
    if (this.api2) {
      this.page = 1;
    }
  }

  public handleLike(item: any) {
    item.liked = !item.liked;
    const payload = {
      like: item.liked,
      postingId: item.postingId,
    };
    console.log('Like payload:', payload);
    console.log('Item details:', {
      postingId: item.postingId,
      postedUserId: item.postedUser?.userId,
      currentLikes: item.likes,
    });
    this.apiService.likePost(payload).subscribe({
      next: (res: any) => {
        console.log('Like response:', res);
        if (item.liked) {
          item.likes = item.likes + 1;
        } else {
          item.likes = item.likes > 0 ? item.likes - 1 : 0;
        }
      },
      error: (err: any) => {
        console.error('Like error:', err);
      },
    });
  }

  public markAsStar(item: any) {
    item.favoured = !item.favoured;
    const payload = {
      favourite: item.favoured,
      postingId: item.postingId,
    };
    this.apiService.addToFavourite(payload).subscribe({
      next: (res: any) => {
        this.isFav.emit(true);
      },
      error: (err: any) => {
        console.error('Error marking as star:', err);
      },
    });
  }

  getData(fetchData: boolean) {
    if (fetchData) {
      if (this.isFavEmpty) {
        this.getPostingList();
      } else {
        this.getPostingListUsingFavTag();
        this.page1 = this.page1 + 1;
      }
      this.playPause(true, 0);
    }
  }

  getPostingList() {
    this.apiService.getPostingList(this.page, this.size).subscribe({
      next: (response: any) => {
        this.postingList = this.postingList.concat(
          response.data.map((val: any) => {
            if (val.postType == 'Videos') {
              val.playerConfig = this.playerConfig;
            }
            if (val.postType == 'Blogs') {
              val.blog = {
                ...val?.blog,
                thumbnail: `data:image/jpeg;charset=utf-8;base64,${val?.blog?.thumbnail}`,
              };
            }
            if (val.postType == 'Community') {
              val.community = {
                ...val?.community,
                coverPhoto: `data:image/jpeg;charset=utf-8;base64,${val?.community?.coverPhoto}`,
                profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val?.community?.profilePhoto}`,
              };
            }
            val.postedUser = {
              ...val.postedUser,
              profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.postedUser.profilePhoto}`,
            };
            return val;
          })
        );
        this.page = this.page + 1;
        this.mappingResults();
      },
      error: (err: any) => {
        // console.log(err);
      },
    });
  }

  getPostingListUsingFavTag() {
    let res: any = [];
    this.apiService.getPostingListUsingFavTag(this.page1, this.size).subscribe({
      next: (response: any) => {
        res = response.data;
        this.postingList = this.postingList.concat(
          response.data.map((val: any) => {
            if (val.postType == 'Videos') {
              val.playerConfig = this.playerConfig;
            }
            if (val.postType == 'Blogs') {
              val.blog = {
                ...val?.blog,
                thumbnail: `data:image/jpeg;charset=utf-8;base64,${val?.blog?.thumbnail}`,
              };
            }
            if (val.postType == 'Community') {
              val.community = {
                ...val?.community,
                coverPhoto: `data:image/jpeg;charset=utf-8;base64,${val?.community?.coverPhoto}`,
                profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val?.community?.profilePhoto}`,
              };
            }
            val.postedUser = {
              ...val.postedUser,
              profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.postedUser.profilePhoto}`,
            };
            return val;
          })
        );
        this.mappingResults();
        // console.log(this.postingList);
      },
      error: (err: any) => {
        console.log(err);
      },
      complete: () => {
        if (res.length == 0) {
          this.isFavEmpty = true;
          this.getData(true);
          return;
        }
      },
    });
  }

  getVideoId(url: any) {
    let rx =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
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

  playPause(event: boolean, i: number) {
    // if (event && this.video) {
    //   this.video._results.forEach((e: any, index: number) => {
    //     if (index == i) {
    //       this.postingList[i].playerConfig = { ...this.playerConfig, autoplay: 1 };
    //     } else {
    //       this.postingList[index].playerConfig = { ...this.playerConfig, autoplay: 0 };
    //     }
    //   });
    // }
  }

  mappingResults() {
    this.postingList.map((val: any, index: number) => {
      val.seq = index + 1;
      val.commentsArr = [];
      return val;
    });
  }

  navigateTo(item: any, type: any) {
    switch (type) {
      case 'Blog':
        this.viewPost(item);
        this.router.navigate(['home/blog-details', item.postingId]);
        break;
      case 'Community':
        if (!item?.community.active) {
          const modalRef = this.modalService.open(JoinComponent, {
            backdrop: 'static',
            keyboard: true,
            size: 'md',
            centered: true,
          });
          modalRef.componentInstance.communityRecords = item;
        } else {
          this.viewPost(item);
          this.router.navigateByUrl('/community/home/' + item.postingId);
        }
        break;
    }
  }

  toggelComment(item: any) {
    this.currentItem = item;
    this.activeCommentId = item.postingId;
  }

  viewProfile(item: any) {
    // console.log(item);
    this.getUserDetails(item?.postedUser?.userId);
  }

  getUserDetails(id: any) {
    this.videoService.getUserDetails(id).subscribe({
      next: (res) => {
        let user = { ...res.data.orgDetail, ...res.data.userDetailResponseDTO };
        AuthUtils.setProfile(user);
        switch (res.data.userDetailResponseDTO.role) {
          case 'Student':
            this.router.navigate(['/home/student']);
            break;
          case 'Faculty':
            this.router.navigate(['/home/faculty']);
            break;
          case 'Moderator':
            this.router.navigate(['/home/moderator']);
            break;
          case 'Admin':
            this.router.navigate(['/home/moderator']);
            break;
        }
      },
    });
  }

  notify(t: any, item: any) {
    let msg: any = `http://ec2-35-154-39-126.ap-south-1.compute.amazonaws.com:8081${this.router.url}?contentPostingId=${item.postingId}`;
    this.toolTipMsg = 'Copied!';
    navigator.clipboard.writeText(msg).then(() => {
      t.close();
      t.open('Copied!');
    });
  }
  playerStateChange(event: YT.OnStateChangeEvent, item: any) {
    if (event.data === 1) {
      this.viewPost(item);
    }
  }

  viewPost(item: any) {
    this.apiService.viewPost(item.postingId).subscribe({
      next: (response: any) => {
        console.log('View count incremented:', response);
      },
      error: (error: any) => {
        console.error('Error incrementing view count:', error);
      }
    });
  }

  openShare(item: any) {
    console.log(item);
    let routeTo = item.postType;
    switch (item.postType) {
      case 'Videos':
        routeTo = `home/videos/${item.postingId}`;
        break;
      case 'Blogs':
        routeTo = `home/blog-details/${item.postingId}`;
        break;
      case 'Community':
        routeTo = `community/home/${item.postingId}`;
        break;
    }
    let generated_Link = this.commonService.buildSharedLink(routeTo);
    console.log(generated_Link, 'generated_Link');
    const modalRef = this.modalService.open(ShareComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.msg = generated_Link;
  }
}
