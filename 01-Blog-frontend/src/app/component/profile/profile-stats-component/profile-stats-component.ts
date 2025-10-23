import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../../dto/dto';

@Component({
  selector: 'app-profile-stats',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-stats-component.html',
  styleUrls: ['./profile-stats-component.scss']
})
export class ProfileStatsComponent {
  @Input() followersCount: number = 0;
  @Input() followingCount: number = 0;
  @Input() people: User[] = [];
}
