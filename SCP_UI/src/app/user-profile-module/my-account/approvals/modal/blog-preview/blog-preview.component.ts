import { Component, Input, NgModule } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../../../common/common.service';
import { CommonModule, DatePipe } from '@angular/common';
import { ApproveModalComponent } from '../approve-modal/approve-modal.component';
import { RejectModalComponent } from '../reject-modal/reject-modal.component';

@Component({
  selector: 'app-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrl: './blog-preview.component.scss',
  standalone: true,
  imports: [CommonModule],
  providers: [DatePipe]
})
export class BlogPreviewComponent {
  @Input() viewData: any;

  constructor(
    private activeModal: NgbActiveModal,
    public commonService: CommonService,
    private datePipe: DatePipe,
    private modalService: NgbModal
  ) {}

  getProfilePhoto() {
    return this.commonService.convertTOBAse64Format(this.viewData.postedUser.profilePhoto);
  }

  getThumbnail() {
    return this.commonService.convertTOBAse64Format(this.viewData.blog.thumbnail);
  }

  getFormattedDate(date: string) {
    return this.datePipe.transform(date, 'd MMM y h:mm a');
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

  close() {
    this.activeModal.close();
  }

  viewProfile(data: any) {
    this.activeModal.close({ action: 'viewProfile', data: data });
  }
} 