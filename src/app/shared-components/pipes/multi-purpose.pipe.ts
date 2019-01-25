import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'multiPurposePipe'})

export class MultiPurposePipe implements PipeTransform {
  date: Date = new Date();
  transform(value: string, type: string) {
    switch (type) {
      case 'birthday': {
        return value ? value.split('T')[0] : '';
      }
      case 'hasDateValue': {
        return value ? value : this.date;
      }
      case 'time': {
        return value ? value.split('T')[1].substr(0, 5) : '';
      }
      case 'reqType': {
        switch (value) {
          case 'POOL00000000078': {
            return 'Mission';
          }
          case  'POOL00000000079': {
            return 'Holidays/Permission';
          }
          case 'POOL00000000080': {
            return 'Badge Fail';
          }
          case 'POOL00000000081': {
            return 'Extra Hours';
          }
          case  'POOL00000000082': {
            return 'Substitute Holidays';
          }
        }
        break;
      }
      case 'statusType': {
        switch (value) {
          case 'POOL00000000083': {
            return 'Approval pending';
          }
          case 'POOL00000000084': {
            return 'Authorization pending';
          }
          case 'POOL00000000085': {
            return 'Authorized';
          }
          case 'POOL00000000086': {
            return 'Denied';
          }
          case 'POOL00000000087': {
            return 'Approved';
          }
        }
        break;
      }
      case 'longNote': {
        return value.length > 10 ? value.substr(0, 10) + '...' : value;
      }
    }
  }
}
