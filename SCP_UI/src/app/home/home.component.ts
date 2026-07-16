import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { DatePipe } from '@angular/common';
import { VideoService } from './videos/service/video.service';
import { catchError, forkJoin, of } from 'rxjs';
import { SoftwareService } from './softwares/service/software.service';
import { CareerService } from '../careers-module/career.service';
import { UserprofileService } from '../user-profile-module/service/userprofile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WelcomeModalComponent } from '../shared/component/welcome-modal/welcome-modal.component';
import { AuthUtils } from '../shared/utility/auth-utils';
import { CommonService } from '../shared/services/common.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  page: number = 0;
  size: number = 5;
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
  api1called: boolean = false;
  api2called: boolean = false;
  postingList: any = [];
  constructor(
    private apiService: ApiService,
    public modalService: NgbModal,
    public commonService: CommonService,
    private userprofileService: UserprofileService
  ) {}
  ngOnInit(): void {
    this.getPostingListUsingFavTag();
    this.checkWelcomeScreen();
    // this.commonService.dialog(
    //   'newSuccessModal',
    //   'Good work! the content will be visible on the portal now.',
    //   '',
    //   'Ok',
    //   'Approved Successfully'
    // );
  }

  getDateDiffInDHM(startDate: any, endDate: any) {
    const diffMs = Math.abs(endDate.getTime() - startDate.getTime());
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes - days * 24 * 60) / 60);
    const minutes = totalMinutes - days * 24 * 60 - hours * 60;
    if (days > 7) {
      return new DatePipe('en-US').transform(startDate, 'd MMM yyyy');
    }
    return days
      ? days + ' ' + 'days' + ' ago'
      : null || hours
      ? hours + ' ' + 'Hours' + ' ago'
      : null || minutes
      ? minutes + ' ' + 'Min' + ' ago'
      : null;
  }

  getPostingList() {
    this.apiService.getPostingList(0, 5).subscribe({
      next: (response: any) => {
        this.api2called = true;
        this.postingList = this.postingList.concat(
          response.data.map((val: any, index: any) => {
            if (val.postType == 'Videos') {
              val.playerConfig = this.playerConfig;
            }
            if (val.postType == 'Blogs') {
              val.blog = {
                ...val?.blog,
                thumbnail: `data:image/jpeg;charset=utf-8;base64,${val?.blog?.thumbnail}`,
              };
            }
            if (val.postType == 'Community') {
              val.community = {
                ...val?.community,
                coverPhoto: `data:image/jpeg;charset=utf-8;base64,${val?.community?.coverPhoto}`,
                profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val?.community?.profilePhoto}`,
              };
            }
            val.postedUser = {
              ...val.postedUser,
              profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.postedUser.profilePhoto}`,
            };
            val.seq = index + 1;
            val.commentsArr = [];
            return val;
          })
        );
        this.page = this.page + 1;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  public openWelcomeModal() {
    const modalRef = this.modalService.open(WelcomeModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
  }

  checkWelcomeScreen() {
    const userData = AuthUtils.getUserDetails();

    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        if (
          parsedUserData?.userDetailResponseDTO?.welcomeScreenShow === false
        ) {
          this.openWelcomeModal();
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }

  getPostingListUsingFavTag() {
    let res: any = [];
    this.apiService.getPostingListUsingFavTag(0, 5).subscribe({
      next: (response: any) => {
        res = response.data;
        this.api1called = true;
        if (res.length == 0) {
          this.getPostingList();
        }
        this.postingList = this.postingList.concat(
          response.data.map((val: any, index: any) => {
            if (val.postType == 'Videos') {
              val.playerConfig = this.playerConfig;
            }
            if (val.postType == 'Blogs') {
              val.blog = {
                ...val?.blog,
                thumbnail: `data:image/jpeg;charset=utf-8;base64,${val?.blog?.thumbnail}`,
              };
            }
            if (val.postType == 'Community') {
              val.community = {
                ...val?.community,
                coverPhoto: `data:image/jpeg;charset=utf-8;base64,${val?.community?.coverPhoto}`,
                profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val?.community?.profilePhoto}`,
              };
            }
            (val.postedUser = {
              ...val.postedUser,
              profilePhoto: `data:image/jpeg;charset=utf-8;base64,${val.postedUser.profilePhoto}`,
            }),
              (val.seq = index + 1);
            val.commentsArr = [];
            return val;
          })
        );
      },
      error: (err: any) => {
        // console.log(err);
      },
    });
  }
}
