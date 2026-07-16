export class MyFormat {
    value = 1;
    constructor() {}
    get display() {
      return this.value == 1
        ? {
            dateInput: "DD/MM/YYYY",
            monthYearLabel: "MMM YYYY",
            dateA11yLabel: "LL",
            monthYearA11yLabel: "MMMM YYYY"
          }
        : {
            dateInput: "DD/MM/YYYY",
            monthYearLabel: "MM YYYY",
            dateA11yLabel: "DD/MM/YYYY",
            monthYearA11yLabel: "MM YYYY"
          };
    }
    get parse() {
      return this.value == 1
        ? {
            dateInput: "DD/MM/YYYY"
          }
        : {
            dateInput: "DD/MM/YYYY"
          };
    }
  }