import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from '../service/community.service';
import { BlogService } from '../../home/blog/service/blog.service';
import { AddCommunityComponent } from '../modals/add-community/add-community.component';
import { ApiService } from '../../shared/services/api.service';
import { ADMIN_ROLE } from '../../common/constants';
import { CommonService } from '../../shared/services/common.service';
import { CommunityListingComponent } from '../community-listing/community-listing.component';

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent {
  public hasAsscessToAdd: boolean = false;
  public hashTagList: any = [];
  public activeLink: string = 'suggested';
  public communityList: any = [];
  public suggestedData: any = [];
  term!: string;
  role!: boolean;
  selectedTag: any;
  @ViewChild(CommunityListingComponent) communityListing!: CommunityListingComponent;

  constructor(
    private blogService: BlogService,
    public modalService: NgbModal,
    public communityService: CommunityService,
    private apiService: ApiService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.getAllHashTagList();
    this.role = this.apiService.Role == ADMIN_ROLE;
  }

  public addCommunity(): void {
    const modalRef = this.modalService.open(AddCommunityComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.result.then((response) => {
      if (response) {
        this.selectedTag = null;
        // Reload hashtags so that any new tag is fetched; actual list refresh is handled
        // inside CommunityListingComponent via the communityAdded$ subscription.
        this.getAllHashTagList();
      }
    });
  }

  scrollTo(element: HTMLElement, direction: number) {
    element.scrollBy({
      left: direction * 200,
      behavior: 'smooth',
    });
  }

  public getAllHashTagList(): void {
    this.blogService.getAllHashTagList().subscribe({
      next: (res: any) => {
        // console.log(res.data);
        this.hashTagList = res.data;
      },
      error: (err: any) => {},
    });
  }

  public getDynamicHashTagList(tagId: any, page?: any, fromClick?: any) {
    this.selectedTag = tagId;
  }

  public activateLink(activeType: string) {
    this.activeLink = activeType;
  }

  getSearchText(event: any) {
    if (event.target.value.length == 0) {
      this.selectedTag = null;
    }
  }

  cancelTag() {
    this.selectedTag = null;
  }
}
