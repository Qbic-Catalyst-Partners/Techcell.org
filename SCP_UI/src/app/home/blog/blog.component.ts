import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BlogModalComponent } from './modals/blog-modal/blog-modal.component';
import { BlogService } from './service/blog.service';
import { forkJoin, Subscription } from 'rxjs';
import { CommonService } from '../../common/common.service';
import { ADMIN_ROLE } from '../../common/constants';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { Router, ActivatedRoute } from '@angular/router';
import { FilterSearchComponent } from '../../shared/component/filter-search/filter-search.component';
import { ApiService } from '../../shared/services/api.service';
import { VideoService } from '../videos/service/video.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss',
})
export class BlogComponent implements OnInit, OnDestroy {
  @ViewChildren('slides') slides!: any;

  public htmlContent = '';
  public hasAsscessToAdd: boolean = false;
  public hashTagListItems: any = [];
  public favouriteBlogList: any = [];
  public blogList: any = [];
  public dynamicBlogList: any = [];
  public blogDetailData: any;
  public allBlogList: any;
  public hashTagList: any;
  public isDynamicBlogLoading: boolean = false;
  public currTagId: any;
  role!: boolean;
  public pageCounts: any = {
    favouritePageCount: 0,
    hashTaglistPageCount: 0,
    dynamicBlogPageCount: 0,
  };
  public term!: string;
  isFirstSlide: boolean = true;
  isLastSlide: boolean = false;
  public viewType: string = 'grid';
  isFilter: boolean = false;
  selectedTag: any;
  selectedTagName: string = '';
  filter: any = [
    {
      seq: 1,
      field: 'title',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Blog Title',
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

  // Modified carousel options
  public carouselOptions: OwlOptions = {
    loop: false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 400,
    // nav: true,
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
    // Remove autoWidth: true to let the responsive configuration control item widths
  };
  public removedHashTagCarousel: { item: any; index: number } | null = null; // Store removed carousel & its original index
  private postAddedSub!: Subscription;

  constructor(
    public modalService: NgbModal,
    private blogService: BlogService,
    public commonService: CommonService,
    public router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private videoService: VideoService
  ) {}

  close() {
    this.selectedTag = null;
  }

  ngOnDestroy(): void {
    AuthUtils.clearBlog();
    if (this.postAddedSub) {
      this.postAddedSub.unsubscribe();
    }
  }

  public addBlog(): void {
    const modalRef = this.modalService.open(BlogModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.loadAllAPI();
      }
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((q) => {
      const v = q.get('view');
      this.viewType = v === 'list' ? 'list' : 'grid';
    });

    this.loadAllAPI();
    let blog: any = AuthUtils.getBlog();
    let blogData = JSON.parse(blog);
    // this.addBlog();
    if (!!blogData) {
      this.loadDetails(blogData);
    }
    this.role = this.apiService.Role == ADMIN_ROLE;
    
    // Subscribe to blog additions for real-time updates
    this.postAddedSub = this.videoService.postingAdded$.subscribe((type) => {
      if (type === 'BLOGS' && this.viewType === 'grid') {
        this.loadAllAPI();
      }
    });
    // const modalRef = this.modalService.open(BlogModalComponent, {
    //   backdrop: 'static',
    //   keyboard: true,
    //   size: 'lg',
    //   centered: true,
    // });
  }

  public loadAllAPI(): any {
    this.getAllHashTagList();
    if (this.viewType == 'grid') {
      this.getBlogList();
      this.getMyFavouriteBlogs();
    }
  }

  scrollTo(element: HTMLElement, direction: number) {
    element.scrollBy({
      left: direction * 200,
      behavior: 'smooth',
    });
  }

  searchItems(evt: any) {}

  // Add these methods to handle events
  carouselTranslated(event: any) {
    const carousel = event.carousel;
    this.updateCarouselArrows(carousel, event.element);
  }

  carouselInitialized(event: any) {
    const carousel = event.carousel;
    this.updateCarouselArrows(carousel, event.element);
  }

  updateCarouselArrows(carousel: any, carouselElement: HTMLElement) {
    if (!carousel || !carouselElement) return;

    // Find the parent that contains both the carousel and nav arrows
    const carouselSection =
      carouselElement.closest('.category-card') ||
      carouselElement.closest('div');

    if (!carouselSection) return;

    const leftArrow = carouselSection.querySelector('.arrow-left');
    const rightArrow = carouselSection.querySelector('.arrow-right');

    if (leftArrow) {
      // Check if at the beginning
      const isFirst = carousel.current() === 0;
      leftArrow.classList.toggle('disabled', isFirst);
    }

    if (rightArrow) {
      // Check if at the end
      const totalItems = carousel.items().length;
      const visibleItems = this.getVisibleItemCount();
      const isLast = carousel.current() + visibleItems >= totalItems;
      rightArrow.classList.toggle('disabled', isLast);
    }
  }

  // Helper to determine visible items based on screen size
  getVisibleItemCount(): number {
    if (window.innerWidth >= 1024) {
      return 5;
    } else if (window.innerWidth >= 768) {
      return 3;
    } else {
      return 2;
    }
  }

  nextSlide(index: any, item: any) {
    let response: any = [];
    item.itemIndex++;
    if (item.data && item.data.length > item.itemIndex) {
      this.reRenderSlides(index);
    } else if (item.isApi) {
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
            this.reRenderSlides(index);
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
  /**
   * @returns void
   */
  public reRenderSlides(index: any): void {
    setTimeout(() => {
      this.slides._results[index].next();
    }, 50);
  }

  refresh(event: any) {
    console.log(event);
  }

  prevSlide(index: any) {
    this.slides._results[index].prev();
  }

  public getBLogTag(cat: any): void {
    console.log(cat);
  }

  public getBlogList(): void {
    const userInfoRaw: string | null = AuthUtils.getUserDetails();
    let loggedInUserId: any = null;
    if (userInfoRaw) {
      try {
        loggedInUserId = JSON.parse(userInfoRaw)?.userDetailResponseDTO?.userId;
      } catch (e) {
        loggedInUserId = null;
      }
    }

    this.blogService.getOnlyBlogs(0, 6, loggedInUserId).subscribe({
      next: (res: any) => {
        this.allBlogList = res.data;
      },
      error: () => {
        this.allBlogList = [];
      },
    });
  }

  public getMyFavouriteBlogs(page?: any): void {
    this.blogService.getMyFavouriteBlogs(page, 6).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          this.favouriteBlogList = [...this.favouriteBlogList, ...res.data];
        }
      },
      error: (err: any) => {},
    });
  }

