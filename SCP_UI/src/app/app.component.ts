import {
  Component,
  HostListener,
  Renderer2,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LoaderService } from './shared/Token-intercepter/loader.service';
import { ProgressBarService } from './shared/services/progress-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthUtils } from './shared/utility/auth-utils';
import { WebSocketService } from './shared/services/websocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  public enableBanner: boolean = false;
  public contentPostingId: string = '';
  public routeName: string = '';
  private subscription!: Subscription;

  constructor(
    private router: Router,
    public loaderService: LoaderService,
    private progressBarService: ProgressBarService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private renderer: Renderer2,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit() {
    this.progressBarService.updateProgressBar$?.subscribe((x: any) => {
      if (x) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });

    this.router.events.subscribe((evt: any) => {
      this.route.queryParams.subscribe((params) => {
        if (params) {
          this.routeName = params['routeName'];
        }
      });

      if (evt instanceof NavigationEnd) {
        const isAuthorised = localStorage.getItem('Authorization');
        this.setItemsIntoLocalStorage();

        // Get the full URL including query parameters
        const fullURL = evt.url;
        // Get just the base URL without query parameters
        const currentURL = fullURL.split('?')[0];

        let currentRoute = this.route.root;
        while (currentRoute.children.length > 0) {
          currentRoute = currentRoute.children[0];
        }

        const checkWildCardRoute =
          currentRoute.snapshot.routeConfig?.path === '**';
        const isPaymentRequired = fullURL.includes('payment=required');

        if (
          checkWildCardRoute ||
          currentURL === '/' ||
          currentURL.startsWith('/auth') ||
          isPaymentRequired
        ) {
          this.enableBanner = false;
        } else {
          this.enableBanner = true;
        }

        if (isAuthorised) {
          if (this.routeName) {
            this.router.navigate([this.routeName]);
          } else {
            if (currentURL === '/auth' || currentURL === '/') {
              this.router.navigate(['/home']);
              // Only enable banner if not in payment required mode
              this.enableBanner = !isPaymentRequired;
            }
          }
        }
      }

      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });

    // this.resize();

    // Subscribe to WebSocket notifications at the app level
    this.subscription = this.webSocketService.notifications$.subscribe({
      next: (notification) => {},
      error: (error) => {
        console.error(
          'Error in app component notification subscription:',
          error
        );
      },
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public setItemsIntoLocalStorage(): void {
    AuthUtils.setLocalStorageItem('routeName', this.routeName);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // this.adjustZoom();
    // this.resize();
  }

  private adjustZoom() {
    const windowWidth = window.innerWidth;
    const scale = windowWidth / 1920;
    const zoomFactor = Math.min(Math.max(scale, 0.5), 1.5);

    const metaViewport = document.querySelector('meta[name=viewport]');
    if (metaViewport) {
      metaViewport.setAttribute(
        'content',
        `width=device-width, initial-scale=${zoomFactor}, maximum-scale=${zoomFactor}, user-scalable=no`
      );
    }
  }

  resize() {
    const browserZoomLevel = Math.round(window.devicePixelRatio * 100);
    if (browserZoomLevel >= 150) {
      this.renderer.setStyle(document.body, 'zoom', '85%');
    }
    // else if (browserZoomLevel > 125 && browserZoomLevel < 150) {
    //   this.renderer.setStyle(document.body, 'zoom', '95%');
    // }
    else {
      this.renderer.removeStyle(document.body, 'zoom');
    }
  }
}
