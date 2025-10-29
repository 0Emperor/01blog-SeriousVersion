import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {
  @Input() isShown = false
}
