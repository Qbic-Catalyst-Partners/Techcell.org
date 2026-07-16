import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from '../../service/community.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-exit-community',
  templateUrl: './exit-community.component.html',
  styleUrl: './exit-community.component.scss'
})
export class ExitCommunityComponent {
@Input() communityRecords:any
  constructor(private activeModal: NgbActiveModal,
    private communityService :CommunityService,
    public router: Router){}
  close(){
    this.activeModal.close();
  }

  exit(){
    this.communityService.exitCommunity(this.communityRecords?.community?.id).subscribe({
      next:(res)=>{
        this.close();
        this.router.navigate(['/community']);
      }
    });
  }
}
