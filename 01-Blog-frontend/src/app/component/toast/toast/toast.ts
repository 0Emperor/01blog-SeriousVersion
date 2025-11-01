import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ToastService } from '../../../service/toast-service';

@Component({
  selector: 'app-toast',
  imports: [NgClass],
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {
  @Input() type!: 'success' | 'error' | 'info' | 'warning'
  @Input() msg!: string
  @Input() title!: string
  @Input() id!: number
  @Input() closing!: boolean
  constructor(public toastService: ToastService) { }

  onDelete() {
    this.toastService.remove(this.id)
  }
}
