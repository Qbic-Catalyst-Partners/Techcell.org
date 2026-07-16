import { Component, OnInit } from '@angular/core';
import { ApprovalMeta } from './approvalMeta';
import { UserprofileService } from '../../service/userprofile.service';
import { ApproveModalComponent } from './modal/approve-modal/approve-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RejectModalComponent } from './modal/reject-modal/reject-modal.component';
import { CommonService } from '../../../shared/services/common.service';
import { VideoPreviewComponent } from '../../../home/videos/modals/video-preview/video-preview.component';
import { BlogPreviewComponent } from './modal/blog-preview/blog-preview.component';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrl: './approvals.component.scss',
})
export class ApprovalsComponent implements OnInit {
  approvalHeader: any = [];
  approvalData: any = [];

  constructor(
    private userprofileService: UserprofileService,
    public commonService: CommonService,
    public modalService: NgbModal
  ) {}
  ngOnInit(): void {
    this.approvalHeader = ApprovalMeta;
    this.getMyTagList();

    // this.commonService.dialog(
    //   'newErrorModal',
    //   'Got it! This content will not be published!',
    //   '',
    //   'OK',
    //   'Content Rejected'
    // );
  }

  getPendingList(tagList: number) {
    this.userprofileService.getPendingApproved(0, tagList).subscribe({
      next: (res: any) => {
        this.approvalData = res.data.map((val: any) => {
          return {
            ...val,
            taggings: val.postingTags
              .map((each: any) => each?.hashTag?.text)
              .join(','),
            name: val.postedUser.firstName + ' ' + val.postedUser.lastName,
            role: val.postedUser.role,
          };
        });
        console.log(this.approvalData);
      },
      error: (err: any) => {},
    });
  }

  getMyTagList() {
    this.userprofileService.getMyCommunityTagList().subscribe({
      next: (res: any) => {
        this.getPendingList(res?.data?.id);
      },
      error: (err: any) => {},
    });
  }

  getAction(action: any) {
    console.log(action);
    switch (action.type) {
      case 'Preview':
        this.openPreviewModal(action.data);
        break;
      case 'Approve':
        this.approveModal(action.data);
        break;
      case 'Reject':
        this.rejectModal(action.data);
        break;
      default:
        console.log('default');
    }
  }

  openPreviewModal(data: any) {
    let modalRef;
    if (data.postType === 'Videos') {
      modalRef = this.modalService.open(VideoPreviewComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        centered: true,
      });
      modalRef.componentInstance.viewData = data;
      modalRef.componentInstance.isApprovalView = true;
    } else if (data.postType === 'Blogs') {
      modalRef = this.modalService.open(BlogPreviewComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        centered: true,
      });
      modalRef.componentInstance.viewData = data;
    }

    if (modalRef) {
      modalRef.result.then((result) => {
        if (result) {
          switch (result.action) {
            case 'approve':
              this.approvePost(result.data);
              break;
            case 'reject':
              this.rejectPost(result.data, result.reason);
              break;
          }
        }
      });
    }
  }

  approvePost(item: any) {
    let payload = {
      objectStatus: 'APPROVED',
      postingId: item.postingId,
    };
    let sucessPopup = {
      type: 'SucessWithBody',
      message1: 'Good work! the content will be visible on the portal now.',
      message2: '',
      btnName: 'OK',
      header: 'Approved Successfully',
    };
    this.userprofileService.approveRejectPost(payload).subscribe({
      next: (res: any) => {
        this.getMyTagList();
        this.commonService.dialog(
          'newSuccessModal',
          'Good work! the content will be visible on the portal now.',
          '',
          'OK',
          'Approved Successfully'
        );
      },
      error: (err: any) => {},
    });
  }

  rejectPost(item: any, reason: string) {
    let payload = {
      objectStatus: 'REJECTED',
      postingId: item.postingId,
      reason: reason
    };
    this.userprofileService.approveRejectPost(payload).subscribe({
      next: (res: any) => {
        this.getMyTagList();
        this.commonService.dialog(
          'newErrorModal',
          'Got it! This content will not be published!',
          '',
          'OK',
          'Content Rejected'
        );
      },
      error: (err: any) => {},
    });
  }

  approveModal(item: any) {
    const modalRef = this.modalService.open(ApproveModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.approvePost(item);
      }
    });
  }

  rejectModal(item: any) {
    const modalRef = this.modalService.open(RejectModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.result.then((reason: string) => {
      if (reason) {
        this.rejectPost(item, reason);
      }
    });
  }
}
