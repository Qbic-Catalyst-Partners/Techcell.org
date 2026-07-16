import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  OnDestroy,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { ApiService } from '../../../shared/services/api.service';
import { VideoPreviewComponent } from '../modals/video-preview/video-preview.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthUtils } from '../../../shared/utility/auth-utils';
import { VideoService } from '../service/video.service';
import { BlogService } from '../../blog/service/blog.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-video-list-view',
  templateUrl: './video-list-view.component.html',
  styleUrl: './video-list-view.component.scss',
})
export class VideoListViewComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterData: any;
  @Input() tagId: any;
  @Input() tagName: string = '';
  @Output() closeEvent = new EventEmitter<void>();

  page: number = 0;
  public header_data: any[] = [
    {
      fieldName: 'Video Title',
      isSort: true,
      sort: true,
      sortFieldName: 'title',
    },
    {
      fieldName: 'Published Date',
      isSort: true,
      sort: true,
      sortFieldName: 'createdDate',
    },
    { fieldName: 'Author', isSort: true, sort: true },
    { fieldName: 'Hashtags', isSort: true, sort: true },
    { fieldName: 'Views', isSort: true, sort: true, sortFieldName: 'views' },
    { fieldName: 'Likes', isSort: true, sort: true, sortFieldName: 'likes' },
  ];
  public all_data: any[] = [];
  public userInfo: any;
  activeTooltipId: any;
  sortActive: any;
  filterApiData: any;
  isdata: boolean = false;
  isLoading: boolean = false;
  private postAddedSub!: Subscription;

  constructor(
    public commonService: CommonService,
    private apiService: ApiService,
    public modalService: NgbModal,
    private videoService: VideoService,
    private blogService: BlogService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.filterApiData = [];
    this.all_data = [];
    this.page = 0;
    if (this.filterData && this.filterData.length > 0) {
      this.filterApiData = this.commonService.searchingFilterDataPreparation(
        this.filterData
      );
    }
    if (this.tagId) {
      this.getVideoByTagId();
    } else {
      let payload = {
        documentTypeEnum: 'VIDEOS',
        filters: this.filterApiData,
        page: this.page,
        size: 10,
      };
      this.loadData(payload);
    }
  }

  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO;
    if (this.userInfo.role == 'Admin') {
      this.header_data.push(
        { fieldName: 'Status', isSort: true, sort: true },
        { fieldName: 'Action', isSort: false, sort: false }
      );
    }

    // Listen for newly added videos
    this.postAddedSub = this.videoService.postingAdded$.subscribe((type) => {
      if (type === 'VIDEOS') {
        this.refreshList();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.postAddedSub) {
      this.postAddedSub.unsubscribe();
    }
  }

  private refreshList(): void {
    this.page = 0;
    this.all_data = [];

    if (this.tagId) {
      this.getVideoByTagId();
    } else {
      let payload;
      if (this.sortActive) {
        payload = {
          direction: this.sortActive?.sort == true ? 'asc' : 'desc',
          documentTypeEnum: 'VIDEOS',
          filters: this.filterApiData || [],
          page: this.page,
          size: 10,
          sortBy: this.sortActive?.sortFieldName,
        };
      } else {
        payload = {
          documentTypeEnum: 'VIDEOS',
          filters: this.filterApiData || [],
          page: this.page,
          size: 10,
        };
      }
      this.loadData(payload);
    }
  }

  getData(fetchData: boolean) {
    if (fetchData && !this.isdata) {
      this.page = this.page + 1;
      if (this.sortActive) {
        let payload = {
          direction: this.sortActive?.sort == true ? 'asc' : 'desc',
          documentTypeEnum: 'VIDEOS',
          filters:
            this.filterApiData && this.filterApiData.length
              ? this.filterApiData
              : [],
          page: this.page,
          size: 10,
          sortBy: this.sortActive?.sortFieldName,
        };
        this.loadData(payload);
      } else if (this.tagId) {
        this.getVideoByTagId();
      } else {
        let payload = {
          documentTypeEnum: 'VIDEOS',
          page: this.page,
          size: 10,
        };
        this.loadData(payload);
      }
    }
  }

  private loadData(payload: any): void {
    this.isLoading = true;
    this.apiService.getListingVideoAndBlog(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isdata = res?.data && res.data.length == 0 ? true : false;
        this.all_data = this.all_data.concat(
          res.data.map((v: any) => {
            const tagSet = new Set<string>(
              v.postingTags.map((t: any) => t?.hashTag?.description)
            );
            const tags = Array.from(tagSet).join(' / ');
            return {
              ...v,
              createdDate: this.commonService.listingDate(v.createdDate),
              tags: tags,
              thumbnail: `data:image/jpeg;charset=utf-8;base64,${v?.video?.thumbnail}`,
              shortTitle: `${v?.title.slice(0, 20)}`,
              fullName: `${v?.postedUser?.firstName} ${v?.postedUser?.lastName}`,
            };
          })
        );
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  public previewVideo(item: any) {
    if (!this.activeTooltipId) {
      const modalRef = this.modalService.open(VideoPreviewComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        centered: true,
      });
      // modalRef.result.then((response) => {
      //   if (response) {
      //     this.loadAllAPIs();
      //   }
      // });
      modalRef.componentInstance.viewData = item;
    }
  }

  toggleAction(item: any) {
    this.activeTooltipId = item.postingId;
  }

  toggleTooltip(tooltip: any) {
    tooltip.toggle();
  }

  @HostListener('document:click', ['$event']) onDocumentClick($event: any) {
    this.activeTooltipId = null;
  }

  updateStatus(type: string, item: any) {
    let payload = {
      id: item?.postingId,
      status: type,
      reason: 'Reason test',
    };
    this.videoService.updatePostingStatus(payload).subscribe({
      next: (res) => {
        if (res.success) {
          if (type == 'Delete') {
            this.all_data = this.all_data.filter(
              (val: any) => val.postingId != item.postingId
            );
          } else {
            item.status = type;
          }
        }
      },
    });
  }

  sortHeader(column: any) {
    column.sort = !column.sort;
    this.header_data.forEach((val: any) => {
      if (val.sortFieldName !== column.sortFieldName && val.isSort) {
        val.sort = true;
      }
    });
    this.page = 0;
    this.all_data = [];
    this.sortActive = column;
    let payload = {
      direction: column.sort == true ? 'asc' : 'desc',
      documentTypeEnum: 'VIDEOS',
      filters:
        this.filterApiData && this.filterApiData.length
          ? this.filterApiData
          : [],
      page: this.page,
      size: 10,
      sortBy: column.sortFieldName,
    };
    this.loadData(payload);
  }

  getVideoByTagId() {
    this.isLoading = true;
    this.blogService
      .getBlogsByTagId(
        { documentTypeEnum: 'VIDEOS', id: this.tagId },
        this.page
      )
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          this.isdata = res?.data && res.data.length == 0 ? true : false;
          this.all_data = this.all_data.concat(
            res.data.map((v: any) => {
              const tagSet = new Set<string>(
                v.postingTags.map((t: any) => t?.hashTag?.description)
              );
              const tags = Array.from(tagSet).join(' / ');
              return {
                ...v,
                createdDate: this.commonService.listingDate(v.createdDate),
                tags: tags,
                thumbnail: `data:image/jpeg;charset=utf-8;base64,${v?.video?.thumbnail}`,
                shortTitle: `${v?.title.slice(0, 20)}`,
                fullName: `${v?.postedUser?.firstName} ${v?.postedUser?.lastName}`,
              };
            })
          );

          if (this.all_data.length === 0 && this.tagId && this.tagName) {
            this.commonService.dialog({
              type: 'newErrorModal',
              header: 'No content',
              message1: `No content found for ${this.tagName}`,
              btnName: 'OK',
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.log(error.message);
        },
      });
  }

  close() {
    this.closeEvent.emit();
    console.log('Close modal clicked');
  }
}