  public getAllHashTagList(): void {
    this.blogService.getAllHashTagList().subscribe({
      next: (res: any) => {
        this.hashTagList = res.data;
        this.getBlogsByTagId();
      },
      error: (err: any) => {},
    });
  }

  public getBlogsByTagId(): void {
    forkJoin(
      this.hashTagList.map((item: any) =>
        this.blogService.getBlogsByTagId(
          { ...item, documentTypeEnum: 'BLOGS' },
          0
        )
      )
    ).subscribe((response: any) => {
      this.hashTagListItems = response.filter(
        (val: any) => val.data && val.data.length
      );
    });
  }

  public loadDetails(data: any): void {
    this.blogDetailData = data;
  }

  public getDynamicHashTagList(item: any, page?: any, fromClick?: any) {
    this.currTagId = item.id ?? item.tagId;
    this.selectedTag = item.id;
    this.selectedTagName = item.description;
    let payload = item;
    if (fromClick) {
      // First, if a previous tag carousel was removed, put it back at its original spot
      if (this.removedHashTagCarousel) {
        const { item: prevItem, index: prevIndex } = this.removedHashTagCarousel;
        const insertIdx = prevIndex <= this.hashTagListItems.length ? prevIndex : this.hashTagListItems.length;
        this.hashTagListItems.splice(insertIdx, 0, prevItem);
        this.removedHashTagCarousel = null;
      }

      const tagIdentifier = item.id ?? item.tagId;
      // Remove corresponding carousel from hashtag list items to avoid duplicate display
      const currentIndex = this.hashTagListItems.findIndex(
        (val: any) => val.tagId === tagIdentifier
      );
      if (currentIndex > -1) {
        const [removed] = this.hashTagListItems.splice(currentIndex, 1);
        this.removedHashTagCarousel = { item: removed, index: currentIndex };
      }
      this.dynamicBlogList = [];
    }
    fromClick ? (this.dynamicBlogList = []) : '';
    if (this.viewType == 'grid') {
      this.isDynamicBlogLoading = true; // Set loading to true before API call
      this.blogService
        .getBlogsByTagId({ ...payload, documentTypeEnum: 'BLOGS' }, page)
        .subscribe({
          next: (res: any) => {
            if (res.data.length > 0) {
              this.dynamicBlogList = fromClick
                ? this.dynamicBlogList.concat(res.data)
                : res.data;
            }
          },
          error: (error) => {
            console.log(error.message);
          },
          complete: () => {
            this.isDynamicBlogLoading = false; // Set loading to false when done

            // Show friendly modal when no content present for selected tag
            if (
              this.dynamicBlogList.length === 0 &&
              this.selectedTag &&
              this.viewType === 'grid'
            ) {
              this.commonService.dialog({
                type: 'newErrorModal',
                header: 'No content',
                message1: `No content found for ${this.selectedTagName}`,
                btnName: 'OK',
              });
            }
          },
        });
    }
  }

