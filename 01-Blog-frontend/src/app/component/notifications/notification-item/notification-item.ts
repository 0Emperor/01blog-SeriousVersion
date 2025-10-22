import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NotificationDto } from '../../../dto/dto';
import { UserHeaderComponent } from '../../users/user-header/user-header';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-notification-item',
  imports: [UserHeaderComponent, RouterLink],
  templateUrl: './notification-item.html',
  styleUrls: ['./notification-item.scss']
})
export class NotificationItemComponent {

  @Input() notification!: NotificationDto;

  // Emit event when notification is clicked (for marking as seen or handling link)
  @Output() clicked = new EventEmitter<NotificationDto>();
  @Output() deleted = new EventEmitter<NotificationDto>();

  onClick(): void {
    this.clicked.emit(this.notification);
  }
  onDelete(): void {
    this.deleted.emit(this.notification)
  }
  // Helper: format timestamp for display
  get formattedDate(): string {
    return new Date(this.notification.createdAt).toLocaleString();
  }
  get verboseMessage(): string {
    switch (this.notification.type) {
      case "FOLLOW":
        return `${this.notification.sender?.username} just started following you`;
      case "POST":
        return `${this.notification.sender?.username} posted something you might like`;
      case "LINK":
        return `${this.notification.sender?.username} wants you to see a post you might like`;
      case "REMOVED":
        return `One of your posts got removed — careful, you might be next!`;
      case "HIDDEN":
        return `One of your posts was hidden by an admin`;
    }
  }
}
