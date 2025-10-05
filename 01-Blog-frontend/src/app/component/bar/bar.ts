import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '../../service/auth';


interface NavItem {
  id: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-bar',
  standalone: true,
  imports: [CommonModule],
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
    { id: 'profile', icon: 'person', label: 'Profile' },
  ]);

  userProfile = {
    name: 'Sophia',
    username: '@sophia.art',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia'
  };

  setActiveItem(itemId: string): void {
    this.activeItem = itemId;
    this.router.navigate([itemId]);
  }

  isActive(itemId: string): boolean {
    return this.activeItem === itemId;
  }
  ngOnInit() {
    this.auth.checkAdmin().subscribe({
      next: () => {this.navItems.update((l) => [...l, { id: 'admin', icon: 'manage_accounts', label: 'Admin panel' }])},
    })
  }
  onCreatePost(): void {
    // Handle create post action
    console.log('Create post clicked');
  }
}
