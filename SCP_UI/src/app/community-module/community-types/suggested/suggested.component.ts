import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../service/community.service';
import { CommonService } from '../../../shared/services/common.service';
import { ApiService } from '../../../shared/services/api.service';
import { ADMIN_ROLE } from '../../../common/constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JoinComponent } from '../../modals/join/join.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-suggested',
  templateUrl: './suggested.component.html',
  styleUrl: './suggested.component.scss',
})
export class SuggestedComponent implements OnInit {
  public dataList: any = [];
  role!: boolean;
  constructor(
    private communityService: CommunityService,
    public commonService: CommonService,
    private apiService: ApiService,
    public modalService: NgbModal,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getSuggestedList();
    this.role = this.apiService.Role == ADMIN_ROLE;
  }

  getSuggestedList() {
    this.communityService.suggestedCommunityList(0).subscribe({
      next: (res) => {
        this.dataList = res.data;
      },
    });
  }

  joinCommunity(row: any) {
    console.log(row);

    if (!row.joined && !this.role) {
      const modalRef = this.modalService.open(JoinComponent, {
        backdrop: 'static',
        keyboard: true,
        size: 'md',
        centered: true,
      });
      modalRef.componentInstance.communityRecords = row;
    } else {
      this.router.navigateByUrl('/community/home/' + row.postingId);
    }
  }
}
