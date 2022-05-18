import { Pipe, PipeTransform } from '@angular/core';
import { EStrings } from '../interfaces/strings.enum';

@Pipe({
  name: 'string'
})
export class StringPipe implements PipeTransform {

  transform(value: string | string[], ...args: unknown[]): string {
    if(Array.isArray(value) && value.length > 0) {
      return value.map(item => EStrings[item]).join(', ');
    }
    return EStrings[value as string] || value;
  }

}
