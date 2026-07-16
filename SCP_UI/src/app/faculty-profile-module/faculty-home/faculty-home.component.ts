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
  selector: 'app-faculty-home',
  templateUrl: './faculty-home.component.html',
  styleUrl: './faculty-home.component.scss'
})
export class FacultyHomeComponent implements OnInit {
  public headerName = 'Profile View';
  public selectedSubmenu: number = 0;
  public facultyMenu: Menu[] = [
    {
      menuName: 'Profile View', subMenu: [], routing: '/home/faculty/profile' 
    },
    {
      menuName: 'Contents Published', routing: '/home/faculty/view-blogs' ,
      subMenu: [
        { subMenuName: 'Blogs', routing: '/home/faculty/view-blogs' },
        { subMenuName: 'Videos', routing: '/home/faculty/view-videos' },
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

    for (let i = 0; i < this.facultyMenu.length; i++) {
      const menu = this.facultyMenu[i];
      
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
      this.facultyMenu.forEach((menu) => {
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
    this.facultyMenu.forEach((val) => {
      if (data.menuName != val.menuName) {
        val.visible = false;
      }
    });
  }
}
