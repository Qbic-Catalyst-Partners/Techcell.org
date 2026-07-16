import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../common/common.service';
import { CareerService } from '../../career.service';
import { ApiService } from '../../../shared/services/api.service';
import { HttpService } from '../../../shared/services/http.service';
import { ADMIN_ROLE, STUDENT_ROLE } from '../../../common/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { AuthUtils } from '../../../shared/utility/auth-utils';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent implements OnInit, AfterViewInit {
  @Input() viewData:any;
  @ViewChild('modalContent') modalContent!: ElementRef;
  role!:boolean;
  teamEmails: any[] = []; // holds objects {email, profilePhoto}
  tagItems: any[] = []; // suggestions objects
  currentUserEmail: string = '';
  emailInput: string = '';
  showSuggestions: boolean = false;
  get requiredMembers(): number {
    // total team size - 1 (for leader)
    return Math.max(0, (this.viewData?.teamSize || 1) - 1);
  }

  get isTeamComplete(): boolean {
    return this.teamEmails.length >= this.requiredMembers;
  }
  private searchTerm$ = new Subject<string>();
  constructor(
    private activeModal: NgbActiveModal,
    public commonService: CommonService,
    private careerService: CareerService,
    private apiService: ApiService,
    private http: HttpService,
    private modalService: NgbModal
  ){}
  ngOnInit(): void {
    this.role = [STUDENT_ROLE].includes(this.apiService.Role);

    // fetch logged-in user's email
    try {
      const raw = AuthUtils.getUserDetails();
      if (raw) {
        const parsed = JSON.parse(raw);
        this.currentUserEmail = parsed?.userDetailResponseDTO?.emailId || '';
      }
    } catch {}

    // set up search handler
    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(term => {
          if (!term || term.length < 2) return of([]);
          return this.http.get(`/api/user/searchUsersByEmail?query=${encodeURIComponent(term)}`);
        })
      )
      .subscribe((res: any) => {
        let list: any[] = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && Array.isArray(res.data)) {
          list = res.data;
        }
        this.tagItems = list.filter((u: any) =>
          (u.email || '').toLowerCase() !== this.currentUserEmail.toLowerCase()
        );
      });
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

    // Ensure tag-input takes full width (placeholder not clipped)
    this.debugTagInput();
    setTimeout(() => this.debugTagInput(), 500);
  }

  /** Ensure <tag-input> internal form element stretches to 100% */
  private debugTagInput() {
    const inputs = document.querySelectorAll('tag-input-form');
    inputs.forEach((el: any) => {
      (el as HTMLElement).style.width = '100%';
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

  onTextChange(text: any) {
    if (typeof text === 'string') {
      this.searchTerm$.next(text);
    }
  }

  onInput(event: any) {
    const val = event?.target?.value || '';
    this.onTextChange(val);
  }

  removeEmail(idx: number) {
    this.teamEmails.splice(idx, 1);
  }

  apply() {
    // validate team size
    if (!this.isTeamComplete) {
      const errorModal = this.modalService.open(ModalComponent, { centered: true });
      errorModal.componentInstance.modalConfig = {
        type: 'newErrorModal',
        header: 'Team Incomplete',
        message1: `Please add ${this.requiredMembers} team members before applying.`,
        btnName: 'OK'
      };
      return;
    }

    // Show the career apply modal first
    const modalRef = this.modalService.open(ModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.modalConfig = {
      type: 'careerApplyModal',
      header: 'Apply for Project',
      message1: `Are you sure you want to apply for ${this.viewData.title} project in ${this.viewData.companyName}?`,
      btnName: 'Yes, Apply'
    };

    // Handle the modal result
    modalRef.result.then((result) => {
      if (result === 'Yes, Apply') {
        // If user confirms, proceed with the actual application
        const emails = this.teamEmails.map((m: any) => m.email || m);
        let payload = {
          careerType: 'PROJECT',
          id: this.viewData.id,
          teamMemberEmails: emails
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
                message1: 'Your Application for project along with your profile have been sent to the organisation. Kindly wait for the response from team.',
                btnName: 'OK'
              };
              this.activeModal.close(true);
            }
          },
          error: (error: any) => {
            console.error('Error applying for project:', error);
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
              message1: 'Failed to apply for project. Please try again.',
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
      message1: 'You have already applied for this project. Please wait for the response from the organization.',
      btnName: 'OK'
    };
  }

  close() {
    this.activeModal.close();
  }

  // prevent adding leader's own email or duplicates
  onTagAdded(tag: any) {
    const email: string = (typeof tag === 'string' ? tag : tag?.value || tag)?.toLowerCase();
    if (!email) return;

    if (email === this.currentUserEmail.toLowerCase()) {
      // remove immediately
      const idx = this.teamEmails.findIndex(
        (e: any) => (e || '').toLowerCase() === email
      );
      if (idx > -1) this.teamEmails.splice(idx, 1);
      return;
    }

    // ensure uniqueness
    const duplicates = this.teamEmails.filter(
      (e: any) => (e || '').toLowerCase() === email
    );
    if (duplicates.length > 1) {
      // more than 1 means the newly added created duplicate; remove last one
      const lastIdx = this.teamEmails.lastIndexOf(tag);
      if (lastIdx > -1) this.teamEmails.splice(lastIdx, 1);
    }
  }

  /** Handle typing in custom input */
  onCustomInput(evt: any) {
    const val: string = (evt?.target?.value || '').trim();
    this.emailInput = val;
    this.onTextChange(val);
    this.showSuggestions = !!val;
  }

  /** Add email from input when Enter pressed */
  addEmailFromInput() {
    const email = this.emailInput.trim();
    if (!email) return;
    this.addEmail(email);
    this.emailInput = '';
    this.showSuggestions = false;
  }

  /** Click on suggestion */
  selectSuggestion(item: any) {
    this.addEmail(item);
    this.emailInput = '';
    this.showSuggestions = false;
  }

  /** core add logic (reuse validations from onTagAdded) */
  private addEmail(entry: any) {
    const emailStr: string = typeof entry === 'string' ? entry : entry.email;
    const lowerEmail = emailStr.toLowerCase();
    if (lowerEmail === this.currentUserEmail.toLowerCase()) return;

    if (this.teamEmails.some((e: any) => (e.email || e).toLowerCase() === lowerEmail)) {
      return;
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    if (!emailRegex.test(lowerEmail)) return;

    if (this.teamEmails.length >= this.requiredMembers) return;

    const obj = typeof entry === 'string'
      ? { email: entry, userId: null, profilePhoto: null }
      : {
          email: entry.email,
          userId: entry.userId,
          profilePhoto: entry.profilePhoto || null,
        };
    this.teamEmails.push(obj);

    // Fetch profile photo by userId if not provided
    if (!obj.profilePhoto && obj.userId) {
      this.apiService.getUserProfile(obj.userId).subscribe({
        next: (res: any) => {
          const userObj = res?.data?.userDetailResponseDTO || res?.data;
          const photoBytes = userObj?.profilePhoto;
          if (photoBytes) {
            obj.profilePhoto = photoBytes;
          }
        },
        error: () => {},
      });
    }
  }

  /** Placeholder resolver for member photo – replace when backend provides real image */
  getProfilePhoto(member: any): string {
    const photoBytes = member && member.profilePhoto;
    return photoBytes ? this.commonService.convertTOBAse64Format(photoBytes) : 'assets/images/profile-placeholder.png';
  }
}
