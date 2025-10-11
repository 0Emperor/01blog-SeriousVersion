import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {

  /**
   * Truncates text to a specified maximum length and adds an ellipsis.
   * @param value The input string (the post description).
   * @param limit The maximum number of characters to show (defaulting to 150).
   * @returns The truncated string.
   */
  transform(value: string | null | undefined, limit: number = 30): string {
    // Handle null or undefined input gracefully
    if (!value) {
      return '';
    }

    if (value.length <= limit) {
      return value;
    }

    // Truncate and add ellipsis
    return value.substring(0, limit) + '...';
  }
}