import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserStore } from '../../service/user';
import { User } from '../../dto/dto';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-header.html',
  styleUrl: './user-header.scss'
})
export class UserHeaderComponent  {

  // The User object passed from the parent component (e.g., Feed or Post Detail)
  constructor(private userS: UserStore) { }
  // Properties for the Initials Avatar logic
  @Input() userr?: User;
 // Default fallback color
  get user() {
    if (this.userr) {
      return this.userr
    }
    return this.userS.user();
  }
  private colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
    '#2196f3', '#00bcd4', '#009688', '#4caf50', '#ff9800',
    '#ff5722', '#607d8b'
  ];


  /**
   * Extracts the first letter of the username for the avatar placeholder.
   */
  protected getInitial(username: string): string {
    return username.charAt(0).toUpperCase();
  }

  /**
   * Selects a consistent background color based on the username string (simple hash).
   */
  protected getBackgroundColor(username: string): string {
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