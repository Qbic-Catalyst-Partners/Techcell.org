import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { CommonService } from '../../../common/common.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss',
})
export class DataTableComponent implements OnInit, OnChanges {
  @Input() tableHeader: any = [];
  @Input() tableData: any = [];
  @Input() tableHeight: number = 500;
  @Input() tableClass: string = '';
  @Input() enableRowClick: boolean = false;

  @Output() emitAction: EventEmitter<any> = new EventEmitter();
  @Output() emitLink: EventEmitter<any> = new EventEmitter();
  @Output() IsApi: EventEmitter<any> = new EventEmitter();
  @Output() emitToolTipAction: EventEmitter<any> = new EventEmitter();
  @Output() emitRow: EventEmitter<any> = new EventEmitter();
  public tableAllData: any = [];
  
  constructor(
    public commonService: CommonService
  ) {
    
  }

  ngOnInit() {}
  ngOnChanges() {
    this.tableAllData = this.tableData;
  }

  takeAction(action: any, data: any) {
    const actionType = {
      type: action.name,
      data: data,
    };
    this.emitAction.emit(actionType);
  }

  hideBtn(element: any, action: any) {
    if (
      element.disabledBtn &&
      element.disabledBtn.hasOwnProperty(action.displayName)
    ) {
      return element.disabledBtn[action.displayName];
    } else {
      return true;
    }
  }

  getLink(item: any) {
    this.emitLink.emit(item);
  }

  getData(fetchData: boolean) {
    if (fetchData) {
      this.IsApi.emit(true);
    }
  }

  sortHeader(item: any) {
    item.isSort = !item.isSort;
    if (item.isSort) {
      this.tableAllData.sort((a: any, b: any) => {
        if (b[item.dataKey] < a[item.dataKey]) {
          return -1;
        }
        if (b[item.dataKey] > a[item.dataKey]) {
          return 1;
        }
        return 0;
      });
    } else {
      this.tableAllData.sort((a: any, b: any) => {
        if (a[item.dataKey] < b[item.dataKey]) {
          return -1;
        }
        if (a[item.dataKey] > b[item.dataKey]) {
          return 1;
        }
        return 0;
      });
    }
  }

  actionToolTipStatus(item: any, data: any) {
    const actionType = {
      type: item.value,
      data: data,
    };
    this.emitToolTipAction.emit(actionType);
  }

  onRowClick(item: any): void {
    if (this.enableRowClick) {
      this.emitRow.emit(item);
    }
  }
}
