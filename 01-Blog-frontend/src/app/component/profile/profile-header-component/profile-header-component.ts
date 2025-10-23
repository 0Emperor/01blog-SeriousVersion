import { Component, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User } from '../../../dto/dto';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-header-component.html',
  styleUrls: ['./profile-header-component.scss']
})
export class ProfileHeaderComponent {
  @Input() user!: User;
  @Input() isMe = false;
  @Input() isFollowing = false;

  @Output() save = new EventEmitter<{ username?: string;bio?:string ;file?: File }>();
  @Output() follow = new EventEmitter<void>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  editableUsername = '';
  selectedFile?: File;
  selectedFilePreview: string | null = null;

  ngOnInit() {
    this.editableUsername = this.user.username;
  }

  onAvatarClick() {
    if (this.isMe) this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = e => {
      this.selectedFilePreview = e.target?.result as string;
    };
    reader.readAsDataURL(this.selectedFile);
  }

  onSaveClick() {
    this.save.emit({ username: this.editableUsername, file: this.selectedFile });
  }

  onFollowClick() {
    this.follow.emit();
  }

  getInitial(username: string): string {
    return username ? username.charAt(0).toUpperCase() : '?';
  }

  getBackgroundColor(username: string): string {
    const colors = ['#6a5acd', '#ff7f50', '#20b2aa', '#dc143c', '#1e90ff'];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  }
}
