import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommunityService } from '../../service/community.service';
import { CommonService } from '../../../shared/services/common.service';

@Component({
  selector: 'app-assign-moderator',
  templateUrl: './assign-moderator.component.html',
  styleUrl: './assign-moderator.component.scss'
})
export class AssignModeratorComponent implements OnInit{
  @Input() communityRecords:any;
  public moderatorUserList:any = [];
  public isSubmitted: boolean = false;
  public assignForm = this._fb.group({
    assignModerator: ['', Validators.required],
  });
  constructor(
    private activeModal: NgbActiveModal,
    private _fb: FormBuilder,
    private communityService : CommunityService,
    public commonService: CommonService
  ) {}

  ngOnInit(): void {
    console.log(this.communityRecords)
    this.getModeratorUser();
  }

  getModeratorUser(){
    this.communityService.getModeratorUser().subscribe({
      next: (res: any) => {
        this.moderatorUserList = res.data;
        if(this.communityRecords?.moderator){
          this.assignForm.patchValue({
            assignModerator:this.communityRecords?.moderator?.userId
          });
        }
      },
      error: (error: any) => {
        console.log(error.message);
      },
    });
  }

  get fieldName() {
    return this.assignForm.controls;
  }

  submitForm() {
    this.isSubmitted = true;
    if(this.assignForm.valid){
      let payload = {
        "communityId": this.communityRecords?.community?.id,
        "moderator": this.assignForm.controls['assignModerator'].value ? +this.assignForm.controls['assignModerator'].value : null
      }
      this.communityService.assignModerator(payload).subscribe({
        next: (res: any) => {
          const infoMsg = res?.result?.info || 'Moderator Assigned Successfully';
          this.commonService.dialog({
            type: 'newSuccessModal',
            message1: infoMsg,
            btnName: 'OK',
            header: 'Success'
          });
          this.activeModal.close(true);
        },
        error: (error: any) => {
          this.commonService.dialog('Error',error.message,'','OK')
        },
      });
    }
  }
  
  close() {
    this.activeModal.close();
  }
}
