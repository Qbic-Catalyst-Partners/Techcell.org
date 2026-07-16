import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  CONTENT_SUBMENU,
  PROFILE_NAVIGATIONS,
} from '../constants/user-profile.constant';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { UserprofileService } from '../service/userprofile.service';

interface SubMenu {
  subMenuName: string;
  routing: string;
}

interface Menu {
  menuName: string;
  subMenu: SubMenu[];
  routing: string;
  visible?: boolean;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  public headerName = 'My Account';
  public userInfo: any;
  public subMenu: any = CONTENT_SUBMENU;
  public selectedSubmenu: number = 0;
  public isSubmenuOpened: boolean = false;
  public isCareerRoute: boolean = false;
  public studentMenu: Menu[] = [
    {
      menuName: 'My Account',
      subMenu: [],
      routing: '/user-profile/my-account',
    },
    {
      menuName: 'Payment Info',
      routing: '/user-profile/paymentInfo/payment-history',
      subMenu: [
        {
          subMenuName: 'Payment History',
          routing: '/user-profile/paymentInfo/payment-history',
        },
      ],
    },
    {
      menuName: 'Contents Published',
      routing: '/user-profile/content-published/blog',
      subMenu: [
        {
          subMenuName: 'Blogs',
          routing: '/user-profile/content-published/blog',
        },
        {
          subMenuName: 'Videos',
          routing: '/user-profile/content-published/video',
        },
        // {
        //   subMenuName: 'Communities',
        //   routing: '/user-profile/content-published/community',
        // },
      ],
    },
    {
      menuName: 'Careers',
      routing: '/user-profile/careers/internships',
      subMenu: [
        { subMenuName: 'Internships', routing: '/user-profile/careers/internships' },
        { subMenuName: 'Projects', routing: '/user-profile/careers/projects' },
        { subMenuName: 'Jobs', routing: '/user-profile/careers/jobs' },
        { subMenuName: 'Certifications', routing: '/user-profile/careers/certifications' },
      ],
    },
    {
      menuName: 'Help & Assistance',
      routing: '/user-profile/help-assistance/contactus',
      subMenu: [
        {
          subMenuName: 'Contact Us',
          routing: '/user-profile/help-assistance/contactus',
        },
        // {
        //   subMenuName: 'User Manual',
        //   routing: '/user-profile/help-assistance/usermanual',
        // },
        // {
        //   subMenuName: 'Privacy Policy',
        //   routing: '/user-profile/help-assistance/privacypolicy',
        // },
        // {
        //   subMenuName: 'Terms & Conditions',
        //   routing: '/user-profile/help-assistance/tnc',
        // },
      ],
    },
    {
      menuName: 'Resume',
      subMenu: [],
      routing: '/user-profile/resume',
    },
    
  ];

  public moderatorMenu: Menu[] = [
    {
      menuName: 'My Account',
      subMenu: [],
      routing: '/user-profile/my-account',
    },
    {
      menuName: 'Contents Published',
      routing: '/user-profile/content-published/blog',
      subMenu: [
        {
          subMenuName: 'Blogs',
          routing: '/user-profile/content-published/blog',
        },
        {
          subMenuName: 'Videos',
          routing: '/user-profile/content-published/video',
        },
        // {
        //   subMenuName: 'Communities',
        //   routing: '/user-profile/content-published/community',
        // },
      ],
    },
    {
      menuName: 'Approvals',
      subMenu: [],
      routing: '/user-profile/approval',
    },
    {
      menuName: 'Help & Assistance',
      routing: '/user-profile/help-assistance/contactus',
      subMenu: [
        {
          subMenuName: 'Contact Us',
          routing: '/user-profile/help-assistance/contactus',
        },
        // {
        //   subMenuName: 'User Manual',
        //   routing: '/user-profile/help-assistance/usermanual',
        // },
        // {
        //   subMenuName: 'Privacy Policy',
        //   routing: '/user-profile/help-assistance/privacypolicy',
        // },
        // {
        //   subMenuName: 'Terms & Conditions',
        //   routing: '/user-profile/help-assistance/tnc',
        // },
      ],
    },
  ];

