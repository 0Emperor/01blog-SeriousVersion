import { Component } from '@angular/core';
import { StatsCard } from '../stats-card/stats-card';
import { RecentReports } from '../recent-reports/recent-reports';
import { RecentUsers } from '../recent-users/recent-users';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatsCard,RecentReports,RecentUsers],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent { }
