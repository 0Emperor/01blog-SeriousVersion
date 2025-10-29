import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm.html',
  styleUrls: ['./confirm.scss']
})
export class ConfirmationModalComponent {
  @Input() message: string = 'Are you sure you want to proceed with this action?';

  @Input() confirmText: string = 'Confirm Action';

  @Output() confirm = new EventEmitter<void>();

  @Output() cancel = new EventEmitter<void>();
}