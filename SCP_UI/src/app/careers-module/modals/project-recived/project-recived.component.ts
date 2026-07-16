import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CareerService } from '../../career.service';
import { ViewResumeComponent } from '../../../shared/component/view-resume/view-resume.component';
import { ProjectRecivedMeta } from './projectReciveMeta';

@Component({
  selector: 'app-project-recived',
  templateUrl: './project-recived.component.html',
  styleUrl: './project-recived.component.scss'
})
export class ProjectRecivedComponent implements OnInit {
  @Input() data: any;
  @Output() statusUpdated = new EventEmitter<any>();
  
  projectHeader:any = [];
  projectData:any = [];
  page: number = 0;
  isdata:boolean = false;

  constructor(
    public commonService: CommonService,
    public modalService: NgbModal,
    private careerService: CareerService,
    private activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.projectHeader = ProjectRecivedMeta; // updated meta with member count column
    this.loadData();
  }

  private loadData(): void {
    let payload = {
      type: 'PROJECT',
      id: this.data?.id,
      page: this.page,
      status: this.data?.statusType
    };
    this.careerService.getCareerAppliedList(payload).subscribe((res: any) => {
      this.isdata = res?.data && res.data.length == 0 ? true : false;
      this.projectData = this.projectData.concat(res.data);
    });
  }

  public close(): any {
    this.activeModal.close();
  }

  getData(fetchData: boolean) {
    if (fetchData && !this.isdata) {
      this.page = this.page + 1;
      this.loadData();
    }
  }

  actionOnToolTip(item: any) {
    let normalizedStatus = item.type || item.status;

    let payload = {
      careerType: 'PROJECT',
      id: item?.data?.teamId, // team id for project applications
      status: normalizedStatus
    };
    this.careerService.careerApprove(payload).subscribe((res: any) => {
      let modifiedData = this.projectData.map((val: any) => {
        if (val.teamId == item?.data?.teamId) {
          return { ...val, status: normalizedStatus };
        } else {
          return val;
        }
      });
      this.projectData = [...modifiedData];
      
      // Emit event with updated status and counts
      this.statusUpdated.emit({
        teamId: item?.data?.teamId,
        newStatus: normalizedStatus,
        oldStatus: item?.data?.status,
        item: item?.data
      });
    });
  }

  viewResume(item:any){
    const modalRef = this.modalService.open(ViewResumeComponent, {
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.data = item;
  }
}
