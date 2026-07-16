import { Component, HostListener, OnInit } from '@angular/core';
import { CommonService } from '../../common/common.service';
import { UserprofileService } from '../service/userprofile.service';

@Component({
  selector: 'app-corp-management',
  templateUrl: './corp-management.component.html',
  styleUrl: './corp-management.component.scss',
})
export class CorpManagementComponent implements OnInit {
  page: number = 0;
  public header_data: any[] = [
    { fieldName: 'User ID', isSort: true, sort: true, sortFieldName: 'userId', width: '10%' },
    { fieldName: 'Full Name', isSort: true, sort: true, sortFieldName: 'firstName', width: '20%' },
    { fieldName: 'Role', isSort: true, sort: true, sortFieldName: 'role', width: '10%' },
    { fieldName: 'CIN', isSort: true, sort: true, sortFieldName: 'orgDetail.cin', width: '15%' },
    { fieldName: 'Company Name', isSort: true, sort: true, sortFieldName: 'orgDetail.orgName', width: '23%' },
    { fieldName: 'State', isSort: true, sort: true, sortFieldName: 'state', width: '8%' },
    { fieldName: 'Status', isSort: true, sort: true, sortFieldName: 'status', width: '9%' },
    { fieldName: 'Action', isSort: false, sort: false, width: '8%' },
  ];

  public all_data: any[] = [];
  activeTooltipId: any;
  sortActive: any;

  constructor(private commonService: CommonService, private userprofileService: UserprofileService) {}

  ngOnInit(): void {
    this.sortActive = this.header_data[0];
    const payload = {
      documentTypeEnum: 'USER',
      filters: [{ field: 'role', operator: 'equals', value: 'Corporate' }],
      page: this.page,
      size: 10,
      direction: 'asc',
      sortBy: this.sortActive.sortFieldName,
    };
    this.loadData(payload);
  }

  getData(fetchData: boolean) {
    if (fetchData) {
      this.page++;
      const payload = {
        documentTypeEnum: 'USER',
        filters: [{ field: 'role', operator: 'equals', value: 'Corporate' }],
        page: this.page,
        size: 10,
        direction: this.sortActive?.sort ? 'asc' : 'desc',
        sortBy: this.sortActive?.sortFieldName,
      };
      this.loadData(payload);
    }
  }

  private loadData(payload: any): void {
    this.userprofileService.userDetailsList(payload).subscribe((res: any) => {
      this.all_data = this.all_data.concat(res.data.map((v: any) => ({ ...v })));
    });
  }

  toggleAction(item: any) {
    this.activeTooltipId = item.userId;
  }

  @HostListener('document:click', ['$event']) onDocumentClick($event: any) {
    if (!$event.target.closest('.tooltip') && !$event.target.closest('.action-btn')) {
      this.closeAllTooltips();
    }
  }

  private closeAllTooltips() {
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach((tooltip) => {
      if (tooltip.classList.contains('show')) {
        const tooltipInstance = (tooltip as any)['__ngbTooltipInstance__'];
        if (tooltipInstance) {
          tooltipInstance.close();
        }
      }
    });
  }

  toggleTooltip(tooltip: any) {
    if (tooltip.isOpen()) {
      tooltip.close();
    } else {
      this.closeAllTooltips();
      tooltip.open();
    }
  }

  updateStatus(type: string, item: any) {
    const payload = { userId: item.userId, status: type };
    this.userprofileService.updateUserStatus(payload).subscribe({
      next: (res) => {
        if (res.success) {
          if (type == 'Delete') {
            this.all_data = this.all_data.filter((val: any) => val.userId != item.userId);
          } else {
            item.status = type;
          }
        }
      },
    });
  }

  sortHeader(column: any) {
    column.sort = !column.sort;
    this.header_data.forEach((val: any) => {
      if (val.sortFieldName !== column.sortFieldName && val.isSort) {
        val.sort = true;
      }
    });
    this.page = 0;
    this.all_data = [];
    this.sortActive = column;
    const payload = {
      documentTypeEnum: 'USER',
      filters: [{ field: 'role', operator: 'equals', value: 'Corporate' }],
      page: this.page,
      size: 10,
      direction: column.sort ? 'asc' : 'desc',
      sortBy: column.sortFieldName,
    };
    this.loadData(payload);
  }
} 