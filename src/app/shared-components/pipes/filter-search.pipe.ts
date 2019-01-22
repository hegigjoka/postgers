import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filters'
})

export class FilterSearchPipe implements PipeTransform {
  transform(employee: any, search: any) {
    if (search === undefined) {
      return employee;
    }
    const type = search.substr(0, 1);
    search = search.split(/[0-9]/)[1];
    return employee.filter(function () {
      if (type === '1') {
        return employee.someLabel.toLowerCase().includes(search.toLowerCase());
      } else if (type === '3') {
        return employee.managerFirstName.toLowerCase().includes(search.toLowerCase());
      } else if (type === '4') {
        return employee.directorFirstName.toLowerCase().includes(search.toLowerCase());
      }
    });
  }
}
