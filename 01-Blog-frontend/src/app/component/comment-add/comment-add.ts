import { Component, inject, signal } from '@angular/core';
import { UserStore } from '../../service/user';

@Component({
  selector: 'app-comment-add',
  imports: [],
  templateUrl: './comment-add.html',
  styleUrl: './comment-add.scss'
})
export class CommentAdd {
  commentText = signal('');
  userS = inject(UserStore)
  submitComment() {
    
    if (this.commentText().trim()) {
      console.log('Comment submitted:', this.commentText());
      // EMIT or SERVICE CALL here
      this.commentText.set('');
    }
  }

  openEmojiPicker() {
    console.log('Opening emoji picker...');
    // TOGGLE EMOJI PICKER UI here
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
      console.log(this.userS?.getUser?.profile)
      console.log(this.userS?.getUser);
      
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
}}
