import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonService } from '../../services/common.service';
import { AuthUtils } from '../../utility/auth-utils';
import { VideoService } from '../../../home/videos/service/video.service';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.scss',
})
export class CommentComponent implements OnChanges {
  @Input() item: any;
  @ViewChild('inputComment') inputComment!: ElementRef;
  @ViewChild('replayComment') replayComment!: ElementRef;

  activeTooltipId: any;
  editCommentId: any;
  currentUserProfile: any;
  userInfo: any;
  commentPage: number = 0;
  replayPage: number = 0;
  activeReplayId: any;

  // Mention support
  private mentionSearch$ = new Subject<string>();
  nameSuggestions: any[] = [];
  private mentionedUserIds: number[] = [];

  constructor(
    public router: Router,
    public commonService: CommonService,
    private videoService: VideoService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO?.userId;
    this.currentUserProfile = userData?.userDetailResponseDTO?.profilePhoto;
    this.getComment(this.item, 0, 1);

    // initialize mention search stream (once)
    this.mentionSearch$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          if (!term || term.length < 2) return of([]);
          return this.videoService.searchUsersByName(term);
        })
      )
      .subscribe((res: any) => {
        this.nameSuggestions = Array.isArray(res?.data) ? res.data : res;
      });
  }

  keyDown(event: any, item: any, comment: any, comm: any = '') {
    if (event.keyCode === 13) {
      this.addComment(item, comment, comm);
    }
  }

  editDown(event: any, item: any, value: any, parentItem: any) {
    if (event.keyCode === 13) {
      this.updateComment(item, value, parentItem);
    }
  }

  toggleTooltip(item: any) {
    this.activeTooltipId = item.commentId;
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
        this.commentPage = 0;
      },
    });
  }

  addComment(item: any, comment: any, comm: any = '') {
    if (comment && comment.length > 0) {
      let payload = {
        content: comment,
        postingId: item.postingId,
        parentCommentId: comm?.commentId,
        mentions: this.mentionedUserIds,
      };
      this.videoService.addComment(payload).subscribe({
        next: (res) => {
          if (comm == '' && comm.length == 0) {
            item.comments = item.comments + 1;
            this.getComment(item, 0, 1);
            this.commentPage = 0;
            this.inputComment.nativeElement.value = '';
            this.resetMentions();
          } else {
            let payload = {
              page: this.replayPage,
              pId: comm?.commentId,
              size: 4,
            };
            this.getReplayComment(payload, comm);
            this.replayComment.nativeElement.value = '';
          }
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
          console.log(item.commentsArr);

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

  getReplayComment(payload: any, item: any, isSee: boolean = false) {
    this.videoService.getReplayComment(payload).subscribe({
      next: (res) => {
        if (isSee) {
          item.replayCommentArr = item.replayCommentArr.concat(
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
          if (this.replayPage == 0) {
            item.replayCommentArr.shift();
          }
        } else {
          item.replayCommentArr = res.data.map((val: any) => {
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

  replay(item: any) {
    this.activeReplayId = item.commentId;
    let payload = {
      page: this.replayPage,
      pId: item?.commentId,
      size: 4,
    };
    this.getReplayComment(payload, item);
  }

  viewProfile(userId: any) {
    // console.log(item);
    this.getUserDetails(userId);
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
          case 'Admin':
          case 'Moderator':
            this.router.navigate(['/home/moderator']);
            break;
        }
      },
    });
  }

  /** Called on input event of comment box */
  onInputChange(ev: any) {
    const val: string = ev?.target?.value || '';
    const caretPos: number = ev?.target?.selectionStart || val.length;
    const uptoCaret = val.substring(0, caretPos);
    const match = uptoCaret.match(/@([\w ]{2,})$/);
    if (match) {
      this.mentionSearch$.next(match[1].trim());
    } else {
      this.nameSuggestions = [];
    }
  }

  selectNameSuggestion(sug: any, inputEl: HTMLInputElement) {
    const fullName: string = sug.fullName || sug.email || '';
    if (!fullName) return;
    const text = inputEl.value;
    const caretPos = inputEl.selectionStart || text.length;
    const before = text.substring(0, caretPos);
    const after = text.substring(caretPos);
    const newBefore = before.replace(/@([\w ]*)$/, '@' + fullName + ' ');
    inputEl.value = newBefore + after;
    const newPos = newBefore.length;
    setTimeout(() => inputEl.setSelectionRange(newPos, newPos));

    this.nameSuggestions = [];
    if (sug.userId && !this.mentionedUserIds.includes(sug.userId)) {
      this.mentionedUserIds.push(sug.userId);
    }
  }

  // helper to reset mentions after successful post
  private resetMentions() {
    this.mentionedUserIds = [];
    this.nameSuggestions = [];
  }
}
