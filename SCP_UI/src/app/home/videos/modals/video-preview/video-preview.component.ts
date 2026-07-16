import { Component, Input, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../common/common.service';
import { Router } from '@angular/router';
import { VideoService } from '../../service/video.service';
import { AuthUtils } from '../../../../shared/utility/auth-utils';
import { ApproveModalComponent } from './../../../../user-profile-module/my-account/approvals/modal/approve-modal/approve-modal.component';
import { RejectModalComponent } from './../../../../user-profile-module/my-account/approvals/modal/reject-modal/reject-modal.component';
import { ApiService } from '../../../../shared/services/api.service';
import { ShareComponent } from '../../../../shared/component/share/share.component';

@Component({
  selector: 'app-video-preview',
  templateUrl: './video-preview.component.html',
  styleUrl: './video-preview.component.scss',
})
export class VideoPreviewComponent {
  @Input() viewData!: any;
  @Input() isApprovalView: boolean = false;
  @ViewChild('inputComment') inputComment: any;
  @ViewChild('videoDescription') videoDescription: any;
  @ViewChild('containerInner') containerInner: any;
  public toolTipMsg: string = 'Copy to clipboard';
  activeCommentId: any;
  activeTooltipId: any;
  editCommentId: any;
  userInfo: any;
  commentPage: number = 0;
  playerConfig = {
    controls: 1,
    mute: 0,
    autoplay: 1,
  };
  isDescriptionExpanded = false;
  constructor(
    private activeModal: NgbActiveModal,
    public commonService: CommonService,
    private router: Router,
    private videoService: VideoService,
    private apiService: ApiService,
    public modalService: NgbModal
  ) {}
  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO?.userId;
    console.log(this.viewData, 'viewData');

    // Increment unique view count when modal opens
    if (this.viewData && this.viewData.postingId) {
      this.viewPost(this.viewData);
    }
  }

  getVideoId(url: any) {
    let rx =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    let res = url.match(rx);
    return res && res.length ? res[1] : null;
  }

  public handleLike(item: any) {
    item.liked = !item.liked;
    item.liked ? item.likes++ : item.likes--;
    const payLoad = {
      like: item.liked,
      postingId: item.postingId,
    };
    this.commonService.likePost(payLoad).subscribe((res: any) => {
      console.log(res);
    });
  }

  notify(t: any) {
    let msg: any = `${this.commonService.commonApiPath()}${
      this.router.url
    }?contentPostingId=${this.viewData.postingId}`;
    this.toolTipMsg = 'Copied!';
    navigator.clipboard.writeText(msg).then(() => {
      t.close();
      t.open('Copied!');
    });
  }

  public markAsStar(item: any) {
    item.favoured = !item.favoured;
    let payload = {
      favourite: item.favoured,
      postingId: item.postingId,
    };
    this.apiService.addToFavourite(payload).subscribe({
      next: (res) => {},
      error: (err) => {},
    });
  }

  close() {
    this.activeModal.close(true);
  }

  viewProfile(item: any) {
    // console.log(item);
    this.getUserDetails(item?.postedUser?.userId);
    // Removed immediate modal close to ensure navigation works after API response
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
        // Close modal after routing to avoid destroying subscription prematurely
        this.activeModal.close();
      },
    });
  }

  playerStateChange(event: any, item: any) {
    switch (event.data) {
      case 1:
        {
        }
        break;
    }
  }

  viewPost(item: any) {
    this.apiService.viewPost(item.postingId).subscribe({
      next: () => {
        item.views += 1;
      },
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

  toggleTooltip(item: any) {
    this.activeTooltipId = item.commentId;
  }

  toggelComment(item: any) {
    if (this.activeCommentId === item.postingId) {
      this.activeCommentId = null;
    } else {
      this.activeCommentId = item.postingId;
      this.commentPage = 0;
      this.getComment(item, 0, 1);

      // Scroll to show the comment section
      setTimeout(() => {
        const container = this.containerInner.nativeElement;
        const commentSection = container.querySelector('.comment-section');
        if (commentSection) {
          const commentTop = commentSection.offsetTop;
          const containerScrollTop = container.scrollTop;
          const containerBottom = containerScrollTop + container.clientHeight;
          const commentBottom = commentTop + commentSection.offsetHeight;

          // Only scroll if the comment section is not fully visible
          if (commentBottom > containerBottom) {
            // Add some padding to ensure the input is visible
            const scrollTo = commentBottom - containerBottom + 20;
            container.scrollTo({
              top: containerScrollTop + scrollTo,
              behavior: 'smooth'
            });
          }
        }
      }, 100); // Small delay to ensure the comment section is rendered
    }
  }

  cancelToolTip() {
    this.activeTooltipId = null;
    this.editCommentId = null;
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
          this.getComment(item, 0, 1);
          this.commentPage = 0;
          this.inputComment.nativeElement.value = '';
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
        },
      });
    }
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

  keyDown(event: any, item: any, comment: any) {
    if (event.keyCode === 13) {
      this.addComment(item, comment);
    }
  }

  viewMoreComment(item: any) {
    this.getComment(item, this.commentPage, 4, true);
    this.commentPage = this.commentPage + 1;
  }

  approve() {
    const modalRef = this.modalService.open(ApproveModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.activeModal.close({ action: 'approve', data: this.viewData });
      }
    });
  }

  reject() {
    const modalRef = this.modalService.open(RejectModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.activeModal.close({ action: 'reject', data: this.viewData });
      }
    });
  }

  toggleDescription() {
    this.isDescriptionExpanded = !this.isDescriptionExpanded;
    if (this.isDescriptionExpanded) {
      // Get the full height of the content
      const fullHeight = this.videoDescription.nativeElement.scrollHeight;
      this.videoDescription.nativeElement.style.height = `${fullHeight}px`;
      
      // Scroll to show the expanded content if needed
      setTimeout(() => {
        const container = this.containerInner.nativeElement;
        const description = this.videoDescription.nativeElement;
        const descriptionTop = description.offsetTop;
        const descriptionBottom = descriptionTop + description.offsetHeight;
        const containerScrollTop = container.scrollTop;
        const containerBottom = containerScrollTop + container.clientHeight;

        // Only scroll if the expanded content is not fully visible
        if (descriptionBottom > containerBottom) {
          // Calculate how much we need to scroll to show the full description
          // Add 20px extra padding to account for the Show Less button
          const scrollTo = descriptionBottom - containerBottom + 20;
          container.scrollTo({
            top: containerScrollTop + scrollTo,
            behavior: 'smooth'
          });
        }
      }, 300); // Wait for height transition to complete
    } else {
      // Collapse back to initial height
      this.videoDescription.nativeElement.style.height = '34px';
      
      // Scroll back to top of description if it's not visible
      setTimeout(() => {
        const container = this.containerInner.nativeElement;
        const description = this.videoDescription.nativeElement;
        const descriptionTop = description.offsetTop;
        const containerScrollTop = container.scrollTop;

        // Only scroll if the description is not visible at the top
        if (descriptionTop < containerScrollTop) {
          container.scrollTo({
            top: descriptionTop,
            behavior: 'smooth'
          });
        }
      }, 300); // Wait for height transition to complete
    }
  }
}
