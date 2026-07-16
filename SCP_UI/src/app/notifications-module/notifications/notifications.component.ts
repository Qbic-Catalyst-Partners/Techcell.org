import { Component, HostListener, OnInit } from '@angular/core';
import { NgbTooltip, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { WebSocketService } from '../../shared/services/websocket.service';
import { HttpService } from '../../shared/services/http.service';
import { CommonService as SharedCommonService } from '../../shared/services/common.service';
import { ModalComponent } from '../../shared/component/modal/modal.component';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { VideoService } from '../../home/videos/service/video.service';
import { Router } from '@angular/router';
import { VideoPreviewComponent } from '../../home/videos/modals/video-preview/video-preview.component';
import { ApiService } from '../../shared/services/api.service';
import { CareerService } from '../../careers-module/career.service';
import { InternshipModalComponent } from '../../careers-module/internships/modals/internship-modal.component';
import { JoblistingModalComponent } from '../../careers-module/job-listings/joblisting-modal/joblisting-modal.component';
import { ProjectModalComponent } from '../../careers-module/projects/project-modal/project-modal.component';
import { CertificationListingModalComponent } from '../../careers-module/certification-grid-view/certification-listing-modal/certification-listing-modal.component';
import { forkJoin } from 'rxjs';

interface AppNotification {
  id: number;
  actorUserName: string;
  postingTitle: string;
  entityType: string;
  createdDate: string;
  isRead: boolean;
  eventType: string;
  message: string;
  reason?: string;
  commentContent?: string;
  formattedCommentContent?: string;
  photoUrl?: string;
  companyName?: string;
  inviteToken?: string;
  projectTitle?: string;
  inviteStatus?: 'INVITED' | 'ACCEPTED' | 'DECLINED';
  entityId?: number;
  mentionUserName?: string;
}

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  private activeTooltip?: NgbTooltip;

  notifications: AppNotification[] = [];

  userEmail: string = '';

  // Attempt to cache lookups to minimize API calls
  private userCache: Record<string, number> = {};

  // Dynamic counts
  get unreadMentionCount(): number {
    return this.notifications.filter(n => n.eventType === 'MENTION' && !n.isRead).length;
  }

  get unreadNormalCount(): number {
    return this.notifications.filter(n => n.eventType !== 'MENTION' && !n.isRead).length;
  }

  constructor(private webSocketService: WebSocketService,
              private http: HttpService,
              private commonService: SharedCommonService,
              private modalService: NgbModal,
              private videoService: VideoService,
              private apiService: ApiService,
              private careerService: CareerService,
              private router: Router) {}

  ngOnInit(): void {
    // Fetch logged-in user's email once, so it can be displayed in the sidebar
    try {
      const raw = AuthUtils.getUserDetails();
      if (raw) {
        const parsed = JSON.parse(raw);
        this.userEmail = parsed?.userDetailResponseDTO?.emailId || '';
      }
    } catch {}

    // Ensure WebSocket is connected in case app was opened before login or connection dropped
    this.webSocketService.initializeWebSocketConnection();

    this.webSocketService.notifications$.subscribe((notif: any) => {
      if (!notif) return;

      let actorUserName = '';
      let postingTitle = '';
      let message = '';
      let actorPhoto = '';
      let reason = '';
      let companyName = '';
      let commentContent = '';
      let inviteToken = '';
      let mentionUserName = '';
      if (notif.extraJson) {
        try {
          const json = JSON.parse(notif.extraJson);
          actorUserName = json.actorUserName || '';
          postingTitle = json.postingTitle || json.title || '';
          actorPhoto = json.actorPhoto || '';
          reason = json.reason || '';
          companyName = json.companyName || '';
          commentContent = json.commentContent || '';
          mentionUserName = json.mentionUserName || '';
          if (notif.eventType === 'PROJECT_INVITE') {
            postingTitle = json.projectTitle || '';
            inviteToken = json.inviteToken || '';
          } else if (notif.eventType === 'PROJECT_TEAM_COMPLETE' || notif.eventType === 'PROJECT_TEAM_MEMBERS_ACCEPTED' || notif.eventType === 'PROJECT_TEAM_APPROVED' || notif.eventType === 'PROJECT_TEAM_REJECTED') {
            postingTitle = json.projectTitle || '';
          }
        } catch (e) {}
      }

      let photoUrl = '/assets/dp/default-avatar.png';
      if (actorPhoto) {
        if (actorPhoto.startsWith('data:image')) {
          photoUrl = actorPhoto;
        } else {
          // detect mime type via base64 signature
          const sig = actorPhoto.substring(0, 10);
          const mime = sig.startsWith('iVBORw0') ? 'image/png' : sig.startsWith('/9j/') ? 'image/jpeg' : 'image/jpeg';
          photoUrl = `data:${mime};base64,${actorPhoto}`;
        }
      }

      // Build display message
      const entityUpper = (notif.entityType || '').toUpperCase();
      if (notif.eventType === 'LIKE') {
        const entityLabel = entityUpper === 'VIDEOS' ? 'Video' : 'Blog';
        message = `Your ${entityLabel} ${postingTitle} was liked by ${actorUserName}`;
      } else if (notif.eventType === 'CREATE') {
        const et = (notif.entityType || '').toUpperCase();
        switch (et) {
          case 'COMMUNITY':
            message = `${actorUserName} created a new Community ${postingTitle}`;
            break;
          case 'BLOGS':
            message = `${actorUserName} added a Blog ${postingTitle}`;
            break;
          case 'VIDEOS':
            message = `${actorUserName} added a Video ${postingTitle}`;
            break;
          case 'SOFTWARE':
            message = `${actorUserName} added a new Software ${postingTitle}`;
            break;
          case 'INTERNSHIP':
            message = `${actorUserName} added an Internship ${postingTitle}`;
            break;
          case 'PROJECT':
            message = `${actorUserName} added a Project ${postingTitle}`;
            break;
          case 'JOB':
            message = `${actorUserName} added a Job ${postingTitle}`;
            break;
          case 'CERTIFICATION':
            message = `${actorUserName} added a Certification ${postingTitle}`;
            break;
          default:
            message = `${actorUserName} added a new resource`;
        }
      } else if (notif.eventType === 'APPROVE' || notif.eventType === 'REJECT') {
        const actionText = notif.eventType === 'APPROVE' ? 'accepted' : 'rejected';
        const entityLabel = entityUpper === 'VIDEOS' ? 'video' : 'blog';
        message = `${actorUserName} ${actionText} your ${entityLabel} ${postingTitle}`;
      } else if (notif.eventType === 'APPLY') {
        const entityUpper2 = (notif.entityType || '').toUpperCase();
        if (entityUpper2 === 'INTERNSHIP') {
          message = `${actorUserName} applied for an internship ${postingTitle} at ${companyName}`;
        } else if (entityUpper2 === 'JOB') {
          message = `${actorUserName} applied for a job ${postingTitle} at ${companyName}`;
        } else if (entityUpper2 === 'CERTIFICATION') {
          message = `${actorUserName} applied for a certification ${postingTitle}`;
        }
      } else if (notif.eventType === 'COMMENT') {
        const entityLabel = entityUpper === 'VIDEOS' ? 'video' : 'blog';
        message = `${actorUserName} commented on your ${entityLabel} ${postingTitle}`;
      } else if (notif.eventType === 'COMMENT_REPLY') {
        message = `${actorUserName} replied to your comment`;
      } else if (notif.eventType === 'MENTION') {
        const entLbl = (notif.entityType || '').toUpperCase() === 'VIDEOS' ? 'Video' : 'Blog';
        message = `${actorUserName} mentioned you in a ${entLbl} ${postingTitle}`;
      } else if (notif.eventType === 'PROJECT_INVITE') {
        message = `${actorUserName} has invited you to collaborate on project ${postingTitle}`;
      } else if (notif.eventType === 'PROJECT_TEAM_COMPLETE') {
        message = `${actorUserName} & team have applied for project ${postingTitle}`;
      } else if (notif.eventType === 'PROJECT_TEAM_MEMBERS_ACCEPTED') {
        message = `All invited members have accepted your invitation for project ${postingTitle}`;
      } else if (notif.eventType === 'PROJECT_INVITE_DECLINED') {
        message = `${actorUserName} rejected your invitation for project ${postingTitle}`;
      }

      if (!message && notif.message) {
        message = this.boldifyMessage(notif.message, actorUserName, postingTitle);
      }

      if (notif.eventType === 'PROJECT_TEAM_APPROVED' || notif.eventType === 'PROJECT_TEAM_REJECTED') {
        message = this.boldifyMessage(notif.message || `${actorUserName} ${notif.eventType==='PROJECT_TEAM_APPROVED'?'accepted':'rejected'} your team application for project ${postingTitle}`, actorUserName, postingTitle);
      }

      message = this.boldifyMessage(message, actorUserName, postingTitle);

      const appNotif: AppNotification = {
        id: notif.id,
        actorUserName,
        postingTitle,
        entityType: notif.entityType,
        createdDate: notif.createdDate,
        isRead: notif.isRead,
        eventType: notif.eventType,
        message,
        reason,
        commentContent,
        formattedCommentContent: mentionUserName ? `<span class=\"fw-bold noti-card__title-link cur-p\">@${mentionUserName}</span> ${commentContent}`.trim() : this.formatCommentContent(commentContent),
        photoUrl,
        companyName,
        inviteToken,
        projectTitle: postingTitle,
        inviteStatus: 'INVITED',
        entityId: notif.entityId,
        mentionUserName
      };

      this.notifications.unshift(appNotif);
      this.resolveInviteStatus(appNotif);
    });

    // initial load
    this.http.get('/api/user/notifications').subscribe({
      next: (arr) => {
        if (Array.isArray(arr)) {
          const mapped: AppNotification[] = arr.map((notif: any) => {
            let actorUserName = '';
            let postingTitle = '';
            let message = '';
            let actorPhoto = '';
            let reason = '';
            let companyName = '';
            let commentContent = '';
            let inviteToken = '';
            let mentionUserName = '';
            if (notif.extraJson) {
              try {
                const j = JSON.parse(notif.extraJson);
                actorUserName = j.actorUserName || '';
                postingTitle = j.postingTitle || j.title || '';
                actorPhoto = j.actorPhoto || '';
                reason = j.reason || '';
                companyName = j.companyName || '';
                commentContent = j.commentContent || '';
                mentionUserName = j.mentionUserName || '';
                if (notif.eventType === 'PROJECT_INVITE') {
                  postingTitle = j.projectTitle || '';
                  inviteToken = j.inviteToken || '';
                } else if (notif.eventType === 'PROJECT_TEAM_COMPLETE' || notif.eventType === 'PROJECT_TEAM_MEMBERS_ACCEPTED' || notif.eventType === 'PROJECT_TEAM_APPROVED' || notif.eventType === 'PROJECT_TEAM_REJECTED') {
                  postingTitle = j.projectTitle || '';
                }
              } catch {}
            }

            let photoUrl = '/assets/dp/default-avatar.png';
            if (actorPhoto) {
              if (actorPhoto.startsWith('data:image')) {
                photoUrl = actorPhoto;
              } else {
                const sig = actorPhoto.substring(0, 10);
                const mime = sig.startsWith('iVBORw0') ? 'image/png' : sig.startsWith('/9j/') ? 'image/jpeg' : 'image/jpeg';
                photoUrl = `data:${mime};base64,${actorPhoto}`;
              }
            }

            const entityUpper = (notif.entityType || '').toUpperCase();
            if (notif.eventType === 'LIKE') {
              const entityLabel = entityUpper === 'VIDEOS' ? 'Video' : 'Blog';
              message = `Your ${entityLabel} ${postingTitle} was liked by ${actorUserName}`;
            } else if (notif.eventType === 'CREATE') {
              const et = (notif.entityType || '').toUpperCase();
              switch (et) {
                case 'COMMUNITY':
                  message = `${actorUserName} created a new Community ${postingTitle}`;
                  break;
                case 'BLOGS':
                  message = `${actorUserName} added a Blog ${postingTitle}`;
                  break;
                case 'VIDEOS':
                  message = `${actorUserName} added a Video ${postingTitle}`;
                  break;
                case 'SOFTWARE':
                  message = `${actorUserName} added a new Software ${postingTitle}`;
                  break;
                case 'INTERNSHIP':
                  message = `${actorUserName} added an Internship ${postingTitle}`;
                  break;
                case 'PROJECT':
                  message = `${actorUserName} added a Project ${postingTitle}`;
                  break;
                case 'JOB':
                  message = `${actorUserName} added a Job ${postingTitle}`;
                  break;
                case 'CERTIFICATION':
                  message = `${actorUserName} added a Certification ${postingTitle}`;
                  break;
                default:
                  message = `${actorUserName} added a new resource`;
              }
            } else if (notif.eventType === 'APPROVE' || notif.eventType === 'REJECT') {
              const actionTxt = notif.eventType === 'APPROVE' ? 'accepted' : 'rejected';
              const entityLbl = entityUpper === 'VIDEOS' ? 'video' : 'blog';
              message = `${actorUserName} ${actionTxt} your ${entityLbl} ${postingTitle}`;
            } else if (notif.eventType === 'APPLY') {
              const entityUpper2 = (notif.entityType || '').toUpperCase();
              if (entityUpper2 === 'INTERNSHIP') {
                message = `${actorUserName} applied for an internship ${postingTitle} at ${companyName}`;
              } else if (entityUpper2 === 'JOB') {
                message = `${actorUserName} applied for a job ${postingTitle} at ${companyName}`;
              } else if (entityUpper2 === 'CERTIFICATION') {
                message = `${actorUserName} applied for a certification ${postingTitle}`;
              }
            } else if (notif.eventType === 'COMMENT') {
              const entityLabel = entityUpper === 'VIDEOS' ? 'video' : 'blog';
              message = `${actorUserName} commented on your ${entityLabel} ${postingTitle}`;
            } else if (notif.eventType === 'COMMENT_REPLY') {
              message = `${actorUserName} replied to your comment`;
            } else if (notif.eventType === 'MENTION') {
              const entLbl = (notif.entityType || '').toUpperCase() === 'VIDEOS' ? 'Video' : 'Blog';
              message = `${actorUserName} mentioned you in a ${entLbl} ${postingTitle}`;
            } else if (notif.eventType === 'PROJECT_INVITE') {
              message = `${actorUserName} has invited you to collaborate on project ${postingTitle}`;
            } else if (notif.eventType === 'PROJECT_TEAM_COMPLETE') {
              message = `${actorUserName} & team have applied for project ${postingTitle}`;
            } else if (notif.eventType === 'PROJECT_TEAM_MEMBERS_ACCEPTED') {
              message = `All invited members have accepted your invitation for project ${postingTitle}`;
            } else if (notif.eventType === 'PROJECT_INVITE_DECLINED') {
              message = `${actorUserName} rejected your invitation for project ${postingTitle}`;
            }

            if (!message && notif.message) {
              message = this.boldifyMessage(notif.message, actorUserName, postingTitle);
            }

            if (notif.eventType === 'PROJECT_TEAM_APPROVED' || notif.eventType === 'PROJECT_TEAM_REJECTED') {
              message = this.boldifyMessage(notif.message || `${actorUserName} ${notif.eventType==='PROJECT_TEAM_APPROVED'?'accepted':'rejected'} your team application for project ${postingTitle}`, actorUserName, postingTitle);
            }

            message = this.boldifyMessage(message, actorUserName, postingTitle);

            const result: AppNotification = {
              id: notif.id,
              actorUserName,
              postingTitle,
              entityType: notif.entityType,
              createdDate: notif.createdDate,
              isRead: notif.isRead,
              eventType: notif.eventType,
              message,
              reason,
              commentContent,
              formattedCommentContent: mentionUserName ? `<span class=\"fw-bold noti-card__title-link cur-p\">@${mentionUserName}</span> ${commentContent}`.trim() : this.formatCommentContent(commentContent),
              photoUrl,
              companyName,
              inviteToken,
              projectTitle: postingTitle,
              inviteStatus: 'INVITED',
              entityId: notif.entityId,
              mentionUserName
            };

            this.resolveInviteStatus(result);
            return result;
          });
          this.notifications = mapped;
        }
      }
    });
  }

  toggleTooltip(tooltip: NgbTooltip): void {
    // If clicking the same tooltip, simply toggle it
    if (this.activeTooltip === tooltip) {
      tooltip.toggle();
      if (!tooltip.isOpen()) {
        this.activeTooltip = undefined;
      }
      return;
    }

    // Otherwise close the previously open tooltip (if any) then open the new one
    if (this.activeTooltip) {
      this.activeTooltip.close();
    }

    // Defer the open call so the DOM has time to register the previous close
    setTimeout(() => {
      tooltip.open();
      this.activeTooltip = tooltip;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(): void {
    if (this.activeTooltip) {
      this.activeTooltip.close();
      this.activeTooltip = undefined;
    }
  }

  markAsRead(notif: AppNotification, tooltip?: NgbTooltip): void {
    if (notif.isRead) {
      if (tooltip) tooltip.close();
      return;
    }

    this.http.put(`/api/user/notifications/${notif.id}/read`, {}).subscribe({
      next: () => {
        notif.isRead = true;
        if (tooltip) tooltip.close();
        this.commonService.decNotificationCount(1);
      },
      error: () => {
        if (tooltip) tooltip.close();
      }
    });
  }

  markAsUnread(notif: AppNotification, tooltip?: NgbTooltip): void {
    if (!notif.isRead) {
      if (tooltip) tooltip.close();
      return;
    }

    this.http.put(`/api/user/notifications/${notif.id}/unread`, {}).subscribe({
      next: () => {
        notif.isRead = false;
        if (tooltip) tooltip.close();
        this.commonService.incNotificationCount(1);
      },
      error: () => {
        if (tooltip) tooltip.close();
      }
    });
  }

  /** Marks all unread notifications as read */
  markAllAsRead() {
    const isMentionsRoute = this.router.url.includes('/mentions');
    const unread = this.notifications.filter(n => !n.isRead && (isMentionsRoute ? n.eventType === 'MENTION' : n.eventType !== 'MENTION'));
    if (unread.length === 0) return;

    const requests = unread.map(n => this.http.put(`/api/user/notifications/${n.id}/read`, {}));

    // Execute all requests in parallel
    forkJoin(requests).subscribe({
      next: () => {
        unread.forEach(n => n.isRead = true);
        this.commonService.decNotificationCount(unread.length);
      },
      error: () => {
        // even if any call fails, still update UI optimistically
        unread.forEach(n => n.isRead = true);
      }
    });
  }

  acceptInvite(n: AppNotification) {
    if (!n.inviteToken) return;

    const confirmRef = this.modalService.open(ModalComponent, { centered: true });
    confirmRef.componentInstance.modalConfig = {
      type: 'careerApplyModal',
      header: 'Accept Invitation',
      message1: `Do you want to accept invitation from ${n.actorUserName} for project ${n.projectTitle}?`,
      btnName: 'Yes, Accept'
    } as any;

    confirmRef.result.then((result: any) => {
      if (result !== 'Yes, Accept') return;

      this.http.post(`/api/project-team/invites/${n.inviteToken}/accept`, {}, { responseType: 'text' }).subscribe({
        next: () => {
          n.isRead = true;
          n.inviteStatus = 'ACCEPTED';
          // Show success modal
          const modalRef: NgbModalRef = this.modalService.open(ModalComponent, {
            backdrop: 'static', size: 'md', centered: true
          });
          modalRef.componentInstance.modalConfig = {
            type: 'newSuccessModal',
            header: 'Invitation Accepted',
            message1: `You have successfully joined the project ${n.projectTitle}.`,
            btnName: 'OK'
          } as any;
        },
        error: () => {
          const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
          modalRef.componentInstance.modalConfig = {
            type: 'newErrorModal',
            header: 'Error',
            message1: `Failed to accept invitation. Please try again later.`,
            btnName: 'OK'
          } as any;
        }
      });
    }).catch(() => {});
  }

  rejectInvite(n: AppNotification) {
    if (!n.inviteToken) return;

    const confirmRef = this.modalService.open(ModalComponent, { centered: true });
    confirmRef.componentInstance.modalConfig = {
      type: 'careerApplyModal',
      header: 'Reject Invitation',
      message1: `Do you want to reject invitation for project ${n.projectTitle}?`,
      btnName: 'Yes, Reject'
    } as any;

    confirmRef.result.then((result: any) => {
      if (result !== 'Yes, Reject') return;

      this.http.post(`/api/project-team/invites/${n.inviteToken}/reject`, {}, { responseType: 'text' }).subscribe({
        next: () => {
          n.isRead = true;
          n.inviteStatus = 'DECLINED';
          const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
          modalRef.componentInstance.modalConfig = {
            type: 'newErrorModal',
            header: 'Invitation Declined',
            message1: `You have declined the invitation to join project ${n.projectTitle}.`,
            btnName: 'OK'
          } as any;
        },
        error: () => {
          const modalRef: NgbModalRef = this.modalService.open(ModalComponent, { centered: true });
          modalRef.componentInstance.modalConfig = {
            type: 'newErrorModal',
            header: 'Error',
            message1: `Failed to reject invitation. Please try again later.`,
            btnName: 'OK'
          } as any;
        }
      });
    }).catch(() => {});
  }

  /** Returns the message string with actor name and posting title wrapped in <span class="fw-bold"> */
  private boldifyMessage(msg: string, actor: string, title: string): string {
    const wrap = (t: string) => `<span class="fw-bold noti-card__title-link cur-p">${t}</span>`;
    let res = msg;
    if (actor) {
      // simple replace first occurrence only
      res = res.replace(actor, wrap(actor));
    }
    if (title) {
      res = res.replace(title, wrap(title));
    }
    return res;
  }

  /** Navigates to the profile page of the actor present inside a notification */
  viewProfile(n: AppNotification) {
    if (!n.actorUserName) return;

    // If we already resolved this username earlier, use the cached id
    if (this.userCache[n.actorUserName]) {
      this.fetchAndNavigate(this.userCache[n.actorUserName]);
      return;
    }

    const firstName = n.actorUserName.split(' ')[0];
    const roles = ['Student', 'Faculty', 'Moderator', 'Admin'];

    const tryRole = (idx: number) => {
      if (idx >= roles.length) return; // could not resolve

      const role = roles[idx];
      this.http.get(`/api/user/getUserDetails?role=${role}&name=${encodeURIComponent(firstName)}`).subscribe({
        next: (res: any) => {
          const list = Array.isArray(res?.data) ? res.data : res;
          if (Array.isArray(list) && list.length) {
            const matched = list.find((u: any) => {
              const fullName = `${u.firstName} ${u.lastName}`.trim().toLowerCase();
              return fullName === n.actorUserName.trim().toLowerCase();
            }) || list[0];

            if (matched && matched.userId) {
              this.userCache[n.actorUserName] = matched.userId;
              this.fetchAndNavigate(matched.userId);
            } else {
              tryRole(idx + 1);
            }
          } else {
            tryRole(idx + 1);
          }
        },
        error: () => tryRole(idx + 1)
      });
    };

    tryRole(0);
  }

  private fetchAndNavigate(userId: number) {
    this.videoService.getUserDetails(userId).subscribe({
      next: (res: any) => {
        const user = { ...res.data.orgDetail, ...res.data.userDetailResponseDTO };
        AuthUtils.setProfile(user);
        switch (res.data.userDetailResponseDTO.role) {
          case 'Student':
            this.router.navigate(['/home/student']);
            break;
          case 'Faculty':
            this.router.navigate(['/home/faculty']);
            break;
          case 'Moderator':
          case 'Admin':
            this.router.navigate(['/home/moderator']);
            break;
          default:
            this.router.navigate(['/home/student']);
        }
      }
    });
  }

  /** Handles clicks inside the rendered notification message (actor name / title links) */
  onMessageClick(event: MouseEvent, n: AppNotification) {
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('noti-card__title-link')) {
      const clickedText = target.textContent?.trim() || '';
      if (clickedText.toLowerCase() === (n.actorUserName || '').trim().toLowerCase()) {
        this.viewProfile(n);
      } else if (clickedText.toLowerCase() === (n.postingTitle || '').trim().toLowerCase()) {
        this.openResource(n);
      } else if (clickedText.startsWith('@')) {
        // Mention clicked – navigate to current user's My Account page
        this.router.navigate(['/user-profile/my-account']);
      }
      event.stopPropagation();
      // If the clicked text is posting title we could navigate to the posting page in future.
    }
  }

  private openResource(n: AppNotification) {
    // Mark notification as read when user opens the underlying resource
    this.markAsRead(n);

    if (!n.entityType || !n.entityId) return;

    const type = n.entityType.toUpperCase();

    if (type === 'BLOGS') {
      this.router.navigate(['/home/blog-details', n.entityId]);
      return;
    }

    if (type === 'VIDEOS') {
      // Fetch video details then open modal
      this.apiService.getPostingUserDetails(n.entityId).subscribe({
        next: (res: any) => {
          const data = res?.data || res;
          if (!data) return;
          const modalRef = this.modalService.open(VideoPreviewComponent, {
            backdrop: 'static', keyboard: true, size: 'lg', centered: true
          });
          modalRef.componentInstance.viewData = {
            ...data,
            _skipPhotoConversion: true // hint to component not to reconvert base64 if already string
          };
        }
      });
      return;
    }

    const showCareerModal = (component: any, item: any) => {
      const ref = this.modalService.open(component, { backdrop: 'static', keyboard: true, size: 'lg', centered: true });
      ref.componentInstance.viewData = item;
    };

    const fetchAndOpenCareer = (serviceMethod: any, modalComp: any) => {
      const payload = {
        page: 0,
        size: 10,
        filters: [{ field: 'id', operator: 'equals', value: n.entityId }]
      };
      serviceMethod.call(this.careerService, payload).subscribe({
        next: (res: any) => {
          const list = res?.data || [];
          if (list.length) {
            showCareerModal(modalComp, list[0]);
          }
        }
      });
    };

    if (type === 'INTERNSHIP') {
      fetchAndOpenCareer(this.careerService.getListInternships, InternshipModalComponent);
      return;
    }

    if (type === 'JOB') {
      fetchAndOpenCareer(this.careerService.getListJobs, JoblistingModalComponent);
      return;
    }

    if (type === 'PROJECT') {
      fetchAndOpenCareer(this.careerService.getListProjects, ProjectModalComponent);
      return;
    }

    if (type === 'CERTIFICATION') {
      fetchAndOpenCareer(this.careerService.getListCertificationsJobs, CertificationListingModalComponent);
      return;
    }
  }

  /** Resolves current accepted/declined status for a project invite */
  private resolveInviteStatus(n: AppNotification) {
    if (n.eventType !== 'PROJECT_INVITE' || !n.inviteToken) return;

    this.http.get(`/api/project-team/invites/${n.inviteToken}/status`, { responseType: 'text' })
      .subscribe({
        next: (status: any) => {
          const st = (status || '').toString().toUpperCase();
          if (st === 'ACCEPTED' || st === 'DECLINED') {
            n.inviteStatus = st as any;
          }
        }
      });
  }

  /** Handles click on the entire notification card */
  onCardClick(event: MouseEvent, n: AppNotification) {
    // Ignore clicks coming from action/other buttons, images, tooltip triggers, etc.
    const target = (event.target as HTMLElement) || null;
    if (!target) return;

    const ignoreSelectors = [
      'button',
      '.noti-card__project-action-btns',
      '.action-btn',
      'img',
      '.noti-card__img',
      '.noti-card__img-wrapper',
      '.noti-card__title-link',
      '.noti-card__text-content',
      'svg',
      'path',
      '.action-tooltip'
    ];
    for (const sel of ignoreSelectors) {
      if ((target as HTMLElement).closest(sel)) {
        return;
      }
    }

    this.openResource(n);
  }

  /** Clear (delete) a single notification */
  clear(notif: AppNotification, tooltip?: NgbTooltip): void {
    this.http.delete(`/api/user/notifications/${notif.id}/clear`).subscribe({
      next: () => {
        // Remove from array
        this.notifications = this.notifications.filter(n => n.id !== notif.id);
        if (!notif.isRead) this.commonService.decNotificationCount(1);
        tooltip?.close();
      },
      error: () => {
        tooltip?.close();
      }
    });
  }

  /** Clear all notifications for current user */
  clearAll(): void {
    const isMentionsRoute = this.router.url.includes('/mentions');
    const targets = this.notifications.filter(n => isMentionsRoute ? n.eventType === 'MENTION' : n.eventType !== 'MENTION');
    if (targets.length === 0) return;

    // If we're clearing all notifications (i.e., on All tab and no mention-specific filtering), use bulk endpoint
    if (!isMentionsRoute && targets.length === this.notifications.length) {
      this.http.delete('/api/user/notifications/clear-all').subscribe({
        next: () => {
          const unreadCount = this.notifications.filter(n => !n.isRead).length;
          this.notifications = [];
          if (unreadCount) this.commonService.decNotificationCount(unreadCount);
        }
      });
      return;
    }

    // Otherwise clear individually
    const requests = targets.map(n => this.http.delete(`/api/user/notifications/${n.id}/clear`));
    forkJoin(requests).subscribe({
      next: () => {
        const unreadCount = targets.filter(n => !n.isRead).length;
        this.notifications = this.notifications.filter(n => !targets.includes(n));
        if (unreadCount) this.commonService.decNotificationCount(unreadCount);
      }
    });
  }

  private formatCommentContent(raw: string): string {
    if (!raw) return '';
    // Replace @Name at start with bold span
    return raw.replace(/(^|\\s)@([A-Za-z][A-Za-z ]+)/g, (m, pre, name) =>
      `${pre}<span class=\\"fw-bold noti-card__title-link cur-p\\">@${name.trim()}</span>`
    );
  }

  /** Resolve a user's profile by full name and navigate */
  private navigateToProfileByName(fullName: string) {
    if (!fullName) return;

    // If we already found this user before, use cached id
    const cachedId = this.userCache[fullName.toLowerCase()];
    if (cachedId) {
      this.fetchAndNavigate(cachedId);
      return;
    }

    this.videoService.searchUsersByName(fullName).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res?.data) ? res.data : res;
        if (list && list.length) {
          const user = list[0];
          const id = user.userId || user.id;
          if (id) {
            this.userCache[fullName.toLowerCase()] = id;
            this.fetchAndNavigate(id);
          }
        }
      }
    });
  }
} 