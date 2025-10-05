import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileS {
  http = inject(HttpClient);
  getName() { 
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem("jwt")}`
    );
    return this.http.get<any>("http://localhost:8080/api/profile",{headers})
  }
}
