import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginWithOtpComponent } from '../login-with-otp/login-with-otp.component';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';
import { ModalComponent } from '../../shared/component/modal/modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from '../../shared/services/common.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { AuthenticationComponent } from '../authentication/authentication.component';
import { UserprofileService } from '../../user-profile-module/service/userprofile.service';
import { LoginModalComponent } from '../login-modal/login-modal.component';
import { LogoutModalComponent } from '../../shared/component/logout-modal/logout-modal.component';
import { BlogModalComponent } from '../../home/blog/modals/blog-modal/blog-modal.component';
import { AddVideoComponent } from '../../home/videos/modals/add-video/add-video.component';
import { AddSoftwareComponent } from '../../home/softwares/modals/add-software/add-software.component';
import { AddCommunityComponent } from '../../community-module/modals/add-community/add-community.component';
import { ResetPasswordComponent } from '../reset-password/reset-password.component';
import { CareerService } from '../../careers-module/career.service';
import { RazorpayPaymentComponent } from '../razorpayPayment/razorpayPayment.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit {
  public isSubmitted: boolean = false;
  public otpSetting: any;
  public forgetSetting: any;
  public resetSetting: any;

  loginResponse: any;

  email_pattern: string = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  isPwd: boolean = false;
  // otpSetting:any;
  // forgetSetting:any;
  // resetSetting:any;
  public carouselItem: any = [
    {
      itemName: 'INSTITUTIONS',
      img_url: '../../../assets/images/INSTITUTIONS.png',
      grident:
        'linear-gradient(270deg, #003A4D 15%, rgba(255, 255, 255, 0) 100%)',
      count: 0,
    },
    {
      itemName: 'MEMBERS',
      img_url: '../../../assets/images/MEMBERS.png',
      grident:
        'linear-gradient(270deg, #151616 15%, rgba(255, 255, 255, 0) 100%)',
      count: 0,
    },
    {
      itemName: 'COMMUNITIES',
      img_url: '../../../assets/images/COMMUNITIES.png',
      grident:
        'linear-gradient(270deg, #6B0E50 15%, rgba(255, 255, 255, 0) 100%)',
      count: 0,
    },
    {
      itemName: 'CAREERS ',
      img_url: '../../../assets/images/CAREERS.png',
      grident:
        'linear-gradient(270deg, #124505 15%, rgba(255, 255, 255, 0) 100%)',
      count: 0,
    },
  ];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    autoplay: true,
    autoplaySpeed: 800,
    autoplayTimeout: 1000,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 5000000,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      500: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 4,
      },
    },
    nav: true,
  };
  slidesStore: any = [1, 2, 3, 4];
  blog: any;
  community: any;
  software: any;
  videoo: any;
  careerData: any;
  playerConfig = {
    controls: 1,
    mute: 1,
    autoplay: 0,
    rel: 0,
    start: 0,
  };
  @ViewChild('video') videoElement: any;

  constructor(
    private _fb: FormBuilder,
    private apiService: ApiService,
    public modalService: NgbModal,
    private matDialog: MatDialog,
    public router: Router,
    public commonService: CommonService,
    private userProfileService: UserprofileService,
    private route: ActivatedRoute,
    private careerService: CareerService
  ) {}

  ngOnInit() {
    this.getLatestPost();
    this.getCounts();

    // const dialogRef = this.matDialog.open(LoginWithOtpComponent, {
    //   width: '360px',
    //   disableClose: true,
    //   panelClass: ['login-with-otp-dialog', 'login-with-otp-width'],
    //   data: { email: 'manjeshrv592@gmail.com' },
    // });
    // this.openLogoutModal();
    // this.openRazorpayPaymentModal();

    // Test newSuccessModal
    // this.testNewSuccessModal();

    // Play video automatically
    setTimeout(() => {
      const video = document.querySelector('video') as HTMLVideoElement;
      if (video) {
        video.muted = true;
        video.volume = 0;
        video.play();
      }
    }, 100);

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (!storedUser?.userDetailResponseDTO?.paymentReceived) {
      // Call logout here
      this.apiService.logOut().subscribe({
        next: () => {
          localStorage.clear(); // or use AuthUtils.clearSessionStorage() if available
          this.router.navigate(['/']);
        },
        error: () => {
          // Handle potential error, but still clear local storage and redirect
          localStorage.clear();
          this.router.navigate(['/']);
        },
      });
    }
  }

  ngAfterViewInit() {
    // Force video to play
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Video started playing
            console.log('Video started playing');
          })
          .catch((error) => {
            // Auto-play was prevented
            console.log('Video autoplay failed:', error);
            // Try playing again with user interaction
            video.muted = true;
            video.play();
          });
      }
    }
  }

  resetPassword() {
    const modalRef = this.modalService.open(ResetPasswordComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }

  openTestSuccessModal() {
    this.commonService.dialog('newLogoutModal', '', '', 'OK', 'Submitted');
  }

  openForgotPasswordModal() {
    this.matDialog.open(ForgetPasswordComponent, {
      disableClose: true,
      panelClass: ['forgot-password-dialog', 'forgot-password-width'],
    });
  }

  openLoginModal() {
    const modalRef = this.modalService.open(LoginModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }

  openAddSoftwareModal() {
    const modalRef = this.modalService.open(AddSoftwareComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
  }

  openAddVideoModal() {
    const modalRef = this.modalService.open(AddVideoComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
  }

  openAddBlogModal() {
    const modalRef = this.modalService.open(BlogModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
  }

  openAddCommunityModal() {
    const modalRef = this.modalService.open(AddCommunityComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
  }

  openAuthModal() {
    const modalRef = this.modalService.open(AuthenticationComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
  }

  navigateTo() {
    this.router.navigate(['/auth/register']);
  }

  getLatestPost() {
    this.apiService.getLatestPosting().subscribe({
      next: (res) => {
        console.log(res.data);
        this.blog = res.data.blog;
        this.community = res.data.community;
        this.software = res.data.software;
        this.videoo = res.data.video;

        // Get career data and find the latest post
        const careerData = res.data.career;
        interface CareerPost {
          type: 'certification' | 'project' | 'job' | 'internship';
          data: any;
        }
        let latestCareer: CareerPost | null = null;
        let latestDate: number | null = null;

        // Check certification
        if (careerData?.certificationResponseDTO?.createdDate) {
          const certDate = new Date(
            careerData.certificationResponseDTO.createdDate
          ).getTime();
          if (!latestDate || certDate > latestDate) {
            latestDate = certDate;
            latestCareer = {
              type: 'certification',
              data: careerData.certificationResponseDTO,
            };
          }
        }

        // Check project
        if (careerData?.projectResponseDTO?.createdDate) {
          const projectDate = new Date(
            careerData.projectResponseDTO.createdDate
          ).getTime();
          if (!latestDate || projectDate > latestDate) {
            latestDate = projectDate;
            latestCareer = {
              type: 'project',
              data: careerData.projectResponseDTO,
            };
          }
        }

        // Check job
        if (careerData?.jobResponseDTO?.createdDate) {
          const jobDate = new Date(
            careerData.jobResponseDTO.createdDate
          ).getTime();
          if (!latestDate || jobDate > latestDate) {
            latestDate = jobDate;
            latestCareer = { type: 'job', data: careerData.jobResponseDTO };
          }
        }

        // Check internship
        if (careerData?.internshipResponseDTO?.createdDate) {
          const internshipDate = new Date(
            careerData.internshipResponseDTO.createdDate
          ).getTime();
          if (!latestDate || internshipDate > latestDate) {
            latestDate = internshipDate;
            latestCareer = {
              type: 'internship',
              data: careerData.internshipResponseDTO,
            };
          }
        }

        this.careerData = latestCareer;
      },
    });
  }

  getCounts() {
    this.apiService.getLandingPageCounts().subscribe({
      next: (res) => {
        if (res.data) {
          this.carouselItem[0].count = res.data.institutionCount;
          this.carouselItem[1].count = res.data.studentCount;
          this.carouselItem[2].count = res.data.communityCount;
          this.carouselItem[3].count = res.data.careerCount || 0;
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

  getDays(date: any): any {
    let days = this.commonService.getDateDiffInDHM(new Date(date), new Date());
    return date ? days : '';
  }

  openLogoutModal() {
    const modalRef = this.modalService.open(LogoutModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }

  openRazorpayPaymentModal() {
    const modalRef = this.modalService.open(RazorpayPaymentComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
  }

  testNewSuccessModal() {
    this.commonService.dialog(
      'newErrorModal',
      'This is a test success message to check the styling of newSuccessModal',
      '',
      'Done',
      'Success'
    );
  }
}
