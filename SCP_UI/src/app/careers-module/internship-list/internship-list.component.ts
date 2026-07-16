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
import { InternshipModalComponent } from '../internships/modals/internship-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { InternshipRecivedComponent } from '../modals/internship-recived/internship-recived.component';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-internship-list',
  templateUrl: './internship-list.component.html',
  styleUrl: './internship-list.component.scss',
})
export class InternshipListComponent implements OnInit, OnChanges, OnDestroy {
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
      fieldName: 'Position',
      isSort: true,
      sort: true,
      sortFieldName: 'title',
      width: '10%',
    },
    {
      fieldName: 'Duration',
      isSort: true,
      sort: true,
      sortFieldName: 'duration',
    },
    {
      fieldName: 'Hashtags',
      isSort: true,
      sort: true,
      sortFieldName: 'tags',
    },
    {
      fieldName: 'Location',
      isSort: true,
      sort: true,
      sortFieldName: 'location',
    },
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
  /**
   * Tracks whether an initial data fetch has already been triggered. This helps
   * us (a) keep the original fix that removed duplicate rows caused by two
   * consecutive fetches, while (b) still allowing the component to work when
   * it is rendered with no bound @Input()s (e.g. inside the student profile
   * module). ngOnChanges won't fire in that scenario, so we fall back to an
   * ngOnInit-based fetch only if we haven't already called loadData().
   */
  private dataFetched = false;
  private careerAddedSub!: Subscription;

  constructor(
    public commonService: CommonService,
    private careerService: CareerService,
    public modalService: NgbModal,
    private router: Router
  ) {}
  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO;
    // Determine if we are inside the student-profile view ("/user-profile" routes)
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
    // If ngOnChanges didn't trigger (because there are no bound @Input()s),
    // we need to fetch the first page here. Guard with dataFetched to ensure
    // we don't fire twice when both lifecycle hooks run.
    if (!this.dataFetched) {
      const payload = { filters: [], page: this.page, size: 10 };
      this.loadData(payload);
      this.dataFetched = true;
    }
    // Subscribe to real-time additions
    this.careerAddedSub = this.careerService.careerAdded$.subscribe((type) => {
      if (type === 'INTERNSHIP') {
        this.refreshList();
      }
    });
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
    this.dataFetched = true;
  }

  private loadData(payload: any): void {
    this.careerService.getListInternships(payload).subscribe({
      next: (res: any) => {
        if (res.data.length > 0) {
          let filteredData = this.userInfo.role === 'Admin'
              ? res.data
              : res.data.filter((item: any) => item.status === 'Active');

          // If viewing from student profile, show only careers the user applied for
          if (this.showOnlyApplied && this.userInfo.role === 'Student') {
            filteredData = filteredData.filter((item: any) => item.applied);
          }

          // Format the data to properly display tags
          const formattedData = filteredData.map((v: any) => {
            const tags = v.tags
              .map((tag: any) => tag?.hashTag?.description)
              .join(' / ');
            const total = v?.selectedCount + v?.rejectedCount + v?.appliedCount;
            const reviewStatus = v.reviewStatus
              ? v.reviewStatus.toUpperCase()
              : v.applied
              ? 'PENDING'
              : '';

            const obj = {
              ...v,
              tags,
              total,
              reviewStatus,
            };

            // If we are in student-profile view, fetch the actual review status
            if (this.showOnlyApplied && this.userInfo.role === 'Student') {
              this.fetchReviewStatus(obj);
            }

            return obj;
          });

          this.all_data = [...this.all_data, ...formattedData];
          this.isdata = res.data.length < 10; // Set isdata to true only if we got less than 10 items
        } else {
          this.isdata = true; // No more data to load
        }
      },
      error: (error: Error) => {
        console.log(error.message);
        this.isdata = true; // Stop loading on error
      },
    });
  }

  /**
   * Fetches the current student's application status (Accepted/Rejected/Pending)
   * for a specific internship and patches the given row object.
   */
  private fetchReviewStatus(row: any): void {
    const payload = {
      type: 'INTERNSHIP',
      id: row.internshipId,
      page: 0,
      size: 1000,
      status: ''
    } as any;

    this.careerService.getCareerAppliedList(payload).subscribe({
      next: (res: any) => {
        const myRecord = (res?.data || []).find(
          (r: any) => r.userId === this.userInfo.userId
        );
        if (myRecord?.status) {
          row.reviewStatus = this.normalizeStatus(myRecord.status);
        }
      },
      error: () => {
        // ignore – we'll keep default value
      },
    });
  }

  /** Map backend status strings to UI values */
  private normalizeStatus(status: string): string {
    const s = status?.toUpperCase() || '';
    if (s === 'APPLIED') {
      return 'PENDING';
    }
    if (s === 'SELECTED') {
      return 'ACCEPTED';
    }
    return s; // ACCEPTED / REJECTED
  }

  public apply(item: any) {
    if (!this.activeTooltipId) {
      const modalRef = this.modalService.open(InternshipModalComponent, {
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
    this.activeTooltipId = row.internshipId;
  }

  @HostListener('document:click', ['$event']) onDocumentClick($event: any) {
    this.activeTooltipId = null;
  }

  updateInternshipStatus(type: string, item: any) {
    let payload = {
      careerType: 'INTERNSHIP',
      id: item.internshipId,
      reason: 'Reason test',
      status: type,
    };

    this.careerService.updateCareerStatus(payload).subscribe({
      next: (res) => {
        if (res.success) {
          if (type == 'Delete') {
            this.all_data = this.all_data.filter(
              (val: any) => val.internshipId != item.internshipId
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
      this.careerService.getListInternships(payload).subscribe({
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

            this.all_data = this.all_data.concat(formattedData);
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
      const modalRef = this.modalService.open(InternshipRecivedComponent, {
        backdrop: 'static',
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
        const newTotal = Math.max(
          0,
          item.selectedCount + item.rejectedCount + item.appliedCount
        );

        item.total = newTotal;
      });
    }
  }

  public loadSelectedTagData(): void {
    this.careerService
      .getInternshipByID({ id: this.tag }, this.page)
      .subscribe({
        next: (res: any) => {
          let filteredData = this.userInfo.role === 'Admin'
            ? res.data
            : res.data.filter((item: any) => item.status === 'Active');

          if (this.showOnlyApplied && this.userInfo.role === 'Student') {
            filteredData = filteredData.filter((item: any) => item.applied);
          }

          if (filteredData.length > 0) {
            const formattedData = filteredData.map((v: any) => {
              const tags = v.tags
                .map((tag: any) => tag?.hashTag?.description)
                .join(' / ');
              const total = v?.selectedCount + v?.rejectedCount + v?.appliedCount;
              const reviewStatus = v.reviewStatus
                ? v.reviewStatus.toUpperCase()
                : v.applied
                ? 'PENDING'
                : '';

              const obj = {
                ...v,
                tags,
                total,
                reviewStatus,
              };

              if (this.showOnlyApplied && this.userInfo.role === 'Student') {
                this.fetchReviewStatus(obj);
              }

              return obj;
            });
            this.all_data = [...this.all_data, ...formattedData];
            this.isdata = filteredData.length < 10;
          } else if (this.page === 0) {
            // Show unified modal when no data
            const tagName = this.tagDescription || 'this tag';
            this.commonService.dialog({
              type: 'newErrorModal',
              header: 'No content',
              // message1: `No internships found for ${tagName}`,
              message1: 'Stay tuned... We are bringing exciting opportunities for you!',
              btnName: 'OK'
            });
            this.isdata = true; // No data
          }
        },
        error: (error) => {
          console.log(error.message);
          this.isdata = true; // Stop loading on error
        },
      });
  }

  trackById(index: number, item: any) {
    console.log('ROW', index, item?.internshipId, item?.reviewStatus);
    return item?.internshipId ?? index;
  }

  /** Reset pagination and reload data */
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
