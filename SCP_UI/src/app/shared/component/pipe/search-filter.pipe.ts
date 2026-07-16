import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(value: any, args?: any,fieldName:string=''): any {
    if (!value) return null;
    if (!args) return value;
    console.log(value)
    value = value.filter(function(search:any) {
      return search[fieldName].toLowerCase().indexOf(args.toLowerCase()) > -1;
    });
    return value;
  }

}
