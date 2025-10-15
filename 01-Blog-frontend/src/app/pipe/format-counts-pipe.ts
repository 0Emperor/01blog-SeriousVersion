import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'count'
})
export class FormatCountsPipe implements PipeTransform {

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) return '';

    const abs = Math.abs(value);

    if (abs >= 1_000_000_000) {
      return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
    } else if (abs >= 1_000_000) {
      return (value / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    } else if (abs >= 1_000) {
      return (value / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    }

    return value.toString();
  }

}
