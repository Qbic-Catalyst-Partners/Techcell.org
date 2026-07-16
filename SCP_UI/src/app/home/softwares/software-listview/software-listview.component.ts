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
import { SoftwareService } from '../service/software.service';
import { CommonService } from '../../../shared/services/common.service';
import { AuthUtils } from '../../../shared/utility/auth-utils';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-software-listview',
  templateUrl: './software-listview.component.html',
  styleUrl: './software-listview.component.scss',
})
export class SoftwareListviewComponent implements OnChanges, OnInit, OnDestroy {
  @Input() tagId!: number;
  @Input() tagName: string = '';
  @Output() closeEvent = new EventEmitter<void>();

  page: number = 0;
  @Input() filterData: any;
  public header_data: any[] = [
    {
      fieldName: 'Software Title',
      isSort: true,
      sort: true,
      sortFieldName: 'softwareName',
    },
    {
      fieldName: 'Version',
      isSort: true,
      sort: true,
      sortFieldName: 'version',
    },
    {
      fieldName: 'Release Date',
      isSort: true,
      sort: true,
      sortFieldName: 'releaseDate',
    },
    {
      fieldName: 'OS Supported',
      isSort: true,
      sort: true,
      sortFieldName: 'osSupported',
    },
    {
      fieldName: 'Hashtags',
      isSort: true,
      sort: true,
    },
    {
      fieldName: 'Free/Paid',
      isSort: true,
      sort: true,
      sortFieldName: 'licenceType',
    },
    { fieldName: 'Download', isSort: false, sort: false },
  ];
  public all_data: any[] = [];
  public userInfo: any;
  activeTooltipId: any;
  public sortOptions: { column: string; direction: 'asc' | 'desc' }[] = [];
  sortActive: any;
  filterApiData: any;
  isdata: boolean = false;
  isLoading: boolean = false;
  private softwareAddedSub!: Subscription;

  constructor(
    private softwareService: SoftwareService,
    public commonService: CommonService,
    public modalService: NgbModal
  ) {}

  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO;
    if (this.userInfo.role == 'Admin') {
      this.header_data.push(
        {
          fieldName: 'Status',
          isSort: true,
          sort: true,
          sortFieldName: 'status',
        },
        { fieldName: 'Action', isSort: false, sort: false }
      );
    }

