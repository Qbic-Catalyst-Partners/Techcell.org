import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChildren,
} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CareerService } from '../career.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin, take } from 'rxjs';
import { JobService } from '../job-listings/_service/job.service';
import { CommonService } from '../../common/common.service';
import { ProjectModalComponent } from './project-modal/project-modal.component';
import { ApiService } from '../../shared/services/api.service';
import { ADMIN_ROLE, CORPORATE_ROLE } from '../../common/constants';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnChanges {
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
  public isAdmin: boolean = false;
  private originalHashTagListItems: any = []; // Store original data
  private currentlySelectedTagId: string | null = null; // Track currently selected tag
  private removedHashTagCarousel: { item: any; index: number } | null = null; // store removed group

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
    this.loadData();
    this.isApiRefreshed?.subscribe((checkStatus) => {
      if (checkStatus) {
        if (this.selectedTagData?.tab === 'PROJECT') {
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
        this.jobService.getProjectByTagIdByID(item, 0)
      )
    ).subscribe((response: any) => {
      this.hashTagListItems = response;
      this.originalHashTagListItems = JSON.parse(JSON.stringify(response)); // Deep copy
    });
  }

  public apply(item: any) {
    const modalRef = this.modalService.open(ProjectModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.viewData = item;
    modalRef.result.then((response) => {
      if (response) {
        item.applied = response;
        
        this.hashTagListItems.forEach((tagGroup: any) => {
          if (tagGroup.data) {
            tagGroup.data.forEach((project: any) => {
              if (project.id === item.id) {
                project.applied = response;
              }
            });
          }
        });

        this.dynamicTagDataList.forEach((project: any) => {
          if (project.id === item.id) {
            project.applied = response;
          }
        });
      }
    });
  }

  public loadSelectedTagData(tagId: any): void {
    console.log('Projects: loadSelectedTagData called with tagId', tagId, 'selectedTagData:', this.selectedTagData);
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
    // Restore previous carousel if any
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
      .getProjectByTagIdByID(this.selectedTagData.selectedTag, 0)
      .subscribe({
        next: (res: any) => {
          if (res.data.length > 0) {
            this.dynamicTagDataList = res.data;
          } else {
            // Show unified "No content" modal when no projects match the selected tag
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

  nextSlide(index: any, item: any) {
    let response: any = [];
    item.itemIndex++;
    if (item.data && item.data.length > item.itemIndex) {
      this.reRenderSlides(index);
    } else if (item.isApi) {
      item.pageCount = item.pageCount + 1;
      this.jobService
        .getProjectByTagIdByID({ id: item.tagId }, item.pageCount)
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

  prevSlide(index: any) {
    this.slides._results[index].prev();
  }
}
