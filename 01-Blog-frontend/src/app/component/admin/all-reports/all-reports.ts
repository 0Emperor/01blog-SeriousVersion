import { Component, inject, Input } from '@angular/core';
import { AdminService } from '../../../service/admin-service';
import { report } from '../../../dto/dto';
import { RecentreportsComponent } from "../recent-reports/recent-reports";

@Component({
  selector: 'app-all-reports',
  imports: [RecentreportsComponent],
  templateUrl: './all-reports.html',
  styleUrl: './all-reports.scss'
})
export class AllReports {
  adminSrevice = inject(AdminService)
  reports: report[] = []
  @Input() howMuch? =0
  ngOnInit() {
    this.adminSrevice.getAllReports().subscribe({
      next: (d) => {
        this.reports = d;
      }
    })
  }
}
