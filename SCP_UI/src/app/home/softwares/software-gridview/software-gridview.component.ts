import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { SoftwareService } from '../service/software.service';
import { CommonService } from '../../../shared/services/common.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../../shared/component/modal/modal.component';

@Component({
  selector: 'app-software-gridview',
  templateUrl: './software-gridview.component.html',
  styleUrl: './software-gridview.component.scss',
})
export class SoftwareGridviewComponent implements OnChanges {
  @Input() tagId!: number;
  @Input() tagDescription: string | null = null; // Accepts tag description
  @Output() closeEvent = new EventEmitter<void>();
  public all_software_list: any = [];
  page: number = 0;
  isdata: boolean = false;
  isLoading: boolean = false;

  constructor(
    private softwareService: SoftwareService,
    public commonService: CommonService,
    public modalService: NgbModal
  ) {}

  close() {
    this.closeEvent.emit();
    console.log('Close modal clicked in software grid view');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.all_software_list = [];
    this.page = 0;
    if (this.tagId) {
      this.getSoftwareByTagId(this.tagId);
    } else {
      let payload = {
        documentTypeEnum: 'SOFTWARE',
        filters: [],
        page: this.page,
        size: 10,
      };
      this.getAllSoftwares(payload);
    }
  }

  public getAllSoftwares(payload: any): void {
    this.isLoading = true;

    this.softwareService.getAllSoftwares(payload).subscribe({
      next: (res: any) => {
        this.isdata = res?.data && res.data.length == 0 ? true : false;
        // Filter out inactive software for all users in grid view
        const activeSoftware = res.data.filter((item: any) => item.status === 'Active');
        this.all_software_list = this.all_software_list.concat(
          activeSoftware.map((v: any) => {
            return {
              ...v,
              releaseDate: this.commonService.convertDate(v.releaseDate),
              thumbnail: `data:image/jpeg;charset=utf-8;base64,${v.thumbnail}`,
            };
          })
        );
        this.isLoading = false;

        // When no records for selected tag show standard modal
        if (this.all_software_list.length === 0 && this.tagId && this.tagDescription) {
          this.commonService.dialog(
            'newErrorModal',
            `No content found for ${this.tagDescription}`,
            '',
            'OK',
            'No content'
          );
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  public downloadSoftware(row: any) {
    const modalRef: NgbModalRef = this.modalService.open(ModalComponent, {
      backdrop: 'static',
      keyboard: true,
      size: 'md',
      centered: true,
      windowClass: 'modal-top',
    });

    modalRef.componentInstance.modalConfig = {
      type: 'careerApplyModal',
      header: 'Download Software',
      message1: 'Thank you for your interest! Click Download to begin downloading this application.',
      btnName: 'Download',
    } as any;

    modalRef.result
      .then((res: any) => {
        if (res === 'Download' && row?.softwarelink) {
          window.open(row.softwarelink, '_blank')?.focus();
        }
      })
      .catch(() => {});
  }

  getSoftwareByTagId(tagId: number) {
    this.isLoading = true;

    this.softwareService.getSoftwareByTagId(this.page, tagId).subscribe({
      next: (res: any) => {
        this.isdata = res?.data && res.data.length == 0 ? true : false;
        // Filter out inactive software for all users in grid view
        const activeSoftware = res.data.filter((item: any) => item.status === 'Active');
        this.all_software_list = this.all_software_list.concat(
          activeSoftware.map((v: any) => {
            return {
              ...v,
              releaseDate: this.commonService.convertDate(v.releaseDate),
              thumbnail: `data:image/jpeg;charset=utf-8;base64,${v.thumbnail}`,
            };
          })
        );
        this.isLoading = false;

        // When no records for selected tag show standard modal
        if (this.all_software_list.length === 0 && this.tagId && this.tagDescription) {
          this.commonService.dialog(
            'newErrorModal',
            `No content found for ${this.tagDescription}`,
            '',
            'OK',
            'No content'
          );
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  getData(fetchData: boolean) {
    if (fetchData && !this.isdata) {
      this.page = this.page + 1;
      if (this.tagId) {
        this.getSoftwareByTagId(this.tagId);
      } else {
        let payload = {
          documentTypeEnum: 'SOFTWARE',
          filters: [],
          page: this.page,
          size: 10,
        };
        this.getAllSoftwares(payload);
      }
    }
  }
}
