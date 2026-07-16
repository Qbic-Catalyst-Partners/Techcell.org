import { Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, OnDestroy } from '@angular/core';
import { CommunityService } from '../service/community.service';
import { SoftwareService } from '../../home/softwares/service/software.service';
import { CommonService } from '../../shared/services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { JoinComponent } from '../modals/join/join.component';
import { ADMIN_ROLE } from '../../common/constants';
import { ApiService } from '../../shared/services/api.service';
import { Width } from 'ngx-owl-carousel-o/lib/services/carousel.service';
import { VideoService } from '../../home/videos/service/video.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-community-listing',
  templateUrl: './community-listing.component.html',
  styleUrl: './community-listing.component.scss'
})
export class CommunityListingComponent implements OnChanges, OnInit, OnDestroy {
  @Input() tagId:any ;
  hideColumn:any = ['Created Date','Moderator','Members Count','Last Updated','Status','Action'];
  public header_data: any[] = [
    { fieldName: 'Community Name', isSort: true, sort: true, sortFieldName: 'title', visible: 'true' },
    { fieldName: 'Created Date', isSort: true, sort: true, sortFieldName: 'createdDate', width: '10', visible: 'false' },
    { fieldName: 'Moderator', isSort: true, sort: true, sortFieldName: 'moderator.firstName', visible: 'false' },
    { fieldName: 'Member Status', isSort: true, sort: true, sortFieldName: 'joined', width: '10', visible: 'true' },
    { fieldName: 'Members Count', isSort: true, sort: true, sortFieldName: 'community.memberCount', width: '10', visible: 'false' },
    { fieldName: 'Last Updated', isSort: true, sort: true, sortFieldName: 'updateddDate', width: '10', visible: 'false' }
  ];
  public headerList:any = [];
  public all_data: any[] = [];
  role!:boolean;
  page:number =0;
  public userInfo: any;
  activeTooltipId: any;
  isdata:boolean = false;
  mobileWidth:number  = 575;
  isMobile: boolean = false;
  width:number = window.innerWidth;
  public sortOptions: { column: string; direction: 'asc' | 'desc' }[] = [];
  currentColumn!:string;
  currentDirection!:boolean;
  private communityAddedSub!: Subscription;