  public handleNext(from: string) {
    switch (from) {
      case 'favourite':
        this.pageCounts.favouritePageCount++;
        this.getMyFavouriteBlogs(this.pageCounts.favouritePageCount);
        break;
      case 'dynamic':
        this.pageCounts.dynamicVideoPageCount++;
        this.getDynamicHashTagList(
          this.currTagId,
          this.pageCounts.dynamicVideoPageCount
        );
        break;
    }
  }

  public navigateToDetails(id: any) {
    this.router.navigate(['home/blog-details', id]);
  }

  getSearchText(event: any) {
    if (event.target.value.length == 0) {
      this.dynamicBlogList = [];
      this.favouriteBlogList = [];
      this.selectedTag = null;
      this.loadAllAPI();
    }
  }

  public viewList(view: 'grid' | 'list') {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: view === 'list' ? 'list' : null },
      queryParamsHandling: 'merge',
    });

    this.viewType = view;
    this.selectedTag = null;
    if (view == 'grid') {
      this.dynamicBlogList = [];
      this.favouriteBlogList = [];
      this.hashTagListItems = [];
      this.filterData = [];
      this.filter.forEach((v: any) => {
        if (v.fieldType == 'input') {
          v.value = null;
        } else {
          v.value = { from: null, to: null };
        }
      });
      this.loadAllAPI();
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

  getBlogResponseByTagId(item: any) {
    let payload = {
      id: item.tagId,
    };
    this.blogService.getBlogsByTagId(payload, item.pageCount).subscribe({
      next: (res) => {
        this.hashTagListItems = this.hashTagListItems.map((val: any) => {
          if (val.tagId == item.tagId) {
            val.data = val.data.concat(res.data);
          }
          return val;
        });
        console.log(this.hashTagListItems);
      },
    });
  }

  cancelTag() {
    // Restore the previously removed carousel if available
    if (this.removedHashTagCarousel) {
      const { item, index } = this.removedHashTagCarousel;
      const insertIndex = index <= this.hashTagListItems.length ? index : this.hashTagListItems.length;
      this.hashTagListItems.splice(insertIndex, 0, item);
      this.removedHashTagCarousel = null;
    }
    this.selectedTag = null;
    this.dynamicBlogList = [];
  }
}
