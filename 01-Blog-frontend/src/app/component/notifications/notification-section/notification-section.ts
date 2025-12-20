import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationService } from '../../../service/notification';
import { NotificationDto } from '../../../dto/dto';
import { NotificationItemComponent } from '../notification-item/notification-item';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NotificationItemComponent],
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

  public async loadNotifications() {
    this.isLoading.set(true);
    try {
      const data = await this.notificationService
        .getNotifications(this.currentPage(), this.pageSize)
        .toPromise();

      if (data) {
        this.notifications.set(data);
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  async handleNotificationClick(notification: NotificationDto) {
    // Mark as seen if not already
    if (!notification.seen) {
      await this.handleMarkAsRead(notification);
    }

    // Navigate if there's a link
    if (notification.link) {
      this.router.navigateByUrl(notification.link);
    }
  }

  async handleNotificationDelete(notification: NotificationDto) {
    try {
      await this.notificationService.delete(notification.id).toPromise();
      // Remove from local state
      const updated = this.notifications().filter(n => n.id !== notification.id);
      this.notifications.set(updated);
      if (!notification.seen) {
        this.notificationService.minus()
      }
    } catch (error) {
    }
  }

  async handleMarkAsRead(notification: NotificationDto) {
    try {
      await this.notificationService.markAsSeen(notification.id).toPromise();
      // Update local state
      const updated = this.notifications().map(n =>
        n.id === notification.id ? { ...n, seen: true } : n
      );
      this.notificationService.minus()
      
      this.notifications.set(updated);
    } catch (error) {
    }
  }

  async handleMarkAsUnread(notification: NotificationDto) {
    try {
      await this.notificationService.markAsSeen(notification.id).toPromise();
      // Update local state
      const updated = this.notifications().map(n =>
        n.id === notification.id ? { ...n, seen: false } : n
      );
      this.notificationService.plus()
      this.notifications.set(updated);
    } catch (error) {
    }
  }

  async clearAll() {
    if (!confirm('Are you sure you want to clear all notifications?')) {
      return;
    }

    this.isClearing.set(true);
    try {
      await this.notificationService.clear().toPromise();
      this.notifications.update(b => b.filter(n => !n.seen));
    } catch (error) {
    } finally {
      this.isClearing.set(false);
    }
  }

  async markAllAsRead() {
    this.isMarkingAllRead.set(true);
    try {
      await this.notificationService.markAllAsSeen().toPromise();
      const updated = this.notifications().map(n => ({ ...n, seen: true }));
      this.notifications.set(updated);
      this.notificationService.reset()
    } finally {
      this.isMarkingAllRead.set(false);
    }
  }
}