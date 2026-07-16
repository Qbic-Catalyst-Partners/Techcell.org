import { Component, EventEmitter, OnInit } from '@angular/core';
import { AddJobListingModalComponent } from './modals/add-job-listing-modal/add-job-listing-modal.component';
import { AddProjectModalComponent } from './modals/add-project-modal/add-project-modal.component';
import { AddInternshipModalComponent } from './modals/add-internship-modal/add-internship-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../common/common.service';
import { VideoService } from '../../home/videos/service/video.service';
import { CareerService } from '../career.service';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { AddCertificationModalComponent } from './modals/add-certification-modal/add-certification-modal.component';
import { FilterSearchComponent } from '../../shared/component/filter-search/filter-search.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrl: './careers.component.scss',
})
export class CareersComponent implements OnInit {
  public currentTab: any = 'INTERNSHIP';
  public hashTagList: any = [];
  public hashTagListItems: any = [];
  public dynamicTagVideoList: any = [];
  public dynamicTagDataList: any = [];
  public currTagId: any;
  public isApiRefreshed = new EventEmitter<boolean>();
  public viewType: string = 'grid';
  public term!: string;
  public userInfo: any;
  public selectedTag: any = null;
  public selectedTagData: any = {
    selectedTag: null,
    tab: null,
    selectedTagId: null
  };

  public pageCounts = {
    favouritePageCount: 0,
    myVideosPageCount: 0,
    dynamicVideoPageCount: 0,
  };

  filterInternship: any = [
    {
      seq: 1,
      field: 'companyName',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Company Name',
    },
    {
      seq: 2,
      field: 'duration',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Duration',
    },
    {
      seq: 3,
      field: 'location',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Location',
    },
    {
      seq: 4,
      field: 'endDate',
      operator: null,
      value: { from: null, to: null },
      fieldType: 'date',
      displayName: 'Last Date to apply',
    },
  ];
  filterProject: any = [
    {
      seq: 1,
      field: 'companyName',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Company Name',
    },
    {
      seq: 2,
      field: 'title',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Project Title',
    },
    {
      seq: 3,
      field: 'location',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Location',
    },
    {
      seq: 4,
      field: 'endDate',
      operator: null,
      value: { from: null, to: null },
      fieldType: 'date',
      displayName: 'Last Date to apply',
    },
  ];
  filterJobListing: any = [
    {
      seq: 1,
      field: 'companyName',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Company Name',
    },
    {
      seq: 2,
      field: 'designation',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Position',
    },
    {
      seq: 3,
      field: 'jobType',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Job Type',
    },
    {
      seq: 4,
      field: 'location',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Location',
    },
    {
      seq: 5,
      field: 'endDate',
      operator: null,
      value: { from: null, to: null },
      fieldType: 'date',
      displayName: 'Last Date to apply',
    },
  ];
  filterCertification: any = [
    {
      seq: 1,
      field: 'companyName',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Company Name',
    },
    {
      seq: 2,
      field: 'duration',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Duration',
    },
    {
      seq: 3,
      field: 'endDate',
      operator: null,
      value: { from: null, to: null },
      fieldType: 'date',
      displayName: 'Last Date to apply',
    },
  ];
  filterData: any = [];
  tabKey: any = [
    { key: 'INTERNSHIP', path: 'getInternshipsByTagId' },
    { key: 'PROJECT', path: 'getProjectByTagId' },
    { key: 'JOB_LISTING', path: 'getProjectByTagId' },
    { key: 'CERTIFICATION', path: 'getCertificationByTagId' },
  ];

  constructor(
    public modalService: NgbModal,
    private commonService: CommonService,
    private videoService: VideoService,
    private careerService: CareerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // read route data and query params
    this.route.data.subscribe((d) => {
      if (d && d['tab']) {
        this.currentTab = d['tab'];
        this.selectedTag = null;
        this.filterData = [];
      }
    });

    this.route.queryParamMap.subscribe((q) => {
      const view = q.get('view');
      this.viewType = view === 'list' ? 'list' : 'grid';
    });

    this.getAllHashTagList();
    this.loadUserRole();
    // const modalRef = this.modalService.open(AddCertificationModalComponent, {
    //   backdrop: 'static',
    //   keyboard: true,
    //   size: 'lg',
    //   centered: true,
    // });
  }

  loadUserRole() {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.userInfo = userData?.userDetailResponseDTO;
  }