  public adminMenu: Menu[] = [
    {
      menuName: 'My Account',
      subMenu: [],
      routing: '/user-profile/my-account',
    },
    {
      menuName: 'Contents Published',
      routing: '/user-profile/content-published/blog',
      subMenu: [
        {
          subMenuName: 'Blogs',
          routing: '/user-profile/content-published/blog',
        },
        {
          subMenuName: 'Videos',
          routing: '/user-profile/content-published/video',
        },
        // {
        //   subMenuName: 'Communities',
        //   routing: '/user-profile/content-published/community',
        // },
      ],
    },
    {
      menuName: 'Approvals',
      subMenu: [],
      routing: '/user-profile/approval',
    },
    {
      menuName: 'Management',
      subMenu: [
        { subMenuName: 'User Management', routing: '/user-profile/management' },
        { subMenuName: 'Corp Management', routing: '/user-profile/corp-management' },
      ],
      routing: '/user-profile/management',
    },
    {
      menuName: 'Help & Assistance',
      routing: '/user-profile/help-assistance/contactus',
      subMenu: [
        {
          subMenuName: 'Contact Us',
          routing: '/user-profile/help-assistance/contactus',
        },
        // { subMenuName: 'User Manual', routing: '/user-profile/help-assistance/usermanual' },
        // { subMenuName: 'Privacy Policy', routing: '/user-profile/help-assistance/privacypolicy' },
        // { subMenuName: 'Terms & Conditions', routing: '/user-profile/help-assistance/tnc' }
      ],
    },
  ];

  public facultyMenu: Menu[] = [
    {
      menuName: 'My Account',
      subMenu: [],
      routing: '/user-profile/my-account',
    },
    {
      menuName: 'Contents Published',
      routing: '/user-profile/content-published/blog',
      subMenu: [
        {
          subMenuName: 'Blogs',
          routing: '/user-profile/content-published/blog',
        },
        {
          subMenuName: 'Videos',
          routing: '/user-profile/content-published/video',
        },
        // {
        //   subMenuName: 'Communities',
        //   routing: '/user-profile/content-published/community',
        // },
      ],
    },
    {
      menuName: 'Help & Assistance',
      routing: '/user-profile/help-assistance/contactus',
      subMenu: [
        {
          subMenuName: 'Contact Us',
          routing: '/user-profile/help-assistance/contactus',
        },
        // {
        //   subMenuName: 'User Manual',
        //   routing: '/user-profile/help-assistance/usermanual',
        // },
        // {
        //   subMenuName: 'Privacy Policy',
        //   routing: '/user-profile/help-assistance/privacypolicy',
        // },
        // {
        //   subMenuName: 'Terms & Conditions',
        //   routing: '/user-profile/help-assistance/tnc',
        // },
      ],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO;

    // Set initial active menu based on current route
    this.setActiveMenuFromRoute(this.router.url);

    // Detect career route for padding
    this.isCareerRoute = this.router.url.includes('/user-profile/careers/');
    this.router.events.pipe(filter(ev => ev instanceof NavigationEnd)).subscribe((ev:any)=>{
      this.isCareerRoute = ev.urlAfterRedirects.includes('/user-profile/careers/');
    });

    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.setActiveMenuFromRoute(event.url);
    });
  }

  private setActiveMenuFromRoute(url: string) {
    let currentMenu: Menu | null = null;
    let currentSubmenuIndex = -1;
    let menuArray: Menu[] = [];

    // Select the appropriate menu array based on user role
    switch (this.userInfo?.role) {
      case 'Student':
        menuArray = this.studentMenu;
        break;
      case 'Moderator':
        menuArray = this.moderatorMenu;
        break;
      case 'Admin':
        menuArray = this.adminMenu;
        break;
      case 'Faculty':
        menuArray = this.facultyMenu;
        break;
    }

    // Find the current menu and submenu
    for (let i = 0; i < menuArray.length; i++) {
      const menu = menuArray[i];
      
      // Check if current URL matches main menu routing
      if (menu.routing === url) {
        currentMenu = menu;
        break;
      }
      
      // Check if current URL matches any submenu routing
      if (menu.subMenu && menu.subMenu.length) {
        const submenuIndex = menu.subMenu.findIndex((submenu) => submenu.routing === url);
        if (submenuIndex !== -1) {
          currentMenu = menu;
          currentSubmenuIndex = submenuIndex;
          break;
        }
      }
    }

    if (currentMenu) {
      this.headerName = currentMenu.menuName;
      currentMenu.visible = true;
      this.selectedSubmenu = currentSubmenuIndex;
      
      // Reset other menus
      menuArray.forEach((menu) => {
        if (menu.menuName !== currentMenu?.menuName) {
          menu.visible = false;
        }
      });
    }
  }

  toggleChilder(data: Menu) {
    this.headerName = data.menuName;
    data.visible = !data.visible;
    this.selectedSubmenu = 0;

    let menuArray: Menu[] = [];
    switch (this.userInfo?.role) {
      case 'Student':
        menuArray = this.studentMenu;
        break;
      case 'Moderator':
        menuArray = this.moderatorMenu;
        break;
      case 'Admin':
        menuArray = this.adminMenu;
        break;
      case 'Faculty':
        menuArray = this.facultyMenu;
        break;
    }

    menuArray.forEach((val) => {
      if (data.menuName != val.menuName) {
        val.visible = false;
      }
    });
  }
}
