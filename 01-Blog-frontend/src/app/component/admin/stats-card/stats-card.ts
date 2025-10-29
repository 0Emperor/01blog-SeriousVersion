import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-stats-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-card.html',
  styleUrls: ['./stats-card.scss']
})
export class StatsCardComponent {
  @Input() type!: 'TUsers' | 'TPosts' | 'TUnhadeledReport';
  @Input() stat!: {
    totalNumber: number;
    percentageChange: number;
  }
  ;

  get cardConfig() {
    const configs = {
      TUsers: {
        title: 'Total Users',
        icon: 'users',
        color: 'purple',
        gradient: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
      },
      TPosts: {
        title: 'Total Posts',
        icon: 'posts',
        color: 'pink',
        gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)'
      },
      TUnhadeledReport: {
        title: 'Open Reports',
        icon: 'reports',
        color: 'orange',
        gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
      }
    };
    return configs[this.type];
  }

  get isPositiveChange(): boolean {
    return this.stat.percentageChange >= 0;
  }

  get formattedNumber(): string {
    return this.stat.totalNumber.toLocaleString();
  }

  get changeText(): string {
    const prefix = this.isPositiveChange ? '+' : '';
    return `${prefix}${this.stat.percentageChange}%`;
  }

  get timePeriod(): string {
    return 'since last week';
  }
}