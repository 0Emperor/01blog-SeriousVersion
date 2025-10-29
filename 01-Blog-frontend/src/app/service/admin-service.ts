import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DashboardData, report, User } from '../dto/dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  readonly baseApi = "http://localhost:8080/api/admin/"
  http = inject(HttpClient)
  getDashboardData() {
    return this.http.get<DashboardData>(this.baseApi + "dashboard")
  }
  hide(PostToHideid: string) {
    return this.http.patch(this.baseApi + "hide/" + PostToHideid, {})
  }
  unhide(PostTounHideid: string) {
    return this.http.patch(this.baseApi + "unhide/" + PostTounHideid, {})
  }
  deleteUser(userTodeletId: string) {
    return this.http.delete(this.baseApi + userTodeletId)
  }
  banUser(userToBanId: string) {
    return this.http.post(this.baseApi + "ban/" + userToBanId, {})
  }
  unbanUser(userTounBanId: string) {
    return this.http.post(this.baseApi + "unban/" + userTounBanId, {})
  }
  deletePost(PostToDeleteId: string) {
    return this.http.delete(this.baseApi + "posts/" + PostToDeleteId)
  }
  getAllReports() {
    return this.http.get<report[]>(this.baseApi + "reports")
  }
  getAllUsers() {
    return this.http.get<User[]>(this.baseApi + "users")
  }
  dismiss(rid: string){
    return this.http.patch(this.baseApi+"dismiss/"+rid,{})
  }
}
