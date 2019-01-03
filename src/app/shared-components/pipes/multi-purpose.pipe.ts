import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'multiPurposePipe'})

export class MultiPurposePipe implements PipeTransform {
  transform(value: string, type) {}
}
