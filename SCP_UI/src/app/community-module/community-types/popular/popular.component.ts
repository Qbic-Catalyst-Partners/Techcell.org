import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../service/community.service';
import { CommonService } from '../../../common/common.service';
import { ApiService } from '../../../shared/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { JoinComponent } from '../../modals/join/join.component';

@Component({
  selector: 'app-popular',
  templateUrl: './popular.component.html',
  styleUrl: './popular.component.scss'
})
export class PopularComponent implements OnInit{
  public dataList: any = [];
  role!:boolean;
  constructor(private communityService :CommunityService,
    public commonService: CommonService,
    private apiService : ApiService,
    public modalService: NgbModal,
    public router: Router){}

  ngOnInit(): void {
    this.getPopularList();
  }

  getPopularList(){
    this.communityService.popularCommunityList(0).subscribe({
      next:(res)=>{
        this.dataList = res.data;
      }
    });
  }

  joinCommunity(row:any){
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
