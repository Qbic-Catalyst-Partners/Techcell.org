import { Component, OnInit } from '@angular/core';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';
import { FaculityCommunityMeta } from './faculityCommunityMeta';

@Component({
  selector: 'app-faculty-profile-view',
  templateUrl: './faculty-profile-view.component.html',
  styleUrl: './faculty-profile-view.component.scss'
})
export class FacultyProfileViewComponent implements OnInit{
  userInfo:any;
  profilePhoto:any;
  faculityCommunityHeader:any = [];
  faculityCommunityData:any = [];
  constructor(private apiService:ApiService){}
  ngOnInit(): void {
    let data:any = AuthUtils.getProfile();
    this.userInfo = JSON.parse(data);
    console.log(this.userInfo)
    this.profilePhoto = `data:image/jpeg;charset=utf-8;base64,${this.userInfo.profilePhoto}`;
    this.faculityCommunityHeader = FaculityCommunityMeta;
    this.getCommunity();
  }

  getCommunity(){
    this.apiService.getUserCommunityList(0,10,this.userInfo.userId).subscribe({
      next:(res)=>{
        const data = res.data.map((val:any)=>{
          return {...val,title:val.postCommunityResponseDTO.title,joinedDate:new DatePipe('en-US').transform(val.joinedDate, 'dd-MM-yyyy')}
        });
        this.faculityCommunityData = [...data];
      }
    });
  }
}
