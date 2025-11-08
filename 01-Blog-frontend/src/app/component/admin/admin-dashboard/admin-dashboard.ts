import { Component, inject } from '@angular/core';
import { StatsCardComponent } from '../stats-card/stats-card';
import { RecentUsersComponent } from '../recent-users/recent-users';
import { DashboardData} from '../../../dto/dto';
import { AdminService } from '../../../service/admin-service';
import { RecentreportsComponent } from '../recent-reports/recent-reports';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatsCardComponent, RecentreportsComponent, RecentUsersComponent, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboardComponent {
  dashboardData: DashboardData | undefined;
  private adminService = inject(AdminService);

  ngOnInit() {
    this.adminService.getDashboardData().subscribe({
      next: (d) =>{ (this.dashboardData = d);console.log(d);
      }
    });
  }
}
