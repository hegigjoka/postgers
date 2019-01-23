import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'multiPurposePipe'})

export class MultiPurposePipe implements PipeTransform {
  transform(value: string, type: string) {
    switch (type) {
      case 'birthday': {
        return value.split('T')[0];
      }
      case 'date': {
        return value.split('T')[0];
      }
      case 'time': {
        return value.split('T')[1].substr(0, 5);
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
      }
    }
  }
}
