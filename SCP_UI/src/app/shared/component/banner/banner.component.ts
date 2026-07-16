import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LogoutModalComponent } from '../logout-modal/logout-modal.component';
import { AuthUtils } from '../../utility/auth-utils';
import { CommonService } from '../../services/common.service';
import { WelcomeModalComponent } from '../welcome-modal/welcome-modal.component';
import { WebSocketService } from '../../services/websocket.service';
import { HttpService } from '../../services/http.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent implements OnInit {
  public activeMenu: string = '/home';
  public width: number = window.innerWidth;
  public isMobile: boolean = false;
  public mobileWidth: number = 575;
  public filteredRoutingList: any = [];
  public routingList: any = [
    { routingName: 'Home', url: '/home', icon: 'Homes' },
    { routingName: 'Communities', url: '/community', icon: 'Communities' },
    { routingName: 'Blogs', url: '/home/blog', icon: 'Blogs' },
    { routingName: 'Videos', url: '/home/videos', icon: 'Videoss' },
    { routingName: 'Software', url: '/home/software', icon: 'Softwares' },
    { routingName: 'Careers', url: '/careers', icon: 'Careers' },
    {
      routingName: 'Notifications',
      url: '/notifications',
      icon: 'notification',
    },
  ];

  public profilePhoto: any;
  public hovered: boolean = false;
  public notificationCount = 0;
  private seenNotificationIds = new Set<number>();

  constructor(
    private router: Router,
    public modalService: NgbModal,
    private commonService: CommonService,
    private webSocketService: WebSocketService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    // Fetch unread notification count initially
    this.http.get('/api/user/notifications/unread-count').subscribe({
      next: (res: any) => {
        this.notificationCount = res?.data ?? 0;
        this.commonService.setNotificationCount(this.notificationCount);
      },
      error: () => {}
    });

    // subscribe for realtime notifications – avoid duplicates
    this.webSocketService.notifications$.subscribe((n) => {
      if (n && !n.isRead && !this.seenNotificationIds.has(n.id)) {
        this.seenNotificationIds.add(n.id);
        this.commonService.incNotificationCount(1);
      }
    });

    // listen for count changes across app
    this.commonService
      .getNotificationCount()
      .subscribe((c) => (this.notificationCount = c));

    this.isMobile = this.width < this.mobileWidth;
    this.reOrderData();
    let currentURL: any = location.href.split('/').slice(3, 10).join('/');
    this.activeMenu = '/' + currentURL;
    this.updatePhoto();
    this.commonService.getValue().subscribe((res) => {
      this.updatePhoto();
    });

    // router change listener to reset count when visiting notifications
    this.router.events
      .pipe(filter((evt): evt is NavigationEnd => evt instanceof NavigationEnd))
      .subscribe((evt: NavigationEnd) => {
        this.activeMenu = evt.urlAfterRedirects;
        if (this.activeMenu.startsWith('/notifications')) {
          // refresh the unread count from server so badge stays accurate
          this.http.get('/api/user/notifications/unread-count').subscribe({
            next: (r: any) => {
              const unread = r?.data ?? 0;
              this.commonService.setNotificationCount(unread);
            },
            error: () => {}
          });
        }
      });
  }

  public searchItems(event: any) {
    // console.log(event.target.value);
  }

  public profilePage() {
    this.router.navigate(['/']);
  }

  public openLogoutModal() {
    const modalRef = this.modalService.open(LogoutModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
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

  updatePhoto() {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    let photo = userData?.userDetailResponseDTO.profilePhoto;
    this.profilePhoto = `data:image/jpeg;charset=utf-8;base64,${photo}`;
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  public toggleMenu() {
    const burgerMenu = document.getElementById('burger');
    const navbarMenu = document.getElementById('menu');

    if (burgerMenu && navbarMenu) {
      burgerMenu.classList.toggle('is-active');
      navbarMenu.classList.toggle('is-active');
    }
  }

  public closeMenu() {
    // menu close – activeMenu is already updated via router events
    const burgerMenu = document.getElementById('burger');
    const navbarMenu = document.getElementById('menu');

    if (burgerMenu && navbarMenu) {
      burgerMenu.classList.remove('is-active');
      navbarMenu.classList.remove('is-active');
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: any) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.mobileWidth;
    this.reOrderData();
  }

  public reOrderData() {
    if (this.isMobile) {
      this.filteredRoutingList = this.routingList.filter(
        (item: any) => item.routingName !== 'Software'
      );
    } else {
      this.filteredRoutingList = [...this.routingList];
    }
    // console.log(this.filteredRoutingList, 'this.filteredRoutingList')
  }
}
