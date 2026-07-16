import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonService } from '../../common/common.service';
import { CareerService } from '../career.service';
import { ProjectModalComponent } from '../projects/project-modal/project-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { ProjectRecivedComponent } from '../modals/project-recived/project-recived.component';
import { JobService } from '../job-listings/_service/job.service';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss',
})
export class ProjectListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isApi!: boolean;
  @Input() filterData: any;
  @Input() tag: any;
  @Input() tagDescription: string | null = null;

  page: number = 0;
  public header_data: any[] = [
    {
      fieldName: 'Company Name',
      isSort: true,
      sort: true,
      sortFieldName: 'companyName',
    },
    {
      fieldName: 'Project Title',
      isSort: true,
      sort: true,
      sortFieldName: 'title',
    },
    {
      fieldName: 'Duration',
      isSort: true,
      sort: true,
      sortFieldName: 'duration',
    },
    { fieldName: 'Hashtags', isSort: true, sort: true, sortFieldName: 'tags' },
    { fieldName: 'Teams', isSort: true, sort: true, sortFieldName: 'teamSize' },
    {
      fieldName: 'Last Date To Apply',
      isSort: true,
      sort: true,
      sortFieldName: 'endDate',
    },
  ];
  public all_data: any[] = [];
  public userInfo: any;
  activeTooltipId: any;
  filterApiData: any;
  sortActive: any;
  isdata: boolean = false;
  public showOnlyApplied: boolean = false;
  /** Flag to prevent duplicate initial fetch */
  private dataFetched = false;
  private careerAddedSub!: Subscription;
  appliedCount: number = 0;
  selectedCount: number = 0;
  rejectedCount: number = 0;
  totalCount: number = 0;
  constructor(
    public commonService: CommonService,
    private careerService: CareerService,
    public modalService: NgbModal,
    private jobService: JobService,
    private router: Router
  ) {}
  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO;
    // Determine context (student-profile vs public)
    this.showOnlyApplied = this.router.url.includes('/user-profile/');
    if (this.userInfo.role == 'Admin') {
      this.header_data.push(
        {
          fieldName: 'Applications Received (Accept/Reject/Pending)',
          isSort: true,
          sort: true,
          sortFieldName: 'total',
          width: '15%',
        },
        {
          fieldName: 'Status',
          isSort: true,
          sort: true,
          sortFieldName: 'status',
        },
        { fieldName: 'Action', isSort: false, sort: false }
      );
    } else if (this.userInfo.role == 'Student') {
      if (this.showOnlyApplied) {
        this.header_data.push({
          fieldName: 'Review Status',
          isSort: true,
          sort: true,
          sortFieldName: 'reviewStatus',
        });
      } else {
        this.header_data.push({
          fieldName: 'Status',
          isSort: true,
          sort: true,
          sortFieldName: 'status',
        });
      }
    }
    // Fallback: if ngOnChanges didn't fire (no bound inputs) fetch data once.
    if (!this.dataFetched) {
      const payload = { filters: [], page: this.page, size: 10 };
      this.loadData(payload);
      this.dataFetched = true;
    }
    // Subscribe to real-time project additions
    this.careerAddedSub = this.careerService.careerAdded$.subscribe((type) => {
      if (type === 'PROJECT') {
        this.refreshList();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterApiData = [];
    this.all_data = [];
    this.page = 0;
    if (this.isApi) {
      let payload = {
        filters: this.filterApiData,
        page: this.page,
        size: 10,
      };
      this.loadData(payload);
    } else if (this.tag) {
      this.loadSelectedTagData();
    } else {
      if (this.filterData && this.filterData.length > 0) {
        this.filterApiData = this.commonService.searchingFilterDataPreparation(
          this.filterData
        );
      }
      let payload = {
        filters: this.filterApiData,
        page: this.page,
        size: 10,
      };
      this.loadData(payload);
    }
  }

  getData(fetchData: boolean) {
    if (fetchData && !this.isdata) {
      this.page = this.page + 1;
      if (this.sortActive) {
        let payload = {
          direction: this.sortActive?.sort == true ? 'asc' : 'desc',
          filters:
            this.filterApiData && this.filterApiData.length
              ? this.filterApiData
              : [],
          page: this.page,
          size: 10,
          sortBy: this.sortActive?.sortFieldName,
        };
        this.loadData(payload);
      } else if (this.tag) {
        this.loadSelectedTagData();
      } else {
        let payload = {
          filters: this.filterApiData,
          page: this.page,
          size: 10,
        };
        this.loadData(payload);
      }
    }
  }

  private loadData(payload: any): void {
    this.careerService.getListProjects(payload).subscribe((res: any) => {
      this.isdata = res?.data && res.data.length == 0 ? true : false;
      let filteredRes = res.data;

      // Filter out inactive for students
      if (this.userInfo.role !== 'Admin') {
        filteredRes = filteredRes.filter((item: any) => item.status === 'Active');
      }

      if (this.showOnlyApplied && this.userInfo.role === 'Student') {
        filteredRes = filteredRes.filter((item:any)=> item.applied);
      }

      // Filter out duplicates before adding
      const existingIds = new Set(this.all_data.map(item => item.id));
      const newItems = filteredRes.filter((item: any) => !existingIds.has(item.id));
      
      this.all_data = this.all_data.concat(
        newItems
          .map((v: any) => {
            const tags = v.tags
              .map((tag: any) => tag?.hashTag?.description)
              .join(' / ');
            const reviewStatus = v.reviewStatus
              ? v.reviewStatus.toUpperCase()
              : v.applied
              ? 'PENDING'
              : '';
            const obj = {
              ...v,
              tags,
              total: v?.selectedCount + v?.rejectedCount + v?.appliedCount,
              reviewStatus,
            };

            if (this.showOnlyApplied && this.userInfo.role === 'Student') {
              this.fetchReviewStatus(obj);
            }
            return obj;
          })
      );
      this.dataFetched = true;
    });
  }

  /**
   * Fetch the review status for current student for a project.
   */
  private fetchReviewStatus(row: any): void {
    const payload = {
      type: 'PROJECT',
      id: row.projectId ?? row.id,
      page: 0,
      size: 1000,
      status: ''
    } as any;

    this.careerService.getCareerAppliedList(payload).subscribe({
      next: (res: any) => {
        const myRecord = (res?.data || []).find((r:any)=> {
          if (r.userId === this.userInfo.userId) return true; // leader
          // member case: check nested members array
          if (Array.isArray(r.members)) {
            return r.members.some((m:any)=> m.userId === this.userInfo.userId);
          }
          return false;
        });

        if (myRecord?.status) {
          row.reviewStatus = this.normalizeStatus(myRecord.status);
        }
      }
    });
  }

  private normalizeStatus(status:string):string {
    const s = status?.toUpperCase() || '';
    if(s==='APPLIED') return 'PENDING';
    if(s==='SELECTED') return 'ACCEPTED';
    return s;
  }

  public apply(item: any) {
    if (!this.activeTooltipId) {
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
          item.reviewStatus = 'PENDING';
        }
      });
    }
  }

  toggleTooltip(tooltip: NgbTooltip) {
    tooltip.toggle();
  }

  toggleAction(row: any) {
    this.activeTooltipId = row.id;
  }

  @HostListener('document:click', ['$event']) onDocumentClick($event: any) {
    this.activeTooltipId = null;
  }

  updateInternshipStatus(type: string, item: any) {
    let payload = {
      careerType: 'PROJECT',
      id: item.id,
      reason: 'Reason test',
      status: type,
    };
    // console.log({item,type})
    this.careerService.updateCareerStatus(payload).subscribe({
      next: (res) => {
        if (res.success) {
          if (type == 'Delete') {
            this.all_data = this.all_data.filter(
              (val: any) => val.id != item.id
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

    // If sorting by total applications or applied status, do client-side sorting
    if (
      column.sortFieldName === 'total' ||
      (this.userInfo.role === 'Student' && column.sortFieldName === 'applied')
    ) {
      let payload = {
        filters:
          this.filterApiData && this.filterApiData.length
            ? this.filterApiData
            : [],
        page: this.page,
        size: 10,
      };
      this.careerService.getListProjects(payload).subscribe({
        next: (res: any) => {
          if (res.data.length > 0) {
            const filteredData =
              this.userInfo.role === 'Admin'
                ? res.data
                : res.data.filter((item: any) => item.status === 'Active');
            const formattedData = filteredData.map((v: any) => {
              const tags = v.tags
                .map((tag: any) => tag?.hashTag?.description)
                .join(' / ');
              const total =
                v?.selectedCount + v?.rejectedCount + v?.appliedCount;
              return { ...v, tags: tags, total: total };
            });

            // Sort the data based on the column
            formattedData.sort((a: any, b: any) => {
              if (column.sortFieldName === 'total') {
                if (column.sort) {
                  return a.total - b.total; // ascending
                } else {
                  return b.total - a.total; // descending
                }
              } else {
                // For applied status
                if (column.sort) {
                  return a.applied === b.applied ? 0 : a.applied ? -1 : 1; // ascending
                } else {
                  return a.applied === b.applied ? 0 : a.applied ? 1 : -1; // descending
                }
              }
            });

            // Filter out duplicates before adding
            const existingIds = new Set(this.all_data.map(item => item.id));
            const newItems = formattedData.filter((item: any) => !existingIds.has(item.id));
            
            this.all_data = this.all_data.concat(newItems);
            this.isdata = true;
          } else {
            this.isdata = false;
          }
        },
        error: (error: Error) => {
          console.log(error.message);
        },
      });
    } else {
      // For all other columns, use server-side sorting
      let payload = {
        direction: column.sort == true ? 'asc' : 'desc',
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
  }

  openModal(item: any, type: string, count: number) {
    if (count) {
      const modalRef = this.modalService.open(ProjectRecivedComponent, {
        keyboard: true,
        size: 'lg',
        centered: true,
      });
      modalRef.componentInstance.data = { ...item, statusType: type };

      // Subscribe to status updates
      modalRef.componentInstance.statusUpdated.subscribe((update: any) => {
        // Use exact status values
        const oldStatus = update.oldStatus;
        const newStatus = update.newStatus;

        // Update counts based on status change
        if (oldStatus === 'Applied') {
          item.appliedCount = Math.max(0, item.appliedCount - 1);
        } else if (oldStatus === 'Accepted') {
          item.selectedCount = Math.max(0, item.selectedCount - 1);
        } else if (oldStatus === 'Rejected') {
          item.rejectedCount = Math.max(0, item.rejectedCount - 1);
        }

        if (newStatus === 'Applied') {
          item.appliedCount++;
        } else if (newStatus === 'Accepted') {
          item.selectedCount++;
        } else if (newStatus === 'Rejected') {
          item.rejectedCount++;
        }

        // Update total count and ensure it's never negative
        item.total = Math.max(
          0,
          item.selectedCount + item.rejectedCount + item.appliedCount
        );
      });
    }
  }

  public loadSelectedTagData(): void {
    this.jobService
      .getProjectByTagIdByID({ id: this.tag }, this.page)
      .subscribe({
        next: (res: any) => {
          this.isdata = res?.data && res.data.length == 0 ? true : false;
          if (res.data.length > 0) {
            let dataArr = res.data;
            if (this.userInfo.role !== 'Admin') {
              dataArr = dataArr.filter((item:any)=> item.status === 'Active');
            }
            if (this.showOnlyApplied && this.userInfo.role === 'Student') {
              dataArr = dataArr.filter((item:any)=> item.applied);
            }
            // Filter out duplicates before adding
            const existingIds = new Set(this.all_data.map(item => item.id));
            const newItems = dataArr.filter((item: any) => !existingIds.has(item.id));
            
            this.all_data = this.all_data.concat(
              newItems
                .map((v: any) => {
                  const tags = v.tags
                    .map((tag: any) => tag?.hashTag?.description)
                    .join(' / ');
                  const reviewStatus = v.reviewStatus
                    ? v.reviewStatus.toUpperCase()
                    : v.applied
                    ? 'PENDING'
                    : '';
                  const obj = {
                    ...v,
                    tags,
                    total: v?.selectedCount + v?.rejectedCount + v?.appliedCount,
                    reviewStatus,
                  };

                  if (this.showOnlyApplied && this.userInfo.role === 'Student') {
                    this.fetchReviewStatus(obj);
                  }

                  return obj;
                })
                .filter((project: any) => {
                  // Show all projects for admin, only active projects for students
                  return (
                    this.userInfo.role === 'Admin' ||
                    project.status === 'Active'
                  );
                })
            );
          } else if (this.page === 0) {
            // Show error modal only on first page when no data
            const tagName = this.tagDescription || 'this tag';
            this.commonService.dialog({
              type: 'newErrorModal',
              header: 'No content',
              // message1: `No projects found for ${tagName}`,
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

  /** Refresh list data */
  public refreshList(): void {
    this.all_data = [];
    this.page = 0;
    if (this.tag) {
      this.loadSelectedTagData();
    } else {
      const payload = { filters: this.filterApiData || [], page: this.page, size: 10 };
      this.loadData(payload);
    }
  }

  ngOnDestroy(): void {
    if (this.careerAddedSub) {
      this.careerAddedSub.unsubscribe();
    }
  }
}
