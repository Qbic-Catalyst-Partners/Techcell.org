import { Component, OnInit } from '@angular/core';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { ActivatedRoute, Router } from '@angular/router';
import { CommunityService } from '../service/community.service';
import { ApiService } from '../../shared/services/api.service';
import { CommonService } from '../../common/common.service';
import { VideoService } from '../../home/videos/service/video.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AssignModeratorComponent } from '../modals/assign-moderator/assign-moderator.component';
import { ADMIN_ROLE } from '../../common/constants';

@Component({
  selector: 'app-community-home',
  templateUrl: './community-home.component.html',
  styleUrl: './community-home.component.scss'
})
export class CommunityHomeComponent implements OnInit{
  currentCommunity:any;
  userInfo:any;
  communityMembers:any = [];
  communityId:any;
  term!:string;
  showExit!: boolean;
  isModerator: boolean = false;
  role: boolean = false;
  constructor(public router: Router,
    private activateRoute : ActivatedRoute,
    private communityService :CommunityService,
    private apiService: ApiService,
    public commonService : CommonService,
    private videoService:VideoService,
    public modalService: NgbModal,){}
  ngOnInit(): void {
    let data:any = AuthUtils.getUserDetails();
    this.userInfo = JSON.parse(data);
    this.communityId = this.activateRoute.snapshot.params['communityId'];
    this.getPostingUserDetails(this.communityId);
    this.isModerator = this.apiService.Role === 'Moderator';
    this.role = this.apiService.Role != ADMIN_ROLE;
    this.showExit = this.role && !this.isModerator;
  }

  getCommunityMembers(){
    this.communityService.getCommunityMembers(this.currentCommunity?.community?.id).subscribe({
      next:(res)=>{
        this.communityMembers = res.data.map((val:any)=>{ 
          return {...val,profilePhoto:`data:image/jpeg;charset=utf-8;base64,${val?.profilePhoto}`,name:`${val.firstName} ${val.lastName}`}
        });
      }
    });
  }

  getPostingUserDetails(id:any){
    this.apiService.getPostingUserDetails(id).subscribe({
      next:(res)=>{
        this.currentCommunity = res.data;
        // AuthUtils.setCommunity(this.currentCommunity);
        this.getCommunityMembers();
      }
    });
  }

  viewProfile(item:any){
    this.getUserDetails(item?.userId)
  }

  getUserDetails(id:any){
    this.videoService.getUserDetails(id).subscribe({
      next:(res)=>{
        let user ={...res.data.orgDetail,...res.data.userDetailResponseDTO}
        AuthUtils.setProfile(user);
        switch(res.data.userDetailResponseDTO.role) {
          case 'Student':
            this.router.navigate(['/home/student']);
            break;
          case 'Faculty':
            this.router.navigate(['/home/faculty']);
            break;
          case 'Moderator':
            this.router.navigate(['/home/moderator']);
            break;
        }
      }
    });
  }

  assignMod(){
      const modalRef = this.modalService.open(AssignModeratorComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'md',
        centered: true,
      });
      modalRef.componentInstance.communityRecords = this.currentCommunity;
      modalRef.result.then((response) => {
        if (response) {
          this.getPostingUserDetails(this.communityId)
        }
      });
  }

}
