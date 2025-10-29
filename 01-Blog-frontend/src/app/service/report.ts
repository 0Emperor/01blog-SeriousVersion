import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { reason } from '../dto/dto';

@Injectable({
  providedIn: 'root'
})
export class Report {
  http = inject(HttpClient)
  readonly BASE_APi = "http://localhost:8080/api/report/"
  report(PostToReportID: string, reason: reason) {
    return this.http.post(this.BASE_APi + PostToReportID, reason)
  }
}
