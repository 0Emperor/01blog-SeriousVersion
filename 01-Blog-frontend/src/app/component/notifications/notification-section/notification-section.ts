import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../service/notification';
import { NotificationDto } from '../../../dto/dto';
import { UserHeaderComponent } from "../../users/user-header/user-header";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, UserHeaderComponent],
  templateUrl: './notification-section.html',
  styleUrls: ['./notification-section.scss']
})
export class NotificationsComponent implements OnInit {
  notificationService = inject(NotificationService);
  router = inject(Router);

  notifications = signal<NotificationDto[]>([]);
  isLoading = signal(false);
  isClearing = signal(false);
  isMarkingAllRead = signal(false);
  currentPage = signal(0);
  pageSize = 20;

  ngOnInit() {
    this.loadNotifications();
  }

  async loadNotifications() {
    this.isLoading.set(true);
    try {
      const data = await this.notificationService
        .getNotifications(this.currentPage(), this.pageSize)
        .toPromise();
      
      if (data) {
        this.notifications.set(data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async handleNotificationClick(notification: NotificationDto) {
    // Mark as seen
    if (!notification.seen) {
      try {
        await this.notificationService.markAsSeen(notification.id).toPromise();
        // Update local state
        const updated = this.notifications().map(n => 
          n.id === notification.id ? { ...n, seen: true } : n
        );
        this.notifications.set(updated);
      } catch (error) {
        console.error('Error marking notification as seen:', error);
      }
    }

    // Navigate if there's a link
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }
  }

  async deleteNotification(event: Event, id: number) {
    event.stopPropagation();
    
    try {
      await this.notificationService.delete(id).toPromise();
      // Remove from local state
      const updated = this.notifications().filter(n => n.id !== id);
      this.notifications.set(updated);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }

  async clearAll() {
    if (!confirm('Are you sure you want to clear all notifications?')) {
      return;
    }

    this.isClearing.set(true);
    try {
      await this.notificationService.clear().toPromise();
      this.notifications.set([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    } finally {
      this.isClearing.set(false);
    }
  }

  async markAllAsRead() {
    this.isMarkingAllRead.set(true);
    try {
      await this.notificationService.markAllAsSeen().toPromise();
      // Update all notifications to seen
      const updated = this.notifications().map(n => ({ ...n, seen: true }));
      this.notifications.set(updated);
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      this.isMarkingAllRead.set(false);
    }
  }

  getNotificationMessage(notification: NotificationDto): string {
    const username = notification.sender?.username || 'System';
    
    switch (notification.type) {
      case 'FOLLOW':
        return `${username} just started following you`;
      case 'POST':
        return `${username} posted something you might like`;
      case 'LINK':
        return `${username} wants you to see a post you might like`;
      case 'REMOVED':
        return `One of your posts got removed — careful, you might be next!`;
      case 'HIDDEN':
        return `One of your posts was hidden by an admin`;
      default:
        return 'You have a new notification';
    }
  }

  getNotificationTitle(notification: NotificationDto): string {
    if (notification.sender) {
      return notification.sender.username;
    }
    return 'System';
  }

  getNotificationSubtitle(notification: NotificationDto): string {
    switch (notification.type) {
      case 'FOLLOW':
        return 'just started following you.';
      case 'POST':
        return 'just shared a new post.';
      case 'LINK':
        return 'shared a link with you.';
      case 'REMOVED':
        return 'Your post has been removed.';
      case 'HIDDEN':
        return 'Your post has been hidden.';
      default:
        return 'New notification';
    }
  }

  getNotificationDetail(notification: NotificationDto): string {
    switch (notification.type) {
      case 'POST':
        return 'A glimpse into the latest artistic trends';
      case 'LINK':
        return 'Check out this amazing content!';
      case 'REMOVED':
        return 'Carefull, u might be next';
      case 'HIDDEN':
        return 'Contact support if you believe this was a mistake';
      default:
        return '';
    }
  }

  getTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hour${Math.floor(seconds / 3600) > 1 ? 's' : ''} ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} day${Math.floor(seconds / 86400) > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  }

  isSystemNotification(notification: NotificationDto): boolean {
    return notification.sender === null;
  }

  getAvatarOrIcon(notification: NotificationDto): string {
    if (this.isSystemNotification(notification)) {
      return 'system'; // We'll use this to show an icon
    }
    return notification.sender?.profile || '';
  }
}
