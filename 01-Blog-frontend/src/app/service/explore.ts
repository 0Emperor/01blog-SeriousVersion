import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { inject, Injectable } from '@angular/core';
import { User } from '../dto/dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExploreSrvs {
  http = inject(HttpClient)
  readonly API = "http://localhost:8080/api/users/all";

  getAll(page: number = 0, size: number = 20, query?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<any>(this.API, { params });
  }
}
