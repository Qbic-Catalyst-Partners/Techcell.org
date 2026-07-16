import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MyFormat } from '../../utility/dateFormate';
import { CommonService } from '../../services/common.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import moment from 'moment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-filter-search',
  templateUrl: './filter-search.component.html',
  styleUrl: './filter-search.component.scss',
  providers: [{ provide: MAT_DATE_FORMATS, useClass: MyFormat }],
})
export class FilterSearchComponent implements OnChanges {
  @Input() filterSetting: any = [];
  dataList = [
    { code: 1, name: 'like' },
    { code: 2, name: 'equals' },
    { code: 3, name: 'greaterThan' },
    { code: 4, name: 'lessThan' },
    { code: 5, name: 'range' },
  ];

  constructor(
    public commonService: CommonService,
    private activeModal: NgbActiveModal
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.filterSetting);
  }

  patchFilter(item: any, inputVal: string) {
    item.value = inputVal;
  }

  patchFilterDate(dinput: MatDatepickerInputEvent<Date>, type: any, item: any) {
    item.value[type] = moment(dinput.value).format('YYYY-MM-DD');
  }

  onChange(event: any, item: any) {
    if (event.target.value != 'Select') {
      let selectedValue = this.dataList.find(
        (val: any) => val.code == event.target.value
      );
      item.operator = selectedValue?.name;

      console.log(item);
    } else {
      item.operator = null;
    }
  }

  search() {
    this.activeModal.close(this.filterSetting);
  }

  getSelectedId(list: any, item: any) {
    let selectedItem = this.dataList.find(
      (val: any) => val.name == item.operator
    );
    return selectedItem && selectedItem.code == list.code;
  }

  close() {
    this.activeModal.close();
  }
}
