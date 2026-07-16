import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { CommunityService } from '../service/community.service';
import { ApiService } from '../../shared/services/api.service';
import { VideoService } from '../../home/videos/service/video.service';
import { CommonService } from '../../shared/services/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareComponent } from '../../shared/component/share/share.component';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  profilePhoto: any;
  currentCommunity: any;
  feedList: any;
  activeCommentId: any;
  editCommentId: any;
  activeTooltipId: any;
  userInfo: any;
  inputValid: boolean = false;
  commentPage: number = 0;
  @ViewChild('inputComment') inputComment!: ElementRef;
  playerConfig = {
    controls: 1,
    mute: 1,
    autoplay: 0,
    rel: 0,
  };
  currentItem: any;
  constructor(
    private communityService: CommunityService,
    private apiService: ApiService,
    private videoService: VideoService,
    public commonService: CommonService,
    private router: Router,
    private activateRoute: ActivatedRoute,
    public modalService: NgbModal
  ) {}
  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.profilePhoto = `data:image/jpeg;charset=utf-8;base64,${userData?.userDetailResponseDTO?.profilePhoto}`;
    this.userInfo = userData?.userDetailResponseDTO?.userId;
    let id = this.activateRoute.snapshot.params['communityId'];
    this.getPostingUserDetails(id);
  }

  addFeed(comment: any) {
    if (comment && comment.length > 0) {
      let data = comment.match(/(?:https?|ftp):\/\/[\n\S]+/g, '');
      let payload = {
        communityId: this.currentCommunity?.community?.id,
        contentPostingId: !!data ? +data[0].split('/').pop() : null,
        postType: 'FEED',
        description: comment,
      };
      // console.log(payload)

      this.communityService.addFeed(payload).subscribe({
        next: (res) => {
          this.inputComment.nativeElement.value = '';
          this.inputValid = false;
          this.getFeedList();
        },
      });
    }
  }

  checkInputLength(value: string): void {
    this.inputValid = !!(value && value.length >= 3);
  }

  getFeedList() {
    this.communityService
      .getFeedList(0, this.currentCommunity?.community?.id)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.feedList = res.data.map((val: any) => {
            val.postedUser = {
              ...val.postedUser,
              profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.postedUser.profilePhoto}`,
            };
            return val;
          });
        },
      });
  }

  public handleLike(item: any) {
    const previousLiked = item.liked;
    // Toggle state locally
    item.liked = !item.liked;
    // Optimistically update the like counter
    item.likes = item.likes + (item.liked ? 1 : -1);

    const payload = {
      like: item.liked,
      postingId: item.postingId,
    };

    this.apiService.likePost(payload).subscribe({
      // Success – nothing further to do (counter already updated)
      next: () => {},
      // On failure revert UI state to keep data consistent
      error: () => {
        item.liked = previousLiked;
        item.likes = item.likes + (item.liked ? 1 : -1);
      },
    });
  }

  toggleTooltip(item: any) {
    this.activeTooltipId = item.commentId;
  }

  toggelComment(item: any) {
    this.currentItem = item;
    this.activeCommentId = item.postingId;
  }

  cancelToolTip() {
    this.activeTooltipId = null;
    this.editCommentId = null;
  }

  getComment(item: any, page: number, size: number, isSee: boolean = false) {
    let payload = {
      postingId: item.postingId,
      page: page,
      size: size,
    };
    this.videoService.getComment(payload).subscribe({
      next: (res) => {
        if (isSee) {
          item.commentsArr = item.commentsArr.concat(
            res.data.map((val: any) => {
              return {
                ...val,
                commentTime: this.commonService.getDateDiffInDHM(
                  new Date(val.commentTime),
                  new Date()
                ),
                commentedUser: {
                  ...val.commentedUser,
                  profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.commentedUser.profilePhoto}`,
                },
              };
            })
          );
          if (page == 0) {
            item.commentsArr.shift();
          }
        } else {
          item.commentsArr = res.data.map((val: any) => {
            return {
              ...val,
              commentTime: this.commonService.getDateDiffInDHM(
                new Date(val.commentTime),
                new Date()
              ),
              commentedUser: {
                ...val.commentedUser,
                profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.commentedUser.profilePhoto}`,
              },
            };
          });
        }
      },
    });
  }

  viewMoreComment(item: any) {
    this.getComment(item, this.commentPage, 4, true);
    this.commentPage = this.commentPage + 1;
  }

  deleteComment(item: any, comment: any) {
    this.videoService.deleteComment(comment.commentId).subscribe({
      next: (res) => {
        console.log(res);
        item.comments = item.comments > 0 ? item.comments - 1 : 0;
        this.getComment(item, 0, 1);
      },
    });
  }

  addComment(item: any, comment: any) {
    if (comment && comment.length > 0) {
      let payload = {
        content: comment,
        postingId: item.postingId,
      };
      this.videoService.addComment(payload).subscribe({
        next: (res) => {
          item.comments = item.comments + 1;
          this.inputComment.nativeElement.value = '';
          this.getComment(item, 0, 1);
          this.commentPage = 0;
        },
      });
    }
  }

  editComment(item: any) {
    this.editCommentId = item.commentId;
    this.activeTooltipId = null;
  }

  updateComment(item: any, event: any, parentItem: any) {
    if (event && event.length) {
      let payload = {
        content: event,
      };
      this.videoService.updateComment(payload, item.commentId).subscribe({
        next: (res) => {
          this.editCommentId = null;
          this.getComment(parentItem, 0, 1);
          this.commentPage = 0;
        },
      });
    }
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

  getPostingUserDetails(id: any) {
    this.apiService.getPostingUserDetails(id).subscribe({
      next: (res) => {
        this.currentCommunity = res.data;
        this.getFeedList();
      },
    });
  }

  keyDown(event: any, item: any, comment: any) {
    if (event.keyCode === 13) {
      this.addComment(item, comment);
    }
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
