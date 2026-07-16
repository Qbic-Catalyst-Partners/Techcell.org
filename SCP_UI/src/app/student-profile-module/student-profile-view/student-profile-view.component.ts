import { Component, OnInit } from '@angular/core';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { StudentCommunityMeta } from './studentCommunityMeta';
import { ApiService } from '../../shared/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-student-profile-view',
  templateUrl: './student-profile-view.component.html',
  styleUrl: './student-profile-view.component.scss'
})
export class StudentProfileViewComponent implements OnInit{
  userInfo:any;
  profilePhoto:any;
  studentCommunityHeader:any = [];
  studentCommunityData:any = [];
  constructor(private apiService:ApiService){}
  ngOnInit(): void {
    let data:any = AuthUtils.getProfile();
    this.userInfo = JSON.parse(data);
    console.log(this.userInfo)
    this.profilePhoto = `data:image/jpeg;charset=utf-8;base64,${this.userInfo.profilePhoto}`;
    this.studentCommunityHeader = StudentCommunityMeta;
    this.getCommunity();
  }

  getCommunity(){
    this.apiService.getUserCommunityList(0,10,this.userInfo.userId).subscribe({
      next:(res)=>{
        const data = res.data.map((val:any)=>{
          return {...val,title:val.postCommunityResponseDTO.title,joinedDate:new DatePipe('en-US').transform(val.joinedDate, 'dd-MM-yyyy')}
        });
        this.studentCommunityData = [...data];
      }
    });
  }

}