    // Listen for newly added software
    this.softwareAddedSub = this.softwareService.softwareAdded$.subscribe(() => {
      this.refreshList();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.all_data = [];
    this.page = 0;
    if (this.tagId) {
      this.getSoftwareByTagId(this.tagId);
    } else {
      let payload = {
        documentTypeEnum: 'SOFTWARE',
        filters: [],
        page: this.page,
        size: 10,
      };
      this.loadData(payload);
    }
  }

  loadData(payload: any) {
    this.isLoading = true;
    this.softwareService.getAllSoftwares(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.data) {
          let mappedData = res.data
            // Exclude deleted items universally
            .filter((item: any) => item.status !== 'Delete')
            .map((v: any) => {
              const tags = v.hashTagResponseDTOs
                .map((tag: any) => tag?.hashTag?.description)
                .join(' / ');
              return {
                ...v,
                releaseDate: this.commonService.convertDate(v.releaseDate),
                thumbnail: `data:image/jpeg;charset=utf-8;base64,${v.thumbnail}`,
                tags: tags,
                postingTags: v.hashTagResponseDTOs, // Add this for sorting
              };
            });

          if (this.userInfo.role !== 'Admin') {
            // Filter out inactive software for non-admin users
            mappedData = mappedData.filter(
              (item: any) => item.status === 'Active'
            );
          }

          this.all_data = [...this.all_data, ...mappedData];
          this.isdata = res.data.length === 0;
          // show no content modal
          if (this.tagId && this.tagName && this.all_data.length === 0) {
            this.commonService.dialog(
              'newErrorModal',
              `No content found for ${this.tagName}`,
              '',
              'OK',
              'No content'
            );
          }
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  sortByColumn(columnName: string) {
    const index = this.sortOptions.findIndex(
      (option) => option.column === columnName
    );
    if (index > -1) {
      // If the column is already in the sorting options, toggle its direction
      this.sortOptions[index].direction =
        this.sortOptions[index].direction === 'asc' ? 'desc' : 'asc';
    } else {
      // If it's a new column, add it to the sorting options with ascending direction
      this.sortOptions.push({ column: columnName, direction: 'asc' });
    }
    // Remove any other column from sorting options
    this.sortOptions = this.sortOptions.filter(
      (option) => option.column === columnName
    );
    // Sort the data
    this.sortData();
  }

  sortData() {
    this.all_data.sort((start: any, end: any) => {
      for (const sortOption of this.sortOptions) {
        const column = sortOption.column;
        const direction = sortOption.direction === 'asc' ? 1 : -1;
        if (start[column] > end[column]) {
          return direction;
        } else if (start[column] < end[column]) {
          return -direction;
        }
      }
      return 0; // If all sorted columns are equal
    });
  }

  public downloadSoftware(row: any) {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
      windowClass: 'modal-top',
    });

    modalRef.componentInstance.modalConfig = {
      type: 'careerApplyModal',
      header: 'Download Software',
      message1: 'Thank you for your interest! Click Download to begin downloading this application.',
      btnName: 'Download',
    } as any;

    modalRef.result
      .then((res: any) => {
        if (res === 'Download' && row?.softwarelink) {
          window.open(row.softwarelink, '_blank')?.focus();
        }
      })
      .catch(() => {});
  }

  getSoftwareByTagId(tagId: number) {
    this.isLoading = true;
    this.softwareService.getSoftwareByTagId(this.page, tagId).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.isdata = res?.data && res.data.length == 0 ? true : false;
        this.all_data = this.all_data.concat(
          res.data
            // Exclude deleted items universally
            .filter((item: any) => item.status !== 'Delete')
            .map((v: any) => {
              const tags = v.hashTagResponseDTOs
                .map((tag: any) => tag?.hashTag?.description)
                .join(' / ');
              return {
                ...v,
                releaseDate: this.commonService.convertDate(v.releaseDate),
                thumbnail: `data:image/jpeg;charset=utf-8;base64,${v.thumbnail}`,
                tags: tags,
                postingTags: v.hashTagResponseDTOs, // Add this for sorting
              };
            })
        );

        if (this.all_data.length === 0 && this.tagId && this.tagName) {
          this.commonService.dialog(
            'newErrorModal',
            `No content found for ${this.tagName}`,
            '',
            'OK',
            'No content'
          );
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
      },
    });
  }

  getData(fetchData: boolean) {
    if (fetchData && !this.isdata) {
      this.page = this.page + 1;
      if (this.sortActive) {
        let payload = {
          direction: this.sortActive?.sort == true ? 'asc' : 'desc',
          documentTypeEnum: 'SOFTWARE',
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
        this.getSoftwareByTagId(this.tagId);
      } else {
        let payload = {
          documentTypeEnum: 'SOFTWARE',
          filters: this.filterApiData,
          page: this.page,
          size: 10,
        };
        this.loadData(payload);
      }
    }
  }

  toggleAction(item: any) {
    this.activeTooltipId = item.id;
  }

  toggleTooltip(tooltip: any) {
    tooltip.toggle();
  }

  @HostListener('document:click', ['$event']) onDocumentClick($event: any) {
    this.activeTooltipId = null;
  }

  updateStatus(type: string, item: any) {
    let payload = {
      id: item.id,
      status: type,
    };
    this.softwareService.updateSoftwareStatus(payload).subscribe({
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
    let payload = {
      direction: column.sort == true ? 'asc' : 'desc',
      documentTypeEnum: 'SOFTWARE',
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

  close() {
    this.closeEvent.emit();
    console.log('Close modal clicked in software list view');
  }

  ngOnDestroy(): void {
    if (this.softwareAddedSub) {
      this.softwareAddedSub.unsubscribe();
    }
  }

  private refreshList(): void {
    this.page = 0;
    this.all_data = [];

    if (this.tagId) {
      this.getSoftwareByTagId(this.tagId);
    } else {
      let payload = {
        documentTypeEnum: 'SOFTWARE',
        filters: [],
        page: this.page,
        size: 10,
      };
      this.loadData(payload);
    }
  }
}
