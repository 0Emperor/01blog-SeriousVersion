import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationDto } from '../../dto/dto';
import { UserHeaderComponent } from '../user-header/user-header';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-notification-item',
  imports:[UserHeaderComponent,RouterLink],
  templateUrl: './notification-item.html',
  styleUrls: ['./notification-item.scss']
})
export class NotificationItemComponent {

  @Input() notification!: NotificationDto;

  // Emit event when notification is clicked (for marking as seen or handling link)
  @Output() clicked = new EventEmitter<NotificationDto>();

  onClick(): void {
    this.clicked.emit(this.notification);
  }

  // Helper: format timestamp for display
  get formattedDate(): string {
    return new Date(this.notification.createdAt).toLocaleString();
  }
}
