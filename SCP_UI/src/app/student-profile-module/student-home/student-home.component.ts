import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  selector: 'app-student-home',
  templateUrl: './student-home.component.html',
  styleUrl: './student-home.component.scss'
})
export class StudentHomeComponent implements OnInit {
  public headerName = 'Profile View';
  public selectedSubmenu: number = 0;
  public studentMenu: Menu[] = [
    {
      menuName: 'Profile View', subMenu: [], routing: '/home/student/profile' 
    },
    {
      menuName: 'Contents Published', routing: '/home/student/view-blogs' ,
      subMenu: [
        { subMenuName: 'Blogs', routing: '/home/student/view-blogs' },
        { subMenuName: 'Videos', routing: '/home/student/view-videos' },
      ]
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    // Set initial active menu based on current route
    this.setActiveMenuFromRoute(this.router.url);

    // Subscribe to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.setActiveMenuFromRoute(event.url);
    });
  }

  private setActiveMenuFromRoute(url: string) {
    // Find the current menu and submenu
    let currentMenu: Menu | null = null;
    let currentSubmenuIndex = -1;

    for (let i = 0; i < this.studentMenu.length; i++) {
      const menu = this.studentMenu[i];
      
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
      this.studentMenu.forEach((menu) => {
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
    this.studentMenu.forEach((val) => {
      if (data.menuName != val.menuName) {
        val.visible = false;
      }
    });
  }
}
