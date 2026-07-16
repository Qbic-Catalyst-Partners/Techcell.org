import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { forkJoin, take } from 'rxjs';
import { CareerService } from '../career.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CommonService } from '../../common/common.service';
import { JobService } from './_service/job.service';
import { JoblistingModalComponent } from './joblisting-modal/joblisting-modal.component';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { ApiService } from '../../shared/services/api.service';
import { ADMIN_ROLE, CORPORATE_ROLE } from '../../common/constants';

@Component({
  selector: 'app-job-listings',
  templateUrl: './job-listings.component.html',
  styleUrl: './job-listings.component.scss',
})
export class JobListingsComponent implements OnInit, OnChanges {
  @Input() selectedTagData: any = {
    tab: '',
    selectedTag: '',
  };
  @Input() isApiRefreshed = new EventEmitter<any>();
  @Input() tagListData: any = [];
  @Input() dynamicTagDataList: any = [];
  @Input() isApi!: boolean;
  @ViewChildren('slides') slides!: any;

  public hashTagListItems: any = [];
  public userInfo: any;
  public isAdmin: boolean = false;
  private originalHashTagListItems: any = []; // Store original data
  private currentlySelectedTagId: string | null = null; // Track currently selected tag
  private removedHashTagCarousel: { item: any; index: number } | null = null;

  public carouselOptions: OwlOptions = {
    // loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 400,
    nav: false,
    navText: ['', ''],
    startPosition: 0,
    items: 5,
    margin: 18,
    lazyLoad: true,
    autoWidth: true,
    // rewind: true,
  };

  constructor(
    private jobService: JobService,
    public modalService: NgbModal,
    public commonService: CommonService,
    private apiService: ApiService
  ) {
    this.isAdmin = this.apiService.Role === ADMIN_ROLE || this.apiService.Role === CORPORATE_ROLE;
  }

  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO;
    this.loadData();
    this.isApiRefreshed?.subscribe((checkStatus) => {
      if (checkStatus) {
        if (this.selectedTagData?.tab === "JOB_LISTING") {
          this.loadSelectedTagData(this.selectedTagData.selectedTagId);
        } else {
          this.loadData();
        }
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isApi) {
      this.loadData();
    }
  }

  public loadData(): void {
    forkJoin(
      this.tagListData.map((item: any) =>
        this.jobService.getJobsByTagIdByID(item, 0)
      )
    ).subscribe((response: any) => {
      // Filter out inactive jobs for non-admin users
      this.hashTagListItems = response.map((tagGroup: any) => {
        if (tagGroup.data) {
          tagGroup.data = tagGroup.data.filter((job: any) => {
            return this.userInfo?.role === 'Admin' || job.status === 'Active';
          });
        }
        return tagGroup;
      });
      this.originalHashTagListItems = JSON.parse(JSON.stringify(this.hashTagListItems)); // Deep copy
    });
  }

  public apply(item: any) {
    const modalRef = this.modalService.open(JoblistingModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.viewData = item;
    modalRef.result.then((response) => {
      if (response) {
        item.applied = response;
        
        // Update applied status in all hashtag groups
        this.hashTagListItems.forEach((tagGroup: any) => {
          if (tagGroup.data) {
            tagGroup.data.forEach((job: any) => {
              if (job.jobId === item.jobId) {
                job.applied = response;
              }
            });
          }
        });

        // Update applied status in dynamic tag list
        this.dynamicTagDataList.forEach((job: any) => {
          if (job.jobId === item.jobId) {
            job.applied = response;
          }
        });
      }
    });
  }

  nextSlide(index: any,item:any) {
    let response: any = [];
    item.itemIndex++;
    if (item.data && (item.data.length > item.itemIndex)) {
      this.reRenderSlides(index);
    } else if (item.isApi) {
      item.pageCount = item.pageCount + 1;
      this.jobService.getJobsByTagIdByID({id: item.tagId}, item.pageCount).subscribe({
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

  public loadSelectedTagData(tagId: any): void {
    console.log('JobListings: loadSelectedTagData called with tagId', tagId, 'selectedTagData:', this.selectedTagData);
    if (this.currentlySelectedTagId === tagId) {
      this.dynamicTagDataList = [];
      this.currentlySelectedTagId = null;
      if (this.removedHashTagCarousel) {
        const { item, index } = this.removedHashTagCarousel;
        const insertIdx = index <= this.hashTagListItems.length ? index : this.hashTagListItems.length;
        this.hashTagListItems.splice(insertIdx, 0, item);
        this.removedHashTagCarousel = null;
      }
      return;
    }

    this.currentlySelectedTagId = tagId;
    this.dynamicTagDataList = [];
    if (this.removedHashTagCarousel) {
      const { item, index } = this.removedHashTagCarousel;
      const insertIdx = index <= this.hashTagListItems.length ? index : this.hashTagListItems.length;
      this.hashTagListItems.splice(insertIdx, 0, item);
      this.removedHashTagCarousel = null;
    }
 
    const currentIndex = this.hashTagListItems.findIndex((tg: any) => tg.tagId === tagId);
    if (currentIndex > -1) {
      const [removed] = this.hashTagListItems.splice(currentIndex, 1);
      this.removedHashTagCarousel = { item: removed, index: currentIndex };
    }
 
    this.jobService
      .getJobsByTagIdByID(this.selectedTagData.selectedTag, 0)
      .subscribe({
        next: (res: any) => {
          if (res.data.length > 0) {
            this.dynamicTagDataList = res.data;
          } else {
            // Show unified "No content" modal when no job listings match the selected tag
            const tagDesc = this.selectedTagData?.selectedTag?.description || 'this criteria';
            this.commonService.dialog({
              type: 'newErrorModal',
              header: 'No content',
              // message1: `No content found for ${tagDesc}`,
              message1: 'Stay tuned... We are bringing exciting opportunities for you!',
              btnName: 'OK'
            });
          }
        },
        error: (error) => {
          console.log(error.message);
        },
      });
  }

   /**
   * @returns void
   */
   public reRenderSlides(index: any): void {
    setTimeout(() => {
      this.slides._results[index].next();
    }, 50);
  }

  prevSlide(index: any) {
    this.slides._results[index].prev();
  }
}
