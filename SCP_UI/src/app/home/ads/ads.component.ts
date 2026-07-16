import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VideoPreviewComponent } from '../videos/modals/video-preview/video-preview.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VideoService } from '../videos/service/video.service';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { SoftwareService } from '../softwares/service/software.service';
import { CareerService } from '../../careers-module/career.service';
import { InternshipModalComponent } from '../../careers-module/internships/modals/internship-modal.component';
import { ProjectModalComponent } from '../../careers-module/projects/project-modal/project-modal.component';
import { JoblistingModalComponent } from '../../careers-module/job-listings/joblisting-modal/joblisting-modal.component';
import { CertificationListingModalComponent } from '../../careers-module/certification-grid-view/certification-listing-modal/certification-listing-modal.component';
import { ApiService } from '../../shared/services/api.service';
import { catchError, forkJoin, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { CommonService } from '../../common/common.service';

@Component({
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrl: './ads.component.scss',
})
export class AdsComponent implements OnInit {
  videoList: any = [];
  blogList: any = [];
  softwareList: any = [];
  careerList: any = [];
  playerConfig = {
    controls: 0,
    mute: 1,
    autoplay: 0,
    rel: 0,
    start: 0,
  };
  constructor(
    public router: Router,
    public modalService: NgbModal,
    private videoService: VideoService,
    private softwareService: SoftwareService,
    private careerService: CareerService,
    private apiService: ApiService,
    public commonService: CommonService
  ) {}
  ngOnInit(): void {
    this.mergeApiCall();
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

  viewMore(type: any) {
    switch (type) {
      case 'Videos':
        this.router.navigate(['/home/videos']);
        break;
      case 'Blogs':
        this.router.navigate(['/home/blog']);
        break;
      case 'Software':
        this.router.navigate(['/home/software']);
        break;
      case 'Careers':
        this.router.navigate(['/careers']);
        break;
    }
  }

  playerStateChange(event: any, item: any) {
    event.target.pauseVideo();
    switch (event.data) {
      case 0:
        {
          this.openVideo(item);
        }
        break;
      case 1:
        {
          this.openVideo(item);
        }
        break;
      case 2:
        {
          this.openVideo(item);
        }
        break;
    }
  }

  openVideo(item: any) {
    const modalRef = this.modalService.open(VideoPreviewComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.viewData = item;
    modalRef.result.then((response) => {
      if (response) {
        this.modalService.dismissAll();
      }
    });
  }

  public handleVideoClick(item: any): void {
    // Create a deep copy of the item to avoid modifying the original
    const videoData = JSON.parse(JSON.stringify(item));

    // Add any missing properties required by the VideoPreviewComponent
    if (!videoData.playerConfig) {
      videoData.playerConfig = {
        controls: 1,
        mute: 0,
        autoplay: 1,
        rel: 0,
        enablejsapi: 1,
        playsinline: 1,
        showinfo: 0,
      };
    }

    if (!videoData.commentsArr) {
      videoData.commentsArr = [];
    }

    if (!videoData.liked) {
      videoData.liked = false;
    }

    if (!videoData.favoured) {
      videoData.favoured = false;
    }

    if (!videoData.views && videoData.views !== 0) {
      videoData.views = 0;
    }

    if (!videoData.likes && videoData.likes !== 0) {
      videoData.likes = 0;
    }

    if (!videoData.comments && videoData.comments !== 0) {
      videoData.comments = 0;
    }

    // IMPORTANT: Fix for the profile photo double conversion
    // If profile photo already has the base64 prefix, we pass it directly
    // This will prevent the convertTOBAse64Format method from adding another prefix
    if (videoData.postedUser && videoData.postedUser.profilePhoto) {
      // If it already starts with the base64 prefix, we use it directly
      if (
        videoData.postedUser.profilePhoto.startsWith(
          'data:image/jpeg;charset=utf-8;base64,'
        )
      ) {
        // The profile photo is already in the correct format, no need for conversion
        // in the template
        videoData._skipPhotoConversion = true;
      }
    }

    // Open the video preview modal
    const modalRef = this.modalService.open(VideoPreviewComponent, {
      backdrop: 'static',
      keyboard: true,
      windowClass: 'custom-size-modal',
      centered: true,
    });

    modalRef.result.then(
      (response) => {
        if (response) {
          // Handle modal close with response (if needed)
          // For example, reload data or update UI
        }
      },
      (reason) => {
        // Handle modal dismiss (if needed)
      }
    );

    // Pass the video data to the modal component
    modalRef.componentInstance.viewData = videoData;

    // Call viewPost method to increment views count (if needed)
    if (this.apiService && typeof this.apiService.viewPost === 'function') {
      this.apiService.viewPost(videoData.postingId).subscribe({
        next: () => {
          videoData.views += 1;
        },
        error: (err) => {
          console.error('Error incrementing view count:', err);
        },
      });
    }
  }

  viewProfile(item: any) {
    this.getUserDetails(item?.postedUser?.userId);
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

  navigateTo(item: any) {
    AuthUtils.setBlog(item);
    this.router.navigate(['home/blog-details', item.postingId]);
  }

  mergeApiCall() {
    let payload = {
      documentTypeEnum: 'SOFTWARE',
      filters: [],
      page: 0,
      size: 5,
    };
    let video = this.apiService.getVideos(0, 5).pipe(catchError((e) => of([])));
    let blog = this.videoService
      .getMyBlogs(0, 5)
      .pipe(catchError((e) => of([])));
    let software = this.softwareService
      .getAllSoftwares(payload)
      .pipe(catchError((e) => of([])));
    let career = this.careerService
      .getCareerList(0, 20)
      .pipe(catchError((e) => of([])));
    forkJoin([video, blog, software, career]).subscribe((res) => {
      this.videoList = res[0]?.data;
      this.blogList = res[1]?.data;
      this.softwareList = res[2]?.data;

      // Build a unified list of career items (internship, project, job, certification)
      const careerData = res[3]?.data;
      interface UnifiedCareer {
        type: 'internship' | 'project' | 'job' | 'certification';
        title: string;
        desc: string;
        companyLogo: any;
        coverPage: any;
        createdDate: string;
        dto: any; // original DTO for the modal
        days?: string;
      }

      const combined: UnifiedCareer[] = [];

      if (careerData && careerData.length) {
        careerData.forEach((career: any) => {
          const pushItem = (dto: any, type: 'internship'|'project'|'job'|'certification') => {
            if (!dto) return;
            combined.push({
              type,
              title: dto.title || dto.designation || 'Career',
              desc: dto.desc || dto.description || dto.shortDescription || '',
              companyLogo: dto.companyLogo,
              coverPage: dto.coverPage,
              createdDate: dto.createdDate,
              dto,
            });
          };

          pushItem(career.internshipResponseDTO, 'internship');
          pushItem(career.projectResponseDTO, 'project');
          pushItem(career.jobResponseDTO, 'job');
          pushItem(career.certificationResponseDTO, 'certification');
        });
      }

      combined.sort((a, b) => {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      });

      this.careerList = combined.slice(0, 5);

      // Add day difference for UI
      this.careerList = this.careerList.map((c: UnifiedCareer) => {
        return {
          ...c,
          days: this.commonService.getDateDiffInDHM(new Date(c.createdDate), new Date()),
        };
      });

      if (this.videoList && this.videoList.length) {
        this.videoList.map((val: any) => {
          val.days = this.commonService.getDateDiffInDHM(
            new Date(val.createdDate),
            new Date()
          );
          val.playerConfig = this.playerConfig;
          val.postedUser = {
            ...val.postedUser,
            profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.postedUser.profilePhoto}`,
          };
          return val;
        });
      }
      if (this.blogList && this.blogList.length) {
        this.blogList.map((val: any) => {
          val.days = this.commonService.getDateDiffInDHM(
            new Date(val.createdDate),
            new Date()
          );
          val.blog = {
            ...val.blog,
            thumbnail: `data:image/jpeg;charset=utf-8;base64,${val.blog.thumbnail}`,
          };
          val.postedUser = {
            ...val.postedUser,
            profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.postedUser.profilePhoto}`,
          };
          return val;
        });
      }
      if (this.softwareList && this.softwareList.length) {
        this.softwareList.map((val: any) => {
          val.days = this.commonService.getDateDiffInDHM(
            new Date(val.createdDate),
            new Date()
          );
          val.thumbnail = `data:image/jpeg;charset=utf-8;base64,${val.thumbnail}`;
        });
      }
    });
  }

  // Open correct modal based on career type
  public openCareer(item: any): void {
    let modalComponent: any;
    switch (item.type) {
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
      default:
        return;
    }

    const modalRef = this.modalService.open(modalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.viewData = item.dto;
  }

  getCareerDate(createdDate: string | null): string {
    if (!createdDate) return '';
    const result = this.commonService.getDateDiffInDHM(new Date(createdDate), new Date());
    return result || '';
  }
}
