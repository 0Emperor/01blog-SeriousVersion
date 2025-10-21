import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../dto/dto';

@Injectable({
  providedIn: 'root'
})
export class ExploreSrvs {
  http = inject(HttpClient)
  readonly API = "http://localhost:8080/api/users/all";
  getAll() {
    return this.http.get<User[]>(this.API)
  }
}
