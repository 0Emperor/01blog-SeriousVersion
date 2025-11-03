import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileDto } from '../../../dto/dto';
import { ProfileService } from '../../../service/profile-service';
import { Follow } from '../../../service/follow';
import { AdminService } from '../../../service/admin-service';
import { RouterLink } from "@angular/router";
import { UserStore } from '../../../service/user';
import { AvatarMissingService } from '../../../service/avatar-missing-service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile-header-component.html',
  styleUrls: ['./profile-header-component.scss']
})
export class ProfileHeaderComponent {
  @Input() profileData!: ProfileDto;
  @Input() currentUserRole: 'beta' | 'ADMIN' = 'beta';

  profileService = inject(ProfileService);
  followService = inject(Follow);
  adminService = inject(AdminService);
  usersStore = inject(UserStore)
  location = inject(Location)

  @Output() banToggle = new EventEmitter<void>();
  @Output() followToggle = new EventEmitter<void>();
  @Output() deleteUser = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit() {
    if (this.usersStore.getUser?.role) this.currentUserRole = this.usersStore.getUser?.role;
  }
  // Edit mode signals
  isEditingUsername = signal(false);
  isEditingName = signal(false)
  isEditingBio = signal(false);
  isEditingImage = signal(false);
  missing = inject(AvatarMissingService)
  // Temporary edit values
  editedName = signal('')
  editedUsername = signal('');
  editedBio = signal('');
  selectedFile = signal<File | null>(null);
  previewUrl = signal<string | null>(null);

  // Loading states
  isSaving = signal(false);

  get isViewingOwnProfile(): boolean {
    return this.profileData.isMe;
  }

  get isViewedByAdmin(): boolean {
    return this.currentUserRole === 'ADMIN' && !this.profileData.isMe;
  }
  get isAdmin() {
    return this.currentUserRole === 'ADMIN'
  }

  editProfileClick() {

    this.fileInput.nativeElement.click();
    this.fileInput.nativeElement.click();

    this.fileInput.nativeElement.click()
  }
  getBadgeInfo(): { text: string; class: string } | null {
    const user = this.profileData.user;

    if (user.role === 'ADMIN') {
      return { text: 'Admin', class: 'badge-admin' };
    }

    if (user.isBaned) {
      return { text: 'Banned', class: 'badge-banned' };
    }

    return { text: 'Active', class: 'badge-active' };
  }

  startEditUsername() {
    this.editedUsername.set(this.profileData.user.username);
    this.isEditingUsername.set(true);
  }
  startEditName() {

    this.editedName.set(this.profileData.user.name);
    this.isEditingName.set(true);
  }
  startEditBio() {
    this.editedBio.set(this.profileData.user.bio);
    this.isEditingBio.set(true);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile.set(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewUrl.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      this.isEditingImage.set(true);
    }
  }

  cancelEdit() {
    this.isEditingUsername.set(false);
    this.isEditingName.set(false);
    this.isEditingBio.set(false);
    this.isEditingImage.set(false);
    this.selectedFile.set(null);
    this.previewUrl.set(null);
  }

  async saveChanges() {
    this.isSaving.set(true);
    try {
      const username = this.isEditingUsername() ? this.editedUsername() : undefined;
      const bio = this.isEditingBio() ? this.editedBio() : undefined;
      const file = this.selectedFile() || undefined;
      const name = this.isEditingName() ? this.editedName() : undefined;

      const response = await this.profileService.updateProfile(username, bio, file, name).toPromise();

      if (response) {
        // Update local profile data
        if (username) this.profileData.user.username = response.user.username;
        if (bio) this.profileData.user.bio = response.user.bio;
        if (file) this.profileData.user.profile = response.user.profile;
        if (name) this.profileData.user.name = response.user.name;

        if (response.jwt) {
          localStorage.setItem('jwt', response.jwt);
          this.location.replaceState(`/profile/${username}`)
        }

        // Reset edit states
        this.cancelEdit();
        this.usersStore.setUser(this.profileData.user)
      }
    } finally {
      this.isSaving.set(false);
    }
  }

  async toggleFollow() {
    this.followToggle.emit()
  }

  async banUser() {
    this.banToggle.emit()

  }

  async unbanUser() {
    this.banToggle.emit()
  }

  async delete() {
    this.deleteUser.emit()
  }
}
