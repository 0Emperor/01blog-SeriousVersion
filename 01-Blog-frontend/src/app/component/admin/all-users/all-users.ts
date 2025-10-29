import { Component, inject, Input } from '@angular/core';
import { User } from '../../../dto/dto';
import { AdminService } from '../../../service/admin-service';
import { RecentUsersComponent } from "../recent-users/recent-users";

@Component({
  selector: 'app-all-users',
  imports: [RecentUsersComponent],
  templateUrl: './all-users.html',
  styleUrl: './all-users.scss'
})
export class AllUsers {
  adminSrevice = inject(AdminService)
  users: User[] = []
  @Input() howMuch? =0
  ngOnInit() {
    this.adminSrevice.getAllUsers().subscribe({
      next: (d) => {
        this.users = d;
      }
    })
  }
}
