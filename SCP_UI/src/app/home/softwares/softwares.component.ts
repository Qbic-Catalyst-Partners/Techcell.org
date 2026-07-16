import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { BlogService } from '../blog/service/blog.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddSoftwareComponent } from './modals/add-software/add-software.component';
import { ApiService } from '../../shared/services/api.service';
import { ADMIN_ROLE } from '../../common/constants';
import { FilterSearchComponent } from '../../shared/component/filter-search/filter-search.component';
import { CommonService } from '../../common/common.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-softwares',
  templateUrl: './softwares.component.html',
  styleUrl: './softwares.component.scss',
})
export class SoftwaresComponent {
  public hasAsscessToAdd: boolean = false;
  public hashTagList: any = [];
  public viewType: string = 'grid';
  tagDescription: string = '';
  tagId!: number;
  term!: string;
  role!: boolean;
  @Output() closeEvent = new EventEmitter<void>();

  filter: any = [
    {
      seq: 1,
      field: 'softwareName',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'software Name',
    },
    {
      seq: 2,
      field: 'version',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'Version',
    },
    {
      seq: 3,
      field: 'osSupported',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'osSupported',
    },
    {
      seq: 4,
      field: 'licenceType',
      operator: null,
      value: null,
      fieldType: 'input',
      displayName: 'licenceType',
    },
    {
      seq: 5,
      field: 'releaseDate',
      operator: null,
      value: { from: null, to: null },
      fieldType: 'date',
      displayName: 'Release Date',
    },
  ];
  filterData: any = [];

  constructor(
    private blogService: BlogService,
    public modalService: NgbModal,
    private apiService: ApiService,
    public commonService: CommonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((q) => {
      const v = q.get('view');
      this.viewType = v === 'list' ? 'list' : 'grid';
    });

    this.getAllHashTagList();
    this.role = this.apiService.Role == ADMIN_ROLE;
  }

  scrollTo(element: HTMLElement, direction: number) {
    element.scrollBy({
      left: direction * 200,
      behavior: 'smooth',
    });
  }

  public searchItems(evt: any) {}

  public addSoftware(): void {
    const modalRef = this.modalService.open(AddSoftwareComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.tagId = 0;
      }
    });
  }

  public getAllHashTagList(): void {
    this.blogService.getAllHashTagList().subscribe({
      next: (res: any) => {
        this.hashTagList = res.data;
      },
      error: (err: any) => {},
    });
  }

  getDynamicHashTagList(tagId: number, tagDescription: string, reset: boolean) {
    this.tagId = tagId;
    this.tagDescription = tagDescription;
    console.log(tagDescription);
  }

  public viewList(view: 'grid' | 'list') {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { view: view === 'list' ? 'list' : null },
      queryParamsHandling: 'merge',
    });

    this.viewType = view;
    this.tagId = 0;
    this.filterData = [];
    this.filter.forEach((v: any) => {
      if (v.fieldType == 'input') {
        v.value = null;
      } else {
        v.value = { from: null, to: null };
      }
    });
  }

  getSearchText(event: any) {
    if (event.target.value.length == 0 && !!this.tagId) {
      this.tagId = 0;
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
    this.tagId = 0;
    this.tagDescription = '';
  }

  close() {
    this.closeEvent.emit();
    console.log('Close modal clicked in software grid view');
  }
}
