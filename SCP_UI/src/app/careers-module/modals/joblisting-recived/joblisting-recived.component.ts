import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CareerService } from '../../career.service';
import { InternshipRecivedMeta } from '../internship-recived/internshipReciveMeta';
import { ViewResumeComponent } from '../../../shared/component/view-resume/view-resume.component';

@Component({
  selector: 'app-joblisting-recived',
  templateUrl: './joblisting-recived.component.html',
  styleUrl: './joblisting-recived.component.scss'
})
export class JoblistingRecivedComponent implements OnInit {
  @Input() data: any;
  @Output() statusUpdated = new EventEmitter<any>();
  
  jobListingHeader:any = [];
  jobListingData:any = [];
  page: number = 0;
  isdata:boolean = false;

  constructor(
    public commonService: CommonService,
    public modalService: NgbModal,
    private careerService: CareerService,
    private activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.jobListingHeader = InternshipRecivedMeta;
    this.loadData();
  }

  private loadData(): void {
    let payload = {
      type: 'JOB',
      id: this.data?.jobId,
      page: this.page,
      status: this.data?.statusType
    };
    this.careerService.getCareerAppliedList(payload).subscribe((res: any) => {
      this.isdata = res?.data && res.data.length == 0 ? true : false;
      this.jobListingData = this.jobListingData.concat(res.data);
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
    // Validate and normalize status
    let normalizedStatus = item.type;
    if (normalizedStatus === 'Relected') {
      normalizedStatus = 'Rejected';
    } else if (normalizedStatus === 'Selected') {
      normalizedStatus = 'Accepted';
    }

    let payload = {
      careerType: 'JOB',
      id: this.data?.jobId,
      "userId": item?.data?.userId,
      "status": normalizedStatus
    }
    this.careerService.careerApprove(payload).subscribe((res: any) => {
      let modifiedData = this.jobListingData.map((val: any) => {
        if (val.userId == item?.data?.userId) {
          return { ...val, status: normalizedStatus };
        } else {
          return val;
        }
      });
      this.jobListingData = [...modifiedData];
      
      // Emit event with updated status and counts
      this.statusUpdated.emit({
        userId: item?.data?.userId,
        newStatus: normalizedStatus,
        oldStatus: item?.data?.status,
        item: item?.data
      });
    });
  }
  
  viewResume(item:any){
    const modalRef = this.modalService.open(ViewResumeComponent, {
      // backdrop: 'static',
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.data = item;
  }
}
