import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../common/common.service';
import { CareerService } from '../../career.service';
import { ApiService } from '../../../shared/services/api.service';
import { ADMIN_ROLE, STUDENT_ROLE } from '../../../common/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/component/modal/modal.component';

@Component({
  selector: 'app-joblisting-modal',
  templateUrl: './joblisting-modal.component.html',
  styleUrl: './joblisting-modal.component.scss'
})
export class JoblistingModalComponent implements OnInit, AfterViewInit {
  @Input() viewData:any;
  @ViewChild('modalContent') modalContent!: ElementRef;
  role!:boolean;
  constructor(
    private activeModal: NgbActiveModal,
    public commonService: CommonService,
    private careerService: CareerService,
    private apiService: ApiService,
    private modalService: NgbModal
  ){}
  ngOnInit(): void {
    this.role = [STUDENT_ROLE].includes(this.apiService.Role);
  }

  ngAfterViewInit() {
    // Wait for images to load
    const images = this.modalContent.nativeElement.getElementsByTagName('img');
    let loadedImages = 0;
    const totalImages = images.length;

    if (totalImages === 0) {
      this.scrollToTop();
      return;
    }

    Array.from(images).forEach((img: any) => {
      if (img.complete) {
        loadedImages++;
        if (loadedImages === totalImages) {
          this.scrollToTop();
        }
      } else {
        img.onload = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            this.scrollToTop();
          }
        };
        img.onerror = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            this.scrollToTop();
          }
        };
      }
    });
  }

  private scrollToTop() {
    setTimeout(() => {
      const modalContent = this.modalContent.nativeElement;
      if (modalContent) {
        modalContent.scrollTop = 0;
      }
    }, 0);
  }

  apply() {
    // Show the career apply modal first
    const modalRef = this.modalService.open(ModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.modalConfig = {
      type: 'careerApplyModal',
      header: 'Apply for Job',
      message1: `Are you sure you want to apply for ${this.viewData.designation} position in ${this.viewData.companyName}?`,
      btnName: 'Yes, Apply'
    };

    // Handle the modal result
    modalRef.result.then((result) => {
      if (result === 'Yes, Apply') {
        // If user confirms, proceed with the actual application
        let payload = {
          careerType: 'JOB',
          id: this.viewData.jobId,
          teamMembersUserId: []
        };
        this.careerService.applyInternship(payload).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.viewData.applied = true;
              // Close all modals first
              this.modalService.dismissAll();
              
              // Show success modal
              const successModalRef = this.modalService.open(ModalComponent, {
                backdrop: 'static',
                keyboard: true,
                size: 'md',
                centered: true,
              });
              successModalRef.componentInstance.modalConfig = {
                type: 'newSuccessModal',
                header: 'Application Submitted Successfully',
                message1: 'Your Application for job along with your profile have been sent to the organisation. Kindly wait for the response from team.',
                btnName: 'OK'
              };
              this.activeModal.close(true);
            }
          },
          error: (error: any) => {
            console.error('Error applying for job:', error);
            // Close all modals first
            this.modalService.dismissAll();
            
            // Show error modal
            const errorModalRef = this.modalService.open(ModalComponent, {
              backdrop: 'static',
              keyboard: true,
              size: 'md',
              centered: true,
            });
            errorModalRef.componentInstance.modalConfig = {
              type: 'newErrorModal',
              header: 'Error',
              message1: 'Failed to apply for job. Please try again.',
              btnName: 'OK'
            };
          }
        });
      }
    });
  }

  showAlreadyAppliedMessage() {
    const errorModalRef = this.modalService.open(ModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    errorModalRef.componentInstance.modalConfig = {
      type: 'newErrorModal',
      header: 'Already Applied',
      message1: 'You have already applied for this job position. Please wait for the response from the organization.',
      btnName: 'OK'
    };
  }

  close() {
    this.activeModal.close();
  }
}
