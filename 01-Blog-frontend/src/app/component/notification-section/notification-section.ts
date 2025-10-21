import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { NotificationItemComponent } from '../notification-item/notification-item';
import { NotificationDto } from '../../dto/dto';
import { NotificationService } from '../../service/notification';

@Component({
  selector: 'app-notification-section',
  standalone: true,
  imports: [CommonModule, NotificationItemComponent, MatButtonModule],
  templateUrl: './notification-section.html',
  styleUrl: './notification-section.scss',
})
export class NotificationSection implements OnInit {
  notifications: NotificationDto[] = [];
  loading = false;
  page = 0;
  size = 10;
  allLoaded = false;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  async loadNotifications() {
    if (this.loading || this.allLoaded) return;
    this.loading = true;

    try {
      const data: NotificationDto[] =
        (await firstValueFrom(
          this.notificationService.getNotifications(this.page, this.size)
        )) || [];

      if (data.length < this.size) this.allLoaded = true;

      this.notifications.push(...data);
      this.page++;
    } finally {
      this.loading = false;
    }
  }

  async markAllAsSeen() {
    await firstValueFrom(this.notificationService.markAllAsSeen());
    this.notifications.forEach((n) => (n.seen = true));
  }

  async onItemClick(notification: NotificationDto) {
    if (!notification.seen) {
      await firstValueFrom(this.notificationService.markAsSeen(notification.id));
      notification.seen = true;
    }
  }
}
