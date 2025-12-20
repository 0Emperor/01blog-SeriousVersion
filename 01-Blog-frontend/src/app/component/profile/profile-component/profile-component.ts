import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProfileDto, User } from '../../../dto/dto'; // Adjust path
import { ProfileService } from '../../../service/profile-service'; // Adjust path
import { Follow } from '../../../service/follow'; // Adjust path
import { AdminService } from '../../../service/admin-service'; // Adjust path
import { UserStore } from '../../../service/user'; // Adjust path
import { ToastService } from '../../../service/toast-service';
import { Observable } from 'rxjs';

// Import the components this wrapper uses
import { ProfileHeaderComponent } from "../profile-header-component/profile-header-component"; // Adjust path
import { Feed } from '../../feed/feed'; // Adjust path
import { ConfirmationModalComponent } from '../../admin/confirm/confirm';

@Component({
  selector: 'app-profile',
  templateUrl: './profile-component.html',
  styleUrls: ['./profile-component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ProfileHeaderComponent,
    Feed,
    ConfirmationModalComponent
  ]
})
export class ProfileComponent implements OnInit {
  profile: ProfileDto | null = null;
  username: string = '';

  // Modal State Properties
  showConfirmModal: boolean = false;
  pendingAction: 'ban' | 'unban' | 'delete' | null = null;
  confirmMessage: string = '';
  confirmButtonText: string = '';

  // Inject services
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private profileService = inject(ProfileService);
  private followService = inject(Follow);
  private userStore = inject(UserStore);
  private adminService = inject(AdminService);
  private toastService = inject(ToastService);

  ngOnInit(): void {
    // Subscribe to route changes to reload profile
    this.route.paramMap.subscribe(params => {
      this.username = params.get('username') || '';
      this.loadProfile();
    });
  }
showFeed: boolean = false;
  loadProfile() {
    this.profileService.getProfile(this.username).subscribe({
      next: (data) => {this.profile = data
        this.showFeed = false;
      setTimeout(() => this.showFeed = true, 0);
      }
    });
  }

  // --- EVENT HANDLERS FROM HEADER ---

  /** Handle Save button click (own profile) */
  onSave({ username, bio, file }: { username?: string; bio?: string; file?: File }) {
    if (!username && !bio && !file) {
      return;
    }

    // Call service with all editable fields
    this.profileService.updateProfile(username, bio, file).subscribe(({ user, jwt }) => {
      if (this.profile) this.profile.user = user;
      localStorage.setItem("jwt", jwt);
      this.userStore.setUser(user);

      // If username changed, navigate to new URL
      if (this.username !== user.username) {
        this.router.navigate(['profile', user.username]);
      } else {
        // Otherwise, just reload the data
        this.loadProfile();
      }
    });
  }

  /** Handle Follow/Unfollow button click (other users) */
  onFollowToggle() {
    if (!this.profile) return;
    const uid = this.profile.user.id;

    const apiCall = this.profile.isFollowing
      ? this.followService.unfollow(uid)
      : this.followService.follow(uid);

    apiCall.subscribe({
      next: () => {
        if (this.profile) {
          // Toggle local state
          this.profile.isFollowing = !this.profile.isFollowing;
          // Optimistically update follower count
          this.profile.followersCount += this.profile.isFollowing ? 1 : -1;

          if (this.profile.isFollowing) {
            this.toastService.show("User followed successfully", "Success", "success");
          } else {
            this.toastService.show("User unfollowed successfully", "Success", "success");
          }
        }
      },
    });
  }

  // --- ADMIN ACTION HANDLERS ---

  onBanToggle() {
    if (!this.profile) return;
    const action = this.profile.user.isBaned ? 'unban' : 'ban';
    this.triggerAdminAction(action, this.profile.user);
  }

  onDeleteUser() {
    if (!this.profile) return;
    this.triggerAdminAction('delete', this.profile.user);
  }

  // --- CONFIRMATION MODAL LOGIC ---

  triggerAdminAction(action: 'ban' | 'unban' | 'delete', user: User) {
    this.pendingAction = action;
    this.showConfirmModal = true;

    switch (action) {
      case 'delete':
        this.confirmMessage = `Are you absolutely sure you want to PERMANENTLY delete user ${user.username}? This cannot be undone.`;
        this.confirmButtonText = "Delete User";
        break;
      case 'ban':
        this.confirmMessage = `Are you sure you want to BAN user ${user.username}?`;
        this.confirmButtonText = "Ban User";
        break;
      case 'unban':
        this.confirmMessage = `Are you sure you want to UNBAN user ${user.username}?`;
        this.confirmButtonText = "Unban User";
        break;
    }
  }

  onConfirmAction() {
    this.showConfirmModal = false;
    const user = this.profile?.user;
    const action = this.pendingAction;

    if (!user || !action) return;

    let apiCall: Observable<any>;

    // Use the user-provided AdminService methods
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
          // If user deleted, navigate away
          this.router.navigate(['/']);
        } else if (this.profile) {
          // Just update the local state
          this.profile.user.isBaned = (action === 'ban');
        }
      },
    });

    this.pendingAction = null; // Reset
  }
}