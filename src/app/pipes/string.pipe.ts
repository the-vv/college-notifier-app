import { Pipe, PipeTransform } from '@angular/core';
import { EStrings } from '../interfaces/strings.enum';

@Pipe({
  name: 'string'
})
export class StringPipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    return EStrings[value] || value;
  }

}
