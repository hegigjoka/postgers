import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'multiPurposePipe'})

export class MultiPurposePipe implements PipeTransform {
  transform(value: string, type: string) {
    switch (type) {
      case 'birthday': {
        return value.split('T')[0];
      }
    }
  }
}
