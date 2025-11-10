import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NotificationDto } from '../../../dto/dto';
import { AvatarMissingService } from '../../../service/avatar-missing-service';

@Component({
  selector: 'app-notification-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './notification-item.html',
  styleUrls: ['./notification-item.scss']
})
export class NotificationItemComponent {
  @Input() notification!: NotificationDto;
  @Output() clicked = new EventEmitter<NotificationDto>();
  @Output() deleted = new EventEmitter<NotificationDto>();
  @Output() markRead = new EventEmitter<NotificationDto>();
  @Output() markUnread = new EventEmitter<NotificationDto>();

  missing = inject(AvatarMissingService);

  onClick(): void {
    this.clicked.emit(this.notification);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.deleted.emit(this.notification);
  }

  markAsRead(event: Event): void {
    event.stopPropagation();
    this.markRead.emit(this.notification);
  }

  markAsUnread(event: Event): void {
    event.stopPropagation();
    this.markUnread.emit(this.notification);
  }

  toggleReadStatus(event: Event): void {
    event.stopPropagation();
    console.log("chob");
    
    if (this.notification.seen) {
      this.markUnread.emit(this.notification);
    } else {
      this.markRead.emit(this.notification);
    }
  }

  getActionText(): string {
    switch (this.notification.type) {
      case 'FOLLOW':
        return 'just shared a new post.';
      case 'POST':
        return 'posted something you might like';
      case 'LINK':
        return 'wants you to see a post';
      case 'REMOVED':
        return 'Your post was removed';
      case 'HIDDEN':
        return 'Your post was hidden';
      default:
        return '';
    }
  }

  getMessagePreview(): string {
    switch (this.notification.type) {
      case 'FOLLOW':
        return `${this.notification.sender?.username} started following you`;
      case 'POST':
        return 'Check out their latest post';
      case 'LINK':
        return 'They think you might be interested';
      case 'REMOVED':
        return 'One of your posts got removed — careful, you might be next!';
      case 'HIDDEN':
        return 'One of your posts was hidden by an admin. Review our guidelines.';
      default:
        return '';
    }
  }

  getRelativeTime(): string {
    const date = new Date(this.notification.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }

  get formattedDate(): string {
    return new Date(this.notification.createdAt).toLocaleString();
  }
}