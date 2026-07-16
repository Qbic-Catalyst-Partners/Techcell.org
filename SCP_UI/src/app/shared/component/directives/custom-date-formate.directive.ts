import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';

@Directive({
  selector: '[appCustomDateFormate]',
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'MM/YYYY',
        },
        display: {
          dateInput: 'MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      }
    }
  ]
})
export class CustomDateFormateDirective {

  constructor() { }

}
