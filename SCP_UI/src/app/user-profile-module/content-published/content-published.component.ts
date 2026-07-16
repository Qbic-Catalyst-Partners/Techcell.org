import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { UserprofileService } from '../service/userprofile.service';
import {
  CONTENT_SUBMENU,
  PROFILE_NAVIGATIONS,
} from '../constants/user-profile.constant';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content-published',
  templateUrl: './content-published.component.html',
  styleUrl: './content-published.component.scss',
})
export class ContentPublishedComponent {
  public currentSubmenu: string = '';
  private subscription$!: Subscription;
  constructor(private userprofileService: UserprofileService) {}

  ngOnInit(): void {
    this.loadSubMenus();
  }

  public loadSubMenus(): void {
    this.subscription$ = this.userprofileService
      .getSubMenuData()
      .subscribe((data: any) => {
        this.currentSubmenu = data;
      });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
