import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Report {
  http = inject(HttpClient)
  readonly BASE_APi = "http://localhost:8080/api/report/"
  // report(pId:string,reason){
  // return this.http.post(this.BASE_APi+pId)
  // }
}