  constructor(private softwareService: SoftwareService,
    private communityService :CommunityService,
    public commonService: CommonService,
    public modalService: NgbModal,
    public router: Router,
    private apiService : ApiService,
    private videoService:VideoService) {}
  ngOnInit(): void {
    let data: any = AuthUtils.getUserDetails();
    let userData = JSON.parse(data);
    this.isMobile = this.width < this.mobileWidth;
    this.userInfo = userData?.userDetailResponseDTO;
    if (this.userInfo.role == 'Admin') {
      this.header_data.push(
        { fieldName: 'Status', isSort: true, sort: true, sortFieldName: 'status', width: '10', visible: 'false' }
      );
    }
    this.reOrderData();

    // Listen for newly added communities elsewhere in the app
    this.communityAddedSub = this.communityService.communityAdded$.subscribe(() => {
      // Immediately refresh the list when a new community is announced
      this.refreshList();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.all_data = [];
    this.page = 0;
    if(this.tagId){
      this.getCommunityByTagId();
    }else{
      this.all_data = [];
      this.loadData();
    }
    this.role = this.apiService.Role == ADMIN_ROLE;
  }

  private loadData(column:string='',direction:string=''): void {
    // Map the column name to match backend expectations
    let orderByField = column;
    if (column === 'joined') {
      // For member status, we'll do client-side sorting
      this.communityService.getCommunityList(this.page).subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.data && res.data.length > 0) {
            const mappedData = res.data.map((item:any)=>{
              return {...item,community : {
                ...item?.community, coverPhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.coverPhoto}`,
                profilePhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.profilePhoto}`
              },
              createdDate:this.commonService.convertDate(item.createdDate),
              updateddDate:this.commonService.convertDate(item.updateddDate),
              joined:this.role ? true : item.joined
            }});
            
            // Sort by joined status
            mappedData.sort((a:any, b:any) => {
              if (direction === 'asc') {
                return (a.joined === b.joined) ? 0 : a.joined ? -1 : 1;
              } else {
                return (a.joined === b.joined) ? 0 : a.joined ? 1 : -1;
              }
            });
            
            if (this.page === 0) {
              this.all_data = mappedData;
            } else {
              this.all_data = this.all_data.concat(mappedData);
            }
          } else {
            this.isdata = true;
            if (this.page === 0) {
              this.all_data = [];
            }
          }
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isdata = true;
          if (this.page === 0) {
            this.all_data = [];
          }
        }
      });
      return;
    } else if (column === 'status') {
      // For community status, we'll do client-side sorting
      this.communityService.getCommunityList(this.page).subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.data && res.data.length > 0) {
            const mappedData = res.data.map((item:any)=>{
              return {...item,community : {
                ...item?.community, coverPhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.coverPhoto}`,
                profilePhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.profilePhoto}`
              },
              createdDate:this.commonService.convertDate(item.createdDate),
              updateddDate:this.commonService.convertDate(item.updateddDate),
              joined:this.role ? true : item.joined
            }});
            
            // Sort by community status
            mappedData.sort((a:any, b:any) => {
              const statusA = a.status || '';
              const statusB = b.status || '';
              console.log('Sorting status:', { 
                statusA, 
                statusB, 
                direction 
              });
              
              if (direction === 'asc') {
                return statusA.localeCompare(statusB);
              } else {
                return statusB.localeCompare(statusA);
              }
            });
            
            if (this.page === 0) {
              this.all_data = mappedData;
            } else {
              this.all_data = this.all_data.concat(mappedData);
            }
          } else {
            this.isdata = true;
            if (this.page === 0) {
              this.all_data = [];
            }
          }
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isdata = true;
          if (this.page === 0) {
            this.all_data = [];
          }
        }
      });
      return;
    } else if (column === 'community.memberCount') {
      // For member count, we'll do client-side sorting
      this.communityService.getCommunityList(this.page).subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.data && res.data.length > 0) {
            const mappedData = res.data.map((item:any)=>{
              return {...item,community : {
                ...item?.community, coverPhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.coverPhoto}`,
                profilePhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.profilePhoto}`
              },
              createdDate:this.commonService.convertDate(item.createdDate),
              updateddDate:this.commonService.convertDate(item.updateddDate),
              joined:this.role ? true : item.joined
            }});
            
            // Sort by member count
            mappedData.sort((a:any, b:any) => {
              // Get member count from the community object's activeMemberCount
              const countA = a.community?.activeMemberCount || 0;
              const countB = b.community?.activeMemberCount || 0;
              console.log('Sorting member counts:', { 
                communityA: a.community,
                communityB: b.community,
                countA, 
                countB, 
                direction 
              });
              
              if (direction === 'asc') {
                return countA - countB;
              } else {
                return countB - countA;
              }
            });
            
            if (this.page === 0) {
              this.all_data = mappedData;
            } else {
              this.all_data = this.all_data.concat(mappedData);
            }
          } else {
            this.isdata = true;
            if (this.page === 0) {
              this.all_data = [];
            }
          }
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isdata = true;
          if (this.page === 0) {
            this.all_data = [];
          }
        }
      });
      return;
    } else if (column === 'createdDate') {
      orderByField = 'CreatedDate';
    } else if (column === 'updateddDate') {
      // For last updated, we'll do client-side sorting
      this.communityService.getCommunityList(this.page).subscribe({
        next: (res: any) => {
          console.log('API Response:', res);
          if (res.data && res.data.length > 0) {
            const mappedData = res.data.map((item:any)=>{
              return {...item,community : {
                ...item?.community, coverPhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.coverPhoto}`,
                profilePhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.profilePhoto}`
              },
              createdDate:this.commonService.convertDate(item.createdDate),
              updateddDate:this.commonService.convertDate(item.updateddDate),
              joined:this.role ? true : item.joined
            }});
            
            // Sort by last updated date
            mappedData.sort((a:any, b:any) => {
              const dateA = new Date(a.updateddDate || 0);
              const dateB = new Date(b.updateddDate || 0);
              console.log('Sorting dates:', { 
                dateA: a.updateddDate,
                dateB: b.updateddDate,
                direction 
              });
              
              if (direction === 'asc') {
                return dateA.getTime() - dateB.getTime();
              } else {
                return dateB.getTime() - dateA.getTime();
              }
            });
            
            if (this.page === 0) {
              this.all_data = mappedData;
            } else {
              this.all_data = this.all_data.concat(mappedData);
            }
          } else {
            this.isdata = true;
            if (this.page === 0) {
              this.all_data = [];
            }
          }
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isdata = true;
          if (this.page === 0) {
            this.all_data = [];
          }
        }
      });
      return;
    }

    console.log('Sorting params:', { page: this.page, column: orderByField, direction });

    this.communityService.getCommunityList(this.page, orderByField, direction).subscribe({
      next: (res: any) => {
        console.log('API Response:', res);
        if (res.data && res.data.length > 0) {
          const mappedData = res.data.map((item:any)=>{
        return {...item,community : {
          ...item?.community, coverPhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.coverPhoto}`,
          profilePhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.profilePhoto}`
        },
        createdDate:this.commonService.convertDate(item.createdDate),
        updateddDate:this.commonService.convertDate(item.updateddDate),
        joined:this.role ? true : item.joined
          }});
          
          if (this.page === 0) {
            this.all_data = mappedData;
          } else {
            this.all_data = this.all_data.concat(mappedData);
          }
        } else {
          this.isdata = true;
          if (this.page === 0) {
            this.all_data = [];
          }
        }
      },
      error: (error) => {
        console.error('API Error:', error);
        this.isdata = true;
        if (this.page === 0) {
          this.all_data = [];
        }
      }
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
    console.log(this.sortOptions)
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

  joinCommunity(row:any){
    if(!this.activeTooltipId){
      if(!row.joined && !this.role){
        const modalRef = this.modalService.open(JoinComponent, {
          backdrop: 'static',
          keyboard: true,
          size: 'md',
          centered: true,
        });
        modalRef.componentInstance.communityRecords = row;
      }else{
          this.router.navigateByUrl('/community/home/'+row.postingId);
      }
    }
  }

  getData(fetchData: boolean) {
    if (fetchData && !this.isdata) {
      this.page = this.page + 1;
        if(this.tagId){
          this.getCommunityByTagId();
        }else if(this.currentColumn){
          this.loadData(this.currentColumn,this.currentDirection == true ? 'asc' : 'desc');
        }else{
          this.loadData();
        }
    }
  }

  sortHeader(column: any) {
    if (!column.isSort) return;
    
    console.log('Sorting column:', column);
    
    column.sort = !column.sort;
    this.header_data.forEach((val: any) => {
      if (val.sortFieldName !== column.sortFieldName && val.isSort) {
        val.sort = true;
      }
    });
    
    this.currentColumn = column.sortFieldName;
    this.currentDirection = column.sort;
    this.page = 0;
    this.all_data = [];
    
    this.loadData(column.sortFieldName, column.sort ? 'asc' : 'desc');
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
      "id": item?.postingId,
      "status": type,
      "reason": "Reason test",
    }
    this.videoService.updatePostingStatus(payload).subscribe({
      next:(res)=>{
        if(res.success){
          if(type == 'Delete'){
            this.all_data = this.all_data.filter((val:any)=>val.postingId != item.postingId);
          }else{
            item.status = type;
          }
        }
      }
    });
    
  }

  getCommunityByTagId(){
    this.communityService.getCommunityByTagId(this.tagId, this.page).subscribe({
      next: (res: any) => {
        this.isdata = res?.data && res.data.length == 0 ?true:false;
        if (res.data.length > 0) {
          this.all_data = this.all_data.concat(res.data.map((item:any)=>{
            return {...item,community : {
              ...item?.community, coverPhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.coverPhoto}`,
              profilePhoto : `data:image/jpeg;charset=utf-8;base64,${item?.community?.profilePhoto}`
            },
            createdDate:this.commonService.convertDate(item.createdDate),
            updateddDate:this.commonService.convertDate(item.updateddDate),
            joined:this.role ? true : item.joined
          }
          }));
          this.all_data.sort((a:any,b:any)=>(a.joined === b.joined) ? 0 : a.joined ? -1 : 1)
        }
      },
      error: (error) => {
        console.log(error.message);
      },
    });
  }

  @HostListener('window:resize', ['$event'])
	onWindowResize(event:any) {
    this.width = event.target.innerWidth;
    this.isMobile = this.width < this.mobileWidth;
    this.reOrderData();
	}

  reOrderData(){
    if(this.isMobile){
      this.headerList = this.header_data.filter((val:any)=>!this.hideColumn.includes(val.fieldName));
    }else{
      this.headerList = [...this.header_data];
      if (this.userInfo.role == 'Admin') {
        this.headerList.push({ fieldName: 'Action', isSort: false, sort: false, visible:'false' });
      }
    }
  }

  public refreshList(): void {
    // Reset pagination and data
    this.all_data = [];
    this.page = 0;

    if (this.tagId) {
      // If a tag filter is applied, load data based on tag
      this.getCommunityByTagId();
    } else {
      // Otherwise load the latest data first (newest on top)
      this.currentColumn = 'createdDate';
      this.currentDirection = false; // false -> descending (as per sortHeader convention)
      this.loadData('createdDate', 'desc');
    }
  }

  ngOnDestroy(): void {
    if (this.communityAddedSub) {
      this.communityAddedSub.unsubscribe();
    }
  }

}
