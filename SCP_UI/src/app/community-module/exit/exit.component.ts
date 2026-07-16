import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExitCommunityComponent } from '../modals/exit-community/exit-community.component';
import { AuthUtils } from '../../shared/utility/auth-utils';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../shared/services/api.service';

@Component({
  selector: 'app-exit',
  templateUrl: './exit.component.html',
  styleUrl: './exit.component.scss'
})
export class ExitComponent implements OnInit{
  exitDetails:any;
 constructor(public modalService: NgbModal,
  private activateRoute : ActivatedRoute,
    private apiService: ApiService
 ){}
  ngOnInit(): void {
    const parentParamMap = this.activateRoute?.parent?.snapshot?.paramMap;
    const id = parentParamMap ? parentParamMap.get('communityId') : null;
    this.getPostingUserDetails(id)
  }
  exitCommunity(){
    const modalRef = this.modalService.open(ExitCommunityComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
    });
    modalRef.componentInstance.communityRecords = this.exitDetails;
  }

  getPostingUserDetails(id:any){
    this.apiService.getPostingUserDetails(id).subscribe({
      next:(res)=>{
        this.exitDetails = res.data;
      }
    });
  }
}
