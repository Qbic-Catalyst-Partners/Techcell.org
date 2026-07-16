import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from '../../service/community.service';
import { AuthUtils } from '../../../shared/utility/auth-utils';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrl: './join.component.scss'
})
export class JoinComponent implements OnInit{
  @Input() communityRecords:any;
  constructor(private activeModal: NgbActiveModal,
    public router: Router,
    private communityService :CommunityService){}
  
    ngOnInit(): void {
      console.log(this.communityRecords)
    }
  
    close(){
      this.activeModal.close();
    }
  
    join(){
      this.communityService.joinCommunity(this.communityRecords?.community?.id).subscribe({
        next:(res)=>{
          this.close();
          this.router.navigateByUrl('/community/home/'+this.communityRecords?.postingId);
        }
      });
    }
}
