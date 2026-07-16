import { Component, OnInit } from '@angular/core';
import { CommunityMeta } from './communityMeta';
import { CommunityService } from '../../../community-module/service/community.service';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthUtils } from '../../../shared/utility/auth-utils';

@Component({
  selector: 'app-moderator-communities',
  templateUrl: './moderator-communities.component.html',
  styleUrl: './moderator-communities.component.scss'
})
export class ModeratorCommunitiesComponent implements OnInit{
  communityHeader:any = [];
  communityData:any = [];
  page:number =0;
  userInfo:any;
  constructor(
    private communityService :CommunityService,
    public router: Router,
    private route: ActivatedRoute
  ){}
  ngOnInit(): void {
    this.communityHeader = CommunityMeta;
    this.page = 0;
    
    // Check if we're in the user's own content section or viewing someone else's profile
    const currentUrl = this.router.url;
    const isUserProfile = currentUrl.includes('/user-profile/content-published');
    
    if (isUserProfile) {
      // For user's own content section, use logged in user's details
      let data:any = AuthUtils.getUserDetails();
      this.userInfo = JSON.parse(data);
    } else {
      // For viewing other profiles, use the profile being viewed
      let data:any = AuthUtils.getProfile();
      this.userInfo = JSON.parse(data);
    }
    
    console.log(this.userInfo)
    this.getCommunity();
  }

  navigate(item:any){
    this.router.navigateByUrl('/community/home/'+item.postingId);
  }

  getCommunity(): void {
    this.communityService.getOnlyCommunityList(this.page,this.userInfo.userId).subscribe({
      next:(res:any)=>{
        this.communityData = this.communityData.concat(res.data.map((val: any,index:number) => {
          val.seq = index + 1; 
          val.createdDate = new DatePipe('en-US').transform(val.createdDate, 'dd/MM/yyyy');
          val.role = val.postedUser.role
          return val;
        }));
        console.log(this.communityData);
      },
        error:(err:any)=>{

        }
    });
  }

  apiCalled(event:any){
    this.page++;
    this.getCommunity();
  }
}
