import { Component, OnInit } from '@angular/core';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { ApiService } from '../../shared/services/api.service';
import { CommunityService } from '../../community-module/service/community.service';
import { Router } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { CommonService } from '../../shared/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InternshipModalComponent } from '../../careers-module/internships/modals/internship-modal.component';
import { ProjectModalComponent } from '../../careers-module/projects/project-modal/project-modal.component';
import { JoblistingModalComponent } from '../../careers-module/job-listings/joblisting-modal/joblisting-modal.component';
import { CertificationListingModalComponent } from '../../careers-module/certification-grid-view/certification-listing-modal/certification-listing-modal.component';
import { VideoPreviewComponent } from '../videos/modals/video-preview/video-preview.component';
import { RazorpayPaymentComponent } from '../../user-module/razorpayPayment/razorpayPayment.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  userInfo: any;
  profilePhoto: any;
  clgName: any;
  contentList: any = [];
  appliedCarrierList: any = [];
  counts: any;
  constructor(
    private apiService: ApiService,
    private communityService: CommunityService,
    public router: Router,
    public commonService: CommonService,
    public modalService: NgbModal
  ) {}

  public communityList: any = [
    { name: 'Python Developers Community' },
    { name: 'SAP Community' },
    { name: 'UI|UX Community' },
    { name: 'IOT Community' },
    { name: 'Agile and Lean Software Community' },
  ];

  public courseList: any = [
    { name: 'UI | UX design' },
    { name: 'Java & C++' },
    { name: 'PegaSystems' },
    { name: 'Full Stack Development' },
    { name: 'DevOps' },
  ];

  public certificationList: any = [
    { name: 'CompTIA Network+' },
    { name: 'Google Cloud Digital Leader' },
    { name: 'GIAC Security' },
    { name: 'Certified Ethical Hacker (CEH)' },
    { name: 'AWS Cloud Practitioner' },
  ];

  favouriteList: any = [];

  cardClick(cardType: any) {
    // console.log(cardType);
  }

  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO;

    let photo = this.userInfo?.profilePhoto;
    this.clgName = userData?.orgName;

    if (photo) {
      this.profilePhoto = `data:image/jpeg;charset=utf-8;base64,${photo}`;
    }
    this.mergeApiCall();
    // this.openRazorpayPaymentModal();
  }

  viewMore(type: any) {
    switch (type) {
      case 'Community':
        this.router.navigate(['/community']);
        break;
      case 'Career':
      case 'Careers':
        this.router.navigate(['/careers']);
        break;
      case 'Content':
      case 'Contents':
        this.router.navigate(['/user-profile/content-published/blog']);
        break;
    }
  }

  openRazorpayPaymentModal() {
    const modalRef = this.modalService.open(RazorpayPaymentComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }

  /** navigate to community home */
  openCommunity(comm: any): void {
    const id = comm?.postingId || comm?.postCommunityResponseDTO?.postingId || comm?.postCommunityResponseDTO?.id || comm?.id;
    if (id) {
      this.router.navigateByUrl('/community/home/' + id);
    }
  }

  /** open correct career modal for applied career item */
  openCareer(item: any): void {
    let type: 'internship' | 'project' | 'job' | 'certification' | null = null;
    let dto: any = null;
    if (item.internshipResponseDTO) {
      type = 'internship';
      dto = item.internshipResponseDTO;
    } else if (item.projectResponseDTO) {
      type = 'project';
      dto = item.projectResponseDTO;
    } else if (item.jobResponseDTO) {
      type = 'job';
      dto = item.jobResponseDTO;
    } else if (item.certificationResponseDTO) {
      type = 'certification';
      dto = item.certificationResponseDTO;
    }
    if (!dto) return;

    let modalComponent: any;
    switch (type) {
      case 'internship':
        modalComponent = InternshipModalComponent;
        break;
      case 'project':
        modalComponent = ProjectModalComponent;
        break;
      case 'job':
        modalComponent = JoblistingModalComponent;
        break;
      case 'certification':
        modalComponent = CertificationListingModalComponent;
        break;
    }
    if (modalComponent) {
      const modalRef = this.modalService.open(modalComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        centered: true,
      });
      modalRef.componentInstance.viewData = dto;
    }
  }

  /** open content depending on type */
  openContent(content: any): void {
    if (content.blog) {
      AuthUtils.setBlog(content);
      this.router.navigate(['home/blog-details', content.postingId]);
    } else if (content.video) {
      // reuse modal from ads
      const modalRef = this.modalService.open(VideoPreviewComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        centered: true,
      });
      // ensure playerConfig
      if (!content.playerConfig) {
        content.playerConfig = {
          controls: 1,
          mute: 0,
          autoplay: 0,
          rel: 0,
          enablejsapi: 1,
          playsinline: 1,
          showinfo: 0,
        };
      }
      modalRef.componentInstance.viewData = content;
    }
  }

  mergeApiCall() {
    let fav = this.apiService
      .getMyFavouriteTagList()
      .pipe(catchError((e) => of([])));
    let community = this.communityService
      .getMyCommunity(0, 5)
      .pipe(catchError((e) => of([])));
    let content = this.apiService
      .getContentList(0, 20)
      .pipe(catchError((e) => of([])));
    let CarrerList = this.apiService
      .getAppliedCarrerList(0, 5)
      .pipe(catchError((e) => of([])));
    let count = this.apiService
      .getHomePageCounts()
      .pipe(catchError((e) => of([])));
    forkJoin([fav, community, content, CarrerList, count]).subscribe((res) => {
      this.favouriteList = res[0]?.data;
      this.communityList = res[1]?.data;
      const activeContents = (res[2]?.data || []).filter(
        (c: any) => c.status === 'Active'
      );
      this.contentList = activeContents
        .sort(
          (a: any, b: any) =>
            new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        )
        .slice(0, 5);
      this.appliedCarrierList = res[3]?.data;
      this.counts = res[4]?.data;
    });
  }

  public navigateTo(item: any): void {
    item === 'tnc'
      ? this.commonService.openTermsAndConditionsWindow()
      : this.commonService.openPrivacyPolicyWindow();
  }

  // log(comm: any): string {
  //   console.log(comm?.postCommunityResponseDTO?.id);
  //   return ''; // To prevent unnecessary UI rendering
  // }
}
