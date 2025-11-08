import { Component, inject, Input, signal } from '@angular/core';
import { UserStore } from '../../../service/user';
import { CommentS } from '../../../service/comment';
import { CommentShare } from '../../../service/comment-share';
import { ToastService } from '../../../service/toast-service';

@Component({
  selector: 'app-comment-add',
  imports: [],
  templateUrl: './comment-add.html',
  styleUrl: './comment-add.scss'
})
export class CommentAdd {
  commentText = signal('');
  userS = inject(UserStore)
  commentService = inject(CommentS)
  cmmentPublish = inject(CommentShare)
  toastService = inject(ToastService);

  @Input() pId!: string;
  submitComment() {
    if (this.commentText().trim()) {
      this.commentService.addComment(this.commentText(), this.pId).subscribe({
        next: (d) => {
          this.cmmentPublish.changeMessage(d);
        },
        error(err) {
            
        },
      })
      this.commentText.set('');
    }
  }

  emojiPickerVisible = false;

  openEmojiPicker() {
    this.emojiPickerVisible = !this.emojiPickerVisible;
    console.log('Emoji picker is now:', this.emojiPickerVisible ? 'open' : 'closed');
  }

  addEmoji(emoji: string) {
    this.commentText.set((this.commentText() || '') + emoji);
    this.emojiPickerVisible = false; // optionally close after picking
  }

  userInitial: string = '';
  avatarBackgroundColor: string = '#ccc'; // Default fallback color
  private colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#00bcd4', '#009688', '#4caf50', '#ff9800',
    '#ff5722', '#607d8b'
  ];
  /**
* Extracts the first letter of the username for the avatar placeholder.
*/

  ngOnInit() {
    if (this.userS.getUser && !this.userS.getUser.profile) {
      this.userInitial = this.getInitial(this.userS.getUser.username);
      this.avatarBackgroundColor = this.getBackgroundColor(this.userS.getUser.username);
    }
  }
  private getInitial(username: string): string {
    return username.charAt(0).toUpperCase();
  }

  /**
   * Selects a consistent background color based on the username string (simple hash).
   */
  private getBackgroundColor(username: string): string {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      // Simple non-cryptographic hash function
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Map the hash to an index in the color array
    const index = Math.abs(hash) % this.colors.length;
    return this.colors[index];
  }
}
