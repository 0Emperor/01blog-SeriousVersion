import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin-service';
import { User } from '../../../dto/dto';
import { ConfirmationModalComponent } from "../confirm/confirm";
import { AvatarMissingService } from '../../../service/avatar-missing-service';


@Component({
  selector: 'app-recent-users',
  standalone: true,
  imports: [CommonModule, ConfirmationModalComponent],
  templateUrl: './recent-users.html',
  styleUrls: ['./recent-users.scss']
})


export class RecentUsersComponent {
  @Input() recentUser: User[] = [];
  @Input() title? ="Recent Users"
  missing = inject(AvatarMissingService)
  showConfirmModal: boolean = false;
  pendingAction: 'ban' | 'unban' | 'delete' | null = null;
  userToActOn: User | null = null;
  confirmMessage: string = '';
  confirmButtonText: string = '';
  private adminService = inject(AdminService);
  private router = inject(Router);

  getInitials(username: string): string {
    return username.substring(0, 2).toUpperCase();
  }

  // 👇 Navigates to the user profile as requested
  onUserClick(username: string): void {
    this.router.navigate(['/profile', username]);
  }
  // 👇 Logic to determine user status (Active, Admin, Banned)
  getUserStatus(user: User): string {
    if (user.isBaned) return 'Banned';
    if (user.role === 'ADMIN') return 'Admin';
    return 'Active';
  }

  // 👇 Logic to determine the badge class
  getStatusClass(user: User): string {
    if (user.isBaned) return 'banned'; // Needs corresponding SCSS class
    if (user.role === 'ADMIN') return 'admin';
    return 'active';
  }
  triggerUserAction(user: User, action: 'ban' | 'unban' | 'delete') {
    this.userToActOn = user;
    this.pendingAction = action;
    this.showConfirmModal = true;
    const username = user.username;

    switch (action) {
      case 'delete':
        this.confirmMessage = `Are you absolutely sure you want to PERMANENTLY delete user ${username}? This cannot be undone.`;
        this.confirmButtonText = "Delete User";
        break;
      case 'ban':
        this.confirmMessage = `Are you sure you want to BAN user ${username}? They will lose access immediately.`;
        this.confirmButtonText = "Ban User";
        break;
      case 'unban':
        this.confirmMessage = `Are you sure you want to UNBAN user ${username}? They will regain access.`;
        this.confirmButtonText = "Unban User";
        break;
    }
  }

  // 👇 Executes the action once confirmed
  onConfirmAction() {
    this.showConfirmModal = false; // Close modal
    const user = this.userToActOn;
    const action = this.pendingAction;

    if (!user || !action) return;

    let apiCall;
    
    switch (action) {
      case 'delete':
        apiCall = this.adminService.deleteUser(user.id);
        break;
      case 'ban':
        apiCall = this.adminService.banUser(user.id);
        break;
      case 'unban':
        apiCall = this.adminService.unbanUser(user.id);
        break;
    }

    apiCall.subscribe({
        next: () => {
            if (action === 'delete') {
                this.recentUser = this.recentUser.filter(u => u.id !== user.id);
            } else {
                user.isBaned = (action === 'ban'); // Update local state
            }
            console.log(`User ${user.username} ${action}ned successfully.`);
        },
        error: (err) => console.error(`Error ${action}ning user:`, err)
    });

    this.userToActOn = null;
    this.pendingAction = null;
  }
  onBanToggle(user: User): void {
    const action = user.isBaned ? 'unban' : 'ban';
    this.triggerUserAction(user, action);
  }

  onDelete(user: User): void {
    this.triggerUserAction(user, 'delete');
  }
}