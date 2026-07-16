import {
  ChangeDetectorRef,
  Component,
  ViewChildren,
  ElementRef,
  ViewChild,
  Renderer2,
  HostListener,
} from '@angular/core';
import { VideoService } from './service/video.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddVideoComponent } from './modals/add-video/add-video.component';
import { forkJoin } from 'rxjs';
import { VideoPreviewComponent } from './modals/video-preview/video-preview.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';
import { FilterSearchComponent } from '../../shared/component/filter-search/filter-search.component';
import { CommonService } from '../../common/common.service';
import { BlogService } from '../blog/service/blog.service';
import { ADMIN_ROLE } from '../../common/constants';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent {
  @ViewChildren('video') video!: any;
  @ViewChildren('slides') slides!: any;
  @ViewChild('customVideoOverlay') customVideoOverlay!: ElementRef;

  // Add properties to store dimensions for containers
  public containerDimensions: {
    [key: string]: { width: number; height: number };
  } = {};

  public otpSetting: any;
  public hashTagList: any = [];
  public iTestData: number = 0;
  public sliderTagList: any = [];
  public favouriteVideoList: any = [];
  public myVideoList: any = [];
  public dynamicTagVideoList: any = [];
  public currTagId: any;
  public hasAsscessToAdd: boolean = true;
  public hashTagIds: any = [];
  public isDynamicVideoLoading: boolean = false;
  public hashTagListItems: any = [];
  public selectedText: string = '';
  role!: boolean;

  filter: any = [
    {
      seq: 1,
      field: 'title',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Video Title',
    },
    {
      seq: 2,
      field: 'createdDate',
      operator: null,
      value: { from: null, to: null },
      fieldType: 'date',
      displayName: 'Published Date',
    },
    {
      seq: 3,
      field: 'author',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Author',
    },
    {
      seq: 4,
      field: 'likes',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Likes',
    },
    {
      seq: 5,
      field: 'views',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Views',
    },
  ];
  filterData: any = [];

  public carouselOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 400,
    navText: ['', ''],
    startPosition: 0,
    autoWidth: true,
    responsive: {
      0: {
        items: 2,
        margin: 5,
      },
      768: {
        items: 3,
        margin: 10,
      },
      1024: {
        items: 5,
        margin: 15,
      },

      1200: {
        items: 5,
        margin: 20,
      },
    },
    lazyLoad: true,
  };

  public dynamicCarouselOptions: OwlOptions = {
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 400,
    nav: false,
    navText: ['', ''],
    startPosition: 0,
    items: 10,
    margin: 15,
    lazyLoad: true,
    autoWidth: true,
  };

  public playerConfig = {
    controls: 0, // No controls in carousel view
    mute: 1, // Muted by default
    autoplay: 0, // No autoplay in carousel
    rel: 0, // No related videos
    enablejsapi: 1, // Enable JavaScript API
    playsinline: 1, // Play inline on mobile
    showinfo: 0, // Hide video title and uploader info
  };

  public pageCounts = {
    favouritePageCount: 0,
    myVideosPageCount: 0,
    dynamicVideoPageCount: 0,
  };
  term!: string;
  public viewType: string = 'grid';
  public currentTagTitle: string = '';

  public removedHashTagCarousel: { item: any; index: number } | null = null; // Store removed carousel & its original index

  constructor(
    private _cdr: ChangeDetectorRef,
    public modalService: NgbModal,
    private videoService: VideoService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    public commonService: CommonService,
    private blogService: BlogService,
    private renderer: Renderer2
  ) {}

  // Listen for window resize events
  @HostListener('window:resize')
  onResize() {
    // Update dimensions when window resizes
    this.updateContainerDimensions();
    // Force change detection to update bound properties
    this._cdr.detectChanges();
  }

  close() {
    console.log('Close method called in parent component');
    this.selectedText = '';
    this.currTagId = null;
  }

  ngOnInit(): void {
    this.getMyAccess();
    this.loadAllAPIs();
    this.getRouterParams();
    this.role = this.apiService.Role == ADMIN_ROLE;
    this.activatedRoute.queryParamMap.subscribe((q) => {
      const v = q.get('view');
      this.viewType = v === 'list' ? 'list' : 'grid';
    });
  }

  ngAfterViewInit() {
    this._cdr.detectChanges();
    // Make sure YouTube iframes can't capture clicks
    setTimeout(() => {
      this.disableIframePointerEvents();
      // Calculate dimensions for all containers
      this.updateContainerDimensions();
      this._cdr.detectChanges();
    }, 1000);
  }

  // Method to update dimensions for all containers
  private updateContainerDimensions(): void {
    // Get all .video containers
    const videoContainers = document.querySelectorAll('.video');

    videoContainers.forEach((container, index) => {
      // Get the container dimensions
      const width = container.clientWidth;
      const height = container.clientHeight;

      // Generate a unique key for this container
      const containerKey = `container-${index}`;

      // Store the dimensions
      this.containerDimensions[containerKey] = {
        width: width,
        height: height + 10,
      };
    });
  }

  // Method to get dimensions for a specific player
  public getPlayerDimensions(
    item: any,
    index: number
  ): { width: number; height: number } {
    // Create a unique ID for this container
    const containerKey = `container-${index}`;

    // If we don't have dimensions stored yet, use default values
    if (!this.containerDimensions[containerKey]) {
      // Try to find the container and measure it
      const containers = document.querySelectorAll('.video');
      if (containers.length > index) {
        const container = containers[index];
        this.containerDimensions[containerKey] = {
          width: container.clientWidth,
          height: container.clientHeight,
        };
      } else {
        // Use default dimensions if container not found
        return { width: 200, height: 120 };
      }
    }

    return this.containerDimensions[containerKey];
  }

  // Handler for YouTube player ready event - can be used for additional setup
  public onPlayerReady(event: any): void {
    // Additional setup if needed
    console.log('YouTube player ready');
  }

  // New method to disable pointer events on all YouTube iframes
  private disableIframePointerEvents(): void {
    const iframes = document.querySelectorAll('.video iframe');
    iframes.forEach((iframe) => {
      this.renderer.setStyle(iframe, 'pointer-events', 'none');
    });
  }

  // Method to handle direct video clicks from the overlay
  public handleVideoClick(item: any): void {
    console.log(item);

    // Open the video preview modal
    const modalRef = this.modalService.open(VideoPreviewComponent, {
      backdrop: 'static',
      keyboard: true,
      windowClass: 'custom-size-modal',
      centered: true,
    });

    modalRef.result.then((response) => {
      if (response) {
        this.loadAllAPIs();
      }
    });

    modalRef.componentInstance.viewData = item;
  }

  private getRouterParams(): void {
    this.activatedRoute.params.subscribe((param: any) => {
      if (param?.id) {
        this.getBlogById(param.id);
      }
    });
  }

  private loadAllAPIs(): void {
    if (this.viewType == 'grid') {
      this.getAllHashTagList();
      this.getFavouriteListVideos(0, true);
      this.getMyVideos(0, true);

      // Update player configs after loading videos
      setTimeout(() => {
        this.updatePlayerConfigs();
        // Update dimensions after loading videos
        this.updateContainerDimensions();
        this._cdr.detectChanges();
      }, 500);
    }
  }

  // Method to update player configurations for all videos
  private updatePlayerConfigs(): void {
    // Apply the configuration to all video lists
    if (this.favouriteVideoList?.length) {
      this.favouriteVideoList.forEach((item: any) => {
        item.playerConfig = { ...this.playerConfig };
      });
    }

    if (this.myVideoList?.length) {
      this.myVideoList.forEach((item: any) => {
        item.playerConfig = { ...this.playerConfig };
      });
    }

    if (this.hashTagListItems?.length) {
      this.hashTagListItems.forEach((category: any) => {
        if (category.data?.length) {
          category.data.forEach((item: any) => {
            item.playerConfig = { ...this.playerConfig };
          });
        }
      });
    }

    if (this.dynamicTagVideoList?.length) {
      this.dynamicTagVideoList.forEach((item: any) => {
        item.playerConfig = { ...this.playerConfig };
      });
    }

    // Reapply disable pointer events for iframes
    setTimeout(() => {
      this.disableIframePointerEvents();
      // Update dimensions after player configs
      this.updateContainerDimensions();
      this._cdr.detectChanges();
    }, 200);
  }

  searchItems(event: any) {}

  addVideo() {
    const modalRef = this.modalService.open(AddVideoComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.loadAllAPIs();
      }
    });
  }

  // Modified previewVideo method to prevent direct playback
  public previewVideo(event: any, item: any, index: any): void {
    // Pause the video immediately
    if (event.target && typeof event.target.pauseVideo === 'function') {
      event.target.pauseVideo();
    }

    // Only open the modal on click events, not on auto-play or other events
    if (event.data === 1) {
      // Video started playing, open the preview modal and pause this one
      this.handleVideoClick(item);
    }
  }

  public getBlogById(postingId: any): void {
    this.apiService
      .getPostingUserDetails(postingId)
      .subscribe((response: any) => {
        let videoInfo: any = response.data;
        this.previewVideoFromSharedLink(videoInfo);
      });
  }

  private previewVideoFromSharedLink(item: any): void {
    const modalRef = this.modalService.open(VideoPreviewComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.loadAllAPIs();
        this.router.navigate(['home/videos']);
      }
    });
    modalRef.componentInstance.viewData = item;
  }

  public mouseIn(video: any): void {}

  public mouseOut(video: any): void {}

  public getDynamicHashTagList(tag: any, page?: any, fromClick?: any) {
    this.currTagId = tag.id;
    this.selectedText = tag.text || tag.description;

    // When user clicks a tag, remove its carousel to avoid duplicate display
    if (this.removedHashTagCarousel) {
      const { item: prevItem, index: prevIndex } = this.removedHashTagCarousel;
      const insertIdx = prevIndex <= this.hashTagListItems.length ? prevIndex : this.hashTagListItems.length;
      this.hashTagListItems.splice(insertIdx, 0, prevItem);
      this.removedHashTagCarousel = null;
    }

    if (fromClick) {
      const currentIndex = this.hashTagListItems.findIndex(
        (val: any) => val.tagId === tag.id
      );
      if (currentIndex > -1) {
        const [removed] = this.hashTagListItems.splice(currentIndex, 1);
        this.removedHashTagCarousel = { item: removed, index: currentIndex };
      }
      this.dynamicTagVideoList = [];
      this.currentTagTitle = tag.text || tag.description;
    }

    if (this.viewType == 'grid') {
      this.isDynamicVideoLoading = true;
      this.blogService
        .getBlogsByTagId(
          {
            id: this.currTagId,
            documentTypeEnum: 'VIDEOS',
            text: tag.text || tag.description,
          },
          page
        )
        .subscribe({
          next: (res: any) => {
            if (res.data.length > 0) {
              this.currentTagTitle = res?.text || this.selectedText;
              this.dynamicTagVideoList = fromClick
                ? this.dynamicTagVideoList.concat(res.data)
                : res.data;

              // Apply player config to new videos
              setTimeout(() => {
                this.updatePlayerConfigs();
                // Update dimensions for new videos
                this.updateContainerDimensions();
                this._cdr.detectChanges();
              }, 300);

              // Modal check now after API completes (res may be empty)
              if (
                this.dynamicTagVideoList.length === 0 &&
                this.selectedText &&
                this.viewType === 'grid' &&
                this.currTagId !== null
              ) {
                this.commonService.dialog({
                  type: 'newErrorModal',
                  header: 'No content',
                  message1: `No content found for ${this.selectedText}`,
                  btnName: 'OK',
                });
              }
            }
          },
          error: (error) => {
            console.log(error.message);
          },
          complete: () => {
            this.isDynamicVideoLoading = false;

            // If after API call we still have no videos for the selected tag, show standardized modal
            if (
              this.dynamicTagVideoList.length === 0 &&
              this.selectedText &&
              this.viewType === 'grid' &&
              this.currTagId !== null
            ) {
              this.commonService.dialog({
                type: 'newErrorModal',
                header: 'No content',
                message1: `No content found for ${this.selectedText}`,
                btnName: 'OK',
              });
            }
          },
        });
    }
  }

  getAllHashTagList() {
    this.videoService.getAllHashTagList().subscribe({
      next: (res: any) => {
        this.hashTagList = res.data;
        this.loadAllHashTagItems();
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  getFavouriteListVideos(page?: any, fromDialog?: any) {
    this.videoService.getFavouriteList(page).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.favouriteVideoList = fromDialog
            ? (this.favouriteVideoList = res.data)
            : this.favouriteVideoList.concat(res.data);

          // Apply player config
          this.favouriteVideoList.map((val: any) => {
            val.playerConfig = this.playerConfig;
            return val;
          });

          // Update dimensions after loading videos
          setTimeout(() => {
            this.updateContainerDimensions();
            this._cdr.detectChanges();
          }, 300);
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  getMyVideos(page?: any, fromDialog?: any) {
    this.videoService.getMyVideos(page).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.myVideoList = fromDialog
            ? (this.myVideoList = res.data)
            : this.myVideoList.concat(res.data);

          // Apply player config
          this.myVideoList.map((val: any) => {
            val.playerConfig = this.playerConfig;
            return val;
          });

          // Update dimensions after loading videos
          setTimeout(() => {
            this.updateContainerDimensions();
            this._cdr.detectChanges();
          }, 300);
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  getMyAccess() {
    this.videoService.getMyAccess().subscribe({
      next: (res: any) => {
        this.hasAsscessToAdd = res.data.hasAccess;
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  scrollTo(element: HTMLElement, direction: number) {
    element.scrollBy({
      left: direction * 200,
      behavior: 'smooth',
    });
  }

  handleNext(from: string) {
    switch (from) {
      case 'favourite':
        this.pageCounts.favouritePageCount++;
        this.getFavouriteListVideos(this.pageCounts.favouritePageCount);
        break;
      case 'videos':
        this.pageCounts.myVideosPageCount++;
        this.getMyVideos(this.pageCounts.myVideosPageCount);
        break;
      case 'dynamic':
        this.pageCounts.dynamicVideoPageCount++;
        this.getDynamicHashTagList(
          { id: this.currTagId, text: this.selectedText },
          this.pageCounts.dynamicVideoPageCount
        );
        break;
    }
  }

  getVideoId(url: any) {
    if (!url) return null;
    let rx =
      /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    let res = url.match(rx);
    return res && res.length ? res[1] : null;
  }

  playPauseVideo(event: any, i: number) {
    // Prevent video from playing directly in the carousel
    event.preventDefault();
    event.stopPropagation();

    // Instead of playing in carousel, open in modal
    if (
      this.hashTagListItems[i] &&
      this.hashTagListItems[i].data &&
      this.hashTagListItems[i].data[0]
    ) {
      this.handleVideoClick(this.hashTagListItems[i].data[0]);
    }
  }

  getDynamicHeaderTitle(): any {
    const headerTitle =
      this.dynamicTagVideoList.length > 0
        ? this.dynamicTagVideoList[0].postingTags[0].hashTag.description
        : '';
    return headerTitle;
  }

  loadAllHashTagItems() {
    forkJoin(
      this.hashTagList.map((tag: any) =>
        this.blogService.getBlogsByTagId(
          { id: tag.id, documentTypeEnum: 'VIDEOS', text: tag.text },
          0
        )
      )
    ).subscribe((response: any) => {
      this.hashTagListItems = response.filter(
        (val: any) => val.data && val.data.length
      );

      // Apply player config to all hashtag videos
      this.hashTagListItems.forEach((item: any) => {
        if (item.data && item.data.length) {
          item.data.map((elm: any) => {
            elm.playerConfig = this.playerConfig;
            return elm;
          });
        }
      });

      // Update dimensions after loading videos
      setTimeout(() => {
        this.disableIframePointerEvents();
        this.updateContainerDimensions();
        this._cdr.detectChanges();
      }, 500);
    });
  }

  nextSlide(index: any, item: any) {
    let response: any = [];
    if (!item.itemIndex) {
      item.itemIndex = 0;
    }
    item.itemIndex++;

    if (item.data && item.data.length > item.itemIndex) {
      this.reRenderSlides(index);
    } else if (item.isApi) {
      if (!item.pageCount) {
        item.pageCount = 0;
      }
      item.pageCount = item.pageCount + 1;
      this.blogService
        .getBlogsByTagId(
          { id: item.tagId, documentTypeEnum: 'BLOGS' },
          item.pageCount
        )
        .subscribe({
          next: (res) => {
            response = res.data;
            item.data = item.data.concat(res.data);

            // Apply player config to new videos
            if (res.data && res.data.length) {
              res.data.forEach((video: any) => {
                video.playerConfig = this.playerConfig;
              });
            }

            this.reRenderSlides(index);

            // Update dimensions after adding new slides
            setTimeout(() => {
              this.disableIframePointerEvents();
              this.updateContainerDimensions();
              this._cdr.detectChanges();
            }, 300);
          },
          complete: () => {
            if (response.length == 0 || response.length < 5) {
              item.isApi = false;
            }
          },
        });
    } else {
      this.reRenderSlides(index);
    }
  }

  public reRenderSlides(index: any): void {
    setTimeout(() => {
      if (this.slides && this.slides._results && this.slides._results[index]) {
        this.slides._results[index].next();

        // Update dimensions after slide changes
        setTimeout(() => {
          this.disableIframePointerEvents();
          this.updateContainerDimensions();
          this._cdr.detectChanges();
        }, 100);
      }
    }, 50);
  }

  prevSlide(index: any) {
    if (this.slides && this.slides._results && this.slides._results[index]) {
      this.slides._results[index].prev();

      // Update dimensions after slide changes
      setTimeout(() => {
        this.disableIframePointerEvents();
        this.updateContainerDimensions();
        this._cdr.detectChanges();
      }, 100);
    }
  }

  getSearchText(event: any) {
    if (event.target.value.length == 0) {
      // Reset tag-related state if a tag was selected
      if (this.currTagId !== null) {
        this.currTagId = null;
        this.selectedText = '';
        this.currentTagTitle = '';
        this.dynamicTagVideoList = [];
        this.loadAllAPIs();
      }
    }
  }

  public viewList(view: 'grid' | 'list') {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { view: view === 'list' ? 'list' : null },
      queryParamsHandling: 'merge',
    });

    this.viewType = view;
    this.currTagId = null;
    this.selectedText = ''; // Add this line to reset the selected text
    if (view == 'grid') {
      // Reset other state variables
      this.dynamicTagVideoList = [];
      this.favouriteVideoList = [];
      this.hashTagListItems = [];
      this.myVideoList = [];
      this.filterData = [];
      this.filter.forEach((v: any) => {
        if (v.fieldType == 'input') {
          v.value = null;
        } else {
          v.value = { from: null, to: null };
        }
      });
      this.loadAllAPIs();
    }
  }

  openFilterSearch() {
    const modalRef = this.modalService.open(FilterSearchComponent, {
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.filterSetting = this.filter;
    modalRef.result.then((response) => {
      this.filterData =
        this.commonService.searchingFilterRemoveDuplicate(response);
    });
  }

  cancelTag() {
    // Reset all tag-related state variables
    this.currTagId = null;
    this.selectedText = '';
    this.currentTagTitle = '';
    this.dynamicTagVideoList = [];

    // Restore the previously removed carousel, if any, to its original position
    if (this.removedHashTagCarousel) {
      const { item, index } = this.removedHashTagCarousel;
      const insertIndex = index <= this.hashTagListItems.length ? index : this.hashTagListItems.length;
      this.hashTagListItems.splice(insertIndex, 0, item);
      this.removedHashTagCarousel = null;
    }

    // Optional: reload other data if necessary
    // this.loadAllAPIs();
  }
}
