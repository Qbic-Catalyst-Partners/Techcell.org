import { Component, OnInit } from '@angular/core';
import { UserprofileService } from '../service/userprofile.service';
import { AuthUtils } from '../../shared/utility/auth-utils';

@Component({
  selector: 'app-my-account',
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss',
})
export class MyAccountComponent implements OnInit {
  public accessTo: any;

  constructor(private userprofileService: UserprofileService) {}

  ngOnInit(): void {
    this.checkAccess();
  }

  checkAccess() {
    let data:any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.accessTo = userData?.userDetailResponseDTO.role;
  }
}
