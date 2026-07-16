import { Component, OnInit } from '@angular/core';
import { AuthUtils } from '../../shared/utility/auth-utils';

@Component({
  selector: 'app-moderator-profile-view',
  templateUrl: './moderator-profile-view.component.html',
  styleUrl: './moderator-profile-view.component.scss'
})
export class ModeratorProfileViewComponent implements OnInit{
  userInfo:any;
  profilePhoto:any;
  ngOnInit(): void {
    let data:any = AuthUtils.getProfile();
    this.userInfo = JSON.parse(data);
    console.log(this.userInfo)
    this.profilePhoto = `data:image/jpeg;charset=utf-8;base64,${this.userInfo.profilePhoto}`
  }
}
