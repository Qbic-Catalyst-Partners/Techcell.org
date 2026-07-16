import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BlogService } from '../service/blog.service';
import { ApiService } from '../../../shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BlogModalComponent } from '../modals/blog-modal/blog-modal.component';
import { AuthUtils } from '../../../shared/utility/auth-utils';
import { VideoService } from '../../videos/service/video.service';
import { ShareComponent } from '../../../shared/component/share/share.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent {
  @ViewChild('inputComment') inputComment!: ElementRef;
  public hasAsscessToAdd: boolean = false;
  public isLiked: boolean = false;
  public tempArray: any = [1, 2, 3];
  public data: any;
  public toolTipMsg: string = 'Copy to clipboard';
  public hashTagList: any = [];
  public postingId: any;
  activeCommentId: any;
  commentPage: number = 0;
  editCommentId: any;
  currentUserProfile:any;
  activeTooltipId: any;
  userInfo: any;
  isFav: any;
  relatedBlogList:any = [];
  /** Whether the current blog is the top-rated one for its primary hashtag. */
  public isTopRated: boolean = false;
  public safeContent: SafeHtml | null = null;

  constructor(
    public commonService: CommonService,
    private router: Router,
    private videoService: VideoService,
    private route: ActivatedRoute,
    private blogService: BlogService,
    private apiService: ApiService,
    public modalService: NgbModal,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.getAllHashTagList();
    this.route.params.subscribe((param: any) => {
      // console.log(param, 'param');
      this.getBlogById(+param.id);
    });
  }

  handleLike() {
    this.data.liked = !this.data.liked;
    this.data.liked ? this.data.likes++ : this.data.likes--;
    const payLoad = {
      like: this.data.liked,
      postingId: this.data.postingId,
    };
    this.commonService.likePost(payLoad).subscribe((res: any) => {
      console.log(res);
    });
  }

  handleFavourite() {
    this.data.favoured = !this.data.favoured;
    const payLoad = {
      favourite: this.data.favoured,
      postingId: this.data.postingId,
    };
    this.commonService.addToFavourite(payLoad).subscribe((res: any) => {
      // console.log(res);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.data = changes['detail'].currentValue;
    let userData = JSON.parse(this.data);
    this.userInfo = userData?.userDetailResponseDTO?.userId;
    console.log(this.data);
  }
  /* ngOnChanges(changes: SimpleChanges): void {
    window.scroll(0, 0);
    this.postingList = [...this.data];
    if (this.api1) {
      this.page1 = 1;
    }
    if (this.api2) {
      this.page = 1;
    }
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO?.userId;
    this.currentUserProfile = userData?.userDetailResponseDTO?.profilePhoto;
  } */
  
  viewProfile(item: any) {
    console.log(item);
    this.getUserDetails(item?.postedUser?.userId);
  }

  getUserDetails(id: any) {
    this.videoService.getUserDetails(id).subscribe({
      next: (res:any) => {
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

  public getBlogById(postingId: any): void {
    this.apiService
      .getPostingUserDetails(postingId)
      .subscribe((response: any) => {
        // console.log(response);
        this.data = response.data;
        if(this.data?.blog?.blogContent){
          this.safeContent = this.sanitizer.bypassSecurityTrustHtml(
            this.data.blog.blogContent
          );
        }
        if(this.data){
          let tagId = this.data?.postingTags[0].hashTag?.id;
          this.relatedBlogData(tagId)
        }

        // Increment unique view count
        this.apiService.viewPost(postingId).subscribe();
      });
  }

  notify(t: any) {
    let msg: any = `${this.commonService.commonApiPath()}${
      this.router.url
    }?contentPostingId=${this.data.postingId}`;
    this.toolTipMsg = 'Copied!';
    navigator.clipboard.writeText(msg).then(() => {
      t.close();
      t.open('Copied!');
    });
  }

  public getAllHashTagList(): void {
    this.blogService.getAllHashTagList().subscribe({
      next: (res: any) => {
        // console.log(res.data);
        this.hashTagList = res.data;
      },
      error: (err: any) => {},
    });
  }

  public getSelectedTag(evt: any) {
    this.router.navigate(['/home/blog']);
  }

  public addBlog(evt: any) {
    const modalRef = this.modalService.open(BlogModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'xl',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.router.navigate(['/home/blog']);
      }
    });
    // const data = {
    //   email: this.loginForm.controls.emailId.value,
    // };
    // modalRef.componentInstance.viewData = data;
  }
  public navigateTo(id: any) {
    this.router.navigate(['/home/blog-details', id]);
  }

  toggleTooltip(item: any) {
    this.activeTooltipId = item.commentId;
  }

  toggelComment(item: any) {
    this.activeCommentId = item.postingId;
    this.commentPage = 0;
    this.getComment(item, 0, 1);
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

  cancelToolTip() {
    this.activeTooltipId = null;
    this.editCommentId = null;
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

  viewMoreComment(item: any) {
    this.getComment(item, this.commentPage, 4, true);
    this.commentPage = this.commentPage + 1;
  }

  keyDown(event: any, item: any, comment: any) {
    if (event.keyCode === 13) {
      this.addComment(item, comment);
    }
  }
  
  public markAsStar(item: any) {
    item.favoured = !item.favoured;
    let payload = {
      favourite: item.favoured,
      postingId: item.postingId,
    };
    this.apiService.addToFavourite(payload).subscribe({
      next: (res) => {
        this.isFav.emit(true);
      },
      error: (err) => {},
    });
  }

  openShare(item: any) {
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

  relatedBlogData(tagId:any){
    const payload = { id: tagId, documentTypeEnum: 'BLOGS' };
    this.blogService.getBlogsByTagId(payload, 0).subscribe({
      next: (res: any) => {
        const list = res?.data || [];

        // show at most three related items as before
        this.relatedBlogList = list.slice(0, 3);

        // Determine if **this** blog is top-rated for the tag
        if (!list.length) {
          this.isTopRated = false;
          return;
        }

        const topBlog = list.reduce((prev: any, cur: any) =>
          cur.likes > prev.likes ? cur : prev
        );

        this.isTopRated =
          topBlog.likes > 0 && topBlog.postingId === this.data?.postingId;
      },
      error: (error) => {
        console.error(error.message);
      },
    });
  }

}
