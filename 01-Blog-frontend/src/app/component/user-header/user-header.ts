import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserStore } from '../../service/user';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-header.html',
  styleUrl: './user-header.scss'
})
export class UserHeaderComponent implements OnInit {
  
  // The User object passed from the parent component (e.g., Feed or Post Detail)
  constructor(private userS:UserStore){}
  // Properties for the Initials Avatar logic
  userInitial: string = '';
  avatarBackgroundColor: string = '#ccc'; // Default fallback color
get user(){
return this.userS.user();
}
  // A list of colors for unique initial avatars
  private colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', 
    '#2196f3', '#00bcd4', '#009688', '#4caf50', '#ff9800', 
    '#ff5722', '#607d8b'
  ];

  ngOnInit() {
    // Only calculate initial and color if the profile picture is missing
    console.log("hi")
    if (this.user&&!this.user.profile) {
      this.userInitial = this.getInitial(this.user.username);
      this.avatarBackgroundColor = this.getBackgroundColor(this.user.username);
    }
  }

  /**
   * Extracts the first letter of the username for the avatar placeholder.
   */
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