  addModal(type: string) {
    switch (type) {
      case 'INTERNSHIP':
        const modalRef = this.modalService.open(AddInternshipModalComponent, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
        });
        modalRef.componentInstance.internshipAdded.subscribe(() => {
          this.isApiRefreshed.emit(true);
        });
        break;
      case 'PROJECT':
        const projectModalRef = this.modalService.open(AddProjectModalComponent, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
        });
        projectModalRef.componentInstance.projectAdded.subscribe(() => {
          this.isApiRefreshed.emit(true);
        });
        break;
      case 'JOB_LISTING':
        const jobListingModalRef = this.modalService.open(AddJobListingModalComponent, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
        });
        jobListingModalRef.componentInstance.jobListingAdded.subscribe(() => {
          this.isApiRefreshed.emit(true);
        });
        break;
      case 'CERTIFICATION':
        const certificationModalRef = this.modalService.open(AddCertificationModalComponent, {
          size: 'lg',
          backdrop: 'static',
          keyboard: false,
        });
        certificationModalRef.componentInstance.certificationAdded.subscribe(() => {
          this.isApiRefreshed.emit(true);
        });
        break;
    }
  }

  private addCertificationListingModal(): void {
    const modalRef = this.modalService.open(AddCertificationModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        let obj = {
          type: 'newSuccessModal',
          header: 'Success',
          message1: 'The Certification has been updated in the portal successfully',
          message2: '',
          btnName: 'Done',
        };
        this.commonService.dialog(obj);
      }
    });
  }

  private addJobListingModal(): void {
    const modalRef = this.modalService.open(AddJobListingModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        let obj = {
          type: 'newSuccessModal',
          header: 'Success',
          message1: 'The job vacancy has been updated in the portal successfully',
          message2: '',
          btnName: 'Done',
        };
        this.commonService.dialog(obj);
      }
    });
  }

  private addProjectModal(): void {
    const modalRef = this.modalService.open(AddProjectModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        let obj = {
          type: 'newSuccessModal',
          header: 'Success',
          message1: 'The project has been updated in the portal successfully',
          message2: '',
          btnName: 'Done',
        };
        this.commonService.dialog(obj);
      }
    });
  }

  private addInternshipModal(): void {
    const modalRef = this.modalService.open(AddInternshipModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        let obj = {
          type: 'newSuccessModal',
          header: 'Success',
          message1: 'The Internship program has been updated in the portal successfully',
          message2: '',
          btnName: 'Done',
        };
        this.commonService.dialog(obj);
      }
    });
  }

  getAllHashTagList() {
    this.videoService.getAllHashTagList().subscribe({
      next: (res: any) => {
        this.hashTagList = res.data;
        // this.loadAllHashTagItems();
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
        // this.getFavouriteListVideos(this.pageCounts.favouritePageCount);
        break;
      case 'videos':
        this.pageCounts.myVideosPageCount++;
        // this.getMyVideos(this.pageCounts.myVideosPageCount);
        break;
      case 'dynamic':
        this.pageCounts.dynamicVideoPageCount++;
        // this.getDynamicHashTagList(
        //   this.currTagId,
        //   this.pageCounts.dynamicVideoPageCount
        // );
        break;
    }
  }

  public getDynamicHashTagList(
    item: any,
    page: any,
    fromClick: any,
    currentTab: string
  ) {
    this.currTagId = item.tagId;
    this.selectedTag = item.id;
    fromClick ? (this.dynamicTagVideoList = []) : '';
    if (!this.selectedTagData) {
      this.selectedTagData = { selectedTag: null, tab: null, selectedTagId: null } as any;
    }
    this.selectedTagData.selectedTag = item;
    this.selectedTagData.selectedTagId = item.tagId || item.id;
    this.selectedTagData.tab = this.currentTab;
    console.log('Tag clicked:', item);
    console.log('Before emit, selectedTagData:', this.selectedTagData);
    if (this.viewType == 'grid') {
      console.log('Emitting isApiRefreshed for grid view');
      this.isApiRefreshed.emit(true);
    }
  }

  public viewList(view: 'grid' | 'list') {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: view === 'list' ? 'list' : null },
      queryParamsHandling: 'merge',
    });
  }

  openFilterSearch(modalType: any) {
    switch (modalType) {
      case 'INTERNSHIP':
        this.filterSearchModal(this.filterInternship);
        break;
      case 'PROJECT':
        this.filterSearchModal(this.filterProject);
        break;
      case 'JOB_LISTING':
        this.filterSearchModal(this.filterJobListing);
        break;
      case 'CERTIFICATION':
        this.filterSearchModal(this.filterCertification);
        break;
    }
  }

  filterSearchModal(filter: any) {
    const modalRef = this.modalService.open(FilterSearchComponent, {
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.filterSetting = filter;
    modalRef.result.then((response) => {
      this.filterData =
        this.commonService.searchingFilterRemoveDuplicate(response);
    });
  }

  public getSearchText(event: any) {
    this.term = event.target.value;
  }

  public cancelTag() {
    this.selectedTag = null;
    this.selectedTagData = { selectedTag: null, tab: null, selectedTagId: null };
    if (this.viewType == 'grid') {
      this.isApiRefreshed.emit(true);
    }
  }
}
