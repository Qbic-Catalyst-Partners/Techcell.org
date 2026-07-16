import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonService } from '../../../common/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InternshipRecivedMeta } from './internshipReciveMeta';
import { CareerService } from '../../career.service';
import { ViewResumeComponent } from '../../../shared/component/view-resume/view-resume.component';

@Component({
  selector: 'app-internship-recived',
  templateUrl: './internship-recived.component.html',
  styleUrl: './internship-recived.component.scss'
})
export class InternshipRecivedComponent implements OnInit {
  @Input() data: any;
  @Output() statusUpdated = new EventEmitter<any>();
  
  internshipHeader:any = [];
  internshipData:any = [];
  page: number = 0;
  isdata:boolean = false;

  constructor(
    public commonService: CommonService,
    public modalService: NgbModal,
    private careerService: CareerService,
    private activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.internshipHeader = InternshipRecivedMeta;
    this.loadData();
  }

  private loadData(): void {
    let payload = {
      type: 'INTERNSHIP',
      id: this.data?.internshipId,
      page: this.page,
      status: this.data?.statusType
    };
    this.careerService.getCareerAppliedList(payload).subscribe((res: any) => {
      this.isdata = res?.data && res.data.length == 0 ? true : false;
      this.internshipData = this.internshipData.concat(res.data);
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
    console.log('Internship Received - Before Status Update:', {
      item,
      currentData: this.internshipData,
      oldStatus: item?.data?.status,
      newStatus: item.type
    });

    // Validate and normalize status
    let normalizedStatus = item.type;
    if (normalizedStatus === 'Relected') {
      normalizedStatus = 'Rejected';
    } else if (normalizedStatus === 'Selected') {
      normalizedStatus = 'Accepted';
    }

    let payload = {
      careerType: 'INTERNSHIP',
      id: this.data?.internshipId,
      "userId": item?.data?.userId,
      "status": normalizedStatus
    }
    this.careerService.careerApprove(payload).subscribe((res: any) => {
      let modifiedData = this.internshipData.map((val: any) => {
        if (val.userId == item?.data?.userId) {
          return { ...val, status: normalizedStatus };
        } else {
          return val;
        }
      });
      this.internshipData = [...modifiedData];
      
      console.log('Internship Received - After Status Update:', {
        modifiedData,
        oldStatus: item?.data?.status,
        newStatus: normalizedStatus,
        userId: item?.data?.userId
      });

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
      keyboard: true,
      size: 'lg',
      centered: true,
    });
    modalRef.componentInstance.data = item;
  }
}
