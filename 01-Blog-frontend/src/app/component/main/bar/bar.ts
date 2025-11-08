import { CommonModule } from '@angular/common';
import { Component, inject, signal, computed } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../../service/auth';
import { UserHeaderComponent } from "../../users/user-header/user-header";
import { NotificationService } from '../../../service/notification';
import { firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

interface NavItem {
  id: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule, RouterLink, UserHeaderComponent, RouterLinkActive],
  templateUrl: './bar.html',
  styleUrls: ['./bar.scss']
})
export class Bar {
  activeItem = 'home';
  auth = inject(Auth);

  constructor(private router: Router) { }

  navItems = signal<NavItem[]>([
    { id: 'home', icon: 'home', label: 'Home' },
    { id: 'explore', icon: 'explore', label: 'Explore' },
    { id: 'notifications', icon: 'notifications', label: 'Notifications' },
  ]);

unreadCount = NotificationService.unreadCount
 ngOnInit() {
    this.auth.checkAdmin().subscribe({
      next: () => {
        this.navItems.update((l) => [...l, {
          id: 'admin',
          icon: 'manage_accounts',
          label: 'Admin panel'
        }]);
      },
    });

  }

  logout() {
    localStorage.clear();
    this.router.navigate(["login"]);
  }
}