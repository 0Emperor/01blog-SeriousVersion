import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserStore } from '../../../service/user';
import { User } from '../../../dto/dto';
import { AvatarMissingService } from '../../../service/avatar-missing-service';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-header.html',
  styleUrl: './user-header.scss'
})
export class UserHeaderComponent {

  // The User object passed from the parent component (e.g., Feed or Post Detail)
  constructor(private userS: UserStore) { }
  // Properties for the Initials Avatar logic
  missing = inject(AvatarMissingService)
  @Input() userr?: User;
  // Default fallback color
  get user() {

    if (this.userr) {
      return this.userr
    }
    console.log(this.userS.user());
    
    return this.userS.user();
  }

  protected getInitial(username: string): string {
    
    
    return this.missing.getInitial(username);
  }
  protected getBackgroundColor(username: string): string {
    return this.missing.getBackgroundColor(username)
  }
}